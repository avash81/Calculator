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

  const r = useMemo(() => {
    const current = total > 0 ? (present / total) * 100 : 0;
    
    let needed = 0;
    if (current < target) {
      // (present + needed) / (total + needed) = target / 100
      // 100p + 100n = target*t + target*n
      // n(100 - target) = target*t - 100p
      needed = Math.ceil((target * total - 100 * present) / (100 - target));
    }
    
    let canMiss = 0;
    if (current > target) {
      // present / (total + miss) = target / 100
      // 100p = target*t + target*m
      // m = (100p - target*t) / target
      canMiss = Math.floor((100 * present - target * total) / target);
    }

    return { current, needed, canMiss };
  }, [total, present, target]);

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
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Classes</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={total} onChange={e => setTotal(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Present Classes</label>
                  <input type="number" inputMode="numeric" pattern="[0-9.]*" value={present} onChange={e => setPresent(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Target Attendance (%)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[75, 80, 85, 90].map(t => (
                    <button key={t} onClick={() => setTarget(t)} className={`py-2 rounded-lg text-[10px] font-bold border-2 transition-all uppercase tracking-widest ${target === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                      {t}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-2xl p-6 text-white shadow-xl ${r.current >= target ? 'bg-green-600 shadow-green-900/20' : 'bg-red-600 shadow-red-900/20'}`}>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Current Attendance</div>
              <div className="text-4xl font-bold font-mono mb-4">{r.current.toFixed(1)}%</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                {r.current < target ? (
                  <div className="text-sm font-medium">
                    You need to attend <span className="font-bold text-yellow-300 underline underline-offset-4">{r.needed}</span> more classes to reach {target}%.
                  </div>
                ) : (
                  <div className="text-sm font-medium">
                    You can afford to miss <span className="font-bold text-yellow-300 underline underline-offset-4">{r.canMiss}</span> more classes while staying above {target}%.
                  </div>
                )}
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
