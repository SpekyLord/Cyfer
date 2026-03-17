'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatDate, formatHash } from '@/utils/formatters';

interface DocumentData {
  id: string;
  title: string;
  category: string;
  status: string;
  file_hash: string;
  created_at: string;
}

const statusVariant: Record<string, 'warning' | 'success' | 'error'> = {
  pending_approval: 'warning',
  published: 'success',
  rejected: 'error',
};

export default function ManageDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cyfer_token');
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/documents?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setDocuments(json.data.documents ?? []);
    } catch (err) { console.error('Failed to fetch documents:', err); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FileText className="text-accent" /> Manage Documents
      </h1>
      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer">
          <option value="">All Statuses</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>
      ) : documents.length === 0 ? (
        <Card className="text-center py-12"><p className="text-muted">No documents found.</p></Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell><Link href={`/documents/${doc.id}`} className="font-medium text-info hover:underline">{doc.title}</Link></TableCell>
                <TableCell><Badge variant="accent">{doc.category}</Badge></TableCell>
                <TableCell><Badge variant={statusVariant[doc.status] ?? 'default'}>{doc.status.replace('_', ' ')}</Badge></TableCell>
                <TableCell><span className="font-mono text-xs">{formatHash(doc.file_hash)}</span></TableCell>
                <TableCell className="text-sm text-muted">{formatDate(doc.created_at)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
