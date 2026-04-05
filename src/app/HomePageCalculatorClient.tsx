'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Isolated Hydration Island for Global Precision Suite
const AllInOneCalculator = dynamic(
  () => import('@/components/calculator/AllInOneCalculator'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[600px] w-full bg-slate-50 animate-pulse rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center p-12">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest leading-none">Starting Global Precision Engine...</p>
      </div>
    ) 
  }
);

export function HomePageCalculatorClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="h-[600px] w-full bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center p-12">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Warming Up High-Precision Engine...</p>
    </div>
  );

  return <AllInOneCalculator />;
}
