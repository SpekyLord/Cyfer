'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollText, Filter, Loader2 } from 'lucide-react';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { ACTION_TYPES } from '@/utils/constants';

interface Transaction {
  id: string;
  action_type: string;
  description: string;
  document_id: string | null;
  performed_by: string;
  tx_hash: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export default function AuditPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchAudit = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (actionType) params.set('action_type', actionType);

      const res = await fetch(`/api/audit?${params}`);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data.transactions ?? json.data);
        setTotal(json.data.total ?? json.data.length ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch audit trail:', err);
    } finally {
      setLoading(false);
    }
  }, [actionType, page]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <ScrollText className="text-accent" /> Audit Trail
        </h1>
        <p className="text-muted mt-1">Public log of all platform actions — every upload, approval, rejection, and verification is recorded.</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter size={16} className="text-muted" />
        <select
          value={actionType}
          onChange={(e) => { setActionType(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
        >
          <option value="">All Actions</option>
          {ACTION_TYPES.map((at) => (
            <option key={at.value} value={at.value}>{at.label}</option>
          ))}
        </select>
        <span className="text-sm text-muted">{total} entries</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16">
          <ScrollText size={48} className="mx-auto mb-3 text-muted/40" />
          <p className="text-muted text-lg">No audit entries found.</p>
        </div>
      ) : (
        <>
          <AuditTimeline transactions={transactions} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-card-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-muted">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-card-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
