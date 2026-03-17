'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency } from '@/utils/formatters';
import { BUDGET_CATEGORIES } from '@/utils/constants';

interface BudgetEntry {
  id: string;
  fiscal_year: number;
  category: string;
  allocated_amount: number;
  description: string;
}

export default function ManageBudgetPage() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchBudget(); }, []);

  async function fetchBudget() {
    setLoading(true);
    try {
      const res = await fetch('/api/budget');
      const json = await res.json();
      if (json.success) setEntries(Array.isArray(json.data) ? json.data : []);
    } catch (err) { console.error('Failed to fetch budget:', err); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      const token = localStorage.getItem('cyfer_token');
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fiscal_year: fiscalYear, category, allocated_amount: parseFloat(amount), description }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(`Budget entry for ${category} saved!`);
        setCategory(''); setAmount(''); setDescription('');
        setShowForm(false);
        fetchBudget();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) { console.error('Failed to save budget:', err); }
    finally { setFormLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="text-accent" /> Manage Budget
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Entry'}
        </Button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-success/20 rounded-lg text-sm text-success flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="font-semibold mb-4">Add Budget Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fiscal Year" type="number" value={String(fiscalYear)}
              onChange={(e) => setFiscalYear(parseInt(e.target.value))} required />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer">
                <option value="">Select category...</option>
                {BUDGET_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <Input label="Allocated Amount (PHP) *" type="number" step="0.01" placeholder="e.g. 5000000"
              value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input label="Description" placeholder="Brief description..."
              value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="md:col-span-2">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Entry'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>
      ) : entries.length === 0 ? (
        <Card className="text-center py-12"><p className="text-muted">No budget entries yet. Click &quot;Add Entry&quot; to get started.</p></Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Fiscal Year</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.category}</TableCell>
                <TableCell>{entry.fiscal_year}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(entry.allocated_amount)}</TableCell>
                <TableCell className="text-sm text-muted">{entry.description}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
