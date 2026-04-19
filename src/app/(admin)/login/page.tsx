'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
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
        toast('success', `Welcome back, ${json.data.user.name || 'Admin'}!`);
        router.push('/admin');
      } else {
        setError(json.error ?? 'Invalid email or password');
        toast('error', 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
      toast('error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      id="main"
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(36,96,121,0.18),transparent_35%),linear-gradient(180deg,#031724_0%,#041d2d_62%,#f7f5f0_62%)] px-5 py-10"
    >
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="text-white">
            <span className="hero-badge">
              <Shield size={13} />
              Official CYFER workspace
            </span>
            <h1 className="font-serif text-[clamp(40px,6vw,64px)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Sign in to manage verified civic records.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-inv-soft)]">
              Upload documents, review approvals, publish budget data, and monitor
              the audit trail in the same workspace used by city officials.
            </p>
            <div className="trust-band">
              <span className="trust-item">Consensus approvals</span>
              <span className="trust-item">Blockchain-backed publication</span>
              <span className="trust-item">Public verification</span>
            </div>
          </div>

          <div className="card p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--ink-900)] text-white">
                <Shield size={30} />
              </div>
              <div className="eyebrow justify-center">Official sign-in</div>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink-900)]">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-[var(--text-soft)]">
                Use your authorized LGU account to access the CYFER admin workspace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="stack-3">
              <Input
                label="Email"
                type="email"
                placeholder="admin@lgu.gov.ph"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              {error ? (
                <div className="rounded-[var(--r-lg)] border border-[var(--bad-line)] bg-[var(--bad-soft)] px-4 py-3 text-sm text-[var(--bad)]">
                  {error}
                </div>
              ) : null}

              <Button type="submit" disabled={loading} className="mt-2 w-full">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Sign in to CYFER
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-[var(--text-mute)]">
              Only authorized officials should access this workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
