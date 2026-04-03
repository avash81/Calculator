'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { Ruler, ArrowLeftRight, Navigation, MapPin } from 'lucide-react';

const UNITS: Record<string, { name: string; factor: number }> = {
  m: { name: 'Meter (m)', factor: 1 },
  km: { name: 'Kilometer (km)', factor: 1000 },
  cm: { name: 'Centimeter (cm)', factor: 0.01 },
  mm: { name: 'Millimeter (mm)', factor: 0.001 },
  mile: { name: 'Mile (mi)', factor: 1609.34 },
  yard: { name: 'Yard (yd)', factor: 0.9144 },
  foot: { name: 'Foot (ft)', factor: 0.3048 },
  inch: { name: 'Inch (in)', factor: 0.0254 },
};

export default function LengthConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('km');
  const [to, setTo] = useState('m');

  const result = useMemo(() => {
    const fromFactor = UNITS[from].factor;
    const toFactor = UNITS[to].factor;
    const res = (value * fromFactor) / toFactor;
    return res.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, from, to]);

  const quickTable = [
    { label: '1 km to m', val: '1000 m' },
    { label: '1 mile to km', val: '1.609 km' },
    { label: '1 foot to inch', val: '12 inch' },
    { label: '1 meter to feet', val: '3.28 ft' },
  ];

  return (
    <>
      <JsonLd type="calculator" name="Length Converter (km to m)" description="Convert kilometers to meters, miles to km, and more with our high-precision length converter." url="https://calcpro.com.np/calculator/length-converter" />
      
      <CalcWrapper
        title="Universal Length Pro"
        description="A high-precision converter for kilometers, meters, miles, and engineering units. Optimized for everyday speed."
        crumbs={[{label:'conversion',href:'/calculator/category/conversion'},{label:'length converter'}]}
        formula={`${value} ${from} × (${UNITS[from].factor}/${UNITS[to].factor}) = ${result} ${to}`}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Ruler className="w-40 h-40" />
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
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Common Benchmarks</h3>
                    <div className="space-y-3">
                       {quickTable.map((item, i) => (
                         <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0 hover:translate-x-1 transition-transform cursor-pointer" onClick={() => {
                            const parts = item.label.split(' ');
                            setValue(parseInt(parts[0])); setFrom(parts[1]); setTo(parts[3]);
                         }}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{item.label}</span>
                            <span className="text-sm font-bold">{item.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-blue-600 rounded-3xl p-8 flex flex-col justify-center gap-4 group hover:bg-blue-500 transition-colors">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                       <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-medium leading-relaxed opacity-90 italic">
                       &quot;Distance is not just a number, it&apos;s the space between possibilities.&quot;
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6 lg:sticky lg:top-10 h-fit">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 text-center shadow-xl space-y-4">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Metric Profile</div>
                 <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter truncate">{result}</div>
                 <div className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full inline-block uppercase tracking-widest">{UNITS[to].name}</div>
              </div>
              <ShareResult title="Length Calculation Result" result={`${value} ${from} = ${result} ${to}`} calcUrl="https://calcpro.com.np/calculator/length-converter" />
           </div>
        </div>

        <div className="mt-16">
           <CalcFAQ faqs={[
             { question: 'How many meters are in a kilometer?', answer: 'There are exactly 1,000 meters in 1 kilometer.' },
             { question: 'What is the conversion for miles to km?', answer: '1 Mile is approximately 1.60934 Kilometers.' },
             { question: 'Why use this professional converter?', answer: 'Unlike generic search results, we use precise scientific factors up to 10 decimal places to ensure engineering-grade accuracy.' }
           ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
