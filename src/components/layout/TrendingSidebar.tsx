'use client';
import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Zap, Star } from 'lucide-react';

/**
 * TrendingSidebar — High-aesthetics retention component for Phase 4.
 * Generates smart suggestions based on the current calculator's context.
 */
interface CalculatorLink {
  name: string;
  slug: string;
  category?: string;
  icon?: React.ReactNode;
}

const ALL_TRENDING: CalculatorLink[] = [
  { name: 'Nepal Income Tax 2082', slug: 'nepal-income-tax', category: 'Finance' },
  { name: 'Loan EMI Pro', slug: 'loan-emi', category: 'Finance' },
  { name: 'Engineering GPA Suite', slug: 'engineering-gpa-calculator', category: 'Education' },
  { name: 'Currency Converter', slug: 'currency-converter', category: 'Utility' },
  { name: 'BMI & Body Fat', slug: 'bmi', category: 'Health' },
  { name: 'Nepal Salary Calculator', slug: 'nepal-salary', category: 'Finance' },
  { name: 'Percentage Suite', slug: 'percentage', category: 'Utility' },
];

export function TrendingSidebar({ currentSlug }: { currentSlug?: string }) {
  const suggestions = ALL_TRENDING
    .filter(c => c.slug !== currentSlug)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 px-1">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trending Tools</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((calc) => (
          <Link 
            key={calc.slug}
            href={`/calculator/${calc.slug}`}
            className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-60">
                {calc.category}
              </span>
              <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                {calc.name}
              </span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-50 dark:border-gray-800 group cursor-pointer">
        <div className="bg-blue-600 rounded-2xl p-6 text-center text-white relative overflow-hidden transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
          <Star className="absolute -top-4 -right-4 w-16 h-16 opacity-10 rotate-12" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Newest Release</span>
          </div>
          <div className="text-xs font-black uppercase mb-1">Engineering GPA Suite</div>
          <p className="text-[10px] font-bold opacity-70">TU / KU / PU Official Scales</p>
        </div>
      </div>
    </div>
  );
}
