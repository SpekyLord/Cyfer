// Budget Data API
// GET /api/budget — Get budget data for dashboard (public)
// POST /api/budget — Add/update budget entries (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { authenticateAdmin } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit';
import { ActionType } from '@/lib/types';
import type { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const fiscalYear = searchParams.get('fiscal_year');
    const summary = searchParams.get('summary') === 'true';

    let query = supabase
      .from('budget_data')
      .select('*')
      .order('category', { ascending: true });

    if (fiscalYear) {
      query = query.eq('fiscal_year', parseInt(fiscalYear, 10));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch budget data: ${error.message}` } as ApiResponse,
        { status: 500 }
      );
    }

    // If summary requested, compute aggregates
    if (summary && data) {
      const totalBudget = data.reduce((sum, item) => sum + Number(item.allocated_amount), 0);
      const byCategory: Record<string, { category: string; amount: number; percentage: number }> = {};

      for (const item of data) {
        const key = item.category as string;
        if (!byCategory[key]) {
          byCategory[key] = { category: key, amount: 0, percentage: 0 };
        }
        byCategory[key].amount += Number(item.allocated_amount);
      }

      // Calculate percentages
      for (const cat of Object.values(byCategory)) {
        cat.percentage = totalBudget > 0 ? Math.round((cat.amount / totalBudget) * 10000) / 100 : 0;
      }

      return NextResponse.json({
        success: true,
        data: {
          totalBudget,
          categories: Object.values(byCategory),
          fiscalYear: fiscalYear ?? new Date().getFullYear(),
          entries: data,
        },
      } as ApiResponse);
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    } as ApiResponse);
  } catch (error) {
    console.error('GET /api/budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Only admins can manage budget data.' } as ApiResponse,
        { status: 401 }
      );
    }

    const supabase = createServerClient();
    const body = await request.json();

    const { fiscal_year, category, allocated_amount, description } = body;

    // Validate required fields
    if (!fiscal_year || !category || allocated_amount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fiscal_year, category, allocated_amount' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if an entry already exists for this fiscal year + category
    const { data: existing } = await supabase
      .from('budget_data')
      .select('id')
      .eq('fiscal_year', fiscal_year)
      .eq('category', category)
      .single();

    let result;

    if (existing) {
      // Update existing entry
      const { data, error } = await supabase
        .from('budget_data')
        .update({
          allocated_amount,
          description: description ?? '',
          uploaded_by: admin.id,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to update budget entry: ${error.message}` } as ApiResponse,
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('budget_data')
        .insert({
          fiscal_year,
          category,
          allocated_amount,
          description: description ?? '',
          uploaded_by: admin.id,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: `Failed to create budget entry: ${error.message}` } as ApiResponse,
          { status: 500 }
        );
      }
      result = data;
    }

    // Log to audit trail
    await logAuditAction({
      actionType: ActionType.UPLOAD,
      description: `Budget entry for ${category} (FY ${fiscal_year}) ${existing ? 'updated' : 'created'} by ${admin.name}`,
      performedBy: admin.id,
      metadata: { fiscal_year, category, allocated_amount },
    });

    return NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error('POST /api/budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
