'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TAX_YEARS } from '@/config/tax-config';
import { Wallet, Landmark, TrendingUp, Info, PieChart } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const DEFAULT_STATE = {
  fiscalYear: '2082/83' as keyof typeof TAX_YEARS,
  basic: 60000,
  allowance: 15000,
  married: false,
  ssf: true,
  cit: false,
  citAmount: 5000,
};

export default function NepalSalaryCalculator() {
  const [state, setState] = useLocalStorage('calcpro_salary_v2', DEFAULT_STATE);
  const { fiscalYear, basic, allowance, married, ssf, cit, citAmount } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const calculation = useMemo(() => {
    const grossMonthly = basic + allowance;
    const grossAnnual = grossMonthly * 12;

    // Deductions
    const ssfEmployee = ssf ? Math.round(basic * 0.11) : 0;
    const ssfEmployer = ssf ? Math.round(basic * 0.20) : 0;
    const citDeduction = cit ? citAmount : 0;

    const totalMonthlyDeductions = ssfEmployee + citDeduction;
    const annualTaxableIncome = (grossMonthly - totalMonthlyDeductions) * 12;

    // Tax Logic (Using centralized config via country-rules)
    const { calculateNepalIncomeTax } = require('@/utils/math/country-rules/nepal');
    const taxResult = calculateNepalIncomeTax(annualTaxableIncome, married, ssf);

    const annualTax = taxResult.totalTax;
    const monthlyTax = Math.round(annualTax / 12);
    const netMonthly = grossMonthly - totalMonthlyDeductions - monthlyTax;
    const ctcMonthly = grossMonthly + ssfEmployer;

    return {
      grossMonthly,
      grossAnnual,
      ssfEmployee,
      ssfEmployer,
      citDeduction,
      monthlyTax,
      annualTax,
      netMonthly,
      ctcMonthly,
      effectiveTaxRate: (annualTax / grossAnnual) * 100
    };
  }, [fiscalYear, basic, allowance, married, ssf, cit, citAmount]);

  const formatNPR = (n: number) =>
    new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <CalculatorErrorBoundary calculatorName="Nepal Salary">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
             Employee Benefits
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Take-Home <span className="text-emerald-600">Salary</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Calculate your exact in-hand income after SSF, CIT, and Income Tax deductions based on the latest 2082/83 budget.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ValidatedInput label="Monthly Basic Salary" value={basic} onChange={(v) => updateState({ basic: v })} prefix="NPR" step={500} required />
              <ValidatedInput label="Monthly Allowances" value={allowance} onChange={(v) => updateState({ allowance: v })} prefix="NPR" step={500} />
            </div>

            {/* Deductions Toggle Section */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Retirement & Savings</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SSF Toggle */}
                  <button 
                    onClick={() => updateState({ ssf: !ssf })}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${ssf ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${ssf ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                           <Landmark className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <div className="text-sm font-black uppercase text-gray-900 dark:text-gray-100">SSF Contributor</div>
                           <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">11% Combined Contribution</div>
                        </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-all ${ssf ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ssf ? 'right-1' : 'left-1'}`} />
                     </div>
                  </button>

                  {/* CIT Toggle */}
                  <button 
                    onClick={() => updateState({ cit: !cit })}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${cit ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}`}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${cit ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                           <Wallet className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <div className="text-sm font-black uppercase text-gray-900 dark:text-gray-100">CIT / Provident</div>
                           <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Optional Regular Savings</div>
                        </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-all ${cit ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cit ? 'right-1' : 'left-1'}`} />
                     </div>
                  </button>
               </div>

               {cit && (
                 <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                    <ValidatedInput 
                      label="Monthly CIT Contribution" 
                      value={citAmount} 
                      onChange={(v) => updateState({ citAmount: v })}
                      prefix="NPR"
                      hint="Total monthly savings"
                    />
                 </div>
               )}
            </div>

            {/* Fiscal Year & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Fiscal Year</label>
                  <select 
                    value={fiscalYear}
                    onChange={(e) => updateState({ fiscalYear: e.target.value as any })}
                    className="w-full h-14 bg-gray-50 dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-6 font-bold outline-none focus:border-emerald-500 transition-all"
                  >
                     <option value="2082/83">2082/83 (Latest)</option>
                     <option value="2083/84">2083/84 (Projected)</option>
                  </select>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Marital Status</label>
                  <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                     {[
                       { v: false, l: 'Single' },
                       { v: true, l: 'Married' }
                     ].map(opt => (
                       <button
                        key={opt.l}
                        onClick={() => updateState({ married: opt.v })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${married === opt.v ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                       >
                         {opt.l}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
             <ResultCard
                label="Monthly In-Hand Salary"
                value={calculation.netMonthly}
                unit=" / mo"
                color="green"
                title="Disposable Income"
                copyValue={`My monthly net salary: ${formatNPR(calculation.netMonthly)}`}
             />

             <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-5 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800 pb-3">Monthly Outflow</div>
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 uppercase">Gross Salary</span>
                      <span className="text-gray-900 dark:text-white font-black">{formatNPR(calculation.grossMonthly)}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 uppercase">Total Tax</span>
                      <span className="text-rose-600 font-black">-{formatNPR(calculation.monthlyTax)}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-400 uppercase">SSF Contribution</span>
                      <span className="text-rose-600 font-black">-{formatNPR(calculation.ssfEmployee)}</span>
                   </div>
                   {cit && (
                     <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400 uppercase">CIT Savings</span>
                        <span className="text-rose-600 font-black">-{formatNPR(calculation.citDeduction)}</span>
                     </div>
                   )}
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                   <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Net Salary</span>
                   <span className="text-2xl font-black text-emerald-600 tracking-tighter">{formatNPR(calculation.netMonthly)}</span>
                </div>
             </div>

             <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-blue-400" />
                   <h3 className="text-sm font-black uppercase tracking-widest">Employer cost (CTC)</h3>
                </div>
                <div className="text-3xl font-black tracking-tighter">{formatNPR(calculation.ctcMonthly)}</div>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                   This includes yours gross plus the 20% employer SSF contribution.
                </p>
             </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'How is the 11% SSF contribution calculated?',
                  answer: 'The 11% contribution is calculated on your Basic Salary, not your Total Gross (which includes allowances). Your employer also contributes an additional 20% of your basic salary to the fund.'
                },
                {
                  question: 'Does CIT contribution reduce my tax liability?',
                  answer: 'Yes. Any amount contributed to the Citizen Investment Trust (CIT) or Employee Provident Fund (EPF) is subtracted from your gross income before tax slabs are applied, potentially lowering your tax bracket.'
                },
                {
                  question: 'Is the 1% Social Security Tax always applicable?',
                  answer: 'In Nepal, the first 1% tax slab is often waived for employees who are regular contributors to the SSF system, according to the latest IRD directive.'
                }
              ]}
           />
        </div>

      </div>
    </CalculatorErrorBoundary>
  );
}
