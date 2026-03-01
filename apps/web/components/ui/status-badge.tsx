import { cn } from '@/lib/utils';
import type { EmployeeStatus } from '@journeyman/shared';

interface StatusBadgeProps {
  status: EmployeeStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const statusConfig: Record<EmployeeStatus, { label: string; dotClass: string; badgeClass: string }> = {
  active: {
    label: 'Active',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  onboarding: {
    label: 'Onboarding',
    dotClass: 'bg-neutral-400',
    badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  },
  supervised: {
    label: 'Supervised',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  paused: {
    label: 'Paused',
    dotClass: 'bg-neutral-600',
    badgeClass: 'bg-neutral-50 text-neutral-500 border-neutral-200',
  },
  terminated: {
    label: 'Terminated',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-50 text-red-600 border-red-200',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizeClasses[size],
        config.badgeClass
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full',
            dotSizes[size],
            config.dotClass
          )}
        />
      )}
      {config.label}
    </span>
  );
}
