import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
        secondary: 'bg-surface-800 text-surface-300 border border-surface-700',
        success: 'bg-success-500/10 text-success-400 border border-success-500/20',
        warning: 'bg-warning-500/10 text-warning-400 border border-warning-500/20',
        destructive: 'bg-destructive-500/10 text-destructive-400 border border-destructive-500/20',
        accent: 'bg-accent-500/10 text-accent-400 border border-accent-500/20',
        outline: 'bg-transparent text-surface-300 border border-surface-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
