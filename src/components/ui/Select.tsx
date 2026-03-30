'use client';
import { SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: { label: string; value: string | number }[];
  error?: string;
  helpText?: string;
  onChange?: (value: string) => void;
}

export function Select({
  label,
  options,
  error,
  helpText,
  onChange,
  className,
  value,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={twMerge(
            clsx(
              'form-input appearance-none bg-no-repeat bg-[right_12px_center] bg-[length:16px_16px]',
              error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
              className
            )
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`
          }}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-xs text-cp-text-muted mt-1">{helpText}</p>
      )}
    </div>
  );
}
