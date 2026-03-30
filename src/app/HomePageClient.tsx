'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CALCULATORS, CATEGORIES } from '@/data/calculators';
import { 
  Grid, Calculator, Globe, BookOpen, Activity, 
  Cpu, Construction, MoveRight, ChevronRight, 
  Search, Zap, Clock, ShieldCheck, Smartphone, TrendingUp, Sparkles
} from 'lucide-react';
import { Sidebar } from '@/components/home/Sidebar';
import { TrustBand } from '@/components/home/TrustBand';

const HomeCalculator = dynamic(() => import('@/components/home/HomeCalculator').then(mod => mod.HomeCalculator), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-white border border-google-border rounded-[32px] animate-pulse flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest">Constructing Matrix...</div>
});

const CAT_STYLES: Record<string, { icon: string, color: string, bg: string, accent: string }> = {
  nepal: { icon: '🇳🇵', color: 'text-rose-600', bg: 'bg-rose-50', accent: 'border-rose-100' },
  finance: { icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50', accent: 'border-amber-100' },
  health: { icon: '❤️', color: 'text-red-600', bg: 'bg-red-50', accent: 'border-red-100' },
  education: { icon: '🎓', color: 'text-purple-600', bg: 'bg-purple-50', accent: 'border-purple-100' },
  conversion: { icon: '🔄', color: 'text-orange-600', bg: 'bg-orange-50', accent: 'border-orange-100' },
  engineering: { icon: '📐', color: 'text-blue-600', bg: 'bg-blue-50', accent: 'border-blue-100' }
};

export default function HomePageClient() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CALCULATORS.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.keywords?.some(k => k.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-google-blue-light selection:text-google-blue overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center space-y-10">
          
          <div className="inline-flex items-center gap-2 bg-google-blue-light text-google-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-google-blue/10">
             <div className="w-1.5 h-1.5 rounded-full bg-google-blue animate-pulse" />
             Nepal's #1 Free Calculator Platform
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
             <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold text-gray-900 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-top-10 duration-1000">
               Precision Tools for <br/>
               <span className="text-google-blue">Nepal & Beyond</span>
             </h1>
             <p className="text-lg md:text-xl text-gray-500 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
               39 free calculators for taxes, finance, health & education. <br />
               Built for Nepal's FY 2082/83. Private. Fast. No login needed.
             </p>
          </div>

          {/* Key Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-google-border max-w-3xl mx-auto">
             {[
               { l: 'Free Tools', v: '39' },
               { l: 'Audit Score', v: '98%' },
               { l: 'Nepal Tax Updated', v: 'FY 2082/83' },
               { l: 'Data Stored', v: '0' }
             ].map(s => (
               <div key={s.l} className="text-center group">
                  <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter group-hover:text-google-blue transition-colors">{s.v}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.l}</div>
               </div>
             ))}
          </div>

          {/* QUICK ACCESS PILLS - IMAGE 8 */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 py-4 max-w-4xl mx-auto">
             {[
               { n: 'Income Tax', i: '📋' },
               { n: 'EMI Calculator', i: '🏦' },
               { n: 'GPA Calculator', i: '🎓' },
               { n: 'SIP', i: '📈' },
               { n: 'Nepali Date', i: '📅' }
             ].map(p => (
               <button key={p.n} className="flex items-center gap-2 px-4 py-2 bg-white border border-google-border rounded-full hover:border-google-blue hover:text-google-blue transition-all group shadow-sm">
                  <span className="text-sm">{p.i}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{p.n}</span>
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* SEARCH OR CALCULATORS */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-32 space-y-24">
        
        {/* Main Matrix: Calc + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
           <div className="flex-1 w-full order-2 lg:order-1">
              <HomeCalculator />
           </div>
           <div className="w-full lg:w-[360px] order-1 lg:order-2">
              <Sidebar />
           </div>
        </div>

        {/* 6-PILLAR CATEGORY GRID */}
        <div className="space-y-12">
          <div className="space-y-2 text-center">
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">All Calculator Categories</h2>
             <p className="text-gray-400 font-medium text-sm">Free tools for every need — updated for Nepal's latest fiscal rules</p>
          </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {CATEGORIES.map(cat => {
                    const s = CAT_STYLES[cat.id] || CAT_STYLES.engineering;
                    return (
                      <div key={cat.id} className={`bg-white border ${s.accent} rounded-[32px] p-8 hover:shadow-2xl hover:border-google-blue transition-all duration-500 group border-b-[6px]`}>
                         <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-6 text-2xl`}>
                            {s.icon}
                         </div>
                     
                     <div className="space-y-1 mb-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-google-blue transition-colors">{cat.name}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.calculators.length} PRO TOOLS</p>
                     </div>
                     
                     <div className="space-y-4 mb-8">
                        {cat.calculators.slice(0, 5).map(c => (
                          <Link key={c.id} href={`/calculator/${c.slug}`} className="group/link flex items-center justify-between">
                             <span className="text-sm font-semibold text-gray-500 group-hover/link:text-gray-900 group-hover/link:translate-x-1 transition-all">{c.name}</span>
                             {c.isHot && <span className="text-[8px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">HOT</span>}
                          </Link>
                        ))}
                     </div>

                     <Link href={`/calculator?cat=${cat.id}`} className="flex items-center gap-2 text-[10px] font-black text-google-blue uppercase tracking-widest group-hover:gap-4 transition-all">
                        Explore {cat.name} <MoveRight className="w-3 h-3" />
                     </Link>
                  </div>
                );
             })}
          </div>
        </div>
      </main>

      <TrustBand />
    </div>
  );
}
