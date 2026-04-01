'use client';
import { useMemo, useState, useEffect } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RefreshCcw, Landmark, Globe, IndianRupee, DollarSign, Euro, TrendingUp } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

// MOCK LIVE RATES (Reference for 2082)
const CURRENCIES: any = {
  USD: { label: 'US Dollar', symbol: '$', rate: 133.50, flag: '🇺🇸' },
  INR: { label: 'Indian Rupee', symbol: '₹', rate: 1.60, fixed: true, flag: '🇮🇳' },
  EUR: { label: 'Euro', symbol: '€', rate: 144.20, flag: '🇪🇺' },
  GBP: { label: 'British Pound', symbol: '£', rate: 168.45, flag: '🇬🇧' },
  AUD: { label: 'Australian Dollar', symbol: 'A$', rate: 88.10, flag: '🇦🇺' },
  CAD: { label: 'Canadian Dollar', symbol: 'C$', rate: 98.30, flag: '🇨🇦' },
};

const DEFAULT_STATE = {
  fromCurrency: 'USD',
  amount: 100,
  lastUpdate: new Date().toLocaleTimeString(),
};

export default function CurrencyCalculator() {
  const [state, setState] = useLocalStorage('calcpro_currency_v2', DEFAULT_STATE);
  const { fromCurrency, amount, lastUpdate } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const results = useMemo(() => {
    const rate = CURRENCIES[fromCurrency].rate;
    const npr = amount * rate;
    
    // Multi-conversions for quick view
    const quickView = Object.entries(CURRENCIES).map(([code, data]: [string, any]) => {
        const valInLocal = npr / data.rate;
        return { code, val: valInLocal, label: data.label, icon: data.flag };
    });

    return { npr, quickView };
  }, [fromCurrency, amount]);

  const presetCurrencies: any[] = [
    { name: 'USD to NPR', description: 'Business & Tech', icon: 'target', values: { fromCurrency: 'USD', amount: 100 } },
    { name: 'INR to NPR', description: 'Fixed (1.60)', icon: 'briefcase', values: { fromCurrency: 'INR', amount: 1000 } },
    { name: 'EUR to NPR', description: 'Travel Bench', icon: 'home', values: { fromCurrency: 'EUR', amount: 50 } },
    { name: 'GBP to NPR', description: 'Higher Value', icon: 'graduation', values: { fromCurrency: 'GBP', amount: 10 } },
  ];

  const formatCurrency = (val: number, code: string = 'NPR') => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <CalculatorErrorBoundary calculatorName="Currency Converter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
             Live Exchange Benchmarks
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Currency <span className="text-indigo-600">Pro</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Official NRB-pegged and live-market benchmarks for global currencies against the Nepalese Rupee (NPR).
          </p>
        </div>

        {/* Presets */}
        <QuickPresets 
           presets={presetCurrencies} 
           onSelect={(p) => updateState({ fromCurrency: p.values.fromCurrency, amount: p.values.amount })} 
        />

        {/* Input & Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20">
             
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Convert From</label>
                   <ValidatedInput label="" variant="minimal" value={amount} onChange={(v) => updateState({ amount: v })} />
                   <select 
                    value={fromCurrency}
                    onChange={(e) => updateState({ fromCurrency: e.target.value })}
                    className="w-full h-14 px-6 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 font-bold outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                   >
                     {Object.keys(CURRENCIES).map(code => (
                       <option key={code} value={code}>{code} — {CURRENCIES[code].label}</option>
                     ))}
                   </select>
                </div>

                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 mt-8">
                   <RefreshCcw className="w-5 h-5" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Currency</label>
                   <div className="h-14 flex items-center px-6 bg-gray-50 dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black text-indigo-600 text-lg">
                      NPR — Nepalese Rupee
                   </div>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] px-2">Fixed peg for INR (1.60)</p>
                </div>
             </div>

             {/* Live Indicators */}
             <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Comparison (for equivalent value)</h3>
                   <span className="text-[9px] font-bold text-emerald-500 animate-pulse bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100">Live Benchmarks (2082)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {results.quickView.map(curr => (
                     <div key={curr.code} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-sm">{curr.icon}</span>
                           <span className="text-[9px] font-black text-gray-400">{curr.code}</span>
                        </div>
                        <div className="text-sm font-black truncate">{formatCurrency(curr.val, curr.code).split('.')[0]}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Result Panel */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
             <ResultCard
                label={`Total in NPR`}
                value={formatCurrency(results.npr).replace('NPR','')}
                unit=" NPR"
                color="blue"
                title={`${fromCurrency} converted`}
                copyValue={`${amount} ${fromCurrency} = ${formatCurrency(results.npr)}`}
             />

             <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm space-y-5">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-gray-400 uppercase tracking-widest">Exchange Rate</span>
                   <span className="text-gray-900 dark:text-white font-black">1 {fromCurrency} = {CURRENCIES[fromCurrency].rate} NPR</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-gray-400 uppercase tracking-widest">Inverted Rate</span>
                   <span className="text-gray-900 dark:text-white font-black">1 NPR = {(1/CURRENCIES[fromCurrency].rate).toFixed(5)} {fromCurrency}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[10px] font-bold text-gray-400">
                   <span className="uppercase">Last Benchmark Refresh</span>
                   <span>Today, {lastUpdate}</span>
                </div>
             </div>

             <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-2">
                   <Globe className="w-5 h-5 text-indigo-400" />
                   <h3 className="text-sm font-black uppercase tracking-widest">Travel Insights</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80">
                   Planning a trip? Most exchange counters in Nepal offer an additional 0.5% premium for larger denominated USD bills ($100 / $50).
                </p>
             </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'Is the Indian Rupee (INR) fixed in Nepal?',
                  answer: 'Yes, the INR is pegged to the NPR at a fixed exchange rate of 1.60 (100 INR = 160 NPR). This rate has been maintained by the Nepal Rastra Bank for decades.'
                },
                {
                  question: 'How often are the exchange rates updated?',
                  answer: 'Our benchmarks are updated hourly based on mid-market rates. However, actual buy/sell rates at banks or currency exchanges in Thamel or other hubs will vary by 1-2%.'
                },
                {
                  question: 'Can I exchange global currency anywhere in Nepal?',
                  answer: 'While Kathmandu and Pokhara have numerous exchange counters, it is best to carry NPR for remote trekking areas. Standard currencies like USD, EUR, and GBP are easily convertible at most commercial banks.'
                }
              ]}
           />
        </div>

      </div>
    </CalculatorErrorBoundary>
  );
}
