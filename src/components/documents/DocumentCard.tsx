import Link from 'next/link';
import { FileText, Calendar, User, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, formatHash } from '@/utils/formatters';
import { DOCUMENT_CATEGORIES } from '@/utils/constants';

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    category: string;
    description: string;
    file_hash: string;
    status: string;
    created_at: string;
    users?: { name: string; department: string } | null;
  };
}

const categoryBadgeVariant: Record<string, 'info' | 'accent' | 'warning' | 'success' | 'default'> = {
  ordinance: 'info',
  budget: 'accent',
  resolution: 'warning',
  contract: 'success',
  permit: 'default',
  other: 'default',
};

export function DocumentCard({ document }: DocumentCardProps) {
  const categoryLabel = DOCUMENT_CATEGORIES.find(c => c.value === document.category)?.label ?? document.category;

  return (
    <Link href={`/documents/${document.id}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={categoryBadgeVariant[document.category] ?? 'default'}>
            {categoryLabel}
          </Badge>
          <CheckCircle size={16} className="text-success" />
        </div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{document.title}</h3>
        <p className="text-sm text-muted mb-4 line-clamp-2">{document.description}</p>
        <div className="space-y-1.5 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(document.created_at)}
          </div>
          {document.users && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              {document.users.name} — {document.users.department}
            </div>
          )}
          <div className="flex items-center gap-1.5 font-mono">
            <FileText size={12} />
            {formatHash(document.file_hash)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
