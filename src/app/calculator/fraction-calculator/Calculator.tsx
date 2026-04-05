'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function FractionCalculator() {
  const [w1,setW1] = useState(0); const [n1,setN1] = useState(1); const [d1,setD1] = useState(2);
  const [w2,setW2] = useState(0); const [n2,setN2] = useState(1); const [d2,setD2] = useState(3);
  const [op, setOp] = useState<'+'|'-'|'*'|'/'>( '+');

  const r = useMemo(() => {
    if (d1 === 0 || d2 === 0) return { error: 'Denominator cannot be zero', n:0, d:1, mixed:{w:0,n:0,d:1}, dec:'0', pct:'0' };
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const num1 = w1*d1+n1, num2 = w2*d2+n2;
    let rN = 0, rD = 1;
    switch(op) {
      case '+': rN=num1*d2+num2*d1; rD=d1*d2; break;
      case '-': rN=num1*d2-num2*d1; rD=d1*d2; break;
      case '*': rN=num1*num2; rD=d1*d2; break;
      case '/': rN=num1*d2; rD=d1*num2; break;
    }
    const g = Math.abs(gcd(rN,rD));
    const sN = rN/g, sD = rD/g;
    const whole = Math.floor(Math.abs(sN)/Math.abs(sD)) * (sN * sD < 0 ? -1 : 1);
    return { n:sN, d:sD, mixed:{ w:whole, n:Math.abs(sN)%Math.abs(sD), d:Math.abs(sD) }, dec:(rN/rD).toFixed(6), pct:((rN/rD)*100).toFixed(2), error: null };
  }, [w1,n1,d1,w2,n2,d2,op]);

  const inCls = "w-16 h-12 text-center border border-[var(--border)] bg-white font-mono text-lg font-black focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="Fraction Calculator"
      description="Add, subtract, multiply, and divide fractions and mixed numbers. Get results as simplified fractions, mixed numbers, decimals, and percentages."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          {/* Visual fraction input */}
          <div className="p-6 bg-white border border-[var(--border)] flex flex-wrap items-center justify-center gap-4">
            {/* Fraction 1 */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-[9px] font-bold text-[var(--text-muted)] mb-1">Whole</div>
                <input type="number" value={w1} onChange={e=>setW1(Number(e.target.value))} className={inCls} />
              </div>
              <div className="flex flex-col items-center gap-1 ml-1">
                <input type="number" value={n1} onChange={e=>setN1(Number(e.target.value))} className={inCls} />
                <div className="w-16 h-0.5 bg-[var(--border)]" />
                <input type="number" value={d1} min={1} onChange={e=>setD1(Number(e.target.value))} className={inCls} />
              </div>
            </div>

            {/* Operator */}
            <div className="grid grid-cols-2 gap-2">
              {(['+','-','*','/'] as const).map(o => (
                <button key={o} onClick={() => setOp(o)}
                  className={`w-12 h-12 font-black text-lg border transition-all ${op===o ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {o==='*'?'×':o==='/'?'÷':o}
                </button>
              ))}
            </div>

            {/* Fraction 2 */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-[9px] font-bold text-[var(--text-muted)] mb-1">Whole</div>
                <input type="number" value={w2} onChange={e=>setW2(Number(e.target.value))} className={inCls} />
              </div>
              <div className="flex flex-col items-center gap-1 ml-1">
                <input type="number" value={n2} onChange={e=>setN2(Number(e.target.value))} className={inCls} />
                <div className="w-16 h-0.5 bg-[var(--border)]" />
                <input type="number" value={d2} min={1} onChange={e=>setD2(Number(e.target.value))} className={inCls} />
              </div>
            </div>
          </div>

          {/* Quick examples */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Examples</label>
            {[
              { label:'½ + ⅓', w1:0,n1:1,d1:2, op:'+' as const, w2:0,n2:1,d2:3 },
              { label:'¾ − ¼', w1:0,n1:3,d1:4, op:'-' as const, w2:0,n2:1,d2:4 },
              { label:'⅔ × ⅜', w1:0,n1:2,d1:3, op:'*' as const, w2:0,n2:3,d2:8 },
            ].map(ex => (
              <button key={ex.label} onClick={() => { setW1(ex.w1);setN1(ex.n1);setD1(ex.d1);setOp(ex.op);setW2(ex.w2);setN2(ex.n2);setD2(ex.d2); }}
                className="w-full p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left text-[12px] font-bold text-[var(--primary)] transition-all">
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {r.error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700">
              <p className="text-xs font-black uppercase mb-1">Calculation Error</p>
              <p className="text-sm">{r.error}</p>
            </div>
          ) : (
            <>
              {/* Simplified fraction */}
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-4">Simplified Result</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl font-black text-[var(--primary)] font-mono">{r.n}</div>
                  <div className="w-24 h-1 bg-[var(--border)]" />
                  <div className="text-5xl font-black text-[var(--primary)] font-mono">{r.d}</div>
                </div>
              </div>

          {/* Mixed number */}
          {r.mixed.w !== 0 && (
            <div className="p-5 bg-white border border-[var(--border)] text-center">
              <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2">Mixed Number</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-[#006600] font-mono">{r.mixed.w}</span>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg font-bold font-mono">{r.mixed.n}</span>
                  <div className="w-8 h-0.5 bg-[var(--border)]" />
                  <span className="text-lg font-bold font-mono">{r.mixed.d}</span>
                </div>
              </div>
            </div>
          )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                  <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">Decimal</div>
                  <div className="text-sm font-black font-mono text-[var(--text-main)]">{r.dec}</div>
                </div>
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                  <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">Percent</div>
                  <div className="text-sm font-black font-mono text-[var(--text-main)]">{r.pct}%</div>
                </div>
              </div>
            </>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How do I add fractions?', answer: 'Find a common denominator, convert each fraction, add the numerators, then simplify. e.g., ½ + ⅓ = 3/6 + 2/6 = 5/6.' },
          { question: 'What is a simplified fraction?', answer: 'A fraction where the numerator and denominator share no common factors other than 1. e.g., 4/8 simplifies to 1/2.' },
          { question: 'How do I divide fractions?', answer: 'Multiply the first fraction by the reciprocal of the second. e.g., ½ ÷ ⅓ = ½ × 3/1 = 3/2.' },
        ]} />
      }
    />
  );
}
