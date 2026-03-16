// UCP Rejection API
// POST /api/consensus/[documentId]/reject — Reject a document

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

    // Parse rejection reason
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
        status: 'rejected',
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

    // Reject the document — any single rejection means the document is rejected
    const { error: rejectError } = await supabase
      .from('documents')
      .update({ status: 'rejected' })
      .eq('id', documentId);

    if (rejectError) {
      return NextResponse.json(
        { success: false, error: `Failed to reject document: ${rejectError.message}` } as ApiResponse,
        { status: 500 }
      );
    }

    // Log rejection to audit trail
    await logAuditAction({
      actionType: ActionType.REJECT,
      description: `${admin.name} rejected document "${document.title}"${message ? `: ${message}` : ''}`,
      documentId,
      performedBy: admin.id,
      metadata: { message },
    });

    // Add block to blockchain
    await Blockchain.addBlock({
      action: 'document_rejected',
      document_id: documentId,
      rejected_by: admin.id,
      rejected_by_name: admin.name,
      reason: message,
    });

    return NextResponse.json({
      success: true,
      data: {
        rejected: true,
        message: 'Document has been rejected.',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('POST /api/consensus/[documentId]/reject error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
