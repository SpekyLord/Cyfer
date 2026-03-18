'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScrollText, Filter, Loader2, Lock, CheckCircle, XCircle, Database } from 'lucide-react';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { Card } from '@/components/ui/Card';
import { ACTION_TYPES } from '@/utils/constants';

interface Transaction {
  id: string;
  action_type: string;
  description: string;
  document_id: string | null;
  performed_by: string;
  tx_hash: string;
  previous_tx_hash: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export default function AuditPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const limit = 20;

  const fetchAudit = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (actionType) params.set('action_type', actionType);

      const res = await fetch(`/api/audit?${params}`);
      const json = await res.json();
      if (json.success) {
        const txns = json.data.transactions ?? json.data;
        setTransactions(txns);
        setTotal(json.data.total ?? txns.length ?? 0);

        // Validate the hash chain on current page
        if (txns.length > 1) {
          // Transactions are newest-first, so reverse for chain validation
          const sorted = [...txns].reverse();
          let valid = true;
          for (let i = 1; i < sorted.length; i++) {
            if (sorted[i].previous_tx_hash && sorted[i].previous_tx_hash !== sorted[i - 1].tx_hash) {
              valid = false;
              break;
            }
          }
          setChainValid(valid);
        } else {
          setChainValid(txns.length > 0 ? true : null);
        }
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
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 text-sm text-primary mb-4">
          <Lock size={14} />
          Hash-Linked Transaction Chain
        </div>
        <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
        <p className="text-muted mt-2 max-w-xl mx-auto">
          Every platform action is permanently recorded with a cryptographic hash linked to the previous entry —
          creating a tamper-proof chain of accountability.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <div className="p-4 text-center">
            <Database size={20} className="mx-auto text-accent mb-1.5" />
            <div className="text-2xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted">Total Entries</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            {chainValid === null ? (
              <Loader2 size={20} className="mx-auto text-muted mb-1.5 animate-spin" />
            ) : chainValid ? (
              <CheckCircle size={20} className="mx-auto text-success mb-1.5" />
            ) : (
              <XCircle size={20} className="mx-auto text-error mb-1.5" />
            )}
            <div className={`text-2xl font-bold ${chainValid ? 'text-success' : chainValid === false ? 'text-error' : 'text-muted'}`}>
              {chainValid === null ? '...' : chainValid ? 'Valid' : 'Broken'}
            </div>
            <div className="text-xs text-muted">Chain Integrity</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <ScrollText size={20} className="mx-auto text-info mb-1.5" />
            <div className="text-sm font-mono font-bold text-foreground truncate">
              {transactions.length > 0 ? transactions[0].tx_hash.slice(0, 10) + '...' : '---'}
            </div>
            <div className="text-xs text-muted">Latest Hash</div>
          </div>
        </Card>
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

      {/* How the Audit Chain Works */}
      <Card className="mt-10">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Lock size={18} className="text-accent" />
            How the Audit Chain Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-accent/5 border-accent/20">
              <div className="text-accent font-bold text-lg mb-1">1. Record</div>
              <p className="text-sm text-muted">Every action — upload, approval, rejection, verification, budget change — is logged as a transaction entry.</p>
            </div>
            <div className="p-4 rounded-xl border bg-info/5 border-info/20">
              <div className="text-info font-bold text-lg mb-1">2. Hash</div>
              <p className="text-sm text-muted">Each entry is hashed using SHA-256. The hash includes the previous entry&apos;s hash, creating a cryptographic chain.</p>
            </div>
            <div className="p-4 rounded-xl border bg-success/5 border-success/20">
              <div className="text-success font-bold text-lg mb-1">3. Immutable</div>
              <p className="text-sm text-muted">Altering any past entry breaks the hash chain — making unauthorized changes instantly detectable by anyone.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
