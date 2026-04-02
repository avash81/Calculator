'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Dices, PieChart, Percent, Activity } from 'lucide-react';

export default function ProbabilityCalc() {
  const [favorable, setFavorable] = useState(1);
  const [total, setTotal] = useState(6);

  const res = useMemo(() => {
    if (total <= 0) return { prob: 0, pct: '0%', odds: '0:0' };
    const p = favorable / total;
    return {
      prob: p.toFixed(4),
      pct: (p * 100).toFixed(2) + '%',
      odds: favorable + ' : ' + (total - favorable)
    };
  }, [favorable, total]);

  return (
    <>
      <JsonLd type="calculator" name="Probability Calculator" description="Free online probability calculator to find the likelihood and odds of favorable outcomes occurring." url="https://calcpro.com.np/calculator/probability" />
      
      <CalcWrapper
        title="Probability Calc"
        description="Calculate the statistical probability of events occurring based on favorable outcomes and total sample space."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'probability'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Dices className="w-40 h-40" />
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Favorable Outcomes</label>
                       <div className="relative">
                          <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-google-blue" />
                          <input type="number" value={favorable} onChange={e=>setFavorable(+e.target.value)} className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-2xl font-black text-xl border-2 border-transparent focus:border-google-blue outline-none transition-all" />
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase italic">&quot;The events you want to happen&quot;</p>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sample Space</label>
                       <div className="relative">
                          <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="number" value={total} onChange={e=>setTotal(+e.target.value)} className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-2xl font-black text-xl border-2 border-transparent focus:border-google-blue outline-none transition-all" />
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase italic">&quot;Total number of possible outcomes&quot;</p>
                    </div>
                 </div>
              </div>

              <div className="bg-google-gray rounded-[2.5rem] p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Percentage</div>
                    <div className="text-3xl font-black text-gray-900">{res.pct}</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Decimal (0-1)</div>
                    <div className="text-3xl font-black text-google-blue">{res.prob}</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Odds (Fav:Unfav)</div>
                    <div className="text-3xl font-black text-orange-500">{res.odds}</div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Percent className="w-20 h-20 group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Likelihood Result</div>
                 <div className="text-6xl font-black mb-8">{res.pct}</div>
                 <div className="pt-8 border-t border-white/20">
                    <div className="text-sm font-bold opacity-80 leading-relaxed italic">
                       &quot;Based on classical probability rules, there is a {(+res.prob).toFixed(2)} probability of success.&quot;                     </div>
                 </div>
              </div>
              <ShareResult title="Probability Calculated" result={res.pct} calcUrl="https://calcpro.com.np/calculator/probability" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'Basic Probability Formula?', answer: 'P(A) = Favorable Outcomes / Total Outcomes.' },
            { question: 'What is sample space?', answer: 'The set of all possible outcomes of an experiment (e.g., for a die it is 1, 2, 3, 4, 5, 6).' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
