'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CALCULATORS, CATEGORIES } from '@/data/calculators';
import { Grid, Calculator, Globe, BookOpen, Activity, Cpu, Construction, MoveRight } from 'lucide-react';
import { Sidebar } from '@/components/home/Sidebar';
import { TrustBand } from '@/components/home/TrustBand';

const HomeCalculator = dynamic(() => import('@/components/home/HomeCalculator').then(mod => mod.HomeCalculator), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-white border border-[#E8EAED] rounded-[28px] animate-pulse flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest">Constructing Matrix v2.0...</div>
});

const CAT_STYLES: Record<string, { icon: any, color: string, bg: string }> = {
  nepal: { icon: Globe, color: 'text-red-500', bg: 'bg-red-50' },
  finance: { icon: Calculator, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  health: { icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
  education: { icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  conversion: { icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
  engineering: { icon: Construction, color: 'text-cyan-600', bg: 'bg-cyan-50' }
};

export default function HomePageClient() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isSearchActive = query.trim().length > 0;

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-20 pb-12 px-6 lg:px-12 bg-gradient-to-br from-[#F8F9FF] via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 mb-12">
            
            <div className="inline-flex items-center gap-2 bg-[#E8F0FE] text-[#1A73E8] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-[#1A73E8]/10 shadow-sm">
               <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse" />
               Nepal's #1 Free Calculator Platform
            </div>

            <div className="space-y-4 max-w-4xl">
               <h1 className="text-5xl md:text-8xl font-extrabold text-[#202124] tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-top-4 duration-1000">
                 Precision Tools for <br/>
                 <span className="text-[#1A73E8]">Nepal & Beyond</span>
               </h1>
               <p className="text-xl md:text-2xl text-[#5F6368] font-medium tracking-tight max-w-3xl mx-auto leading-relaxed">
                 39 free calculators for taxes, finance, health & education. Updated for Nepal FY 2082/83. No login. No data stored. Ever.
               </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-6 mb-12">
               {[
                 { label: 'Free Tools', val: '39' },
                 { label: 'Audit Score', val: '98%' },
                 { label: 'Nepal Tax Updated', val: 'FY 2082/83' },
                 { label: 'Data Stored', val: '0' }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center">
                   <div className="text-3xl md:text-4xl font-black text-[#202124] tracking-tighter">{stat.val}</div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
                 </div>
               ))}
            </div>

            {/* Quick Chips */}
            {!isSearchActive && (
              <div className="flex flex-wrap items-center justify-center gap-3 animate-in fade-in duration-700">
                 {[
                   { name: 'Income Tax', icon: '📋' },
                   { name: 'EMI Calculator', icon: '🏦' },
                   { name: 'GPA Calculator', icon: '🎓' },
                   { name: 'SIP', icon: '📈' },
                   { name: 'Nepali Date', icon: '📅' }
                 ].map(hot => (
                   <button key={hot.name} onClick={() => setQuery(hot.name)} className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#1A73E8] text-[#202124] text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-sm">
                      <span className="text-sm">{hot.icon}</span> {hot.name}
                   </button>
                 ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH / MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
        
        {isSearchActive ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10">
             <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] tracking-tighter">
                   Results for <span className="text-[#1A73E8]">"{query}"</span>
                </h2>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{results.length} TOOLS FOUND</div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map(c => (
                  <Link key={c.id} href={`/calculator/${c.slug}`} className="group bg-white border border-[#E8EAED] p-8 rounded-[28px] shadow-sm hover:shadow-2xl hover:border-[#1A73E8] transition-all duration-300">
                    <div className="w-14 h-14 bg-[#F8F9FA] group-hover:bg-[#1A73E8] group-hover:text-white rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all border border-[#E8EAED]">
                       {c.icon as string}
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-[#202124] group-hover:text-[#1A73E8] leading-tight mb-2">{c.name}</h3>
                       <p className="text-xs text-[#5F6368] leading-relaxed line-clamp-2">{c.description}</p>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Calculator + Sidebar Section */}
             <div className="flex flex-col lg:flex-row gap-8 items-start pt-8">
                <div className="flex-1 w-full">
                   <HomeCalculator />
                </div>
                <div className="w-full lg:w-[380px] space-y-8">
                   <Sidebar />
                </div>
             </div>

             {/* All Categories Grid */}
             <div className="space-y-12 pt-16">
                <div className="space-y-2">
                   <h2 className="text-3xl md:text-4xl font-black text-[#202124] tracking-tight">All Calculator Categories</h2>
                   <p className="text-[#5F6368] font-medium text-sm">free tools for every need — updated for Nepal's latest fiscal rules</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {CATEGORIES.map(cat => {
                      const style = CAT_STYLES[cat.id] || { icon: Grid, color: 'text-gray-500', bg: 'bg-gray-50' };
                      const Icon = style.icon;
                      return (
                        <div key={cat.id} className="bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-xl hover:border-[#1A73E8] transition-all duration-500 group flex flex-col items-start border-b-4 border-b-transparent hover:border-b-[#1A73E8]">
                           <div className={`w-12 h-12 ${style.bg} rounded-[18px] flex items-center justify-center mb-6 transition-colors`}>
                              <Icon className={`w-6 h-6 ${style.color}`} strokeWidth={2} />
                           </div>
                           
                           <div className="space-y-1 mb-8">
                              <h3 className="text-xl font-black text-[#202124] tracking-tight group-hover:text-[#1A73E8] transition-colors">{cat.name}</h3>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{cat.calculators.length} PRO TOOLS</p>
                           </div>
                           
                           <div className="w-full flex flex-col gap-3.5 mb-10">
                              {cat.calculators.slice(0, 5).map(c => (
                                <Link key={c.id} href={`/calculator/${c.slug}`} className="text-sm font-semibold text-[#5F6368] hover:text-[#1A73E8] transition-colors flex items-center gap-2 group/link">
                                   <span className="text-gray-300 group-hover/link:text-[#1A73E8]">→</span>
                                   {c.name}
                                </Link>
                              ))}
                           </div>

                           <Link href={`/calculator?cat=${cat.id}`} className="mt-auto flex items-center gap-2 text-[10px] font-black text-gray-400 group-hover:text-[#1A73E8] transition-all uppercase tracking-widest hover:translate-x-1">
                              Explore Category <MoveRight className="w-3 h-3" />
                           </Link>
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>
        )}
      </main>

      <TrustBand />
    </div>
  );
}
