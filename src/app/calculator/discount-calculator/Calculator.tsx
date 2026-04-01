'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Tag, ShoppingBag, Receipt, Percent } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

export default function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [discount, setDiscount] = useState(20);

  const r = useMemo(() => {
    const savings = (price * discount) / 100;
    const final = price - savings;
    return { savings, final };
  }, [price, discount]);

  return (
    <CalculatorErrorBoundary calculatorName="Discount Calculator">
      <JsonLd type="calculator"
        name="Advanced Discount Calculator"
        description="Calculate final sale prices and total savings instantly. High-precision tool for retail shopping and business discounts in Nepal."
        url="https://calcpro.com.np/calculator/discount-calculator" />

      <CalcWrapper
        title="Discount & Sale Suite"
        description="Calculate the final price after discounts and see exactly how much you save. Optimized for shopping, seasonal sales, and bulk retail."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'Discount Calculator' }]}
        relatedCalcs={[
          { name: 'VAT Calculator', slug: 'nepal-vat' },
          { name: 'Percentage Calc', slug: 'percentage' },
        ]}
        formula="Final Price = Original Price - (Original Price × Discount%)"
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
              <div className="space-y-10">
                <ValidatedInput
                  label="Original Price / MRP"
                  value={price}
                  onChange={setPrice}
                  min={0}
                  prefix="Rs."
                  required
                />

                <ValidatedInput
                  label="Discount Percentage (%)"
                  value={discount}
                  onChange={setDiscount}
                  min={0}
                  max={100}
                  suffix="%"
                  step={1}
                  required
                />
              </div>

              <div className="mt-12 pt-10 border-t border-gray-50 dark:border-gray-800">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Common Discount Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[5, 10, 25, 50].map(v => (
                    <button 
                      key={v} 
                      onClick={() => setDiscount(v)}
                      className={`h-14 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-black text-sm ${discount === v ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200'}`}
                    >
                      <Percent className="w-3 h-3" /> {v}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm group overflow-hidden relative transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-24 h-24" />
               </div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 px-2 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" /> Savings Summary
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100/50 dark:border-red-800/50">
                    <span className="text-[8px] font-black uppercase text-red-400 tracking-widest block mb-1">Total Savings</span>
                    <span className="text-xl font-black text-red-600 dark:text-red-400 font-mono tracking-tighter">Rs. {fmt(r.savings)}</span>
                  </div>
                  <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-800/50">
                    <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest block mb-1">Price After Off</span>
                    <span className="text-xl font-black text-blue-700 dark:text-blue-300 font-mono tracking-tighter">Rs. {fmt(r.final)}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="Sale Analysis"
              primaryResult={{
                label: 'Payable Amount',
                value: `Rs. ${fmt(r.final)}`,
                description: `You save Rs. ${fmt(r.savings)}`,
                bgColor: 'bg-green-600',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Off Amount', value: `Rs. ${fmt(r.savings)}` },
                { label: 'Off Pct', value: `${discount}%` },
                { label: 'Original', value: `Rs. ${fmt(price)}` },
                { label: 'Deal Status', value: discount >= 50 ? 'HOT DEAL' : 'GOOD SAVE' }
              ]}
              onShare={() => {}}
            />

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
               <Tag className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shopping Logic</div>
               <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                  {discount >= 50 ? 'This is a premium clearance-level discount. Excellent value for regular consumer goods.' : 
                  'Standard retail discount. Good for maintaining a monthly budget while shopping for essentials.'}
               </p>
            </div>

            <ShareResult title="My Savings Report" result={`Payable: Rs. ${fmt(r.final)} (Saved ${discount}%)`} calcUrl="https://calcpro.com.np/calculator/discount-calculator" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'How do I calculate a discount?', answer: 'To calculate a discount, multiply the original price by the discount percentage (as a decimal). Subtract this from the original price to get the final payable amount.' },
            { question: 'What is "Buy 1 Get 1 Free" discount equivalent?', answer: 'Buy 1 Get 1 Free is effectively a 50% discount on each item.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
