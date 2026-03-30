'use client';
import { useState, useMemo, useEffect } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function AgeCalculator() {
  const [dob, setDob] = useState('1990-01-01');
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const result = useMemo(() => {
    if (!dob || !today) return null;

    const d1 = new Date(dob);
    const d2 = new Date(today);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBday.getTime() < d2.getTime()) {
      nextBday = new Date(d2.getFullYear() + 1, d1.getMonth(), d1.getDate());
    }
    const nextBdayDays = Math.ceil((nextBday.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d1.getDay()];

    return { years, months, days, totalDays, totalWeeks, totalHours, nextBdayDays, dayOfWeek };
  }, [dob, today]);

  return (
    <>
      <JsonLd type="calculator"
        name="Age Calculator"
        description="Calculate your exact age in years, months, and days. Find out how many days you've lived and your next birthday."
        url="https://calcpro.com.np/calculator/age-calculator" />

      <CalcWrapper
        title="Age Calculator"
        description="Calculate your exact age in years, months, and days. Find out how many days you've lived and your next birthday."
        crumbs={[{label:'conversion',href:'/calculator?cat=conversion'}, {label:'age calculator'}]}
        relatedCalcs={[
          {name:'Nepali Date Converter',slug:'nepali-date'},
          {name:'GPA Calculator',slug:'gpa'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Calculate age at</label>
              <input type="date" value={today} onChange={e => setToday(e.target.value)} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg shadow-blue-900/20">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">Age</div>
              <div className="text-3xl font-bold font-mono mb-2">
                {result ? `${result.years}Y ${result.months}M ${result.days}D` : '--'}
              </div>
            </div>

            {result && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fun Facts</div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Total Days Lived</span>
                    <span className="font-mono font-bold text-gray-900">{result.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Total Weeks</span>
                    <span className="font-mono font-bold text-gray-900">{result.totalWeeks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Total Hours (approx)</span>
                    <span className="font-mono font-bold text-gray-900">{result.totalHours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Born on a</span>
                    <span className="font-bold text-blue-600 uppercase text-xs tracking-widest">{result.dayOfWeek}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Next Birthday</span>
                    <span className="font-mono font-bold text-orange-500 text-lg">In {result.nextBdayDays} days</span>
                  </div>
                </div>
              </div>
            )}

            <ShareResult 
              title="My Age Result" 
              result={result ? `${result.years} Years, ${result.months} Months, ${result.days} Days` : ''} 
              calcUrl={`https://calcpro.com.np/calculator/age-calculator`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How is age calculated?',
            answer: 'Age is calculated by finding the difference between your date of birth and a specific date (usually today). It accounts for leap years and the varying number of days in different months.',
          },
          {
            question: 'Can I calculate age in months or days?',
            answer: 'Yes, our calculator provides your exact age in years, months, and days, as well as the total number of days, weeks, and hours you have lived.',
          },
          {
            question: 'What is the "Calculate age at" field?',
            answer: 'This field allows you to find out how old you were or will be on a specific date in the past or future, which is useful for legal documents or planning events.',
          },
          {
            question: 'Does this calculator work for leap years?',
            answer: 'Yes, the calculator correctly handles leap years (February 29th) to ensure your age is calculated with 100% accuracy.',
          },
          {
            question: 'How many days until my next birthday?',
            answer: 'The calculator automatically determines your next birthday and shows you exactly how many days are remaining until that date.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
