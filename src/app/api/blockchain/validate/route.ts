// Blockchain Validation API
// GET /api/blockchain/validate — Validate entire chain integrity

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Blockchain } from '@/lib/blockchain';
import type { ApiResponse, ChainValidationResult } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch all blocks for display
    const { data: blocks, error } = await supabase
      .from('blockchain')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch blockchain: ${error.message}` } as ApiResponse,
        { status: 500 }
      );
    }

    // Run full chain validation
    const validation: ChainValidationResult = await Blockchain.validateChain();

    return NextResponse.json({
      success: true,
      data: {
        valid: validation.valid,
        errors: validation.errors,
        totalBlocks: blocks?.length ?? 0,
        blocks: blocks ?? [],
      },
    } as ApiResponse);
  } catch (error) {
    console.error('GET /api/blockchain/validate error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
