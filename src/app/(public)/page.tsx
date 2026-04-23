import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ScrollText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const trustPoints = [
  { icon: Shield, label: 'Free and public' },
  { icon: CheckCircle2, label: 'Fast yes or no answer' },
  { icon: FileText, label: 'Official records available' },
];

const startSteps = [
  {
    step: '1',
    title: 'Have a file already?',
    description: 'Start with Verify and get a clear answer first.',
  },
  {
    step: '2',
    title: 'Need the official copy?',
    description: 'Open Official Records and find the published version.',
  },
  {
    step: '3',
    title: 'Need budget information?',
    description: 'Use Budget for approved public totals and categories.',
  },
];

const transparencyLinks = [
  {
    href: '/audit',
    title: 'Activity Log',
    description: 'See the public history of uploads, approvals, and publications.',
    icon: ScrollText,
  },
  {
    href: '/blockchain',
    title: 'Blockchain',
    description: 'Review the advanced ledger view and network status.',
    icon: Shield,
  },
];

export default function LandingPage() {
  return (
    <main id="main">
      <section className="hero">
        <div className="container-page hero-inner">
          <div>
            <span className="hero-badge">
              <Shield size={13} />
              Public records for everyone
            </span>
            <h1>Need to check if a city document is real?</h1>
            <p className="lede">
              Start with Verify when you already have a file. CYFER gives you a
              fast, plain answer and points you to the official record if you need it.
            </p>
            <div className="hero-cta">
              <Link href="/verify">
                <Button size="lg">
                  <CheckCircle2 size={17} />
                  Verify a Document
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" size="lg">
                  <FileText size={16} />
                  Browse Official Records
                </Button>
              </Link>
            </div>
            <div className="trust-band">
              {trustPoints.map(({ icon: Icon, label }) => (
                <span key={label} className="trust-item">
                  <Icon size={13} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <div className="eyebrow" style={{ color: '#cfe0e8', marginBottom: 12 }}>
              Start here
            </div>
            <div className="stack-3">
              {startSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[var(--r-lg)] border border-white/15 bg-white/5 p-4 text-white"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 font-serif text-lg font-semibold">
                      {item.step}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-lg font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-[var(--text-inv-soft)]">
                        {item.description}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="card card-lead p-6 sm:p-8">
            <div className="section-head" style={{ marginBottom: 'var(--s-5)' }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Simple SOP
              </div>
              <h2>How to use CYFER</h2>
              <p>Use these three steps if you are not sure where to begin.</p>
            </div>
            <div className="grid grid-3">
              {[
                {
                  title: '1. Start with Verify',
                  description: 'Use Verify when someone already sent you a file.',
                },
                {
                  title: '2. Open the official record',
                  description: 'If you need the original copy, go to Official Records.',
                },
                {
                  title: '3. Review the result before acting',
                  description: 'Only rely on the document after it matches the published record.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--card-alt)] p-5"
                >
                  <h3 className="font-serif text-xl font-semibold text-[var(--ink-900)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-tight"
        style={{
          background: 'var(--ink-025)',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="container-page">
          <div className="row-between gap-4" style={{ marginBottom: 'var(--s-6)' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Transparency
              </div>
              <h2>Need public proof, not just a quick answer?</h2>
              <p>Open the public activity history or the technical ledger view.</p>
            </div>
            <Link href="/transparency" className="inline-flex">
              <Button variant="outline">
                Open Transparency
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-2">
            {transparencyLinks.map(({ href, title, description, icon: Icon }) => (
              <div key={title} className="card p-6">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--ink-050)] text-[var(--ink-700)]">
                  <Icon size={20} />
                </span>
                <h3 className="m-0 font-serif text-xl font-semibold text-[var(--ink-900)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  {description}
                </p>
                <Link href={href} className="mt-4 inline-flex">
                  <Button variant="outline" size="sm">
                    Open {title}
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div
            className="card card-lead p-6 sm:p-8"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 24,
              alignItems: 'center',
            }}
          >
            <div>
              <div className="strong font-serif text-[22px]">Ready to check a file?</div>
              <div className="soft mt-1 text-sm">
                Start with Verify. It is the fastest path for first-time users.
              </div>
            </div>
            <div className="row">
              <Link href="/verify">
                <Button size="lg">
                  <CheckCircle2 size={17} />
                  Verify a Document
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
