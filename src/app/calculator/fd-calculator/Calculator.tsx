'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(1);
  const [compounding, setCompounding] = useState(4); // Quarterly by default in Nepal

  const dPrincipal = useDebounce(principal, 300);
  const dRate = useDebounce(rate, 300);
  const dTime = useDebounce(time, 300);

  const r = useMemo(() => {
    const p = dPrincipal;
    const r = dRate / 100;
    const t = dTime;
    const n = compounding;
    
    // A = P(1 + r/n)^(nt)
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    
    return {
      maturity: amount,
      interest,
      total: amount
    };
  }, [dPrincipal, dRate, dTime, compounding]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Fixed Deposit (FD) Calculator Nepal"
        description="Calculate maturity amount and interest earned on your fixed deposit in Nepal. Supports quarterly and monthly compounding options common in Nepali banks."
        url="https://calcpro.com.np/calculator/fd-calculator" />

      <CalcWrapper
        title="Fixed Deposit (FD) Calculator"
        description="Calculate maturity amount and interest earned on your fixed deposit. Supports quarterly and monthly compounding options common in Nepal."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'FD Calculator' }]}
        relatedCalcs={[
          { name: 'SIP Calculator', slug: 'sip-calculator' },
          { name: 'EMI Calculator', slug: 'loan-emi' },
          { name: 'Compound Interest', slug: 'compound-interest' },
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
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Compounding Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { l: 'Monthly', v: 12 },
                    { l: 'Quarterly', v: 4 },
                    { l: 'Half-Yearly', v: 2 },
                    { l: 'Yearly', v: 1 },
                  ].map(opt => (
                    <button key={opt.v} onClick={() => setCompounding(opt.v)} className={`py-2 px-3 rounded-lg text-[10px] font-bold border-2 transition-all uppercase tracking-widest ${compounding === opt.v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Maturity Amount</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.maturity)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Principal</span>
                  <span className="font-mono font-bold">{fmt(principal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Interest Earned</span>
                  <span className="font-mono font-bold text-green-300">+{fmt(r.interest)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="FD Calculation" 
              result={fmt(r.maturity)} 
              calcUrl={`https://calcpro.com.np/calculator/fd-calculator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is a Fixed Deposit (FD)?',
            answer: 'A Fixed Deposit is a financial instrument provided by banks or NBFCs which provides investors a higher rate of interest than a regular savings account, until the given maturity date. It is considered one of the safest investment options in Nepal.',
          },
          {
            question: 'How is FD interest calculated in Nepal?',
            answer: 'Most banks in Nepal calculate FD interest using compound interest, typically compounded quarterly (every 3 months). Some banks also offer monthly interest payout options.',
          },
          {
            question: 'Is FD interest taxable in Nepal?',
            answer: 'Yes, interest earned on fixed deposits is subject to a 5% withholding tax for individuals in Nepal. This is usually deducted at the source (TDS) by the bank.',
          },
          {
            question: 'Can I withdraw my FD before maturity?',
            answer: 'Yes, most banks allow premature withdrawal of fixed deposits, but they usually charge a penalty (often 1-2% reduction in the interest rate) and may require a certain notice period.',
          },
          {
            question: 'What is the minimum amount for FD in Nepal?',
            answer: 'The minimum amount varies by bank, but typically starts from NPR 5,000 to NPR 10,000 for individual accounts.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
