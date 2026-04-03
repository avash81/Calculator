'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function FractionCalculator() {
  const [w1, setW1] = useState(0);
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [w2, setW2] = useState(0);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');

  const r = useMemo(() => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    
    // Convert mixed to improper
    const num1 = w1 * d1 + n1;
    const num2 = w2 * d2 + n2;

    let resN = 0;
    let resD = 0;

    switch (op) {
      case '+':
        resN = num1 * d2 + num2 * d1;
        resD = d1 * d2;
        break;
      case '-':
        resN = num1 * d2 - num2 * d1;
        resD = d1 * d2;
        break;
      case '*':
        resN = num1 * num2;
        resD = d1 * d2;
        break;
      case '/':
        resN = num1 * d2;
        resD = d1 * num2;
        break;
    }

    const common = Math.abs(gcd(resN, resD));
    const simplifiedN = resN / common;
    const simplifiedD = resD / common;
    
    const whole = Math.floor(Math.abs(simplifiedN) / simplifiedD) * (simplifiedN < 0 ? -1 : 1);
    const mixedN = Math.abs(simplifiedN) % simplifiedD;

    return {
      n: simplifiedN,
      d: simplifiedD,
      mixed: { w: whole, n: mixedN, d: simplifiedD },
      decimal: resN / resD,
      percentage: (resN / resD) * 100
    };
  }, [w1, n1, d1, w2, n2, d2, op]);

  return (
    <>
      <JsonLd type="calculator"
        name="Fraction Calculator"
        description="Add, subtract, multiply, and divide fractions. Get results in both simplified fraction and decimal forms. Perfect for students and math homework."
        url="https://calcpro.com.np/calculator/fraction-calculator" />

      <CalcWrapper
        title="Fraction Calculator"
        description="Add, subtract, multiply, and divide fractions. Get results in both simplified fraction and decimal forms."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Fraction' }]}
        relatedCalcs={[
          { name: 'Scientific', slug: 'scientific-calculator' },
          { name: 'Percentage', slug: 'percentage' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-center gap-10">
              {/* Fraction 1 */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Whole</span>
                  <input type="number" value={w1} onChange={e => setW1(+e.target.value)} className="w-16 h-14 text-center rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-black text-xl" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" value={n1} onChange={e => setN1(+e.target.value)} className="w-16 h-12 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                  <div className="w-16 h-1 bg-gray-300 dark:bg-gray-700"></div>
                  <input type="number" value={d1} onChange={e => setD1(+e.target.value)} className="w-16 h-12 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                </div>
              </div>

              {/* Operator */}
              <div className="grid grid-cols-2 gap-2">
                {['+', '-', '*', '/'].map(o => (
                  <button key={o} onClick={() => setOp(o as any)} className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${op === o ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                    {o === '*' ? '×' : o === '/' ? '÷' : o}
                  </button>
                ))}
              </div>

              {/* Fraction 2 */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Whole</span>
                   <input type="number" value={w2} onChange={e => setW2(+e.target.value)} className="w-16 h-14 text-center rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-black text-xl" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" value={n2} onChange={e => setN2(+e.target.value)} className="w-16 h-12 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                  <div className="w-16 h-1 bg-gray-300 dark:bg-gray-700"></div>
                  <input type="number" value={d2} onChange={e => setD2(+e.target.value)} className="w-16 h-12 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-xl text-center space-y-8">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Simplified Proper</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl font-black text-blue-400">{r.n}</div>
                  <div className="w-20 h-1 bg-white/10 rounded-full"></div>
                  <div className="text-4xl font-black text-blue-400">{r.d}</div>
                </div>
              </div>

              {r.mixed.w !== 0 && (
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 text-center">Mixed Fraction</div>
                   <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl font-black text-emerald-400">{r.mixed.w}</span>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-bold">{r.mixed.n}</span>
                        <div className="w-10 h-0.5 bg-white/20"></div>
                        <span className="text-xl font-bold">{r.mixed.d}</span>
                      </div>
                   </div>
                </div>
              )}

              <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Decimal</span>
                    <div className="text-sm font-bold text-gray-300">{r.decimal.toFixed(4)}</div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Percent</span>
                    <div className="text-sm font-bold text-gray-300">{r.percentage.toFixed(2)}%</div>
                 </div>
              </div>
            </div>

            <ShareResult 
              title="Fraction Result" 
              result={`${r.n}/${r.d}`} 
              calcUrl={`https://calcpro.com.np/calculator/fraction-calculator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I add fractions with different denominators?',
            answer: 'To add fractions with different denominators, you must first find a common denominator, convert each fraction, add the numerators, and then simplify the resulting fraction.',
          },
          {
            question: 'What is a simplified fraction?',
            answer: 'A simplified fraction is one where the numerator and denominator have no common factors other than 1. Our calculator automatically simplifies all results.',
          },
          {
            question: 'How do I multiply fractions?',
            answer: 'To multiply fractions, simply multiply the numerators together and multiply the denominators together, then simplify the result.',
          },
          {
            question: 'How do I divide fractions?',
            answer: 'To divide fractions, multiply the first fraction by the reciprocal (the flipped version) of the second fraction.',
          },
          {
            question: 'Can this calculator handle mixed numbers?',
            answer: 'This version handles simple fractions. To use mixed numbers, convert them to improper fractions first (e.g., 1 1/2 becomes 3/2).',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
