'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { Scale, ArrowLeftRight, Weight, Gem } from 'lucide-react';

const UNITS: Record<string, { name: string; factor: number }> = {
  g: { name: 'Gram (g)', factor: 1 },
  kg: { name: 'Kilogram (kg)', factor: 1000 },
  mg: { name: 'Milligram (mg)', factor: 0.001 },
  tola: { name: 'Tola (Nepal Gold)', factor: 11.6638 },
  lb: { name: 'Pound (lb)', factor: 453.592 },
  oz: { name: 'Ounce (oz)', factor: 28.3495 },
  ton: { name: 'Metric Ton', factor: 1000000 },
};

export default function WeightConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('kg');
  const [to, setTo] = useState('lb');

  const result = useMemo(() => {
    const fromFactor = UNITS[from].factor;
    const toFactor = UNITS[to].factor;
    const res = (value * fromFactor) / toFactor;
    return res.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, from, to]);

  const quickTable = [
    { label: '1 kg to lb', val: '2.2046 lb' },
    { label: '1 tola to gram', val: '11.66 g' },
    { label: '1 lb to gram', val: '453.59 g' },
    { label: '10 gram to tola', val: '0.857 tola' },
  ];

  return (
    <>
      <JsonLd type="calculator" name="Weight Converter (Kg to Lbs)" description="Convert kilograms to pounds, grams to tolas, and more with our high-precision weight converter. Specific support for Nepal Gold Tola." url="https://calcpro.com.np/calculator/weight-converter" />
      
      <CalcWrapper
        title="Weight & Mass Pro"
        description="A high-precision converter for Kilograms, Pounds, and Nepal's Gold Tola standard. Reliable and fast for daily usage."
        crumbs={[{label:'conversion',href:'/calculator/category/conversion'},{label:'weight converter'}]}
        formula={`${value} ${from} × (${UNITS[from].factor}/${UNITS[to].factor}) = ${result} ${to}`}
        isNepal
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Scale className="w-40 h-40" />
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-center relative z-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From</label>
                       <ValidatedInput label="Amount" value={value} onChange={setValue} variant="minimal" min={0} />
                       <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500">
                          {Object.entries(UNITS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
                       </select>
                    </div>

                    <button onClick={() => { const f=from; setFrom(to); setTo(f); }} className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center hover:rotate-180 transition-all shadow-sm">
                       <ArrowLeftRight className="w-5 h-5" />
                    </button>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To</label>
                       <div className="h-14 flex items-center px-6 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-2xl font-black text-xl border-2 border-blue-100 dark:border-blue-800">
                          {result}
                       </div>
                       <select value={to} onChange={e=>setTo(e.target.value)} className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500">
                          {Object.entries(UNITS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Nepal Gold & Silver</h3>
                    <div className="space-y-3">
                       {quickTable.map((item, i) => (
                         <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0 hover:translate-x-1 transition-transform cursor-pointer" onClick={() => {
                            const [v, f, , t] = item.label.split(' ');
                            setValue(+v); setFrom(f); setTo(t);
                         }}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{item.label}</span>
                            <span className="text-sm font-bold">{item.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-amber-600 rounded-3xl p-8 flex flex-col justify-center gap-4 group hover:bg-amber-500 transition-colors shadow-lg shadow-amber-600/20">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                       <Gem className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-white leading-none">Nepal Standard</div>
                    <div className="text-xs font-medium leading-relaxed opacity-90 italic">
                       &quot;1 Tola is precisely 11.6638 grams in the Nepali jewelry market.&quot;
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6 lg:sticky lg:top-10 h-fit">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 text-center shadow-xl space-y-4">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Weight Profile</div>
                 <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter truncate">{result}</div>
                 <div className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block uppercase tracking-widest">{UNITS[to].name}</div>
              </div>
              <ShareResult title="Weight Calculation Result" result={`${value} ${from} = ${result} ${to}`} calcUrl="https://calcpro.com.np/calculator/weight-converter" />
           </div>
        </div>

        <div className="mt-16">
           <CalcFAQ faqs={[
             { question: 'What is 1 Tola in grams?', answer: '1 Tola is equal to approximately 11.66 grams (specifically 11.6638g) in Nepal.' },
             { question: 'How many pounds are in 1 kg?', answer: '1 Kilogram is exactly 2.20462 Pounds.' },
             { question: 'Why use this professional converter?', answer: 'We ensure accuracy for both metric (kg/g) and local Nepali (Tola) units, essential for buying gold or daily grocery calculations.' }
           ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
