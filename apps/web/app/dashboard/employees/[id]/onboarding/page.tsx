'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  BookOpen, Plug, Target, MessageSquare, Shield, Rocket,
  CheckCircle, Circle, ChevronRight, ThumbsUp, ThumbsDown, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
}

const steps: OnboardingStep[] = [
  { id: 'knowledge', title: 'Knowledge Ingestion', description: 'Upload and process knowledge base documents', icon: BookOpen, status: 'completed', progress: 100 },
  { id: 'integrations', title: 'Integration Testing', description: 'Verify connectivity to all assigned tools', icon: Plug, status: 'completed', progress: 100 },
  { id: 'calibration', title: 'Calibration Tasks', description: 'Complete supervised sample tasks for training', icon: Target, status: 'in_progress', progress: 60 },
  { id: 'communication', title: 'Communication Calibration', description: 'Rate and refine communication style', icon: MessageSquare, status: 'pending', progress: 0 },
  { id: 'escalation', title: 'Escalation Boundary Testing', description: 'Validate escalation behavior with edge cases', icon: Shield, status: 'pending', progress: 0 },
  { id: 'golive', title: 'Go Live', description: 'Final readiness assessment and launch', icon: Rocket, status: 'pending', progress: 0 },
];

const calibrationTasks = [
  { id: 'cal-1', title: 'Draft vendor follow-up email', status: 'graded', grade: 'pass', feedback: 'Good tone and follow-up timing' },
  { id: 'cal-2', title: 'Prepare meeting summary', status: 'graded', grade: 'pass', feedback: 'Comprehensive and well-structured' },
  { id: 'cal-3', title: 'Handle pricing objection', status: 'pending_review', grade: null, feedback: null },
  { id: 'cal-4', title: 'Escalation decision scenario', status: 'not_started', grade: null, feedback: null },
  { id: 'cal-5', title: 'Complex multi-step task', status: 'not_started', grade: null, feedback: null },
];

export default function OnboardingPage() {
  const params = useParams();
  const employee = mockEmployees.find((e) => e.id === params.id);
  const [activeStep, setActiveStep] = useState('calibration');
  const [feedback, setFeedback] = useState('');

  if (!employee) {
    return <div className="text-neutral-500">Employee not found</div>;
  }

  const emoji = employeeEmojis[employee.id] || '🤖';
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const overallProgress = Math.round((completedSteps / steps.length) * 100 + (steps.find((s) => s.status === 'in_progress')?.progress || 0) / steps.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Onboarding: {employee.name}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {employee.roleTitle} · {employee.department}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-neutral-900">{overallProgress}%</p>
              <p className="text-xs text-neutral-500">Complete</p>
            </div>
            <Progress value={overallProgress} className="w-32" indicatorClassName="bg-emerald-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step sidebar */}
        <div className="space-y-2">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  'flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors',
                  activeStep === step.id ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50',
                )}
              >
                <div className="relative shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : step.status === 'in_progress' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{step.title}</p>
                  {step.status === 'in_progress' && (
                    <p className="text-[10px] text-amber-600">{step.progress}%</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Calibration Tasks
            </CardTitle>
            <p className="text-sm text-neutral-500">
              Complete supervised sample tasks. Grade each output to train {employee.name}&apos;s judgment.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calibrationTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 bg-white/50">
                  <div className="shrink-0">
                    {task.status === 'graded' && task.grade === 'pass' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : task.status === 'pending_review' ? (
                      <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-800 flex items-center justify-center">
                        <span className="text-[10px] text-amber-600">!</span>
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">{task.title}</p>
                    {task.feedback && (
                      <p className="text-xs text-neutral-500 mt-0.5">{task.feedback}</p>
                    )}
                  </div>
                  {task.status === 'pending_review' && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button size="sm">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-3 h-3" /> Review
                      </Button>
                    </div>
                  )}
                  {task.status === 'graded' && (
                    <Badge variant={task.grade === 'pass' ? 'default' : 'destructive'}>
                      {task.grade}
                    </Badge>
                  )}
                  {task.status === 'not_started' && (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              ))}

              <div className="border-t border-neutral-200 pt-4">
                <p className="text-xs text-neutral-500 mb-2">Add feedback for this calibration round:</p>
                <div className="flex gap-2">
                  <Input
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g., Be more concise in vendor emails..."
                  />
                  <Button variant="outline">Save Feedback</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
