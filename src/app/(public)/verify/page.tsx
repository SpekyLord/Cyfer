'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, FileText, Shield, Loader2, AlertTriangle, Lock } from 'lucide-react';
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

  function handleReset() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 text-sm text-primary mb-4">
          <Lock size={14} />
          SHA-256 Blockchain Verification
        </div>
        <h1 className="text-3xl font-bold text-foreground">Document Verification</h1>
        <p className="text-muted mt-2 max-w-xl mx-auto">
          Upload any government document to verify its authenticity against the blockchain.
          Even a single byte change will produce a completely different hash.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
            ${dragActive ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-border hover:border-accent/50 hover:bg-gray-50'}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={40} className={`mx-auto mb-3 transition-colors ${dragActive ? 'text-accent' : 'text-muted'}`} />
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
            <div className="flex gap-2">
              {result && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Try Another
                </Button>
              )}
              <Button onClick={handleVerify} disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <><Shield size={16} /> Verify</>}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Verification Result */}
      {result && (
        <div className={`animate-fade-in ${result.verified ? '' : 'animate-shake'}`}>
          <Card className={`border-2 ${result.verified ? 'border-success bg-green-50' : 'border-error bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.verified ? (
                <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-success" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-error/20 rounded-full flex items-center justify-center">
                  <XCircle size={32} className="text-error" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {result.verified ? 'Document Verified' : 'Verification Failed'}
                </h2>
                <p className="text-sm text-muted">{result.message}</p>
              </div>
            </div>

            {/* Hash Display */}
            {result.fileHash && (
              <div className="p-3 bg-white/80 rounded-lg mb-3">
                <p className="text-xs text-muted mb-1 font-medium">Uploaded File SHA-256 Hash</p>
                <p className="text-xs font-mono break-all select-all">{result.fileHash}</p>
              </div>
            )}

            {/* Verified: Show matching document */}
            {result.verified && result.document && (
              <div className="p-3 bg-white/80 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Document</span>
                  <span className="font-medium">{result.document.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Category</span>
                  <Badge variant="accent">{result.document.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Published</span>
                  <span>{formatDate(result.document.created_at)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted">Stored Hash</span>
                  <span className="font-mono text-xs text-right">{formatHash(result.document.file_hash)}</span>
                </div>
                <div className="mt-2 p-2 bg-success/10 rounded-lg flex items-center gap-2 text-success text-xs font-medium">
                  <CheckCircle size={14} />
                  Hashes match — this document is authentic and unmodified.
                </div>
              </div>
            )}

            {/* Tampered: Show warning */}
            {!result.verified && result.fileHash && (
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="flex items-start gap-2 text-error text-sm">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">This document does not match any record on the blockchain.</p>
                    <p className="text-muted text-xs mt-1">
                      This could mean the document has been modified, is not an official government document,
                      or has not yet been published through CYFER.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* How It Works */}
      <Card className="mt-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-accent" /> How Verification Works
        </h3>
        <div className="space-y-4 text-sm text-muted">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="font-medium text-foreground">Upload Your Document</p>
              <p>Select any government document file you want to verify.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <p className="font-medium text-foreground">SHA-256 Hash Computed</p>
              <p>A unique cryptographic fingerprint is generated from your file. Even changing a single character produces a completely different hash.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <p className="font-medium text-foreground">Blockchain Comparison</p>
              <p>The hash is compared against all document hashes recorded on the CYFER blockchain. A match confirms authenticity.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tamper Detection Explainer */}
      <Card className="mt-6 border-accent/20 bg-accent/5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className="text-accent" /> Why Tamper Detection Matters
        </h3>
        <p className="text-sm text-muted">
          Government documents like ordinances, budgets, and contracts must remain authentic.
          SHA-256 hashing ensures that any modification — even adding a single space — produces a completely
          different hash, making tampering immediately detectable. Combined with blockchain immutability,
          CYFER provides citizens with a trustworthy verification tool.
        </p>
      </Card>
    </div>
  );
}
