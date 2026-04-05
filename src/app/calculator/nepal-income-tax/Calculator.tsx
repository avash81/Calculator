'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { TAX_YEARS, DEDUCTIONS } from '@/config/tax-config';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Info, Receipt, Wallet } from 'lucide-react';

const DEFAULT_STATE = {
  fiscalYear: '2082/83' as keyof typeof TAX_YEARS,
  income: 1500000,
  married: false,
  lifeInsurance: 50000,
  homeLoanInterest: 0,
  educationAllowance: 0,
};

import { calculateNepalIncomeTax } from '@/utils/math/country-rules/nepal';

function calculateIncomeTax(income: number, fiscalYear: string, deductions: Record<string, number>, married: boolean) {
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const result = calculateNepalIncomeTax(income - totalDeductions, married, false);

  return { 
    totalTax: Math.round(result.totalTax), 
    taxableIncome: result.taxableIncome, 
    breakdown: result.breakdown.map(b => ({
      slab: b.slabLabel,
      income: b.taxableInSlab,
      tax: b.taxAmount,
      rate: b.rate
    })), 
    totalDeductions 
  };
}

export default function NepalIncomeTaxCalculator() {
  const [state, setState] = useLocalStorage('calcpro_tax_v2', DEFAULT_STATE);
  const { fiscalYear, income, married, lifeInsurance, homeLoanInterest, educationAllowance } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const presets = [
    { name: 'Standard Employee', description: 'Avg income, simple life insurance', icon: 'briefcase', values: { income: 900000, married: false, lifeInsurance: 25000, homeLoanInterest: 0 } },
    { name: 'Family & Home', description: 'Married + Home loan interest', icon: 'home', values: { income: 1500000, married: true, lifeInsurance: 40000, homeLoanInterest: 150000 } },
    { name: 'High Earner', description: 'Maximum deductions applied', icon: 'target', values: { income: 5000000, married: true, lifeInsurance: 40000, homeLoanInterest: 300000 } },
  ];

  const deductions = useMemo(() => ({
    life_insurance: Math.min(lifeInsurance, DEDUCTIONS.life_insurance.limit as number),
    home_loan_interest: homeLoanInterest,
    education_allowance: educationAllowance,
  }), [lifeInsurance, homeLoanInterest, educationAllowance]);

  const result = useMemo(() => calculateIncomeTax(income, fiscalYear, deductions, married), [income, fiscalYear, deductions, married]);

  const formatNPR = (n: number) =>
    new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <CalculatorErrorBoundary calculatorName="Income Tax">
      <CalculatorLayout
        title="Nepal Income Tax Calculator"
        description="Calculate your personal income tax for FY 2082/83 based on IRD Nepal tax slabs and deductions."
        badge="Nepal Exclusive"
        badgeColor="red"
        category={{ label: 'Nepal Sanchar', href: '/calculator/category/nepal' }}
        leftPanel={
          <div className="space-y-8">
            <QuickPresets presets={presets as any[]} onSelect={(p) => updateState(p.values)} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Fiscal Year</label>
                <select
                  value={fiscalYear}
                  onChange={(e) => updateState({ fiscalYear: e.target.value as keyof typeof TAX_YEARS })}
                  className="w-full h-12 px-4 border border-[var(--border)] rounded-xl bg-[var(--bg-subtle)] focus:border-[var(--primary)] outline-none text-sm font-bold"
                >
                  {Object.values(TAX_YEARS).map((year) => <option key={year.year} value={year.year}>{year.label}</option>)}
                </select>
              </div>
              <ValidatedInput label="Annual Income (NPR)" value={income} onChange={(v) => updateState({ income: v })} min={0} max={100000000} step={100000} />
            </div>

            <div className="pt-6 border-t border-[var(--border)] space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Deductions & Status</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ValidatedInput label="Life Insurance" value={lifeInsurance} onChange={(v) => updateState({ lifeInsurance: v })} min={0} max={100000} />
                  <ValidatedInput label="Home Loan Interest" value={homeLoanInterest} onChange={(v) => updateState({ homeLoanInterest: v })} min={0} max={1000000} />
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Marital Status</label>
                    <div className="flex p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)]">
                      {[{ v: false, l: 'Single' }, { v: true, l: 'Married' }].map((m) => (
                        <button
                          key={m.l}
                          onClick={() => updateState({ married: m.v })}
                          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                            married === m.v ? 'bg-[var(--bg-surface)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {m.l}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        }
        rightPanel={
          <div className="space-y-8">
            {result.totalTax !== undefined ? (
              <>
                <div className="text-center p-6 bg-white rounded-2xl border border-[var(--primary)]/10 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Estimated Tax Liability</div>
                  <div className="text-4xl font-black text-[var(--primary)] tracking-tighter mb-1">{formatNPR(result.totalTax)}</div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Effective Rate: {((result.totalTax / (income || 1)) * 100).toFixed(2)}%</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="w-4 h-4 text-[var(--primary)]" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Slab Breakdown</h4>
                  </div>
                  <div className="space-y-3">
                    {result.breakdown?.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-[var(--text-secondary)]">{item.slab} ({item.rate}%)</span>
                          <span className="text-[var(--text-main)] uppercase">{formatNPR(item.tax)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--primary)]/5 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-[var(--primary)] transition-all duration-1000" 
                            style={{ width: `${(item.tax / (result.totalTax || 1)) * 100}%` }}
                           />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--primary)]/10 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <Wallet className="w-4 h-4 text-[var(--success)]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">In Hand Income</span>
                   </div>
                   <span className="text-xl font-black text-[var(--success)]">{formatNPR(income - result.totalTax)}</span>
                </div>
              </>
            ) : (
              <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium border border-rose-100">
                {(result as any).error}
              </div>
            )}
          </div>
        }
        faqSection={
          <CalcFAQ
            faqs={[
              { question: 'What is individual Tax threshold in Nepal?', answer: 'For FY 2082/83, the non-taxable limit is ₹5,00,000 for individual and ₹6,00,000 for married taxpayers.' },
              { question: 'How is effective tax calculated?', answer: 'Effective tax rate is the total tax amount divided by your gross annual income.' }
            ]}
          />
        }
      />
    </CalculatorErrorBoundary>
  );
}
