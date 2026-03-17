'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, CheckSquare, Upload, Activity, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/formatters';

interface AuditEntry {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ pending: 0, total: 0, published: 0 });
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('cyfer_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const [docsRes, publishedRes, auditRes, pendingRes] = await Promise.all([
          fetch('/api/documents?limit=1', { headers }),
          fetch('/api/documents?status=published&limit=1', { headers }),
          fetch('/api/audit?limit=10'),
          fetch('/api/consensus?status=pending', { headers }),
        ]);
        const docsJson = await docsRes.json();
        const publishedJson = await publishedRes.json();
        const auditJson = await auditRes.json();
        const pendingJson = await pendingRes.json();
        setStats({
          total: docsJson.data?.total ?? 0,
          published: publishedJson.data?.total ?? 0,
          pending: Array.isArray(pendingJson.data) ? pendingJson.data.length : 0,
        });
        const entries = auditJson.data?.transactions ?? auditJson.data ?? [];
        setRecentActivity(Array.isArray(entries) ? entries : []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center"><CheckSquare size={20} className="text-warning" /></div>
            <div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted">Pending Approvals</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center"><FileText size={20} className="text-info" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted">Total Documents</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center"><FileText size={20} className="text-success" /></div>
            <div><p className="text-2xl font-bold">{stats.published}</p><p className="text-sm text-muted">Published</p></div>
          </div>
        </Card>
      </div>
      <div className="flex gap-3 mb-8">
        <Link href="/admin/upload"><Button><Upload size={16} /> Upload Document</Button></Link>
        <Link href="/admin/approvals"><Button variant="outline"><CheckSquare size={16} /> View Approvals</Button></Link>
      </div>
      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18} /> Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <Badge variant={entry.action_type === 'approve' ? 'success' : entry.action_type === 'reject' ? 'error' : 'info'}>{entry.action_type}</Badge>
                  <span className="text-sm">{entry.description}</span>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">{formatDateTime(entry.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
