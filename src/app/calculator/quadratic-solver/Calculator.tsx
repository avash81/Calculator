'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FunctionSquare, Binary, Sigma, Info, ChevronRight } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { solveQuadratic } from '@/utils/math/safeCalculations';

const DEFAULT_STATE = {
  a: 1,
  b: -5,
  c: 6,
};

export default function QuadraticSolver() {
  const [state, setState] = useLocalStorage('calcpro_quadratic_v2', DEFAULT_STATE);
  const { a, b, c } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const result = useMemo(() => {
    return solveQuadratic(a, b, c);
  }, [a, b, c]);

  const applyPreset = (pa: number, pb: number, pc: number) => {
    updateState({ a: pa, b: pb, c: pc });
  };

  return (
    <CalculatorErrorBoundary calculatorName="Quadratic Solver">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
             Advanced Algebra
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Quadratic <span className="text-purple-600">Solver</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Solve complex equations of the form <span className="font-mono italic">ax² + bx + c = 0</span> with full step-by-step breakdown and discriminant analysis.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="flex justify-center mb-8">
               <div className="inline-block px-8 py-3 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tighter italic">
                    {a}x² {b >= 0 ? '+' : ''}{b}x {c >= 0 ? '+' : ''}{c} = 0
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ValidatedInput label="Coeff. a" value={a} onChange={(v) => updateState({ a: v })} required hint="x² multiplier" />
              <ValidatedInput label="Coeff. b" value={b} onChange={(v) => updateState({ b: v })} required hint="x multiplier" />
              <ValidatedInput label="Coeff. c" value={c} onChange={(v) => updateState({ c: v })} required hint="constant" />
            </div>

            {/* Step-by-Step Breakdown */}
            {result.success && result.data && (
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
                 <div className="flex items-center gap-2">
                    <Binary className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Mathematical Breakdown</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                       <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-black text-xs">1</div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discriminant (Δ)</p>
                          <p className="text-sm font-bold font-mono">D = b² - 4ac = ({b})² - 4({a})({c}) = {result.data.discriminant}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                       <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-black text-xs">2</div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nature of Roots</p>
                          <p className="text-sm font-bold">
                             {result.data.discriminant > 0 ? 'D > 0: Two Distinct Real Roots' : 
                              result.data.discriminant === 0 ? 'D = 0: One Repeated Real Root' : 
                              'D < 0: Two Complex Conjugate Roots'}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                       <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-black text-xs">3</div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quadratic Formula</p>
                          <p className="text-sm font-bold">x = [-b ± √D] / 2a</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {result.success && result.data ? (
              <>
                <ResultCard
                  label="Root x₁"
                  value={result.data.roots[0].display}
                  color="purple"
                  title="Primary Solution"
                  copyValue={`x1 = ${result.data.roots[0].display}`}
                />

                {result.data.roots.length > 1 && (
                  <ResultCard
                    label="Root x₂"
                    value={result.data.roots[1].display}
                    color="purple"
                    title="Secondary Solution"
                    copyValue={`x2 = ${result.data.roots[1].display}`}
                  />
                )}

                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-5 shadow-sm">
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400 uppercase tracking-widest">Symmetry Axis</span>
                      <span className="font-black text-gray-900 dark:text-white">x = {(-b / (2 * a)).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-400 uppercase tracking-widest">Vertex (h, k)</span>
                      <span className="font-black text-gray-900 dark:text-white">({(-b / (2 * a)).toFixed(2)}, {(result.data.discriminant / (-4 * a)).toFixed(2)})</span>
                   </div>
                </div>

                <div className="bg-gray-900 text-white p-8 rounded-[2rem] space-y-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Common Presets</h4>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => applyPreset(1, -5, 6)} className="text-[10px] p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all font-bold">Real: x²-5x+6</button>
                      <button onClick={() => applyPreset(1, 2, 5)} className="text-[10px] p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all font-bold">Complex: x²+2x+5</button>
                   </div>
                </div>
              </>
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                <p className="font-black uppercase tracking-widest text-xs">Equation Error</p>
                <p className="font-bold">{result.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'What is the Discriminant (D)?',
                  answer: 'The discriminant (b² - 4ac) determines the nature of the roots. If D > 0, there are two real roots. If D = 0, there is one repeated real root. If D < 0, there are two complex (imaginary) solutions.'
                },
                {
                  question: 'Can this solve complex roots?',
                  answer: 'Yes, this tool automatically handles complex solutions (a ± bi) when the discriminant is negative.'
                },
                {
                  question: 'Why is "a" not allowed to be zero?',
                  answer: 'If the coefficient "a" is zero, the equation is no longer quadratic; it becomes a linear equation (bx + c = 0).'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
