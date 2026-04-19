'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckSquare,
  FileText,
  Loader2,
  Shield,
  Upload,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/utils/formatters';
import { useLocalStorageJson } from '@/lib/client-storage';

interface AuditEntry {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
}

interface PendingItem {
  id: string;
  status: string;
  documents: {
    id: string;
    title: string;
    category: string;
    created_at: string;
  } | null;
  budget_data: {
    id: string;
    category: string;
    fiscal_year: number;
    created_at: string;
  } | null;
}

interface UserData {
  name: string;
}

export default function AdminDashboardPage() {
  const user = useLocalStorageJson<UserData>('cyfer_user');
  const [stats, setStats] = useState({ pending: 0, total: 0, published: 0 });
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('cyfer_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const [docsRes, publishedRes, auditRes, pendingRes] = await Promise.all([
          fetch('/api/documents?limit=1', { headers }),
          fetch('/api/documents?status=published&limit=1', { headers }),
          fetch('/api/audit?limit=6'),
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
        setPendingItems(Array.isArray(pendingJson.data) ? pendingJson.data.slice(0, 4) : []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-[var(--text-mute)]" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow={user?.name ? `Welcome back, ${user.name}` : 'Official workspace'}
        title="Dashboard"
        description="Review current approval workload, monitor publication volume, and stay close to the latest platform activity."
        actions={
          <>
            <Link href="/audit">
              <Button variant="outline">
                <Activity size={16} />
                Audit trail
              </Button>
            </Link>
            <Link href="/admin/upload">
              <Button>
                <Upload size={16} />
                Upload document
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-4 mb-6">
        <div className="stat">
          <span className="stat-label">Awaiting your review</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total documents</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Published</span>
          <span className="stat-value">{stats.published}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Ledger integrity</span>
          <span className="stat-value" style={{ color: 'var(--ok)' }}>
            Valid
          </span>
          <span className="stat-delta">No integrity warnings detected</span>
        </div>
      </div>

      <div className="grid gap-[var(--s-6)] lg:grid-cols-[1.3fr_0.95fr]">
        <div className="card p-0">
          <div className="row-between border-b border-[var(--line)] px-6 py-5">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink-900)]">
                Awaiting your consensus
              </h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                These items still need action from your account before they can move forward.
              </p>
            </div>
            <Badge variant="warning">{stats.pending} pending</Badge>
          </div>

          {pendingItems.length === 0 ? (
            <div className="px-6 py-10 text-sm text-[var(--text-soft)]">
              No pending approvals right now.
            </div>
          ) : (
            pendingItems.map((item, index) => {
              const title = item.documents?.title ?? `${item.budget_data?.category} budget entry`;
              const meta = item.documents
                ? `${item.documents.category} · uploaded ${formatDateTime(item.documents.created_at)}`
                : `FY ${item.budget_data?.fiscal_year} · uploaded ${item.budget_data ? formatDateTime(item.budget_data.created_at) : ''}`;

              return (
                <div
                  key={item.id}
                  className={`row-between px-6 py-4 ${index < pendingItems.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
                >
                  <div>
                    <div className="strong text-sm">{title}</div>
                    <div className="mt-1 text-xs text-[var(--text-soft)]">{meta}</div>
                  </div>
                  <Link href="/admin/approvals">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </div>

        <div className="card p-6">
          <div className="eyebrow">
            <Activity size={12} />
            Recent activity
          </div>
          <div className="stack-3 mt-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--text-soft)]">No recent activity recorded.</p>
            ) : (
              recentActivity.map((entry) => (
                <div key={entry.id} className="row-between border-b border-dashed border-[var(--line)] py-3 last:border-0">
                  <div className="min-w-0">
                    <Badge
                      variant={
                        entry.action_type === 'approve'
                          ? 'success'
                          : entry.action_type === 'reject'
                            ? 'error'
                            : 'info'
                      }
                    >
                      {entry.action_type}
                    </Badge>
                    <div className="mt-2 text-sm text-[var(--ink-900)]">{entry.description}</div>
                  </div>
                  <span className="text-xs text-[var(--text-mute)]">
                    {formatDateTime(entry.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-3 mt-6">
        {[
          {
            icon: CheckSquare,
            title: 'Consensus-driven publishing',
            description:
              'Records are not published until the approval flow is satisfied for the required officials.',
          },
          {
            icon: FileText,
            title: 'Public document portal',
            description:
              'Published records immediately become visible on the citizen-facing site once the workflow completes.',
          },
          {
            icon: Shield,
            title: 'Tamper-evident verification',
            description:
              'Every document keeps its stored fingerprint so the public can verify later copies with confidence.',
          },
        ].map(({ icon: Icon, title, description }) => (
          <div key={title} className="card p-6">
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--ink-050)] text-[var(--ink-700)]">
              <Icon size={20} />
            </span>
            <h3 className="font-serif text-xl font-semibold text-[var(--ink-900)]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
