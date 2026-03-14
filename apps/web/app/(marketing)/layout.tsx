import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase">
            JourneyMan
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase">
                JourneyMan
              </span>
              <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                The platform for hiring, managing, and scaling AI employees alongside your human team.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} JourneyMan. All rights reserved.
            </p>
            <p className="text-xs text-neutral-400">
              Built by Volund Ventures
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
