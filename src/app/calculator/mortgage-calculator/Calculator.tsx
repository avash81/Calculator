'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

export default function MortgageCalculator() {
  const [pPrice, setPPrice]       = useState(15000000);
  const [downPercent, setDown]    = useState(25);
  const [rate, setRate]           = useState(12.5);
  const [years, setYears]         = useState(15);
  const [taxRate, setTaxRate]     = useState(1.2);
  const [insurance, setInsurance] = useState(50000);

  const r = useMemo(() => {
    const downAmt = pPrice * (downPercent / 100);
    const loan = pPrice - downAmt;
    const i = (rate / 100) / 12, n = years * 12;
    const pAndI = (loan * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const mTax = (pPrice * (taxRate / 100)) / 12;
    const mInsurance = insurance / 12;
    return { loan, downAmt, pAndI, mTax, mInsurance, monthlyTotal: pAndI + mTax + mInsurance };
  }, [pPrice, downPercent, rate, years, taxRate, insurance]);

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Full mortgage calculator including Principal & Interest, property tax, and insurance. Based on Nepal bank rate standards."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Home Price</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{fmt(pPrice)}</span>
            </div>
            <input type="range" min={1000000} max={50000000} step={100000} value={pPrice} onChange={e => setPPrice(Number(e.target.value))} className="w-full accent-[#083366]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Down Payment (%)" value={downPercent} onChange={setDown} min={0} max={100} suffix="%" />
            <ValidatedInput label="Interest Rate (%)" value={rate} onChange={setRate} min={1} max={30} step={0.1} suffix="%" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Tenure</label>
              <select value={years} onChange={e => setYears(Number(e.target.value))}
                className="w-full h-11 px-3 border border-[var(--border)] bg-[var(--bg-surface)] font-bold text-sm outline-none focus:border-[var(--primary)] cursor-pointer">
                {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} Years</option>)}
              </select>
            </div>
            <ValidatedInput label="Annual Tax (%)" value={taxRate} onChange={setTaxRate} min={0} max={5} step={0.1} suffix="%" />
          </div>

          <ValidatedInput label="Annual Insurance (NPR)" value={insurance} onChange={setInsurance} min={0} prefix="NPR" />
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Monthly Payment</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">{fmt(r.monthlyTotal)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">per month (incl. P&I + tax + insurance)</div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Principal & Interest', val: r.pAndI, color: 'text-[var(--primary)]' },
              { label: 'Property Tax /mo',     val: r.mTax, color: 'text-amber-700' },
              { label: 'Insurance /mo',        val: r.mInsurance, color: 'text-[var(--text-secondary)]' },
            ].map(({ label, val, color }) => (
              <div key={label} className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                <span className={`text-sm font-black ${color}`}>{fmt(val)}</span>
              </div>
            ))}
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Loan Amount</span>
              <span className="text-sm font-black text-[var(--primary)]">{fmt(r.loan)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Down Payment</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(r.downAmt)} ({downPercent}%)</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What does a mortgage payment include?', answer: 'Standard mortgage payments include Principal & Interest (P&I), Property Tax, and Homeowners Insurance (PITI).' },
          { question: 'How can I lower my monthly mortgage?', answer: 'Increase your down payment, get a lower interest rate, or extend the tenure — though longer tenures increase total interest paid.' },
        ]} />
      }
    />
  );
}
