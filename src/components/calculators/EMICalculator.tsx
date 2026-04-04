'use client';

import { useState, useMemo } from 'react';
import { calculateEMI } from '@/utils/math/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function EMICalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(15);

  const results = useMemo(() => {
    return calculateEMI(amount, rate, tenure);
  }, [amount, rate, tenure]);

  const chartData = [
    { name: 'Principal', value: amount },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['#083366', '#006600']; // Navy, Green

  return (
    <CalculatorLayout
      title="Loan EMI Calculator"
      description="Professional EMI calculator for home, car, and personal loans. Plan your repayment with high precision."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4">
             <ValidatedInput label="Loan Amount (NPR)" value={amount} onChange={(v) => setAmount(Number(v))} min={10000} max={100000000} step={50000} required />
             <ValidatedInput label="Interest Rate (%)" value={rate} onChange={(v) => setRate(Number(v))} min={0.1} max={50} step={0.1} required />
             <ValidatedInput label="Loan Tenure (Years)" value={tenure} onChange={(v) => setTenure(Number(v))} min={1} max={30} required />
          </div>
          
          <div className="p-5 bg-[var(--primary-light)] border border-[var(--primary)]/10 text-[14px]">
             <h4 className="text-xs font-bold uppercase text-[var(--primary)] mb-2">Calculation Logic</h4>
             <p className="text-[var(--text-secondary)] leading-relaxed">
               Uses standard reducing balance formula to ensure 100% accuracy with modern banking standards.
             </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-8">
           <div className="text-center p-6 bg-white border border-[var(--border)]">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Monthly EMI Payment</div>
              <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">Rs. {results.emi.toLocaleString()}</div>
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-tight">Per month for {tenure} years</div>
           </div>

           <div className="space-y-4 bg-white/40 p-4 border border-[var(--border)]">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Total Interest</span>
                <span className="text-sm font-bold text-[var(--text-main)]">Rs. {results.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Total Payment</span>
                <span className="text-sm font-bold text-[var(--text-main)]">Rs. {results.totalPayment.toLocaleString()}</span>
              </div>
           </div>

           <div className="h-[250px] w-full border border-[var(--border)] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} formatter={(v) => <span className="text-[10px] font-bold uppercase">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      }
      faqSection={
        <CalcFAQ
          faqs={[
            {
              question: "How is EMI calculated?",
              answer: "EMI is calculated using a reducing-balance method where interest is only charged on the remaining principal."
            },
            {
              question: "Can I use this for home loans?",
              answer: "Yes, this tool works for any loan including home, auto, and personal loans."
            }
          ]}
        />
      }
    />
  );
}
