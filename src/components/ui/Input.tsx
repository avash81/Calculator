'use client';
import { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  unit?: string;
  error?: string;
  helpText?: string;
  onChange?: (value: string) => void;
}

export function Input({
  label,
  unit,
  error,
  helpText,
  onChange,
  className,
  value,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={twMerge(
            clsx(
              'form-input',
              unit && 'pr-14',
              error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]',
              className
            )
          )}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
        {unit && (
          <div className="unit-label">
            {unit}
          </div>
        )}
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
