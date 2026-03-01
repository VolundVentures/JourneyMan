'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`.trim(),
          company: company || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Auto sign-in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please log in manually.');
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
            Create your account
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Start your free 14-day trial
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
              First name
            </label>
            <Input
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Last name
            </label>
            <Input
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Work email
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
          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Company name
          </label>
          <Input
            type="text"
            placeholder="Acme Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-neutral-400">
            Must be at least 8 characters
          </p>
        </div>

        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>

        <p className="text-center text-xs text-neutral-400">
          By signing up, you agree to our{' '}
          <a href="#" className="text-neutral-500 hover:text-neutral-700 transition-colors">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-neutral-500 hover:text-neutral-700 transition-colors">
            Privacy Policy
          </a>
        </p>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Already have an account?{' '}
        <a href="/login" className="text-neutral-500 hover:text-neutral-700 transition-colors">
          Sign in
        </a>
      </p>
    </div>
  );
}
