'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function Switch({ checked, onCheckedChange, disabled = false, className, size = 'md' }: SwitchProps) {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'translate-x-5' },
  };

  const s = sizeClasses[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-neutral-50' : 'bg-neutral-700',
        disabled && 'opacity-50 cursor-not-allowed',
        s.track,
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full shadow-sm transition-transform duration-200',
          checked ? `${s.translate} bg-neutral-900` : 'translate-x-0.5 bg-neutral-400',
          s.thumb,
          'mt-0.5'
        )}
      />
    </button>
  );
}
