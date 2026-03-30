import React from 'react';

interface Props {
  className?: string;
}

export function NepalFlag({ className }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 ${className || ''}`}>
      <span
        className="inline-flex items-center justify-center
                   bg-red-600 text-white text-[10px] font-bold
                   px-1.5 py-0.5 rounded-sm leading-none"
        aria-label="Nepal"
      >
        NP
      </span>
    </span>
  );
}
