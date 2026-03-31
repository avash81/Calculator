'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function RomanNumeralsCalculator() {
  const [number, setNumber] = useState('10');
  const [roman, setRoman] = useState('X');

  const toRoman = (num: number): string => {
    const map: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [v, s] of map) {
      while (num >= v) {
        result += s;
        num -= v;
      }
    }
    return result;
  };

  const fromRoman = (rom: string): number => {
    const map: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let result = 0;
    let i = 0;
    while (i < rom.length) {
      const s1 = rom[i];
      const s2 = rom[i + 1];
      if (s2 && map[s1 + s2]) {
        result += map[s1 + s2];
        i += 2;
      } else {
        result += map[s1] || 0;
        i++;
      }
    }
    return result;
  };

  const handleNumberChange = (val: string) => {
    setNumber(val);
    const n = parseInt(val);
    if (!isNaN(n) && n > 0 && n < 4000) {
      setRoman(toRoman(n));
    } else {
      setRoman('');
    }
  };

  const handleRomanChange = (val: string) => {
    const upper = val.toUpperCase();
    setRoman(upper);
    const n = fromRoman(upper);
    if (n > 0) {
      setNumber(String(n));
    } else {
      setNumber('');
    }
  };

  return (
    <>
      <JsonLd type="calculator"
        name="Roman Numerals Converter"
        description="Convert Arabic numbers to Roman numerals and vice versa. Supports numbers from 1 to 3,999. Includes a reference table for standard Roman numeral symbols."
        url="https://calcpro.com.np/calculator/roman-numerals" />

      <CalcWrapper
        title="Roman Numerals Converter"
        description="Convert Arabic numbers to Roman numerals and vice versa. Supports numbers from 1 to 3,999."
        crumbs={[{ label: 'Math', href: '/calculator?cat=math' }, { label: 'Roman Numerals' }]}
        relatedCalcs={[
          { name: 'Number to Words', slug: 'number-to-words' },
          { name: 'Scientific', slug: 'scientific-calculator' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Number (1-3999)</label>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={number} onChange={e => handleNumberChange(e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
              <div className="flex items-center justify-center py-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Converter</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Roman Numeral</label>
                <input type="text" inputMode="decimal" pattern="[0-9.]*" value={roman} onChange={e => handleRomanChange(e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold uppercase" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Reference Table</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { r: 'I', n: 1 }, { r: 'V', n: 5 }, { r: 'X', n: 10 },
                  { r: 'L', n: 50 }, { r: 'C', n: 100 }, { r: 'D', n: 500 },
                  { r: 'M', n: 1000 }
                ].map(item => (
                  <div key={item.r} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100">
                    <span className="font-mono font-bold text-blue-600">{item.r}</span>
                    <span className="text-[10px] text-gray-500 font-bold">{item.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ShareResult 
              title="Roman Numeral Conversion" 
              result={`${number} = ${roman}`} 
              calcUrl={`https://calcpro.com.np/calculator/roman-numerals`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I convert numbers to Roman numerals?',
            answer: 'Simply enter an Arabic number (1-3999) into the input field, and the converter will instantly show the Roman numeral equivalent.',
          },
          {
            question: 'What are the basic Roman numeral symbols?',
            answer: 'The basic symbols are I (1), V (5), X (10), L (50), C (100), D (500), and M (1000).',
          },
          {
            question: 'Why is there a limit of 3,999?',
            answer: 'Standard Roman numerals do not have a widely accepted way to represent numbers 4,000 and above without using special overline symbols (vinculum).',
          },
          {
            question: 'How do I read Roman numerals?',
            answer: 'Read from left to right. If a smaller symbol is before a larger one, subtract it (e.g., IV = 4). Otherwise, add them (e.g., VI = 6).',
          },
          {
            question: 'Is "IIII" a valid Roman numeral for 4?',
            answer: 'While "IV" is the standard subtractive form, "IIII" is sometimes used on clock faces for visual balance.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
