import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:from-brand-400 hover:to-brand-500 hover:shadow-brand-500/40 active:from-brand-600 active:to-brand-700',
        destructive:
          'bg-destructive-500 text-white shadow-lg shadow-destructive-500/25 hover:bg-destructive-400 hover:shadow-destructive-500/40',
        outline:
          'border border-surface-700 bg-transparent text-surface-200 hover:bg-surface-800 hover:text-surface-100 hover:border-surface-600',
        secondary:
          'bg-surface-800 text-surface-200 hover:bg-surface-700 hover:text-surface-100',
        ghost:
          'text-surface-400 hover:bg-surface-800 hover:text-surface-200',
        link: 'text-brand-400 underline-offset-4 hover:underline hover:text-brand-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
