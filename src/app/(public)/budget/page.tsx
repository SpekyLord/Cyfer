'use client';

import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BudgetChart } from '@/components/budget/BudgetChart';
import { BudgetTable } from '@/components/budget/BudgetTable';

interface BudgetCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface BudgetSummary {
  totalBudget: number;
  categories: BudgetCategory[];
  fiscalYear: number;
}

export default function BudgetPage() {
  const [data, setData] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch('/api/budget?summary=true');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch budget:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBudget();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="text-accent" /> Budget Transparency Dashboard
        </h1>
        <p className="text-muted mt-1">View municipal budget allocations by sector for the current fiscal year.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted" />
        </div>
      ) : !data || data.categories.length === 0 ? (
        <div className="text-center py-16">
          <DollarSign size={48} className="mx-auto mb-3 text-muted/40" />
          <p className="text-muted text-lg">No budget data available.</p>
          <p className="text-sm text-muted/60 mt-1">Budget entries will appear here once added by administrators.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <p className="text-sm text-muted">Total Budget</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(data.totalBudget)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Fiscal Year</p>
              <p className="text-2xl font-bold text-foreground mt-1">{data.fiscalYear}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Budget Categories</p>
              <p className="text-2xl font-bold text-foreground mt-1">{data.categories.length}</p>
            </Card>
          </div>

          {/* Charts & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h2 className="font-semibold mb-4">Budget Allocation</h2>
              <BudgetChart categories={data.categories} />
            </Card>
            <Card>
              <h2 className="font-semibold mb-4">Category Breakdown</h2>
              <BudgetTable categories={data.categories} total={data.totalBudget} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
