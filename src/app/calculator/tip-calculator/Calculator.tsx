'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function TipCalculator() {
  const [bill, setBill] = useState(1500);
  const [tipPercent, setTipPercent] = useState(10);
  const [people, setPeople] = useState(2);

  const r = useMemo(() => {
    const totalTip = (bill * tipPercent) / 100;
    const totalBill = bill + totalTip;
    const perPerson = people > 0 ? totalBill / people : 0;
    const tipPerPerson = people > 0 ? totalTip / people : 0;
    return { totalTip, totalBill, perPerson, tipPerPerson };
  }, [bill, tipPercent, people]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Tip Calculator"
        description="Split bills and calculate tips easily. Perfect for dining out with friends and family. Supports custom tip percentages and splitting between multiple people."
        url="https://calcpro.com.np/calculator/tip-calculator" />

      <CalcWrapper
        title="Tip Calculator"
        description="Split bills and calculate tips easily. Perfect for dining out with friends and family."
        crumbs={[{ label: 'Finance', href: '/calculator?cat=finance' }, { label: 'Tip Calculator' }]}
        relatedCalcs={[
          { name: 'Discount Calculator', slug: 'discount-calculator' },
          { name: 'VAT Calculator', slug: 'nepal-vat' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Bill</label>
                <div className="relative">
                  <input type="number" inputMode="numeric" value={bill} onChange={e => setBill(+e.target.value)} className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">NPR</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tip (%)</label>
                  <input type="number" inputMode="numeric" value={tipPercent} onChange={e => setTipPercent(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">People</label>
                  <input type="number" inputMode="numeric" min={1} value={people} onChange={e => setPeople(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Per Person</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.perPerson)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Bill</span>
                  <span className="font-mono font-bold">{fmt(r.totalBill)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Tip</span>
                  <span className="font-mono font-bold text-green-300">+{fmt(r.totalTip)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Tip Per Person</span>
                  <span className="font-mono font-bold">{fmt(r.tipPerPerson)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Tip Calculation" 
              result={`${fmt(r.perPerson)}/person`} 
              calcUrl={`https://calcpro.com.np/calculator/tip-calculator?b=${bill}&t=${tipPercent}&p=${people}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I calculate a tip?',
            answer: 'To calculate a tip, multiply the total bill by the tip percentage (as a decimal). For example, a 10% tip on NPR 1500 is 1500 * 0.10 = NPR 150.',
          },
          {
            question: 'What is the standard tip percentage in Nepal?',
            answer: 'In Nepal, a 10% service charge is often included in the bill at many restaurants. If it is not included, a tip of 5-10% is appreciated but not mandatory.',
          },
          {
            question: 'How do I split a bill with a tip?',
            answer: 'Add the total tip to the original bill to get the final total, then divide that final total by the number of people in your group.',
          },
          {
            question: 'Should I tip if a service charge is already included?',
            answer: 'If a 10% service charge is already included in your bill, you are not expected to tip further, although you can leave a small amount if the service was exceptional.',
          },
          {
            question: 'How to calculate 15% tip easily?',
            answer: 'To calculate 15% quickly, find 10% of the bill (move the decimal one place to the left), then add half of that 10% amount to itself.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
