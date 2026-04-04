'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function RoundingCalc() {
  const [val, setVal]           = useState('123.4567');
  const [precision, setPrecision] = useState(2);

  const res = useMemo(() => {
    const n = parseFloat(val);
    if (isNaN(n)) return null;
    return { whole: Math.round(n), floor: Math.floor(n), ceil: Math.ceil(n), fixed: n.toFixed(precision), sig: n.toPrecision(Math.max(1, precision)) };
  }, [val, precision]);

  return (
    <CalculatorLayout
      title="Rounding Calculator"
      description="Round any number to the nearest whole, floor, ceiling, decimal places, or significant figures instantly."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Input Number</label>
            <input type="number" value={val} onChange={e => setVal(e.target.value)}
              className="w-full h-14 px-4 border-2 border-[var(--border)] bg-white font-mono text-2xl font-black focus:border-[var(--primary)] outline-none" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Decimal Places / Precision</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{precision}</span>
            </div>
            <input type="range" min={0} max={10} value={precision} onChange={e => setPrecision(Number(e.target.value))} className="w-full accent-[#083366]" />
            <div className="grid grid-cols-6 gap-1">
              {[0,1,2,3,4,5].map(v => (
                <button key={v} onClick={() => setPrecision(v)}
                  className={`py-2 text-[10px] font-black border transition-all ${precision === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quick example inputs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Try an Example</label>
            {['3.14159', '2.71828', '1.41421', '99.9999'].map(ex => (
              <button key={ex} onClick={() => setVal(ex)}
                className="w-full p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left font-mono font-bold text-sm text-[var(--text-main)] transition-all">
                {ex}
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-4">
          {res ? (
            <>
              {[
                { method: 'Standard Round',     result: String(res.whole) },
                { method: 'Floor (round down)', result: String(res.floor) },
                { method: 'Ceiling (round up)', result: String(res.ceil)  },
                { method: `Fixed (${precision} decimals)`, result: res.fixed },
                { method: `Significant Figures (${precision})`, result: res.sig },
              ].map(({ method, result }) => (
                <div key={method} className="p-5 bg-white border border-[var(--border)]">
                  <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{method}</div>
                  <div className="text-2xl font-black text-[var(--primary)] font-mono">{result}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-5 border border-red-200 text-red-600 text-sm">Enter a valid number.</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the difference between floor and ceiling?', answer: 'Floor always rounds down to the nearest integer; ceiling always rounds up. Example: floor(2.7)=2, ceiling(2.1)=3.' },
          { question: 'What is standard rounding?', answer: 'Standard (half-up) rounding: if decimal is ≥0.5, round up; otherwise round down. Example: 2.5→3, 2.4→2.' },
          { question: 'What are significant figures?', answer: 'Significant figures represent the precision of a number. 3.14159 to 3 sig figs = 3.14.' },
        ]} />
      }
    />
  );
}
