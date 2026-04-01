'use client';
import React from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  title?: string;
  shareUrl?: string;
  copyValue?: string;
}

const COLORS = {
  blue: 'from-blue-600 to-indigo-600 shadow-blue-500/20 text-white',
  green: 'from-emerald-600 to-teal-600 shadow-emerald-500/20 text-white',
  red: 'from-rose-600 to-pink-600 shadow-rose-500/20 text-white',
  yellow: 'from-amber-500 to-orange-500 shadow-amber-500/20 text-white',
  purple: 'from-violet-600 to-fuchsia-600 shadow-violet-500/20 text-white',
  gray: 'from-gray-700 to-gray-900 shadow-gray-500/20 text-white',
};

/**
 * ResultCard — High-aesthetics result display for Phase 4+ optimizations.
 * Focused on "Wow" factor and instant clarity.
 */
export function ResultCard({
  label,
  value,
  unit = '',
  color = 'blue',
  title,
  shareUrl,
  copyValue
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyValue && typeof value !== 'string' && typeof value !== 'number') return;
    navigator.clipboard.writeText(copyValue || String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${COLORS[color]} p-8 sm:p-10 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]`}>
      {/* Decorative background shape */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      
      <div className="relative flex flex-col items-center text-center space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
          {label}
        </span>
        
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-6xl font-black tracking-tighter">
            {value.toLocaleString()}
          </span>
          {unit && (
            <span className="text-xl sm:text-2xl font-bold opacity-60">
              {unit}
            </span>
          )}
        </div>

        {title && (
          <div className="rounded-full bg-white/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            {title} Verified
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button 
            onClick={handleCopy}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
            title="Copy Result"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          
          {shareUrl && (
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
              title="Share Result"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
