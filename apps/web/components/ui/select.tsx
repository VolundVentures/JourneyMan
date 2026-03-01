'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ options, value, onChange, placeholder = 'Select...', className, disabled }: SelectProps) {
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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between w-full h-10 px-3 py-2 rounded-lg border text-sm transition-colors',
          'border-neutral-300 bg-white text-neutral-900',
          'hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400',
          disabled && 'opacity-50 cursor-not-allowed',
          !selected && 'text-neutral-400'
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn('w-4 h-4 text-neutral-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border border-neutral-200 bg-white shadow-xl animate-fade-in overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-thin py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors',
                  option.value === value
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                )}
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className="truncate">{option.label}</p>
                  {option.description && (
                    <p className="text-xs text-neutral-500 truncate">{option.description}</p>
                  )}
                </div>
                {option.value === value && <Check className="w-4 h-4 text-neutral-500 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
