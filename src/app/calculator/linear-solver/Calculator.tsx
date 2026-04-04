'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function LinearSolver() {
  const [mode, setMode] = useState<'2var'|'3var'>('2var');
  const [a1, setA1] = useState(1);  const [b1, setB1] = useState(1);  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(1);  const [b2, setB2] = useState(-1); const [c2, setC2] = useState(1);
  const [eq1, setEq1] = useState({ a:1, b:1, c:1, d:6 });
  const [eq2, setEq2] = useState({ a:0, b:2, c:5, d:-4 });
  const [eq3, setEq3] = useState({ a:2, b:5, c:-1, d:27 });

  const result = useMemo(() => {
    if (mode === '2var') {
      const det = a1*b2 - a2*b1;
      if (det === 0) return { ok: false, msg: 'No unique solution (parallel or same lines).' };
      return { ok:true, x: (c1*b2-c2*b1)/det, y: (a1*c2-a2*c1)/det };
    }
    const { a:A1, b:B1, c:C1, d:D1 } = eq1;
    const { a:A2, b:B2, c:C2, d:D2 } = eq2;
    const { a:A3, b:B3, c:C3, d:D3 } = eq3;
    const det = A1*(B2*C3-B3*C2) - B1*(A2*C3-A3*C2) + C1*(A2*B3-A3*B2);
    if (det === 0) return { ok:false, msg: 'Singular system — no unique solution.' };
    return {
      ok:true,
      x: (D1*(B2*C3-B3*C2) - B1*(D2*C3-D3*C2) + C1*(D2*B3-D3*B2)) / det,
      y: (A1*(D2*C3-D3*C2) - D1*(A2*C3-A3*C2) + C1*(A2*D3-A3*D2)) / det,
      z: (A1*(B2*D3-B3*D2) - B1*(A2*D3-A3*D2) + D1*(A2*B3-A3*B2)) / det,
    };
  }, [mode, a1,b1,c1,a2,b2,c2,eq1,eq2,eq3]);

  const inputCls = "w-full h-11 px-3 border border-[var(--border)] bg-white font-mono font-bold text-sm focus:border-[var(--primary)] outline-none text-center";

  return (
    <CalculatorLayout
      title="Linear Equation Solver"
      description="Solve systems of 2 or 3 simultaneous linear equations using Cramer's Rule. Instantly find x, y, and z values."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { k:'2var', l:'2 Variables (x, y)' },
              { k:'3var', l:'3 Variables (x, y, z)' },
            ].map(m => (
              <button key={m.k} onClick={() => setMode(m.k as any)}
                className={`py-3 text-xs font-black border transition-all uppercase ${mode===m.k ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                {m.l}
              </button>
            ))}
          </div>

          {mode === '2var' ? (
            <div className="space-y-4">
              {[
                { label:'Equation 1',  cols:['a','x +','b','y =','c'], vals:[a1,b1,c1], setters:[setA1,setB1,setC1] },
                { label:'Equation 2',  cols:['a','x +','b','y =','c'], vals:[a2,b2,c2], setters:[setA2,setB2,setC2] },
              ].map(({ label, vals, setters }) => (
                <div key={label} className="p-4 bg-white border border-[var(--border)]">
                  <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] mb-3">{label}: ax + by = c</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={vals[0]} onChange={e => setters[0](Number(e.target.value))} className={inputCls} />
                    <span className="text-sm font-bold text-[var(--text-muted)]">x +</span>
                    <input type="number" value={vals[1]} onChange={e => setters[1](Number(e.target.value))} className={inputCls} />
                    <span className="text-sm font-bold text-[var(--text-muted)]">y =</span>
                    <input type="number" value={vals[2]} onChange={e => setters[2](Number(e.target.value))} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label:'Eq 1', eq:eq1, set:setEq1 },
                { label:'Eq 2', eq:eq2, set:setEq2 },
                { label:'Eq 3', eq:eq3, set:setEq3 },
              ].map(({ label, eq, set }) => (
                <div key={label} className="p-4 bg-white border border-[var(--border)]">
                  <div className="text-[10px] font-black uppercase text-[var(--text-secondary)] mb-2">{label}: ax + by + cz = d</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={eq.a} onChange={e => set({...eq,a:Number(e.target.value)})} className={inputCls} />
                    <span className="text-xs text-[var(--text-muted)]">x</span>
                    <input type="number" value={eq.b} onChange={e => set({...eq,b:Number(e.target.value)})} className={inputCls} />
                    <span className="text-xs text-[var(--text-muted)]">y</span>
                    <input type="number" value={eq.c} onChange={e => set({...eq,c:Number(e.target.value)})} className={inputCls} />
                    <span className="text-xs text-[var(--text-muted)]">z =</span>
                    <input type="number" value={eq.d} onChange={e => set({...eq,d:Number(e.target.value)})} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Method</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">Cramer's Rule: x = Δx/Δ, y = Δy/Δ</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {result.ok ? (
            <>
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-4">Solution Vector</div>
                <div className="space-y-3">
                  {[
                    { label:'x', val: (result as any).x, color:'text-[var(--primary)]' },
                    { label:'y', val: (result as any).y, color:'text-[#006600]' },
                    ...(mode==='3var' ? [{ label:'z', val:(result as any).z, color:'text-amber-700' }] : []),
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                      <span className="text-sm font-black uppercase text-[var(--text-secondary)]">{label} =</span>
                      <span className={`text-3xl font-black font-mono ${color}`}>{(val as number).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
                <p className="text-[11px] text-[var(--text-secondary)]">This is the intersection point of all equations — the unique solution to the system.</p>
              </div>
            </>
          ) : (
            <div className="p-5 border border-red-200 bg-red-50 text-red-700 text-sm font-bold">{(result as any).msg}</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a system of linear equations?', answer: 'A set of two or more equations sharing the same variables. The solution is the set of values that satisfy all equations simultaneously.' },
          { question: "What is Cramer's Rule?", answer: "A method using matrix determinants to solve systems of linear equations. For ax + by = c: x = Δx/Δ where Δ is the coefficient determinant." },
          { question: 'When is there no unique solution?', answer: 'When the system determinant is 0, the lines are either parallel (no solution) or identical (infinite solutions).' },
        ]} />
      }
    />
  );
}
