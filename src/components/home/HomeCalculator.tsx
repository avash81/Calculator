'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { safeEval } from '@/utils/math/safeEval';
import { Send, MoveUpRight, Clock, ChevronRight } from 'lucide-react';

type CalcMode = 'scientific' | 'solver';
type SolverTab = 'Algebra' | 'Trigonometry' | 'Calculus';

interface CalcHistory {
  q: string;
  a: string;
  t: number;
}

export function HomeCalculator() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [solverTab, setSolverTab] = useState<SolverTab>('Algebra');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [solverInput, setSolverInput] = useState('');
  const [history, setHistory] = useState<CalcHistory[]>([]);
  const [memory, setMemory] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('calcpro_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = useCallback((q: string, a: string) => {
    const newH = [{ q, a, t: Date.now() }, ...history].slice(0, 10);
    setHistory(newH);
    localStorage.setItem('calcpro_history', JSON.stringify(newH));
  }, [history]);

  const append = useCallback((val: string) => {
    if (display === 'Error') {
      setDisplay(val);
      setEquation(val);
      return;
    }
    setDisplay(prev => (prev === '0') ? val : prev + val);
    setEquation(prev => prev + val);
  }, [display]);

  const calculate = useCallback(() => {
    try {
      const q = equation || display;
      const res = safeEval(q, { isDeg });
      setDisplay(res);
      setEquation('');
      if (res !== 'Error') saveToHistory(q, res);
    } catch { setDisplay('Error'); }
  }, [display, equation, isDeg, saveToHistory]);

  const memOperation = (op: string) => {
    try {
      const current = parseFloat(display);
      if (isNaN(current)) return;
      if (op === 'MC') setMemory(0);
      if (op === 'MS') setMemory(current);
      if (op === 'MR') setDisplay(String(memory));
      if (op === 'M+') setMemory(m => m + current);
      if (op === 'M-') setMemory(m => m - current);
    } catch {}
  };

  if (!mounted) return (
    <div className="w-full h-[450px] bg-white border border-gray-100 rounded-[32px] animate-pulse flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
       Constructing Matrix...
    </div>
  );

  return (
    <div className="w-full bg-white border border-gray-100 rounded-[40px] shadow-2xl overflow-hidden select-none font-sans relative">
      
      {/* HEADER TABS */}
      <div className="flex bg-gray-50/50 border-b border-gray-100 p-1">
        <button onClick={() => setMode('scientific')} className={`flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-[32px] ${mode === 'scientific' ? 'text-[#1A73E8] bg-white shadow-sm' : 'text-gray-400 opacity-60 hover:opacity-100'}`}>
          <span className="text-base">🔢</span> Scientific
        </button>
        <button onClick={() => setMode('solver')} className={`flex-1 py-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-[32px] ${mode === 'solver' ? 'text-[#1A73E8] bg-white shadow-sm' : 'text-gray-400 opacity-60 hover:opacity-100'}`}>
          <span className="text-base">🧮</span> Maths Solver
        </button>
      </div>

      <div className="p-6 md:p-8">
        {mode === 'scientific' ? (
          <div className="space-y-6">
            {/* DISPLAY BOX */}
            <div className="relative border border-gray-100 rounded-[32px] bg-gray-50/30 px-8 py-8 min-h-[160px] flex flex-col justify-end items-end transition-all overflow-hidden group">
               <button onClick={() => setShowHistory(true)} className="absolute left-6 top-6 w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#1A73E8] hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                  <Clock className="w-5 h-5" />
               </button>
               {memory !== 0 && (
                 <div className="absolute left-6 bottom-6 flex items-center gap-2 text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    M STO: {memory}
                 </div>
               )}
               <div className="text-sm text-gray-300 font-calc mb-3 tracking-wide">{equation || '0'}</div>
               <div className="text-6xl md:text-8xl font-calc font-light text-[#202124] tracking-tighter leading-none">{display}</div>
            </div>

            {/* DEG/RAD TOGGLE */}
            <div className="flex items-center gap-4">
               <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                  <button onClick={() => setIsDeg(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isDeg ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Deg</button>
                  <button onClick={() => setIsDeg(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isDeg ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Rad</button>
               </div>
            </div>

            {/* MAIN BUTTON GRID - 7 COLUMNS AS PER SCREENSHOT */}
            <div className="grid grid-cols-7 gap-2">
               {/* ROW 1 */}
               <button className="h-12 border border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase hover:bg-gray-50">Inv</button>
               <button onClick={() => append('sin(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">sin</button>
               <button onClick={() => append('ln(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">ln</button>
               {[7, 8, 9].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold hover:bg-gray-200">{n}</button>)}
               <button onClick={() => append('/')} className="h-12 border border-gray-100 rounded-2xl text-2xl text-gray-400 hover:bg-gray-50">÷</button>

               {/* ROW 2 */}
               <button onClick={() => append('pi')} className="h-12 border border-gray-100 rounded-2xl text-sm font-bold text-blue-600 hover:bg-gray-50">π</button>
               <button onClick={() => append('cos(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">cos</button>
               <button onClick={() => append('log(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">log</button>
               {[4, 5, 6].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold hover:bg-gray-200">{n}</button>)}
               <button onClick={() => append('*')} className="h-12 border border-gray-100 rounded-2xl text-2xl text-gray-400 hover:bg-gray-50">×</button>

               {/* ROW 3 */}
               <button onClick={() => append('e')} className="h-12 border border-gray-100 rounded-2xl text-sm font-bold text-blue-600 hover:bg-gray-50">e</button>
               <button onClick={() => append('tan(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">tan</button>
               <button onClick={() => append('sqrt(')} className="h-12 bg-blue-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase hover:bg-blue-100">√</button>
               {[1, 2, 3].map(n => <button key={n} onClick={() => append(String(n))} className="h-12 bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold hover:bg-gray-200">{n}</button>)}
               <button onClick={() => append('-')} className="h-12 border border-gray-100 rounded-2xl text-3xl text-gray-400 hover:bg-gray-50">−</button>

               {/* ROW 4 */}
               <button className="h-12 bg-gray-50 text-[9px] font-black text-gray-400 rounded-2xl uppercase tracking-widest">Ans</button>
               <button className="h-12 bg-gray-50 text-[9px] font-black text-gray-400 rounded-2xl uppercase tracking-widest">EXP</button>
               <button onClick={() => append('^')} className="h-12 bg-gray-50 text-blue-600 rounded-2xl text-sm font-bold">xʸ</button>
               <button onClick={() => append('0')} className="h-12 bg-gray-100 text-gray-900 rounded-2xl text-xl font-bold hover:bg-gray-200">0</button>
               <button onClick={() => setMode('solver')} className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest flex items-center gap-2">
                  Open Full Maths Solver <MoveUpRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-gray-900 tracking-tight">Maths solver</h2>
               <div className="flex gap-8 border-b border-gray-100 mt-6">
                 {['Algebra', 'Trigonometry', 'Calculus'].map(tab => (
                   <button key={tab} onClick={() => setSolverTab(tab as any)} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${solverTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'}`}>
                      {tab}
                      {solverTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)]" />}
                   </button>
                 ))}
               </div>
            </div>

            <div className="relative">
               <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 focus-within:bg-white focus-within:border-blue-600 transition-all shadow-inner">
                  <div className="flex items-center gap-4">
                     <input 
                        value={solverInput}
                        onChange={e => setSolverInput(e.target.value)}
                        placeholder="e.g. 6x + 5 = 14  or  sin(45)"
                        className="flex-1 bg-transparent border-none outline-none text-2xl font-calc text-gray-900 placeholder:text-gray-300"
                     />
                     <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90 shadow-lg shadow-blue-200">
                        <Send className="w-5 h-5 rotate-[-45deg]" />
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 {l:'Linear equations', e:'6x + 5 = 14'},
                 {l:'Quadratic equations', e:'x² - 5x + 6 = 0'},
                 {l:'Polynomials', e:'(x+2)(x-3)'}
               ].map(chip => (
                 <button key={chip.l} onClick={() => setSolverInput(chip.e)} className="p-6 border border-gray-100 rounded-[28px] bg-white hover:border-blue-600 hover:shadow-xl transition-all text-left space-y-2 group">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600">{chip.l}</div>
                    <div className="text-lg font-calc text-gray-900">{chip.e}</div>
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAV CTAs */}
      <div className="bg-gray-50/50 border-t border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex gap-8">
            <Link href="/calculator/loan-emi" className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2">EMI Calculator <ChevronRight className="w-3 h-3"/></Link>
            <Link href="/calculator/nepal-income-tax" className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2">Income Tax <ChevronRight className="w-3 h-3"/></Link>
         </div>
         <Link href="/calculator" className="flex items-center gap-4 group">
            <span className="text-[11px] font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">Global Directory</span>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110">80+</div>
         </Link>
      </div>
    </div>
  );
}