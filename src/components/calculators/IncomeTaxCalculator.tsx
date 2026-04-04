'use client';

import { useState, useMemo } from 'react';
import { Landmark, Wallet, Receipt, TrendingDown } from 'lucide-react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { calculateNepalIncomeTax } from '@/utils/math/country-rules/nepal';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [status, setStatus] = useState<'single' | 'married'>('single');
  const [ssf, setSsf] = useState(true);

  const results = useMemo(() => {
    const res = calculateNepalIncomeTax(income, status === 'married', ssf);
    return {
      netIncome: res.grossIncome - res.totalTax,
      totalTax: res.totalTax,
      breakdown: res.breakdown.map(s => ({
        rate: s.rate,
        amount: s.taxableInSlab,
        tax: s.taxAmount
      }))
    };
  }, [income, status, ssf]);

  const faqs = [
    {
      question: "What are the tax slabs for FY 2082/83 in Nepal?",
      answer: "For individuals, the first Rs. 500,000 (Single) or Rs. 600,000 (Married) is taxed at 1%. However, if you are enrolled in SSF, this 1% is exempted. Subsequent slabs are 10%, 20%, 30%, 36%, and 39%."
    },
    {
      question: "How does SSF affect my income tax?",
      answer: "Social Security Fund (SSF) enrollment provides a 1% tax exemption on the first slab of your income. Additionally, contributions to SSF are deductible from your taxable income up to certain limits."
    }
  ];

  return (
    <CalculatorLayout
      title="Nepal Income Tax Calculator"
      description="Plan your finances with the latest Nepal Income Tax rules for FY 2082/83. Includes SSF exemptions and marital status benefits."
      category={{ label: "Nepal Tools", href: "/calculator/category/nepal" }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4">
            <ValidatedInput 
              label="Annual Gross Income (NPR)" 
              value={income} 
              onChange={(v) => setIncome(Number(v))} 
              min={1000} max={50000000} step={1000} required 
            />
            
            <div className="space-y-2 px-1">
              <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">Marital Status</label>
              <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] p-1">
                {(['single', 'married'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${
                      status === s ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)]">
              <div className="space-y-0.5">
                <div className="text-[13px] font-bold text-[var(--text-main)]">SSF Enrollment</div>
                <div className="text-[11px] text-[var(--text-muted)] leading-tight">1% slab exemption applies.</div>
              </div>
              <button 
                onClick={() => setSsf(!ssf)}
                className={`w-12 h-6 rounded-full transition-colors relative ${ssf ? 'bg-[var(--success)]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ssf ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-8">
          <div className="text-center p-6 bg-white border border-[var(--border)]">
            <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Net Annual Take-Home</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">Rs. {results.netIncome.toLocaleString()}</div>
            <div className="text-xs font-bold text-red-600 uppercase tracking-tight">Tax Liability: Rs. {results.totalTax.toLocaleString()}</div>
          </div>

          <div className="space-y-4">
             <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-main)] px-1">Annual Tax Breakdown</div>
             <div className="border border-[var(--border)] overflow-hidden">
                {results.breakdown.map((slab, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white border-b border-[var(--border)] last:border-b-0">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tight">{slab.rate}% Tax Slab</div>
                      <div className="text-[11px] text-[var(--text-muted)]">On next Rs. {slab.amount.toLocaleString()}</div>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-main)]">
                      Rs. {slab.tax.toLocaleString()}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Monthly Take-Home</span>
            <span className="text-lg font-black text-[var(--primary)]">Rs. {Math.round(results.netIncome / 12).toLocaleString()}</span>
          </div>
        </div>
      }
      faqSection={<CalcFAQ faqs={faqs} />}
    />
  );
}
