'use client';
import { useState, useCallback } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { safeEval } from '@/utils/math/safeEval';

type CalcMode = 'scientific' | 'solver';
type SolverTab = 'algebra' | 'trigonometry' | 'calculus';

export default function ScientificCalculator() {
  const [display, setDisplay]   = useState('0');
  const [equation, setEquation] = useState('');
  const [mode, setMode]         = useState<CalcMode>('scientific');
  const [solverTab, setSolverTab] = useState<SolverTab>('algebra');
  const [isDeg, setIsDeg]       = useState(true);
  const [solverInput, setSolverInput] = useState('');

  const appendToExpr = useCallback((val: string) => {
    setEquation(prev => {
      const next = prev + val;
      setDisplay(next);
      return next;
    });
  }, []);

  const handleNumber = (n: string) => {
    if (display === '0') setDisplay(n);
    else setDisplay(display + n);
    setEquation(prev => prev + n);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEq = equation || display;
      const result = safeEval(fullEq, { isDeg });
      setDisplay(result);
      setEquation(result === 'Error' ? '' : result);
    } catch {
      setDisplay('Error');
    }
  };

  const applyFn = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;
    let expr = '';
    switch (fn) {
      case 'sin':   expr = `sin(${val})`; break;
      case 'cos':   expr = `cos(${val})`; break;
      case 'tan':   expr = `tan(${val})`; break;
      case 'csc':   expr = `csc(${val})`; break;
      case 'sec':   expr = `sec(${val})`; break;
      case 'cot':   expr = `cot(${val})`; break;
      case 'asin':  expr = `asin(${val})`; break;
      case 'acos':  expr = `acos(${val})`; break;
      case 'atan':  expr = `atan(${val})`; break;
      case 'log':   expr = `log(${val})`; break;
      case 'ln':    expr = `ln(${val})`; break;
      case 'sqrt':  expr = `sqrt(${val})`; break;
      case 'pow2':  expr = `(${val})^2`; break;
      case 'pow3':  expr = `(${val})^3`; break;
      case 'inv':   expr = `1/(${val})`; break;
      case 'abs':   expr = `abs(${val})`; break;
      case 'fact':  expr = `factorial(${val})`; break;
      case 'pi':    setDisplay(String(Math.PI)); setEquation(String(Math.PI)); return;
      case 'e':     setDisplay(String(Math.E)); setEquation(String(Math.E)); return;
    }
    if (expr) {
      const result = safeEval(expr, { isDeg });
      setDisplay(result);
      setEquation(result);
    }
  };

  const backspace = () => {
    const next = equation.slice(0, -1);
    setEquation(next);
    setDisplay(next || '0');
  };

  const clear = () => { setDisplay('0'); setEquation(''); };

  // button style helpers
  const fnBtn = 'h-9 rounded-lg text-[11px] font-bold active:scale-95 transition-all min-h-[36px] border';
  const numBtn = 'h-11 rounded-xl bg-gray-800 text-white font-bold text-lg hover:bg-gray-700 active:scale-95 transition-all min-h-[44px] font-mono';
  const opBtn  = 'h-11 rounded-xl bg-gray-700 text-blue-400 font-bold text-lg hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]';

  return (
    <>
      <JsonLd type="calculator"
        name="Scientific Calculator"
        description="Free online scientific calculator with trigonometry, logarithms, math solver (algebra, trig, calculus). Supports Deg/Rad mode."
        url="https://calcpro.com.np/calculator/scientific-calculator" />

      <CalcWrapper
        title="Scientific Calculator"
        description="Free online scientific calculator with full trigonometry, logarithms, math solver for algebra, trigonometry and calculus."
        crumbs={[{ label: 'education', href: '/calculator?cat=education' }, { label: 'scientific calculator' }]}
        relatedCalcs={[
          { name: 'Fraction Calculator', slug: 'fraction-calculator' },
          { name: 'Quadratic Solver', slug: 'quadratic-solver' },
          { name: 'Standard Deviation', slug: 'standard-deviation' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[480px_1fr] gap-6">

          {/* ── CALCULATOR BODY ─────────────────────────────── */}
          <div className="bg-gray-900 rounded-2xl p-5 shadow-2xl border border-gray-800 w-full max-w-[480px] mx-auto">

            {/* Mode tabs: Scientific | Math Solver */}
            <div className="flex gap-2 mb-4">
              {(['scientific', 'solver'] as CalcMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all
                    ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {m === 'solver' ? 'Maths Solver' : 'Scientific'}
                </button>
              ))}
            </div>

            {/* Display */}
            <div className="bg-gray-950 rounded-xl px-4 py-3 mb-4 text-right">
              <div className="text-xs text-gray-600 font-mono h-4 truncate">
                {equation || '\u00A0'}
              </div>
              <div className="text-3xl font-bold text-white font-mono mt-1 truncate"
                   style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}>
                {display}
              </div>
              {/* Deg/Rad badge */}
              <button onClick={() => setIsDeg(!isDeg)}
                className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded
                  ${isDeg ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {isDeg ? 'DEG' : 'RAD'}
              </button>
            </div>

            {/* ── SCIENTIFIC MODE ────────────────────────────── */}
            {mode === 'scientific' && (
              <div className="space-y-2 mb-3">
                {/* Inverse trig row */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    {l:'sin⁻¹',f:'asin'},{l:'cos⁻¹',f:'acos'},{l:'tan⁻¹',f:'atan'},
                    {l:'π',f:'pi'},{l:'e',f:'e'},{l:'1/x',f:'inv'},
                  ].map(({l,f}) => (
                    <button key={l} onClick={() => applyFn(f)}
                      className={`${fnBtn} bg-blue-900/50 text-blue-300 border-blue-800/50 hover:bg-blue-900`}>
                      {l}
                    </button>
                  ))}
                </div>
                {/* Main functions row */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    {l:'sin',f:'sin'},{l:'cos',f:'cos'},{l:'tan',f:'tan'},
                    {l:'ln',f:'ln'},{l:'log',f:'log'},{l:'√',f:'sqrt'},
                    {l:'x²',f:'pow2'},{l:'x³',f:'pow3'},{l:'|x|',f:'abs'},
                    {l:'csc',f:'csc'},{l:'sec',f:'sec'},{l:'cot',f:'cot'},
                  ].map(({l,f}) => (
                    <button key={l} onClick={() => applyFn(f)}
                      className={`${fnBtn} bg-indigo-900/50 text-indigo-300 border-indigo-800/50 hover:bg-indigo-900`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── MATH SOLVER MODE ───────────────────────────── */}
            {mode === 'solver' && (
              <div className="mb-3">
                {/* Solver input */}
                <input
                  type="text"
                  value={solverInput}
                  onChange={e => setSolverInput(e.target.value)}
                  placeholder="Enter equation... e.g. 6x + 5 = 14"
                  className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700
                             text-white text-sm rounded-xl focus:outline-none
                             focus:border-blue-500 font-mono"
                  style={{ fontSize: '16px' }}
                />

                {/* Algebra | Trigonometry | Calculus tabs */}
                <div className="flex mb-3 bg-gray-800 rounded-xl p-1">
                  {([
                    {id:'algebra', color:'text-purple-400'},
                    {id:'trigonometry', color:'text-green-400'},
                    {id:'calculus', color:'text-pink-400'},
                  ] as {id:SolverTab, color:string}[]).map(({id, color}) => (
                    <button key={id} onClick={() => setSolverTab(id)}
                      className={`flex-1 py-1.5 text-[10px] font-bold capitalize rounded-lg transition-all
                        ${solverTab === id
                          ? `bg-gray-700 ${color}`
                          : 'text-gray-500 hover:text-gray-300'}`}>
                      {id}
                    </button>
                  ))}
                </div>

                {/* ALGEBRA buttons — purple */}
                {solverTab === 'algebra' && (
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      {l:'x²',v:'x^2'},{l:'ⁿ√',v:'sqrt('},{l:'<',v:'<'},{l:'(',v:'('},{l:')',v:')'},
                      {l:'x',v:'x'},{l:'y',v:'y'},{l:'≤',v:'<='},{l:'7',v:'7'},{l:'8',v:'8'},
                      {l:'log',v:'log('},{l:'!',v:'!'},{l:'>',v:'>'},{l:'4',v:'4'},{l:'5',v:'5'},
                      {l:'%',v:'%'},{l:'i',v:'i'},{l:'≥',v:'>='},{l:'1',v:'1'},{l:'2',v:'2'},
                      {l:'x',v:'x'},{l:'=',v:'='},{l:'.',v:'.'},{l:'0',v:'0'},{l:'⌫',v:'DEL'},
                    ].map(({l,v},i) => (
                      <button key={i}
                        onClick={() => v === 'DEL'
                          ? setSolverInput(p => p.slice(0,-1))
                          : setSolverInput(p => p + v)}
                        className="h-9 rounded-lg bg-purple-900/50 text-purple-300 text-[11px]
                                   font-bold hover:bg-purple-900 active:scale-95 transition-all
                                   border border-purple-800/50 min-h-[36px]">
                        {l}
                      </button>
                    ))}
                  </div>
                )}

                {/* TRIGONOMETRY buttons — green */}
                {solverTab === 'trigonometry' && (
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      {l:'sin',v:'sin('},{l:'cos',v:'cos('},{l:'tan',v:'tan('},{l:'(',v:'('},{l:')',v:')'},
                      {l:'csc',v:'csc('},{l:'sec',v:'sec('},{l:'cot',v:'cot('},{l:'7',v:'7'},{l:'8',v:'8'},
                      {l:'arcsin',v:'asin('},{l:'arccos',v:'acos('},{l:'arctan',v:'atan('},{l:'4',v:'4'},{l:'5',v:'5'},
                      {l:'x²',v:'^2'},{l:'°',v:'°'},{l:'π',v:'pi'},{l:'1',v:'1'},{l:'2',v:'2'},
                      {l:'x',v:'x'},{l:'y',v:'y'},{l:'=',v:'='},{l:'0',v:'0'},{l:'⌫',v:'DEL'},
                    ].map(({l,v},i) => (
                      <button key={i}
                        onClick={() => v === 'DEL'
                          ? setSolverInput(p => p.slice(0,-1))
                          : setSolverInput(p => p + v)}
                        className="h-9 rounded-lg bg-green-900/50 text-green-300 text-[10px]
                                   font-bold hover:bg-green-900 active:scale-95 transition-all
                                   border border-green-800/50 min-h-[36px]">
                        {l}
                      </button>
                    ))}
                    {/* Example equations */}
                    <div className="col-span-5 mt-1 flex gap-1.5 flex-wrap">
                      {['sin(30)','cos(60)','tan(45)'].map(ex => (
                        <button key={ex} onClick={() => setSolverInput(ex)}
                          className="px-2.5 py-1 bg-gray-800 text-green-400 text-[10px]
                                     rounded-full border border-green-900 hover:bg-gray-700">
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CALCULUS buttons — pink */}
                {solverTab === 'calculus' && (
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      {l:'d/dx',v:'d/dx('},{l:'∞',v:'Infinity'},{l:'ⁿ√',v:'nrt('},{l:'(',v:'('},{l:')',v:')'},
                      {l:'lim',v:'lim('},{l:'lim+',v:'lim+('},{l:'lim−',v:'lim-('},{l:'7',v:'7'},{l:'8',v:'8'},
                      {l:'log□',v:'log('},{l:'C(n,k)',v:'C('},{l:'P(n,k)',v:'P('},{l:'4',v:'4'},{l:'5',v:'5'},
                      {l:'Σ',v:'sum('},{l:'∫',v:'∫('},{l:'∫∫',v:'∫∫('},{l:'1',v:'1'},{l:'2',v:'2'},
                      {l:'x',v:'x'},{l:'y',v:'y'},{l:'e',v:'e'},{l:'0',v:'0'},{l:'⌫',v:'DEL'},
                    ].map(({l,v},i) => (
                      <button key={i}
                        onClick={() => v === 'DEL'
                          ? setSolverInput(p => p.slice(0,-1))
                          : setSolverInput(p => p + v)}
                        className="h-9 rounded-lg bg-pink-900/50 text-pink-300 text-[10px]
                                   font-bold hover:bg-pink-900 active:scale-95 transition-all
                                   border border-pink-800/50 min-h-[36px]">
                        {l}
                      </button>
                    ))}
                    {/* Example equations */}
                    <div className="col-span-5 mt-1 flex gap-1.5 flex-wrap">
                      {['d/dx(x²)','∫x dx'].map(ex => (
                        <button key={ex} onClick={() => setSolverInput(ex)}
                          className="px-2.5 py-1 bg-gray-800 text-pink-400 text-[10px]
                                     rounded-full border border-pink-900 hover:bg-gray-700">
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solver evaluate button */}
                <button
                  onClick={() => {
                    if (!solverInput) return;
                    const result = safeEval(solverInput, { isDeg });
                    setDisplay(result);
                    setEquation(solverInput + ' = ' + result);
                  }}
                  className="w-full mt-3 py-2.5 bg-blue-600 text-white font-bold
                             text-sm rounded-xl hover:bg-blue-700 transition-all">
                  Calculate →
                </button>

                {/* Example quick fills for Algebra */}
                {solverTab === 'algebra' && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {['6x + 5 = 14', '(x+5)(x+2)', '4x² − 5x − 12 = 0'].map(ex => (
                      <button key={ex} onClick={() => setSolverInput(ex)}
                        className="px-2.5 py-1 bg-gray-800 text-purple-400 text-[10px]
                                   rounded-full border border-purple-900 hover:bg-gray-700">
                        {ex}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STANDARD KEYPAD (always shown) ───────────── */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              <button onClick={clear}
                className="col-span-2 h-12 rounded-xl bg-red-900/60 text-red-300 font-bold
                           hover:bg-red-900 active:scale-95 transition-all min-h-[44px]">
                AC
              </button>
              <button onClick={backspace}
                className="h-12 rounded-xl bg-gray-800 text-yellow-400 font-bold
                           hover:bg-gray-700 active:scale-95 transition-all min-h-[44px]">
                ⌫
              </button>
              <button onClick={() => handleOperator('÷')} className={opBtn}>÷</button>

              {[7,8,9].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={numBtn}>{n}</button>)}
              <button onClick={() => handleOperator('×')} className={opBtn}>×</button>

              {[4,5,6].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={numBtn}>{n}</button>)}
              <button onClick={() => handleOperator('-')} className={opBtn}>−</button>

              {[1,2,3].map(n => <button key={n} onClick={() => handleNumber(String(n))} className={numBtn}>{n}</button>)}
              <button onClick={() => handleOperator('+')} className={opBtn}>+</button>

              <button onClick={() => handleNumber('0')}
                className="col-span-2 h-12 rounded-xl bg-gray-800 text-white font-bold text-lg
                           hover:bg-gray-700 active:scale-95 transition-all text-left pl-5 min-h-[44px] font-mono">
                0
              </button>
              <button onClick={() => handleNumber('.')} className={numBtn}>.</button>
              <button onClick={calculate}
                className="h-12 rounded-xl bg-blue-600 text-white font-bold text-xl
                           hover:bg-blue-700 active:scale-95 transition-all shadow-lg
                           shadow-blue-900/50 min-h-[44px]">
                =
              </button>
            </div>
          </div>

          {/* RIGHT — Share + info */}
          <div className="space-y-4">
            <ShareResult
              title="Scientific Calculation"
              result={display}
              calcUrl="https://calcpro.com.np/calculator/scientific-calculator"
            />
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
              <div className="font-bold mb-1">Tips</div>
              <ul className="space-y-1 text-blue-600">
                <li>• Toggle <strong>DEG/RAD</strong> for trig mode</li>
                <li>• Use <strong>Maths Solver</strong> for algebra equations</li>
                <li>• Click example equations to load them</li>
                <li>• ⌫ deletes last character</li>
              </ul>
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          { question: 'What functions does this scientific calculator support?', answer: 'Full trigonometry (sin, cos, tan, csc, sec, cot, and all inverses), logarithms (log, ln), powers (x², x³), roots (√), constants (π, e), and a Math Solver with Algebra, Trigonometry, and Calculus modes.' },
          { question: 'How do I switch between Degrees and Radians?', answer: 'Click the DEG/RAD button shown in the display area. In DEG mode all trig functions accept degrees (e.g. sin(90) = 1). In RAD mode they accept radians (e.g. sin(π/2) = 1).' },
          { question: 'How does the Math Solver work?', answer: 'Click "Maths Solver", select a tab (Algebra, Trigonometry, or Calculus), type your equation in the input box, then click Calculate. You can also tap the example equations to load them.' },
          { question: 'What is the difference between log and ln?', answer: 'log is base-10 logarithm (e.g. log(100) = 2). ln is the natural logarithm with base e (e.g. ln(e) = 1).' },
          { question: 'Is this suitable for engineering and university students?', answer: 'Yes. It covers all functions needed for high school and first/second year engineering: trigonometry, logarithms, exponents, inverses, and algebraic solvers.' },
        ]} />
      </CalcWrapper>
    </>
  );
}
