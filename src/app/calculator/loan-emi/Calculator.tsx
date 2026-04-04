'use client';
import { useMemo, useCallback } from 'react';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { safeCalculateEMI } from '@/utils/math/safeCalculations';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';

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

  const result = useMemo(() => {
    return safeCalculateEMI(principal, rate, tenure, method);
  }, [principal, rate, tenure, method]);

  const feeAmount = useMemo(() => Math.round((fee / 100) * principal), [fee, principal]);
  const totalWithFee = useMemo(() => {
    if (!result.success || !result.data) return 0;
    return Math.round(result.data.totalPayment + feeAmount);
  }, [result, feeAmount]);

  const formatNPR = (n: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(n);
  };

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
      <CalculatorLayout
        title="Loan EMI Calculator"
        description="Verify your personal, home, or auto loan monthly repayment amount. Plan your finances with precision."
        badge="Finance"
        badgeColor="indigo"
        category={{ label: 'Finance', href: '/calculator/category/finance' }}
        leftPanel={
          <div className="space-y-8 text-left">
            <QuickPresets presets={LOAN_PRESETS} onSelect={handlePresetSelect} />
            
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-main)] px-1">Interest Calculation Method</div>
              <div className="flex p-1 bg-[var(--bg-surface)] border border-[var(--border)]">
                {['reducing', 'flat'].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateState({ method: m as 'reducing' | 'flat' })}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-tight transition-all ${
                      method === m ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {m} Balance
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ValidatedInput label="Loan Amount (NPR)" value={principal} onChange={(v) => updateState({ principal: v })} min={10000} max={500000000} step={50000} required />
              <ValidatedInput label="Interest Rate (%)" value={rate} onChange={(v) => updateState({ rate: v })} min={0.1} max={40} step={0.1} required />
              <ValidatedInput label="Loan Tenure (Years)" value={tenure} onChange={(v) => updateState({ tenure: v })} min={1} max={50} required />
              <ValidatedInput label="Processing Fee (%)" value={fee} onChange={(v) => updateState({ fee: v })} min={0} max={10} step={0.1} />
            </div>
          </div>
        }
        rightPanel={
          <div className="space-y-8">
            {result.success && result.data ? (
              <>
                <div className="text-center p-6 bg-white border border-[var(--border)]">
                  <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Monthly EMI Payment</div>
                  <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">{formatNPR(result.data.emi)}</div>
                  <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight">per month for {tenure} years</div>
                </div>

                <div className="space-y-4 bg-white/40 p-6 border border-[var(--primary)]/10">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-bold text-[var(--text-secondary)] uppercase text-xs">Total Interest Paid</span>
                    <span className="font-bold text-[var(--text-main)]">{formatNPR(result.data.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                     <span className="font-bold text-[var(--text-secondary)] uppercase text-xs">Total Payment (P + I)</span>
                     <span className="font-bold text-[var(--text-main)]">{formatNPR(result.data.totalPayment)}</span>
                  </div>
                  <div className="pt-4 border-t border-[var(--primary)]/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--primary)] uppercase">Grand Total (Incl. Fees)</span>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[var(--primary)]">{formatNPR(totalWithFee)}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Visual - Classic Steel Blue */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight text-[var(--text-main)]">
                    <span>Principal {Math.round((principal / result.data.totalPayment) * 100)}%</span>
                    <span>Interest {Math.round((result.data.totalInterest / result.data.totalPayment) * 100)}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 overflow-hidden flex">
                    <div 
                      className="h-full bg-[var(--primary)] transition-all duration-500" 
                      style={{ width: `${(principal / result.data.totalPayment) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-[var(--accent)] transition-all duration-500" 
                      style={{ width: `${(result.data.totalInterest / result.data.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-50 text-red-600 font-bold text-xs border border-red-200">
                {result.error || 'Please enter valid loan inputs.'}
              </div>
            )}
          </div>
        }
        faqSection={
           <CalcFAQ
              faqs={[
                {
                  question: 'Reducing vs Flat Rate: Which is better?',
                  answer: 'Reducing balance is almost always better for the borrower. Interest is only charged on the outstanding balance. Flat rate charges interest on the original loan amount for the entire period, making it much more expensive in reality.'
                },
                {
                  question: 'Can I pay off my loan early in Nepal?',
                  answer: 'Most A, B, and C class banks in Nepal allow partial or full prepayment. However, be aware of "Prepayment Fees" which typically range from 0.5% to 2% of the principal being paid early.'
                }
              ]}
           />
        }
      />
    </CalculatorErrorBoundary>
  );
}
