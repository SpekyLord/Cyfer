import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  Lock,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const promises = [
  {
    icon: Users,
    title: 'No single person decides',
    description:
      "Every city document requires sign-off from all key officials — the Mayor, the Treasurer and the Secretary. If even one refuses, it doesn't get published. No one can sneak anything through.",
  },
  {
    icon: Shield,
    title: "Records can't be edited after the fact",
    description:
      "Once a document is published, it's locked into a public record that copies itself across separate computers. Changing it anywhere would break every copy — and everyone would see.",
  },
  {
    icon: Eye,
    title: "You don't need our permission to check",
    description:
      "No account, no email, no tracking. You can check any document right now, anonymously. Your city is paying for this so you can trust what you get.",
  },
];

const quickActions = [
  {
    href: '/verify',
    title: 'Verify a Document',
    description: 'Upload the file you received and check it against the official city record.',
    icon: CheckCircle2,
  },
  {
    href: '/documents',
    title: 'Browse Documents',
    description: 'Read ordinances, resolutions, contracts, budgets, and permits published by the LGU.',
    icon: FileText,
  },
  {
    href: '/budget',
    title: 'Budget Transparency',
    description: 'Explore budget allocations and spending data for public accountability.',
    icon: BarChart3,
  },
];

const trustPoints = [
  { icon: Lock, label: 'Free, no sign-up' },
  { icon: Shield, label: 'Your file stays private' },
  { icon: CheckCircle2, label: 'Approved by all officials' },
  { icon: Sparkles, label: 'Takes 5 seconds' },
];

export default function LandingPage() {
  return (
    <main id="main">
      <section className="hero">
        <div className="container-page hero-inner">
          <div>
            <span className="hero-badge">
              <Shield size={13} />
              Your city · Open records for everyone
            </span>
            <h1>Is this document from city hall actually real?</h1>
            <p className="lede">
              Someone hands you an ordinance. A neighbor forwards you a receipt. You get a
              permit in the mail. Before you rely on it — check it here in 5 seconds.
              It&apos;s free, you don&apos;t need to sign up, and your file stays on your
              own device.
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
                  Browse Documents
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
              What you can do here
            </div>
            <div className="stack-3">
              {quickActions.map(({ href, title, description, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-[var(--r-lg)] border border-white/15 bg-white/5 p-4 text-white transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-[var(--r-md)] bg-white/10">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-lg font-semibold">{title}</span>
                      <span className="mt-1 block text-sm text-[var(--text-inv-soft)]">
                        {description}
                      </span>
                    </span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-[var(--s-8)] lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Why this matters for you
              </div>
              <h2 className="mt-3 font-serif text-[clamp(28px,4vw,40px)] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink-900)]">
                A PDF on your phone isn&apos;t proof of anything — until you can check it.
              </h2>
              <p className="mt-4 text-[17px] leading-7 text-[var(--text-soft)]">
                Every week, someone in your city pays a fine from a fake notice, or follows
                a forwarded ordinance that was quietly edited, or gets turned away with a
                permit that looks real but isn&apos;t. Most people have no way to tell the
                difference.
              </p>
              <p className="mt-4 text-[17px] leading-7 text-[var(--text-soft)]">
                CYFER fixes that. Your city officials record every official document in a
                public, tamper-proof system. You can instantly check any copy you have
                against it — here, for free, without signing up.
              </p>
              <div className="row mt-5">
                <Link href="/verify">
                  <Button variant="secondary">
                    <CheckCircle2 size={16} />
                    Verify a Document
                  </Button>
                </Link>
                <Link href="/blockchain">
                  <Button variant="ghost">
                    How it works
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="card p-6" style={{ background: 'var(--card-alt)' }}>
              <div className="eyebrow">A quick example</div>
              <div className="stack-3 mt-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ink-100)] font-serif font-semibold text-[var(--ink-900)]">
                    1
                  </span>
                  <p className="m-0 text-sm text-[var(--text-soft)]">
                    <strong className="text-[var(--ink-900)]">You receive a PDF</strong>{' '}
                    — a friend forwards you the new tricycle fare ordinance on Messenger.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ink-100)] font-serif font-semibold text-[var(--ink-900)]">
                    2
                  </span>
                  <p className="m-0 text-sm text-[var(--text-soft)]">
                    <strong className="text-[var(--ink-900)]">You drop it in here</strong>{' '}
                    — one click, the file never leaves your phone.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ok)] text-white">
                    <CheckCircle2 size={16} />
                  </span>
                  <p className="m-0 text-sm text-[var(--text-soft)]">
                    <strong className="text-[var(--ok)]">You get your answer</strong>{' '}
                    — &quot;It&apos;s real.&quot; Or &quot;Something&apos;s off&quot; — with the real copy one click away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'var(--ink-025)',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="container-page">
          <div className="section-head mx-auto max-w-[620px] text-center">
            <div className="eyebrow justify-center">
              <span className="eyebrow-dot" />
              Three promises to you
            </div>
            <h2>Why you can trust what this site tells you</h2>
          </div>
          <div className="grid grid-3">
            {promises.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-[12px] bg-[var(--ink-900)] text-white">
                  <Icon size={22} />
                </span>
                <h3 className="m-0 font-serif text-xl font-semibold text-[var(--ink-900)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="card card-lead p-6 sm:p-8" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
            <div>
              <div className="strong font-serif text-[22px]">Have a document in hand?</div>
              <div className="soft mt-1 text-sm">Takes 5 seconds. No sign-up. Your file stays on your device.</div>
            </div>
            <div className="row">
              <Link href="/verify">
                <Button size="lg">
                  <CheckCircle2 size={17} />
                  Verify Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
