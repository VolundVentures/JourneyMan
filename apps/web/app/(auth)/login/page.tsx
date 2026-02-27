'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] text-neutral-50 uppercase mb-6">
            JourneyMan
          </h1>
          <h2 className="text-2xl font-bold text-neutral-50 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Sign in to your account
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-5">
        <div>
          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Email address
          </label>
          <Input
            type="email"
            placeholder="you@company.com"
            defaultValue="zakaria@volundventures.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-neutral-500 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              defaultValue="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-11"
          onClick={() => window.location.href = '/dashboard'}
        >
          Sign In
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-neutral-600">
        Don&apos;t have an account?{' '}
        <a href="#" className="text-neutral-400 hover:text-neutral-200 transition-colors">
          Contact Sales
        </a>
      </p>
    </div>
  );
}
