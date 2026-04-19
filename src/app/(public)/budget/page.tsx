'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Database, Loader2, Wallet } from 'lucide-react';
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
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBudget();
  }, []);

  const formatPhp = (value: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main id="main" className="container-page pb-[var(--s-11)]">
      <div className="page-head">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          This year · Your city
        </div>
        <h1>Where your taxes went this year</h1>
        <p className="lead">
          Explore the current fiscal breakdown using published CYFER budget data.
          Every number here comes from entries tracked through the same approval and
          transparency flow as the rest of the platform.
        </p>
      </div>

      {loading ? (
        <section className="section">
          <div className="flex items-center justify-center py-20">
            <Loader2 size={36} className="animate-spin text-[var(--text-mute)]" />
          </div>
        </section>
      ) : !data || data.categories.length === 0 ? (
        <section className="section">
          <div className="card p-10 text-center">
            <div className="font-serif text-2xl font-semibold text-[var(--ink-900)]">
              No budget data is available yet
            </div>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Published budget entries will appear here once administrators submit and
              approve them.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="section-tight">
            <div className="grid grid-4">
              <div className="stat">
                <span className="stat-label">Total budget</span>
                <span className="stat-value">{formatPhp(data.totalBudget)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Fiscal year</span>
                <span className="stat-value">{data.fiscalYear}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Categories</span>
                <span className="stat-value">{data.categories.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Data source</span>
                <span className="stat-value">CYFER</span>
                <span className="stat-delta">Published budget summary</span>
              </div>
            </div>
          </section>

          <section className="section-tight">
            <div className="grid gap-[var(--s-6)] lg:grid-cols-[1fr_1.2fr]">
              <div className="card p-6">
                <div className="row-between">
                  <div>
                    <div className="eyebrow">
                      <BarChart3 size={12} />
                      Allocation snapshot
                    </div>
                    <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink-900)]">
                      Budget overview
                    </h2>
                  </div>
                </div>
                <div className="mt-4">
                  <BudgetChart categories={data.categories} />
                </div>
              </div>

              <div className="card p-0">
                <div className="border-b border-[var(--line)] px-6 py-5">
                  <div className="eyebrow">
                    <Database size={12} />
                    Category breakdown
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink-900)]">
                    Line-item allocations
                  </h2>
                </div>
                <div className="px-6 py-5">
                  <BudgetTable categories={data.categories} total={data.totalBudget} />
                </div>
              </div>
            </div>
          </section>

          <section className="section-tight">
            <div className="grid grid-3">
              {[
                {
                  icon: Wallet,
                  title: 'Published figures only',
                  description:
                    'This public page is intended to show approved data, not hidden drafts or private revisions.',
                },
                {
                  icon: Database,
                  title: 'Built from live entries',
                  description:
                    'The summary aggregates the categories stored in the CYFER budget dataset rather than static demo content.',
                },
                {
                  icon: BarChart3,
                  title: 'Easy to compare',
                  description:
                    'Percentages and totals are displayed together so residents can quickly understand the scale of each allocation.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="card p-6">
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--ink-050)] text-[var(--ink-700)]">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[var(--ink-900)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
