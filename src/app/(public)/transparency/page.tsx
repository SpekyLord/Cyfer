import Link from 'next/link';
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  FileText,
  ScrollText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const transparencyCards = [
  {
    href: '/audit',
    title: 'Activity Log',
    description:
      'See the public history of uploads, approvals, rejections, verifications, and publications.',
    whenToUse:
      'Use this when you want to see who did what and when.',
    icon: ScrollText,
  },
  {
    href: '/blockchain',
    title: 'Blockchain',
    description:
      'Open the technical ledger view, node status, and linked block history.',
    whenToUse:
      'Use this when you want the deeper technical proof behind the record.',
    icon: Blocks,
  },
];

export default function TransparencyPage() {
  return (
    <main id="main" className="container-page" style={{ paddingBottom: 'var(--s-11)' }}>
      <div className="page-head">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Public proof tools
        </div>
        <h1>Transparency</h1>
        <p className="lead">
          Use these pages when you want more than a quick answer. They show the
          public history and technical record behind CYFER.
        </p>
      </div>

      <section className="section-tight">
        <div className="grid grid-2">
          {transparencyCards.map(({ href, title, description, whenToUse, icon: Icon }) => (
            <div key={title} className="card p-6">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-[12px] bg-[var(--ink-050)] text-[var(--ink-700)]">
                <Icon size={22} />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink-900)]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{description}</p>
              <div className="mt-4 rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--ink-025)] p-4">
                <div className="eyebrow">Use this when</div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{whenToUse}</p>
              </div>
              <Link href={href} className="mt-5 inline-flex">
                <Button variant="outline">
                  Open {title}
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <div className="grid grid-3">
          {[
            {
              icon: CheckCircle2,
              title: 'Best after Verify',
              description: 'Start with Verify if you already have a document. Use Transparency when you want deeper proof.',
            },
            {
              icon: FileText,
              title: 'Best after Official Records',
              description: 'Open Official Records first if you need the published file before reviewing the logs behind it.',
            },
            {
              icon: Shield,
              title: 'Public and open',
              description: 'These pages are available without signing in so citizens can inspect the system openly.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--ink-050)] text-[var(--ink-700)]">
                <Icon size={20} />
              </span>
              <h3 className="font-serif text-xl font-semibold text-[var(--ink-900)]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
