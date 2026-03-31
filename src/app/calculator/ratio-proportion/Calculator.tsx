'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Scale, MoveRight, HelpCircle } from 'lucide-react';

export default function RatioProportion() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('2');
  const [c, setC] = useState('10');
  const [d, setD] = useState(''); // Target unknown

  // Logic to solve for X (whichever is empty)
  const result = useMemo(() => {
    const na = parseFloat(a); const nb = parseFloat(b);
    const nc = parseFloat(c); const nd = parseFloat(d);

    let resVal: number | null = null;
    let label = '';

    if (isNaN(na)) { resVal = (nb * nc) / nd; label = 'A = ' + resVal.toFixed(2); }
    else if (isNaN(nb)) { resVal = (na * nd) / nc; label = 'B = ' + resVal.toFixed(2); }
    else if (isNaN(nc)) { resVal = (na * nd) / nb; label = 'C = ' + resVal.toFixed(2); }
    else if (isNaN(nd)) { resVal = (nb * nc) / na; label = 'D = ' + resVal.toFixed(2); }

    return { val: resVal, label };
  }, [a, b, c, d]);

  return (
    <>
      <JsonLd type="calculator" name="Ratio & Proportion Calculator" description="Solve for unknown values in any ratio or proportion. Solves A:B = C:D equations." url="https://calcpro.com.np/calculator/ratio-proportion" />
      
      <CalcWrapper
        title="Ratio & Proportion"
        description="Easily solve equation proportions (cross-multiplication) for map scaling, cooking recipes, or math homework."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'ratio proportion'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-1 gap-12 max-w-2xl mx-auto">
           <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-12 text-center shadow-2xl shadow-blue-500/5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-12">Solve: A : B = C : D</div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                 <div className="flex items-center gap-4">
                    <input type="number" value={a} onChange={e=>setA(e.target.value)} placeholder="A" className="w-24 h-24 bg-gray-50 border-4 border-transparent focus:border-google-blue rounded-3xl text-3xl font-black text-center text-gray-900 outline-none transition-all placeholder:text-gray-200" />
                    <span className="text-4xl font-black text-gray-200">:</span>
                    <input type="number" value={b} onChange={e=>setB(e.target.value)} placeholder="B" className="w-24 h-24 bg-gray-50 border-4 border-transparent focus:border-google-blue rounded-3xl text-3xl font-black text-center text-gray-900 outline-none transition-all placeholder:text-gray-200" />
                 </div>

                 <div className="text-6xl font-black text-google-blue h-24 flex items-center">=</div>

                 <div className="flex items-center gap-4">
                    <input type="number" value={c} onChange={e=>setC(e.target.value)} placeholder="C" className="w-24 h-24 bg-gray-50 border-4 border-transparent focus:border-google-blue rounded-3xl text-3xl font-black text-center text-gray-900 outline-none transition-all placeholder:text-gray-200" />
                    <span className="text-4xl font-black text-gray-200">:</span>
                    <input type="number" value={d} onChange={e=>setD(e.target.value)} placeholder="D" className="w-24 h-24 bg-gray-50 border-4 border-transparent focus:border-google-blue rounded-3xl text-3xl font-black text-center text-gray-900 outline-none transition-all placeholder:text-gray-200" />
                 </div>
              </div>

              <div className="mt-16 pt-12 border-t border-gray-50">
                 {result.val !== null ? (
                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-google-blue uppercase tracking-[0.3em]">Calculated Unknown</div>
                      <div className="text-6xl font-black text-gray-900 tracking-tighter">{result.label.split('=')[1]}</div>
                      <div className="text-xs font-bold text-gray-400">Step: ( {b} × {c} ) / {a}</div>
                   </div>
                 ) : (
                   <div className="text-sm font-bold text-gray-400 italic flex items-center justify-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Leave one box empty to solve for it
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-google-gray rounded-[2.5rem] p-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-google-blue">
                    <Scale className="w-8 h-8" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scale Calculation</div>
                    <div className="text-lg font-black text-gray-900">Map & Model Scaling</div>
                 </div>
              </div>
              <ShareResult title="Proportion Solve Result" result={result.label} calcUrl="https://calcpro.com.np/calculator/ratio-proportion" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is a proportion?', answer: 'A proportion is an equation that says two ratios are equal (e.g., 1:2 = 10:20).' },
            { question: 'How is it solved?', answer: 'Using cross-multiplication: A × D = B × C. To find D, we calculate (B × C) / A.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
