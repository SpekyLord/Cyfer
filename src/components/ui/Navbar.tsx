'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileText, CheckCircle, BarChart3, ScrollText, Blocks, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Shield },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/verify', label: 'Verify', icon: CheckCircle },
  { href: '/blockchain', label: 'Blockchain', icon: Blocks },
  { href: '/budget', label: 'Budget', icon: BarChart3 },
  { href: '/audit', label: 'Audit Trail', icon: ScrollText },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold tracking-tight">CYFER</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    ${isActive ? 'bg-white/15 text-accent' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-accent border border-accent/40 rounded-lg hover:bg-accent/10"
            >
              Admin Login
            </Link>
          </div>

          <button
            className="md:hidden text-white cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary-light">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                    ${isActive ? 'bg-white/15 text-accent' : 'text-white/80 hover:bg-white/10'}`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-accent"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
