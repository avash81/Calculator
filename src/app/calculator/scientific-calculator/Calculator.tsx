'use client';
import { useState, useCallback, useMemo } from 'react';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { safeEval } from '@/utils/math/safeEval';
import { Info, History, Settings, Zap, FunctionSquare, Binary, Sigma } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

type CalcMode = 'scientific' | 'solver';
type SolverTab = 'algebra' | 'trigonometry' | 'calculus';

const DEFAULT_STATE = {
  mode: 'scientific' as CalcMode,
  isDeg: true,
  lastEquation: '',
  display: '0',
  solverTab: 'algebra' as SolverTab,
  solverInput: '',
};

export default function ScientificCalculator() {
  const [state, setState] = useLocalStorage('calcpro_scientific_v2', DEFAULT_STATE);
  const { mode, isDeg, lastEquation, display, solverTab, solverInput } = state;

  const [history, setHistory] = useLocalStorage<string[]>('calcpro_sci_history', []);

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const calculate = useCallback((expr: string) => {
    try {
      const result = safeEval(expr, { isDeg });
      if (result !== 'Error') {
        setHistory([`${expr} = ${result}`, ...history].slice(0, 10));
      }
      updateState({ display: result, lastEquation: expr });
    } catch {
      updateState({ display: 'Error' });
    }
  }, [isDeg, history, setHistory, state]);

  const handleKeyPress = (val: string) => {
    if (val === '=') {
      calculate(lastEquation || display);
      return;
    }
    if (val === 'AC') {
      updateState({ display: '0', lastEquation: '' });
      return;
    }
    if (val === '⌫') {
      const next = (lastEquation || display).slice(0, -1);
      updateState({ lastEquation: next, display: next || '0' });
      return;
    }

    const nextEq = (lastEquation === '0' || display === 'Error') ? val : (lastEquation + val);
    updateState({ lastEquation: nextEq, display: nextEq });
  };

  const applyFn = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    let expr = '';
    switch (fn) {
      case 'sin': expr = `sin(${val})`; break;
      case 'cos': expr = `cos(${val})`; break;
      case 'tan': expr = `tan(${val})`; break;
      case 'sqrt': expr = `sqrt(${val})`; break;
      case 'log': expr = `log(${val})`; break;
      case 'ln': expr = `ln(${val})`; break;
      case 'pow2': expr = `(${val})^2`; break;
      case 'pi': updateState({ display: Math.PI.toString(), lastEquation: Math.PI.toString() }); return;
      case 'e': updateState({ display: Math.E.toString(), lastEquation: Math.E.toString() }); return;
    }
    if (expr) calculate(expr);
  };

  const fnBtn = "h-11 rounded-2xl bg-gray-800 text-gray-300 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-700 transition-all active:scale-95 border border-gray-700/50";
  const numBtn = "h-14 rounded-2xl bg-gray-900 text-white font-black text-xl hover:bg-gray-800 transition-all active:scale-95 border border-gray-800 shadow-sm";
  const opBtn = "h-14 rounded-2xl bg-blue-600 text-white font-black text-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20";

  return (
    <CalculatorErrorBoundary calculatorName="Scientific Calculator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
           <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
             Research & Compute
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Scientific <span className="text-indigo-600">Engine</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             A high-precision mathematical core designed for engineering, complex calculus, and rapid algebraic solving.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Main Calculator */}
          <div className="bg-gray-950 p-6 sm:p-8 rounded-[3rem] border-8 border-gray-900 shadow-2xl space-y-6">
             
             {/* Display Area */}
             <div className="bg-black/40 rounded-[2rem] p-8 text-right space-y-2 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-4">
                   <button 
                    onClick={() => updateState({ isDeg: !isDeg })}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${isDeg ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                   >
                     {isDeg ? 'DEG' : 'RAD'}
                   </button>
                </div>
                <div className="text-gray-500 font-mono text-sm h-6 truncate opacity-60">
                   {lastEquation || '0'}
                </div>
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter truncate font-mono">
                   {display}
                </div>
             </div>

             {/* Mode Selector */}
             <div className="flex gap-2 p-1 bg-gray-900 rounded-2xl border border-gray-800">
                <button 
                  onClick={() => updateState({ mode: 'scientific' })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'scientific' ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500'}`}
                >Scientific</button>
                <button 
                  onClick={() => updateState({ mode: 'solver' })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'solver' ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500'}`}
                >Math Solver</button>
             </div>

             {mode === 'scientific' ? (
               <div className="space-y-4">
                  {/* Fn Keys */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                     {['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', 'pow2', 'pi', 'e', '(', ')', '%'].map(f => (
                       <button key={f} onClick={() => applyFn(f)} className={fnBtn}>{f}</button>
                     ))}
                  </div>

                  {/* Main Pad */}
                  <div className="grid grid-cols-4 gap-3">
                     <button onClick={() => handleKeyPress('AC')} className="col-span-2 h-14 rounded-2xl bg-rose-600/10 text-rose-500 font-black text-lg border border-rose-500/20 hover:bg-rose-600/20 transition-all">AC</button>
                     <button onClick={() => handleKeyPress('⌫')} className="h-14 rounded-2xl bg-amber-600/10 text-amber-500 font-black text-lg border border-amber-500/20 hover:bg-amber-600/20 transition-all">⌫</button>
                     <button onClick={() => handleKeyPress('/')} className={opBtn}>÷</button>
                     
                     {[7,8,9].map(n => <button key={n} onClick={() => handleKeyPress(n.toString())} className={numBtn}>{n}</button>)}
                     <button onClick={() => handleKeyPress('*')} className={opBtn}>×</button>

                     {[4,5,6].map(n => <button key={n} onClick={() => handleKeyPress(n.toString())} className={numBtn}>{n}</button>)}
                     <button onClick={() => handleKeyPress('-')} className={opBtn}>−</button>

                     {[1,2,3].map(n => <button key={n} onClick={() => handleKeyPress(n.toString())} className={numBtn}>{n}</button>)}
                     <button onClick={() => handleKeyPress('+')} className={opBtn}>+</button>

                     <button onClick={() => handleKeyPress('0')} className="col-span-2 text-left px-8 font-black text-xl bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-sm">0</button>
                     <button onClick={() => handleKeyPress('.')} className={numBtn}>.</button>
                     <button onClick={() => handleKeyPress('=')} className="h-14 rounded-2xl bg-emerald-600 text-white font-black text-2xl hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">=</button>
                  </div>
               </div>
             ) : (
               <div className="space-y-4 py-8 text-center bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-800">
                  <Zap className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Solver Integration</h3>
                  <p className="text-gray-500 text-sm font-medium px-8">Use the Specialized Solvers (Quadratic, Linear, etc) for step-by-step symbolic math. This engine is optimized for pure numeric computation.</p>
                  <div className="pt-4 flex justify-center gap-4">
                     <a href="/calculator/quadratic-solver" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline">Quadratic Solver →</a>
                  </div>
               </div>
             )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6 lg:sticky lg:top-8">
             
             {/* History Card */}
             {history.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Session</h3>
                      </div>
                      <button onClick={() => setHistory([])} className="text-[9px] font-black text-rose-500 uppercase tracking-widest underline decoration-2">Clear</button>
                   </div>
                   <div className="space-y-4">
                      {history.map((h, i) => (
                        <div key={i} className="flex flex-col gap-1 border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0 hover:translate-x-1 transition-transform cursor-pointer" onClick={() => updateState({ display: h.split('=')[1].trim(), lastEquation: h.split('=')[0].trim() })}>
                           <span className="text-[10px] font-bold text-gray-400 truncate">{h.split('=')[0].trim()}</span>
                           <span className="text-lg font-black text-indigo-600 tracking-tighter">= {h.split('=')[1].trim()}</span>
                        </div>
                      ))}
                   </div>
                </div>
             )}

             <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 space-y-4">
                <div className="flex items-center gap-2">
                   <Settings className="w-5 h-5 text-indigo-200" />
                   <h3 className="text-sm font-black uppercase tracking-widest">Scientific Precision</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-90">
                   Engineered using 64-bit IEEE-754 precision. Ideal for university-level physics, complex trigonometry, and engineering benchmarks.
                </p>
             </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'Does this calculator support Radians?',
                  answer: 'Yes. You can toggle between DEG (Degrees) and RAD (Radians) at the top left of the display. This affects all trigonometric functions like sin, cos, and tan.'
                },
                {
                  question: 'How accurate are the results?',
                  answer: 'The engine uses the standard double-precision floating-point format (IEEE 754), providing approximately 15-17 significant decimal digits of precision.'
                },
                {
                  question: 'Can I reuse previous results?',
                  answer: 'Yes. Simply click on any result in the "Recent Session" history sidebar to load that specific calculation back into the main engine.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
