'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import NepaliDate from 'nepali-date-converter';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

function convertADtoBS(dateStr: string) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const npDate = new NepaliDate(date);
    return npDate.format('YYYY-MM-DD');
  } catch (e) {
    return null;
  }
}

function convertBStoAD(dateStr: string) {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    
    // NepaliDate constructor handles YYYY-MM-DD for BS
    const npDate = new NepaliDate(y, m - 1, d);
    const adDate = npDate.toJsDate();
    return adDate.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
}

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

export default function NepaliDateConverter() {
  const [tab, setTab] = useState<'ad2bs' | 'bs2ad'>('ad2bs');
  const [inputDate, setInputDate] = useState('');
  const [todayAD, setTodayAD] = useState('');
  const [todayBS, setTodayBS] = useState('');

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const npToday = new NepaliDate(now);
    
    setTodayAD(today);
    setTodayBS(npToday.format('YYYY-MM-DD'));
    setInputDate(today);
  }, []);

  const result = useMemo(() => {
    if (!inputDate) return null;
    
    let converted = '';
    let dayIndex = 0;
    
    if (tab === 'ad2bs') {
      converted = convertADtoBS(inputDate) || '';
      const d = new Date(inputDate);
      if (!isNaN(d.getTime())) dayIndex = d.getDay();
    } else {
      converted = convertBStoAD(inputDate) || '';
      const d = new NepaliDate(inputDate);
      dayIndex = d.getDay();
    }

    if (!converted) return null;

    // Calculate days diff
    const targetAD = tab === 'ad2bs' ? inputDate : converted;
    const diffTime = new Date(targetAD).getTime() - new Date(todayAD).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: converted,
      dayEn: DAYS_EN[dayIndex],
      dayNp: DAYS_NP[dayIndex],
      diffDays
    };
  }, [inputDate, tab, todayAD]);

  return (
    <>
      <JsonLd type="calculator"
        name="Nepali Date Converter AD to BS"
        description="Convert English date (AD) to Nepali date (BS) and vice versa instantly. Accurate Nepali calendar converter for Nepal."
        url="https://calcpro.com.np/calculator/nepali-date" />

      <CalcWrapper
        title="Nepali Date Converter"
        description="Convert dates between Bikram Sambat (BS) and Anno Domini (AD) instantly. Accurate Nepali calendar converter for Nepal."
        crumbs={[{label:'nepal tools',href:'/calculator?cat=nepal'}, {label:'nepali date converter'}]}
        isNepal
        relatedCalcs={[
          {name:'Age Calculator',slug:'age-calculator'},
          {name:'Income Tax 2082/83',slug:'nepal-income-tax'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => { setTab('ad2bs'); setInputDate(todayAD); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors min-h-[44px] ${tab === 'ad2bs' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                AD to BS
              </button>
              <button
                onClick={() => { setTab('bs2ad'); setInputDate(todayBS); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors min-h-[44px] ${tab === 'bs2ad' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                BS to AD
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {tab === 'ad2bs' ? 'Enter English Date (AD)' : 'Enter Nepali Date (BS)'}
                </label>
                <input
                  type={tab === 'ad2bs' ? 'date' : 'text'}
                  placeholder={tab === 'bs2ad' ? 'YYYY-MM-DD' : ''}
                  value={inputDate}
                  onChange={e => setInputDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold text-gray-900 bg-white"
                />
                {tab === 'bs2ad' && <p className="text-xs text-gray-400 mt-1">Format: YYYY-MM-DD (e.g., 2080-01-15)</p>}
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => setInputDate(tab === 'ad2bs' ? todayAD : todayBS)} className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 min-h-[44px] transition-colors">
                  Set to Today
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg shadow-blue-900/20">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">
                Converted {tab === 'ad2bs' ? 'Nepali Date (BS)' : 'English Date (AD)'}
              </div>
              <div className="text-3xl font-bold font-mono mb-2">
                {result?.date || 'Invalid Date'}
              </div>
              {result && (
                <div className="text-xs font-bold uppercase tracking-widest opacity-90">
                  {result.dayEn} / {result.dayNp}
                </div>
              )}
            </div>
            
            {result && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Difference</div>
                <div className="text-sm font-semibold text-gray-900">
                  {result.diffDays === 0 ? 'Today' : 
                   result.diffDays > 0 ? `In ${result.diffDays} days` : 
                   `${Math.abs(result.diffDays)} days ago`}
                </div>
              </div>
            )}

            <ShareResult 
              title="Nepali Date Conversion" 
              result={result?.date || ''} 
              calcUrl={`https://calcpro.com.np/calculator/nepali-date`} 
            />
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Today&apos;s Date</p>
              <div className="space-y-1 font-mono">
                <p>AD: {todayAD}</p>
                <p>BS: {todayBS}</p>
              </div>
              <p className="mt-3 text-[10px] italic leading-relaxed">Note: This is a simplified demonstration converter. For official purposes, always verify with the official Nepal calendar (Panchanga).</p>
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the difference between AD and BS?',
            answer: 'AD (Anno Domini) is the Gregorian calendar used globally, while BS (Bikram Sambat) is the official lunar calendar of Nepal. BS is approximately 56 years and 8 months ahead of AD.',
          },
          {
            question: 'How many months are in the Nepali calendar?',
            answer: 'Like the Gregorian calendar, the Nepali calendar has 12 months: Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, and Chaitra.',
          },
          {
            question: 'Is the Nepali date converter accurate?',
            answer: 'Our converter uses standard conversion algorithms for the Nepal calendar. However, because the number of days in Nepali months can vary each year (30 to 32 days), it is always good to cross-verify with an official Panchanga for legal documents.',
          },
          {
            question: 'When does the Nepali New Year start?',
            answer: 'The Nepali New Year starts on the 1st of Baisakh, which usually falls in mid-April of the Gregorian calendar.',
          },
          {
            question: 'How to convert AD to BS manually?',
            answer: 'Manually converting is difficult because Nepali months don\'t have fixed days. Generally, you add 56 years, 8 months, and 17 days to the AD date, but using an online converter is much more reliable.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
