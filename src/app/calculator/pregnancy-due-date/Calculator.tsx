'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function PregnancyDueDateCalculator() {
  const [lmp, setLmp] = useState(new Date().toISOString().split('T')[0]);

  const r = useMemo(() => {
    const d = new Date(lmp);
    // Naegele's rule: LMP + 9 months + 7 days
    d.setMonth(d.getMonth() + 9);
    d.setDate(d.getDate() + 7);
    
    const diff = d.getTime() - new Date().getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return {
      dueDate: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      daysLeft: Math.max(0, daysLeft),
      weeks: Math.floor((280 - daysLeft) / 7),
      days: (280 - daysLeft) % 7
    };
  }, [lmp]);

  return (
    <>
      <JsonLd type="calculator"
        name="Pregnancy Due Date Calculator"
        description="Estimate your expected delivery date based on your last menstrual period (LMP) using Naegele's rule for accurate pregnancy tracking."
        url="https://calcpro.com.np/calculator/pregnancy-due-date" />

      <CalcWrapper
        title="Pregnancy Due Date Calculator"
        description="Estimate your expected delivery date based on your last menstrual period (LMP) using Naegele's rule."
        crumbs={[{ label: 'Health', href: '/calculator?cat=health' }, { label: 'Due Date' }]}
        relatedCalcs={[
          { name: 'BMI Calculator', slug: 'bmi' },
          { name: 'Water Intake', slug: 'water-intake' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Last Menstrual Period (LMP)</label>
                <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-pink-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Estimated Due Date</div>
              <div className="text-2xl font-bold font-mono mb-2">{r.dueDate}</div>
              <div className="inline-flex px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                {r.daysLeft} Days to Go
              </div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                Current Progress: {r.weeks} weeks and {r.days} days.
              </div>
            </div>

            <ShareResult 
              title="Due Date Result" 
              result={`${r.dueDate} (Estimated)`} 
              calcUrl={`https://calcpro.com.np/calculator/pregnancy-due-date`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How is the pregnancy due date calculated?',
            answer: 'The most common method is Naegele\'s rule, which adds 280 days (40 weeks) to the first day of your last menstrual period (LMP).',
          },
          {
            question: 'How accurate is the due date calculator?',
            answer: 'A due date is an estimate. Only about 5% of babies are born on their exact due date. Most are born within a week before or after.',
          },
          {
            question: 'What if I don\'t know my LMP?',
            answer: 'If you don\'t know your LMP, your healthcare provider can estimate your due date using an ultrasound scan, which measures the size of the fetus.',
          },
          {
            question: 'Can my due date change?',
            answer: 'Yes, your healthcare provider may adjust your due date if an early ultrasound provides a more accurate measurement of the baby\'s age.',
          },
          {
            question: 'Is a pregnancy always 40 weeks?',
            answer: 'A full-term pregnancy is typically considered to be between 37 and 42 weeks. 40 weeks is the average length.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
