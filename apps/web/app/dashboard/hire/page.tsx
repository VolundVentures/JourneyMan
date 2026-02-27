'use client';

import { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Zap,
  Sparkles,
  Clock,
  Globe,
  Users,
} from 'lucide-react';
import { cn, getDepartmentColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { mockTemplates } from '@/lib/mock-data';
import type { RoleTemplate } from '@journeyman/shared';

const steps = [
  { label: 'Choose Role', description: 'Select a template' },
  { label: 'Customize', description: 'Configure details' },
  { label: 'Review & Deploy', description: 'Confirm and hire' },
];

export default function HirePage() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(null);
  const [employeeName, setEmployeeName] = useState('');
  const [tone, setTone] = useState<string>('professional');
  const [proactivity, setProactivity] = useState<string>('high');
  const [autonomy, setAutonomy] = useState<string>('supervised');
  const [trialDays, setTrialDays] = useState('14');
  const [hired, setHired] = useState(false);

  const handleSelectTemplate = (template: RoleTemplate) => {
    setSelectedTemplate(template);
    setTone(template.defaultConfig.communicationTone || 'professional');
    setProactivity(template.defaultConfig.proactivityLevel || 'high');
    setAutonomy(template.defaultConfig.autonomyMode || 'supervised');
    setStep(1);
  };

  const handleHire = () => {
    setHired(true);
  };

  if (hired) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success-500/10 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-success-400" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-surface-50 mb-2">
          {employeeName || 'Your AI Employee'} Has Been Hired!
        </h1>
        <p className="text-surface-400 text-center max-w-md mb-8">
          Your new {selectedTemplate?.name} is being onboarded. They&apos;ll start in supervised mode for {trialDays} days.
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setHired(false); setStep(0); setSelectedTemplate(null); setEmployeeName(''); }}>
            Hire Another
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-50">Hire New Employee</h1>
        <p className="mt-1 text-sm text-surface-400">Deploy an AI employee in under 3 minutes</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => { if (i < step) setStep(i); }}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                i === step
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                  : i < step
                  ? 'text-success-400 cursor-pointer hover:bg-surface-800'
                  : 'text-surface-600'
              )}
            >
              <span className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                i === step
                  ? 'bg-brand-500 text-white'
                  : i < step
                  ? 'bg-success-500 text-white'
                  : 'bg-surface-800 text-surface-500'
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-surface-700" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Template */}
      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
          {mockTemplates.map((template) => {
            const gradient = getDepartmentColor(template.department);
            return (
              <div
                key={template.id}
                className="group relative rounded-xl border border-surface-800/50 bg-surface-800/30 overflow-hidden hover:border-surface-700/50 hover:bg-surface-800/50 transition-all duration-300 cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className={cn('h-2 bg-gradient-to-r', gradient)} />
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', gradient)}>
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-surface-100">{template.name}</h3>
                      <Badge variant="secondary">{template.department}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-surface-400 leading-relaxed">{template.description}</p>

                  <div className="space-y-1.5">
                    <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Capabilities</p>
                    <div className="space-y-1">
                      {template.capabilities.slice(0, 4).map((cap) => (
                        <div key={cap.name} className="flex items-center gap-2 text-sm text-surface-400">
                          <Check className="w-3.5 h-3.5 text-success-400 shrink-0" />
                          <span>{cap.name}</span>
                        </div>
                      ))}
                      {template.capabilities.length > 4 && (
                        <p className="text-xs text-surface-500">+{template.capabilities.length - 4} more</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {template.defaultIntegrations.map((int) => (
                      <Badge key={int} variant="outline">{int.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>

                  <Button className="w-full group-hover:from-brand-400 group-hover:to-brand-500">
                    Select This Role
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Customize */}
      {step === 1 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Configure Your {selectedTemplate.name}</CardTitle>
              <CardDescription>Personalize your AI employee&apos;s identity and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Employee Name</label>
                  <Input
                    placeholder="Give your AI employee a name (e.g., Atlas, Nova, Sage)"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Communication Tone</label>
                  <div className="space-y-2">
                    {(['professional', 'casual', 'formal'] as const).map((t) => (
                      <label key={t} className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                        tone === t ? 'border-brand-500/50 bg-brand-500/5' : 'border-surface-700 hover:border-surface-600'
                      )}>
                        <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                        <div className={cn('w-4 h-4 rounded-full border-2', tone === t ? 'border-brand-500 bg-brand-500' : 'border-surface-600')} />
                        <span className="text-sm text-surface-300 capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Proactivity Level</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', desc: 'Only acts when explicitly asked' },
                      { value: 'medium', desc: 'Surfaces high-confidence opportunities' },
                      { value: 'high', desc: 'Actively monitors and suggests improvements' },
                    ].map((p) => (
                      <label key={p.value} className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                        proactivity === p.value ? 'border-brand-500/50 bg-brand-500/5' : 'border-surface-700 hover:border-surface-600'
                      )}>
                        <input type="radio" name="proactivity" value={p.value} checked={proactivity === p.value} onChange={() => setProactivity(p.value)} className="sr-only" />
                        <div className={cn('w-4 h-4 rounded-full border-2 mt-0.5 shrink-0', proactivity === p.value ? 'border-brand-500 bg-brand-500' : 'border-surface-600')} />
                        <div>
                          <span className="text-sm text-surface-300 capitalize">{p.value}</span>
                          <p className="text-xs text-surface-500 mt-0.5">{p.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Trial Period</label>
                  <select
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days (recommended)</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={() => setStep(2)}>
              Next: Review
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Deploy */}
      {step === 2 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Review & Deploy</CardTitle>
              <CardDescription>Confirm your AI employee configuration before hiring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-800/50 border border-surface-700/50">
                <Avatar name={employeeName || 'AI'} department={selectedTemplate.department} size="lg" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-surface-100">
                    {employeeName || 'Unnamed Employee'}
                  </h3>
                  <p className="text-sm text-surface-400">{selectedTemplate.name} · {selectedTemplate.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-800/30">
                  <Settings2 className="w-4 h-4 text-brand-400" />
                  <div>
                    <p className="text-xs text-surface-500">Tone</p>
                    <p className="text-sm text-surface-200 capitalize">{tone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-800/30">
                  <Zap className="w-4 h-4 text-accent-400" />
                  <div>
                    <p className="text-xs text-surface-500">Proactivity</p>
                    <p className="text-sm text-surface-200 capitalize">{proactivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-800/30">
                  <Users className="w-4 h-4 text-success-400" />
                  <div>
                    <p className="text-xs text-surface-500">Autonomy</p>
                    <p className="text-sm text-surface-200 capitalize">{autonomy.replace(/-/g, ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-800/30">
                  <Clock className="w-4 h-4 text-warning-400" />
                  <div>
                    <p className="text-xs text-surface-500">Trial Period</p>
                    <p className="text-sm text-surface-200">{trialDays} days</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.capabilities.map((cap) => (
                    <Badge key={cap.name} variant="secondary">
                      <Check className="w-3 h-3 mr-1 text-success-400" />
                      {cap.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Required Integrations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.defaultIntegrations.map((int) => (
                    <Badge key={int} variant="outline">
                      <Globe className="w-3 h-3 mr-1" />
                      {int.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button size="lg" onClick={handleHire} className="px-8">
              <Sparkles className="w-5 h-5" />
              Hire {employeeName || 'AI Employee'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
