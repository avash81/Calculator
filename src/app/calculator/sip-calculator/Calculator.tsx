'use client';
import { useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TrendingUp, Wallet, LineChart } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

const DEFAULT_STATE = {
  monthly: 5000,
  rate: 12,
  years: 10,
  stepUp: 10,
};

export default function SIPCalculator() {
  const [state, setState] = useLocalStorage('cp-sip-state', DEFAULT_STATE);

  const updateStore = (key: keyof typeof DEFAULT_STATE, val: any) => {
    setState({ ...state, [key]: val });
  };

  const { monthly, rate, years, stepUp } = state;

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const s = stepUp / 100;

    let fv = 0;
    let totalInvested = 0;
    let schedule = [];
    let currentMonthly = monthly;

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        fv = (fv + currentMonthly) * (1 + r);
        totalInvested += currentMonthly;
      }
      
      schedule.push({
        year,
        invested: totalInvested,
        returns: fv - totalInvested,
        balance: fv
      });

      // Annual step up
      currentMonthly = currentMonthly * (1 + s);
    }

    const returns = fv - totalInvested;
    const wealthGainedPct = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;

    return { fv, totalInvested, returns, wealthGainedPct, schedule };
  }, [monthly, rate, years, stepUp]);

  const invPct = result.fv > 0 ? (result.totalInvested / result.fv) * 100 : 0;
  const retPct = result.fv > 0 ? (result.returns / result.fv) * 100 : 0;

  return (
    <CalculatorErrorBoundary calculatorName="SIP Calculator">
      <JsonLd type="calculator"
        name="SIP Calculator Nepal"
        description="Calculate high-precision SIP returns in Nepal. Supports annual step-up and provides a detailed wealth growth schedule."
        url="https://calcpro.com.np/calculator/sip-calculator" />

      <CalcWrapper
        title="SIP Wealth Suite"
        description="Analyze the long-term growth of your Systematic Investment Plan (SIP). Designed for mutual funds and NEPSE portfolio planning."
        crumbs={[{label:'finance',href:'/calculator?cat=finance'}, {label:'sip calculator'}]}
        isNepal
        relatedCalcs={[
          {name:'Compound Interest',slug:'compound-interest'},
          {name:'EMI Calculator',slug:'loan-emi'},
        ]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
              <div className="space-y-10">
                <ValidatedInput
                  label="Monthly Investment"
                  value={monthly}
                  onChange={v => updateStore('monthly', v)}
                  min={500}
                  max={1000000}
                  prefix="Rs."
                  step={500}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ValidatedInput
                    label="Return Rate (p.a)"
                    value={rate}
                    onChange={v => updateStore('rate', v)}
                    min={1}
                    max={50}
                    suffix="%"
                    step={0.1}
                    required
                  />

                  <ValidatedInput
                    label="Time Period (Years)"
                    value={years}
                    onChange={v => updateStore('years', v)}
                    min={1}
                    max={50}
                    suffix="Yrs"
                    required
                  />
                </div>

                <ValidatedInput
                  label="Annual Step-up (%)"
                  value={stepUp}
                  onChange={v => updateStore('stepUp', v)}
                  min={0}
                  max={100}
                  suffix="%"
                  hint="Increase investment amount every year"
                />
              </div>

              <div className="mt-12 pt-10 border-t border-gray-50 dark:border-gray-800">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Investment Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 25000].map(v => (
                    <button 
                      key={v} 
                      onClick={() => updateStore('monthly', v)} 
                      className={`py-3 rounded-xl border-2 transition-all text-xs font-black ${monthly === v ? 'border-blue-500 bg-blue-50 text-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-300'}`}
                    >
                      Rs. {fmt(v)}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setState(DEFAULT_STATE)} 
                className="w-full h-14 mt-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 hover:text-red-500 transition-all font-black"
              >
                Reset Calculation
              </button>
            </div>

            {result.schedule.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-800 px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yearly Growth Schedule</h3>
                  <div className="text-[8px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Compounded</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[9px] text-gray-400 font-black uppercase tracking-widest">
                        <th className="text-center px-8 py-4">Year</th>
                        <th className="px-8 py-4">Invested</th>
                        <th className="px-8 py-4">Returns</th>
                        <th className="px-8 py-4">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {result.schedule.slice(-10).map((row) => (
                        <tr key={row.year} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors">
                          <td className="text-center px-8 py-4 text-gray-900 dark:text-gray-100 font-black">{row.year}</td>
                          <td className="px-8 py-4 font-mono text-gray-500">{fmt(row.invested)}</td>
                          <td className="px-8 py-4 font-mono text-green-600">+{fmt(row.returns)}</td>
                          <td className="px-8 py-4 font-mono text-gray-900 dark:text-gray-100 font-black">Rs. {fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="Wealth Projection"
              primaryResult={{
                label: 'Est. Future Value',
                value: `Rs. ${fmt(result.fv)}`,
                description: `Wealth gained: ${result.wealthGainedPct.toFixed(1)}%`,
                bgColor: 'bg-blue-600',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Total Invested', value: `Rs. ${fmt(result.totalInvested)}` },
                { label: 'Est. Returns', value: `Rs. ${fmt(result.returns)}` },
                { label: 'Duration', value: `${years} Years` },
                { label: 'Step-up', value: `${stepUp}%/yr` }
              ]}
              onShare={() => {}}
            />

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
               <TrendingUp className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth Ratio</h3>
               <div className="flex justify-between text-[11px] font-black uppercase mb-4">
                  <span className="text-gray-400">Principal ({invPct.toFixed(0)}%)</span>
                  <span className="text-green-500">Wealth ({retPct.toFixed(0)}%)</span>
               </div>
               <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-gray-400 h-full transition-all duration-1000" style={{width: `${invPct}%`}} />
                  <div className="bg-green-500 h-full transition-all duration-1000" style={{width: `${retPct}%`}} />
               </div>
            </div>

            <ShareResult 
              title="SIP Wealth Estimate" 
              result={`Rs. ${fmt(result.fv)}`} 
              calcUrl={`https://calcpro.com.np/calculator/sip-calculator`} 
            />

            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                    <Wallet className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">SIP Goal</div>
                 </div>
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                    <LineChart className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Compound</div>
                 </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is a Systematic Investment Plan (SIP)?', answer: 'SIP is a method of investing in mutual funds where you contribute a fixed amount regularly. It leverages the power of compounding and dollar-cost averaging.' },
            { question: 'how much can I start a SIP with in Nepal?', answer: 'In Nepal, most mutual funds allow you to start a SIP with as little as Rs. 1,000 per month.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
