'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function StandardDeviationCalculator() {
  const [input, setInput] = useState('10, 20, 30, 40, 50');

  const r = useMemo(() => {
    const numbers = input.split(/[, \n]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
    if (numbers.length < 2) return null;

    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (numbers.length - 1);
    const sd = Math.sqrt(variance);

    return {
      mean,
      variance,
      sd,
      count: numbers.length,
      min: Math.min(...numbers),
      max: Math.max(...numbers)
    };
  }, [input]);

  return (
    <>
      <JsonLd type="calculator"
        name="Standard Deviation Calculator"
        description="Calculate mean, variance, and standard deviation for a set of numbers. Essential for statistics students and data analysis."
        url="https://calcpro.com.np/calculator/standard-deviation" />

      <CalcWrapper
        title="Standard Deviation Calculator"
        description="Calculate mean, variance, and standard deviation for a set of numbers. Essential for statistics students."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Standard Deviation' }]}
        relatedCalcs={[
          { name: 'Scientific', slug: 'scientific-calculator' },
          { name: 'Percentage', slug: 'percentage' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enter Numbers (comma or space separated)</label>
                <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-32 p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold resize-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {r ? (
              <>
                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Standard Deviation</div>
                  <div className="text-3xl font-bold font-mono mb-4">{r.sd.toFixed(4)}</div>
                  <div className="space-y-3 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 font-medium">Mean</span>
                      <span className="font-mono font-bold">{r.mean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 font-medium">Variance</span>
                      <span className="font-mono font-bold">{r.variance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-80 font-medium">Count</span>
                      <span className="font-mono font-bold">{r.count}</span>
                    </div>
                  </div>
                </div>

                <ShareResult 
                  title="Standard Deviation Result" 
                  result={r.sd.toFixed(4)} 
                  calcUrl={`https://calcpro.com.np/calculator/standard-deviation`} 
                />
              </>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 text-center text-[10px] font-bold uppercase tracking-widest">
                Enter at least 2 numbers
              </div>
            )}
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is Standard Deviation?',
            answer: 'Standard deviation is a measure of the amount of variation or dispersion of a set of values. A low standard deviation indicates that the values tend to be close to the mean, while a high standard deviation indicates that the values are spread out over a wider range.',
          },
          {
            question: 'How is Standard Deviation calculated?',
            answer: 'To calculate standard deviation: 1. Find the mean. 2. For each number, subtract the mean and square the result. 3. Find the average of those squared differences (this is the variance). 4. Take the square root of the variance.',
          },
          {
            question: 'What is the difference between population and sample standard deviation?',
            answer: 'Population standard deviation is used when you have data for the entire population. Sample standard deviation is used when you have a subset of the population. Our calculator uses the sample standard deviation formula (dividing by n-1).',
          },
          {
            question: 'Why is Standard Deviation important?',
            answer: 'It is a key tool in statistics, finance, and science to understand the consistency and predictability of data. For example, in finance, it is used to measure the volatility of an investment.',
          },
          {
            question: 'What does a standard deviation of 0 mean?',
            answer: 'A standard deviation of 0 means that all the numbers in the set are identical to each other and to the mean.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
