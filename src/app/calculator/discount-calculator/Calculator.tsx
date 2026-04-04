'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Tag, ShoppingBag } from 'lucide-react';

function fmt(n: number) { return Math.round(n).toLocaleString('en-IN'); }

export default function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [discount, setDiscount] = useState(20);

  const r = useMemo(() => {
    const savings = (price * discount) / 100;
    const final = price - savings;
    return { savings, final };
  }, [price, discount]);

  const isHotDeal = discount >= 50;

  return (
    <CalculatorLayout
      title="Discount & Sale Calculator"
      description="Calculate the final price after any discount and see your exact savings. Perfect for retail shopping, business sales, and price comparisons."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-white border border-[var(--border)]">
            <ValidatedInput label="Original Price / MRP" value={price} onChange={setPrice} min={0} prefix="Rs." required />
            <ValidatedInput label="Discount (%)" value={discount} onChange={setDiscount} min={0} max={100} suffix="%" step={1} required />
          </div>

          {/* Discount Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Discount Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map(v => (
                <button key={v} onClick={() => setDiscount(v)}
                  className={`py-3 text-xs font-black border transition-all ${discount === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          {/* Visual Savings Bar */}
          <div className="space-y-2 p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <div className="flex justify-between text-[11px] font-bold uppercase text-[var(--text-muted)]">
              <span>Discount Applied</span>
              <span>{discount}%</span>
            </div>
            <div className="h-3 bg-gray-200 w-full relative overflow-hidden">
              <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${Math.min(discount, 100)}%` }} />
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-medium">
              Formula: Final = Price × (1 − {discount}/100)
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Final Price — Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">You Pay</div>
            <div className="text-6xl font-black text-[#006600] tracking-tighter mb-2">Rs. {fmt(r.final)}</div>
            <div className="text-sm font-bold text-red-600 uppercase tracking-widest">Save Rs. {fmt(r.savings)}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Original Price</span>
              <span className="text-sm font-black text-[var(--text-main)]">Rs. {fmt(price)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Amount Saved</span>
              <span className="text-sm font-black text-red-600">− Rs. {fmt(r.savings)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Deal Rating</span>
              <span className={`text-sm font-black ${isHotDeal ? 'text-red-600' : 'text-[var(--primary)]'}`}>
                {isHotDeal ? '🔥 HOT DEAL' : '✓ GOOD SAVE'}
              </span>
            </div>
          </div>

          {/* Insight */}
          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)] flex gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              {isHotDeal
                ? 'Premium clearance-level discount. Excellent value — buy now!'
                : 'Standard retail discount. Good for staying within a monthly budget.'}
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How do I calculate a discount?', answer: 'Multiply the original price by the discount percentage (as a decimal), then subtract from the original: Final = Price × (1 − Discount/100).' },
          { question: 'What is "Buy 1 Get 1 Free" equivalent to?', answer: 'BOGO is effectively a 50% discount on each item when you consider the total spend per unit.' },
          { question: 'Can I calculate multiple discounts?', answer: 'Stacking discounts is not simple addition. A 20% then 10% discount equals a 28% total discount, not 30%, because the second discount applies to the already-reduced price.' },
        ]} />
      }
    />
  );
}
