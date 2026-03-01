'use client';

import { useState, useEffect } from 'react';
import {
  Check, ChevronRight, ChevronLeft, Settings2, Zap, Sparkles,
  Clock, Globe, Users, Search, MessageSquare, Shield, Loader2,
  CheckCircle, Plug, BookOpen, Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { mockTemplates } from '@/lib/mock-data';
import type { RoleTemplate } from '@journeyman/shared';

const steps = [
  { label: 'Role Discovery', description: 'Choose or describe a role' },
  { label: 'Identity & Personality', description: 'Name, avatar, personality' },
  { label: 'Configuration', description: 'Capabilities & behavior' },
  { label: 'Access & Permissions', description: 'Integrations & limits' },
  { label: 'Review & Deploy', description: 'Confirm and hire' },
];

const emojiOptions = ['🗺️', '✨', '🎯', '🔮', '🔥', '⚡', '🌟', '🚀', '💎', '🎭', '🧠', '🌊', '🎪', '🏰', '🔱', '⭐', '🌈', '🎨'];

const personalityTemplates = [
  { name: 'The Diplomat', desc: 'Warm, empathetic, conflict-averse', values: { warmth: 9, precision: 6, initiative: 5, creativity: 6, directness: 3, adaptability: 9 } },
  { name: 'The Analyst', desc: 'Precise, thorough, data-driven', values: { warmth: 4, precision: 10, initiative: 6, creativity: 5, directness: 7, adaptability: 5 } },
  { name: 'The Closer', desc: 'Direct, confident, results-oriented', values: { warmth: 6, precision: 7, initiative: 9, creativity: 7, directness: 9, adaptability: 6 } },
  { name: 'The Creator', desc: 'Creative, innovative, exploratory', values: { warmth: 7, precision: 5, initiative: 8, creativity: 10, directness: 5, adaptability: 8 } },
];

const deploymentStages = [
  { label: 'Provisioning identity', icon: Users },
  { label: 'Connecting integrations', icon: Plug },
  { label: 'Loading knowledge base', icon: BookOpen },
  { label: 'Running calibration', icon: Settings2 },
  { label: 'Ready!', icon: CheckCircle },
];

export default function HirePage() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(null);
  const [roleDescription, setRoleDescription] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');
  const [tone, setTone] = useState<string>('professional');
  const [proactivity, setProactivity] = useState<string>('high');
  const [autonomy, setAutonomy] = useState<string>('supervised');
  const [trialDays, setTrialDays] = useState('14');
  const [searchQuery, setSearchQuery] = useState('');

  // Personality sliders
  const [personality, setPersonality] = useState({
    warmth: 7, precision: 7, initiative: 6, creativity: 5, directness: 5, adaptability: 7,
  });

  // Access & Permissions
  const [permissions, setPermissions] = useState({
    emailsPerDay: 50,
    apiCallsPerDay: 1000,
    maxCostPerAction: 10,
    requireApprovalAbove: 100,
  });

  const [integrationScopes, setIntegrationScopes] = useState<Record<string, 'read' | 'read_write'>>({});

  // Deployment
  const [deploying, setDeploying] = useState(false);
  const [deployStage, setDeployStage] = useState(0);
  const [hired, setHired] = useState(false);

  const handleSelectTemplate = (template: RoleTemplate) => {
    setSelectedTemplate(template);
    setTone(template.defaultConfig.communicationTone || 'professional');
    setProactivity(template.defaultConfig.proactivityLevel || 'high');
    setAutonomy(template.defaultConfig.autonomyMode || 'supervised');
    const scopes: Record<string, 'read' | 'read_write'> = {};
    template.defaultIntegrations.forEach((i) => { scopes[i] = 'read_write'; });
    setIntegrationScopes(scopes);
    setStep(1);
  };

  const applyPersonalityTemplate = (values: Record<string, number>) => {
    setPersonality(values as typeof personality);
  };

  const handleDeploy = () => {
    setDeploying(true);
    setDeployStage(0);
  };

  useEffect(() => {
    if (deploying && deployStage < deploymentStages.length - 1) {
      const timer = setTimeout(() => setDeployStage((s) => s + 1), 1200);
      return () => clearTimeout(timer);
    }
    if (deploying && deployStage === deploymentStages.length - 1) {
      const timer = setTimeout(() => { setDeploying(false); setHired(true); }, 800);
      return () => clearTimeout(timer);
    }
  }, [deploying, deployStage]);

  // Deployment animation
  if (deploying) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <span className="text-6xl mb-6">{selectedEmoji}</span>
        <h2 className="text-xl font-bold text-neutral-900 mb-8">Deploying {employeeName || 'Your AI Employee'}...</h2>
        <div className="w-full max-w-sm space-y-4">
          {deploymentStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={i} className={cn(
                'flex items-center gap-3 py-2 transition-all duration-500',
                i <= deployStage ? 'opacity-100' : 'opacity-30'
              )}>
                {i < deployStage ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : i === deployStage ? (
                  <Loader2 className="w-5 h-5 text-neutral-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-neutral-300 shrink-0" />
                )}
                <span className={cn(
                  'text-sm',
                  i <= deployStage ? 'text-neutral-700' : 'text-neutral-400'
                )}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={(deployStage / (deploymentStages.length - 1)) * 100} className="w-full max-w-sm mt-6" indicatorClassName="bg-emerald-400" />
      </div>
    );
  }

  if (hired) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <span className="text-7xl mb-6">{selectedEmoji}</span>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {employeeName || 'Your AI Employee'} Has Been Hired!
        </h1>
        <p className="text-neutral-500 text-center max-w-md mb-8">
          Your new {selectedTemplate?.name} is ready. They&apos;ll start in supervised mode for {trialDays} days before autonomy assessment.
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={() => window.location.href = `/dashboard/employees`}>
            View Team
          </Button>
          <Button variant="outline" onClick={() => { setHired(false); setStep(0); setSelectedTemplate(null); setEmployeeName(''); }}>
            Hire Another
          </Button>
        </div>
      </div>
    );
  }

  const filteredTemplates = mockTemplates.filter((t) =>
    searchQuery === '' ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Hire New Employee</h1>
        <p className="mt-1 text-sm text-neutral-500">Deploy an AI employee with a real identity, personality, and purpose</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <button
              onClick={() => { if (i < step) setStep(i); }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                i === step ? 'bg-neutral-100 text-neutral-900 border border-neutral-300' :
                i < step ? 'text-neutral-600 cursor-pointer hover:bg-neutral-100' : 'text-neutral-400'
              )}
            >
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                i === step ? 'bg-neutral-900 text-white' :
                i < step ? 'bg-neutral-300 text-white' : 'bg-neutral-100 text-neutral-500'
              )}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
          </div>
        ))}
      </div>

      {/* Step 0: Role Discovery */}
      {step === 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Describe Your Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neutral-500" />
                Describe Your Role
              </CardTitle>
              <CardDescription>Tell us what you need in plain language. AI will generate a role configuration.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="e.g., I need someone to handle all inbound customer support emails, triage tickets, and resolve common issues without human intervention..."
                className="w-full h-28 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
              />
              <Button className="mt-3" disabled={!roleDescription.trim()}>
                <Sparkles className="w-4 h-4" />
                Generate Role from Description
              </Button>
            </CardContent>
          </Card>

          {/* Or browse templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Or Choose a Template</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="pl-9 h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group rounded-xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 transition-colors cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-neutral-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800 text-sm">{template.name}</h3>
                        <Badge variant="secondary" className="text-[10px]">{template.department}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{template.description}</p>
                    <div className="space-y-1">
                      {template.capabilities.slice(0, 3).map((cap) => (
                        <div key={cap.name} className="flex items-center gap-2 text-xs text-neutral-500">
                          <Check className="w-3 h-3 text-neutral-400 shrink-0" />
                          {cap.name}
                        </div>
                      ))}
                      {template.capabilities.length > 3 && (
                        <p className="text-[10px] text-neutral-400">+{template.capabilities.length - 3} more</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Identity & Personality */}
      {step === 1 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Identity & Personality</CardTitle>
              <CardDescription>Give your AI employee a unique identity and personality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name & Avatar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Employee Name</label>
                  <Input placeholder="e.g., Atlas, Nova, Sage..." value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Avatar Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={cn(
                          'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                          selectedEmoji === emoji ? 'bg-neutral-200 ring-2 ring-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personality Templates */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Personality Templates</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {personalityTemplates.map((pt) => (
                    <button
                      key={pt.name}
                      onClick={() => applyPersonalityTemplate(pt.values)}
                      className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 text-left transition-colors"
                    >
                      <p className="text-sm font-medium text-neutral-700">{pt.name}</p>
                      <p className="text-[10px] text-neutral-500">{pt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality Sliders */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-3">Personality Dimensions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(personality) as (keyof typeof personality)[]).map((dim) => (
                    <Slider
                      key={dim}
                      label={dim.charAt(0).toUpperCase() + dim.slice(1)}
                      value={personality[dim]}
                      onChange={(v) => setPersonality((p) => ({ ...p, [dim]: v }))}
                      min={1}
                      max={10}
                      showValue
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={() => setStep(2)}>
              Next: Configuration <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Configuration</CardTitle>
              <CardDescription>Tune how your AI employee operates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Communication Tone</label>
                  <div className="space-y-2">
                    {(['professional', 'casual', 'formal'] as const).map((t) => (
                      <label key={t} className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        tone === t ? 'border-neutral-300 bg-neutral-100' : 'border-neutral-200 hover:border-neutral-300'
                      )}>
                        <input type="radio" name="tone" value={t} checked={tone === t} onChange={() => setTone(t)} className="sr-only" />
                        <div className={cn('w-4 h-4 rounded-full border-2', tone === t ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300')} />
                        <span className="text-sm text-neutral-600 capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Proactivity Level</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', desc: 'Only acts when explicitly asked' },
                      { value: 'medium', desc: 'Surfaces high-confidence opportunities' },
                      { value: 'high', desc: 'Actively monitors and suggests improvements' },
                    ].map((p) => (
                      <label key={p.value} className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        proactivity === p.value ? 'border-neutral-300 bg-neutral-100' : 'border-neutral-200 hover:border-neutral-300'
                      )}>
                        <input type="radio" name="proactivity" value={p.value} checked={proactivity === p.value} onChange={() => setProactivity(p.value)} className="sr-only" />
                        <div className={cn('w-4 h-4 rounded-full border-2 mt-0.5 shrink-0', proactivity === p.value ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300')} />
                        <div>
                          <span className="text-sm text-neutral-600 capitalize">{p.value}</span>
                          <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Capabilities</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.capabilities.map((cap) => (
                    <Badge key={cap.name} variant="secondary">
                      <Check className="w-3 h-3 mr-1 text-neutral-500" />
                      {cap.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next: Access & Permissions <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Access & Permissions */}
      {step === 3 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Access & Permissions</CardTitle>
              <CardDescription>Define integration scopes, spending limits, and approval requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Integration Scopes */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-3">Integration Scopes</label>
                <div className="space-y-2">
                  {selectedTemplate.defaultIntegrations.map((int) => (
                    <div key={int} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm text-neutral-700 capitalize">{int.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(['read', 'read_write'] as const).map((scope) => (
                          <button
                            key={scope}
                            onClick={() => setIntegrationScopes((s) => ({ ...s, [int]: scope }))}
                            className={cn(
                              'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                              integrationScopes[int] === scope
                                ? 'bg-neutral-200 text-neutral-700'
                                : 'text-neutral-500 hover:text-neutral-600'
                            )}
                          >
                            {scope === 'read' ? 'Read Only' : 'Read/Write'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spending Limits */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-3">Daily Limits</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Slider label="Emails per day" value={permissions.emailsPerDay} onChange={(v) => setPermissions((p) => ({ ...p, emailsPerDay: v }))} max={200} showValue />
                  <Slider label="API calls per day" value={permissions.apiCallsPerDay} onChange={(v) => setPermissions((p) => ({ ...p, apiCallsPerDay: v }))} max={5000} step={100} showValue />
                  <Slider label="Max $ per action" value={permissions.maxCostPerAction} onChange={(v) => setPermissions((p) => ({ ...p, maxCostPerAction: v }))} max={100} showValue />
                  <Slider label="Require approval above ($)" value={permissions.requireApprovalAbove} onChange={(v) => setPermissions((p) => ({ ...p, requireApprovalAbove: v }))} max={1000} step={10} showValue />
                </div>
              </div>

              {/* Trial Period */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Supervised Trial Period</label>
                <select
                  value={trialDays}
                  onChange={(e) => setTrialDays(e.target.value)}
                  className="w-full max-w-xs rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days (recommended)</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={() => setStep(4)}>
              Next: Review <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Deploy */}
      {step === 4 && selectedTemplate && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Review & Deploy</CardTitle>
              <CardDescription>Confirm your AI employee configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-100 border border-neutral-300">
                <span className="text-4xl">{selectedEmoji}</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800">{employeeName || 'Unnamed Employee'}</h3>
                  <p className="text-sm text-neutral-500">{selectedTemplate.name} · {selectedTemplate.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Settings2, label: 'Tone', value: tone },
                  { icon: Zap, label: 'Proactivity', value: proactivity },
                  { icon: Users, label: 'Autonomy', value: autonomy.replace(/-/g, ' ') },
                  { icon: Clock, label: 'Trial', value: `${trialDays} days` },
                  { icon: Shield, label: 'Max $/action', value: `$${permissions.maxCostPerAction}` },
                  { icon: Globe, label: 'Integrations', value: `${Object.keys(integrationScopes).length} connected` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-100">
                    <item.icon className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="text-[10px] text-neutral-400">{item.label}</p>
                      <p className="text-sm text-neutral-700 capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personality summary */}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Personality Profile</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {Object.entries(personality).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-neutral-700">{val}</div>
                      <p className="text-[10px] text-neutral-500 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.capabilities.map((cap) => (
                    <Badge key={cap.name} variant="secondary">
                      <Check className="w-3 h-3 mr-1 text-neutral-500" />
                      {cap.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button size="lg" onClick={handleDeploy} className="px-8">
              <Sparkles className="w-5 h-5" />
              Deploy {employeeName || 'AI Employee'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
