import Link from 'next/link';
import { Shield, FileText, CheckCircle, Users, BarChart3, ScrollText, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: FileText,
    title: 'Tamper-Proof Documents',
    description: 'Every government document is hashed with SHA-256 and recorded on the blockchain for permanent integrity.',
  },
  {
    icon: Users,
    title: 'Unanimous Consensus',
    description: 'Documents require approval from all designated officials before publication — no single point of corruption.',
  },
  {
    icon: CheckCircle,
    title: 'Citizen Verification',
    description: 'Anyone can upload a document to instantly verify its authenticity against the blockchain record.',
  },
  {
    icon: Sparkles,
    title: 'AI Document Summarizer',
    description: 'Complex government documents made accessible with AI-powered plain-language summaries.',
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-accent mb-6">
            <Shield size={16} />
            SDG 16 — Peace, Justice &amp; Strong Institutions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Transparent Governance,<br />
            <span className="text-accent">Verified by Blockchain</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            CYFER enables local government units to publish tamper-proof documents
            and empowers citizens to verify their integrity — building trust through technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/verify">
              <Button variant="secondary" size="lg">
                <CheckCircle size={18} />
                Verify a Document
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <FileText size={18} />
                Browse Documents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">How CYFER Works</h2>
          <p className="text-muted text-center mb-10">Four pillars of governance transparency</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Explore Government Transparency</h2>
          <p className="text-muted mb-8">Browse published documents, view budget allocations, or check the audit trail.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/budget">
              <Button variant="outline" size="md">
                <BarChart3 size={16} />
                Budget Dashboard
              </Button>
            </Link>
            <Link href="/audit">
              <Button variant="outline" size="md">
                <ScrollText size={16} />
                Audit Trail
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
