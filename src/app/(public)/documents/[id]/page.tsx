'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Hash,
  Loader2,
  Shield,
  Sparkles,
  Upload,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime, formatFileSize } from '@/utils/formatters';

interface Approval {
  id: string;
  status: string;
  message: string | null;
  responded_at: string | null;
  created_at: string;
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
  affectedParties?: string;
  budgetImplications?: string;
  tldr: string;
}

const categoryLabels: Record<string, string> = {
  ordinance: 'New city rule',
  budget: 'Money and spending',
  resolution: 'Official decision',
  contract: 'City agreement',
  permit: 'Permit or license',
  other: 'Official record',
};

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      } catch (error) {
        console.error('Failed to fetch document:', error);
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
    } catch (error) {
      console.error('Failed to summarize:', error);
    } finally {
      setSummaryLoading(false);
    }
  }

  if (loading) {
    return (
      <main id="main" className="container-page pb-[var(--s-11)]">
        <div className="page-head">
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--ink-050)]" />
          <div className="mt-4 h-12 w-3/4 animate-pulse rounded bg-[var(--ink-050)]" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-[var(--ink-025)]" />
          <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-[var(--ink-025)]" />
        </div>
        <div className="grid gap-[var(--s-6)] py-[var(--s-8)] lg:grid-cols-[1.35fr_0.95fr]">
          <div className="card h-[420px] animate-pulse" />
          <div className="stack-3">
            <div className="card h-52 animate-pulse" />
            <div className="card h-52 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!document) {
    return (
      <main id="main" className="container-page py-[var(--s-10)]">
        <div className="card p-10 text-center">
          <h1 className="font-serif text-3xl font-semibold text-[var(--ink-900)]">
            Document not found
          </h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">
            The record you requested is unavailable or may have been removed.
          </p>
          <Link href="/documents" className="mt-5 inline-flex">
            <Button variant="outline">
              <ArrowLeft size={14} />
              Back to records
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const categoryLabel = categoryLabels[document.category] ?? document.category;
  const statusVariant =
    document.status === 'published'
      ? 'success'
      : document.status === 'rejected'
        ? 'error'
        : 'warning';

  return (
    <main id="main" className="container-page pb-[var(--s-11)]">
      <div className="page-head">
        <Link href="/documents" className="inline-flex">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft size={14} />
            Back to all records
          </Button>
        </Link>
        <div className="row mb-2">
          <Badge variant="accent">{categoryLabel}</Badge>
          <Badge variant={statusVariant}>{document.status.replace('_', ' ')}</Badge>
          {document.status === 'published' ? (
            <Badge variant="success">
              <CheckCircle2 size={12} />
              Officially approved
            </Badge>
          ) : null}
        </div>
        <h1>{document.title}</h1>
        <p className="lead">{document.description}</p>
      </div>

      <section className="grid gap-[var(--s-6)] py-[var(--s-8)] lg:grid-cols-[1.35fr_0.95fr]">
        <div className="stack-6">
          <div className="card p-6" style={{ background: 'linear-gradient(180deg, var(--ink-025), var(--card))' }}>
            <div className="row-between gap-4">
              <div>
                <div className="eyebrow">
                  <Sparkles size={12} />
                  What this means, in plain language
                </div>
              </div>
              {!summary ? (
                <Button variant="outline" size="sm" onClick={handleSummarize} disabled={summaryLoading}>
                  {summaryLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate summary
                    </>
                  )}
                </Button>
              ) : null}
            </div>

            {summaryLoading && !summary ? (
              <p className="mt-4 text-sm text-[var(--text-soft)]">
                Preparing a plain-language summary...
              </p>
            ) : summary ? (
              <div className="stack-3 mt-4">
                <p className="m-0 font-serif text-2xl font-semibold leading-9 text-[var(--ink-900)]">
                  {summary.tldr}
                </p>
                <p className="m-0 text-sm leading-6 text-[var(--text-soft)]">{summary.summary}</p>

                <div>
                  <div className="eyebrow mb-2">What changes for you</div>
                  <ul className="m-0 space-y-2 pl-5 text-sm leading-6 text-[var(--text-soft)]">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="card card-flat p-4">
                    <div className="eyebrow">Who this affects</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {summary.affectedParties || 'No affected parties were identified.'}
                    </p>
                  </div>
                  <div className="card card-flat p-4">
                    <div className="eyebrow">Budget implications</div>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {summary.budgetImplications || 'No budget implications were identified.'}
                    </p>
                  </div>
                </div>

                <p className="border-t border-dashed border-[var(--line)] pt-3 text-xs text-[var(--text-mute)]">
                  This is an AI-generated summary. Review the original document for the
                  authoritative wording.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-[var(--r-lg)] border border-dashed border-[var(--line-2)] bg-[var(--card)] p-5">
                <p className="m-0 text-sm leading-6 text-[var(--text-soft)]">
                  Generate an AI summary to get a quicker explanation of the document,
                  the likely affected groups, and its budget implications.
                </p>
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="row-between gap-4">
              <div className="eyebrow">The original document</div>
              {document.file_url ? (
                <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Download size={13} />
                    Download file
                  </Button>
                </a>
              ) : null}
            </div>
            <div className="mt-4 grid min-h-72 place-items-center rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--ink-025)] p-6 text-center text-[var(--text-mute)]">
              <div>
                <FileText size={32} className="mx-auto" />
                <div className="mt-3 text-sm font-medium text-[var(--ink-900)]">
                  {document.file_name}
                </div>
                <div className="mt-1 text-xs">
                  {formatFileSize(document.file_size)} · uploaded {formatDate(document.created_at)}
                </div>
                <div className="mt-4 text-sm text-[var(--text-soft)]">
                  Use the download button to review the original file stored for this
                  record.
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="stack">
          <div className="card p-6" style={{ borderColor: 'var(--ok-line)' }}>
            <div className="row gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-[var(--r-md)] bg-[var(--ok-soft)] text-[var(--ok)]">
                {document.status === 'published' ? <Shield size={20} /> : <XCircle size={20} />}
              </span>
              <div>
                <div className="font-serif text-xl font-semibold text-[var(--ink-900)]">
                  {document.status === 'published'
                    ? 'This is a real city record'
                    : 'This record is not fully published'}
                </div>
                <div className="text-sm text-[var(--text-soft)]">
                  {document.status === 'published'
                    ? 'Approved and safe to rely on.'
                    : 'Check the status before treating it as final.'}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
              {document.status === 'published'
                ? 'This document passed through the CYFER approval process and its file fingerprint matches the stored official record.'
                : 'This document exists in the system, but it is not currently published as an approved public record.'}
            </p>
            <Link href="/verify" className="mt-4 inline-flex w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Upload size={13} />
                Check a copy I have
              </Button>
            </Link>
          </div>

          <div className="card p-6">
            <div className="eyebrow">Who approved this</div>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Every approval recorded for this document appears in order below.
            </p>

            {approvals.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--text-soft)]">No approvals are recorded yet.</p>
            ) : (
              <div className="chain mt-4">
                {approvals.map((approval) => {
                  const approvalVariant =
                    approval.status === 'approved'
                      ? 'ok'
                      : approval.status === 'rejected'
                        ? 'bad'
                        : 'warn';

                  return (
                    <div
                      key={approval.id}
                      className="chain-node"
                      data-kind={approvalVariant}
                    >
                      <div className="row flex-nowrap items-start gap-3">
                        <span
                          className={`mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full ${
                            approval.status === 'approved'
                              ? 'bg-[var(--ok-soft)] text-[var(--ok)]'
                              : approval.status === 'rejected'
                                ? 'bg-[var(--bad-soft)] text-[var(--bad)]'
                                : 'bg-[var(--warn-soft)] text-[var(--warn)]'
                          }`}
                        >
                          {approval.status === 'approved' ? (
                            <CheckCircle2 size={14} />
                          ) : approval.status === 'rejected' ? (
                            <XCircle size={14} />
                          ) : (
                            <Loader2 size={14} />
                          )}
                        </span>
                        <div>
                          <div className="strong text-sm">
                            {approval.users?.name ?? 'Unknown official'}
                          </div>
                          <div className="soft text-xs">
                            {approval.users?.department ?? 'Department unavailable'}
                            {approval.responded_at ? ` · ${formatDateTime(approval.responded_at)}` : ''}
                          </div>
                          {approval.message ? (
                            <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                              “{approval.message}”
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="eyebrow">About this document</div>
            <div className="stack-2 mt-4 text-sm">
              <div className="row-between">
                <span className="soft">Published</span>
                <span>{document.published_at ? formatDate(document.published_at) : 'Not yet published'}</span>
              </div>
              <div className="row-between">
                <span className="soft">Uploaded</span>
                <span>{formatDateTime(document.created_at)}</span>
              </div>
              <div className="row-between">
                <span className="soft">From</span>
                <span>{document.users?.department ?? 'Department unavailable'}</span>
              </div>
              <div className="row-between">
                <span className="soft">File size</span>
                <span>{formatFileSize(document.file_size)}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="eyebrow mb-2">
                <Hash size={12} />
                Stored file hash
              </div>
              <div className="hash-block">{document.file_hash}</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
