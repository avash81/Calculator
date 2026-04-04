'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

export default function NepalPFCalculator() {
  const [basic, setBasic]  = useState(50000);
  const [years, setYears]  = useState(10);
  const [rate, setRate]    = useState(8);

  const r = useMemo(() => {
    const monthlyPF       = basic * 0.20;
    const annualGratuity  = basic * 0.0833 * 12;
    const monthlyRate     = rate / 100 / 12;
    let totalPF = 0;
    for (let i = 0; i < years * 12; i++) { totalPF = (totalPF + monthlyPF) * (1 + monthlyRate); }
    const totalGratuity = annualGratuity * years;
    return { monthlyPF, totalPF, totalGratuity, total: totalPF + totalGratuity };
  }, [basic, years, rate]);

  return (
    <CalculatorLayout
      title="Nepal PF & Gratuity Calculator"
      description="Calculate your accumulated Provident Fund and Gratuity under Nepal Labor Act 2074. Includes monthly compound interest projections."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          <ValidatedInput label="Monthly Basic Salary (NPR)" value={basic} onChange={setBasic} min={10000} prefix="NPR" required />
          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Service Years" value={years} onChange={setYears} min={1} max={40} required />
            <ValidatedInput label="PF Interest Rate" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" required />
          </div>

          {/* PF Rules summary */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Nepal Labor Act 2074 — PF Rules</h3>
            </div>
            {[
              ['Employee Contribution', '10% of basic salary'],
              ['Employer Contribution', '10% of basic salary'],
              ['Total Monthly PF',      '20% of basic salary'],
              ['Gratuity Rate',         '8.33%/month (≈1 mo/yr)'],
            ].map(([l, v]) => (
              <div key={l} className="px-4 py-2 border-b border-[var(--border)] flex justify-between last:border-0">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">{l}</span>
                <span className="text-[11px] font-black text-[var(--primary)]">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              Monthly PF deduction: <strong>{fmt(r.monthlyPF)}</strong> total (employee + employer).
            </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Retirement Fund</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">{fmt(r.total)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">after {years} years</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Accumulated PF (with interest)</span>
              <span className="text-sm font-black text-[var(--primary)]">{fmt(r.totalPF)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Gratuity</span>
              <span className="text-sm font-black text-[#006600]">{fmt(r.totalGratuity)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Monthly PF (20%)</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(r.monthlyPF)}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the PF contribution rate in Nepal?', answer: '10% from employee + 10% from employer = 20% of basic monthly salary, as per Nepal Labor Act 2074.' },
          { question: 'How is gratuity calculated?', answer: 'Gratuity = 8.33% of basic salary per month, equivalent to approximately 1 month\'s basic salary per year of service.' },
          { question: 'Where is PF deposited?', answer: 'PF is deposited in the Employees\' Provident Fund (Karmachari Sanchaya Kosh) or Social Security Fund (SSF) for private sector employees.' },
        ]} />
      }
    />
  );
}
