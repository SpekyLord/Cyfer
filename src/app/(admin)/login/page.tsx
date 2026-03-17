'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem('cyfer_token', json.data.session.access_token);
        localStorage.setItem('cyfer_user', JSON.stringify(json.data.user));
        router.push('/admin');
      } else {
        setError(json.error ?? 'Invalid email or password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted mt-1">Sign in to access the CYFER admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@lgu.gov.ph"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="Enter your password"
            value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && (
            <div className="p-3 bg-red-50 border border-error/20 rounded-lg text-sm text-error">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
          </Button>
        </form>

        <p className="text-xs text-center text-muted mt-4">
          Only authorized government officials can access the admin panel.
        </p>
      </Card>
    </div>
  );
}
