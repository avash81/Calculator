'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(1);

  const r = useMemo(() => {
    // SI = (P * T * R) / 100
    const interest = (principal * time * rate) / 100;
    const total = principal + interest;
    return { interest, total };
  }, [principal, time, rate]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Simple Interest Calculator"
        description="Calculate simple interest and total amount based on principal, rate, and time. Perfect for basic loans, savings, and educational purposes."
        url="https://calcpro.com.np/calculator/simple-interest" />

      <CalcWrapper
        title="Simple Interest Calculator"
        description="Calculate simple interest and total amount based on principal, rate, and time. Perfect for basic loans and savings."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'Simple Interest' }]}
        relatedCalcs={[
          { name: 'Compound Interest', slug: 'compound-interest' },
          { name: 'Fixed Deposit', slug: 'fd-calculator' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Principal Amount</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interest Rate (%)</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Time (Years)</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" step="0.1" value={time} onChange={e => setTime(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Amount</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.total)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Principal</span>
                  <span className="font-mono font-bold">{fmt(principal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Simple Interest</span>
                  <span className="font-mono font-bold text-green-300">+{fmt(r.interest)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Simple Interest Calculation" 
              result={fmt(r.total)} 
              calcUrl={`https://calcpro.com.np/calculator/simple-interest`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is Simple Interest?',
            answer: 'Simple interest is a quick and easy method of calculating the interest charge on a loan. Simple interest is determined by multiplying the daily interest rate by the principal by the number of days that elapse between payments.',
          },
          {
            question: 'What is the formula for simple interest?',
            answer: 'The formula for simple interest is: I = P * R * T, where I is the interest, P is the principal amount, R is the annual interest rate (as a decimal), and T is the time in years.',
          },
          {
            question: 'How does simple interest differ from compound interest?',
            answer: 'Simple interest is calculated only on the principal amount of a loan. Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods.',
          },
          {
            question: 'When is simple interest used?',
            answer: 'Simple interest is commonly used for short-term loans, automobile loans, and some personal loans. It is also used in many educational contexts to teach the basics of finance.',
          },
          {
            question: 'Can I use this for monthly time periods?',
            answer: 'Yes, but you must convert the time to years. For example, if the time is 6 months, enter 0.5 years in the calculator.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
