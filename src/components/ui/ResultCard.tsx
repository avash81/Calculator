'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'blue' | 'green' | 'red' | 'neutral' | 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'lg';
  sublabel?: string;
  className?: string;
  icon?: ReactNode;
}

export function ResultCard({
  label,
  value,
  unit,
  variant = 'blue',
  size = 'sm',
  sublabel,
  className,
  icon,
}: ResultCardProps) {
  const variants = {
    blue: 'result-card-main',
    green: 'border-cp-green/20 bg-cp-green-light/30',
    red: 'border-cp-nepal/20 bg-cp-nepal-light/30',
    neutral: 'bg-cp-surface',
    primary: 'result-card-main',
    secondary: 'bg-cp-bg border-cp-border',
    success: 'border-cp-green/20 bg-cp-green-light/30',
    danger: 'border-cp-nepal/20 bg-cp-nepal-light/30',
  };

  const valueColors = {
    blue: 'text-cp-blue',
    green: 'text-cp-green',
    red: 'text-cp-nepal',
    neutral: 'text-cp-text',
    primary: 'text-cp-blue',
    secondary: 'text-cp-text',
    success: 'text-cp-green',
    danger: 'text-cp-nepal',
  };

  return (
    <div className={twMerge(
      clsx(
        'result-card flex flex-col',
        variants[variant as keyof typeof variants],
        className
      )
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="result-label">{label}</span>
        {icon && <div className={twMerge(clsx("opacity-50", valueColors[variant as keyof typeof valueColors]))}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={twMerge(
          clsx(
            'result-value',
            size === 'lg' ? 'text-3xl' : 'text-xl',
            valueColors[variant as keyof typeof valueColors]
          )
        )}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs font-bold text-cp-text-muted uppercase tracking-wider">{unit}</span>}
      </div>
      {sublabel && <span className="text-[10px] font-medium text-cp-text-muted mt-1 uppercase tracking-widest">{sublabel}</span>}
    </div>
  );
}
