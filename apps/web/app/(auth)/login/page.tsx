'use client';

import { useState } from 'react';
import { Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Logo */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-xl shadow-brand-500/20">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-50 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Sign in to your JourneyMan account
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-surface-800/50 bg-surface-800/20 backdrop-blur-xl p-6 space-y-5">
        <div>
          <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">
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
            <label className="block text-xs text-surface-500 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
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

      {/* Footer */}
      <p className="text-center text-xs text-surface-600">
        Don&apos;t have an account?{' '}
        <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors">
          Contact Sales
        </a>
      </p>
    </div>
  );
}
