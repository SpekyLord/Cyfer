'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, User, Shield, CheckCircle, XCircle, Clock, Sparkles, Loader2, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime, formatFileSize, formatHash } from '@/utils/formatters';
import { DOCUMENT_CATEGORIES } from '@/utils/constants';

interface Approval {
  id: string;
  status: string;
  message: string | null;
  responded_at: string | null;
  users: { name: string; department: string; role: string } | null;
}

interface DocumentData {
  id: string;
  title: string;
  category: string;
  description: string;
  file_name: string;
  file_size: number;
  file_url: string;
  file_hash: string;
  status: string;
  created_at: string;
  published_at: string | null;
  users?: { name: string; department: string } | null;
}

interface Summary {
  summary: string;
  keyPoints: string[];
  affectedParties: string;
  budgetImplications: string;
  tldr: string;
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await fetch(`/api/documents/${id}`);
        const json = await res.json();
        if (json.success) {
          setDocument(json.data.document);
          setApprovals(json.data.approvals ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch document:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocument();
  }, [id]);

  async function handleSummarize() {
    setSummaryLoading(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: id }),
      });
      const json = await res.json();
      if (json.success) {
        setSummary(json.data);
      }
    } catch (err) {
      console.error('Failed to summarize:', err);
    } finally {
      setSummaryLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-muted text-lg">Document not found.</p>
        <Link href="/documents" className="text-accent hover:underline mt-2 inline-block">Back to Documents</Link>
      </div>
    );
  }

  const categoryLabel = DOCUMENT_CATEGORIES.find(c => c.value === document.category)?.label ?? document.category;
  const statusVariant = document.status === 'published' ? 'success' : document.status === 'rejected' ? 'error' : 'warning';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/documents" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to Documents
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={statusVariant}>{document.status.replace('_', ' ')}</Badge>
          <Badge variant="accent">{categoryLabel}</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{document.title}</h1>
        <p className="text-muted mt-2">{document.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Info */}
          <Card>
            <h2 className="font-semibold mb-4 flex items-center gap-2"><FileText size={18} /> File Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">File Name</span><span className="font-medium">{document.file_name}</span></div>
              <div className="flex justify-between"><span className="text-muted">File Size</span><span>{formatFileSize(document.file_size)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Uploaded</span><span>{formatDateTime(document.created_at)}</span></div>
              {document.published_at && <div className="flex justify-between"><span className="text-muted">Published</span><span>{formatDateTime(document.published_at)}</span></div>}
              {document.users && <div className="flex justify-between"><span className="text-muted">Uploaded By</span><span>{document.users.name} — {document.users.department}</span></div>}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted mb-1">SHA-256 Hash</p>
              <p className="text-xs font-mono break-all text-foreground">{document.file_hash}</p>
            </div>
            {document.file_url && (
              <a href={document.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                <Button variant="outline" size="sm"><Download size={14} /> Download Original</Button>
              </a>
            )}
          </Card>

          {/* AI Summary */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2"><Sparkles size={18} className="text-accent" /> AI Summary</h2>
              {!summary && (
                <Button variant="secondary" size="sm" onClick={handleSummarize} disabled={summaryLoading}>
                  {summaryLoading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : 'Generate Summary'}
                </Button>
              )}
            </div>
            {summary ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">TLDR</p>
                  <p className="text-sm text-muted mt-1">{summary.tldr}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Key Points</p>
                  <ul className="space-y-1">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm text-muted flex gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" />{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Affected Parties</p>
                  <p className="text-sm text-muted mt-1">{summary.affectedParties}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Budget Implications</p>
                  <p className="text-sm text-muted mt-1">{summary.budgetImplications}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Click &quot;Generate Summary&quot; to get an AI-powered plain-language breakdown of this document.</p>
            )}
          </Card>
        </div>

        {/* Sidebar — Approval Chain */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield size={18} /> Approval Chain</h2>
            {approvals.length === 0 ? (
              <p className="text-sm text-muted">No approvals recorded.</p>
            ) : (
              <div className="space-y-3">
                {approvals.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    {a.status === 'approved' ? <CheckCircle size={16} className="text-success mt-0.5" />
                      : a.status === 'rejected' ? <XCircle size={16} className="text-error mt-0.5" />
                      : <Clock size={16} className="text-warning mt-0.5" />}
                    <div className="text-sm">
                      <p className="font-medium">{a.users?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted">{a.users?.department}</p>
                      <Badge variant={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'error' : 'warning'} className="mt-1">
                        {a.status}
                      </Badge>
                      {a.message && <p className="text-xs text-muted mt-1">&quot;{a.message}&quot;</p>}
                      {a.responded_at && <p className="text-xs text-muted mt-1">{formatDate(a.responded_at)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle size={18} className="text-success" /> Verification</h2>
            <p className="text-sm text-muted mb-3">Verify this document is authentic by uploading your copy.</p>
            <Link href="/verify">
              <Button variant="outline" size="sm" className="w-full">Verify a Copy</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
