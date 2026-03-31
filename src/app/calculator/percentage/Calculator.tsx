'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function PercentageCalculator() {
  const [val1, setVal1] = useState(20);
  const [val2, setVal2] = useState(500);

  const r1 = useMemo(() => (val1 / 100) * val2, [val1, val2]);
  
  const [val3, setVal3] = useState(150);
  const [val4, setVal4] = useState(600);
  const r2 = useMemo(() => (val4 > 0 ? (val3 / val4) * 100 : 0), [val3, val4]);

  const [val5, setVal5] = useState(375);
  const [val6, setVal6] = useState(15);
  const r3 = useMemo(() => (val6 !== 0 ? val5 / (val6 / 100) : 0), [val5, val6]);

  const [val7, setVal7] = useState(100);
  const [val8, setVal8] = useState(120);
  const r4 = useMemo(() => {
    if (val7 === 0) return { diff: 0, pct: 0, dir: 'nc' };
    const diff = val8 - val7;
    return { diff, pct: Math.abs(diff / val7) * 100, dir: diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no change' };
  }, [val7, val8]);

  return (
    <>
      <JsonLd type="calculator"
        name="Percentage Calculator"
        description="Calculate percentages, percentage increases, and decreases. Simple and fast tool for everyday math, shopping, and finance."
        url="https://calcpro.com.np/calculator/percentage" />

      <CalcWrapper
        title="Percentage Calculator"
        description="Calculate percentages, percentage increases, and decreases. Simple and fast tool for everyday math."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Percentage' }]}
        relatedCalcs={[
          { name: 'GPA Calculator', slug: 'gpa' },
          { name: 'Discount Calculator', slug: 'discount-calculator' },
        ]}
      >
        <div className="space-y-8">
          {/* Type 1: What is X% of Y? */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">What is X% of Y?</h3>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-500 font-medium">What is</span>
              <input type="number" inputMode="numeric" pattern="[0-9.]*" value={val1} onChange={e => setVal1(+e.target.value)} className="w-24 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              <span className="text-gray-500 font-medium">% of</span>
              <input type="number" inputMode="numeric" pattern="[0-9.]*" value={val2} onChange={e => setVal2(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              <span className="text-gray-500 font-medium">?</span>
              <div className="flex-1 min-w-[150px] bg-blue-50 rounded-xl px-6 py-3 border border-blue-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase block mb-0.5 tracking-widest">Result</span>
                <span className="text-2xl font-bold text-blue-700 font-mono">{r1.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <ShareResult 
                title={`${val1}% of ${val2}`} 
                result={r1.toLocaleString()} 
                calcUrl={`https://calcpro.com.np/calculator/percentage?v1=${val1}&v2=${val2}`} 
              />
            </div>
          </div>

          {/* Type 2: X is what % of Y? */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">X is what % of Y?</h3>
            <div className="flex flex-wrap items-center gap-4">
              <input type="number" inputMode="numeric" pattern="[0-9.]*" value={val3} onChange={e => setVal3(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              <span className="text-gray-500 font-medium">is what % of</span>
              <input type="number" inputMode="numeric" pattern="[0-9.]*" value={val4} onChange={e => setVal4(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              <span className="text-gray-500 font-medium">?</span>
              <div className="flex-1 min-w-[150px] bg-green-50 rounded-xl px-6 py-3 border border-green-100">
                <span className="text-[10px] font-bold text-green-600 uppercase block mb-0.5 tracking-widest">Result</span>
                <span className="text-2xl font-bold text-green-700 font-mono">{r2.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <ShareResult 
                title={`${val3} as % of ${val4}`} 
                result={`${r2.toFixed(2)}%`} 
                calcUrl={`https://calcpro.com.np/calculator/percentage?v3=${val3}&v4=${val4}`} 
              />
            </div>
          </div>

          {/* Type 3: X is Y% of what? */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Find the Original Number</h3>
            <div className="flex flex-wrap items-center gap-4">
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={val5} onChange={e => setVal5(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold text-gray-900 bg-white" />
              <span className="text-gray-500 font-medium">is</span>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={val6} onChange={e => setVal6(+e.target.value)} className="w-24 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold text-gray-900 bg-white" />
              <span className="text-gray-500 font-medium">% of what?</span>
              <div className="flex-1 min-w-[150px] bg-purple-50 rounded-xl px-6 py-3 border border-purple-100">
                <span className="text-[10px] font-bold text-purple-600 uppercase block mb-0.5 tracking-widest">Result</span>
                <span className="text-2xl font-bold text-purple-700 font-mono">{r3.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <ShareResult title={`${val5} is ${val6}% of X`} result={r3.toLocaleString()} calcUrl={`https://calcpro.com.np/calculator/percentage`} />
            </div>
          </div>

          {/* Type 4: Percentage Increase / Decrease */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Percentage Change (Increase/Decrease)</h3>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-500 font-medium">From</span>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={val7} onChange={e => setVal7(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold text-gray-900 bg-white" />
              <span className="text-gray-500 font-medium">to</span>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={val8} onChange={e => setVal8(+e.target.value)} className="w-32 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold text-gray-900 bg-white" />
              <span className="text-gray-500 font-medium">?</span>
              
              <div className={`flex-1 min-w-[150px] rounded-xl px-6 py-3 border ${r4.dir === 'increase' ? 'bg-red-50 border-red-100' : r4.dir === 'decrease' ? 'bg-teal-50 border-teal-100' : 'bg-gray-50 border-gray-100'}`}>
                <span className={`text-[10px] font-bold uppercase block mb-0.5 tracking-widest ${r4.dir === 'increase' ? 'text-red-600' : r4.dir === 'decrease' ? 'text-teal-600' : 'text-gray-500'}`}>
                  {r4.dir === 'increase' ? 'Increase' : r4.dir === 'decrease' ? 'Decrease' : 'Change'}
                </span>
                <span className={`text-2xl font-bold font-mono ${r4.dir === 'increase' ? 'text-red-700' : r4.dir === 'decrease' ? 'text-teal-700' : 'text-gray-700'}`}>
                  {r4.pct.toFixed(2)}%
                </span>
                {r4.diff !== 0 && (
                  <span className="text-xs ml-2 opacity-60">
                    ({r4.diff > 0 ? '+' : ''}{r4.diff.toLocaleString()} diff)
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <ShareResult title={`% Change from ${val7} to ${val8}`} result={`${r4.pct.toFixed(2)}% ${r4.dir}`} calcUrl={`https://calcpro.com.np/calculator/percentage`} />
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I calculate a percentage of a number?',
            answer: 'To find a percentage of a number, multiply the number by the percentage (expressed as a decimal). For example, to find 20% of 500, multiply 500 by 0.20, which equals 100.',
          },
          {
            question: 'What is the formula for percentage?',
            answer: 'The basic percentage formula is: (Part / Whole) * 100. For example, if you have 150 out of 600, the percentage is (150 / 600) * 100 = 25%.',
          },
          {
            question: 'How to calculate percentage increase?',
            answer: 'To calculate percentage increase: ((New Value - Old Value) / Old Value) * 100. For example, if a price goes from NPR 100 to NPR 120, the increase is ((120 - 100) / 100) * 100 = 20%.',
          },
          {
            question: 'How to calculate percentage decrease?',
            answer: 'To calculate percentage decrease: ((Old Value - New Value) / Old Value) * 100. For example, if a price goes from NPR 100 to NPR 80, the decrease is ((100 - 80) / 100) * 100 = 20%.',
          },
          {
            question: 'What is 10% of 1000?',
            answer: '10% of 1000 is 100. You can calculate this by multiplying 1000 by 0.10.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
