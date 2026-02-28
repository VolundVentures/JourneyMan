'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({ trigger, children, align = 'end', className }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 min-w-[200px]',
            'rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl',
            'animate-fade-in',
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function PopoverItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:text-neutral-50 hover:bg-neutral-800 transition-colors first:rounded-t-xl last:rounded-b-xl',
        className
      )}
      {...props}
    />
  );
}

export { PopoverItem };
