'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function StandardDeviationCalculator() {
  const [input, setInput] = useState('10, 20, 30, 40, 50');

  const r = useMemo(() => {
    const numbers = input.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n));
    if (numbers.length < 2) return null;
    const mean    = numbers.reduce((a,b) => a+b, 0) / numbers.length;
    const variance = numbers.reduce((a,b) => a + Math.pow(b-mean, 2), 0) / (numbers.length-1);
    const sd       = Math.sqrt(variance);
    return { mean, variance, sd, count: numbers.length, min: Math.min(...numbers), max: Math.max(...numbers), numbers };
  }, [input]);

  return (
    <CalculatorLayout
      title="Standard Deviation Calculator"
      description="Calculate mean, variance, and standard deviation for a set of numbers. Uses sample standard deviation (÷n−1) for statistical accuracy."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Enter Numbers (comma or space separated)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              className="w-full h-40 p-4 border border-[var(--border)] bg-white font-mono text-sm font-bold focus:border-[var(--primary)] outline-none resize-none"
              placeholder="e.g. 10, 20, 30, 40, 50" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Datasets</label>
            {[
              { label: 'Balanced set', data: '10, 20, 30, 40, 50' },
              { label: 'High spread',  data: '1, 5, 10, 50, 100, 200' },
              { label: 'Low spread',   data: '98, 99, 100, 101, 102' },
              { label: 'Exam scores',  data: '65, 72, 78, 84, 90, 55, 88' },
            ].map(d => (
              <button key={d.label} onClick={() => setInput(d.data)}
                className="w-full p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{d.label}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[140px]">{d.data}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula (Sample)</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">S = √[Σ(x−x̄)² / (n−1)]</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {r ? (
            <>
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Standard Deviation</div>
                <div className="text-7xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{r.sd.toFixed(4)}</div>
                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">{r.count} numbers</div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Mean (x̄)',    val: r.mean.toFixed(4) },
                  { label: 'Variance',    val: r.variance.toFixed(4) },
                  { label: 'Count (n)',   val: r.count },
                  { label: 'Min',         val: r.min },
                  { label: 'Max',         val: r.max },
                  { label: 'Range',       val: r.max - r.min },
                ].map(({ label, val }) => (
                  <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                    <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                    <span className="text-sm font-black font-mono text-[var(--text-main)]">{val}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-5 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold">Enter at least 2 numbers to calculate.</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is standard deviation?', answer: 'A measure of how spread out numbers are from the mean. Low SD = values cluster near mean; high SD = values are spread wide.' },
          { question: 'Sample vs population standard deviation?', answer: 'Sample SD divides by (n−1) and is used when your data is a subset. Population SD divides by n for complete datasets. This calculator uses sample SD.' },
          { question: 'Why is standard deviation important?', answer: 'It measures data consistency and is essential in statistics, finance (investment volatility), and quality control.' },
        ]} />
      }
    />
  );
}
