// UCP Approval API
// POST /api/consensus/[documentId]/approve — Approve a document

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Blockchain } from '@/lib/blockchain';
import { logAuditAction } from '@/lib/audit';
import { authenticateAdmin } from '@/lib/auth';
import { ActionType } from '@/lib/types';
import type { ApiResponse } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' } as ApiResponse,
        { status: 401 }
      );
    }

    const { documentId } = await params;
    const supabase = createServerClient();

    // Parse optional message
    let message = '';
    try {
      const body = await request.json();
      message = body.message ?? '';
    } catch {
      // No body is fine
    }

    // Verify the document exists and is pending
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (document.status !== 'pending_approval') {
      return NextResponse.json(
        { success: false, error: `Document is already ${document.status}` } as ApiResponse,
        { status: 400 }
      );
    }

    // Find the approval record for this admin
    const { data: approval, error: approvalError } = await supabase
      .from('approvals')
      .select('*')
      .eq('document_id', documentId)
      .eq('admin_id', admin.id)
      .single();

    if (approvalError || !approval) {
      return NextResponse.json(
        { success: false, error: 'No approval request found for this admin' } as ApiResponse,
        { status: 404 }
      );
    }

    if (approval.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `You have already ${approval.status} this document` } as ApiResponse,
        { status: 400 }
      );
    }

    // Update the approval record
    const { error: updateError } = await supabase
      .from('approvals')
      .update({
        status: 'approved',
        message,
        responded_at: new Date().toISOString(),
      })
      .eq('id', approval.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: `Failed to update approval: ${updateError.message}` } as ApiResponse,
        { status: 500 }
      );
    }

    // Log approval to audit trail
    await logAuditAction({
      actionType: ActionType.APPROVE,
      description: `${admin.name} approved document "${document.title}"`,
      documentId,
      performedBy: admin.id,
      metadata: { message },
    });

    // Add block to blockchain
    await Blockchain.addBlock({
      action: 'document_approved',
      document_id: documentId,
      approved_by: admin.id,
      approved_by_name: admin.name,
      message,
    });

    // Check if ALL admins have now approved (Unanimous Consensus)
    const { data: allApprovals } = await supabase
      .from('approvals')
      .select('status')
      .eq('document_id', documentId);

    const allApproved = allApprovals?.every((a) => a.status === 'approved');

    if (allApproved && allApprovals && allApprovals.length > 0) {
      // Unanimous approval — publish the document
      const { error: publishError } = await supabase
        .from('documents')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (!publishError) {
        // Log publish action
        await logAuditAction({
          actionType: ActionType.PUBLISH,
          description: `Document "${document.title}" published after unanimous approval`,
          documentId,
          performedBy: 'system',
          metadata: { total_approvals: allApprovals.length },
        });

        // Add publish block to blockchain
        await Blockchain.addBlock({
          action: 'document_published',
          document_id: documentId,
          file_hash: document.file_hash,
          title: document.title,
          total_approvals: allApprovals.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        approved: true,
        documentPublished: allApproved,
        message: allApproved
          ? 'Document approved and published (unanimous consensus reached)'
          : 'Document approved. Waiting for other officials.',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('POST /api/consensus/[documentId]/approve error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
