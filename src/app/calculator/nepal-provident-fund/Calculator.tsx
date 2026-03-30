'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function NepalPFCalculator() {
  const [basic, setBasic] = useState(50000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);

  const r = useMemo(() => {
    // PF: 10% from employee, 10% from employer
    const monthlyPF = basic * 0.20;
    const annualPF = monthlyPF * 12;
    
    // Gratuity: 8.33% of basic salary (approx 1 month salary per year)
    const monthlyGratuity = basic * 0.0833;
    const annualGratuity = monthlyGratuity * 12;
    
    // Future value of PF with interest
    let totalPF = 0;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    for (let i = 0; i < months; i++) {
      totalPF = (totalPF + monthlyPF) * (1 + monthlyRate);
    }
    
    const totalGratuity = annualGratuity * years;
    
    return { monthlyPF, annualPF, totalPF, totalGratuity, total: totalPF + totalGratuity };
  }, [basic, years, rate]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Nepal Provident Fund (PF) & Gratuity Calculator"
        description="Calculate your accumulated Provident Fund (PF) and Gratuity based on Nepal Labor Act 2074. Includes interest compounding for long-term projections."
        url="https://calcpro.com.np/calculator/nepal-provident-fund" />

      <CalcWrapper
        title="Nepal Provident Fund (PF) & Gratuity Calculator"
        description="Calculate your accumulated Provident Fund (PF) and Gratuity based on Nepal Labor Act. Includes interest compounding for long-term projections."
        crumbs={[{ label: 'Nepal Rules', href: '/calculator?cat=nepal' }, { label: 'PF & Gratuity' }]}
        isNepal
        relatedCalcs={[
          { name: 'Salary Calculator', slug: 'nepal-salary' },
          { name: 'Income Tax', slug: 'nepal-income-tax' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Basic Salary</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" value={basic} onChange={e => setBasic(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Service Years</label>
                  <input type="number" inputMode="numeric" value={years} onChange={e => setYears(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">PF Interest Rate (%)</label>
                  <input type="number" inputMode="numeric" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Retirement Fund</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.total)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Accumulated PF</span>
                  <span className="font-mono font-bold">{fmt(r.totalPF)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Gratuity</span>
                  <span className="font-mono font-bold">{fmt(r.totalGratuity)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Monthly PF (10+10%)</span>
                  <span className="font-mono font-bold text-green-300">{fmt(r.monthlyPF)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="PF & Gratuity Calculation" 
              result={fmt(r.total)} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-provident-fund`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the standard PF contribution in Nepal?',
            answer: 'According to the Nepal Labor Act, the standard contribution is 10% of the basic salary from the employee and 10% from the employer, totaling 20%.',
          },
          {
            question: 'How is Gratuity calculated in Nepal?',
            answer: 'As per the Labor Act 2074, gratuity is calculated at 8.33% of the basic salary every month. This is equivalent to one month\'s basic salary for every year of service.',
          },
          {
            question: 'Where is the PF deposited in Nepal?',
            answer: 'PF is typically deposited in the Employees\' Provident Fund (Karmachari Sanchaya Kosh) or the Social Security Fund (SSF) for private sector employees.',
          },
          {
            question: 'Is PF interest taxable in Nepal?',
            answer: 'The interest earned on PF is generally tax-exempt up to certain limits. However, the final withdrawal may be subject to tax depending on the total amount and the user\'s age.',
          },
          {
            question: 'Can I take a loan against my PF?',
            answer: 'Yes, the Employees\' Provident Fund (EPF) allows contributors to take various types of loans, such as house loans, educational loans, and special loans, against their accumulated balance.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
