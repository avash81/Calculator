'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { TAX_YEARS, DEDUCTIONS } from '@/config/tax-config';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const DEFAULT_STATE = {
  fiscalYear: '2082/83' as keyof typeof TAX_YEARS,
  income: 1500000,
  married: false,
  lifeInsurance: 50000,
  homeLoanInterest: 0,
  educationAllowance: 0,
};

function calculateIncomeTax(income: number, fiscalYear: string, deductions: Record<string, number>, married: boolean) {
  const yearConfig = TAX_YEARS[fiscalYear as keyof typeof TAX_YEARS];
  if (!yearConfig) return { error: 'Invalid fiscal year' };

  // Calculate total deductions
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const taxableIncome = Math.max(0, income - totalDeductions);

  let totalTax = 0;
  const breakdown: Array<{ slab: string; income: number; tax: number; rate: number }> = [];

  for (const slab of yearConfig.slabs) {
    if (taxableIncome <= slab.min) break;

    const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
    const slabTax = slabIncome * slab.rate;

    breakdown.push({
      slab: slab.label,
      income: slabIncome,
      tax: slabTax,
      rate: slab.rate * 100,
    });

    totalTax += slabTax;
  }

  return { 
    totalTax: Math.round(totalTax), 
    taxableIncome, 
    breakdown,
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

  const deductions = useMemo(
    () => ({
      life_insurance: Math.min(lifeInsurance, DEDUCTIONS.life_insurance.limit as number),
      home_loan_interest: homeLoanInterest,
      education_allowance: educationAllowance,
    }),
    [lifeInsurance, homeLoanInterest, educationAllowance]
  );

  const result = useMemo(() => {
    return calculateIncomeTax(income, fiscalYear, deductions, married);
  }, [income, fiscalYear, deductions, married]);

  const formatNPR = (n: number) =>
    new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <CalculatorErrorBoundary calculatorName="Income Tax">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
             Policy Compliant
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Tax <span className="text-rose-600">Optimizer</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Comprehensive income tax planning for FY 2082/83. Calculate your liability across all slabs with advanced deductible tracking.
          </p>
        </div>

        {/* Quick Presets */}
        <QuickPresets 
           presets={presets as any[]} 
           onSelect={(p) => updateState(p.values)} 
        />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Fiscal Year Selector */}
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">
                  Fiscal Year
                </label>
                <select
                  value={fiscalYear}
                  onChange={(e) => updateState({ fiscalYear: e.target.value as keyof typeof TAX_YEARS })}
                  className="w-full h-14 px-6 py-3 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 focus:border-rose-500 outline-none text-lg font-bold transition-all"
                >
                  {Object.values(TAX_YEARS).map((year) => (
                    <option key={year.year} value={year.year}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Annual Income */}
              <ValidatedInput
                label="Total Annual Income"
                value={income}
                onChange={(v) => updateState({ income: v })}
                min={0}
                max={100000000}
                step={100000}
                prefix="NPR"
                formatter={(n) => formatNPR(n)}
                hint="Salary + Other Sources"
                required
              />
            </div>

            {/* Deductions Section */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                  <span className="font-black text-xs">📋</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Tax Deductions (Exemptions)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ValidatedInput
                  label="Life Insurance Premium"
                  value={lifeInsurance}
                  onChange={(v) => updateState({ lifeInsurance: v })}
                  min={0}
                  max={100000}
                  prefix="NPR"
                  hint="Max ₹1 Lakh/year"
                />

                <ValidatedInput
                  label="Home Loan Interest"
                  value={homeLoanInterest}
                  onChange={(v) => updateState({ homeLoanInterest: v })}
                  min={0}
                  max={5000000}
                  prefix="NPR"
                  hint="First Home Only"
                />

                <ValidatedInput
                  label="Education Allowance"
                  value={educationAllowance}
                  onChange={(v) => updateState({ educationAllowance: v })}
                  min={0}
                  max={1000000}
                  prefix="NPR"
                  hint="Dependent Children"
                />

                {/* Marital Status Toggle */}
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">
                    Marital Status
                  </label>
                  <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-100 dark:border-gray-800">
                    {[
                      { value: false, label: 'Single' },
                      { value: true, label: 'Married' },
                    ].map(({ value, label }) => (
                      <button
                        key={label}
                        onClick={() => updateState({ married: value })}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          married === value
                            ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm border border-gray-100 dark:border-gray-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {result.totalTax !== undefined ? (
              <>
                <ResultCard
                  label="Estimated Tax Liability"
                  value={result.totalTax}
                  unit=" / year"
                  color="red"
                  title="Tax Owed"
                  copyValue={`Total Tax Liability: ${formatNPR(result.totalTax)}`}
                />

                {/* SLAB BREAKDOWN CARD */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-5 shadow-sm">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50 dark:border-gray-800">
                    Annual Tax Breakdown (Slabs)
                  </h4>

                  <div className="space-y-4">
                    {result.breakdown?.map((item, i) => (
                      <div key={i} className="group flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-600 dark:text-gray-400">{item.slab}</span>
                          <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{formatNPR(item.tax)}</span>
                        </div>
                        <div className="h-1 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(item.tax / (result.totalTax || 1)) * 100}%` }}
                           />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[11px]">Total Tax</span>
                    <span className="text-2xl font-black text-rose-600 tracking-tighter">{formatNPR(result.totalTax || 0)}</span>
                  </div>
                </div>

                {/* SUMMARY OVERVIEW */}
                <div className="bg-gray-900 text-white p-8 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase tracking-widest">Effective Tax Rate</span>
                    <span className="font-black text-rose-400">{((result.totalTax / (income || 1)) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase tracking-widest">Net Income (In Hand)</span>
                    <span className="font-black text-emerald-400">{formatNPR(income - result.totalTax)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase tracking-widest">Total Deductions</span>
                    <span className="font-black text-blue-400">{formatNPR(result.totalDeductions)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                <p className="font-black uppercase tracking-widest text-xs">Error Found</p>
                <p className="font-bold">{(result as any).error}</p>
              </div>
            )}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'What is the "1% Social Security Tax" in Nepal?',
                  answer: 'The first 5 Lakhs (for single) or 6 Lakhs (for married) is subject to a 1% social security tax. However, if you contribute to the Social Security Fund (SSF), this 1% is waived.'
                },
                {
                  question: 'How do deductions work in Nepal?',
                  answer: 'Deductions like Life Insurance premiums (up to 1 Lakh) and SSF contributions (up to 3 Lakhs) are subtracted from your gross income before calculating tax. This reduced amount is your "Taxable Income".'
                },
                {
                  question: 'Does marital status affect my tax slabs?',
                  answer: 'Yes. In the FY 2082/83 budget, the first slab for single taxpayers is 5 Lakhs, while for married couples, it is often adjusted to 6 Lakhs. This calculator uses the standard individual and couple thresholds as defined by the IRD.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
