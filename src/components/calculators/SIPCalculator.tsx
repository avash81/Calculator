'use client';

import { useState, useMemo } from 'react';
import { Input, Slider, ResultCard } from '@/components/ui';
import { calculateSIP } from '@/utils/math/finance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, PieChart } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

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
      description="Calculate the future value of your Systematic Investment Plan (SIP) investments with real-time projections and wealth gain analysis."
      category="Finance"
      categoryHref="/calculators/finance"
      focusKeyword="SIP Calculator Nepal"
      faqs={faqs}
      relatedCalcs={relatedCalcs}
    >
      {/* Inputs */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Input
            label="Monthly Investment"
            type="number"
            value={monthlyInvestment}
            onChange={(v) => setMonthlyInvestment(Number(v))}
            unit="NPR"
            placeholder="5,000"
          />
          <Slider
            value={monthlyInvestment}
            min={500}
            max={100000}
            step={500}
            onChange={setMonthlyInvestment}
            label="Adjust Amount"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Expected Return Rate"
            type="number"
            value={expectedReturn}
            onChange={(v) => setExpectedReturn(Number(v))}
            unit="%"
            placeholder="12"
          />
          <Slider
            value={expectedReturn}
            min={1}
            max={30}
            step={0.5}
            onChange={setExpectedReturn}
            label="Adjust Return"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Investment Tenure"
            type="number"
            value={tenure}
            onChange={(v) => setTenure(Number(v))}
            unit="Years"
            placeholder="10"
          />
          <Slider
            value={tenure}
            min={1}
            max={40}
            step={1}
            onChange={setTenure}
            label="Adjust Tenure"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <ResultCard
          label="Estimated Wealth"
          value={`Rs. ${results.futureValue.toLocaleString()}`}
          variant="primary"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Total Invested"
            value={`Rs. ${results.totalInvested.toLocaleString()}`}
            variant="secondary"
            icon={<Wallet className="w-4 h-4" />}
          />
          <ResultCard
            label="Wealth Gained"
            value={`Rs. ${results.wealthGained.toLocaleString()}`}
            variant="success"
            icon={<PieChart className="w-4 h-4" />}
          />
        </div>

        {/* Chart */}
        <div className="mt-8 pt-8 border-t border-cp-divider">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results.projection}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cp-blue)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--cp-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--cp-divider)" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 500, fill: 'var(--cp-text-light)' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 500, fill: 'var(--cp-text-light)' }} 
                  tickFormatter={(v) => `Rs.${v/100000}L`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--cp-border)', 
                    boxShadow: 'var(--cp-shadow-lg)',
                    backgroundColor: 'var(--cp-bg)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'var(--cp-blue)', fontWeight: 'bold' }}
                  labelStyle={{ color: 'var(--cp-text-muted)', marginBottom: '4px' }}
                  formatter={(v: any) => [`Rs. ${v.toLocaleString()}`, 'Total Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--cp-blue)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center text-cp-text-light uppercase tracking-widest mt-4 font-medium">
            Projected wealth growth over {tenure} years
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
