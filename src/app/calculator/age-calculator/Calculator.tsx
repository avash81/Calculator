'use client';
import { useState, useMemo, useEffect } from 'react';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Calendar, Timer, Gift, Star, Hourglass, Zap } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const DEFAULT_STATE = {
  dob: '1995-06-15',
  targetDate: new Date().toISOString().split('T')[0],
};

export default function AgeCalculator() {
  const [state, setState] = useLocalStorage('calcpro_age_v2', DEFAULT_STATE);
  const { dob, targetDate } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const analysis = useMemo(() => {
    if (!dob || !targetDate) return null;

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

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
    const totalMonths = (years * 12) + months;

    // Next birthday
    let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBday.getTime() < d2.getTime()) {
      nextBday = new Date(d2.getFullYear() + 1, d1.getMonth(), d1.getDate());
    }
    const nextBdayDays = Math.ceil((nextBday.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d1.getDay()];

    return { years, months, days, totalDays, totalWeeks, totalMonths, nextBdayDays, dayOfWeek };
  }, [dob, targetDate]);

  return (
    <CalculatorErrorBoundary calculatorName="Age Calculator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
             Life Milestones
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Age <span className="text-amber-600">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Calculate your exact age in years, months, and days. Discover fun facts about your time on Earth and track your next big celebration.
          </p>
        </div>

        {/* Input Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date of Birth</label>
                   <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date"
                        value={dob}
                        onChange={(e) => updateState({ dob: e.target.value })}
                        className="w-full h-14 pl-14 pr-6 bg-gray-50 dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Age at the date of</label>
                   <div className="relative">
                      <Timer className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date"
                        value={targetDate}
                        onChange={(e) => updateState({ targetDate: e.target.value })}
                        className="w-full h-14 pl-14 pr-6 bg-gray-50 dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all"
                      />
                   </div>
                </div>
             </div>

             {/* Milestones Grid */}
             {analysis && (
               <div className="pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-1">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Days</span>
                     <div className="text-xl font-black text-gray-900 dark:text-white">{analysis.totalDays.toLocaleString()}</div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-1">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Weeks</span>
                     <div className="text-xl font-black text-gray-900 dark:text-white">{analysis.totalWeeks.toLocaleString()}</div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-1">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Months</span>
                     <div className="text-xl font-black text-gray-900 dark:text-white">{analysis.totalMonths.toLocaleString()}</div>
                  </div>
               </div>
             )}
          </div>

          {/* Results side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
             {analysis ? (
               <>
                 <ResultCard
                   label="Your Precise Age"
                   value={`${analysis.years}Y ${analysis.months}M`}
                   color="yellow"
                   title={`${analysis.days} Days Remaining`}
                   copyValue={`My exact age is ${analysis.years} years, ${analysis.months} months, and ${analysis.days} days.`}
                 />

                 <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-5 shadow-sm text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                       <Gift className="w-5 h-5 text-rose-500" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Birthday</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">In {analysis.nextBdayDays} Days</div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mark your calendar!</p>
                 </div>

                 <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-2">
                       <Star className="w-4 h-4 text-amber-400" />
                       <h3 className="text-[11px] font-black uppercase tracking-widest">Born on a {analysis.dayOfWeek}</h3>
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-80">
                       You were born during {analysis.years > 0 ? (analysis.years % 12 + ' years ago cycles') : 'this year cycle'}. Time is a precious resource!
                    </p>
                 </div>
               </>
             ) : (
               <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                 <p className="font-black uppercase tracking-widest text-xs">Selection Error</p>
                 <p className="font-bold">Provide a valid birth date.</p>
               </div>
             )}
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'How is the precise age calculated?',
                  answer: 'The calculator finds the difference between the current date and your DOB. It accounts for leap years and the specific number of days in each intervening month to provide exact precision.'
                },
                {
                  question: 'What is "Total Days Lived"?',
                  answer: 'This is the absolute count of days since your arrival on Earth, not including the current day. It is a popular metric for "Days Since Birth" social media trends.'
                },
                {
                  question: 'Does this support Nepali Date (B.S.)?',
                  answer: 'This specific tool uses the Gregorian calendar (A.D.). For Bikram Sambat conversions, please use our dedicated "Nepali Date Converter" in the utility section.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
