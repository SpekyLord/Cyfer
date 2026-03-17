'use client';

interface BudgetCategory {
  category: string;
  amount: number;
  percentage: number;
}

const COLORS = ['#1a2332', '#d4a843', '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

export function BudgetChart({ categories }: { categories: BudgetCategory[] }) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-3">
      {categories.map((cat, i) => {
        const pct = total > 0 ? (cat.amount / total) * 100 : 0;
        return (
          <div key={cat.category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-foreground">{cat.category}</span>
              <span className="text-muted">{pct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full"
                style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
