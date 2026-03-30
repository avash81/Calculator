'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function MortgageCalculator() {
  const [pPrice, setPPrice] = useState(15000000);
  const [downPercent, setDownPercent] = useState(25);
  const [rate, setRate] = useState(12.5);
  const [years, setYears] = useState(15);
  const [taxRate, setTaxRate] = useState(1.2); // Annual property tax %
  const [insurance, setInsurance] = useState(50000); // Annual 

  const dPrice = useDebounce(pPrice, 300);
  const dDown = useDebounce(downPercent, 300);
  const dRate = useDebounce(rate, 300);

  const r = useMemo(() => {
    const downAmt = dPrice * (dDown / 100);
    const loan = dPrice - downAmt;
    const i = (dRate / 100) / 12;
    const n = years * 12;
    
    // P&I = [P x R x (1+R)^N] / [(1+R)^N - 1]
    const pAndI = (loan * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const mTax = (dPrice * (taxRate / 100)) / 12;
    const mInsurance = insurance / 12;
    
    const monthlyTotal = pAndI + mTax + mInsurance;
    
    return { loan, downAmt, pAndI, mTax, mInsurance, monthlyTotal };
  }, [dPrice, dDown, dRate, years, taxRate, insurance]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Global/Nepal Mortgage Calculator"
        description="Full Property and Mortgage calculator including Property Tax and Insurance. Google Search UI logic."
        url="https://calcpro.com.np/calculator/mortgage-calculator" />

      <CalcWrapper
        title="Mortgage & Property Calc"
        description="Detailed mortgage calculator including P&I, Property Tax, and Insurance estimation. Based on global standards."
        crumbs={[{ label: 'Financial Tools', href: '/calculator?cat=finance' }, { label: 'Mortgage' }]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Home Price</label>
                  <span className="text-sm font-bold text-gray-900">{fmt(pPrice)}</span>
                </div>
                <input type="range" min="1000000" max="50000000" step="100000" value={pPrice} onChange={e => setPPrice(+e.target.value)} className="w-full accent-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Down Payment (%)</label>
                  <input type="number" value={downPercent} onChange={e => setDownPercent(+e.target.value)} className="w-full h-11 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Interest Rate (%)</label>
                  <input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-11 px-4 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Tenure (Years)</label>
                  <select value={years} onChange={e => setYears(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white">
                    {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} Years</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Annual Home Tax (%)</label>
                  <input type="number" step="0.1" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Annual Insurance (NPR)</label>
                <input type="number" value={insurance} onChange={e => setInsurance(+e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-3xl p-7 text-white shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-[10px] font-semibold uppercase opacity-60 tracking-widest mb-1">Total Monthly Payment</div>
                <div className="text-4xl font-bold font-mono text-blue-400">{fmt(r.monthlyTotal)}</div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">Principal & Interest</span>
                  <span className="font-mono text-sm">{fmt(r.pAndI)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">Property Tax /mo</span>
                  <span className="font-mono text-sm">{fmt(r.mTax)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">Home Insurance /mo</span>
                  <span className="font-mono text-sm">{fmt(r.mInsurance)}</span>
                </div>
                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between text-xs">
                  <span className="opacity-60 text-blue-300 font-bold">Total Loan Amount</span>
                  <span className="font-mono text-sm text-blue-300 font-bold">{fmt(r.loan)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed font-medium capitalize">
              Including P&I, and property-specific taxes. Rates subject to daily banking fluctuations.
            </p>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What does a mortgage payment include?',
            answer: 'A standard mortgage payment includes Principal (the loan balance), Interest (the bank fee), Property Tax (assessed by the local government), and Homeowners Insurance.',
          },
          {
            question: 'How does property tax affect my mortgage?',
            answer: 'Often, property tax is handled via an "escrow" account. The bank collects 1/12th of your annual tax each month and pays it for you. Our calculator includes this in the total monthly estimate.',
          },
          {
            question: 'How can I lower my monthly mortgage?',
            answer: 'You can lower your monthly payment by increasing your down payment, securing a lower interest rate, or choosing a longer tenure (e.g., 30 years instead of 15), though a longer tenure means paying more interest over time.',
          }
        ]} />
      </CalcWrapper>
    </>
  );
}
