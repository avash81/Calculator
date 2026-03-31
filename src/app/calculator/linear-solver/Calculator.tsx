'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Sparkles, X, ChevronRight } from 'lucide-react';

export default function LinearSolver() {
  const [mode, setMode] = useState<'2var' | '3var'>('2var');
  
  // 2 Variables (ax + by = c, dx + ey = f)
  const [a1, setA1] = useState(1); const [b1, setB1] = useState(1); const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(1); const [b2, setB2] = useState(-1); const [c2, setC2] = useState(1);

  // 3 Variables
  const [eq1, setEq1] = useState({ a: 1, b: 1, c: 1, d: 6 });
  const [eq2, setEq2] = useState({ a: 0, b: 2, c: 5, d: -4 });
  const [eq3, setEq3] = useState({ a: 2, b: 5, c: -1, d: 27 });

  const result = useMemo(() => {
    if (mode === '2var') {
      const det = a1 * b2 - a2 * b1;
      if (det === 0) return { type: 'error', msg: 'Infinite solutions or No solution (Parallel Lines)' };
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;
      return { type: 'success', x, y };
    } else {
      // Cramer's Rule for 3x3
      const { a:a1, b:b1, c:c1, d:d1 } = eq1;
      const { a:a2, b:b2, c:c2, d:d2 } = eq2;
      const { a:a3, b:b3, c:c3, d:d3 } = eq3;

      const det = a1*(b2*c3 - b3*c2) - b1*(a2*c3 - a3*c2) + c1*(a2*b3 - a3*b2);
      if (det === 0) return { type: 'error', msg: 'Determinant is 0. Singular System.' };

      const dx = d1*(b2*c3 - b3*c2) - b1*(d2*c3 - d3*c2) + c1*(d2*b3 - d3*b2);
      const dy = a1*(d2*c3 - d3*c2) - d1*(a2*c3 - a3*c2) + c1*(a2*d3 - a3*d2);
      const dz = a1*(b2*d3 - b3*d2) - b1*(a2*d3 - a3*d2) + d1*(a2*b3 - a3*b2);

      return { type: 'success', x: dx/det, y: dy/det, z: dz/det };
    }
  }, [mode, a1, b1, c1, a2, b2, c2, eq1, eq2, eq3]);

  return (
    <>
      <JsonLd type="calculator" name="Linear Equation Solver" description="Solve systems of linear equations with 2 or 3 variables instantly using Cramer's rule." url="https://calcpro.com.np/calculator/linear-solver" />
      
      <CalcWrapper
        title="Linear Equation Solver"
        description="Solve systems of linear equations (Simultaneous Equations) with 2 or 3 variables using precise algebraic methods."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'linear solver'}]}
        formula={mode === '2var' ? "Cramer's Rule: x = Δx/Δ, y = Δy/Δ" : "3x3 Cramer's Rule with Determinants"}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex bg-google-gray p-1.5 rounded-2xl mb-8">
                <button onClick={() => setMode('2var')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === '2var' ? 'bg-white shadow-sm text-google-blue' : 'text-gray-400'}`}>2 Variables (x, y)</button>
                <button onClick={() => setMode('3var')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === '3var' ? 'bg-white shadow-sm text-google-blue' : 'text-gray-400'}`}>3 Variables (x, y, z)</button>
              </div>

              {mode === '2var' ? (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equation 1: ax + by = c</div>
                      <div className="flex items-center gap-3">
                         <input type="number" value={a1} onChange={e=>setA1(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                         <span className="font-bold text-gray-400">x +</span>
                         <input type="number" value={b1} onChange={e=>setB1(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                         <span className="font-bold text-gray-400">y =</span>
                         <input type="number" value={c1} onChange={e=>setC1(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equation 2: dx + ey = f</div>
                      <div className="flex items-center gap-3">
                         <input type="number" value={a2} onChange={e=>setA2(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                         <span className="font-bold text-gray-400">x +</span>
                         <input type="number" value={b2} onChange={e=>setB2(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                         <span className="font-bold text-gray-400">y =</span>
                         <input type="number" value={c2} onChange={e=>setC2(+e.target.value)} className="w-full h-12 bg-gray-50 rounded-xl px-4 font-bold border-2 border-transparent focus:border-google-blue outline-none" />
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-6">
                   {[
                    { eq: eq1, set: setEq1, label: 'Eq 1' },
                    { eq: eq2, set: setEq2, label: 'Eq 2' },
                    { eq: eq3, set: setEq3, label: 'Eq 3' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <input type="number" value={item.eq.a} onChange={e=>item.set({...item.eq, a:+e.target.value})} className="w-full h-10 bg-gray-50 rounded-lg px-2 font-bold text-center border focus:border-blue-500 outline-none" />
                        <span className="text-xs font-bold text-gray-300">x+</span>
                        <input type="number" value={item.eq.b} onChange={e=>item.set({...item.eq, b:+e.target.value})} className="w-full h-10 bg-gray-50 rounded-lg px-2 font-bold text-center border focus:border-blue-500 outline-none" />
                        <span className="text-xs font-bold text-gray-300">y+</span>
                        <input type="number" value={item.eq.c} onChange={e=>item.set({...item.eq, c:+e.target.value})} className="w-full h-10 bg-gray-50 rounded-lg px-2 font-bold text-center border focus:border-blue-500 outline-none" />
                        <span className="text-xs font-bold text-gray-300">z=</span>
                        <input type="number" value={item.eq.d} onChange={e=>item.set({...item.eq, d:+e.target.value})} className="w-full h-10 bg-gray-50 rounded-lg px-2 font-bold text-center border focus:border-blue-500 outline-none" />
                     </div>
                   ))}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50/30 border border-blue-50 rounded-[2.5rem] p-8 flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <Sparkles className="w-7 h-7" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Step-by-Step Solver</div>
                  <div className="text-sm font-bold text-gray-600 italic">&quot;Using matrices and determinants to find a precise unique solution.&quot;</div>
               </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
             <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-gray-400">Solution Vector</div>
                
                {result.type === 'success' ? (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Variable X</span>
                        <span className="text-3xl font-black text-google-blue">{result.x?.toFixed(4)}</span>
                     </div>
                     <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Variable Y</span>
                        <span className="text-3xl font-black text-green-500">{result.y?.toFixed(4)}</span>
                     </div>
                     {mode === '3var' && (
                       <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Variable Z</span>
                          <span className="text-3xl font-black text-orange-500">{result.z?.toFixed(4)}</span>
                       </div>
                     )}
                  </div>
                ) : (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">{result.msg}</div>
                )}
             </div>

             <ShareResult title="System of Equations Solved" result={result.type==='success' ? `X=${result.x?.toFixed(2)}, Y=${result.y?.toFixed(2)}` : 'Parallel lines'} calcUrl="https://calcpro.com.np/calculator/linear-solver" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is a linear equation system?', answer: 'It is a set of two or more linear equations involving the same variables. The solution is the point where all these lines intersect.' },
            { question: "What is Cramer's Rule?", answer: "A method that uses determinants to find the values of unknowns in a system of linear equations." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
