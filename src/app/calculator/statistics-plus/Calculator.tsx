'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { BarChart3, ListFilter, TrendingUp, Info } from 'lucide-react';

export default function StatisticsPlus() {
  const [input, setInput] = useState('10, 25, 30, 45, 30, 15, 20, 30');

  const stats = useMemo(() => {
    const nums = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;

    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const counts: Record<number, number> = {};
    let max = 0;
    nums.forEach(n => {
      counts[n] = (counts[n] || 0) + 1;
      if (counts[n] > max) max = counts[n];
    });
    const modes = Object.keys(counts).filter(k => counts[Number(k)] === max).map(Number);

    const range = sorted[sorted.length - 1] - sorted[0];
    const min = sorted[0];
    const maxVal = sorted[sorted.length - 1];

    return { mean, median, mode: modes, range, min, max: maxVal, count: nums.length, sorted };
  }, [input]);

  return (
    <>
      <JsonLd type="calculator" name="Mean, Median, Mode Calculator" description="Free online calculator to find the mean, median, mode, and range of any data set." url="https://calcpro.com.np/calculator/statistics-plus" />
      
      <CalcWrapper
        title="Mean, Median, Mode"
        description="Analyze any data set to find central tendency (arithmetic mean, median, and mode) and statistical range."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'statistics'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-8">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BarChart3 className="w-40 h-40" />
                 </div>
                 
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Enter Dataset (Numbers separated by commas or space)</label>
                 <textarea 
                   value={input} 
                   onChange={e=>setInput(e.target.value)}
                   className="w-full h-32 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-3xl p-6 text-xl font-bold text-gray-800 outline-none transition-all placeholder:text-gray-300"                    placeholder="e.g. 5, 10, 15, 10"
                 />
                 
                 <div className="mt-8 flex gap-3 flex-wrap">
                    {['1,2,3,4,5', '10, 20, 20, 30', '15, 25, 45, 55, 65'].map(ex => (
                      <button key={ex} onClick={()=>setInput(ex)} className="px-5 py-2 bg-google-gray hover:bg-gray-200 text-[10px] font-black text-gray-500 rounded-full transition-all">Try: {ex}</button>
                    ))}
                 </div>
              </div>

              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-blue-500/5 shadow-xl">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><TrendingUp className="w-3 h-3" /> Mean</div>
                      <div className="text-4xl font-black text-gray-900">{stats.mean.toFixed(2)}</div>
                   </div>
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-green-500/5 shadow-xl">
                      <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><ListFilter className="w-3 h-3" /> Median</div>
                      <div className="text-4xl font-black text-gray-900">{stats.median}</div>
                   </div>
                   <div className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-orange-500/5 shadow-xl">
                      <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Info className="w-3 h-3" /> Mode</div>
                      <div className="text-4xl font-black text-gray-900">{stats.mode.length > 2 ? 'Multi' : stats.mode.join(', ')}</div>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl">
                 <div className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-6 border-b border-white/20 pb-4">Detailed Metrics</div>
                 {stats && (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-70">Total Count (N)</span>
                         <span>{stats.count} items</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-70">Statistical Range</span>
                         <span>{stats.range}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-70">Minimum Value</span>
                         <span>{stats.min}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="opacity-70">Maximum Value</span>
                         <span>{stats.max}</span>
                      </div>
                      <div className="pt-4 border-t border-white/10 mt-4">
                         <div className="text-[10px] font-black opacity-50 mb-2">Sorted Data:</div>
                         <div className="flex flex-wrap gap-1">
                            {stats.sorted.slice(0, 10).map((n, i) => <span key={i} className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono">{n}</span>)}
                            {stats.sorted.length > 10 && <span className="text-[10px] opacity-50">...</span>}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
              <ShareResult title="Statistics Calculated" result={stats ? `Mean ${stats.mean.toFixed(1)}` : ''} calcUrl="https://calcpro.com.np/calculator/statistics-plus" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is the mean?', answer: 'The arithmetic mean is the average of the data set, found by adding all numbers together and dividing by the total count.' },
            { question: 'Can there be more than one mode?', answer: 'Yes. If multiple numbers appear with the same maximum frequency, the data set is "multimodal". If no number repeats, there is "no mode".' }
          ]} />
        </div>

      </CalcWrapper>
    </>
  );
}
