'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CALCULATORS, CATEGORIES } from '@/data/calculators';
import { Search, Grid, Calculator, Globe, BookOpen, Activity, Cpu, Construction, ChevronRight, X, ShieldCheck, Zap } from 'lucide-react';

const HomeCalculator = dynamic(() => import('@/components/home/HomeCalculator').then(mod => mod.HomeCalculator), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-white border-2 border-gray-100 rounded-[3rem] animate-pulse flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest">Constructing Matrix v1.0...</div>
});

const CAT_ICONS: Record<string, any> = {
  nepal: Globe, finance: Calculator, health: Activity, education: BookOpen, conversion: Cpu, engineering: Construction, utility: Activity
};

export default function HomePageClient() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isSearchActive = query.trim().length > 0;

  // Advanced Search Logic (Fuzzy + Category + Local)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    return CALCULATORS.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.keywords?.some(k => k.toLowerCase().includes(q)) ||
      c.description.toLowerCase().includes(q)
    ).sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── MINIMALIST HERO SECTOR ─────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
             <h1 className="text-6xl sm:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
               CalcPro<span className="text-blue-600">.NP</span>
             </h1>
             <p className="text-xl text-gray-400 font-medium tracking-tight">Precision counting for Nepal. Instant. Private. Free.</p>
          </div>

          {/* Unified Search Centerpiece */}
          <div className="relative max-w-2xl mx-auto z-[100]">
            <div className={`flex items-center bg-white border-2 rounded-[2rem] transition-all duration-500 overflow-hidden shadow-2xl p-1.5 ${isSearchActive ? 'border-blue-600 shadow-blue-500/10' : 'border-gray-50 shadow-gray-200/40'}`}>
              <div className="w-14 h-14 flex items-center justify-center text-gray-400">
                 <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search anything (e.g. TAX, EMI, GPA, BMI...)"
                className="flex-1 bg-transparent border-none outline-none text-2xl font-black text-gray-900 placeholder:text-gray-200 tracking-tight"
              />
              {query.length > 0 && (
                <button onClick={clearSearch} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400 transition-colors mr-1">
                   <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {!isSearchActive && (
            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in duration-700">
               {['Income Tax', 'EMI Calculator', 'GPA Calc', 'SIP', 'Concrete Mix'].map(hot => (
                 <button key={hot} onClick={() => setQuery(hot)} className="px-5 py-2.5 bg-[#F6F8FA] hover:bg-blue-50 border border-gray-100 hover:border-blue-200 text-xs font-black text-gray-400 hover:text-blue-600 rounded-2xl transition-all uppercase tracking-widest shadow-sm">
                    {hot}
                 </button>
               ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HYBRID CONTENT LAYER ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 pb-40">
        
        {isSearchActive ? (
          /* SEARCH RESULTS MODE - ALL RESULTS PRESENT IN FRONT */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between border-b border-gray-100 pb-8 px-4">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                   Results for <span className="text-blue-600">"{query}"</span>
                </h2>
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">{results.length} TOOLS FOUND</div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                {results.map(c => (
                  <Link 
                    key={c.id} 
                    href={`/calculator/${c.slug}`}
                    className="group bg-white border border-gray-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-[1.2rem] flex items-center justify-center text-3xl mb-8 transition-all group-hover:scale-110 shadow-sm border border-gray-50">
                       {c.icon as string}
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-700 transition-colors leading-tight tracking-tight">{c.name}</h3>
                       <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Open Tool</span>
                       <ChevronRight className="w-4 h-4 text-blue-600" />
                    </div>
                  </Link>
                ))}
                {results.length === 0 && (
                  <div className="col-span-full py-40 text-center space-y-4">
                     <div className="text-4xl">🔍</div>
                     <h3 className="text-2xl font-black text-gray-900">No tools found matching "{query}"</h3>
                     <p className="text-gray-400">Try searching for generic terms like "Math" or "Tax".</p>
                     <button onClick={clearSearch} className="text-blue-600 font-black uppercase text-xs tracking-widest mt-6">Clear Search</button>
                  </div>
                )}
             </div>
          </div>
        ) : (
          /* HOMEPAGE DEFAULT MODE - Laboratory & Directory */
          <div className="space-y-40 animate-in fade-in duration-1000">
             
             {/* The Lab (Matrix v1.0) */}
             <div id="home-calc" className="bg-[#FFFFFF] border-2 border-gray-100 rounded-[3.5rem] p-4 sm:p-2 shadow-2xl shadow-gray-200/30 overflow-hidden">
                <HomeCalculator />
             </div>

             {/* The Library (Directory) */}
             <div className="space-y-20">
                <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
                   <div className="space-y-1">
                      <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Tools Directory.</h2>
                      <p className="text-gray-400 font-medium text-lg leading-tight">Every specialized tool for your academic and fiscal needs.</p>
                   </div>
                   <Link href="/calculator" className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-gray-900/10 transition-all active:scale-95">Explore All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                   {CATEGORIES.map(cat => {
                      const Icon = CAT_ICONS[cat.id] || Grid;
                      return (
                        <div key={cat.id} className="bg-white border border-gray-50 rounded-[3rem] p-10 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group border-b-4 hover:border-b-blue-600">
                           <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-blue-50">
                              <Icon className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
                           </div>
                           <div className="space-y-2 mb-8">
                              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{cat.name}</h3>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{cat.calculators.length} PRO TOOLS</p>
                           </div>
                           
                           <div className="space-y-5">
                              {cat.calculators.slice(0, 5).map(c => (
                                <Link key={c.id} href={`/calculator/${c.slug}`} className="flex items-center justify-between group/tool text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                   <span className="flex items-center gap-3">
                                      <span className="opacity-0 group-hover/tool:opacity-100 transition-opacity text-blue-600">→</span>
                                      {c.name}
                                   </span>
                                   {c.isHot && <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase">HOT</span>}
                                </Link>
                              ))}
                           </div>

                           <div className="mt-10 pt-8 border-t border-gray-50">
                              <Link href={`/calculator?cat=${cat.id}`} className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-all italic">Explore Category →</Link>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>
        )}
      </main>

      {/* ── FOOTER TRUST ────────────────────────────────────────────── */}
      <footer className="bg-[#FFFFFF] border-t border-gray-50 py-32 px-4 overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50/20 rounded-full blur-3xl -z-10" />
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
               <ShieldCheck className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Security & Intellectual Integrity.</h3>
               <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                  Every calculation is verified against local regulations and international mathematics standards. No data tracking. No cookies.
               </p>
            </div>
            <div className="pt-10 flex flex-wrap justify-center gap-12 grayscale opacity-50">
               <div className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest"><Zap className="w-4 h-4" /> Instant Response</div>
               <div className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest"><Globe className="w-4 h-4" /> Nationwide Coverage</div>
            </div>
         </div>
      </footer>
    </div>
  );
}
