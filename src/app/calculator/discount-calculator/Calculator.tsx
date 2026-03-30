'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [discount, setDiscount] = useState(20);

  const r = useMemo(() => {
    const savings = (price * discount) / 100;
    const final = price - savings;
    return { savings, final };
  }, [price, discount]);

  return (
    <>
      <JsonLd type="calculator"
        name="Discount Calculator"
        description="Calculate the final price after discount and see how much you save. Perfect for shopping, sales, and retail calculations."
        url="https://calcpro.com.np/calculator/discount-calculator" />

      <CalcWrapper
        title="Discount Calculator"
        description="Calculate the final price after discount and see how much you save. Perfect for shopping and sales."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'Discount Calculator' }]}
        relatedCalcs={[
          { name: 'VAT Calculator', slug: 'nepal-vat' },
          { name: 'Percentage Calculator', slug: 'percentage' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Original Price</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" value={price} onChange={e => setPrice(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Discount (%)</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" value={discount} onChange={e => setDiscount(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <input type="range" min={0} max={100} step={1} value={discount} onChange={e => setDiscount(+e.target.value)} className="w-full mt-4 accent-blue-600 h-1.5" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-600 rounded-2xl p-6 text-white shadow-xl shadow-green-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Final Price</div>
              <div className="text-3xl font-bold font-mono mb-4">NPR {Math.round(r.final).toLocaleString('en-IN')}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">You Save</span>
                  <span className="font-mono font-bold text-yellow-300">NPR {Math.round(r.savings).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Discount Calculation" 
              result={`NPR ${Math.round(r.final).toLocaleString('en-IN')}`} 
              calcUrl={`https://calcpro.com.np/calculator/discount-calculator?p=${price}&d=${discount}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I calculate a discount?',
            answer: 'To calculate a discount, multiply the original price by the discount percentage (as a decimal). For example, a 20% discount on NPR 1000 is 1000 * 0.20 = NPR 200. Subtract this from the original price to get the final price (NPR 800).',
          },
          {
            question: 'What is the formula for discount percentage?',
            answer: 'The formula is: (Discount Amount / Original Price) * 100. For example, if you save NPR 200 on a NPR 1000 item, the discount is (200 / 1000) * 100 = 20%.',
          },
          {
            question: 'How to calculate 25% off?',
            answer: 'To calculate 25% off, either multiply the price by 0.25 and subtract it, or simply multiply the original price by 0.75 to get the final price directly.',
          },
          {
            question: 'Is a discount the same as a rebate?',
            answer: 'A discount is usually applied at the time of purchase, reducing the immediate cost. A rebate is typically a partial refund given after the purchase has been made.',
          },
          {
            question: 'How do I calculate double discounts?',
            answer: 'Apply the first discount to the original price, then apply the second discount to the new, already-discounted price. Do not simply add the percentages together.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
