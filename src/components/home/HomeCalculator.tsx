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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [solverTab, setSolverTab] = useState<SolverTab>('Algebra');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const [solverInput, setSolverInput] = useState('');
  const [solverResult, setSolverResult] = useState('');
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

  const solveMathQuery = () => {
    if (!solverInput.trim()) return;
    const res = safeEval(solverInput, { isDeg: true });
    
    // If it's an equation (contains =) or safeEval can't handle it (returns Error)
    // we redirect to the full solver which has advanced parsing.
    if (res === 'Error' || solverInput.includes('=')) {
       localStorage.setItem('calc_query', solverInput.trim());
       // Use hard location for maximum reliability in dev environments
       window.location.href = '/calculator/scientific-calculator';
       return;
    }
    
    setSolverResult(res);
  };

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
        <button onClick={() => setMode('scientific')} className={`flex-1 py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${mode === 'scientific' ? 'text-google-blue border-b-2 border-b-google-blue' : 'text-gray-400 opacity-60'}`}>
          <Calculator className="w-4 h-4" /> Scientific
        </button>
        <button onClick={() => setMode('solver')} className={`flex-1 py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${mode === 'solver' ? 'text-google-blue border-b-2 border-b-google-blue' : 'text-gray-400 opacity-60'}`}>
          <Activity className="w-4 h-4" /> Maths Solver
        </button>
      </div>

      <div className="p-6 md:p-8">
        {mode === 'scientific' ? (
          <div className="space-y-6">
            <div className="bg-google-gray rounded-[24px] p-6 text-right border border-google-border min-h-[120px] flex flex-col justify-end text-gray-900">
               <div className="text-sm text-gray-400 font-mono mb-1">{equation || ' '}</div>
               <div className="text-5xl md:text-6xl font-sans font-bold text-gray-900 tracking-tighter">{display}</div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setIsDeg(true)} className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${isDeg ? 'bg-google-blue-light text-google-blue' : 'text-gray-300'}`}>Deg</button>
               <button onClick={() => setIsDeg(false)} className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${!isDeg ? 'bg-google-blue-light text-google-blue' : 'text-gray-300'}`}>Rad</button>
            </div>

            <div className="grid grid-cols-7 gap-2">
               {/* Scientific Grid */}
               <button className="h-11 bg-google-gray font-bold text-xs rounded-xl text-gray-500">Inv</button>
               <button onClick={() => append('sin(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">sin</button>
               <button onClick={() => append('ln(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">ln</button>
               {[7,8,9].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl text-gray-900">{n}</button>)}
               <button onClick={() => append('/')} className="h-11 bg-google-gray text-gray-400 text-xl font-bold rounded-xl">÷</button>

               <button onClick={() => append('pi')} className="h-11 bg-google-gray text-google-blue font-black text-xs rounded-xl">π</button>
               <button onClick={() => append('cos(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">cos</button>
               <button onClick={() => append('log(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">log</button>
               {[4,5,6].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl text-gray-900">{n}</button>)}
               <button onClick={() => append('*')} className="h-11 bg-google-gray text-gray-400 text-xl font-bold rounded-xl">×</button>

               <button onClick={() => append('e')} className="h-11 bg-google-gray text-google-blue font-black text-xs rounded-xl">e</button>
               <button onClick={() => append('tan(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">tan</button>
               <button onClick={() => append('sqrt(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">√</button>
               {[1,2,3].map(n => <button key={n} onClick={() => append(String(n))} className="h-11 bg-white border border-google-border font-bold rounded-xl text-gray-900">{n}</button>)}
               <button onClick={() => append('-')} className="h-11 bg-google-gray text-gray-400 text-3xl font-bold rounded-xl">−</button>

               <button onClick={() => setDisplay('Ans')} className="h-11 bg-google-gray text-gray-400 text-xs font-black rounded-xl">Ans</button>
               <button onClick={() => append('EXP')} className="h-11 bg-google-blue-light text-google-blue text-xs font-black rounded-xl">EXP</button>
               <button onClick={() => append('^')} className="h-11 bg-google-blue-light text-google-blue text-xs font-black rounded-xl">x^y</button>
               <button onClick={() => append('0')} className="h-11 bg-white border border-google-border font-bold rounded-xl text-gray-900">0</button>
               <button onClick={() => append('.')} className="h-11 bg-white border border-google-border font-bold rounded-xl text-gray-900">.</button>
               <button onClick={calculate} className="h-11 bg-google-blue text-white rounded-xl font-black">=</button>
               <button onClick={() => append('+')} className="h-11 bg-google-gray text-gray-400 text-2xl font-bold rounded-xl">+</button>

               <button onClick={() => append('(')} className="h-11 bg-google-gray font-bold rounded-xl text-gray-900">(</button>
               <button onClick={() => append(')')} className="h-11 bg-google-gray font-bold rounded-xl text-gray-900">)</button>
               <button onClick={() => append('%')} className="h-11 bg-google-gray font-bold rounded-xl text-gray-900">%</button>
               <button onClick={() => { setDisplay(d=>d.slice(0,-1)||'0'); setEquation(e=>e.slice(0,-1)); }} className="h-11 bg-google-gray text-gray-400 rounded-xl flex items-center justify-center"><Delete className="w-5 h-5"/></button>
               <button onClick={() => { setDisplay('0'); setEquation(''); }} className="h-11 bg-google-gray text-google-blue font-black text-xs rounded-xl">AC</button>
               <button onClick={() => append('fact(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">n!</button>
               <button onClick={() => append('inv(')} className="h-11 bg-google-blue-light text-google-blue font-black text-xs rounded-xl">1/x</button>
            </div>

            {/* MEMORY ROW FROM IMAGE 4 */}
            <div className="grid grid-cols-5 gap-2">
               {['MS', 'MR', 'M+', 'M−', 'MC'].map(m => (
                 <button key={m} onClick={() => memOp(m)} className="h-11 bg-google-gray text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:text-google-blue transition-all">
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
                  onChange={e=>{ setSolverInput(e.target.value); setSolverResult(''); }} 
                  placeholder="e.g. 5+5 or 6x + 5 = 14" 
                  className="w-full bg-google-gray border-none rounded-2xl py-5 px-6 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-google-blue outline-none transition-all shadow-inner" 
                />
                <button 
                  onClick={solveMathQuery}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-google-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all z-10"
                >
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>

              {solverResult && (
                 <div className="bg-google-blue/5 border border-google-blue/10 rounded-2xl p-4 flex items-center justify-between animate-in fade-in zoom-in duration-300">
                    <div className="text-[10px] font-black text-google-blue uppercase tracking-widest">Result</div>
                    <div className="text-2xl font-black text-gray-900">{solverResult}</div>
                 </div>
              )}
              
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
                {['x²', '√', '<', '(', ')', 'del', 'AC'].map(k => (
                  <button 
                    key={k} 
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSolverResult('');
                      if (k === 'AC') setSolverInput('');
                      else if (k === 'del') setSolverInput(s => s.slice(0, -1));
                      else if (k === 'x²') setSolverInput(s => s + '^2');
                      else setSolverInput(s => s + k);
                    }}
                    className="h-11 bg-google-blue-light text-google-blue text-[10px] font-black rounded-xl hover:bg-google-blue hover:text-white transition-all cursor-pointer"
                  >
                    {k}
                  </button>
                ))}
                
                {/* Specific Keys for Algebra / Trigonometry / Calculus */}
                {solverTab === 'Algebra' && ['x', 'y'].map(k => (
                  <button 
                    key={k} 
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSolverResult('');
                      setSolverInput(s => s + k);
                    }}
                    className="h-11 bg-purple-50 text-purple-600 text-xs font-black rounded-xl border border-purple-100 italic cursor-pointer"
                  >
                    {k}
                  </button>
                ))}

                {solverTab === 'Trigonometry' && ['sin', 'cos', 'tan', 'π'].map(k => (
                  <button 
                    key={k} 
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSolverResult('');
                      setSolverInput(s => s + (k === 'π' ? 'pi' : k + '('));
                    }}
                    className="h-11 bg-orange-50 text-orange-600 text-xs font-black rounded-xl border border-orange-100 cursor-pointer"
                  >
                    {k}
                  </button>
                ))}

                {solverTab === 'Calculus' && ['d/dx', '∫', 'lim', '∞'].map(k => (
                  <button 
                    key={k} 
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSolverResult('');
                      if (k === 'd/dx') setSolverInput(s => s + 'd/dx(');
                      else if (k === '∫') setSolverInput(s => s + 'int(');
                      else if (k === 'lim') setSolverInput(s => s + 'lim(');
                      else if (k === '∞') setSolverInput(s => s + 'infinity');
                    }}
                    className="h-11 bg-green-50 text-green-600 text-xs font-black rounded-xl border border-green-100 cursor-pointer"
                  >
                    {k}
                  </button>
                ))}

                {/* Shared Operations */}
                {['=', '+', '-', '*', '/'].map(k => (
                    <button 
                      key={k} 
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        if (k === '=') solveMathQuery();
                        else {
                           setSolverResult('');
                           setSolverInput(s => s + k);
                        }
                      }}
                      className={`h-11 text-lg font-bold rounded-xl cursor-pointer ${k === '=' ? 'bg-google-blue text-white shadow-lg shadow-blue-500/20 col-span-2' : 'bg-google-gray text-google-blue'} ${solverTab !== 'Algebra' && k === '=' ? 'col-span-1' : ''}`}
                    >
                      {k}
                    </button>
                ))}
                
                {/* Numbers */}
                {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => 
                  <button 
                    key={n} 
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSolverResult('');
                      setSolverInput(s => s + String(n));
                    }}
                    className="h-11 bg-white border border-google-border text-gray-900 text-xs font-bold rounded-xl shadow-sm hover:border-google-blue transition-all cursor-pointer"
                  >
                    {n}
                  </button>
                )}
                
                <Link 
                  href="/calculator/matrices"
                  className={`${solverTab !== 'Algebra' ? 'col-span-2' : 'col-span-3'} h-11 bg-google-blue text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-[10px] font-black uppercase tracking-wider`}
                >
                  Solve Matrix <Play className="w-3.5 h-3.5 fill-white" />
                </Link>
              </div>
            </div>
        )}
      </div>

      <div className="bg-google-gray/50 py-4 text-center border-t border-google-border">
         <Link 
           href="/calculator/scientific-calculator"
           className="text-[10px] font-black text-google-blue uppercase tracking-widest hover:underline transition-all inline-block"
         >
           Open Full Maths Solver →
         </Link>
      </div>
    </div>
  );
}