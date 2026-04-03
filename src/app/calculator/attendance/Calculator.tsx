'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function AttendanceCalculator() {
  const [total, setTotal] = useState(50);
  const [present, setPresent] = useState(35);
  const [target, setTarget] = useState(75);
  const [future, setFuture] = useState(10); // Remaining classes in semester

  const r = useMemo(() => {
    const current = total > 0 ? (present / total) * 100 : 0;
    const finalPotential = (total + future) > 0 ? ((present + future) / (total + future)) * 100 : 0;
    
    let needed = 0;
    if (current < target) {
      needed = Math.max(0, Math.ceil((target * total - 100 * present) / (100 - target)));
    }
    
    let canMiss = 0;
    if (current > target) {
      canMiss = Math.max(0, Math.floor((100 * present - target * total) / target));
    }

    const status = current >= target ? 'safe' : (finalPotential >= target ? 'warning' : 'danger');

    return { current, needed, canMiss, finalPotential, status };
  }, [total, present, target, future]);

  return (
    <>
      <JsonLd type="calculator"
        name="Attendance Calculator"
        description="Check if you meet the minimum attendance requirement (usually 75% in Nepal). Calculate how many more classes you need to attend or can afford to miss."
        url="https://calcpro.com.np/calculator/attendance" />

      <CalcWrapper
        title="Attendance Calculator"
        description="Check if you meet the minimum attendance requirement (usually 75% in Nepal). Calculate how many more classes you need to attend or can afford to miss."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Attendance' }]}
        relatedCalcs={[
          { name: 'GPA Calculator', slug: 'gpa' },
          { name: 'CGPA Calculator', slug: 'cgpa' },
          { name: 'Percentage Calculator', slug: 'percentage' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Total Classes Held</label>
                  <input type="number" value={total} onChange={e => setTotal(+e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 outline-none font-black text-xl" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Classes Attended</label>
                  <input type="number" value={present} onChange={e => setPresent(+e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 outline-none font-black text-xl" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Classes Remaining</label>
                  <input type="number" value={future} onChange={e => setFuture(+e.target.value)} className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 outline-none font-black text-xl" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-1">Target Requirement</label>
                <div className="grid grid-cols-4 gap-2">
                  {[75, 80, 85, 90].map(t => (
                    <button key={t} onClick={() => setTarget(t)} className={`py-3 rounded-xl text-[10px] font-black border-2 transition-all uppercase tracking-widest ${target === t ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'}`}>
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group ${r.status === 'safe' ? 'bg-emerald-600 shadow-emerald-900/20' : r.status === 'warning' ? 'bg-amber-600 shadow-amber-900/20' : 'bg-rose-600 shadow-rose-900/20'}`}>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Current Status</div>
              <div className="text-6xl font-black mb-8 leading-tight">{r.current.toFixed(1)}%</div>
              
              <div className="pt-8 border-t border-white/20 space-y-5">
                {r.current < target ? (
                  <div className="text-sm font-medium leading-relaxed">
                    Condition: <span className="text-white font-black">{r.status === 'warning' ? 'RECOVERABLE' : 'CRITICAL'}</span><br/>
                    Attend <span className="font-black underline scale-110 inline-block px-1 bg-white/20 rounded mx-1">{r.needed}</span> more classes to hit {target}%.
                  </div>
                ) : (
                  <div className="text-sm font-medium leading-relaxed">
                    Condition: <span className="text-white font-black italic uppercase tracking-widest">Safe Zone ✓</span><br/>
                    You can miss <span className="font-black underline scale-110 inline-block px-1 bg-white/20 rounded mx-1">{r.canMiss}</span> more classes.
                  </div>
                )}

                <div className="p-4 bg-black/10 rounded-2xl border border-white/10">
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Max Potential</div>
                   <div className="text-lg font-black">{r.finalPotential.toFixed(1)}% if all future attended</div>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Attendance Status" 
              result={`${r.current.toFixed(1)}% Attendance`} 
              calcUrl={`https://calcpro.com.np/calculator/attendance`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the minimum attendance requirement in Nepal?',
            answer: 'Most educational institutions in Nepal, including schools and universities like TU, KU, and PU, typically require a minimum of 75% attendance to appear in final examinations.',
          },
          {
            question: 'How to calculate attendance percentage?',
            answer: 'To calculate your attendance percentage, divide the number of classes you attended by the total number of classes held, and then multiply by 100.',
          },
          {
            question: 'How many classes can I miss to maintain 75% attendance?',
            answer: 'If you have 100 total classes, you must attend at least 75. This means you can miss a maximum of 25 classes. Our calculator helps you find this exact number based on your current status.',
          },
          {
            question: 'What happens if I have low attendance?',
            answer: 'Low attendance (below the required threshold) may lead to being disqualified from taking final exams, losing internal marks, or having to repeat the semester or year.',
          },
          {
            question: 'Can I make up for low attendance?',
            answer: 'The best way to make up for low attendance is to attend all remaining classes. In some cases, institutions may allow extra assignments or medical certificates for genuine absences, but this depends on their specific policies.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
