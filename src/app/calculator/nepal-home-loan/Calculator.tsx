'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

const RATE_PRESETS = [10.5, 11, 12, 12.5, 13];
const TENURE_PRESETS = [10, 15, 20, 25, 30];

export default function NepalHomeLoan() {
  const [amount, setAmount]  = useState(5000000);
  const [rate, setRate]      = useState(12.5);
  const [tenure, setTenure]  = useState(15);

  const r = useMemo(() => {
    const p = amount, rM = rate / 12 / 100, n = tenure * 12;
    const emi = (p * rM * Math.pow(1 + rM, n)) / (Math.pow(1 + rM, n) - 1);
    const totalPayment = emi * n;
    return { emi, totalPayment, totalInterest: totalPayment - p };
  }, [amount, rate, tenure]);

  const principalPct = r.totalPayment > 0 ? (amount / r.totalPayment * 100) : 0;

  return (
    <CalculatorLayout
      title="Nepal Home Loan EMI Calculator"
      description="Calculate your monthly EMI for home loans in Nepal. Based on NRB guidelines and current commercial bank rates for FY 2081/82."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          <ValidatedInput label="Loan Amount (NPR)" value={amount} onChange={setAmount} min={100000} prefix="NPR" required />

          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" required />
            <ValidatedInput label="Tenure" value={tenure} onChange={setTenure} min={1} max={30} suffix="yr" required />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Bank Rates</label>
            <div className="grid grid-cols-5 gap-2">
              {RATE_PRESETS.map(v => (
                <button key={v} onClick={() => setRate(v)}
                  className={`py-2 text-[10px] font-black border transition-all ${rate === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Tenures</label>
            <div className="grid grid-cols-5 gap-2">
              {TENURE_PRESETS.map(v => (
                <button key={v} onClick={() => setTenure(v)}
                  className={`py-2 text-[10px] font-black border transition-all ${tenure === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}yr
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-[12px] text-blue-800 leading-relaxed">
              <strong>NRB Guideline:</strong> LTV ratio up to 70% (inside KTM Valley) and 80% (outside). First home interest deduction up to NPR 25,000/yr.
            </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Monthly EMI</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">{fmt(r.emi)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">per month</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Principal Amount</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(amount)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Interest</span>
              <span className="text-sm font-black text-red-600">{fmt(r.totalInterest)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Payment</span>
              <span className="text-sm font-black text-[var(--primary)]">{fmt(r.totalPayment)}</span>
            </div>
          </div>

          {/* Principal vs Interest Bar */}
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
              <span>Principal ({principalPct.toFixed(0)}%)</span>
              <span>Interest ({(100 - principalPct).toFixed(0)}%)</span>
            </div>
            <div className="h-4 flex overflow-hidden w-full">
              <div className="bg-[var(--primary)] transition-all duration-700" style={{ width: `${principalPct}%` }} />
              <div className="bg-red-400 flex-1" />
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'Max tenure for home loans in Nepal?', answer: 'NRB guidelines allow up to 30 years for residential home loans, subject to borrower age and other conditions.' },
          { question: 'What is LTV ratio?', answer: 'Loan-to-Value: the bank lends up to 70% of property value inside KTM Valley and 80% outside.' },
          { question: 'Tax benefit on home loan interest?', answer: 'Individual taxpayers can deduct up to NPR 25,000/year on interest paid for their first home loan purchase.' },
        ]} />
      }
    />
  );
}
