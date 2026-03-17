'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, FileText, Shield, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatHash, formatDate } from '@/utils/formatters';

interface VerificationData {
  verified: boolean;
  fileHash: string;
  document?: {
    id: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
    file_hash: string;
  } | null;
  message: string;
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleVerify() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/verify', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        setResult({ verified: false, fileHash: '', message: json.error ?? 'Verification failed' });
      }
    } catch {
      setResult({ verified: false, fileHash: '', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) { setFile(droppedFile); setResult(null); }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Document Verification</h1>
        <p className="text-muted mt-2">Upload any government document to verify its authenticity against the blockchain.</p>
      </div>

      <Card className="mb-6">
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
            ${dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={40} className="mx-auto mb-3 text-muted" />
          <p className="text-sm font-medium text-foreground">
            {file ? file.name : 'Drop a file here or click to browse'}
          </p>
          <p className="text-xs text-muted mt-1">PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG — Max 50MB</p>
          <input ref={inputRef} type="file" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setResult(null); } }} />
        </div>
        {file && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-muted" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <><Shield size={16} /> Verify</>}
            </Button>
          </div>
        )}
      </Card>

      {result && (
        <div className={`animate-fade-in ${result.verified ? '' : 'animate-shake'}`}>
          <Card className={`border-2 ${result.verified ? 'border-success bg-green-50' : 'border-error bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.verified ? (
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-success" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
                  <XCircle size={28} className="text-error" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">{result.verified ? 'Document Verified' : 'Verification Failed'}</h2>
                <p className="text-sm text-muted">{result.message}</p>
              </div>
            </div>
            {result.fileHash && (
              <div className="p-3 bg-white/80 rounded-lg mb-3">
                <p className="text-xs text-muted mb-1">File SHA-256 Hash</p>
                <p className="text-xs font-mono break-all">{result.fileHash}</p>
              </div>
            )}
            {result.verified && result.document && (
              <div className="p-3 bg-white/80 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Document</span><span className="font-medium">{result.document.title}</span></div>
                <div className="flex justify-between"><span className="text-muted">Category</span><Badge variant="accent">{result.document.category}</Badge></div>
                <div className="flex justify-between"><span className="text-muted">Published</span><span>{formatDate(result.document.created_at)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Stored Hash</span><span className="font-mono text-xs">{formatHash(result.document.file_hash)}</span></div>
              </div>
            )}
          </Card>
        </div>
      )}

      <Card className="mt-8">
        <h3 className="font-semibold mb-3">How Verification Works</h3>
        <div className="space-y-3 text-sm text-muted">
          <div className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span><span>Your file is hashed using SHA-256 — a cryptographic fingerprint.</span></div>
          <div className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span><span>The hash is compared against all document hashes stored on our blockchain.</span></div>
          <div className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span><span>If a match is found, the document is verified as authentic. Any modification produces a different hash.</span></div>
        </div>
      </Card>
    </div>
  );
}
