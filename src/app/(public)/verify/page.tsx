'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Shield,
  Upload,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';

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

const faqItems = [
  {
    question: 'What happens when I upload a file?',
    answer:
      'CYFER securely computes a document fingerprint and compares it with the official records stored in the system. The result tells you whether the file matches a published record.',
  },
  {
    question: "What if the document doesn't match?",
    answer:
      'Do not rely on that copy as official. It may be altered, outdated, or never published through CYFER. You can browse the official records here to look for the correct version.',
  },
  {
    question: 'What kinds of files can I check?',
    answer:
      'PDF, Word, spreadsheet, text, and common image files are supported. Use the exact copy you received whenever possible for the most accurate result.',
  },
  {
    question: 'Why does a tiny change matter?',
    answer:
      'A file fingerprint changes completely if the document content changes, even by a single character. That is what makes tampering detectable.',
  },
];

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [announce, setAnnounce] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleVerify() {
    if (!file) {
      return;
    }

    setLoading(true);
    setResult(null);
    setShowTechnical(false);
    setAnnounce(`Checking ${file.name}`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/verify', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        setResult(json.data);
        setAnnounce(
          json.data.verified
            ? 'Verification complete. This document matches the official record.'
            : 'Verification complete. This document does not match the official record.',
        );
      } else {
        setResult({
          verified: false,
          fileHash: '',
          message: json.error ?? 'Verification failed',
        });
        setAnnounce('Verification failed.');
      }
    } catch {
      setResult({
        verified: false,
        fileHash: '',
        message: 'Network error. Please try again.',
      });
      setAnnounce('Verification failed because of a network error.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setShowTechnical(false);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setShowTechnical(false);
    setAnnounce('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <main id="main" className="container-read" style={{ paddingBottom: 'var(--s-11)' }}>
      <div className="page-head">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Free · No account required · Public verification
        </div>
        <h1>Is this document real?</h1>
        <p className="lead">
          Upload the copy you received and CYFER will compare it against the
          official city record. If it matches, you can trust it. If it does not,
          we will tell you clearly.
        </p>
      </div>

      <section className="section" aria-labelledby="verification-upload">
        <div
          className="dropzone"
          role="button"
          tabIndex={0}
          aria-labelledby="verification-upload"
          aria-describedby="verification-hint"
          data-drag={dragActive ? 'true' : 'false'}
          data-has-file={file ? 'true' : 'false'}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="dropzone-visual">
            <Upload size={28} />
          </div>
          <div className="dropzone-body">
            <div id="verification-upload" className="dropzone-title">
              {file ? file.name : 'Drop your document here'}
            </div>
            <div id="verification-hint" className="dropzone-hint">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB · Ready to verify`
                : 'Click to choose a file or drag one in. PDF, Word, spreadsheet, text, JPG, and PNG are all supported.'}
            </div>
          </div>
          {file ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                handleReset();
              }}
            >
              Pick another file
            </Button>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
            onChange={(event) => {
              const nextFile = event.target.files?.[0];

              if (nextFile) {
                setFile(nextFile);
                setResult(null);
                setShowTechnical(false);
              }
            }}
          />
        </div>

        <div className="row mt-4">
          <Button onClick={handleVerify} disabled={!file || loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Shield size={16} />
                Verify this document
              </>
            )}
          </Button>
          {file ? (
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              Reset
            </Button>
          ) : null}
        </div>

        {result ? (
          <section
            className={`verdict mt-6 ${result.verified ? 'verdict-ok' : 'verdict-bad'}`}
            aria-live="polite"
          >
            <div className="verdict-head">
              <div className="verdict-icon">
                {result.verified ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
              </div>
              <div className="verdict-meta">
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  <span
                    className="eyebrow-dot"
                    style={{
                      background: result.verified ? 'var(--ok)' : 'var(--bad)',
                    }}
                  />
                  {result.verified ? 'Match found' : 'No match found'}
                </div>
                <h2 className="verdict-display">
                  {result.verified ? "It's real." : "Something's off."}
                </h2>
                <p className="verdict-sub">{result.message}</p>
              </div>
            </div>

            <div className="verdict-body">
              {result.verified && result.document ? (
                <div className="card card-flat p-5">
                  <div className="stack-3">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="soft" style={{ fontSize: 13 }}>What this is</span>
                      <strong style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>{result.document.title}</strong>
                    </div>
                    <div className="row-between">
                      <span className="soft">Type</span>
                      <Badge variant="accent">{result.document.category}</Badge>
                    </div>
                    <div className="row-between">
                      <span className="soft">Published</span>
                      <span>{formatDate(result.document.created_at)}</span>
                    </div>
                    <div className="row-between">
                      <span className="soft">Status</span>
                      <Badge variant="success">{result.document.status}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card card-flat border-[var(--bad-line)] p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={22} className="mt-0.5 text-[var(--bad)]" />
                    <div>
                      <div className="strong">What could be going on</div>
                      <ul className="mt-2 space-y-2 pl-5 text-sm leading-6 text-[var(--text-soft)]">
                        <li>The file may have been edited after it was published.</li>
                        <li>It may be an unofficial or outdated copy.</li>
                        <li>It could belong to a different office or city.</li>
                      </ul>
                      <p className="mt-3 text-sm text-[var(--text-soft)]">
                        Browse the official records to look for the correct version before
                        relying on the document.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.fileHash ? (
                <div className="border-t border-[var(--line)] pt-4">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowTechnical((value) => !value)}
                  >
                    {showTechnical ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {showTechnical ? 'Hide technical details' : 'Show technical details'}
                  </button>

                  {showTechnical ? (
                    <div className="stack-3 mt-3">
                      <p className="m-0 text-sm leading-6 text-[var(--text-soft)]">
                        These are the document fingerprints used for matching. Any change to
                        the underlying file changes its fingerprint completely.
                      </p>
                      <div className={`hash-block ${result.verified ? 'hash-ok' : 'hash-bad'}`}>
                        <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[var(--text-mute)]">
                          Uploaded file
                        </span>
                        {result.fileHash}
                      </div>
                      {result.verified && result.document ? (
                        <div className="hash-block">
                          <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[var(--text-mute)]">
                            Official record
                          </span>
                          {result.document.file_hash}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="row">
                {result.verified && result.document ? (
                  <Link href={`/documents/${result.document.id}`}>
                    <Button>
                      <FileText size={15} />
                      View the full record
                    </Button>
                  </Link>
                ) : (
                  <Link href="/documents">
                    <Button variant="outline">
                      <FileText size={15} />
                      Browse official records
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleReset}>
                  Check another file
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </section>

      <section className="section" aria-labelledby="verify-steps">
        <div className="section-head">
          <h2 id="verify-steps">What happens when you verify a file</h2>
          <p>A straightforward process built to give citizens a clear answer quickly.</p>
        </div>
        <div className="grid grid-3">
          {[
            {
              step: '01',
              title: 'Upload your copy',
              description:
                'Choose the file you received from a messenger app, email, office, or printed scan.',
            },
            {
              step: '02',
              title: 'CYFER computes a fingerprint',
              description:
                'The system creates a SHA-256 fingerprint for the uploaded file and compares it against official records.',
            },
            {
              step: '03',
              title: 'You get a clear result',
              description:
                'A match confirms that your copy aligns with the published record. No match means you should verify further before relying on it.',
            },
          ].map((item) => (
            <div key={item.step} className="card p-6">
              <div className="eyebrow">Step {item.step}</div>
              <h3 className="mt-2 font-serif text-xl font-semibold text-[var(--ink-900)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Common questions</h2>
        </div>
        <div className="stack-3">
          {faqItems.map((item) => (
            <details key={item.question} className="faq">
              <summary>
                <span>{item.question}</span>
                <ChevronDown size={16} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
    </main>
  );
}
