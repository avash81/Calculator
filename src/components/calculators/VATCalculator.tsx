'use client';

import { useState, useMemo } from 'react';
import { Input, Slider, ResultCard, Toggle } from '@/components/ui';
import { calculateNepalVAT } from '@/utils/math/country-rules/nepal';
import { Receipt, Percent, Coins, ShoppingBag } from 'lucide-react';
import { NepalFlag } from '@/components/ui/NepalFlag';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export default function VATCalculator() {
  const [amount, setAmount] = useState(1000);
  const [isInclusive, setIsInclusive] = useState(false);

  const results = useMemo(() => {
    const res = calculateNepalVAT(amount, isInclusive ? 'inclusive' : 'exclusive');
    return {
      total: res.priceIncludingVAT,
      net: res.priceExcludingVAT,
      vat: res.vatAmount
    };
  }, [amount, isInclusive]);

  const faqs = [
    {
      question: "What is the standard VAT rate in Nepal?",
      answer: "The standard Value Added Tax (VAT) rate in Nepal is 13%, as per the Value Added Tax Act, 2052."
    },
    {
      question: "What is the difference between VAT inclusive and exclusive?",
      answer: "VAT inclusive means the price already includes the 13% tax. VAT exclusive means the tax will be added on top of the base price."
    },
    {
      question: "Are any items exempt from VAT in Nepal?",
      answer: "Yes, certain essential goods and services like basic agricultural products, health services, and educational services are exempt from VAT in Nepal."
    }
  ];

  const relatedCalcs = [
    { label: "Income Tax Calculator", href: "/calculators/nepal/nepal-income-tax", icon: <NepalFlag />, desc: "Calculate your annual income tax." },
    { label: "Salary Calculator", href: "/calculators/nepal/nepal-salary", icon: "💸", desc: "Calculate your monthly net salary." },
    { label: "EMI Calculator", href: "/calculators/finance/loan-emi", icon: "🏦", desc: "Calculate monthly EMI for any loan." }
  ];

  return (
    <CalculatorLayout
      title="Nepal VAT Calculator"
      description="Quickly calculate Value Added Tax (VAT) for goods and services in Nepal. Supports both VAT inclusive and exclusive calculations at the standard 13% rate."
      category="Nepal Tools"
      categoryHref="/calculators/nepal"
      focusKeyword="VAT Calculator Nepal"
      faqs={faqs}
      relatedCalcs={relatedCalcs}
      isNepal={true}
    >
      {/* Inputs */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(v) => setAmount(Number(v))}
            unit="NPR"
            placeholder="1,000"
          />
          <Slider
            value={amount}
            min={10}
            max={1000000}
            step={10}
            onChange={setAmount}
            label="Adjust Amount"
          />
        </div>

        <Toggle
          label="VAT Inclusive Price?"
          description="Switch on if the amount already includes the 13% VAT."
          checked={isInclusive}
          onChange={setIsInclusive}
        />

        <div className="p-4 bg-cp-blue-light rounded-xl border border-cp-blue/10 flex gap-3 items-start">
          <Percent className="w-5 h-5 text-cp-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs text-cp-text-muted leading-relaxed">
            The standard VAT rate of <strong>13%</strong> is automatically applied as per Nepal&apos;s tax regulations.
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <ResultCard
          label="Total Amount (Final)"
          value={`Rs. ${results.total.toLocaleString()}`}
          variant="primary"
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Net Amount"
            value={`Rs. ${results.net.toLocaleString()}`}
            variant="secondary"
            icon={<Coins className="w-4 h-4" />}
          />
          <ResultCard
            label="VAT (13%)"
            value={`Rs. ${results.vat.toLocaleString()}`}
            variant="success"
            icon={<Receipt className="w-4 h-4" />}
          />
        </div>

        <div className="mt-8 p-6 bg-cp-bg rounded-2xl border border-cp-border border-dashed text-center">
          <p className="text-xs font-bold text-cp-text-muted uppercase tracking-widest">
            {isInclusive ? 'Amount includes 13% VAT' : '13% VAT added to base amount'}
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
