'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Activity, Bell, Info } from 'lucide-react';

export default function ZScoreCalc() {
  const [x, setX] = useState(85);
  const [mu, setMu] = useState(70);
  const [sigma, setSigma] = useState(10);

  const z = useMemo(() => {
    if (sigma === 0) return 0;
    return (x - mu) / sigma;
  }, [x, mu, sigma]);

  return (
    <>
      <JsonLd type="calculator" name="Z-Score Calculator" description="Free online calculator to find the z-score of a raw value in any normal distribution dataset." url="https://calcpro.com.np/calculator/z-score" />
      
      <CalcWrapper
        title="Z-Score Calculator"
        description="Determine the standard score (Z-score) of any raw value based on population mean and standard deviation."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'z-score'}]}
        formula="Z = (x - μ) / σ"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Bell className="w-40 h-40" />
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Raw Value (x)</label>
                       <input type="number" value={x} onChange={e=>setX(+e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-6 font-black text-xl outline-none shadow-sm transition-all shadow-blue-500/5 text-gray-800" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Population Mean (μ)</label>
                          <input type="number" value={mu} onChange={e=>setMu(+e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-6 font-black text-xl outline-none shadow-sm transition-all shadow-blue-500/5 text-gray-800" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Std Deviation (σ)</label>
                          <input type="number" value={sigma} onChange={e=>setSigma(+e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-6 font-black text-xl outline-none shadow-sm transition-all shadow-blue-500/5 text-gray-800" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-600/5 border border-blue-100 rounded-3xl p-8 flex items-center gap-6">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Info className="w-7 h-7" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Statistical Analysis</div>
                    <div className="text-sm font-bold text-gray-600 italic leading-relaxed">
                       &quot;A Z-score indicates how many standard deviations an element is from the mean of the distribution."                     </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Activity className="absolute bottom-4 right-4 w-32 h-32 text-google-blue opacity-10" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Standard Score (Z)</div>
                 <div className="text-7xl font-black mb-8 text-google-blue">{z.toFixed(4)}</div>
                 <div className="pt-8 border-t border-white/10">
                    <div className="text-sm font-bold opacity-80 leading-relaxed italic">
                       {z > 0 ? `The value is ${z.toFixed(2)} standard deviations ABOVE the mean.` : `The value is ${Math.abs(z).toFixed(2)} standard deviations BELOW the mean.`}
                    </div>
                 </div>
              </div>
              <ShareResult title="Z-Score Calculated" result={z.toFixed(2)} calcUrl="https://calcpro.com.np/calculator/z-score" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
             { question: 'What is a Z-score?', answer: 'A Z-score or standard score is a statistical measurement of a scores relationship to the mean in a group of scores. It is measured in terms of standard deviations from the mean.' },
             { question: 'Is a higher Z-score better?', answer: 'It depends on the context. In an exam, a higher Z-score means you performed better than average. In error rate, a lower (negative) Z-score is better.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
