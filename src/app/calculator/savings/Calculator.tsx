/**
 * @fileoverview Savings Calculator — CalcPro.NP
 * Formula: FV = PMT × [((1+r)^n - 1) / r] × (1+r)
 * @component
 */
'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { JsonLd } from '@/components/seo/JsonLd';
import { useDebounce } from '@/hooks/useDebounce';

const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

export default function SavingsCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const dM = useDebounce(monthly, 300);
  const dR = useDebounce(rate, 300);
  const dY = useDebounce(years, 300);

  const result = useMemo(() => {
    const r = dR / 12 / 100;
    const n = dY * 12;
    const fv = r === 0 ? dM * n : dM * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = dM * n;
    return { fv: Math.round(fv), invested: Math.round(invested), interest: Math.round(fv - invested) };
  }, [dM, dR, dY]);

  return (
    <>
      <JsonLd type="calculator" name="Savings Calculator Nepal"
        description="Calculate future value of monthly savings with compound interest"
        url="https://calcpro.com.np/calculator/savings" />
      <CalcWrapper title="Savings Calculator"
        description="See how your monthly savings grow with compound interest over time."
        crumbs={[{label:'finance',href:'/calculator?cat=finance'},{label:'savings calculator'}]}
        relatedCalcs={[{name:'SIP Calculator',slug:'sip-calculator'},{name:'FD Calculator',slug:'fd-calculator'},{name:'Compound Interest',slug:'compound-interest'}]}>
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-5">
            {[
              {label:'Monthly Savings',value:monthly,setter:setMonthly,min:100,max:500000,step:500,unit:'NPR'},
              {label:'Annual Interest Rate',value:rate,setter:setRate,min:1,max:30,step:0.5,unit:'%'},
              {label:'Time Period',value:years,setter:setYears,min:1,max:40,step:1,unit:'yrs'},
            ].map(({label,value,setter,min,max,step,unit}) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">{label}</label>
                <div className="relative">
                  <input type="number" inputMode="decimal" value={value}
                    onChange={e => setter(+e.target.value || 0)}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 pr-12 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-900 bg-white" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => setter(+e.target.value)}
                  className="w-full mt-2 accent-blue-600 h-1.5" />
              </div>
            ))}
          </div>
          <div className="space-y-3 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
              <div className="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Total Savings After {years} Years</div>
              <div className="text-3xl font-bold font-mono">{fmt(result.fv)}</div>
              <div className="text-xs opacity-75 mt-1">Monthly: {fmt(monthly)}</div>
            </div>
            {[{l:'Total Invested',v:fmt(result.invested)},{l:'Interest Earned',v:fmt(result.interest),green:true}].map(({l,v,green})=>(
              <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{l}</div>
                <div className={`text-lg font-bold font-mono ${green?'text-green-600':'text-gray-900'}`}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <CalcFAQ faqs={[
          {question:'How is savings growth calculated?',answer:'We use the future value of annuity formula: FV = PMT × [((1+r)^n - 1) / r] × (1+r), where PMT is monthly savings, r is monthly rate, n is total months.'},
          {question:'What interest rate should I use?',answer:'For savings accounts in Nepal, use 4-7%. For fixed deposits, use 7-10%. For mutual funds, use 10-14% (estimated).'},
          {question:'Does this account for inflation?',answer:'No, these are nominal values. To get inflation-adjusted returns, subtract the inflation rate (typically 5-7% in Nepal) from your expected return rate.'},
          {question:'How much should I save monthly?',answer:'Financial experts recommend saving at least 20% of your income. Even small amounts like NPR 2,000/month grow significantly over 10+ years with compound interest.'},
        ]} />
      </CalcWrapper>
    </>
  );
}
