'use client';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (val: number) => string;
  onChange: (val: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  formatValue,
  onChange,
  className,
  ...props
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-end">
        {label && (
          <label className="form-label mb-0">
            {label}
          </label>
        )}
        <div className="text-sm font-bold text-cp-blue font-mono">
          {formatValue ? formatValue(value) : value} {unit}
        </div>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={twMerge('w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer outline-none', className)}
          style={{
            background: `linear-gradient(to right, #1B4FBD 0%, #1B4FBD ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
          {...props}
        />
      </div>
    </div>
  );
}
