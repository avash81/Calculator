'use client';
import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export interface ResultData {
  label: string;
  value: string | number;
  description?: string | React.ReactNode;
  color?: string; // Tailwind text color class, e.g., 'text-blue-600'
  bgColor?: string; // Tailwind bg color class, e.g., 'bg-blue-50'
}

export interface ResultDisplayProps {
  title: string;
  primaryResult: ResultData;
  secondaryResults?: ResultData[];
  onShare?: () => void;
  className?: string;
}

/**
 * ResultDisplay — A high-aesthetics, fully accessible result showcase component.
 * Features ARIA live regions for real-time calculation updates and premium visual hierarchy.
 */
export function ResultDisplay({
  title,
  primaryResult,
  secondaryResults = [],
  onShare,
  className = '',
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${title}: ${primaryResult.value} ${typeof primaryResult.description === 'string' ? primaryResult.description : ''}\n` +
      secondaryResults.map(r => `${r.label}: ${r.value}`).join('\n') + 
      `\nCalculated on CalcPro.NP`;
      
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Result Showcase */}
      <div 
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`relative overflow-hidden rounded-[2.5rem] p-10 text-center shadow-2xl transition-all duration-500 hover:scale-[1.02] 
                      ${primaryResult.bgColor || 'bg-blue-600'} 
                      ${primaryResult.color || 'text-white'}`}
      >
        
        {/* Actions Hub */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <button
            onClick={handleCopy}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
            aria-label={copied ? "Result Copied" : "Copy results to clipboard"}
            title="Copy Result"
          >
            {copied ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
          </button>
          {onShare && (
            <button
              onClick={onShare}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
              aria-label="Share current results"
              title="Share Result"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">
          {primaryResult.label}
        </div>
        
        <div className="text-6xl sm:text-7xl font-black mb-4 tracking-tighter break-words font-mono">
          {primaryResult.value}
        </div>
        
        {primaryResult.description && (
          <div className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 bg-black/10 rounded-2xl inline-block border border-white/5">
            {primaryResult.description}
          </div>
        )}
      </div>

      {/* Secondary Intelligence Grid */}
      {secondaryResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaryResults.map((res, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-[2rem] border transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50
                         ${res.bgColor || 'bg-white dark:bg-gray-950'} 
                         ${res.color || 'text-gray-900 dark:text-gray-100'} 
                         border-gray-100 dark:border-gray-800 shadow-sm`}
            >
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 opacity-60">
                {res.label}
              </div>
              <div className="text-xl font-black truncate font-mono text-cp-primary">
                {res.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
