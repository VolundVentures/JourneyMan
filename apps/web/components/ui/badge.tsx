import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-600 border border-neutral-300',
        secondary: 'bg-neutral-50 text-neutral-500 border border-neutral-200',
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-600 border border-amber-200',
        destructive: 'bg-red-50 text-red-600 border border-red-200',
        accent: 'bg-neutral-100 text-neutral-700 border border-neutral-300',
        outline: 'bg-transparent text-neutral-500 border border-neutral-300',
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
