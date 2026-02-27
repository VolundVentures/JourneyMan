import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
        secondary: 'bg-neutral-800/50 text-neutral-400 border border-neutral-800',
        success: 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50',
        warning: 'bg-amber-950/50 text-amber-400 border border-amber-900/50',
        destructive: 'bg-red-950/50 text-red-400 border border-red-900/50',
        accent: 'bg-neutral-800 text-neutral-200 border border-neutral-700',
        outline: 'bg-transparent text-neutral-400 border border-neutral-700',
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
