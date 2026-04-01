'use client';
import { useMemo, useCallback } from 'react';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { safeCalculateEMI } from '@/utils/math/safeCalculations';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const LOAN_PRESETS: any[] = [
  {
    name: 'Personal Loan',
    description: 'NPR 5 Lakh @ 12%',
    icon: 'briefcase',
    values: { principal: 500000, rate: 12, tenure: 3, method: 'reducing' },
  },
  {
    name: 'Home Loan',
    description: 'NPR 50 Lakh @ 8.5%',
    icon: 'home',
    values: { principal: 5000000, rate: 8.5, tenure: 20, method: 'reducing' },
  },
  {
    name: 'Auto Loan',
    description: 'NPR 25 Lakh @ 10%',
    icon: 'car',
    values: { principal: 1500000, rate: 10, tenure: 5, method: 'reducing' },
  },
  {
    name: 'Education',
    description: 'NPR 10 Lakh @ 9%',
    icon: 'graduation',
    values: { principal: 1000000, rate: 9, tenure: 10, method: 'reducing' },
  },
];

const DEFAULT_STATE = {
  principal: 1000000,
  rate: 11.5,
  tenure: 15,
  method: 'reducing' as 'reducing' | 'flat',
  fee: 1,
};

export default function LoanEMICalculator() {
  const [state, setState] = useLocalStorage('calcpro_emi_v2', DEFAULT_STATE);

  const { principal, rate, tenure, method, fee } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  // Safe calculation
  const result = useMemo(() => {
    return safeCalculateEMI(principal, rate, tenure, method);
  }, [principal, rate, tenure, method]);

  // Add fee to principal for total cost
  const feeAmount = useMemo(() => {
    return Math.round((fee / 100) * principal);
  }, [fee, principal]);

  const totalWithFee = useMemo(() => {
    if (!result.success || !result.data) return 0;
    return Math.round(result.data.totalPayment + feeAmount);
  }, [result, feeAmount]);

  // Format currency
  const formatNPR = (n: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(n);
  };

  // Preset handler
  const handlePresetSelect = useCallback((preset: any) => {
    updateState({
      principal: preset.values.principal,
      rate: preset.values.rate,
      tenure: preset.values.tenure,
      method: preset.values.method
    });
  }, [state, setState]);

  return (
    <CalculatorErrorBoundary calculatorName="Loan EMI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             Finance Suite
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Loan EMI <span className="text-blue-600">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
            Plan your personal, home, or auto loan repayment with our advanced reducing balance and flat rate engine.
          </p>
        </div>

        {/* Quick Presets */}
        <QuickPresets
          presets={LOAN_PRESETS}
          onSelect={handlePresetSelect}
        />

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            {/* Method Toggle */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  Interest Method
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  Recommended: Reducing
                </span>
              </div>
              <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-3xl border border-gray-100 dark:border-gray-800">
                {['reducing', 'flat'].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateState({ method: m as 'reducing' | 'flat' })}
                    className={`flex-1 py-4 rounded-[1.25rem] text-sm font-black uppercase tracking-widest transition-all ${
                      method === m
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-600'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {m} Balance
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ValidatedInput
                label="Loan Amount"
                value={principal}
                onChange={(v) => updateState({ principal: v })}
                min={10000}
                max={500000000} // 50Cr max
                step={50000}
                prefix="NPR"
                formatter={(n) => formatNPR(n)}
                hint="Principal amount"
                required
              />

              <ValidatedInput
                label="Interest Rate"
                value={rate}
                onChange={(v) => updateState({ rate: v })}
                min={0}
                max={40}
                step={0.1}
                suffix="%"
                hint="Per Annum (%)"
                required
              />

              <ValidatedInput
                label="Loan Tenure"
                value={tenure}
                onChange={(v) => updateState({ tenure: v })}
                min={1}
                max={50}
                step={1}
                suffix="Years"
                hint="Repayment period"
                required
              />

               <ValidatedInput
                label="Processing Fee"
                value={fee}
                onChange={(v) => updateState({ fee: v })}
                min={0}
                max={10}
                step={0.1}
                suffix="%"
                formatter={(n) => formatNPR((n / 100) * principal)}
                hint="Typically 0.5% - 2%"
              />
            </div>
          </div>

          {/* Result Panel */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {result.success && result.data ? (
              <>
                <ResultCard
                  label="Estimated Monthly EMI"
                  value={result.data.emi}
                  unit=" / mo"
                  color="blue"
                  title="Loan EMI"
                  copyValue={`Monthly EMI: ${formatNPR(result.data.emi)}`}
                />

                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Total Interest</span>
                    <span className="font-black text-gray-900 dark:text-white">{formatNPR(result.data.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Total Repayment</span>
                    <span className="font-black text-gray-900 dark:text-white">{formatNPR(result.data.totalPayment)}</span>
                  </div>
                  {fee > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Processing Fee</span>
                      <span className="font-black text-blue-600">{formatNPR(feeAmount)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[11px]">Total Cost</span>
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">{formatNPR(totalWithFee)}</span>
                  </div>
                </div>

                {/* VISUAL BREAKDOWN */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Principal</span>
                      <span>Interest</span>
                   </div>
                   <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex gap-0.5">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-700" 
                        style={{ width: `${(principal / result.data.totalPayment) * 100}%` }}
                      />
                      <div 
                        className="h-full bg-blue-300 dark:bg-blue-800 transition-all duration-700" 
                        style={{ width: `${(result.data.totalInterest / result.data.totalPayment) * 100}%` }}
                      />
                   </div>
                   <p className="text-[10px] text-center text-gray-400 font-bold">
                      Interest makes up {Math.round((result.data.totalInterest / result.data.totalPayment) * 100)}% of your total repayment.
                   </p>
                </div>
              </>
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                <p className="font-black uppercase tracking-widest text-xs">Error Found</p>
                <p className="font-bold">{result.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'Reducing vs Flat Rate: Which is better?',
                  answer: 'Reducing balance is almost always better for the borrower. Interest is only charged on the outstanding balance. Flat rate charges interest on the original loan amount for the entire period, making it much more expensive in reality.'
                },
                {
                  question: 'Can I pay off my loan early in Nepal?',
                  answer: 'Most A, B, and C class banks in Nepal allow partial or full prepayment. However, be aware of "Prepayment Fees" which typically range from 0.5% to 2% of the principal being paid early.'
                },
                {
                  question: 'How do processing fees affect my loan?',
                  answer: 'Processing fees are one-time costs paid upfront. While they don\'t change your monthly EMI, they increase the "Total Cost of Loan". It is often better to pay a slightly higher interest rate with zero fees than a low rate with high fees.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
