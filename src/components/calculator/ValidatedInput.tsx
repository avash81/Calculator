'use client';
import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ValidatedInputProps {
  label: string;
  value: number | string;
  onChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  suffix?: string;
  prefix?: string;
  formatter?: (n: number) => string;
  hint?: string;
  required?: boolean;
  variant?: 'default' | 'minimal';
  type?: 'number' | 'text';
}

/**
 * ValidatedInput — A fully accessible, premium input component for Phase 4.
 * Integrates ARIA roles, unique IDs, and real-time validation feedback.
 */
export function ValidatedInput({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  error,
  suffix,
  prefix,
  formatter,
  hint,
  required = false,
  variant = 'default',
  type = 'number',
}: ValidatedInputProps) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isValid = !isNaN(numValue) && numValue >= min && numValue <= max;
  
  const displayValue = formatter && isValid ? formatter(numValue) : value;
  const hasError = !!error || (!isValid && numValue !== 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === 'text') {
      onChange(val);
      return;
    }
    if (val === '') {
      onChange(0);
      return;
    }
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      onChange(numVal);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === 'text') return;
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      onChange(min === -Infinity ? 0 : min);
    } else if (val < min) {
      onChange(min);
    } else if (val > max) {
      onChange(max);
    }
  };

  return (
    <div className="space-y-1 group">
      {variant !== 'minimal' && (
        <div className="flex justify-between items-baseline px-1">
          <label 
            htmlFor={inputId}
            className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight"
          >
            {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
          </label>
          {hint && (
            <span id={hintId} className="text-xs font-medium text-[var(--text-muted)]">
              {hint}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold text-sm pointer-events-none">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          inputMode={type === 'number' ? 'decimal' : 'text'}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          min={type === 'number' && min !== -Infinity ? min : undefined}
          max={type === 'number' && max !== Infinity ? max : undefined}
          step={type === 'number' ? step : undefined}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={`${hint ? hintId : ''} ${hasError ? errorId : ''}`.trim() || undefined}
          className={`w-full ${variant === 'minimal' ? 'h-10' : 'h-11'} ${prefix ? 'pl-10' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'} 
                       py-2 rounded-sm font-bold ${variant === 'minimal' ? 'text-sm' : 'text-[15px]'}
                       border transition-all outline-none
                       bg-white text-[var(--text-main)]
                       ${hasError
                         ? 'border-red-600 bg-red-50'
                         : 'border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--primary-light)]'
                       }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold text-xs pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Real-time Validation Feedback */}
      {hasError && (
        <div id={errorId} className="flex items-center gap-2 text-[11px] font-bold uppercase text-red-600 px-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error || `Required: ${min.toLocaleString()} to ${max.toLocaleString()}`}</span>
        </div>
      )}

      {/* Value Formatter Hub */}
      {formatter && isValid && (
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-bold uppercase text-[var(--text-muted)]">Live Format</span>
          <span className="text-sm font-bold text-[var(--primary)]">
            {displayValue}
          </span>
        </div>
      )}
    </div>
  );
}
