'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function RatioProportion() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('2');
  const [c, setC] = useState('10');
  const [d, setD] = useState('');

  const result = useMemo(() => {
    const na = parseFloat(a), nb = parseFloat(b), nc = parseFloat(c), nd = parseFloat(d);
    if (isNaN(na)) return { label: 'A', val: !isNaN(nb*nc/nd) ? ((nb*nc)/nd).toFixed(4) : '?' };
    if (isNaN(nb)) return { label: 'B', val: !isNaN(na*nd/nc) ? ((na*nd)/nc).toFixed(4) : '?' };
    if (isNaN(nc)) return { label: 'C', val: !isNaN(na*nd/nb) ? ((na*nd)/nb).toFixed(4) : '?' };
    if (isNaN(nd)) return { label: 'D', val: !isNaN(nb*nc/na) ? ((nb*nc)/na).toFixed(4) : '?' };
    return { label: '?', val: 'No unknown' };
  }, [a, b, c, d]);

  const boxCls = (v: string) => `h-16 w-full text-center text-3xl font-black font-mono border-2 bg-white focus:border-[var(--primary)] outline-none transition-all ${v === '' ? 'border-dashed border-[var(--primary)] bg-blue-50 text-[var(--primary)] placeholder-blue-300' : 'border-[var(--border)]'}`;

  return (
    <CalculatorLayout
      title="Ratio & Proportion Calculator"
      description="Solve A:B = C:D for any unknown value by leaving that field empty. Useful for scale models, recipe scaling, and map proportions."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="p-5 bg-white border border-[var(--border)]">
            <div className="text-[11px] font-bold uppercase text-[var(--text-secondary)] mb-4 text-center">Leave one field blank to solve for it</div>
            <div className="flex items-center gap-3 justify-center">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] text-center block">A</label>
                <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="?" className={boxCls(a)} />
              </div>
              <span className="text-3xl font-black text-[var(--text-muted)] pb-4">:</span>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] text-center block">B</label>
                <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="?" className={boxCls(b)} />
              </div>
              <span className="text-3xl font-black text-[var(--primary)] pb-4">=</span>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] text-center block">C</label>
                <input type="number" value={c} onChange={e => setC(e.target.value)} placeholder="?" className={boxCls(c)} />
              </div>
              <span className="text-3xl font-black text-[var(--text-muted)] pb-4">:</span>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] text-center block">D</label>
                <input type="number" value={d} onChange={e => setD(e.target.value)} placeholder="?" className={boxCls(d)} />
              </div>
            </div>
          </div>

          {/* Use case examples */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Apply to a Use Case</label>
            {[
              { label: 'Recipe scaling',  a:'2', b:'4', c:'6', d:'' },
              { label: 'Map scaling',     a:'1', b:'50000', c:'5', d:'' },
              { label: 'Grade scaling',   a:'75', b:'100', c:'', d:'60' },
            ].map(ex => (
              <button key={ex.label} onClick={() => { setA(ex.a); setB(ex.b); setC(ex.c); setD(ex.d); }}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{ex.label}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{ex.a}:{ex.b} = {ex.c||'?'}:{ex.d||'?'}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">Cross multiply: A × D = B × C</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Solved Value of {result.label}</div>
            <div className="text-7xl font-black text-[var(--primary)] tracking-tighter font-mono mb-3">{result.val}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Leave exactly one field blank</div>
          </div>

          <div className="space-y-2 p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              <strong>How to use:</strong> Fill in three of the four values (A, B, C, D). Leave exactly one blank — the calculator will solve for it using cross-multiplication.
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a proportion?', answer: 'An equation that says two ratios are equal: A:B = C:D (or A/B = C/D).' },
          { question: 'How is cross-multiplication used?', answer: 'A × D = B × C. To find D: D = (B × C) / A.' },
          { question: 'What is a ratio?', answer: 'A ratio compares two quantities: A:B means for every A units of one, there are B units of another.' },
        ]} />
      }
    />
  );
}
