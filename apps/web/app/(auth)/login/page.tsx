'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('zakaria@volundventures.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get CSRF token
      const csrfRes = await fetch('/api/auth/csrf');
      const { csrfToken } = await csrfRes.json();

      // Sign in via NextAuth credentials callback
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          redirect: 'false',
          json: 'true',
        }),
        redirect: 'follow',
      });

      const url = new URL(res.url);
      if (url.searchParams.get('error')) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        window.location.href = '/dashboard';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase mb-6">
            JourneyMan
          </h1>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Sign in to your account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Email address
          </label>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-neutral-500 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-neutral-500 hover:text-neutral-700 transition-colors">
          Create account
        </a>
      </p>
    </div>
  );
}
