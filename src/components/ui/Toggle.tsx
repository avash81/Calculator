'use client';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
  className,
}: ToggleProps) {
  return (
    <div className={twMerge('flex items-center justify-between gap-4 p-3 rounded-xl border border-cp-border bg-cp-surface', className)}>
      <div className="flex flex-col gap-0.5">
        {label && <span className="text-sm font-bold text-cp-text">{label}</span>}
        {description && <span className="text-[10px] text-cp-text-muted uppercase tracking-widest">{description}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cp-blue focus:ring-offset-2',
          checked ? 'bg-cp-blue' : 'bg-gray-200'
        )}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
