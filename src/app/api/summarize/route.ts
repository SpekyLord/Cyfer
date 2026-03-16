// AI Document Summarization API
// POST /api/summarize - Generate AI summary for a document

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { summarizeDocument, isAIServiceAvailable } from '@/lib/ai';
import type { ApiResponse, DocumentSummary } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if AI service is available
    if (!isAIServiceAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI summarization service is not configured. Please contact the administrator.',
        } as ApiResponse,
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { document_id } = body;

    if (!document_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'document_id is required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch the document from the database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Check if document is published
    if (document.status !== 'published') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only published documents can be summarized',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Fetch the document filetext from Supabase Storage
    // Note: For now, we'll use the document metadata for summarization
    // In a full implementation, you'd fetch and parse the actual file content
    const documentText = `
Title: ${document.title}
Category: ${document.category}
Description: ${document.description}
File Name: ${document.file_name}
Upload Date: ${document.created_at}
Published Date: ${document.published_at}

[Note: Full document text extraction from PDF/DOCX files would be implemented here in production]
    `.trim();

    // TODO: In production, implement actual file content extraction:
    // 1. Download file from Supabase Storage using document.file_url
    // 2. Parse PDF/DOCX/TXT content (use pdf-parse, mammoth, etc.)
    // 3. Extract clean text for summarization

    // Generate AI summary
    const summary: DocumentSummary = await summarizeDocument(documentText);

    return NextResponse.json(
      {
        success: true,
        data: summary,
      } as ApiResponse<DocumentSummary>,
      { status: 200 }
    );
  } catch (error) {
    console.error('AI summarization error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight (if needed)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
