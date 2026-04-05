import React from 'react';

export function Logo({ className = "", theme = "indigo" }: { className?: string, theme?: "indigo" | "white" }) {
  const isWhite = theme === "white";

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* MINIMALIST LOGO SYMBOL */}
      <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-colors duration-300 ${isWhite ? 'bg-white shadow-white/10 group-hover:bg-blue-400' : 'bg-omni-indigo shadow-indigo-900/20 group-hover:bg-omni-amber'}`}>
        <div className="w-4 h-3 flex flex-col justify-between">
          <div className={`h-0.5 rounded-full w-full ${isWhite ? 'bg-slate-900' : 'bg-white'}`} />
          <div className={`h-0.5 rounded-full w-full ${isWhite ? 'bg-slate-900' : 'bg-white'}`} />
        </div>
      </div>
      
      {/* BRAND TEXT */}
      <span className={`text-xl font-black tracking-tight transition-colors font-sans ${isWhite ? 'text-white' : 'text-omni-indigo-dark group-hover:text-omni-indigo'}`}>
        Calcly<span className={isWhite ? 'text-blue-400' : 'text-omni-amber font-bold'}>.com</span>
      </span>
    </div>
  );
}
