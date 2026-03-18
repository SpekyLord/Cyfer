'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Upload, CheckSquare, FileText, DollarSign, Users, LogOut, Shield, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useEffect, useState } from 'react';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/upload', label: 'Upload Document', icon: Upload },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/budget', label: 'Budget', icon: DollarSign },
  { href: '/admin/users', label: 'Users', icon: Users },
];

interface UserData {
  name: string;
  role: string;
  department: string;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cyfer_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleLogout() {
    const token = localStorage.getItem('cyfer_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    localStorage.removeItem('cyfer_token');
    localStorage.removeItem('cyfer_user');
    router.push('/login');
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent" />
          <span className="text-lg font-bold">CYFER Admin</span>
        </Link>
        <button
          className="lg:hidden text-white/70 hover:text-white cursor-pointer"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-white/50">{user.department}</p>
          <Badge variant={user.role === 'super_admin' ? 'accent' : 'info'} className="mt-1.5">
            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-white/15 text-accent' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full cursor-pointer transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
        <Link href="/" className="block text-xs text-white/40 text-center mt-3 hover:text-white/60 transition-colors">
          Back to Public Portal
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 bg-primary text-white min-h-screen flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
