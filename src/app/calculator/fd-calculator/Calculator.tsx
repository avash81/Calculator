'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useDebounce } from '@/hooks/useDebounce';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

const COMP_OPTIONS = [
  { label: 'Monthly (12×)',     value: 12 },
  { label: 'Quarterly (4×)',    value: 4  },
  { label: 'Half-Yearly (2×)', value: 2  },
  { label: 'Yearly (1×)',       value: 1  },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(1);
  const [compounding, setCompounding] = useState(4);

  const dP = useDebounce(principal, 300);
  const dR = useDebounce(rate, 300);
  const dT = useDebounce(time, 300);

  const r = useMemo(() => {
    const amount = dP * Math.pow(1 + dR / 100 / compounding, compounding * dT);
    const interest = amount - dP;
    const pctGrowth = ((interest / dP) * 100).toFixed(1);
    return { maturity: amount, interest, pctGrowth };
  }, [dP, dR, dT, compounding]);

  const RATE_PRESETS = [6, 8, 10, 12];
  const TIME_PRESETS = [{ label: '6mo', value: 0.5 }, { label: '1yr', value: 1 }, { label: '2yr', value: 2 }, { label: '5yr', value: 5 }];

  return (
    <CalculatorLayout
      title="Fixed Deposit (FD) Calculator"
      description="Calculate FD maturity amount and interest earned with Nepal bank compounding rates. Supports quarterly and monthly compounding."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Principal */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal Amount</label>
            <div className="flex">
              <span className="h-12 px-4 bg-[var(--bg-surface)] border border-r-0 border-[var(--border)] text-[12px] font-black text-[var(--text-muted)] flex items-center">NPR</span>
              <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))}
                className="flex-1 h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none" />
            </div>
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
            <input type="number" step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full h-10 px-3 border border-[var(--border)] bg-white text-sm font-bold focus:border-[var(--primary)] outline-none" />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Duration</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{time} yr{time !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIME_PRESETS.map(p => (
                <button key={p.label} onClick={() => setTime(p.value)}
                  className={`py-2 text-xs font-black border transition-all ${time === p.value ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <input type="number" step={0.5} value={time} onChange={e => setTime(Number(e.target.value))}
              className="w-full h-10 px-3 border border-[var(--border)] bg-white text-sm font-bold focus:border-[var(--primary)] outline-none" />
          </div>

          {/* Compounding */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Compounding Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              {COMP_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setCompounding(opt.value)}
                  className={`py-3 text-[11px] font-bold border transition-all ${compounding === opt.value ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Maturity Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Maturity Amount</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">{fmt(r.maturity)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Grows {r.pctGrowth}% over {time} yr{time !== 1 ? 's' : ''}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal Deposited</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(dP)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Interest Earned</span>
              <span className="text-sm font-black text-[#006600]">+ {fmt(r.interest)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Compounding</span>
              <span className="text-sm font-black text-[var(--text-main)]">{COMP_OPTIONS.find(c => c.value === compounding)?.label}</span>
            </div>
          </div>

          <div className="p-5 bg-amber-50 border border-amber-200">
            <p className="text-[12px] text-amber-800 leading-relaxed">
              ⚠️ <strong>TDS Note:</strong> FD interest in Nepal is subject to <strong>5% withholding tax</strong> deducted at source by the bank.
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a Fixed Deposit (FD)?', answer: 'An FD is a bank instrument that pays a higher interest rate than a savings account. Your money is locked for a fixed duration, and the bank compounds interest at set intervals.' },
          { question: 'How is FD interest calculated?', answer: 'Most Nepal banks use compound interest: A = P(1 + r/n)^(nt). P=principal, r=rate, n=compounding frequency per year, t=time in years. Quarterly compounding (n=4) is most common.' },
          { question: 'Is FD interest taxable?', answer: 'Yes. Nepal levies 5% Withholding Tax (TDS) on FD interest, deducted at source by the bank before crediting your account.' },
          { question: 'Can I withdraw early?', answer: 'Most banks allow premature FD withdrawal with a penalty — typically a 1–2% reduction in the advertised interest rate.' },
        ]} />
      }
    />
  );
}
