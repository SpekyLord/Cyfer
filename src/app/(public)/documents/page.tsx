'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { Input } from '@/components/ui/Input';
import { DOCUMENT_CATEGORIES } from '@/utils/constants';

interface DocumentData {
  id: string;
  title: string;
  category: string;
  description: string;
  file_hash: string;
  status: string;
  created_at: string;
  users?: { name: string; department: string } | null;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const res = await fetch(`/api/documents?${params}`);
      const json = await res.json();
      if (json.success) {
        setDocuments(json.data.documents);
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Public Document Portal</h1>
        <p className="text-muted mt-1">Browse all published government documents verified on the blockchain.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input placeholder="Search documents..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none cursor-pointer">
            <option value="">All Categories</option>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted text-lg">No documents found.</p>
          <p className="text-sm text-muted/60 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted mb-4">{total} document{total !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (<DocumentCard key={doc.id} document={doc} />))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-card-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Previous</button>
              <span className="px-3 py-1.5 text-sm text-muted">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-card-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
