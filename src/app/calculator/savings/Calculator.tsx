'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useDebounce } from '@/hooks/useDebounce';
import { PiggyBank } from 'lucide-react';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

export default function SavingsCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const dM = useDebounce(monthly, 300);
  const dR = useDebounce(rate, 300);
  const dY = useDebounce(years, 300);

  const result = useMemo(() => {
    const r = dR / 12 / 100;
    const n = dY * 12;
    const fv = r === 0 ? dM * n : dM * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = dM * n;
    const interest = fv - invested;
    const pctGrowth = ((interest / invested) * 100).toFixed(1);
    return { fv: Math.round(fv), invested: Math.round(invested), interest: Math.round(interest), pctGrowth };
  }, [dM, dR, dY]);

  const RATE_PRESETS = [4, 7, 10, 14];
  const YEAR_PRESETS = [5, 10, 15, 20];

  return (
    <CalculatorLayout
      title="Monthly Savings Calculator"
      description="Calculate how your regular monthly savings grow over time with compound interest. Plan your long-term wealth with Nepal-specific rates."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Monthly Savings */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Monthly Savings Amount</label>
              <span className="text-[11px] font-black text-[var(--primary)]">NPR {monthly.toLocaleString()}</span>
            </div>
            <div className="flex">
              <span className="h-12 px-4 bg-[var(--bg-surface)] border border-r-0 border-[var(--border)] text-[12px] font-black text-[var(--text-muted)] flex items-center">NPR</span>
              <input type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} min={100}
                className="flex-1 h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none" />
            </div>
            <input type="range" min={500} max={100000} step={500} value={monthly} onChange={e => setMonthly(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Annual Interest Rate</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{rate}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {RATE_PRESETS.map(v => (
                <button key={v} onClick={() => setRate(v)}
                  className={`py-2 text-xs font-black border transition-all ${rate === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
            <input type="range" min={1} max={20} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Years */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Investment Period</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{years} years</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {YEAR_PRESETS.map(v => (
                <button key={v} onClick={() => setYears(v)}
                  className={`py-2 text-xs font-black border transition-all ${years === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v} yr
                </button>
              ))}
            </div>
            <input type="range" min={1} max={40} step={1} value={years} onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Rate Guide */}
          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2">Nepal Rate Guide</div>
            {[['Savings Account', '4–6%'], ['Fixed Deposit', '7–10%'], ['Mutual Fund', '10–14% (est.)']].map(([t, r]) => (
              <div key={t} className="flex justify-between text-[11px] py-1 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--text-secondary)]">{t}</span>
                <span className="font-black text-[var(--primary)]">{r}</span>
              </div>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Total Future Value Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5 text-[var(--text-muted)]" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Total After {years} Years</div>
            </div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">{fmt(result.fv)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Grows {result.pctGrowth}% on invested amount</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Invested</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(result.invested)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Interest Earned</span>
              <span className="text-sm font-black text-[#006600]">+ {fmt(result.interest)}</span>
            </div>
            <div className="p-5 bg-[var(--primary)] text-white flex justify-between">
              <span className="text-[11px] font-bold uppercase">Total Savings</span>
              <span className="text-sm font-black">{fmt(result.fv)}</span>
            </div>
          </div>

          {/* Growth bar */}
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2">
              <span>Principal</span>
              <span>Interest</span>
            </div>
            <div className="h-4 flex overflow-hidden w-full">
              <div className="bg-[var(--primary)] transition-all duration-700"
                style={{ width: `${(result.invested / result.fv) * 100}%` }} />
              <div className="bg-[#006600] flex-1" />
            </div>
            <div className="flex justify-between text-[10px] mt-2 text-[var(--text-muted)]">
              <span>{((result.invested / result.fv) * 100).toFixed(0)}% principal</span>
              <span>{((result.interest / result.fv) * 100).toFixed(0)}% interest</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How is savings growth calculated?', answer: 'We use the future value of annuity: FV = PMT × [((1+r)^n − 1) / r] × (1+r). PMT = monthly amount, r = monthly rate, n = total months.' },
          { question: 'What rate should I use?', answer: 'Savings accounts: 4–6%, Fixed deposits: 7–10%, Mutual funds: 10–14% (estimated returns, not guaranteed).' },
          { question: 'Does this account for inflation?', answer: 'No — these are nominal values. To get real (inflation-adjusted) returns, subtract Nepal\'s inflation rate (~5–7%) from your expected rate.' },
          { question: 'How much should I save monthly?', answer: 'Financial experts recommend saving at least 20% of monthly income. Even NPR 2,000/month grows significantly over 10+ years.' },
        ]} />
      }
    />
  );
}
