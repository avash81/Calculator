'use client';

import { useState, useMemo } from 'react';
import { Input, Slider, ResultCard } from '@/components/ui';
import { calculateEMI } from '@/utils/math/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CreditCard, Percent, Landmark } from 'lucide-react';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export default function EMICalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(5);

  const results = useMemo(() => {
    return calculateEMI(amount, rate, tenure);
  }, [amount, rate, tenure]);

  const chartData = [
    { name: 'Principal', value: amount },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  const COLORS = ['var(--cp-blue)', 'var(--cp-gold)'];

  const faqs = [
    {
      question: "What is EMI?",
      answer: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month."
    },
    {
      question: "How is EMI calculated?",
      answer: "EMI is calculated using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1], where P is the principal amount, R is the monthly interest rate, and N is the number of monthly installments."
    },
    {
      question: "Can I pay off my loan early?",
      answer: "Yes, most banks in Nepal allow prepayment or foreclosure of loans, though some may charge a small processing fee. It's always best to check with your specific bank."
    }
  ];

  const relatedCalcs = [
    { label: "SIP Calculator", href: "/calculators/finance/sip-calculator", icon: "📈", desc: "Plan your systematic investments." },
    { label: "Home Loan Eligibility", href: "/calculators/finance/home-loan-eligibility", icon: "🏡", desc: "Check how much loan you can get." },
    { label: "Personal Loan EMI", href: "/calculators/finance/personal-loan", icon: "💳", desc: "Calculate EMI for personal loans." }
  ];

  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Plan your loans better with our accurate EMI calculator. Get instant monthly repayment amounts, total interest, and a clear breakdown of your loan."
      category="Finance"
      categoryHref="/calculators/finance"
      focusKeyword="EMI Calculator Nepal"
      faqs={faqs}
      relatedCalcs={relatedCalcs}
    >
      {/* Inputs */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Input
            label="Loan Amount"
            type="number"
            value={amount}
            onChange={(v) => setAmount(Number(v))}
            unit="NPR"
            placeholder="1,000,000"
          />
          <Slider
            value={amount}
            min={10000}
            max={50000000}
            step={10000}
            onChange={setAmount}
            label="Adjust Loan Amount"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Interest Rate"
            type="number"
            value={rate}
            onChange={(v) => setRate(Number(v))}
            unit="%"
            placeholder="12"
          />
          <Slider
            value={rate}
            min={1}
            max={25}
            step={0.1}
            onChange={setRate}
            label="Adjust Rate"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Loan Tenure"
            type="number"
            value={tenure}
            onChange={(v) => setTenure(Number(v))}
            unit="Years"
            placeholder="5"
          />
          <Slider
            value={tenure}
            min={1}
            max={30}
            step={1}
            onChange={setTenure}
            label="Adjust Tenure"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <ResultCard
          label="Monthly EMI"
          value={`Rs. ${results.emi.toLocaleString()}`}
          variant="primary"
          icon={<CreditCard className="w-5 h-5" />}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Total Interest"
            value={`Rs. ${results.totalInterest.toLocaleString()}`}
            variant="secondary"
            icon={<Percent className="w-4 h-4" />}
          />
          <ResultCard
            label="Total Payment"
            value={`Rs. ${results.totalPayment.toLocaleString()}`}
            variant="success"
            icon={<Landmark className="w-4 h-4" />}
          />
        </div>

        {/* Chart */}
        <div className="mt-8 pt-8 border-t border-cp-divider flex flex-col items-center">
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--cp-border)', 
                    boxShadow: 'var(--cp-shadow-lg)',
                    backgroundColor: 'var(--cp-bg)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-cp-text-muted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center text-cp-text-light uppercase tracking-widest mt-4 font-medium">
            Principal vs Interest Breakdown
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
