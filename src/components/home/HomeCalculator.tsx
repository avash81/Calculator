'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { safeEval } from '@/utils/math/safeEval';
import { 
  Send, MoveUpRight, Clock, ChevronRight, Calculator, Activity, 
  Globe, BookOpen, Trash2, Delete, X, MoreVertical, History, Play
} from 'lucide-react';

type CalcMode = 'scientific' | 'solver';
type SolverTab = 'Algebra' | 'Trigonometry' | 'Calculus';

export function HomeCalculator() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [solverTab, setSolverTab] = useState<SolverTab>('Algebra');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [solverInput, setSolverInput] = useState('');
  const [memory, setMemory] = useState<number>(0);

  useEffect(() => { setMounted(true); }, []);

  const append = useCallback((val: string) => {
    setDisplay(prev => (prev === '0') ? val : prev + val);
    setEquation(prev => prev + val);
  }, []);

  const calculate = useCallback(() => {
    try {
      const res = safeEval(equation || display, { isDeg });
      setDisplay(res);
      setEquation('');
    } catch { setDisplay('Error'); }
  }, [display, equation, isDeg]);

  const memOp = (op: string) => {
    const v = parseFloat(display);
    if (op === 'MC') setMemory(0);
    if (op === 'MR') setDisplay(String(memory));
    if (op === 'MS') setMemory(v);
    if (op === 'M+') setMemory(m => m + v);
    if (op === 'M-') setMemory(m => m - v);
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-white border border-google-border rounded-[32px] shadow-sm overflow-hidden select-none font-sans">
      
      {/* TABS */}
      <div className="flex border-b border-google-border">
        <button onClick={() => setMode('scientific')} className={`flex-1 py-5 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'scientific' ? 'text-google-blue border-b-2 border-b-google-blue' : 'text-gray-400 opacity-60'}`}>
          <Calculator className="w-4 h-4" /> Scientific
        </button>
        <button onClick={() => setMode('solver')} className={`flex-1 py-5 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'solver' ? 'text-google-blue border-b-2 border-b-google-blue' : 'text-gray-400 opacity-60'}`}>
          <Activity className="w-4 h-4" /> Maths Solver
        </button>
      </div>

      <div className="p-6 md:p-8">
        {mode === 'scientific' ? (
          <div className="space-y-6">
            <div className="bg-google-gray rounded-[24px] p-6 text-right border border-google-border min-h-[120px] flex flex-col justify-end">
               <div className="text-sm text-gray-400 font-mono mb-1">{equation || ' '}</div>
               <div className="text-5xl md:text-6xl font-sans font-bold text-gray-900 tracking-tighter">{display}</div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setIsDeg(true)} className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${isDeg ? 'bg-google-blue-light text-google-blue' : 'text-gray-300'}`}>Deg</button>
               <button onClick={() => setIsDeg(false)} className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${!isDeg ? 'bg-google-blue-light text-google-blue' : 'text-gray-300'}`}>Rad</button>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
               {/* Scientific Grid */}
               <button className="h-11 bg-google-gray font-bold text-[10px] rounded-xl text-gray-500">Inv</button>
               <button onClick={() => append('sin(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">sin</button>
               <button onClick={() => append('ln(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">ln</button>
               {[7,8,9].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl">{n}</button>)}
               <button onClick={() => append('/')} className="h-11 bg-google-gray text-gray-400 text-xl font-bold rounded-xl">÷</button>

               <button onClick={() => append('pi')} className="h-11 bg-google-gray text-google-blue font-black text-[10px] rounded-xl">π</button>
               <button onClick={() => append('cos(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">cos</button>
               <button onClick={() => append('log(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">log</button>
               {[4,5,6].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl">{n}</button>)}
               <button onClick={() => append('*')} className="h-11 bg-google-gray text-gray-400 text-xl font-bold rounded-xl">×</button>

               <button onClick={() => append('e')} className="h-11 bg-google-gray text-google-blue font-black text-[10px] rounded-xl">e</button>
               <button onClick={() => append('tan(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">tan</button>
               <button onClick={() => append('sqrt(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">√</button>
               {[1,2,3].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl">{n}</button>)}
               <button onClick={() => append('-')} className="h-11 bg-google-gray text-gray-400 text-3xl font-bold rounded-xl">−</button>

               <button onClick={() => setDisplay('Ans')} className="h-11 bg-google-gray text-gray-400 text-[9px] font-black rounded-xl">Ans</button>
               <button onClick={() => append('EXP')} className="h-11 bg-google-blue-light text-google-blue text-[9px] font-black rounded-xl">EXP</button>
               <button onClick={() => append('^')} className="h-11 bg-google-blue-light text-google-blue text-[9px] font-black rounded-xl">x^y</button>
               <button onClick={() => append('0')} className="h-11 bg-white border border-google-border font-bold rounded-xl">0</button>
               <button onClick={() => append('.')} className="h-11 bg-white border border-google-border font-bold rounded-xl">.</button>
               <button onClick={calculate} className="h-11 bg-google-blue text-white rounded-xl font-black">=</button>
               <button onClick={() => append('+')} className="h-11 bg-google-gray text-gray-400 text-2xl font-bold rounded-xl">+</button>

               <button onClick={() => append('(')} className="h-11 bg-google-gray font-bold rounded-xl">(</button>
               <button onClick={() => append(')')} className="h-11 bg-google-gray font-bold rounded-xl">)</button>
               <button onClick={() => append('%')} className="h-11 bg-google-gray font-bold rounded-xl">%</button>
               <button onClick={() => { setDisplay(d=>d.slice(0,-1)||'0'); setEquation(e=>e.slice(0,-1)); }} className="h-11 bg-google-gray text-gray-400 rounded-xl flex items-center justify-center"><Delete className="w-5 h-5"/></button>
               <button onClick={() => { setDisplay('0'); setEquation(''); }} className="h-11 bg-google-gray text-google-blue font-black text-[10px] rounded-xl">AC</button>
               <button onClick={() => append('fact(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">n!</button>
               <button onClick={() => append('inv(')} className="h-11 bg-google-blue-light text-google-blue font-black text-[10px] rounded-xl">1/x</button>
            </div>

            {/* MEMORY ROW FROM IMAGE 4 */}
            <div className="grid grid-cols-5 gap-2">
               {['MS', 'MR', 'M+', 'M−', 'MC'].map(m => (
                 <button key={m} onClick={() => memOp(m)} className="h-10 bg-google-gray text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-google-blue transition-all">
                    {m}
                 </button>
               ))}
            </div>
          </div>
        ) : (
            <div className="space-y-6">
              {/* MATH SOLVER GRID FROM IMAGE 3 & 10 */}
              <div className="relative group">
                <input 
                  value={solverInput} 
                  onChange={e=>setSolverInput(e.target.value)} 
                  placeholder="e.g. 6x + 5 = 14 or sin(45)" 
                  className="w-full bg-google-gray border-none rounded-2xl py-5 px-6 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-google-blue outline-none transition-all shadow-inner" 
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-google-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
              
              <div className="flex border-b border-google-border">
                {(['Algebra', 'Trigonometry', 'Calculus'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setSolverTab(t)} 
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all relative ${solverTab === t ? 'text-google-blue' : 'text-gray-400'}`}
                  >
                    {t}
                    {solverTab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-google-blue rounded-t-full shadow-[0_0_8px_rgba(26,115,232,0.5)]" />}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 pt-2">
                {/* SOLVER SPECIALS - COLOR CODED IMAGE 10 */}
                {['x²', '√', '<', '()', '≤', 'del', 'AC'].map(k => (
                  <button key={k} className="h-11 bg-google-blue-light text-google-blue text-[10px] font-black rounded-xl hover:bg-google-blue hover:text-white transition-all">{k}</button>
                ))}
                
                {['x', 'y'].map(k => (
                  <button key={k} className="h-11 bg-purple-50 text-purple-600 text-xs font-black rounded-xl border border-purple-100 italic">{k}</button>
                ))}
                {['=', '+', '-', '*', '/'].map(k => (
                    <button key={k} className="h-11 bg-google-gray text-google-blue text-lg font-bold rounded-xl">{k}</button>
                ))}
                
                {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => 
                  <button key={n} className="h-11 bg-white border border-google-border text-gray-900 text-xs font-bold rounded-xl shadow-sm hover:border-google-blue transition-all">{n}</button>
                )}
                
                <button className="col-span-3 h-11 bg-google-blue text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-wider">Solve Matrix</span>
                  <Play className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>
            </div>
        )}
      </div>

      <div className="bg-google-gray/50 py-4 text-center border-t border-google-border">
         <button className="text-[10px] font-black text-google-blue uppercase tracking-widest">Open Full Maths Solver →</button>
      </div>
    </div>
  );
}