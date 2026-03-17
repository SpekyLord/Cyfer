import { Upload, CheckCircle, XCircle, Eye, Shield, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, formatHash } from '@/utils/formatters';

interface Transaction {
  id: string;
  action_type: string;
  description: string;
  document_id: string | null;
  performed_by: string;
  tx_hash: string;
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

export function AuditTimeline({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {transactions.map((tx) => {
          const Icon = actionIcons[tx.action_type] ?? FileText;
          const variant = actionBadgeVariant[tx.action_type] ?? 'default';

          return (
            <div key={tx.id} className="relative flex gap-4 pl-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center z-10">
                <Icon size={14} className="text-muted" />
              </div>
              <div className="flex-1 bg-card rounded-lg border border-border p-4 hover:bg-card-hover">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={variant}>{tx.action_type}</Badge>
                      <span className="text-xs text-muted">{formatDateTime(tx.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground">{tx.description}</p>
                  </div>
                </div>
                {tx.tx_hash && (
                  <p className="text-xs text-muted font-mono mt-2">TX: {formatHash(tx.tx_hash)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
