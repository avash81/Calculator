'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Ruler, Scissors, Percent, Info } from 'lucide-react';

export default function RoundingCalc() {
  const [val, setVal] = useState('123.4567');
  const [precision, setPrecision] = useState(2);

  const res = useMemo(() => {
    const n = parseFloat(val);
    if (isNaN(n)) return null;
    return {
      whole: Math.round(n),
      floor: Math.floor(n),
      ceil: Math.ceil(n),
      fixed: n.toFixed(precision),
      sig: n.toPrecision(precision)
    };
  }, [val, precision]);

  return (
    <>
      <JsonLd type="calculator" name="Rounding Calculator" description="Free online calculator to round numbers to the nearest tenth, hundredth, or any decimal place." url="https://calcpro.com.np/calculator/rounding" />
      
      <CalcWrapper
        title="Rounding Calc"
        description="Round numbers with precision: Standard rounding, floor, ceiling, and significant figures."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'rounding'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Scissors className="w-40 h-40" />
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Input Number</label>
                       <input type="number" value={val} onChange={e=>setVal(e.target.value)} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-6 font-black text-2xl outline-none" />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Precision / Places</label>
                       <div className="flex items-center gap-6">
                          <input type="range" min="0" max="10" value={precision} onChange={e=>setPrecision(+e.target.value)} className="flex-1 accent-google-blue" />
                          <span className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-600">{precision}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   {l:'Nearest Whole', v: res?.whole},
                   {l:'Floor (Down)', v: res?.floor},
                   {l:'Ceiling (Up)', v: res?.ceil},
                   {l:'Significant Fig', v: res?.sig},
                 ].map(item => (
                   <div key={item.l} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.l}</div>
                      <div className="text-3xl font-black text-gray-900">{item.v}</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Main Rounding ({precision} places)</div>
                 <div className="text-7xl font-black mb-8 leading-none tracking-tighter">{res?.fixed}</div>
                 <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80 leading-relaxed">
                    &quot;Precision rounding ensures accurate data representation in statistics."                  </div>
              </div>
              <ShareResult title="Number Rounded" result={res?.fixed || ''} calcUrl="https://calcpro.com.np/calculator/rounding" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "Round up or down?", answer: "By default, 0.5 and higher rounds up to the next number." },
            { question: "What are significant figures?", answer: "Significant figures are the digits in a number that carry importance contributing to its measurement resolution." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
