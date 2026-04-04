'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function LcmGcfCalculator() {
  const [inputVal, setInputVal] = useState('12, 18, 24');

  const r = useMemo(() => {
    const arr = inputVal.split(/[,\s]+/).map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0);
    if (arr.length === 0) return null;
    const gcd2 = (a: number, b: number): number => b === 0 ? a : gcd2(b, a % b);
    const lcm2 = (a: number, b: number) => (a * b) / gcd2(a, b);
    const getPF = (n: number) => {
      let d = 2; const f = []; let t = n;
      while (t > 1) { while (t % d === 0) { f.push(d); t /= d; } d++; if (d*d > t) { if (t > 1) f.push(t); break; } }
      return f;
    };
    let gcf = arr[0], lcm = arr[0];
    for (let i = 1; i < arr.length; i++) { gcf = gcd2(gcf, arr[i]); lcm = lcm2(lcm, arr[i]); }
    return { lcm, gcf, nums: arr, factors: arr.map(n => ({ n, f: getPF(n) })) };
  }, [inputVal]);

  return (
    <CalculatorLayout
      title="LCM & GCF Calculator"
      description="Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF/HCF) of two or more numbers, with prime factorization."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Enter Numbers (comma separated)</label>
            <textarea value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="w-full h-28 p-4 border border-[var(--border)] bg-white font-mono text-lg font-bold focus:border-[var(--primary)] outline-none resize-none"
              placeholder="e.g. 12, 18, 24" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Sets</label>
            {[
              { label: '2 numbers', data: '12, 18' },
              { label: '3 numbers', data: '12, 18, 24' },
              { label: 'Large set', data: '36, 48, 60, 84' },
            ].map(d => (
              <button key={d.label} onClick={() => setInputVal(d.data)}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{d.label}</span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">{d.data}</span>
              </button>
            ))}
          </div>

          {/* Prime factorizations */}
          {r && (
            <div className="bg-white border border-[var(--border)]">
              <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
                <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Prime Factorization</h3>
              </div>
              {r.factors.map(({ n, f }) => (
                <div key={n} className="px-4 py-3 border-b border-[var(--border)] flex justify-between last:border-0">
                  <span className="text-[11px] font-black text-[var(--primary)]">{n}</span>
                  <span className="text-[11px] font-mono font-bold text-[var(--text-main)]">{f.join(' × ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {r ? (
            <>
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Least Common Multiple (LCM)</div>
                <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{r.lcm.toLocaleString()}</div>
              </div>

              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Greatest Common Factor (GCF / HCF)</div>
                <div className="text-6xl font-black text-[#006600] tracking-tighter font-mono">{r.gcf.toLocaleString()}</div>
              </div>

              {r.nums.length === 2 && (
                <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
                  <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2">Mathematical Relation</div>
                  <p className="text-[11px] font-mono text-[var(--text-main)]">LCM × GCF = {r.lcm} × {r.gcf} = {r.lcm * r.gcf}</p>
                  <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">{r.nums[0]} × {r.nums[1]} = {r.nums[0] * r.nums[1]}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-5 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold">Enter at least one positive integer.</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is LCM?', answer: 'Least Common Multiple: the smallest positive integer exactly divisible by all given numbers. e.g., LCM(4,6) = 12.' },
          { question: 'What is GCF/HCF?', answer: 'Greatest Common Factor (also HCF): the largest integer that divides all given numbers exactly. e.g., GCF(12,18) = 6.' },
          { question: 'How are LCM and GCF related?', answer: 'For two numbers a and b: LCM(a,b) × GCF(a,b) = a × b.' },
        ]} />
      }
    />
  );
}
