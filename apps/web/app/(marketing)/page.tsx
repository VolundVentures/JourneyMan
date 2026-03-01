import Link from 'next/link';
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  BarChart3,
  Brain,
  GitBranch,
  CheckCircle2,
  Clock,
  TrendingUp,
  Check,
} from 'lucide-react';

const metrics = [
  { value: '10x', label: 'Faster task completion' },
  { value: '85%', label: 'Cost reduction vs full-time hires' },
  { value: '24/7', label: 'Always-on workforce' },
  { value: '< 5min', label: 'Average onboarding time' },
];

const features = [
  {
    icon: Users,
    title: 'Hire AI Employees',
    description:
      'Browse role templates — Sales, Ops, Marketing, Support — and hire AI employees that start working immediately.',
  },
  {
    icon: Brain,
    title: 'Autonomous & Supervised Modes',
    description:
      'Configure autonomy levels from fully supervised to fully autonomous. AI employees learn and adapt over time.',
  },
  {
    icon: Shield,
    title: 'Human-in-the-Loop Approvals',
    description:
      'Critical decisions escalate to human managers. Approve proposals, contracts, and sensitive communications.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Track performance, cost savings, task throughput, and sentiment across your entire AI workforce.',
  },
  {
    icon: GitBranch,
    title: 'Seamless Handoffs',
    description:
      'AI employees hand off work to each other and to humans with full context — no information lost.',
  },
  {
    icon: Zap,
    title: 'Integrations & Automations',
    description:
      'Connect HubSpot, Slack, Gmail, and more. Build multi-step automations triggered by events or schedules.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Define the Role',
    description:
      'Choose from pre-built templates or create a custom role. Set responsibilities, tools, and autonomy level.',
  },
  {
    step: '02',
    title: 'Hire & Onboard',
    description:
      'Your AI employee is provisioned instantly. Feed it knowledge bases, SOPs, and context about your business.',
  },
  {
    step: '03',
    title: 'Monitor & Approve',
    description:
      'Watch your AI employees work in real-time. Approve key actions, review escalations, and fine-tune behavior.',
  },
  {
    step: '04',
    title: 'Scale',
    description:
      'Add more AI employees as your needs grow. Each one learns from your organization\'s institutional memory.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For small teams getting started with AI employees',
    features: [
      'Up to 3 AI employees',
      '1,000 tasks/month',
      'Email & Slack integrations',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$399',
    period: '/month',
    description: 'For growing teams that need full autonomy controls',
    features: [
      'Up to 15 AI employees',
      'Unlimited tasks',
      'All integrations',
      'Advanced analytics & reports',
      'Custom role templates',
      'Approval workflows',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with complex compliance and scale needs',
    features: [
      'Unlimited AI employees',
      'Unlimited tasks',
      'SSO & SAML',
      'Audit log & compliance',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs text-neutral-600 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now in Public Beta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              Your AI workforce,{' '}
              <span className="text-neutral-400">managed like humans.</span>
            </h1>

            <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              Hire, onboard, and manage AI employees that handle sales, operations,
              marketing, and support — with human oversight at every step.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 text-neutral-700 px-6 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 rounded-xl border border-neutral-200 bg-neutral-50 p-2">
            <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <div className="border-b border-neutral-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="ml-4 h-5 w-64 bg-neutral-100 rounded" />
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                {/* Mock sidebar */}
                <div className="hidden lg:block space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-neutral-100" />
                      <div className={`h-3 rounded bg-neutral-100 ${i === 0 ? 'w-20' : i === 1 ? 'w-16' : 'w-14'}`} />
                    </div>
                  ))}
                </div>
                {/* Mock content */}
                <div className="col-span-4 lg:col-span-3 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {['Active Employees', 'Tasks Today', 'Approvals'].map((label, i) => (
                      <div key={i} className="rounded-lg border border-neutral-100 p-4">
                        <div className="text-xs text-neutral-400 mb-1">{label}</div>
                        <div className="text-xl font-bold text-neutral-900">
                          {i === 0 ? '6' : i === 1 ? '47' : '3'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-neutral-100 p-4 space-y-3">
                    {['Nova completed proposal for CloudVault', 'Atlas synced 47 contacts via HubSpot', 'Approval needed: Apex contract > $25k'].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className="text-sm text-neutral-600">{text}</span>
                        <span className="ml-auto text-xs text-neutral-400">{i === 0 ? '2m ago' : i === 1 ? '5m ago' : '12m ago'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{metric.value}</div>
                <div className="mt-1 text-sm text-neutral-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Everything you need to run an AI workforce
            </h2>
            <p className="mt-4 text-neutral-500">
              From hiring to monitoring, approvals to analytics — one platform to manage it all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-neutral-700" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-neutral-500">
              No complex setup. No training data required. Just define the role and go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="text-4xl font-bold text-neutral-200 mb-3">
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-xl sm:text-2xl font-medium text-neutral-900 leading-relaxed">
            &ldquo;We replaced three outsourced teams with JourneyMan AI employees.
            They run 24/7, escalate the right issues, and cost a fraction of what we
            were paying.&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="text-sm font-medium text-neutral-900">Sarah Chen</p>
            <p className="text-sm text-neutral-500">VP of Operations, TechForward Inc.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-neutral-500">
              Start free. Scale as your AI workforce grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-neutral-900 bg-white ring-1 ring-neutral-900'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-flex self-start items-center rounded-full bg-neutral-900 text-white px-3 py-1 text-xs font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-neutral-500">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Enterprise' ? '#' : '/signup'}
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Ready to build your AI workforce?
          </h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            Start with a free trial. No credit card required. Your first AI employee
            can be working in under 5 minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 text-neutral-700 px-6 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
