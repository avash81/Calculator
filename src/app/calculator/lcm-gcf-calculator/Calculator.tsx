'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function LcmGcfCalculator() {
  const [inputVal, setInputVal] = useState('12, 18, 24');

  const r = useMemo(() => {
    const arr = inputVal.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (arr.length === 0) return { lcm: 0, gcf: 0, valid: false, numbers: [], factors: [] };

    const gcd2 = (a: number, b: number): number => b === 0 ? a : gcd2(b, a % b);
    const lcm2 = (a: number, b: number): number => (a * b) / gcd2(a, b);

    const getPrimeFactors = (n: number) => {
      let d = 2;
      const factors = [];
      let temp = n;
      while (temp > 1) {
        while (temp % d === 0) {
          factors.push(d);
          temp /= d;
        }
        d++;
        if (d * d > temp) {
          if (temp > 1) factors.push(temp);
          break;
        }
      }
      return factors;
    };

    let gcf = arr[0];
    let lcm = arr[0];
    const factorsMap = arr.map(n => ({ n, factors: getPrimeFactors(n) }));

    for (let i = 1; i < arr.length; i++) {
      gcf = gcd2(gcf, arr[i]);
      lcm = lcm2(lcm, arr[i]);
    }

    return { lcm, gcf, valid: true, numbers: arr, factors: factorsMap };
  }, [inputVal]);

  return (
    <>
      <JsonLd type="calculator"
        name="LCM & GCF Calculator"
        description="Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF) of two or more numbers."
        url="https://calcpro.com.np/calculator/lcm-gcf-calculator" />

      <CalcWrapper
        title="LCM & GCF Calculator"
        description="Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF) of two or more numbers. Perfect for math homework and fractions."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'LCM & GCF' }]}
        relatedCalcs={[
          { name: 'Fraction Calculator', slug: 'fraction-calculator' },
          { name: 'Standard Deviation', slug: 'standard-deviation' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-1">
                Enter numbers (comma separated)
              </label>
              <textarea
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="e.g. 12, 18, 24"
                className="w-full h-40 p-8 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-blue-500 rounded-[2rem] outline-none font-black text-2xl text-gray-900 dark:text-white resize-none transition-all placeholder:text-gray-200"
              />
              <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-1">
                Processing: {r.numbers.join(' • ')}
              </p>
            </div>

            {r.valid && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 space-y-8">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full" />
                    Prime Factorization Analysis
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {r.factors.map((f, i) => (
                      <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                         <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Number {f.n}</div>
                         <div className="text-xl font-black font-mono tracking-tight text-gray-900 dark:text-white">
                            {f.factors.join(' × ')}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <div className="text-4xl font-black">Σ</div>
               </div>
               
               <div className="space-y-8 relative z-10">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Least Common Multiple (LCM)</div>
                    <div className="text-5xl font-black text-blue-400 tracking-tighter">{r.valid ? r.lcm.toLocaleString() : '-'}</div>
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Greatest Common Factor (GCF/HCF)</div>
                    <div className="text-5xl font-black text-emerald-400 tracking-tighter">{r.valid ? r.gcf.toLocaleString() : '-'}</div>
                  </div>

                  {r.valid && r.numbers.length === 2 && (
                    <div className="pt-8 border-t border-white/10 bg-white/5 -mx-10 px-10 py-6">
                       <div className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Mathematical Relation</div>
                       <div className="text-[11px] font-medium leading-relaxed opacity-80">
                          LCM × GCF = Product of Numbers<br/>
                          {r.lcm} × {r.gcf} = {r.numbers[0]} × {r.numbers[1]} = {r.numbers[0] * r.numbers[1]}
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {r.valid && (
               <ShareResult 
                  title={`LCM of ${r.numbers.join(', ')}`} 
                  result={`LCM is ${r.lcm}, GCF is ${r.gcf}`} 
                  calcUrl="https://calcpro.com.np/calculator/lcm-gcf-calculator" 
               />
            )}
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the Least Common Multiple (LCM)?',
            answer: 'The LCM is the smallest integer that is a multiple of two or more given integers. For example, the multiples of 4 and 6 are 12, 24, 36... The smallest exact multiple they share is 12.',
          },
          {
            question: 'What is the Greatest Common Factor (GCF)?',
            answer: 'The GCF (also known as Highest Common Factor - HCF) is the largest positive integer that divides evenly into all the numbers with zero remainder. For example, the GCF of 12 and 18 is 6.',
          },
          {
            question: 'How do I use this calculator?',
            answer: 'Simply type your numbers into the text box, separated by commas (e.g., 24, 36, 48). The calculator will instantly find both the LCM and the GCF across all the numbers provided.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
