'use client';

import { useState, useMemo } from 'react';
import { Receipt, Percent, Coins, ShoppingBag } from 'lucide-react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { calculateNepalVAT } from '@/utils/math/country-rules/nepal';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

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
    }
  ];

  return (
    <CalculatorLayout
      title="Nepal VAT Calculator"
      description="Quickly calculate Value Added Tax (VAT) for goods and services in Nepal at the standard 13% rate."
      category={{ label: "Nepal Tools", href: "/calculator/category/nepal" }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4">
            <ValidatedInput 
              label="Amount (NPR)" 
              value={amount} 
              onChange={(v) => setAmount(Number(v))} 
              min={1} max={10000000} step={1} required 
            />
            
            <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border)]">
              <div className="space-y-0.5">
                <div className="text-[13px] font-bold text-[var(--text-main)]">VAT Inclusive?</div>
                <div className="text-[11px] text-[var(--text-muted)] leading-tight">Switch on if amount already includes 13% tax.</div>
              </div>
              <button 
                onClick={() => setIsInclusive(!isInclusive)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isInclusive ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isInclusive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-5 bg-[var(--primary-light)] border border-[var(--primary)]/10 flex gap-3">
            <Percent className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              The standard VAT rate of <span className="font-bold">13%</span> is automatically applied per Nepal regulations.
            </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
           <div className="p-6 bg-white border border-[var(--border)] text-center">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Total Amount (Final)</div>
              <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">Rs. {results.total.toLocaleString()}</div>
              <div className="text-xs font-bold text-[var(--success)] uppercase tracking-tight">Net Amount: Rs. {results.net.toLocaleString()}</div>
           </div>

           <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">VAT Amount (13%)</span>
              </div>
              <span className="text-xl font-black text-[var(--text-main)]">Rs. {results.vat.toLocaleString()}</span>
           </div>

           <div className="mt-8 p-4 border border-[var(--border)] border-dashed text-center">
             <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
               {isInclusive ? 'Amount includes 13% VAT' : '13% VAT added to base amount'}
             </p>
           </div>
        </div>
      }
      faqSection={<CalcFAQ faqs={faqs} />}
    />
  );
}
