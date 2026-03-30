'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(1); // 1=yearly, 2=semi, 4=quarterly, 12=monthly

  const debP = useDebounce(principal, 300);
  const debR = useDebounce(rate, 300);
  const debY = useDebounce(years, 300);

  const result = useMemo(() => {
    const p = debP;
    const r = debR / 100;
    const t = debY;
    const n = compounding;

    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;

    let schedule = [];
    for (let i = 1; i <= t; i++) {
      const yearAmount = p * Math.pow(1 + r / n, n * i);
      const yearInterest = yearAmount - p;
      schedule.push({
        year: i,
        principal: p,
        interest: yearInterest,
        balance: yearAmount
      });
    }

    return { amount, interest, schedule };
  }, [debP, debR, debY, compounding]);

  return (
    <>
      <JsonLd type="calculator"
        name="Compound Interest Calculator Nepal"
        description="Calculate compound interest on your savings or investments in Nepal. Supports monthly, quarterly, and yearly compounding."
        url="https://calcpro.com.np/calculator/compound-interest" />

      <CalcWrapper
        title="Compound Interest Calculator"
        description="Calculate how your money grows over time with compound interest. See the power of compounding with yearly growth schedule."
        crumbs={[{label:'finance',href:'/calculator?cat=finance'}, {label:'compound interest'}]}
        relatedCalcs={[
          {name:'SIP Calculator',slug:'sip-calculator'},
          {name:'Fixed Deposit',slug:'fd-calculator'},
          {name:'Simple Interest',slug:'simple-interest'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initial Investment</label>
                <span className="text-sm font-semibold text-blue-600">NPR {fmt(principal)}</span>
              </div>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" pattern="[0-9]*" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={10000} max={10000000} step={10000} value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interest Rate (Yearly)</label>
                <span className="text-sm font-semibold text-blue-600">{rate}%</span>
              </div>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="decimal" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={1} max={30} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Period (Years)</label>
                <span className="text-sm font-semibold text-blue-600">{years} Years</span>
              </div>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" pattern="[0-9]*" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Compounding Frequency</label>
              <select value={compounding} onChange={e => setCompounding(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 bg-white min-h-[44px] text-gray-900 bg-white">
                <option value={1}>Annually (1/year)</option>
                <option value={2}>Semi-Annually (2/year)</option>
                <option value={4}>Quarterly (4/year)</option>
                <option value={12}>Monthly (12/year)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg shadow-blue-900/20">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">Total Amount</div>
              <div className="text-4xl font-bold font-mono mb-2">NPR {fmt(result.amount)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Principal</div>
                <div className="text-sm font-semibold text-gray-900">NPR {fmt(debP)}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Interest</div>
                <div className="text-sm font-semibold text-green-600">NPR {fmt(result.interest)}</div>
              </div>
            </div>

            <ShareResult 
              title="Compound Interest Estimate" 
              result={`NPR ${fmt(result.amount)}`} 
              calcUrl={`https://calcpro.com.np/calculator/compound-interest?p=${principal}&r=${rate}&y=${years}&c=${compounding}`} 
            />
          </div>
        </div>

        {result.schedule.length > 0 && (
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Yearly Growth Schedule</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <th className="text-center px-4 py-3">Year</th>
                    <th className="px-4 py-3">Principal</th>
                    <th className="px-4 py-3">Total Interest</th>
                    <th className="px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50/50 transition-colors">
                      <td className="text-center px-4 py-3 text-gray-700 font-medium">{row.year}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{fmt(row.principal)}</td>
                      <td className="px-4 py-3 font-mono text-green-600">+{fmt(row.interest)}</td>
                      <td className="px-4 py-3 font-mono text-gray-900 font-bold">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <CalcFAQ faqs={[
          {
            question: 'What is compound interest?',
            answer: 'Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It is essentially "interest on interest".',
          },
          {
            question: 'How does compounding frequency affect my returns?',
            answer: 'The more frequently interest is compounded, the higher the final amount will be. For example, monthly compounding will result in a slightly higher amount than yearly compounding for the same interest rate and time period.',
          },
          {
            question: 'What is the formula for compound interest?',
            answer: 'The formula is A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual interest rate, n is the number of times interest is compounded per year, and t is the number of years.',
          },
          {
            question: 'Is compound interest better than simple interest?',
            answer: 'For an investor, compound interest is always better because it allows your money to grow faster. For a borrower, simple interest is usually cheaper as you only pay interest on the original amount borrowed.',
          },
          {
            question: 'Where can I get compound interest in Nepal?',
            answer: 'In Nepal, savings accounts, fixed deposits (FD), and mutual funds typically offer compound interest. Banks usually compound interest quarterly (4 times a year).',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
