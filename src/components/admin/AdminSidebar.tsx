'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Upload, CheckSquare, FileText, DollarSign, Users, LogOut, Shield } from 'lucide-react';
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

  useEffect(() => {
    const stored = localStorage.getItem('cyfer_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

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

  return (
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent" />
          <span className="text-lg font-bold">CYFER Admin</span>
        </Link>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
        <Link href="/" className="block text-xs text-white/40 text-center mt-3 hover:text-white/60">
          Back to Public Portal
        </Link>
      </div>
    </aside>
  );
}
