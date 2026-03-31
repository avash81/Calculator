'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function FractionCalculator() {
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');

  const r = useMemo(() => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    let resN = 0;
    let resD = 0;

    switch (op) {
      case '+':
        resN = n1 * d2 + n2 * d1;
        resD = d1 * d2;
        break;
      case '-':
        resN = n1 * d2 - n2 * d1;
        resD = d1 * d2;
        break;
      case '*':
        resN = n1 * n2;
        resD = d1 * d2;
        break;
      case '/':
        resN = n1 * d2;
        resD = d1 * n2;
        break;
    }

    const common = Math.abs(gcd(resN, resD));
    return {
      n: resN / common,
      d: resD / common,
      decimal: resN / resD
    };
  }, [n1, d1, n2, d2, op]);

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
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={n1} onChange={e => setN1(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                <div className="w-20 h-1 bg-gray-200"></div>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={d1} onChange={e => setD1(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>

              <div className="flex flex-col gap-2">
                {['+', '-', '*', '/'].map(o => (
                  <button key={o} onClick={() => setOp(o as any)} className={`w-10 h-10 rounded-lg font-bold border-2 transition-all ${op === o ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                    {o === '*' ? '×' : o === '/' ? '÷' : o}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2">
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={n2} onChange={e => setN2(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                <div className="w-20 h-1 bg-gray-200"></div>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={d2} onChange={e => setD2(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-4">Result</div>
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="text-3xl font-bold font-mono">{r.n}</div>
                <div className="w-24 h-1 bg-white/20"></div>
                <div className="text-3xl font-bold font-mono">{r.d}</div>
              </div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                Decimal: {r.decimal.toFixed(4)}
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
