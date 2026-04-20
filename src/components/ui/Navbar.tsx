'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Blocks,
  CheckCircle2,
  FileText,
  Home,
  Menu,
  ScrollText,
  Shield,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/verify', label: 'Check a document', icon: CheckCircle2 },
  { href: '/documents', label: 'Official records', icon: FileText },
  { href: '/budget', label: 'Where taxes went', icon: BarChart3 },
  { href: '/blockchain', label: 'How it works', icon: Blocks },
  { href: '/audit', label: 'Audit log', icon: ScrollText },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="topbar">
      <div className="container-page">
        <div className="topbar-row">
          <Link href="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark">
              <Image
                src="/Cyfer Logo.png"
                alt="CYFER"
                width={56}
                height={56}
                priority
              />
            </span>
            <span>
              <span className="brand-name">CYFER</span>
              <span className="brand-sub">Verified Civic Records</span>
            </span>
          </Link>

          <nav className="nav-primary" aria-label="Primary">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="topbar-actions">
            <span className="topbar-signin">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <Shield size={14} />
                  Official sign-in
                </Button>
              </Link>
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm topbar-hamburger"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[var(--line)] bg-[rgba(247,245,240,0.96)]">
          <div className="container-page py-3">
            <nav className="stack-2" aria-label="Mobile">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className="nav-link justify-between"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMenu}
                  >
                    <span className="row">
                      <Icon size={15} />
                      {label}
                    </span>
                  </Link>
                );
              })}
              <Link href="/login" onClick={closeMenu}>
                <Button variant="secondary" size="sm" className="w-full">
                  <Shield size={14} />
                  Official sign-in
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
