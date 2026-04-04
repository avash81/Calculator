'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { TrendingUp } from 'lucide-react';

function fmt(n: number) { return Math.round(n).toLocaleString('en-IN'); }

const PRESETS = [
  { label: 'NEPSE avg', initial: 100000, final: 250000, years: 5 },
  { label: 'FD return',  initial: 100000, final: 161000, years: 6 },
  { label: 'Property',   initial: 500000, final: 2000000, years: 10 },
];

export default function CAGRCalculator() {
  const [initial, setInitial] = useState(100000);
  const [finalV, setFinal]    = useState(250000);
  const [years, setYears]     = useState(5);

  const cagr = useMemo(() => {
    if (initial <= 0 || finalV <= 0 || years <= 0) return 0;
    return (Math.pow(finalV / initial, 1 / years) - 1) * 100;
  }, [initial, finalV, years]);

  const growth = finalV > 0 && initial > 0 ? ((finalV - initial) / initial * 100).toFixed(1) : '0';

  const inputCls = "w-full h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="CAGR Calculator"
      description="Calculate the Compound Annual Growth Rate of any investment. Compare NEPSE stocks, FD returns, and real estate growth rates."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-5 bg-white border border-[var(--border)]">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Initial Value (Rs.)</label>
              <input type="number" value={initial} onChange={e => setInitial(Number(e.target.value))} min={0} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Final Value (Rs.)</label>
              <input type="number" value={finalV} onChange={e => setFinal(Number(e.target.value))} min={0} className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Duration</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{years} years</span>
            </div>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} min={1} max={50} className={inputCls} />
            <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-[#083366]" />
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Scenarios</label>
            <div className="space-y-1">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => { setInitial(p.initial); setFinal(p.final); setYears(p.years); }}
                  className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                  <span className="text-[12px] font-bold text-[var(--text-main)]">{p.label}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{fmt(p.initial)} → {fmt(p.final)} / {p.years}yr</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">CAGR = [(Final / Initial)^(1/Years)] − 1</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">CAGR</div>
            </div>
            <div className="text-7xl font-black text-[#006600] tracking-tighter mb-2">{cagr.toFixed(2)}<span className="text-3xl">%</span></div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">per year compounded</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Initial Investment</span>
              <span className="text-sm font-black text-[var(--text-main)]">Rs. {fmt(initial)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Final Value</span>
              <span className="text-sm font-black text-[var(--text-main)]">Rs. {fmt(finalV)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Growth</span>
              <span className="text-sm font-black text-[#006600]">+{growth}%</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Period</span>
              <span className="text-sm font-black text-[var(--text-main)]">{years} years</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">CAGR smooths out volatility for a fair year-over-year comparison. It does not represent guaranteed future returns.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is CAGR?', answer: 'CAGR (Compound Annual Growth Rate) is the average annual growth rate of an investment over a multi-year period, representing smooth geometric growth.' },
          { question: 'How is CAGR calculated?', answer: 'CAGR = (Final/Initial)^(1/Years) − 1. Then multiply by 100 for percentage.' },
          { question: 'What is a good CAGR for NEPSE?', answer: 'For Nepal stock market (NEPSE), a CAGR of 12–15% is considered strong for long-term equity. FDs typically offer 8–10% CAGR.' },
          { question: 'Does CAGR include risk?', answer: 'No — CAGR only measures historical rate of return. Two investments with the same CAGR can have very different risk profiles.' },
        ]} />
      }
    />
  );
}
