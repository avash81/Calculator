'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function NepalHomeLoan() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(12.5);
  const [tenure, setTenure] = useState(15);

  const dAmount = useDebounce(amount, 300);
  const dRate = useDebounce(rate, 300);
  const dTenure = useDebounce(tenure, 300);

  const r = useMemo(() => {
    const p = dAmount;
    const r = dRate / 12 / 100;
    const n = dTenure * 12;
    
    // EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    
    return { emi, totalPayment, totalInterest };
  }, [dAmount, dRate, dTenure]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Nepal Home Loan EMI Calculator"
        description="Calculate monthly EMI for home loans in Nepal. Includes interest rate trends from major commercial banks and NRB guidelines for 2081/82."
        url="https://calcpro.com.np/calculator/nepal-home-loan" />

      <CalcWrapper
        title="Nepal Home Loan EMI Calculator"
        description="Calculate EMI for home loans in Nepal. Includes interest rate trends from major commercial banks and NRB guidelines."
        crumbs={[{ label: 'Nepal Rules', href: '/calculator?cat=nepal' }, { label: 'Home Loan EMI' }]}
        isNepal
        relatedCalcs={[
          { name: 'EMI Calculator', slug: 'loan-emi' },
          { name: 'Income Tax', slug: 'nepal-income-tax' },
          { name: 'Salary Calculator', slug: 'nepal-salary' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Loan Amount</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={amount} onChange={e => setAmount(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interest Rate (%)</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tenure (Years)</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={tenure} onChange={e => setTenure(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-xl shadow-red-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Monthly EMI</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.emi)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Interest</span>
                  <span className="font-mono font-bold text-yellow-300">{fmt(r.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Payment</span>
                  <span className="font-mono font-bold">{fmt(r.totalPayment)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Home Loan EMI Result" 
              result={`${fmt(r.emi)}/mo`} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-home-loan`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the maximum tenure for a home loan in Nepal?',
            answer: 'According to NRB guidelines, the maximum tenure for a home loan in Nepal is typically up to 30 years, depending on the bank and the age of the borrower.',
          },
          {
            question: 'What is the Loan-to-Value (LTV) ratio for home loans in Nepal?',
            answer: 'For residential home loans in Nepal, the LTV ratio is generally up to 70% for properties within the Kathmandu Valley and up to 80% for properties outside the valley.',
          },
          {
            question: 'How do interest rates change on home loans?',
            answer: 'Most home loans in Nepal are linked to the bank\'s "Base Rate". When the base rate changes (usually reviewed quarterly), your interest rate and EMI may also change.',
          },
          {
            question: 'What documents are required for a home loan in Nepal?',
            answer: 'Common documents include citizenship certificate, land ownership certificate (Lalpurja), blue print/trace map, tax clearance certificate, and proof of income (salary certificate or business audit reports).',
          },
          {
            question: 'Can I get a tax benefit on home loan interest in Nepal?',
            answer: 'Currently, individual taxpayers in Nepal can claim a deduction of up to NPR 25,000 per year on the interest paid for a home loan, provided it is their first home.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
