'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useDebounce } from '@/hooks/useDebounce';

function fmt(n: number) { return Math.round(n).toLocaleString('en-IN'); }

const COMPOUNDING = [
  { value: 1, label: 'Annually (1×/year)' },
  { value: 2, label: 'Semi-Annually (2×/year)' },
  { value: 4, label: 'Quarterly (4×/year)' },
  { value: 12, label: 'Monthly (12×/year)' },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(1);

  const debP = useDebounce(principal, 300);
  const debR = useDebounce(rate, 300);
  const debY = useDebounce(years, 300);

  const result = useMemo(() => {
    const r = debR / 100, n = compounding;
    const amount = debP * Math.pow(1 + r / n, n * debY);
    const interest = amount - debP;
    const schedule = Array.from({ length: debY }, (_, i) => {
      const yr = i + 1;
      const bal = debP * Math.pow(1 + r / n, n * yr);
      return { year: yr, interest: bal - debP, balance: bal };
    });
    return { amount, interest, schedule };
  }, [debP, debR, debY, compounding]);

  const pctGrowth = ((result.interest / debP) * 100).toFixed(1);

  return (
    <CalculatorLayout
      title="Compound Interest Calculator"
      description="Calculate how your savings or investments grow with compound interest. Supports multiple compounding frequencies with yearly growth schedule."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Principal */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Initial Investment</label>
              <span className="text-[11px] font-black text-[var(--primary)]">NPR {fmt(principal)}</span>
            </div>
            <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))}
              className="w-full h-11 px-4 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
            <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={e => setPrincipal(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Annual Interest Rate</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{rate}%</span>
            </div>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full h-11 px-4 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
            <input type="range" min={1} max={30} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Years */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Time Period</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{years} Years</span>
            </div>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))}
              className="w-full h-11 px-4 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
            <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Compounding Frequency</label>
            <div className="space-y-1">
              {COMPOUNDING.map(c => (
                <button key={c.value} onClick={() => setCompounding(c.value)}
                  className={`w-full p-3 border text-left text-[12px] font-bold transition-all ${compounding === c.value ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Amount</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">NPR {fmt(result.amount)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">grows {pctGrowth}% over {years} yrs</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal Invested</span>
              <span className="text-sm font-black text-[var(--text-main)]">NPR {fmt(debP)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Interest Earned</span>
              <span className="text-sm font-black text-[#006600]">NPR {fmt(result.interest)}</span>
            </div>
          </div>

          {/* Mini Growth Schedule */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Yearly Growth Schedule</h3>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)] text-[10px] text-[var(--text-muted)] font-bold uppercase">
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-right">Interest</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.year} className="border-b border-[var(--border)] hover:bg-[var(--bg-surface)]">
                      <td className="px-3 py-2 font-bold text-[var(--text-secondary)]">{row.year}</td>
                      <td className="px-3 py-2 text-right font-mono text-[#006600] text-[11px]">+{fmt(row.interest)}</td>
                      <td className="px-3 py-2 text-right font-mono font-black text-[var(--primary)] text-[11px]">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is compound interest?', answer: 'It\'s interest calculated on both the initial principal and the accumulated interest—"interest on interest"—leading to exponential growth.' },
          { question: 'How does compounding frequency affect returns?', answer: 'More frequent compounding means more frequent interest additions. Monthly compounding yields slightly more than annual for the same rate.' },
          { question: 'What is the formula?', answer: 'A = P(1 + r/n)^(nt). P = principal, r = annual rate, n = times compounded/year, t = years.' },
          { question: 'Where can I earn compound interest in Nepal?', answer: 'Savings accounts, fixed deposits (FD), recurring deposits, and mutual funds in Nepal all compound interest, typically quarterly.' },
        ]} />
      }
    />
  );
}
