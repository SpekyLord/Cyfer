'use client';

import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Eye, Shield, FileText, ChevronDown, Hash, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDateTime } from '@/utils/formatters';

interface Transaction {
  id: string;
  action_type: string;
  description: string;
  document_id: string | null;
  performed_by: string;
  tx_hash: string;
  previous_tx_hash?: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

const actionIcons: Record<string, typeof Upload> = {
  upload: Upload,
  approve: CheckCircle,
  reject: XCircle,
  publish: Shield,
  verify: FileText,
  access: Eye,
};

const actionBadgeVariant: Record<string, 'info' | 'success' | 'error' | 'warning' | 'default'> = {
  upload: 'info',
  approve: 'success',
  reject: 'error',
  publish: 'success',
  verify: 'warning',
  access: 'default',
};

const actionColors: Record<string, string> = {
  upload: 'bg-info/15 border-info/30 text-info',
  approve: 'bg-success/15 border-success/30 text-success',
  reject: 'bg-error/15 border-error/30 text-error',
  publish: 'bg-success/15 border-success/30 text-success',
  verify: 'bg-warning/15 border-warning/30 text-warning',
  access: 'bg-primary/10 border-primary/20 text-primary',
};

export function AuditTimeline({ transactions }: { transactions: Transaction[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Vertical chain line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-accent/10" />

      <div className="space-y-3">
        {transactions.map((tx, idx) => {
          const Icon = actionIcons[tx.action_type] ?? FileText;
          const variant = actionBadgeVariant[tx.action_type] ?? 'default';
          const dotColor = actionColors[tx.action_type] ?? 'bg-primary/10 border-primary/20 text-primary';
          const isExpanded = expandedId === tx.id;
          const isFirst = idx === 0;

          return (
            <div key={tx.id} className="relative flex gap-4 pl-2">
              {/* Chain dot */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${dotColor}`}>
                <Icon size={13} />
              </div>

              {/* Entry card */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                className="flex-1 text-left group"
              >
                <Card className={`transition-all duration-200 group-hover:border-accent/30 group-hover:shadow-sm
                  ${isExpanded ? 'ring-2 ring-accent/30 shadow-md' : ''}
                  ${isFirst ? 'border-accent/20' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={variant}>{tx.action_type}</Badge>
                          <span className="text-xs text-muted">{formatDateTime(tx.created_at)}</span>
                          {isFirst && <Badge variant="accent">Latest</Badge>}
                        </div>
                        <p className="text-sm text-foreground">{tx.description}</p>
                        {/* Hash preview */}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted font-mono">
                          <Hash size={11} />
                          <span>{tx.tx_hash.slice(0, 16)}...</span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`flex-shrink-0 text-muted transition-transform duration-200 mt-1
                          ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Expanded hash details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        {/* Previous TX Hash */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-2 h-2 rounded-full bg-info/60" />
                            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Previous Transaction Hash</span>
                          </div>
                          <div className="px-3 py-2.5 bg-info/5 border border-info/15 rounded-lg">
                            <code className="text-xs font-mono text-info break-all select-all">
                              {tx.previous_tx_hash || '0000000000000000000000000000000000000000000000000000000000000000'}
                            </code>
                          </div>
                          {!tx.previous_tx_hash && (
                            <p className="text-[11px] text-muted mt-1 italic">First entry in the chain</p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center justify-center gap-2 py-1 mb-3">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold">
                            <Lock size={10} />
                            SHA-256
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        </div>

                        {/* Current TX Hash */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-xs font-semibold text-muted uppercase tracking-wider">This Transaction&apos;s Hash</span>
                          </div>
                          <div className="px-3 py-2.5 bg-success/5 border border-success/15 rounded-lg">
                            <code className="text-xs font-mono text-success break-all select-all">{tx.tx_hash}</code>
                          </div>
                          {tx.previous_tx_hash && (
                            <p className="text-[11px] text-success/80 mt-1 flex items-center gap-1">
                              <CheckCircle size={10} />
                              Links to previous transaction — chain intact
                            </p>
                          )}
                        </div>

                        {/* Metadata */}
                        {tx.metadata && Object.keys(tx.metadata).length > 0 && (
                          <div>
                            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Metadata</span>
                            <pre className="mt-1.5 px-3 py-2.5 bg-primary/[0.03] border border-border rounded-lg text-xs font-mono text-foreground overflow-x-auto max-h-32 whitespace-pre-wrap break-all">
{JSON.stringify(tx.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
