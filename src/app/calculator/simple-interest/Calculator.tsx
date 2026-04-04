'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(1);

  const r = useMemo(() => {
    const interest = (principal * time * rate) / 100;
    const total = principal + interest;
    return { interest, total };
  }, [principal, time, rate]);

  const pctGrowth = ((r.interest / principal) * 100).toFixed(1);

  const PRESETS = [
    { label: '1 Year', time: 1 }, { label: '2 Years', time: 2 },
    { label: '5 Years', time: 5 }, { label: '10 Years', time: 10 },
  ];

  return (
    <CalculatorLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest (SI = P × R × T / 100) and total payable amount for loans and savings in Nepal."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Inputs */}
          <div className="space-y-4 p-6 bg-white border border-[var(--border)]">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal Amount</label>
              <div className="flex">
                <span className="h-11 px-3 bg-[var(--bg-surface)] border border-r-0 border-[var(--border)] text-[11px] font-bold text-[var(--text-muted)] flex items-center">NPR</span>
                <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))}
                  className="flex-1 h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Rate (%/yr)</label>
                <input type="number" value={rate} step={0.1} onChange={e => setRate(Number(e.target.value))}
                  className="w-full h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Time (Years)</label>
                <input type="number" value={time} step={0.5} onChange={e => setTime(Number(e.target.value))}
                  className="w-full h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
              </div>
            </div>
          </div>

          {/* Time Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Time Periods</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => setTime(p.time)}
                  className={`py-3 text-[11px] font-bold border transition-all ${time === p.time ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Nepal Bank Rates</label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 8, 10, 12].map(r => (
                <button key={r} onClick={() => setRate(r)}
                  className={`py-3 text-[11px] font-bold border transition-all ${rate === r ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[12px] font-mono text-[var(--primary)]">SI = (P × R × T) / 100</code>
            <div className="text-[10px] text-[var(--text-muted)] mt-1">
              = ({principal.toLocaleString()} × {rate} × {time}) / 100
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Total Amount Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Amount</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">{fmt(r.total)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Grows {pctGrowth}% over {time} yr{time !== 1 ? 's' : ''}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(principal)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Simple Interest</span>
              <span className="text-sm font-black text-[#006600]">+ {fmt(r.interest)}</span>
            </div>
            <div className="p-5 bg-[var(--primary)] text-white flex justify-between">
              <span className="text-[11px] font-bold uppercase">Total Payable</span>
              <span className="text-sm font-black">{fmt(r.total)}</span>
            </div>
          </div>

          {/* Comparison note */}
          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed italic">
              * Simple interest does NOT compound — interest is always calculated on the original principal only.
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is Simple Interest?', answer: 'SI is calculated only on the principal: I = P × R × T / 100. Unlike compound interest, accumulated interest is never added back to the principal.' },
          { question: 'How is it different from compound interest?', answer: 'In simple interest, each year\'s interest is the same fixed amount. In compound interest, each year\'s interest is added to the growing principal.' },
          { question: 'Can I use months instead of years?', answer: 'Yes — enter 0.5 for 6 months, 0.25 for 3 months. Convert months to years by dividing by 12.' },
          { question: 'Where is simple interest used in Nepal?', answer: 'Short-term personal loans, some cooperative society loans, and educational purpose calculations commonly use simple interest in Nepal.' },
        ]} />
      }
    />
  );
}
