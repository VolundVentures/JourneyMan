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

export function getTaskStatusColor(status: string): string {
  const colors: Record<string, string> = {
    queued: 'text-neutral-500 bg-neutral-800',
    planning: 'text-neutral-300 bg-neutral-800',
    in_progress: 'text-neutral-200 bg-neutral-800',
    awaiting_approval: 'text-amber-400 bg-amber-950/50',
    awaiting_input: 'text-neutral-300 bg-neutral-800',
    escalated: 'text-red-400 bg-red-950/50',
    completed: 'text-emerald-400 bg-emerald-950/50',
    failed: 'text-red-400 bg-red-950/50',
  };
  return colors[status] || 'text-neutral-400 bg-neutral-800';
}

// Emoji avatars for AI employees
export const employeeEmojis: Record<string, string> = {
  'emp-001': '🗺️',  // Atlas - Operations
  'emp-002': '✨',  // Nova - Executive
  'emp-003': '🎯',  // Apex - Sales
  'emp-004': '🔮',  // Sage - Research
  'emp-005': '🔥',  // Ember - CS
  'emp-006': '⚡',  // Flux - Content
};
