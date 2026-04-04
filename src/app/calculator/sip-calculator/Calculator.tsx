'use client';
import { useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TrendingUp } from 'lucide-react';

function fmt(n: number) { return Math.round(n).toLocaleString('en-IN'); }

const DEFAULT = { monthly: 5000, rate: 12, years: 10, stepUp: 10 };

export default function SIPCalculator() {
  const [state, setState] = useLocalStorage('cp-sip-state', DEFAULT);
  const { monthly, rate, years, stepUp } = state;
  const update = (k: keyof typeof DEFAULT, v: number) => setState({ ...state, [k]: v });

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const s = stepUp / 100;
    let fv = 0, totalInvested = 0, currentMonthly = monthly;
    const schedule: { year: number; invested: number; returns: number; balance: number }[] = [];
    for (let year = 1; year <= years; year++) {
      for (let m = 1; m <= 12; m++) { fv = (fv + currentMonthly) * (1 + r); totalInvested += currentMonthly; }
      schedule.push({ year, invested: totalInvested, returns: fv - totalInvested, balance: fv });
      currentMonthly = currentMonthly * (1 + s);
    }
    const returns = fv - totalInvested;
    const wealthGainedPct = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;
    return { fv, totalInvested, returns, wealthGainedPct, schedule };
  }, [monthly, rate, years, stepUp]);

  const invPct = result.fv > 0 ? (result.totalInvested / result.fv) * 100 : 0;

  return (
    <CalculatorLayout
      title="SIP Investment Calculator"
      description="Calculate Systematic Investment Plan (SIP) returns with annual step-up. Ideal for Nepal mutual fund and NEPSE portfolio planning."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          <ValidatedInput label="Monthly Investment (Rs.)" value={monthly} onChange={v => update('monthly', v)} min={500} prefix="Rs." step={500} required />

          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Expected Return Rate (p.a.)" value={rate} onChange={v => update('rate', v)} min={1} max={50} suffix="%" step={0.5} required />
            <ValidatedInput label="Time Period (Years)" value={years} onChange={v => update('years', v)} min={1} max={50} required />
          </div>

          <ValidatedInput label="Annual Step-Up (%)" value={stepUp} onChange={v => update('stepUp', v)} min={0} max={100} suffix="%" hint="Increase your SIP amount each year" />

          {/* Monthly Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Monthly Amounts</label>
            <div className="grid grid-cols-4 gap-2">
              {[1000, 5000, 10000, 25000].map(v => (
                <button key={v} onClick={() => update('monthly', v)}
                  className={`py-3 text-[11px] font-bold border transition-all ${monthly === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Year Schedule (compact) */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Yearly Growth Schedule</h3>
            </div>
            <div className="overflow-y-auto max-h-48">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)] text-[10px] text-[var(--text-muted)] font-black uppercase">
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-right">Invested</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.year} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)]">
                      <td className="px-3 py-2 font-bold text-[var(--text-secondary)] text-[11px]">{row.year}</td>
                      <td className="px-3 py-2 text-right font-mono text-[11px] text-[var(--text-secondary)]">{fmt(row.invested)}</td>
                      <td className="px-3 py-2 text-right font-mono font-black text-[11px] text-[var(--primary)]">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Future Value Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Estimated Future Value</div>
            </div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">Rs. {fmt(result.fv)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Wealth gained {result.wealthGainedPct.toFixed(1)}%</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Invested</span>
              <span className="text-sm font-black text-[var(--text-main)]">Rs. {fmt(result.totalInvested)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Est. Returns</span>
              <span className="text-sm font-black text-[#006600]">+ Rs. {fmt(result.returns)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Duration</span>
              <span className="text-sm font-black text-[var(--text-main)]">{years} years</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Annual Step-Up</span>
              <span className="text-sm font-black text-[var(--text-main)]">{stepUp}%/yr</span>
            </div>
          </div>

          {/* Split bar */}
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2">
              <span>Principal ({invPct.toFixed(0)}%)</span>
              <span>Returns ({(100 - invPct).toFixed(0)}%)</span>
            </div>
            <div className="h-4 flex overflow-hidden w-full">
              <div className="bg-[var(--primary)] transition-all duration-700" style={{ width: `${invPct}%` }} />
              <div className="bg-[#006600] flex-1" />
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">Estimates are based on a constant annual return. Actual mutual fund returns may vary.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a SIP?', answer: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount in mutual funds at regular intervals, leveraging compounding and dollar-cost averaging.' },
          { question: 'What is Step-Up SIP?', answer: 'A Step-Up SIP automatically increases your monthly investment by a fixed percentage each year, matching salary growth and accelerating wealth creation.' },
          { question: 'How much can I start with in Nepal?', answer: 'Most Nepal mutual funds allow SIPs starting from Rs. 1,000/month.' },
        ]} />
      }
    />
  );
}
