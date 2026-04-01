'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Receipt, Banknote, Landmark } from 'lucide-react';

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}


export default function NepalVATCalculator() {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState(1000);

  const result = useMemo(() => {
    const rate = 0.13; // 13% VAT
    let original = 0;
    let vatAmount = 0;
    let final = 0;

    if (mode === 'add') {
      original = amount;
      vatAmount = original * rate;
      final = original + vatAmount;
    } else {
      final = amount;
      original = final / (1 + rate);
      vatAmount = final - original;
    }

    return { original, vatAmount, final };
  }, [mode, amount]);

  return (
    <CalculatorErrorBoundary calculatorName="Nepal VAT Calculator">
      <JsonLd type="calculator"
        name="Nepal VAT Calculator (13%)"
        description="Calculate 13% VAT for Nepal. Easily add or remove VAT from any amount. Updated for 2082/83 Nepal tax rules."
        url="https://calcpro.com.np/calculator/nepal-vat" />

      <CalcWrapper
        title="Nepal VAT Calculator"
        description="Calculate 13% Value Added Tax (VAT) for Nepal. Instantly add VAT to a price or extract it from a total amount."
        crumbs={[{label:'nepal rules',href:'/calculator?cat=nepal'}, {label:'vat calculator'}]}
        isNepal
        relatedCalcs={[
          {name:'Income Tax 2082/83',slug:'nepal-income-tax'},
          {name:'Salary Calculator',slug:'nepal-salary'},
          {name:'Discount Calculator',slug:'discount-calculator'},
        ]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm transition-all overflow-hidden relative">
              <div className="flex bg-gray-50 dark:bg-gray-800/40 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 mb-10">
                <button
                  onClick={() => setMode('add')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all min-h-[48px] ${mode === 'add' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm border border-blue-50' : 'text-gray-400'}`}
                >
                  Add VAT (13%)
                </button>
                <button
                  onClick={() => setMode('remove')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all min-h-[48px] ${mode === 'remove' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm border border-blue-50' : 'text-gray-400'}`}
                >
                  Remove VAT
                </button>
              </div>

              <div className="space-y-8">
                <ValidatedInput
                  label={mode === 'add' ? 'Price (VAT Exclusive)' : 'Total Price (VAT Inclusive)'}
                  value={amount}
                  onChange={setAmount}
                  min={0}
                  max={100000000}
                  prefix="Rs."
                  formatter={(n) => fmt(n)}
                  required
                />

                <div className="pt-8 border-t border-gray-50 dark:border-gray-800 lg:pt-10">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Common Amounts</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[1000, 5000, 10000, 50000].map(v => (
                      <button 
                        key={v} 
                        onClick={() => setAmount(v)}
                        className="py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-blue-500 text-[10px] font-black transition-all"
                      >
                        Rs. {fmt(v)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setAmount(1000); setMode('add'); }} 
                className="w-full py-4 mt-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 hover:text-red-500 transition-all font-black"
              >
                Reset Calculator
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-800 px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Breakdown</h3>
                  <div className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Nepal Standard</div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-widest text-[10px]">Net Amount</span>
                    <span className="font-mono text-gray-900 dark:text-white">Rs. {fmt(result.original)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-widest text-[10px]">VAT (13%)</span>
                    <span className="font-mono text-blue-600">+Rs. {fmt(result.vatAmount)}</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]">Gross Price</span>
                    <span className="font-mono font-black text-gray-900 dark:text-white text-3xl">Rs. {fmt(result.final)}</span>
                  </div>
                </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="VAT Result"
              primaryResult={{
                label: mode === 'add' ? 'Total with VAT' : 'Excl. VAT Amount',
                value: `Rs. ${fmt(mode === 'add' ? result.final : result.original)}`,
                description: mode === 'add' ? 'Gross Price' : 'Net Price',
                bgColor: 'bg-blue-600',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'VAT Amount', value: `Rs. ${fmt(result.vatAmount)}` },
                { label: 'Gross Total', value: `Rs. ${fmt(result.final)}` },
                { label: 'Excl. VAT', value: `Rs. ${fmt(result.original)}` },
                { label: 'VAT Rate', value: '13%' },
              ]}
              onShare={() => {}}
            />

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                  <Receipt className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Tax Method</div>
                  <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nepal IRD</div>
               </div>
               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                  <Landmark className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard</div>
                  <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">VAT 2082/83</div>
               </div>
            </div>

            <ShareResult 
              title="VAT Calculation" 
              result={`Rs. ${fmt(result.final)}`} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-vat?a=${amount}&m=${mode}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the current VAT rate in Nepal?',
            answer: 'The standard Value Added Tax (VAT) rate in Nepal is 13%. It is applied to most goods and services, although some items are exempt.',
          },
          {
            question: 'How do I calculate VAT in Nepal?',
            answer: 'To add VAT, multiply amount by 1.13. To remove VAT, divide by 1.13.',
          }
        ]} />
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
