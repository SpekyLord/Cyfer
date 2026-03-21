'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle, XCircle, Loader2, FileText, Users, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { useToast } from '@/components/ui/Toast';

interface ApprovalItem {
  id: string;
  status: string;
  documents: {
    id: string;
    title: string;
    category: string;
    description: string;
    file_name: string;
    created_at: string;
    file_url: string;
  } | null;
  budget_data: {
    id: string;
    category: string;
    fiscal_year: number;
    allocated_amount: number;
    description: string;
    created_at: string;
  } | null;
}

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchApprovals(); }, []);

  async function fetchApprovals() {
    setLoading(true);
    try {
      const token = localStorage.getItem('cyfer_token');
      const res = await fetch('/api/consensus?status=pending', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setApprovals(Array.isArray(json.data) ? json.data : []);
    } catch (err) { console.error('Failed to fetch approvals:', err); }
    finally { setLoading(false); }
  }

  async function handleAction(entityId: string, action: 'approve' | 'reject') {
    const message = action === 'reject' ? prompt('Reason for rejection (optional):') ?? '' : '';
    setActionLoading(entityId);
    try {
      const token = localStorage.getItem('cyfer_token');
      const res = await fetch(`/api/consensus/${entityId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (json.success) {
        setApprovals(prev => prev.filter(a => {
          const id = a.documents?.id ?? a.budget_data?.id;
          return id !== entityId;
        }));
        toast(
          action === 'approve' ? 'success' : 'info',
          action === 'approve' ? 'Approved successfully!' : 'Rejected.'
        );
      } else {
        toast('error', json.error ?? `Failed to ${action}`);
      }
    } catch (err) {
      console.error(`Failed to ${action}:`, err);
      toast('error', `Network error. Failed to ${action}.`);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <CheckSquare className="text-accent" /> Pending Approvals
      </h1>
      {approvals.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success/60" />
          </div>
          <p className="text-lg font-medium text-foreground mb-1">All caught up!</p>
          <p className="text-muted text-sm">No pending approvals at this time.</p>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="warning">{approvals.length}</Badge>
            <span className="text-sm text-muted">item{approvals.length !== 1 ? 's' : ''} awaiting your approval</span>
          </div>
          <div className="space-y-4">
            {approvals.map((approval, index) => {
              const doc = approval.documents;
              const budget = approval.budget_data;
              const entityId = doc?.id ?? budget?.id;
              if (!entityId) return null;
              const isActioning = actionLoading === entityId;
              const isBudget = !!budget;

              return (
                <Card key={approval.id} className={`animate-fade-in stagger-${Math.min(index + 1, 6)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isBudget ? (
                          <Badge variant="info">Budget</Badge>
                        ) : (
                          <Badge variant="accent">{doc!.category}</Badge>
                        )}
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      {isBudget ? (
                        <>
                          <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                            <DollarSign size={16} className="text-accent" />
                            {budget!.category} — FY {budget!.fiscal_year}
                          </h3>
                          <p className="text-sm text-muted mb-2">
                            Amount: <span className="font-semibold text-foreground">₱{Number(budget!.allocated_amount).toLocaleString()}</span>
                          </p>
                          {budget!.description && <p className="text-sm text-muted mb-2">{budget!.description}</p>}
                          <div className="text-xs text-muted">{formatDate(budget!.created_at)}</div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-foreground mb-1">{doc!.title}</h3>
                          <p className="text-sm text-muted mb-2">{doc!.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <span className="flex items-center gap-1"><FileText size={12} />{doc!.file_name}</span>
                            <span>{formatDate(doc!.created_at)}</span>
                          </div>
                          {doc!.file_url && (
                            <a href={doc!.file_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-info hover:underline mt-2 inline-block">View File</a>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="primary" size="sm" disabled={isActioning} onClick={() => handleAction(entityId, 'approve')}>
                        {isActioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                      </Button>
                      <Button variant="danger" size="sm" disabled={isActioning} onClick={() => handleAction(entityId, 'reject')}>
                        <XCircle size={14} /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <Card className="mt-6 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Users size={16} className="text-accent" />
              <span>All officials must approve for documents and budget entries to be published (Unanimous Consensus Protocol).</span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
