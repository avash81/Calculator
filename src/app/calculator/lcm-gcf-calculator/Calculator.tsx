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
    if (arr.length === 0) return { lcm: 0, gcf: 0, valid: false, numbers: [] };

    const gcd2 = (a: number, b: number): number => b === 0 ? a : gcd2(b, a % b);
    const lcm2 = (a: number, b: number): number => (a * b) / gcd2(a, b);

    let gcf = arr[0];
    let lcm = arr[0];
    for (let i = 1; i < arr.length; i++) {
      gcf = gcd2(gcf, arr[i]);
      lcm = lcm2(lcm, arr[i]);
    }

    return { lcm, gcf, valid: true, numbers: arr };
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
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                Enter numbers (comma separated)
              </label>
              <textarea
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="e.g. 12, 18, 24"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none font-mono text-xl text-gray-900 resize-none bg-white"
              />
              <p className="mt-3 text-xs text-gray-400 font-medium">
                Enter multiple positive integers separated by commas.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                Least Common Multiple (LCM)
              </div>
              <div className="text-4xl font-bold font-mono text-white mb-6 truncate" title={r.lcm.toString()}>
                {r.valid ? r.lcm.toLocaleString() : '-'}
              </div>
              
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1 pt-4 border-t border-blue-500">
                Greatest Common Factor (GCF)
              </div>
              <div className="text-4xl font-bold font-mono text-blue-100 truncate" title={r.gcf.toString()}>
                {r.valid ? r.gcf.toLocaleString() : '-'}
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
