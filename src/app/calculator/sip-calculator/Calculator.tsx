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

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);

  const debM = useDebounce(monthly, 300);
  const debR = useDebounce(rate, 300);
  const debY = useDebounce(years, 300);
  const debS = useDebounce(stepUp, 300);

  const result = useMemo(() => {
    const r = debR / 12 / 100;
    const s = debS / 100;

    let fv = 0;
    let totalInvested = 0;
    let schedule = [];
    let currentMonthly = debM;

    for (let year = 1; year <= debY; year++) {
      for (let month = 1; month <= 12; month++) {
        // Simple compounding of previous month's value + new investment
        fv = (fv + currentMonthly) * (1 + r);
        totalInvested += currentMonthly;
      }
      
      schedule.push({
        year,
        invested: totalInvested,
        returns: fv - totalInvested,
        balance: fv
      });

      // Apply annual step up
      currentMonthly = currentMonthly * (1 + s);
    }

    const returns = fv - totalInvested;
    const wealthGainedPct = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;

    return { fv, totalInvested, returns, wealthGainedPct, schedule };
  }, [debM, debR, debY, debS]);

  const invPct = result.fv > 0 ? (result.totalInvested / result.fv) * 100 : 0;
  const retPct = result.fv > 0 ? (result.returns / result.fv) * 100 : 0;

  return (
    <>
      <JsonLd type="calculator"
        name="SIP Calculator Nepal"
        description="Calculate the future value of your Systematic Investment Plan (SIP) in Nepal. Best for Mutual Funds and Stock Market investments."
        url="https://calcpro.com.np/calculator/sip-calculator" />

      <CalcWrapper
        title="SIP Calculator"
        description="Calculate the future value of your Systematic Investment Plan (SIP). See how small monthly investments grow over time in Nepal's mutual funds."
        crumbs={[{label:'finance',href:'/calculator?cat=finance'}, {label:'sip calculator'}]}
        relatedCalcs={[
          {name:'Compound Interest',slug:'compound-interest'},
          {name:'EMI Calculator',slug:'loan-emi'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Investment</label>
                <span className="text-sm font-semibold text-blue-600">NPR {fmt(monthly)}</span>
              </div>
              <input type="number" inputMode="numeric" pattern="[0-9]*" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={500} max={100000} step={500} value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expected Return Rate (p.a)</label>
                <span className="text-sm font-semibold text-blue-600">{rate}%</span>
              </div>
              <input type="number" inputMode="decimal" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={1} max={30} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Period (Years)</label>
                <span className="text-sm font-semibold text-blue-600">{years} Years</span>
              </div>
              <input type="number" inputMode="numeric" pattern="[0-9]*" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={1} max={40} step={1} value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Annual Step-up (% p.a)</label>
                <span className="text-sm font-semibold text-blue-600">{stepUp}%</span>
              </div>
              <input type="number" value={stepUp} onChange={e => setStepUp(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono mb-2 text-gray-900 bg-white" />
              <input type="range" min={0} max={50} step={1} value={stepUp} onChange={e => setStepUp(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg shadow-blue-900/20">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">Future Value</div>
              <div className="text-4xl font-bold font-mono mb-2">NPR {fmt(result.fv)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Invested</div>
                <div className="text-sm font-semibold text-gray-900">NPR {fmt(result.totalInvested)}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Returns</div>
                <div className="text-sm font-semibold text-green-600">NPR {fmt(result.returns)}</div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                <span className="text-gray-500">Invested ({invPct.toFixed(1)}%)</span>
                <span className="text-green-600">Returns ({retPct.toFixed(1)}%)</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div className="bg-gray-400 h-full" style={{width: `${invPct}%`}}></div>
                <div className="bg-green-500 h-full" style={{width: `${retPct}%`}}></div>
              </div>
            </div>

            <ShareResult 
              title="SIP Growth Estimate" 
              result={`NPR ${fmt(result.fv)}`} 
              calcUrl={`https://calcpro.com.np/calculator/sip-calculator?m=${monthly}&r=${rate}&y=${years}`} 
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
                    <th className="px-4 py-3">Total Invested</th>
                    <th className="px-4 py-3">Est. Returns</th>
                    <th className="px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50/50 transition-colors">
                      <td className="text-center px-4 py-3 text-gray-700 font-medium">{row.year}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{fmt(row.invested)}</td>
                      <td className="px-4 py-3 font-mono text-green-600">+{fmt(row.returns)}</td>
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
            question: 'What is a Systematic Investment Plan (SIP)?',
            answer: 'SIP is a method of investing in mutual funds where an investor contributes a fixed amount at regular intervals (monthly, quarterly) rather than a lump sum. It helps in rupee cost averaging and disciplined saving.',
          },
          {
            question: 'How much can I start a SIP with in Nepal?',
            answer: 'In Nepal, many mutual funds allow you to start a SIP with as little as NPR 1,000 per month. Some platforms even allow lower amounts.',
          },
          {
            question: 'What are the expected returns from SIP in Nepal?',
            answer: 'Historical returns from the Nepal Stock Exchange (NEPSE) and mutual funds have varied. While equity-linked mutual funds can target 12-15% over the long term, returns are not guaranteed and depend on market performance.',
          },
          {
            question: 'Is SIP better than a Fixed Deposit (FD)?',
            answer: 'SIPs in mutual funds generally offer higher potential returns than Fixed Deposits over the long term (5+ years). However, FDs are safer as they offer guaranteed returns, while SIPs are subject to market risks.',
          },
          {
            question: 'Can I stop my SIP anytime?',
            answer: 'Yes, most mutual funds in Nepal allow you to stop your SIP or withdraw your funds at any time. However, some may have an exit load (a small fee) if withdrawn within a short period (usually 1-2 years).',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
