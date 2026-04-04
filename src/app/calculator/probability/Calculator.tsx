'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Dices } from 'lucide-react';

const SCENARIOS = [
  { label: 'Dice roll (6)',  f: 1, t: 6 },
  { label: 'Coin flip',     f: 1, t: 2 },
  { label: 'Draw one ace',  f: 4, t: 52 },
  { label: 'Lottery (1/45)',f: 1, t: 45 },
];

export default function ProbabilityCalc() {
  const [favorable, setFavorable] = useState(1);
  const [total, setTotal]         = useState(6);

  const res = useMemo(() => {
    if (total <= 0) return { prob: 0, pct: '—', odds: '—', complement: '—' };
    const p = Math.min(favorable / total, 1);
    return { prob: p.toFixed(4), pct: (p * 100).toFixed(2) + '%', odds: `${favorable}:${total - favorable}`, complement: ((1-p)*100).toFixed(2) + '%' };
  }, [favorable, total]);

  const inputCls = "w-full h-12 px-4 border border-[var(--border)] bg-white font-bold text-xl focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="Probability Calculator"
      description="Calculate the probability of any event. Enter favorable outcomes and total sample space to get probability as a percentage, decimal, and odds."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Favorable Outcomes</label>
              <input type="number" value={favorable} onChange={e => setFavorable(Number(e.target.value))} min={0} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Sample Space</label>
              <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} min={1} className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Scenarios</label>
            {SCENARIOS.map(s => (
              <button key={s.label} onClick={() => { setFavorable(s.f); setTotal(s.t); }}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{s.label}</span>
                <span className="text-[11px] font-black text-[var(--primary)]">{s.f}/{s.t}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">P(A) = Favorable Outcomes / Total Sample Space</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Dices className="w-5 h-5 text-[var(--text-muted)]" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Probability</div>
            </div>
            <div className="text-7xl font-black text-[var(--primary)] tracking-tighter mb-2">{res.pct}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">chance of success</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Decimal',    val: res.prob },
              { label: 'Odds',       val: res.odds },
              { label: 'Complement', val: res.complement },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{label}</div>
                <div className="text-lg font-black text-[var(--primary)]">{val}</div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
              <span>Favorable</span><span>Unfavorable</span>
            </div>
            <div className="h-4 flex overflow-hidden w-full">
              <div className="bg-[var(--primary)] transition-all duration-700" style={{ width: res.pct }} />
              <div className="bg-red-300 flex-1" />
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="font-black text-[var(--primary)]">{res.pct}</span>
              <span className="font-black text-red-600">{res.complement}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the basic probability formula?', answer: 'P(A) = Favorable Outcomes / Total Outcomes. Always a value between 0 and 1 (or 0%–100%).' },
          { question: 'What is the sample space?', answer: 'The set of all possible outcomes (e.g., {1,2,3,4,5,6} for a six-sided die).' },
          { question: 'What is complement probability?', answer: 'P(not A) = 1 − P(A). If the chance of success is 30%, the complement (failure) is 70%.' },
        ]} />
      }
    />
  );
}
