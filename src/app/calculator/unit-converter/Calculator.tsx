'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

const CONVERSIONS = {
  length: {
    base: 'm',
    units: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    }
  },
  weight: {
    base: 'kg',
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
      oz: 0.0283495,
      ton: 1000,
    }
  },
  temperature: {
    base: 'C',
    units: {
      C: (v: number) => v,
      F: (v: number) => (v - 32) * 5/9,
      K: (v: number) => v - 273.15,
    },
    toBase: {
      C: (v: number) => v,
      F: (v: number) => (v * 9/5) + 32,
      K: (v: number) => v + 273.15,
    }
  },
  area: {
    base: 'sqm',
    units: {
      sqkm: 1000000,
      sqm: 1,
      sqcm: 0.0001,
      hectare: 10000,
      acre: 4046.86,
      sqmile: 2589988.11,
      sqyard: 0.836127,
      sqfoot: 0.092903,
      sqinch: 0.00064516,
      // Nepal Specific Units (Based on sqm)
      ropani: 508.72,
      aana: 31.80,
      paisa: 7.95,
      daam: 1.99,
      bigha: 6772.63,
      kattha: 338.63,
      dhur: 16.93,
    }
  },
  volume: {
    base: 'l',
    units: {
      cum: 1000,
      l: 1,
      ml: 0.001,
      gallon_us: 3.78541,
      quart_us: 0.946353,
      pint_us: 0.473176,
      cup_us: 0.24,
      fl_oz_us: 0.0295735,
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof CONVERSIONS>('length');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m');

  // Reset fromUnit when category changes
  useMemo(() => {
    setFromUnit(Object.keys(CONVERSIONS[category].units)[0]);
  }, [category]);

  const result = useMemo(() => {
    const catData = CONVERSIONS[category];
    const results: Record<string, number> = {};

    if (category === 'temperature') {
      // Special handling for temperature
      const baseValue = (catData as any).units[fromUnit](value);
      Object.keys(catData.units).forEach(unit => {
        results[unit] = (catData as any).toBase[unit](baseValue);
      });
    } else {
      // Standard multiplier conversion
      const baseValue = value * (catData.units as Record<string, number>)[fromUnit];
      Object.keys(catData.units).forEach(unit => {
        results[unit] = baseValue / (catData.units as Record<string, number>)[unit];
      });
    }

    return results;
  }, [category, value, fromUnit]);

  return (
    <>
      <JsonLd type="calculator"
        name="Unit Converter"
        description="Convert between different units of length, weight, temperature, area, and volume instantly. Supports metric and imperial units."
        url="https://calcpro.com.np/calculator/unit-converter" />

      <CalcWrapper
        title="Unit Converter"
        description="Convert between different units of length, weight, temperature, area, and volume instantly."
        crumbs={[{label:'conversion',href:'/calculator?cat=conversion'}, {label:'unit converter'}]}
        relatedCalcs={[
          {name:'Age Calculator',slug:'age-calculator'},
          {name:'BMI Calculator',slug:'bmi'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
              {Object.keys(CONVERSIONS).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-widest transition-colors min-h-[44px] whitespace-nowrap ${category === cat ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Value</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold text-gray-900 bg-white" />
                </div>
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">From Unit</label>
                  <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 bg-white min-h-[44px] font-bold text-gray-900 bg-white">
                    {Object.keys(CONVERSIONS[category].units).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {category} Conversions
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {Object.entries(result).map(([unit, val]) => (
                  <div key={unit} className={`flex justify-between items-center text-sm p-3 rounded-lg border transition-all ${unit === fromUnit ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-gray-50'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${unit === fromUnit ? 'text-blue-600' : 'text-gray-400'}`}>{unit}</span>
                    <span className={`font-mono ${unit === fromUnit ? 'font-bold text-blue-700 text-lg' : 'font-bold text-gray-900'}`}>
                      {Number.isInteger(val) ? val.toLocaleString() : val.toFixed(4).replace(/\.?0+$/, '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ShareResult 
              title={`${category.charAt(0).toUpperCase() + category.slice(1)} Conversion`} 
              result={`${value} ${fromUnit}`} 
              calcUrl={`https://calcpro.com.np/calculator/unit-converter?v=${value}&f=${fromUnit}&c=${category}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I use the unit converter?',
            answer: 'Select a category (Length, Weight, Temperature, etc.), enter the value you want to convert, and choose the "From" unit. The converter will automatically show the equivalent values in all other supported units.',
          },
          {
            question: 'What length units are supported?',
            answer: 'We support kilometers (km), meters (m), centimeters (cm), millimeters (mm), miles, yards, feet, and inches.',
          },
          {
            question: 'How to convert Celsius to Fahrenheit?',
            answer: 'To convert Celsius to Fahrenheit, multiply the temperature by 9/5 and add 32. Our calculator handles this and other temperature conversions (Kelvin) automatically.',
          },
          {
            question: 'What is the conversion factor for kilograms to pounds?',
            answer: '1 kilogram is approximately equal to 2.20462 pounds. Our weight converter uses precise factors for all conversions.',
          },
          {
            question: 'Can I convert area and volume units?',
            answer: 'Yes, we support area conversions (sqm, hectare, acre, etc.) and volume conversions (liters, ml, gallons, cups, etc.).',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
