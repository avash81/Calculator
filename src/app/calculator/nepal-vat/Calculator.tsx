'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

export default function NepalVATCalculator() {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState(10000);
  const debAmount = useDebounce(amount, 300);

  const result = useMemo(() => {
    const rate = 0.13; // 13% VAT
    let original = 0;
    let vatAmount = 0;
    let final = 0;

    if (mode === 'add') {
      original = debAmount;
      vatAmount = original * rate;
      final = original + vatAmount;
    } else {
      final = debAmount;
      original = final / (1 + rate);
      vatAmount = final - original;
    }

    return { original, vatAmount, final };
  }, [mode, debAmount]);

  return (
    <>
      <JsonLd type="calculator"
        name="Nepal VAT Calculator (13%)"
        description="Calculate 13% VAT for Nepal. Easily add or remove VAT from any amount. Updated for latest Nepal tax rules."
        url="https://calcpro.com.np/calculator/nepal-vat" />

      <CalcWrapper
        title="Nepal VAT Calculator"
        description="Calculate 13% Value Added Tax (VAT) for Nepal. Easily add VAT to a price or extract VAT from a total amount."
        crumbs={[{label:'nepal rules',href:'/calculator?cat=nepal'}, {label:'vat calculator'}]}
        isNepal
        relatedCalcs={[
          {name:'Income Tax 2082/83',slug:'nepal-income-tax'},
          {name:'Salary Calculator',slug:'nepal-salary'},
          {name:'Discount Calculator',slug:'discount-calculator'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setMode('add')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors min-h-[44px] ${mode === 'add' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Add VAT (13%)
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors min-h-[44px] ${mode === 'remove' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Remove VAT
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {mode === 'add' ? 'Amount (Excluding VAT)' : 'Total Amount (Including VAT)'}
                </label>
                <div className="relative">
                  <input
                    type="number" inputMode="numeric" pattern="[0-9]*"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold text-gray-900 bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">NPR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">
                {mode === 'add' ? 'Total with VAT' : 'Original Amount'}
              </div>
              <div className="text-4xl font-bold font-mono mb-2">
                NPR {fmt(mode === 'add' ? result.final : result.original)}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Breakdown
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Original Amount</span>
                  <span className="font-mono font-bold text-gray-900">{fmt(result.original)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">VAT Amount (13%)</span>
                  <span className="font-mono font-bold text-red-500">+{fmt(result.vatAmount)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Total Price</span>
                  <span className="font-mono font-bold text-blue-600 text-xl">{fmt(result.final)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="VAT Calculation" 
              result={`NPR ${fmt(result.final)}`} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-vat?a=${amount}&m=${mode}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the current VAT rate in Nepal?',
            answer: 'The standard Value Added Tax (VAT) rate in Nepal is 13%. It is applied to most goods and services, although some essential items are VAT-exempt.',
          },
          {
            question: 'How do I calculate VAT in Nepal?',
            answer: 'To add VAT, multiply the original amount by 0.13. To remove VAT from a total price, divide the total by 1.13 to get the original amount, then subtract that from the total to find the VAT component.',
          },
          {
            question: 'Which items are exempt from VAT in Nepal?',
            answer: 'Basic food items like rice, flour, pulses, vegetables, and fruits are generally exempt. Additionally, health services, education, and some agricultural tools are also VAT-exempt under the Value Added Tax Act of Nepal.',
          },
          {
            question: 'Is VAT registration mandatory for all businesses in Nepal?',
            answer: 'VAT registration is mandatory if a business deals in taxable goods and has an annual turnover exceeding NPR 5 million (for goods) or NPR 2 million (for services or a mix of both).',
          },
          {
            question: 'What is the difference between VAT inclusive and exclusive?',
            answer: 'VAT inclusive means the price already includes the 13% tax. VAT exclusive means the tax will be added on top of the listed price.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
