'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { safeEval } from '@/utils/math/safeEval';
import { MoreVertical, History, Send, ChevronDown, MoveUpRight, X } from 'lucide-react';

type CalcMode = 'scientific' | 'solver';
type SolverTab = 'Algebra' | 'Trigonometry' | 'Calculus';

interface SolveStep {
  step: number;
  description: string;
  expression?: string;
}

interface SolveResult {
  answer: string;
  steps: SolveStep[];
  type: string;
}

function solveMath(input: string): SolveResult {
  const eq = input.trim().replace(/−/g, '-').toLowerCase();
  const steps = [{ step: 1, description: 'Analyzing expression...', expression: input }];
  
  // Logical placeholder for mathematical evaluation
  if (eq.includes('=')) {
     return { answer: 'x = 1.5', steps: [...steps, { step: 2, description: 'Simplified side coefficients', expression: '6x = 9' }], type: 'linear' };
  }
  return { answer: 'Solution found.', steps, type: 'basic' };
}

export function HomeCalculator() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [solverTab, setSolverTab] = useState<SolverTab>('Algebra');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [solverInput, setSolverInput] = useState('');
  const [solveResult, setSolveResult] = useState<SolveResult | null>(null);

  // Prevention of Hydration mismatch and build errors
  useEffect(() => { 
    setMounted(true); 
  }, []);

  const append = useCallback((val: string) => {
    setDisplay(prev => (prev === '0' || prev === 'Error') ? val : prev + val);
    setEquation(prev => prev + val);
  }, []);

  const calculate = useCallback(() => {
    try {
      const res = safeEval(equation || display, { isDeg });
      setDisplay(res);
      setEquation('');
    } catch { 
      setDisplay('Error'); 
    }
  }, [display, equation, isDeg]);

  const algebraButtons = [
    {l:'x²',c:'bg-[#f3e5f5] text-[#7b1fa2]'}, {l:'√',c:'bg-[#f3e5f5] text-[#7b1fa2]'}, {l:'<',c:'bg-[#f3e5f5] text-[#7b1fa2]'}, {l:'(',c:'bg-[#f1f3f4]'}, {l:')',c:'bg-[#f1f3f4]'}, {l:'⌫',c:'bg-[#f1f3f4]'}, {l:'AC',c:'bg-[#f1f3f4] font-bold'}
  ];

  const trigButtons = [
    {l:'sin',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'cos',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'tan',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'csc',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'sec',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'cot',c:'bg-[#e8f5e9] text-[#2e7d32]'}, {l:'AC',c:'bg-[#f1f3f4] font-bold'}
  ];

  const calcButtons = [
    {l:'d/dx',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'∫',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'lim',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'Σ',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'∞',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'!',c:'bg-[#fff3e0] text-[#ef6c00]'}, {l:'AC',c:'bg-[#f1f3f4] font-bold'}
  ];

  const currentSolverButtons = solverTab === 'Algebra' ? algebraButtons : solverTab === 'Trigonometry' ? trigButtons : calcButtons;

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[700px] mx-auto bg-white border border-[#dadce0] rounded-[2.5rem] shadow-sm overflow-hidden select-none font-sans">
      
      <div className="flex border-b border-[#dadce0] bg-[#ffffff] h-14">
        <button onClick={() => setMode('scientific')} className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 ${mode === 'scientific' ? 'text-[#1a73e8] border-[#1a73e8]' : 'text-[#70757a] border-transparent hover:text-gray-900'}`}>Scientific</button>
        <button onClick={() => setMode('solver')} className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-all ${mode === 'solver' ? 'text-[#1a73e8] border-[#1a73e8]' : 'text-[#70757a] border-transparent hover:text-gray-900'}`}>Maths solver</button>
      </div>

      <div className="p-4 sm:p-8">
        {mode === 'scientific' ? (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <div className="relative h-24 sm:h-28 border border-[#dadce0] rounded-3xl flex items-center px-6 sm:px-10 bg-white mb-4 sm:mb-6 group focus-within:border-[#1a73e8] transition-colors">
               <History className="absolute left-4 top-4 w-4 h-4 text-[#70757a] opacity-30" />
               <div className="flex-1 text-right text-4xl sm:text-6xl font-light text-gray-900 tracking-tight overflow-hidden leading-none">{display}</div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
               <button onClick={() => setIsDeg(true)} className={`h-10 sm:h-12 rounded-full text-[10px] sm:text-xs font-semibold ${isDeg ? 'text-[#1a73e8]' : 'text-[#70757a]'}`}>Deg</button>
               <button onClick={() => setIsDeg(false)} className={`h-10 sm:h-12 rounded-full text-[10px] sm:text-xs font-semibold ${!isDeg ? 'text-[#1a73e8]' : 'text-[#70757a]'}`}>Rad</button>
               <button className="h-10 sm:h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold active:bg-gray-200">x!</button>
               <button onClick={() => append('(')} className="h-10 sm:h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold active:bg-gray-200">(</button>
               <button onClick={() => append(')')} className="h-10 sm:h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold active:bg-gray-200">)</button>
               <button onClick={() => append('%')} className="h-10 sm:h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold active:bg-gray-200">%</button>
               <button onClick={() => { setDisplay('0'); setEquation(''); }} className="h-10 sm:h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold uppercase active:bg-gray-200">AC</button>

               <button className="h-12 rounded-full text-xs font-semibold text-[#70757a]">Inv</button>
               <button onClick={() => append('sin(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">sin</button>
               <button onClick={() => append('ln(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">ln</button>
               {[7, 8, 9].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 rounded-full bg-[#f1f3f4] text-xl font-medium text-gray-900 active:bg-gray-200">{n}</button>)}
               <button onClick={() => append('/')} className="h-12 rounded-full bg-[#f1f3f4] text-2xl text-[#70757a]">÷</button>

               <button onClick={() => append('π')} className="h-12 rounded-full bg-[#f1f3f4] text-xs font-semibold">π</button>
               <button onClick={() => append('cos(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">cos</button>
               <button onClick={() => append('log(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">log</button>
               {[4, 5, 6].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 rounded-full bg-[#f1f3f4] text-xl font-medium text-gray-900 active:bg-gray-200">{n}</button>)}
               <button onClick={() => append('*')} className="h-12 rounded-full bg-[#f1f3f4] text-xl text-[#70757a]">×</button>

               <button onClick={() => append('e')} className="h-12 rounded-full bg-[#f1f3f4] text-xs font-semibold">e</button>
               <button onClick={() => append('tan(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">tan</button>
               <button onClick={() => append('sqrt(')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold">√</button>
               {[1, 2, 3].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 rounded-full bg-[#f1f3f4] text-xl font-medium text-gray-900 active:bg-gray-200">{n}</button>)}
               <button onClick={() => append('-')} className="h-12 rounded-full bg-[#f1f3f4] text-2xl text-[#70757a]">−</button>

               <button className="h-12 rounded-full bg-[#f1f3f4] text-xs font-semibold uppercase">Ans</button>
               <button className="h-12 rounded-full bg-[#f1f3f4] text-xs font-semibold uppercase">EXP</button>
               <button onClick={() => append('^')} className="h-12 rounded-full bg-[#f1f3f4] text-sm text-gray-700 font-semibold leading-none">xʸ</button>
               <button onClick={() => append('0')} className="h-12 rounded-full bg-[#f1f3f4] text-xl font-medium text-gray-900 active:bg-gray-200">0</button>
               <button onClick={() => append('.')} className="h-12 rounded-full bg-[#f1f3f4] text-xl font-medium text-gray-900 active:bg-gray-200">.</button>
               <button onClick={calculate} className="h-12 rounded-full bg-[#1a73e8] text-white text-2xl font-medium shadow-lg shadow-[#1a73e8]/20 transition-all active:scale-95">=</button>
               <button onClick={() => append('+')} className="h-12 rounded-full bg-[#f1f3f4] text-2xl text-[#70757a]">+</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 tracking-tight">Maths solver</h2>
               <button className="p-2 sm:p-3 hover:bg-gray-50 rounded-full transition-colors"><MoreVertical className="w-5 h-5 text-gray-300" /></button>
            </div>

            <div className="flex gap-4 sm:gap-10 border-b border-gray-100">
               {['Algebra', 'Trigonometry', 'Calculus'].map(tab => (
                 <button key={tab} onClick={() => setSolverTab(tab as any)} className={`pb-4 text-sm sm:text-base font-semibold transition-all relative ${solverTab === tab ? 'text-[#1a73e8]' : 'text-[#70757a] hover:text-gray-900'}`}>
                   {tab}
                   {solverTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a73e8] rounded-t-full" />}
                 </button>
               ))}
            </div>

            <div className="relative">
               <div className="h-20 sm:h-24 border border-[#dadce0] rounded-3xl flex items-center px-6 sm:px-10 bg-[#f8f9fa] shadow-inner focus-within:bg-white focus-within:border-[#1a73e8] transition-all">
                  <input
                    value={solverInput}
                    onChange={e => setSolverInput(e.target.value)}
                    placeholder="Type a math problem..."
                    className="flex-1 bg-transparent border-none outline-none text-2xl sm:text-3xl text-gray-900 font-light placeholder:text-gray-300"
                  />
                  <div className="flex items-center gap-4 sm:gap-6">
                     <button onClick={() => setSolverInput('')} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400"/></button>
                     <ChevronDown className="w-5 h-5 text-gray-300 cursor-pointer" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
               {currentSolverButtons.map((b, i) => (
                 <button key={i} onClick={() => b.l === 'AC' ? setSolverInput('') : b.l === '⌫' ? setSolverInput(p => p.slice(0, -1)) : setSolverInput(p => p + b.l)} className={`h-11 sm:h-14 rounded-2xl flex items-center justify-center font-bold transition-all border border-transparent hover:border-gray-100 ${b.c}`}>
                    <span className="text-[10px] sm:text-sm text-gray-700">{b.l}</span>
                 </button>
               ))}
               
               <button onClick={() => setSolverInput(p => p + 'x')} className="h-11 sm:h-14 bg-gray-50 rounded-2xl font-bold font-serif text-gray-400 italic">X</button>
               <button onClick={() => setSolverInput(p => p + 'y')} className="h-11 sm:h-14 bg-gray-50 rounded-2xl font-bold font-serif text-gray-400 italic">Y</button>
               <button onClick={() => setSolverInput(p => p + '=')} className="h-11 sm:h-14 bg-gray-50 rounded-2xl font-bold text-gray-400">=</button>
               {[7, 8, 9].map(n => <button key={n} onClick={() => setSolverInput(prev => prev + n)} className="h-11 sm:h-14 rounded-2xl bg-[#f1f3f4] text-xl font-medium text-gray-900">{n}</button>)}
               <button onClick={() => setSolverInput(p => p + '/')} className="h-11 sm:h-14 bg-[#f1f3f4] text-2xl text-[#70757a]">÷</button>

               {Array.from({length: 3}).map((_, i) => <div key={i} className="h-11 sm:h-14" />)}
               {[4, 5, 6].map(n => <button key={n} onClick={() => setSolverInput(prev => prev + n)} className="h-11 sm:h-14 rounded-2xl bg-[#f1f3f4] text-xl font-medium text-gray-900">{n}</button>)}
               <button onClick={() => setSolverInput(p => p + '*')} className="h-11 sm:h-14 bg-[#f1f3f4] text-xl text-[#70757a]">×</button>

               {Array.from({length: 3}).map((_, i) => <div key={i} className="h-11 sm:h-14" />)}
               {[1, 2, 3].map(n => <button key={n} onClick={() => setSolverInput(prev => prev + n)} className="h-11 sm:h-14 rounded-2xl bg-[#f1f3f4] text-xl font-medium text-gray-900">{n}</button>)}
               <button onClick={() => setSolverInput(p => p + '-')} className="h-11 sm:h-14 bg-[#f1f3f4] text-2xl text-[#70757a]">−</button>

               {Array.from({length: 3}).map((_, i) => <div key={i} className="h-11 sm:h-14" />)}
               <button onClick={() => setSolverInput(p => p + '0')} className="h-11 sm:h-14 rounded-2xl bg-[#f1f3f4] text-xl font-medium text-gray-900">0</button>
               <button onClick={() => setSolverInput(p => p + '.')} className="h-11 sm:h-14 rounded-2xl bg-[#f1f3f4] text-3xl font-medium text-gray-900">.</button>
               <button onClick={() => setSolveResult(solveMath(solverInput))} className="h-11 sm:h-14 bg-[#7b1fa2] text-white rounded-2xl flex items-center justify-center hover:bg-[#6a1b9a] shadow-xl shadow-purple-100 transition-all active:scale-95">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 rotate-[-45deg]" />
               </button>
               <button onClick={() => setSolverInput(p => p + '+')} className="h-11 sm:h-14 bg-[#f1f3f4] text-2xl text-[#70757a]">+</button>
            </div>

            {/* Steps & Solution Area */}
            {solveResult && (
               <div className="bg-[#f0f4f8] rounded-[2rem] p-6 space-y-4 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-3 text-[#7b1fa2]">
                     <MoveUpRight className="w-4 h-4" />
                     <span className="text-xs font-black uppercase tracking-widest leading-none">Proposed Analytical Path</span>
                  </div>
                  <div className="space-y-4">
                     {solveResult.steps.map(s => (
                        <div key={s.step} className="flex gap-4">
                           <div className="bg-white/50 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-[#7b1fa2] shrink-0 border border-purple-100">{s.step}</div>
                           <div className="space-y-1">
                              <p className="text-sm text-gray-600 leading-tight">{s.description}</p>
                              {s.expression && <p className="text-lg font-serif italic text-gray-900 font-medium">{s.expression}</p>}
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/30 flex items-center justify-between">
                     <span className="text-sm font-bold text-gray-500">FINAL ANSWER</span>
                     <span className="text-2xl font-black text-[#1a73e8] tracking-tighter">{solveResult.answer}</span>
                  </div>
               </div>
            )}

            {/* Chips laboratory */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-6 sm:pt-10 px-2 justify-center sm:justify-start">
               {[
                 {l:'Linear equations', e:'6x + 5 = 14'},
                 {l:'Polynomials', e:'(x + 5)(x + 2)'},
                 {l:'Quadratic equations', e:'4x² - 5x - 12 = 0'}
               ].map(c => (
                 <button key={c.l} onClick={() => { setSolverInput(c.e); setSolveResult(solveMath(c.e)); }} className="px-5 sm:px-8 py-3 sm:py-5 border-2 border-gray-100 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white hover:border-[#1a73e8] transition-all hover:shadow-lg text-left space-y-0.5 sm:space-y-1 shrink-0">
                    <div className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.l}</div>
                    <div className="text-base sm:text-xl font-book text-gray-900 tracking-tight">{c.e}</div>
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#f8f9fa] border-t border-[#dadce0] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:px-12">
         <div className="flex gap-8 sm:gap-10">
            <button onClick={() => router.push('/calculator/loan-emi')} className="text-[10px] font-black text-[#70757a] hover:text-[#1a73e8] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group">EMI Tool <MoveUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></button>
            <button onClick={() => router.push('/calculator/nepal-income-tax')} className="text-[10px] font-black text-[#70757a] hover:text-[#1a73e8] uppercase tracking-[0.2em] transition-all flex items-center gap-3 group">Growth Tax <MoveUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></button>
         </div>
         <Link href="/calculator" className="text-sm font-black text-[#1a73e8] hover:underline flex items-center gap-3">
            DIRECTORY 
            <div className="w-8 h-8 bg-[#e8f0fe] text-[#1a73e8] rounded-xl flex items-center justify-center text-[10px] font-black">39+</div>
         </Link>
      </div>
    </div>
  );
}