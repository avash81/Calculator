'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function NumberToWordsCalculator() {
  const [number, setNumber] = useState('12345');
  const [system, setSystem] = useState<'intl' | 'lakh'>('intl');
  const [isCurrency, setIsCurrency] = useState(false);
  const [currency, setCurrency] = useState<'NPR' | 'USD'>('NPR');

  const r = useMemo(() => {
    const num = parseInt(number);
    if (isNaN(num)) return { word: 'Invalid Number', val: number };
    if (num === 0) return { word: 'Zero', val: 0 };

    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const helper = (n: number): string => {
      if (n < 20) return units[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
      if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + helper(n % 100) : '');
      return '';
    };

    let result = '';
    if (system === 'intl') {
      const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
      let temp = num;
      let scaleIndex = 0;
      while (temp > 0) {
        const chunk = temp % 1000;
        if (chunk !== 0) result = helper(chunk) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
        temp = Math.floor(temp / 1000);
        scaleIndex++;
      }
    } else {
      // Lakh/Crore system
      let temp = num;
      if (temp >= 10000000) {
        result += helper(Math.floor(temp / 10000000)) + ' Crore ';
        temp %= 10000000;
      }
      if (temp >= 100000) {
        result += helper(Math.floor(temp / 100000)) + ' Lakh ';
        temp %= 100000;
      }
      if (temp >= 1000) {
        result += helper(Math.floor(temp / 1000)) + ' Thousand ';
        temp %= 1000;
      }
      if (temp > 0) result += helper(temp);
    }

    let final = result.trim();
    if (isCurrency) {
      if (currency === 'NPR') final = `Rupees ${final} Only`;
      else final = `${final} Dollars Only`;
    }

    return { word: final, val: num };
  }, [number, system, isCurrency, currency]);

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
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button onClick={()=>setSystem('intl')} className={`px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all border-2 ${system === 'intl' ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}>
                    International (Millions)
                 </button>
                 <button onClick={()=>setSystem('lakh')} className={`px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all border-2 ${system === 'lakh' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}>
                    South Asian (Lakh/Crore)
                 </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Enter Number</label>
                <input type="number" value={number} onChange={e => setNumber(e.target.value)} className="w-full h-16 px-8 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-600 outline-none font-black text-3xl transition-all" />
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                 <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Currency Mode</div>
                    <div className="text-xs font-bold text-gray-600">{isCurrency ? `Writing for ${currency}` : 'Convert plain number'}</div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={()=>setIsCurrency(!isCurrency)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCurrency ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-white text-gray-300'}`}>
                       $
                    </button>
                    {isCurrency && (
                      <select value={currency} onChange={e=>setCurrency(e.target.value as any)} className="bg-white px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-blue-600">
                         <option value="NPR">Rupees</option>
                         <option value="USD">Dollars</option>
                      </select>
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Word Result</div>
                <div className="text-2xl font-black text-blue-400 leading-tight mb-6">{r.word}</div>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => navigator.clipboard.writeText(r.word)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     Copy Words
                   </button>
                   <button 
                    onClick={() => navigator.clipboard.writeText(r.val.toLocaleString(system === 'intl' ? 'en-US' : 'en-IN'))}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     Copy Digits
                   </button>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 bg-blue-600 rounded-full" />
                 {system === 'intl' ? 'International Standard' : 'South Asian Standard'}
              </div>
            </div>

            <ShareResult 
              title="Number to Words" 
              result={r.word} 
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
