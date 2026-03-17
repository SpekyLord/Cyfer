import { Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold text-white">CYFER</span>
            </div>
            <p className="text-sm text-white/60">
              Blockchain-powered government document transparency platform for tamper-proof document management.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/documents" className="block text-sm hover:text-accent">Public Documents</Link>
              <Link href="/verify" className="block text-sm hover:text-accent">Verify Document</Link>
              <Link href="/budget" className="block text-sm hover:text-accent">Budget Dashboard</Link>
              <Link href="/audit" className="block text-sm hover:text-accent">Audit Trail</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">SDG Alignment</h3>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <span className="text-accent font-bold text-lg">16</span>
              <span className="text-sm">Peace, Justice &amp; Strong Institutions</span>
            </div>
            <p className="text-xs text-white/50 mt-3">InterCICSkwela Hackathon 2026</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-4 text-center text-xs text-white/40">
          CYFER — Secure Document Access Blockchain Network for Governance Transparency
        </div>
      </div>
    </footer>
  );
}
