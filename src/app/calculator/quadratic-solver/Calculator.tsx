'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function QuadraticSolver() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const r = useMemo(() => {
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { type: 'Two Real Roots', x1, x2 };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      return { type: 'One Real Root', x1: x, x2: x };
    } else {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-discriminant) / (2 * a);
      return { type: 'Complex Roots', x1: `${real.toFixed(2)} + ${imag.toFixed(2)}i`, x2: `${real.toFixed(2)} - ${imag.toFixed(2)}i` };
    }
  }, [a, b, c]);

  return (
    <>
      <JsonLd type="calculator"
        name="Quadratic Equation Solver"
        description="Solve quadratic equations of the form ax² + bx + c = 0. Get real and complex roots instantly with step-by-step discriminant analysis."
        url="https://calcpro.com.np/calculator/quadratic-solver" />

      <CalcWrapper
        title="Quadratic Equation Solver"
        description="Solve quadratic equations of the form ax² + bx + c = 0. Get real and complex roots instantly."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Quadratic Solver' }]}
        relatedCalcs={[
          { name: 'Scientific', slug: 'scientific-calculator' },
          { name: 'Fraction Calculator', slug: 'fraction-calculator' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-4 justify-center py-8 overflow-x-auto">
                <div className="flex flex-col items-center gap-2">
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={a} onChange={e => setA(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">a</span>
                </div>
                <span className="text-2xl font-bold text-gray-300">x² +</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={b} onChange={e => setB(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">b</span>
                </div>
                <span className="text-2xl font-bold text-gray-300">x +</span>
                <div className="flex flex-col items-center gap-2">
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={c} onChange={e => setC(+e.target.value)} className="w-16 h-12 text-center rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">c</span>
                </div>
                <span className="text-2xl font-bold text-gray-300">= 0</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Roots</div>
              <div className="text-lg font-bold font-mono mb-4">{r.type}</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">x₁</span>
                  <span className="font-mono font-bold">{typeof r.x1 === 'number' ? r.x1.toFixed(4) : r.x1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">x₂</span>
                  <span className="font-mono font-bold">{typeof r.x2 === 'number' ? r.x2.toFixed(4) : r.x2}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Quadratic Equation Roots" 
              result={`x1: ${r.x1}, x2: ${r.x2}`} 
              calcUrl={`https://calcpro.com.np/calculator/quadratic-solver`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is a quadratic equation?',
            answer: 'A quadratic equation is a second-degree polynomial equation in a single variable x, with a non-zero coefficient for x². The general form is ax² + bx + c = 0.',
          },
          {
            question: 'How does the solver find the roots?',
            answer: 'The solver uses the quadratic formula: x = [-b ± sqrt(b² - 4ac)] / 2a.',
          },
          {
            question: 'What is the discriminant?',
            answer: 'The discriminant is the part of the quadratic formula under the square root (b² - 4ac). It determines the nature of the roots (real or complex).',
          },
          {
            question: 'Can this solver handle complex roots?',
            answer: 'Yes, if the discriminant is negative, the solver will provide the roots in the form of complex numbers (a + bi).',
          },
          {
            question: 'What happens if "a" is zero?',
            answer: 'If "a" is zero, the equation is no longer quadratic but linear (bx + c = 0). This solver is specifically designed for quadratic equations where a ≠ 0.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
