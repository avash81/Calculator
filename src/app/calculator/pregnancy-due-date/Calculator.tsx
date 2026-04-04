'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Calendar, Baby } from 'lucide-react';

export default function PregnancyDueDateCalculator() {
  const [lmp, setLmp] = useState(new Date().toISOString().split('T')[0]);

  const r = useMemo(() => {
    const d = new Date(lmp);
    d.setMonth(d.getMonth() + 9); d.setDate(d.getDate() + 7);
    const diff = d.getTime() - new Date().getTime();
    const daysLeft = Math.max(0, Math.ceil(diff / 86400000));
    const weeksPregnant = Math.floor((280 - daysLeft) / 7);
    const daysPregnant  = (280 - daysLeft) % 7;
    const progress = Math.max(0, Math.min(100, ((280 - daysLeft) / 280) * 100));
    return { dueDate: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), daysLeft, weeksPregnant, daysPregnant, progress };
  }, [lmp]);

  const TRIMESTERS = [
    { label: '1st Trimester', range: 'Week 1–13',  detail: 'Development of major organs.' },
    { label: '2nd Trimester', range: 'Week 14–26', detail: 'Baby starts moving & growing rapidly.' },
    { label: '3rd Trimester', range: 'Week 27–40', detail: 'Final development before birth.' },
  ];

  return (
    <CalculatorLayout
      title="Pregnancy Due Date Calculator"
      description="Estimate your expected due date using Naegele's Rule (LMP + 280 days). Track trimester progress and days remaining."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Last Menstrual Period (LMP)</label>
            <div className="flex items-center border border-[var(--border)] bg-white">
              <Calendar className="w-4 h-4 ml-3 text-[var(--text-muted)] shrink-0" />
              <input type="date" value={lmp} onChange={e => setLmp(e.target.value)}
                className="flex-1 h-12 px-3 bg-transparent font-bold text-sm focus:outline-none" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-5 bg-white border border-[var(--border)] space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
              <span>Pregnancy Progress</span>
              <span>{r.weeksPregnant}w {r.daysPregnant}d / 40w 0d</span>
            </div>
            <div className="h-4 bg-gray-200 w-full overflow-hidden">
              <div className="h-full bg-pink-500 transition-all duration-700" style={{ width: `${r.progress}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
              <span>LMP</span><span>13w</span><span>26w</span><span>Due Date</span>
            </div>
          </div>

          {/* Trimesters */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Trimester Guide</h3>
            </div>
            {TRIMESTERS.map((t, i) => (
              <div key={i} className="px-4 py-3 border-b border-[var(--border)] last:border-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] font-black text-[var(--text-main)]">{t.label}</span>
                  <span className="text-[10px] font-bold text-[var(--primary)]">{t.range}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{t.detail}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-pink-50 border border-pink-200">
            <p className="text-[12px] text-pink-800 leading-relaxed"><strong>Method:</strong> Naegele's Rule — LMP + 9 months + 7 days (equals LMP + 280 days).</p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Baby className="w-5 h-5 text-pink-500" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Estimated Due Date</div>
            </div>
            <div className="text-2xl font-black text-pink-600 tracking-tight mb-3">{r.dueDate}</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2">{r.daysLeft}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">days to go</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Current Pregnancy</span>
              <span className="text-sm font-black text-pink-600">{r.weeksPregnant}w {r.daysPregnant}d</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">LMP Date</span>
              <span className="text-sm font-black text-[var(--text-main)]">{lmp}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Progress</span>
              <span className="text-sm font-black text-[var(--primary)]">{r.progress.toFixed(1)}%</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">Only ~5% of babies are born exactly on the due date. Consult your OB/GYN for medical guidance.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How is the due date calculated?', answer: 'Using Naegele\'s Rule: add 9 months and 7 days to the first day of your LMP, equaling 280 days total.' },
          { question: 'How accurate is this calculator?', answer: 'The due date is an estimate. Only about 5% of babies are born on their exact due date. An ultrasound provides more precision.' },
          { question: 'What if I don\'t know my LMP?', answer: 'Your healthcare provider can estimate the due date using an early ultrasound measurement of the fetus.' },
        ]} />
      }
    />
  );
}
