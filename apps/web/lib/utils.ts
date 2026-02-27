import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    Operations: 'from-brand-500 to-brand-700',
    Executive: 'from-violet-500 to-violet-700',
    Sales: 'from-accent-500 to-accent-700',
    'Customer Success': 'from-success-500 to-emerald-700',
    Marketing: 'from-pink-500 to-pink-700',
    HR: 'from-amber-500 to-amber-700',
    Finance: 'from-teal-500 to-teal-700',
    Strategy: 'from-indigo-500 to-indigo-700',
  };
  return colors[department] || 'from-surface-500 to-surface-700';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-success-500 bg-success-500/10',
    onboarding: 'text-brand-400 bg-brand-500/10',
    supervised: 'text-warning-500 bg-warning-500/10',
    paused: 'text-surface-400 bg-surface-500/10',
    terminated: 'text-destructive-500 bg-destructive-500/10',
  };
  return colors[status] || 'text-surface-400 bg-surface-500/10';
}

export function getTaskStatusColor(status: string): string {
  const colors: Record<string, string> = {
    queued: 'text-surface-400 bg-surface-500/10',
    planning: 'text-brand-400 bg-brand-500/10',
    in_progress: 'text-accent-400 bg-accent-500/10',
    awaiting_approval: 'text-warning-500 bg-warning-500/10',
    awaiting_input: 'text-amber-400 bg-amber-500/10',
    escalated: 'text-destructive-400 bg-destructive-500/10',
    completed: 'text-success-500 bg-success-500/10',
    failed: 'text-destructive-500 bg-destructive-500/10',
  };
  return colors[status] || 'text-surface-400 bg-surface-500/10';
}
