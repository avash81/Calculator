'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function MarksNeededCalculator() {
  const [current, setCurrent] = useState(60);
  const [target, setTarget] = useState(75);
  const [weight, setWeight] = useState(40); // Weight of final exam

  const r = useMemo(() => {
    // Current grade contributes (100 - weight)%
    // Final exam grade contributes weight%
    // target = current * (1 - weight/100) + final * (weight/100)
    // final = (target - current * (1 - weight/100)) / (weight/100)
    const finalNeeded = (target - current * (1 - weight / 100)) / (weight / 100);
    return Math.max(0, finalNeeded);
  }, [current, target, weight]);

  return (
    <>
      <JsonLd type="calculator"
        name="Marks Needed Calculator"
        description="Calculate the minimum score you need on your final exam to achieve your target overall grade. Perfect for students planning their study goals."
        url="https://calcpro.com.np/calculator/marks-needed" />

      <CalcWrapper
        title="Marks Required Calculator"
        description="Calculate the minimum score you need on your final exam to achieve your target overall grade."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Marks Needed' }]}
        relatedCalcs={[
          { name: 'GPA Calculator', slug: 'gpa' },
          { name: 'Percentage', slug: 'percentage' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Grade (%)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={current} onChange={e => setCurrent(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Target Grade (%)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={target} onChange={e => setTarget(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Final Exam Weight (%)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Required Score</div>
              <div className="text-4xl font-bold font-mono mb-2">{r.toFixed(1)}%</div>
              <div className="inline-flex px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                {r > 100 ? 'Impossible' : 'Achievable'}
              </div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                You need {r.toFixed(1)}% on your final exam to reach a total of {target}%.
              </div>
            </div>

            <ShareResult 
              title="Marks Needed Result" 
              result={`${r.toFixed(1)}%`} 
              calcUrl={`https://calcpro.com.np/calculator/marks-needed`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How do I use the Marks Needed Calculator?',
            answer: 'Enter your current grade percentage, the overall target grade you want to achieve, and the percentage weight of your final exam. The calculator will tell you the minimum score you need on that final exam.',
          },
          {
            question: 'What does "Final Exam Weight" mean?',
            answer: 'It is the percentage of your total course grade that the final exam represents. For example, if your final exam is worth 40% of your grade, enter 40.',
          },
          {
            question: 'What if the required score is over 100%?',
            answer: 'If the calculator shows a score over 100%, it means it is mathematically impossible to reach your target grade even with a perfect score on the final exam.',
          },
          {
            question: 'Can I use this for individual assignments?',
            answer: 'Yes, as long as you know the current weighted average of your other assignments and the weight of the assignment you are calculating for.',
          },
          {
            question: 'Is this calculator accurate for all grading systems?',
            answer: 'This calculator uses a standard weighted average formula which is common in most schools and universities. However, always check your specific course syllabus for unique grading rules.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
