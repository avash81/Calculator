'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Calendar, Hourglass, MoveRight, Clock } from 'lucide-react';

export default function DateDuration() {
  const [start, setStart] = useState('2025-01-01');
  const [end, setEnd] = useState('2025-12-31');

  const diff = useMemo(() => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const ms = Math.abs(d2.getTime() - d1.getTime());
    const days = ms / (1000 * 60 * 60 * 24);
    const weeks = (days / 7).toFixed(1);
    const months = (days / 30.437).toFixed(1);
    const years = (days / 365.25).toFixed(2);

    return { days: Math.floor(days), weeks, months, years };
  }, [start, end]);

  return (
    <>
      <JsonLd type="calculator" name="Date Duration Calculator" description="Find the exact duration (days, weeks, months, years) between any two dates instantly." url="https://calcpro.com.np/calculator/date-duration" />
      
      <CalcWrapper
        title="Date Duration"
        description="Calculate the difference between two dates correctly, accounting for leap years and month lengths."
        crumbs={[{label:'conversion',href:'/calculator/category/conversion'},{label:'date duration'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Calendar className="w-40 h-40" />
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Start Date</label>
                       <div className="relative">
                          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="w-full h-14 bg-gray-50 rounded-2xl px-6 font-black text-lg focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">End Date</label>
                       <div className="relative">
                          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="w-full h-14 bg-gray-50 rounded-2xl px-6 font-black text-lg focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 flex items-center gap-6 justify-center">
                    <div className="w-12 h-12 bg-google-gray rounded-full flex items-center justify-center text-gray-300">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <MoveRight className="w-6 h-6 text-gray-200" />
                    <div className="w-12 h-12 bg-google-blue/10 rounded-full flex items-center justify-center text-google-blue">
                       <Clock className="w-6 h-6" />
                    </div>
                 </div>
              </div>

              {diff && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl text-center">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">Total Weeks</div>
                      <div className="text-3xl font-black text-gray-900">{diff.weeks}</div>
                   </div>
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl text-center">
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">Total Months</div>
                      <div className="text-3xl font-black text-gray-900">{diff.months}</div>
                   </div>
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl text-center">
                      <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">Total Years</div>
                      <div className="text-3xl font-black text-gray-900">{diff.years}</div>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Hourglass className="w-20 h-20 group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Exact Day Count</div>
                 <div className="text-7xl font-black mb-8 text-google-blue">{diff?.days}</div>
                 <div className="pt-8 border-t border-white/10 space-y-3">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Days Duration</div>
                    <div className="text-sm font-bold text-gray-400 leading-relaxed italic">
                      &quot;Duration excludes the start date and includes the end date for a precise count.&quot;                     </div>
                 </div>
              </div>
              <ShareResult title="Date Duration" result={diff ? `${diff.days} Days` : ''} calcUrl="https://calcpro.com.np/calculator/date-duration" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'Difference between two dates?', answer: 'It calculates the elapsed time between start and end date.' },
            { question: 'Does it count leap years?', answer: 'Yes, it accurately counts days including leap years.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
