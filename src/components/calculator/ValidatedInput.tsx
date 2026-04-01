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
    <div className="space-y-2 group">
      {variant !== 'minimal' && (
        <div className="flex justify-between items-baseline px-1">
          <label 
            htmlFor={inputId}
            className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest"
          >
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
          {hint && (
            <span id={hintId} className="text-[10px] font-bold text-gray-400">
              {hint}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm pointer-events-none">
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
          className={`w-full ${variant === 'minimal' ? 'h-12' : 'h-14'} ${prefix ? 'pl-14' : 'pl-5'} ${suffix ? 'pr-14' : 'pr-5'} 
                       py-3 rounded-2xl font-black ${variant === 'minimal' ? 'text-sm' : 'text-lg'}
                       border-2 transition-all outline-none
                       bg-white dark:bg-gray-950
                       ${hasError
                         ? 'border-red-500 bg-red-50/30 dark:bg-red-900/10'
                         : 'border-gray-100 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-600 shadow-sm'
                       }`}
        />

        {suffix && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Real-time Validation Feedback */}
      {hasError && (
        <div id={errorId} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-red-600 px-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error || `Must be between ${min.toLocaleString()} and ${max.toLocaleString()}`}</span>
        </div>
      )}

      {/* Value Formatter Hub */}
      {formatter && isValid && (
        <div className="flex justify-between items-center px-1 animate-in fade-in">
          <span className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Formatted Value</span>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400">
            {displayValue}
          </span>
        </div>
      )}
    </div>
  );
}
