'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function CAGRCalculator() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(250000);
  const [years, setYears] = useState(5);

  const r = useMemo(() => {
    // CAGR = [(Final / Initial)^(1/Years)] - 1
    if (initial <= 0 || final <= 0 || years <= 0) return 0;
    const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    return cagr;
  }, [initial, final, years]);

  return (
    <>
      <JsonLd type="calculator"
        name="CAGR Calculator"
        description="Calculate the Compound Annual Growth Rate (CAGR) of your investments over a period of time. Essential for comparing different investment returns."
        url="https://calcpro.com.np/calculator/cagr-calculator" />

      <CalcWrapper
        title="CAGR Calculator"
        description="Calculate the Compound Annual Growth Rate (CAGR) of your investments over a period of time. Essential for comparing different investment returns."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'CAGR Calculator' }]}
        relatedCalcs={[
          { name: 'SIP Calculator', slug: 'sip-calculator' },
          { name: 'Compound Interest', slug: 'compound-interest' },
          { name: 'Fixed Deposit', slug: 'fd-calculator' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Initial Value</label>
                  <input type="number" inputMode="numeric" value={initial} onChange={e => setInitial(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Final Value</label>
                  <input type="number" inputMode="numeric" value={final} onChange={e => setFinal(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration (Years)</label>
                <input type="number" inputMode="numeric" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                <input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} className="w-full mt-2 accent-blue-600 h-1.5" />
                <div className="flex justify-between text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-widest"><span>1 Yr</span><span>30 Yrs</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">CAGR</div>
              <div className="text-4xl font-bold font-mono mb-4">{r.toFixed(2)}%</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="text-sm opacity-80 font-medium">
                  Your investment grew by an average of {r.toFixed(2)}% every year.
                </div>
              </div>
            </div>

            <ShareResult 
              title="CAGR Result" 
              result={`${r.toFixed(2)}%`} 
              calcUrl={`https://calcpro.com.np/calculator/cagr-calculator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is CAGR?',
            answer: 'CAGR stands for Compound Annual Growth Rate. It is the mean annual growth rate of an investment over a specified period of time longer than one year. It represents one of the most accurate ways to calculate and determine returns for anything that can rise or fall in value over time.',
          },
          {
            question: 'How is CAGR calculated?',
            answer: 'The formula for CAGR is: [(Ending Value / Beginning Value) ^ (1 / Number of Years)] - 1. The result is then multiplied by 100 to get a percentage.',
          },
          {
            question: 'Why is CAGR important for investors?',
            answer: 'CAGR is crucial because it "smooths" out the returns of an investment over time, making it easier to compare the performance of different assets (like stocks vs. mutual funds vs. real estate) regardless of their individual volatility.',
          },
          {
            question: 'What is a good CAGR?',
            answer: 'A "good" CAGR depends on the asset class and the risk involved. For example, in the context of the Nepal Stock Exchange (NEPSE), a CAGR of 12-15% is often considered strong for long-term equity investments, while fixed deposits might offer 8-10%.',
          },
          {
            question: 'Does CAGR account for risk?',
            answer: 'No, CAGR only measures the rate of return. It does not account for the volatility or risk associated with the investment. Two investments can have the same CAGR but very different levels of risk.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
