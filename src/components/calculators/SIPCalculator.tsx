'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSIP } from '@/utils/math/finance';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenure, setTenure] = useState(10);

  const results = useMemo(() => {
    return calculateSIP(monthlyInvestment, expectedReturn, tenure);
  }, [monthlyInvestment, expectedReturn, tenure]);

  const faqs = [
    {
      question: "What is a SIP?",
      answer: "A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you contribute a fixed amount regularly (monthly, quarterly, etc.) rather than a lump sum."
    },
    {
      question: "How is SIP return calculated?",
      answer: "SIP returns are typically calculated using the Future Value formula of an annuity: FV = P × [({(1 + i)^n} - 1) / i] × (1 + i), where P is the monthly investment, i is the periodic interest rate, and n is the number of payments."
    },
    {
      question: "Is SIP better than lump sum?",
      answer: "SIPs are generally considered better for long-term wealth creation as they offer the benefit of rupee-cost averaging and disciplined investing, reducing the risk of market timing."
    }
  ];

  const relatedCalcs = [
    { label: "EMI Calculator", href: "/calculators/finance/emi-calculator", icon: "🏠", desc: "Calculate your monthly loan repayments." },
    { label: "Lump Sum Calculator", href: "/calculators/finance/lump-sum", icon: "💰", desc: "Calculate returns on one-time investments." },
    { label: "Retirement Planner", href: "/calculators/finance/retirement", icon: "🏖️", desc: "Plan your post-retirement corpus." }
  ];

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Verify the future value of your Systematic Investment Plan (SIP). Plan your long-term wealth growth with precision."
      category={{ label: "Finance", href: "/calculator/category/finance" }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4">
            <ValidatedInput 
              label="Monthly Investment (NPR)" 
              value={monthlyInvestment} 
              onChange={(v) => setMonthlyInvestment(Number(v))} 
              min={500} max={1000000} step={500} required 
            />
            <ValidatedInput 
              label="Expected Return Rate (%)" 
              value={expectedReturn} 
              onChange={(v) => setExpectedReturn(Number(v))} 
              min={1} max={30} step={0.5} required 
            />
            <ValidatedInput 
              label="Investment Tenure (Years)" 
              value={tenure} 
              onChange={(v) => setTenure(Number(v))} 
              min={1} max={50} required 
            />
          </div>

          <div className="p-5 bg-[var(--primary-light)] border border-[var(--primary)]/10">
            <h4 className="text-xs font-bold uppercase text-[var(--primary)] mb-2">Investment Summary</h4>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              Total Invested: <span className="font-bold text-[var(--text-main)]">Rs. {(monthlyInvestment * 12 * tenure).toLocaleString()}</span>
            </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-8">
          <div className="text-center p-6 bg-white border border-[var(--border)]">
            <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Estimated Future Wealth</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">Rs. {results.futureValue.toLocaleString()}</div>
            <div className="text-xs font-bold text-[var(--success)] uppercase tracking-tight">Wealth Gained: Rs. {results.wealthGained.toLocaleString()}</div>
          </div>

          {/* Projection Area Chart - Classic Style */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-main)]">Growth Projection Map</div>
            <div className="h-[260px] w-full border border-[var(--border)] p-2 bg-slate-50/30">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.projection}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="year" fontSize={11} axisLine={false} tickLine={false} tick={{fill: '#666'}} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `Rs.${v/100000}L`} tick={{fill: '#666'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    formatter={(v: any) => [`Rs. ${v.toLocaleString()}`, 'Total Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-center font-bold text-[var(--text-muted)] uppercase tracking-tight">
              Projected wealth growth over {tenure} years
            </p>
          </div>
        </div>
      }
      faqSection={
         <CalcFAQ
            faqs={[
              {
                question: "What is a SIP and why is it better?",
                answer: "A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you contribute a fixed amount regularly. It reduces the risk of market timing via rupee-cost averaging."
              },
              {
                question: "How reliable are these projections?",
                answer: "Projections are based on historical performance and compounded interest formulas. Actual market returns can vary based on the specific funds and global economic factors."
              }
            ]}
         />
      }
    />
  );
}
