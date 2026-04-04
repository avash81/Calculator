'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/calculators';
import { ChevronRight, Zap, Calculator, TrendingUp, Heart, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { AllInOneCalculator } from '@/components/calculator/AllInOneCalculator';

export default function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[14px]">
      
      {/* 1. Interactive Hero - All-in-One Calculator */}
      <header className="pt-16 pb-16 border-b border-[var(--border)] bg-gray-50">
        <div className="hp-container flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-[#000000] mb-4 tracking-tighter">
              Global Precision Hub
            </h1>
            <p className="text-[#333333] font-medium leading-relaxed max-w-2xl mx-auto">
              Professional-grade mathematical tools for finance, health, and engineering. 
              Featuring our live interactive scientific & graphing engine below.
            </p>
          </div>
          
          <div className="w-full">
            <AllInOneCalculator />
          </div>
        </div>
      </header>

      {/* 2. Professional Directory Overview - Masonry Style to save space */}
      <main className="hp-container py-12">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-8 space-y-12">
          {CATEGORIES.map(cat => (
            <section key={cat.id} className="break-inside-avoid mb-12">
               {/* Category Header */}
               <div className="flex flex-col gap-2 group mb-5">
                  <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all shadow-sm">
                    {cat.icon}
                  </div>
                  <Link href={`/calculator/category/${cat.id}`}>
                    <h2 className="text-[17px] font-black text-[#006600] hover:underline leading-tight">
                      {cat.name}
                    </h2>
                  </Link>
               </div>

               {/* Clean, Non-Overlapping Vertical List */}
               <nav>
                 <ul className="flex flex-col gap-y-2">
                    {[...cat.calculators]
                      .sort((a, b) => {
                         const scoreA = (a.isHot ? 2 : 0) + (a.isNew ? 1 : 0);
                         const scoreB = (b.isHot ? 2 : 0) + (b.isNew ? 1 : 0);
                         return scoreB - scoreA;
                      })
                      .slice(0, 10) // Limit to top 10 for a clean 'one screen' look
                      .map(calc => {
                        const isPrimaryTool = ['scientific-calculator', 'base-converter', 'unit-converter'].includes(calc.slug);
                        return (
                          <li key={calc.id} className="flex items-center gap-1.5 group/item">
                            {isPrimaryTool ? (
                              <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-[13px] text-[#0000CC] hover:text-blue-800 hover:underline font-bold leading-none truncate flex-1 text-left"
                                title="Use our All-In-One Engine at the top"
                              >
                                {calc.name}
                              </button>
                            ) : (
                              <Link 
                                href={`/calculator/${calc.slug}`}
                                className="text-[13px] text-[#0000CC] hover:text-blue-800 hover:underline font-bold leading-none truncate flex-1"
                                title={calc.name}
                              >
                                {calc.name}
                              </Link>
                            )}
                            {(calc.isHot || calc.isNew) && (
                              <span className="text-[8px] font-black bg-blue-600 text-white px-1 py-0.5 rounded-sm uppercase tracking-tighter shrink-0 select-none">
                                {calc.isHot ? 'H' : 'N'}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    {cat.calculators.length > 10 && (
                      <li className="pt-2 border-t border-gray-100 mt-2">
                        <Link 
                          href={`/calculator/category/${cat.id}`}
                          className="text-[11px] font-bold text-gray-500 hover:text-[#0000CC] flex items-center gap-1 transition-colors"
                        >
                          View All {cat.name} <ChevronRight className="w-3 h-3" />
                        </Link>
                      </li>
                    )}
                 </ul>
               </nav>
            </section>
          ))}
        </div>
      </main>

      {/* 3. Simple Footer Text Detail (SEO/Trust) */}
      <div className="hp-container pb-24 border-t border-[var(--border)] text-center space-y-4 max-w-2xl mx-auto pt-12">
         <h3 className="text-xl font-bold text-[var(--text-main)]">Global Computation Excellence</h3>
         <p className="text-[var(--text-muted)] text-sm leading-relaxed">
           Calcly is a dedicated mathematical resource built on the principles of accuracy and privacy. 
           All calculations are performed locally in your browser. We never store, share, or sell your data.
           Built for professional and academic standards.
         </p>
      </div>

      {/* 4. Mini Footer Credits */}
      <footer className="bg-blue-600 text-white/60 py-6 text-center text-[11px] font-bold tracking-widest uppercase">
        © 2026 Calcly Platform — Precision Engineering for All Dimensions
      </footer>
    </div>
  );
}
