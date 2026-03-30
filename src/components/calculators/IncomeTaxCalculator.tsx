'use client';

import { useState, useMemo } from 'react';
import { Input, Slider, Select, ResultCard, Toggle } from '@/components/ui';
import { calculateNepalIncomeTax } from '@/utils/math/country-rules/nepal';
import { Landmark, Wallet, Receipt, TrendingDown } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

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
    },
    {
      question: "Is the marriage status tax benefit significant?",
      answer: "Yes, married couples have a higher non-taxable threshold (Rs. 600,000) compared to single individuals (Rs. 500,000), which can lead to lower total tax for the same income level."
    }
  ];

  const relatedCalcs = [
    { label: "VAT Calculator", href: "/calculators/nepal/nepal-vat", icon: "🧾", desc: "Calculate VAT for goods and services." },
    { label: "Salary Calculator", href: "/calculators/nepal/nepal-salary", icon: "💸", desc: "Calculate your monthly net salary." },
    { label: "EMI Calculator", href: "/calculators/finance/loan-emi", icon: "🏦", desc: "Calculate monthly EMI for any loan." }
  ];

  return (
    <CalculatorLayout
      title="Nepal Income Tax Calculator"
      description="Calculate your annual and monthly income tax based on the latest IRD rules for FY 2082/83. Includes SSF exemptions and marital status benefits."
      category="Nepal Tools"
      categoryHref="/calculators/nepal"
      focusKeyword="Income Tax Calculator Nepal 2082"
      faqs={faqs}
      relatedCalcs={relatedCalcs}
      isNepal={true}
    >
      {/* Inputs */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Input
            label="Annual Gross Income"
            type="number"
            value={income}
            onChange={(v) => setIncome(Number(v))}
            unit="NPR"
            placeholder="1,200,000"
          />
          <Slider
            value={income}
            min={100000}
            max={10000000}
            step={50000}
            onChange={setIncome}
            label="Adjust Annual Income"
          />
        </div>

        <Select
          label="Marital Status"
          value={status}
          onChange={(v) => setStatus(v as any)}
          options={[
            { label: 'Single', value: 'single' },
            { label: 'Married', value: 'married' },
          ]}
        />

        <Toggle
          label="Enrolled in SSF?"
          description="Social Security Fund enrollment provides 1% tax exemption on the first slab."
          checked={ssf}
          onChange={setSsf}
        />
      </div>

      {/* Results */}
      <div className="space-y-6">
        <ResultCard
          label="Net Take-Home (Annual)"
          value={`Rs. ${results.netIncome.toLocaleString()}`}
          variant="primary"
          icon={<Wallet className="w-5 h-5" />}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Total Tax Payable"
            value={`Rs. ${results.totalTax.toLocaleString()}`}
            variant="danger"
            icon={<TrendingDown className="w-4 h-4" />}
          />
          <ResultCard
            label="Monthly Take-Home"
            value={`Rs. ${Math.round(results.netIncome / 12).toLocaleString()}`}
            variant="success"
            icon={<Landmark className="w-4 h-4" />}
          />
        </div>

        {/* Tax Slabs Breakdown */}
        <div className="mt-8 pt-8 border-t border-cp-divider">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-4 h-4 text-cp-text-light" />
            <h4 className="text-[10px] font-bold text-cp-text-light uppercase tracking-widest">Tax Slab Breakdown</h4>
          </div>
          <div className="space-y-2">
            {results.breakdown.map((slab, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-cp-bg rounded-xl border border-cp-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cp-blue-light flex items-center justify-center text-[10px] font-black text-cp-blue">
                    {slab.rate}%
                  </div>
                  <div className="text-[11px] font-medium text-cp-text-muted">
                    On next Rs. {slab.amount.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs font-bold text-cp-text">
                  Rs. {slab.tax.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
