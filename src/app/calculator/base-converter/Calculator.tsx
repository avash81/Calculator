'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Smartphone, Terminal } from 'lucide-react';

interface ConversionResult {
  dec: string;
  bin: string;
  hex: string;
  oct: string;
}

interface ErrorResult {
  error: string;
}

type BaseResult = ConversionResult | ErrorResult | null;

export default function BaseConverter() {
  const [val, setVal] = useState('255');
  const [val2, setVal2] = useState('0'); // Second operand for logic
  const [base, setBase] = useState<number>(10);

  const res = useMemo<BaseResult>(() => {
    if (val.length > 64) return { error: 'Input too long (max 64 chars)' };
    if (!val.trim()) return null;

    try {
      let cleanVal = val.trim();
      const decStr = base === 16 ? `0x${cleanVal}` : base === 8 ? `0o${cleanVal}` : base === 2 ? `0b${cleanVal}` : cleanVal;
      const dec = BigInt(decStr);
      
      const char = Number(dec) <= 126 && Number(dec) >= 32 ? String.fromCharCode(Number(dec)) : null;
      const binStr = dec.toString(2);
      const paddedBin = binStr.padStart(8, '0');
      
      // Basic bitwise with val2
      let logic = { and: '0', or: '0', xor: '0' };
      try {
         const d2 = BigInt(val2);
         logic = { 
           and: (dec & d2).toString(10), 
           or: (dec | d2).toString(10), 
           xor: (dec ^ d2).toString(10) 
         };
      } catch { /* ignore */ }

      return {
        dec: dec.toString(10),
        bin: paddedBin,
        hex: dec.toString(16).toUpperCase(),
        oct: dec.toString(8),
        char,
        logic
      };
    } catch {
      return { error: 'Invalid input' };
    }
  }, [val, val2, base]);

  // Guaranteed non-nullable display entries for UI components
  const display = useMemo(() => {
    if (res && 'dec' in res) {
      const r = res as any;
      return {
        dec: r.dec,
        bin: r.bin,
        hex: r.hex,
        oct: r.oct,
        char: r.char,
        logic: r.logic
      };
    }
    return { dec: '---', bin: '---', hex: '---', oct: '---', char: null, logic: { and: '0', or: '0', xor: '0' } };
  }, [res]);

  const applyPreset = (v: string) => {
    setBase(10);
    setVal(v);
  };

  return (
    <CalculatorErrorBoundary calculatorName="Base Converter">
      <JsonLd type="calculator" name="Base Converter (Binary, Hex, Octal)" description="Free online base converter to switch between Decimal, Binary, Hexadecimal, and Octal numbering systems." url="https://calcpro.com.np/calculator/base-converter" />
      
      <CalcWrapper
        title="Base Converter"
        description="Convert numbers between Decimal, Binary, Hexadecimal, and Octal bases instantly."
        crumbs={[{label:'education',href:'/calculator?cat=education'},{label:'base converter'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden transition-all">
                 <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-8 w-full overflow-x-auto">
                    {[
                      {id:10, l:'Decimal'}, {id:2, l:'Binary'}, {id:16, l:'Hex'}, {id:8, l:'Octal'}
                    ].map(b => (
                      <button 
                        key={b.id} 
                        onClick={()=>setBase(b.id)} 
                        className={`flex-1 py-3 px-6 text-[10px] font-black uppercase rounded-xl transition-all whitespace-nowrap min-h-[48px] ${base === b.id ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
                      >
                        {b.l}
                      </button>
                    ))}
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none px-2">Enter {base === 10 ? 'Decimal' : base === 2 ? 'Binary' : base === 16 ? 'Hex' : 'Octal'} Value</label>
                    <input 
                      type="text" 
                      value={val} 
                      onChange={e=>setVal(e.target.value.toUpperCase())} 
                      className="w-full h-16 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-blue-500 rounded-3xl px-8 font-black text-3xl outline-none text-gray-900 dark:text-white transition-all scroll-m-20" 
                      placeholder="0"
                      maxLength={64}
                    />
                    {res && 'error' in res && (
                      <p className="text-xs text-red-500 font-bold px-4">{(res as ErrorResult).error}</p>
                    )}
                 </div>

                  <div className="pt-8 border-t border-gray-50 dark:border-gray-800 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Common Values (Decimal)</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['255', '1024', '65535', '16777215'].map(pv => (
                             <button 
                              key={pv} 
                              onClick={() => applyPreset(pv)}
                              className="py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 text-[10px] font-black transition-all"
                             >
                                {parseInt(pv).toLocaleString()}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Bitwise Logic (w/ Value 2)</label>
                        <div className="flex gap-2">
                           <input type="number" value={val2} onChange={e=>setVal2(e.target.value)} className="w-full h-11 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500" placeholder="Val 2" />
                        </div>
                        <div className="mt-2 flex gap-2">
                           <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-[8px] font-black uppercase text-center border border-gray-100 dark:border-gray-700">AND: {display.logic.and}</div>
                           <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-[8px] font-black uppercase text-center border border-gray-100 dark:border-gray-700">XOR: {display.logic.xor}</div>
                        </div>
                     </div>
                  </div>
              </div>

               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
                 {display.char && (
                   <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-5 pointer-events-none">
                      <div className="text-[12rem] font-black">{display.char}</div>
                   </div>
                 )}
                 {[
                   { l: 'Binary (Base 2)', v: display.bin, c: 'text-blue-500' },
                   { l: 'Hexadecimal (Base 16)', v: display.hex !== '---' ? `0x${display.hex}` : '---', c: 'text-indigo-500' },
                   { l: 'Octal (Base 8)', v: display.oct, c: 'text-orange-500' },
                   { l: 'Decimal (Base 10)', v: display.dec, c: 'text-green-500' },
                 ].map(item => (
                   <div key={item.l} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all relative z-10">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.l}</div>
                       <div className={`text-2xl font-black truncate font-mono ${item.c}`}>{item.v}</div>
                   </div>
                 ))}
               </div>
           </div>

           <div className="space-y-6 lg:sticky lg:top-10">
              <ResultDisplay
                title="Base Conversion"
                primaryResult={{
                  label: 'Hexadecimal',
                  value: display.hex !== '---' ? `0x${display.hex}` : '---',
                  description: 'Base-16 Representation',
                  bgColor: 'bg-indigo-600',
                  color: 'text-white'
                }}
                secondaryResults={[
                  { label: 'Binary', value: display.bin },
                  { label: 'Decimal', value: display.dec },
                  { label: 'Octal', value: display.oct },
                ]}
                onShare={() => {}}
              />

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl text-center group hover:bg-blue-50/50 transition-all">
                     <Terminal className="w-5 h-5 text-gray-300 mx-auto mb-2 group-hover:text-blue-500" />
                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">ASCII Preview</div>
                     <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase">{display.char || 'N/A'}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl text-center group hover:bg-blue-50/50 transition-all">
                     <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-2 group-hover:text-blue-500" />
                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Memory Size</div>
                     <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase">{display.hex !== '---' ? Math.ceil(display.hex.length / 2) : '0'} Bytes</div>
                  </div>
               </div>
              
              {display.hex !== '---' && (
                <ShareResult title="Base Conversion Result" result={`${base === 10 ? val : display.dec} in base ${base} = ${display.hex} (Hex)`} calcUrl="https://calcpro.com.np/calculator/base-converter" />
              )}
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "What is Hexadecimal?", answer: "Hexadecimal (Base-16) uses digits 0-9 and letters A-F. It's often used in computing as a human-friendly way to represent binary data." },
            { question: "Why is Binary important?", answer: "Digital circuits use two states (on/off), which binary naturally represents as 1 and 0." }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
