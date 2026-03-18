import Link from 'next/link';
import { Shield, FileText, CheckCircle, Users, BarChart3, ScrollText, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: FileText,
    title: 'Tamper-Proof Documents',
    description: 'Every government document is hashed with SHA-256 and recorded on the blockchain for permanent integrity.',
    color: 'bg-info/10 text-info',
  },
  {
    icon: Users,
    title: 'Unanimous Consensus',
    description: 'Documents require approval from all designated officials before publication — no single point of corruption.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: CheckCircle,
    title: 'Citizen Verification',
    description: 'Anyone can upload a document to instantly verify its authenticity against the blockchain record.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Sparkles,
    title: 'AI Document Summarizer',
    description: 'Complex government documents made accessible with AI-powered plain-language summaries.',
    color: 'bg-accent/10 text-accent',
  },
];

const stats = [
  { label: 'SHA-256 Hashing', icon: Lock },
  { label: 'Blockchain Verified', icon: Shield },
  { label: '100% Consensus Required', icon: Users },
  { label: 'AI-Powered Summaries', icon: Sparkles },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-light opacity-50" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-accent mb-6 animate-fade-in">
            <Shield size={16} />
            SDG 16 — Peace, Justice &amp; Strong Institutions
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            Transparent Governance,<br />
            <span className="text-accent">Verified by Blockchain</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            CYFER enables local government units to publish tamper-proof documents
            and empowers citizens to verify their integrity — building trust through technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/verify">
              <Button variant="secondary" size="lg" className="animate-pulse-glow">
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

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm text-white/50">
                <stat.icon size={14} className="text-accent" />
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How CYFER Works</h2>
            <p className="text-muted">Four pillars of governance transparency</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="flex gap-4 group">
                <div className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
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

      {/* How it works flow */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">The Verification Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Upload &amp; Hash</h3>
              <p className="text-sm text-muted">Officials upload documents. SHA-256 generates a unique cryptographic fingerprint.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Consensus Approval</h3>
              <p className="text-sm text-muted">All designated officials must unanimously approve before publication.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Citizen Verification</h3>
              <p className="text-sm text-muted">Anyone can verify any document against the blockchain — no account needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Explore Government Transparency</h2>
          <p className="text-muted mb-8">Browse published documents, view budget allocations, or check the audit trail.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/budget">
              <Button variant="outline" size="md">
                <BarChart3 size={16} />
                Budget Dashboard
                <ArrowRight size={14} />
              </Button>
            </Link>
            <Link href="/audit">
              <Button variant="outline" size="md">
                <ScrollText size={16} />
                Audit Trail
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
