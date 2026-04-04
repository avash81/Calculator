'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function MarksNeededCalculator() {
  const [current, setCurrent] = useState(60);
  const [target, setTarget]   = useState(75);
  const [weight, setWeight]   = useState(40);

  const r = useMemo(() => {
    const finalNeeded = (target - current * (1 - weight / 100)) / (weight / 100);
    return Math.max(0, finalNeeded);
  }, [current, target, weight]);

  const isImpossible = r > 100;
  const inputCls = "w-full h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none";
  const WEIGHT_PRESETS = [20, 30, 40, 50, 60];
  const TARGET_PRESETS = [50, 60, 65, 75, 80];

  return (
    <CalculatorLayout
      title="Marks Needed Calculator"
      description="Calculate the minimum score you need on your final exam to achieve your target overall grade. Build exam study plans."
      category={{ label: 'Education', href: '/calculator/category/education' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-white border border-[var(--border)]">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Current Grade (%)</label>
              <input type="number" value={current} onChange={e => setCurrent(Number(e.target.value))} min={0} max={100} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Target Overall Grade (%)</label>
              <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min={0} max={100} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Final Exam Weight (%)</label>
              <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} min={0} max={100} className={inputCls} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Target Grades</label>
            <div className="grid grid-cols-5 gap-2">
              {TARGET_PRESETS.map(v => (
                <button key={v} onClick={() => setTarget(v)}
                  className={`py-2 text-xs font-black border transition-all ${target === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Final Exam Weights</label>
            <div className="grid grid-cols-5 gap-2">
              {WEIGHT_PRESETS.map(v => (
                <button key={v} onClick={() => setWeight(v)}
                  className={`py-2 text-xs font-black border transition-all ${weight === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">Required = (Target − Current × (1 − Weight/100)) / (Weight/100)</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Score Needed on Final</div>
            <div className={`text-7xl font-black tracking-tighter mb-3 ${isImpossible ? 'text-red-600' : r <= 70 ? 'text-[#006600]' : 'text-[var(--primary)]'}`}
              style={{ color: isImpossible ? '#dc2626' : r <= 70 ? '#006600' : '#b45309' }}>
              {r.toFixed(1)}<span className="text-3xl">%</span>
            </div>
            <div className={`inline-block px-4 py-1 text-xs font-black uppercase tracking-widest border ${isImpossible ? 'text-red-600 border-red-300' : 'text-[#006600] border-green-300'}`}>
              {isImpossible ? 'Not Achievable' : r <= 60 ? 'Easy Target' : r <= 80 ? 'Achievable' : 'Challenging'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Current Grade</span>
              <span className="text-sm font-black text-[var(--text-main)]">{current}%</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Target Grade</span>
              <span className="text-sm font-black text-[var(--primary)]">{target}%</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Final Exam Weight</span>
              <span className="text-sm font-black text-[var(--text-main)]">{weight}%</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What does "Final Exam Weight" mean?', answer: "It's the percentage of your total course grade that the final exam represents. If your final is 40% of your grade, enter 40." },
          { question: 'What if the required score is over 100%?', answer: 'It means it is mathematically impossible to reach your target even with a perfect score on the final exam.' },
          { question: 'Is this accurate for all grading systems?', answer: 'This uses a standard weighted average, common in most schools. Check your course syllabus for any unique weighting rules.' },
        ]} />
      }
    />
  );
}
