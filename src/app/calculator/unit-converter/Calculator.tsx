'use client';
import { useState, useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ArrowRightLeft, Ruler, Scale, Droplets, Maximize } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const UNIT_CATEGORIES: any = {
  length: {
    name: 'Length',
    icon: Ruler,
    units: {
      m: { name: 'Meter', factor: 1 },
      km: { name: 'Kilometer', factor: 0.001 },
      cm: { name: 'Centimeter', factor: 100 },
      mm: { name: 'Millimeter', factor: 1000 },
      mi: { name: 'Mile', factor: 0.000621371 },
      yd: { name: 'Yard', factor: 1.09361 },
      ft: { name: 'Foot', factor: 3.28084 },
      in: { name: 'Inch', factor: 39.3701 },
    },
  },
  weight: {
    name: 'Weight',
    icon: Scale,
    units: {
      kg: { name: 'Kilogram', factor: 1 },
      g: { name: 'Gram', factor: 1000 },
      mg: { name: 'Milligram', factor: 1000000 },
      lb: { name: 'Pound', factor: 2.20462 },
      oz: { name: 'Ounce', factor: 35.274 },
      ton: { name: 'Metric Ton', factor: 0.001 },
    },
  },
  volume: {
    name: 'Volume',
    icon: Droplets,
    units: {
      l: { name: 'Liter', factor: 1 },
      ml: { name: 'Milliliter', factor: 1000 },
      m3: { name: 'Cubic Meter', factor: 0.001 },
      gallon: { name: 'US Gallon', factor: 0.264172 },
      cup: { name: 'Cup', factor: 4.22675 },
    },
  },
  area: {
    name: 'Area',
    icon: Maximize,
    units: {
      sqm: { name: 'Sq Meter', factor: 1 },
      sqkm: { name: 'Sq Kilometer', factor: 0.000001 },
      hectare: { name: 'Hectare', factor: 0.0001 },
      acre: { name: 'Acre', factor: 0.000247105 },
      sqft: { name: 'Sq Foot', factor: 10.7639 },
    }
  }
};

const DEFAULT_STATE = {
  category: 'length' as keyof typeof UNIT_CATEGORIES,
  fromUnit: 'm',
  toUnit: 'km',
  value: 1,
};

export default function UnitConverter() {
  const [state, setState] = useLocalStorage('calcpro_unit_v2', DEFAULT_STATE);
  
  const { category, fromUnit, toUnit, value } = state;
  const units = UNIT_CATEGORIES[category].units;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const swapUnits = () => {
    updateState({ fromUnit: toUnit, toUnit: fromUnit });
  };

  const convert = useMemo(() => {
    if (value < 0 && category !== 'temperature') return { result: '0', error: 'Negative values not supported for this category' };

    const fromFactor = units[fromUnit]?.factor || 1;
    const toFactor = units[toUnit]?.factor || 1;
    
    const baseValue = value / fromFactor;
    const resultValue = baseValue * toFactor;

    return {
      result: resultValue.toLocaleString(undefined, { maximumFractionDigits: 6 }),
      raw: resultValue,
      fromLabel: units[fromUnit]?.name || '',
      toLabel: units[toUnit]?.name || '',
      error: null
    };
  }, [value, fromUnit, toUnit, category, units]);

  return (
    <CalculatorErrorBoundary calculatorName="Unit Converter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
             Universal Utility
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Unit <span className="text-indigo-600">Converter</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Seamlessly switch between metric and imperial systems with high-precision scientific constants.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
          {Object.entries(UNIT_CATEGORIES).map(([key, cat]: [string, any]) => {
            const Icon = cat.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  const newFrom = Object.keys(cat.units)[0];
                  const newTo = Object.keys(cat.units)[1] || newFrom;
                  updateState({ category: key as any, fromUnit: newFrom, toUnit: newTo });
                }}
                className={`flex-1 min-w-[120px] py-4 rounded-[1.25rem] flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  category === key
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Converter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              {/* FROM SECTION */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Convert From</label>
                <ValidatedInput
                  label=""
                  variant="minimal"
                  value={value}
                  onChange={(v) => updateState({ value: v })}
                />
                <select
                  value={fromUnit}
                  onChange={(e) => updateState({ fromUnit: e.target.value })}
                  className="w-full h-14 px-6 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 font-bold outline-none focus:border-indigo-500 transition-all"
                >
                  {Object.entries(units).map(([k, u]: [string, any]) => (
                    <option key={k} value={k}>{u.name}</option>
                  ))}
                </select>
              </div>

              {/* SWAP BUTTON */}
              <button 
                onClick={swapUnits}
                className="lg:mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:scale-110 active:scale-95 transition-all mx-auto border border-indigo-100 dark:border-indigo-800"
              >
                <ArrowRightLeft className="w-5 h-5 rotate-90 md:rotate-0" />
              </button>

              {/* TO SECTION */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Target Unit</label>
                <div className="h-14 flex items-center px-6 bg-indigo-50/50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl text-xl font-black text-indigo-600 tracking-tighter">
                  {convert.result}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => updateState({ toUnit: e.target.value })}
                  className="w-full h-14 px-6 border-2 border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 font-bold outline-none focus:border-indigo-500 transition-all"
                >
                  {Object.entries(units).map(([k, u]: [string, any]) => (
                    <option key={k} value={k}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUICK EQUALITIES GRID */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Fast Comparison Matrix</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {Object.entries(units).map(([k, u]: [string, any]) => {
                   const val = (value / units[fromUnit].factor) * u.factor;
                   return (
                     <div key={k} className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all ${k === toUnit ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'}`}>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${k === toUnit ? 'text-indigo-200' : 'text-gray-400'}`}>{k}</span>
                        <span className="text-xs font-black truncate w-full">{val.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            <ResultCard
              label="Final Conversion"
              value={convert.result}
              unit={` ${toUnit.toUpperCase()}`}
              color="purple"
              title="Metric"
              copyValue={`${value} ${fromUnit} = ${convert.result} ${toUnit}`}
            />

            <div className="bg-gray-900 text-white p-8 rounded-[2rem] space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Unit Summary</span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">From Name</span>
                    <span>{convert.fromLabel}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">To Name</span>
                    <span>{convert.toLabel}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Factor Diff</span>
                    <span>{(units[toUnit].factor / units[fromUnit].factor).toFixed(6)}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'How accurate are these conversions?',
                  answer: 'We use high-precision floating point constants derived from standard scientific SI benchmarks. This ensures accuracy for most engineering and daily utility use cases.'
                },
                {
                  question: 'Does this converter support Nepal-specific units?',
                  answer: 'While this tool focuses on universal units (Metric/Imperial), we have a dedicated "Nepal Land Calculator" for specialized units like Ropani, Bigha, Kattha, and Dhur.'
                },
                {
                  question: 'Why are there so many length units?',
                  answer: 'Distance measurements vary wildly across industries. For example, Miles are common in the US, Kilometers in Nepal, and Inches in construction. We provide all of them in one place for ease of use.'
                }
              ]}
           />
        </div>

      </div>
    </CalculatorErrorBoundary>
  );
}
