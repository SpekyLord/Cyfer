'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';

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
}

export default function ApprovalsPage() {
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

  async function handleAction(documentId: string, action: 'approve' | 'reject') {
    const message = action === 'reject' ? prompt('Reason for rejection (optional):') ?? '' : '';
    setActionLoading(documentId);
    try {
      const token = localStorage.getItem('cyfer_token');
      const res = await fetch(`/api/consensus/${documentId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (json.success) setApprovals(prev => prev.filter(a => a.documents?.id !== documentId));
    } catch (err) { console.error(`Failed to ${action}:`, err); }
    finally { setActionLoading(null); }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <CheckSquare className="text-accent" /> Pending Approvals
      </h1>
      {approvals.length === 0 ? (
        <Card className="text-center py-12">
          <CheckCircle size={40} className="mx-auto mb-3 text-success/40" />
          <p className="text-muted">No pending approvals. All caught up!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => {
            const doc = approval.documents;
            if (!doc) return null;
            const isActioning = actionLoading === doc.id;
            return (
              <Card key={approval.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="accent">{doc.category}</Badge>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                    <p className="text-sm text-muted mb-2">{doc.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1"><FileText size={12} />{doc.file_name}</span>
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-info hover:underline mt-2 inline-block">View File</a>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="primary" size="sm" disabled={isActioning} onClick={() => handleAction(doc.id, 'approve')}>
                      {isActioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                    </Button>
                    <Button variant="danger" size="sm" disabled={isActioning} onClick={() => handleAction(doc.id, 'reject')}>
                      <XCircle size={14} /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
