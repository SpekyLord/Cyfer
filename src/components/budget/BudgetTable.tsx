import { formatCurrency } from '@/utils/formatters';

interface BudgetCategory {
  category: string;
  amount: number;
  percentage: number;
}

export function BudgetTable({ categories, total }: { categories: BudgetCategory[]; total: number }) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.category} className="flex items-center justify-between py-2 border-b border-border last:border-0">
          <span className="text-sm font-medium text-foreground">{cat.category}</span>
          <div className="text-right">
            <p className="text-sm font-semibold">{formatCurrency(cat.amount)}</p>
            <p className="text-xs text-muted">{cat.percentage.toFixed(1)}%</p>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3 border-t-2 border-foreground">
        <span className="text-sm font-bold">Total</span>
        <span className="text-sm font-bold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
