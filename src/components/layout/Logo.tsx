import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* MINIMALIST LOGO SYMBOL */}
      <div className="relative w-8 h-8 bg-omni-indigo rounded-lg flex items-center justify-center shadow-md shadow-indigo-900/20 group-hover:bg-omni-amber transition-colors duration-300">
        <div className="w-4 h-3 flex flex-col justify-between">
          <div className="h-0.5 bg-white rounded-full w-full" />
          <div className="h-0.5 bg-white rounded-full w-full" />
        </div>
      </div>
      
      {/* BRAND TEXT */}
      <span className="text-xl font-black tracking-tight text-omni-indigo-dark group-hover:text-omni-indigo transition-colors font-sans">
        Calcly<span className="text-omni-amber font-bold">.com</span>
      </span>
    </div>
  );
}
