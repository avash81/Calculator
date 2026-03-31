'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Hash, Code, Info, MoveRight } from 'lucide-react';

export default function BaseConverter() {
  const [val, setVal] = useState('255');
  const [base, setBase] = useState<number>(10);

  const res = useMemo(() => {
    try {
      const dec = parseInt(val, base);
      if (isNaN(dec)) return null;
      return {
        dec: dec.toString(10),
        bin: dec.toString(2),
        hex: dec.toString(16).toUpperCase(),
        oct: dec.toString(8)
      };
    } catch { return null; }
  }, [val, base]);

  return (
    <>
      <JsonLd type="calculator" name="Base Converter (Binary, Hex, Octal)" description="Free online base converter to switch between Decimal, Binary, Hexadecimal, and Octal numbering systems." url="https://calcpro.com.np/calculator/base-converter" />
      
      <CalcWrapper
        title="Base Converter"
        description="Convert numbers between different bases: Binary (2), Octal (8), Decimal (10), and Hexadecimal (16) instantly."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'base converter'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="flex bg-google-gray p-1.5 rounded-2xl mb-10 w-full">
                    {[
                      {id:10, l:'Decimal'}, {id:2, l:'Binary'}, {id:16, l:'Hex'}, {id:8, l:'Octal'}
                    ].map(b => (
                      <button key={b.id} onClick={()=>setBase(b.id)} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${base === b.id ? 'bg-white shadow-sm text-google-blue' : 'text-gray-400'}`}>{b.l}</button>
                    ))}
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Enter Value</label>
                    <input type="text" value={val} onChange={e=>setVal(e.target.value)} className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-3xl px-8 font-black text-3xl outline-none" />
                 </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {l:'binary', v: res?.bin, c: 'text-blue-500'},
                    {l:'hexadecimal', v: res?.hex, c: 'text-indigo-500'},
                    {l:'octal', v: res?.oct, c: 'text-orange-500'},
                    {l:'decimal', v: res?.dec, c: 'text-green-500'},
                  ].map(item => (
                    <div key={item.l} className="p-6 bg-gray-50 rounded-3xl">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.l}</div>
                       <div className={`text-2xl font-black truncate ${item.c}`}>{item.v || 'Invalid'}</div>
                    </div>
                  ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Code className="w-20 h-20 group-hover:rotate-12 transition-transform" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Byte Representation</div>
                 <div className="text-4xl font-black mb-8 font-mono break-all leading-tight">{res?.bin}</div>
                 <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80 leading-relaxed">
                    &quot;Computer systems use binary (base-2) as their fundamental data representation."                  </div>
              </div>
              <ShareResult title="Base Conversion" result={res?.hex || ''} calcUrl="https://calcpro.com.np/calculator/base-converter" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "What is Hexadecimal?", answer: "Hexadecimal is a base-16 numbering system that uses 0-9 and A-F to represent values 10-15." },
            { question: "Why use Binary?", answer: "Binary is the standard for digital electronics because it uses only two states: ON (1) and OFF (0)." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
