'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Calendar } from 'lucide-react';

export default function DateDuration() {
  const [start, setStart] = useState('2025-01-01');
  const [end, setEnd]     = useState('2025-12-31');

  const diff = useMemo(() => {
    const d1 = new Date(start), d2 = new Date(end);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const ms   = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(ms / 86400000);
    return { days, weeks: (days / 7).toFixed(1), months: (days / 30.437).toFixed(1), years: (days / 365.25).toFixed(2) };
  }, [start, end]);

  const dateCls = "flex-1 h-12 px-3 bg-transparent font-bold text-sm focus:outline-none";
  const inputWrap = "flex items-center border border-[var(--border)] bg-white";

  return (
    <CalculatorLayout
      title="Date Duration Calculator"
      description="Find the exact number of days, weeks, months, and years between any two dates. Accounts for leap years accurately."
      category={{ label: 'Utility', href: '/calculator/category/utility' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-white border border-[var(--border)]">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Start Date</label>
              <div className={inputWrap}>
                <Calendar className="w-4 h-4 ml-3 text-[var(--text-muted)] shrink-0" />
                <input type="date" value={start} onChange={e => setStart(e.target.value)} className={dateCls} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">End Date</label>
              <div className={inputWrap}>
                <Calendar className="w-4 h-4 ml-3 text-[var(--text-muted)] shrink-0" />
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} className={dateCls} />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Ranges</label>
            {[
              { label: 'This Year (2025)', s: '2025-01-01', e: '2025-12-31' },
              { label: 'Nepal FY 2081/82', s: '2024-07-16', e: '2025-07-15' },
              { label: 'Last 30 Days', s: new Date(Date.now() - 30*86400000).toISOString().split('T')[0], e: new Date().toISOString().split('T')[0] },
            ].map(p => (
              <button key={p.label} onClick={() => { setStart(p.s); setEnd(p.e); }}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{p.label}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{p.s} → {p.e}</span>
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {diff ? (
            <>
              {/* Days Hero */}
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Days</div>
                <div className="text-7xl font-black text-[var(--primary)] tracking-tighter mb-2">{diff.days.toLocaleString()}</div>
                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">days between dates</div>
              </div>

              {/* Other units */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Weeks',  val: diff.weeks },
                  { label: 'Months', val: diff.months },
                  { label: 'Years',  val: diff.years },
                ].map(({ label, val }) => (
                  <div key={label} className="p-4 bg-white border border-[var(--border)] text-center">
                    <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{label}</div>
                    <div className="text-xl font-black text-[var(--primary)]">{val}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                  <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">From</span>
                  <span className="text-sm font-black text-[var(--text-main)]">{start}</span>
                </div>
                <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                  <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">To</span>
                  <span className="text-sm font-black text-[var(--text-main)]">{end}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-5 border border-red-200 text-red-600 text-sm">Please select valid dates.</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'Does it count leap years?', answer: 'Yes — the calculator uses millisecond-level precision, so leap year days are always counted correctly.' },
          { question: 'Is the start or end date included?', answer: 'The count represents the absolute number of days between two dates (exclusive of the start day, inclusive of the end day).' },
        ]} />
      }
    />
  );
}
