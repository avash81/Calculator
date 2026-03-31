'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function NumberToWordsCalculator() {
  const [number, setNumber] = useState('12345');

  const r = useMemo(() => {
    const num = parseInt(number);
    if (isNaN(num)) return 'Invalid Number';
    if (num === 0) return 'Zero';

    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    const helper = (n: number): string => {
      if (n < 20) return units[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
      if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + helper(n % 100) : '');
      return '';
    };

    let result = '';
    let temp = num;
    let scaleIndex = 0;

    while (temp > 0) {
      const chunk = temp % 1000;
      if (chunk !== 0) {
        const chunkStr = helper(chunk);
        result = chunkStr + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
      }
      temp = Math.floor(temp / 1000);
      scaleIndex++;
    }

    return result.trim();
  }, [number]);

  return (
    <>
      <JsonLd type="calculator"
        name="Number to Words Converter"
        description="Convert any number into its written English word representation. Useful for writing checks, legal documents, and educational purposes. Supports numbers up to trillions."
        url="https://calcpro.com.np/calculator/number-to-words" />

      <CalcWrapper
        title="Number to Words Converter"
        description="Convert any number into its written English word representation. Useful for writing checks, legal documents, and more."
        crumbs={[{ label: 'Math', href: '/calculator?cat=math' }, { label: 'Number to Words' }]}
        relatedCalcs={[
          { name: 'Roman Numerals', slug: 'roman-numerals' },
          { name: 'Scientific', slug: 'scientific-calculator' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enter Number</label>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={number} onChange={e => setNumber(e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Written Representation</div>
              <div className="text-xl font-bold font-mono mb-4 leading-relaxed">{r}</div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                * Supports numbers up to trillions.
              </div>
            </div>

            <ShareResult 
              title="Number to Words" 
              result={r} 
              calcUrl={`https://calcpro.com.np/calculator/number-to-words?n=${number}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I convert a number to words?',
            answer: 'Simply enter the number into the input field, and the converter will automatically display the written English representation.',
          },
          {
            question: 'What is the largest number this converter can handle?',
            answer: 'This converter supports numbers up to the trillions (999,999,999,999,999).',
          },
          {
            question: 'Is this useful for writing checks?',
            answer: 'Yes, converting numbers to words is a standard requirement for writing the amount on a check to prevent tampering.',
          },
          {
            question: 'Does it support decimal numbers?',
            answer: 'This specific version is designed for whole numbers. For currency, you would typically add "and [cents/paisa]" after the main amount.',
          },
          {
            question: 'What is the difference between million and billion?',
            answer: 'In the standard international system, a million is 1,000,000 (6 zeros) and a billion is 1,000,000,000 (9 zeros).',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
