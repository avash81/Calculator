'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function LogarithmCalculator() {
  const [base, setBase] = useState(10);
  const [number, setNumber] = useState(100);

  const r = useMemo(() => {
    // log_b(x) = ln(x) / ln(b)
    const result = Math.log(number) / Math.log(base);
    return result;
  }, [base, number]);

  return (
    <>
      <JsonLd type="calculator"
        name="Logarithm Calculator"
        description="Calculate the logarithm of a number with any base. Essential for math and science students. Get results for log10, ln, and custom bases."
        url="https://calcpro.com.np/calculator/logarithm-calculator" />

      <CalcWrapper
        title="Logarithm Calculator"
        description="Calculate the logarithm of a number with any base. Essential for math and science students."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Logarithm' }]}
        relatedCalcs={[
          { name: 'Scientific', slug: 'scientific-calculator' },
          { name: 'Quadratic Solver', slug: 'quadratic-solver' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-4 justify-center py-8 overflow-x-auto">
                <span className="text-2xl font-bold text-gray-300">log</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" inputMode="numeric" value={base} onChange={e => setBase(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">base</span>
                </div>
                <span className="text-2xl font-bold text-gray-300">(</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" inputMode="numeric" value={number} onChange={e => setNumber(+e.target.value)} className="w-24 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">number</span>
                </div>
                <span className="text-2xl font-bold text-gray-300">)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Result</div>
              <div className="text-4xl font-bold font-mono mb-2">{r.toFixed(6)}</div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                log<sub>{base}</sub>({number}) = {r.toFixed(6)}
              </div>
            </div>

            <ShareResult 
              title="Logarithm Result" 
              result={r.toFixed(6)} 
              calcUrl={`https://calcpro.com.np/calculator/logarithm-calculator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is a logarithm?',
            answer: 'A logarithm is the inverse operation to exponentiation. It tells you what exponent a base must be raised to in order to produce a given number.',
          },
          {
            question: 'What is the common logarithm (log10)?',
            answer: 'The common logarithm is a logarithm with base 10. It is frequently used in science and engineering.',
          },
          {
            question: 'What is the natural logarithm (ln)?',
            answer: 'The natural logarithm is a logarithm with base e (approximately 2.718). It is widely used in mathematics and physics.',
          },
          {
            question: 'How do I calculate a logarithm with a custom base?',
            answer: 'You can use the change of base formula: log_b(x) = log_k(x) / log_k(b). Our calculator handles this automatically for any base you provide.',
          },
          {
            question: 'Can a logarithm have a negative base?',
            answer: 'In standard real-number mathematics, the base of a logarithm must be a positive number other than 1.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
