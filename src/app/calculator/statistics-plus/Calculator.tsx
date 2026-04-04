'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function StatisticsPlus() {
  const [input, setInput] = useState('10, 25, 30, 45, 30, 15, 20, 30');

  const stats = useMemo(() => {
    const nums = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) return null;
    const sorted = [...nums].sort((a, b) => a - b);
    const sum    = nums.reduce((a, b) => a + b, 0);
    const mean   = sum / nums.length;
    const mid    = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
    const counts: Record<number,number> = {};
    let maxFreq = 0;
    nums.forEach(n => { counts[n] = (counts[n]||0)+1; if (counts[n] > maxFreq) maxFreq = counts[n]; });
    const modes = Object.keys(counts).filter(k => counts[Number(k)] === maxFreq).map(Number);
    const range  = sorted[sorted.length-1] - sorted[0];
    return { mean, median, modes, range, min: sorted[0], max: sorted[sorted.length-1], count: nums.length, sorted };
  }, [input]);

  return (
    <CalculatorLayout
      title="Mean, Median & Mode Calculator"
      description="Analyze any dataset for central tendency. Calculate mean, median, mode, and range instantly with sorted data view."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Enter Dataset (comma or space separated)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              className="w-full h-40 p-4 border border-[var(--border)] bg-white font-mono text-sm font-bold focus:border-[var(--primary)] outline-none resize-none"
              placeholder="e.g. 10, 20, 30, 20, 40" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Try an Example</label>
            {[
              { label: 'Symmetric set',  data: '1, 2, 3, 4, 5' },
              { label: 'Single mode',    data: '10, 20, 20, 30' },
              { label: 'Bimodal',        data: '5, 10, 10, 20, 20, 30' },
              { label: 'Exam scores',    data: '65, 72, 78, 84, 90, 55, 88, 72' },
            ].map(d => (
              <button key={d.label} onClick={() => setInput(d.data)}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{d.label}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[150px]">{d.data}</span>
              </button>
            ))}
          </div>

          {stats && (
            <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
              <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2">Sorted Data</div>
              <div className="flex flex-wrap gap-1">
                {stats.sorted.slice(0, 12).map((n, i) => (
                  <span key={i} className="bg-white border border-[var(--border)] px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--primary)]">{n}</span>
                ))}
                {stats.sorted.length > 12 && <span className="text-[10px] text-[var(--text-muted)]">…{stats.sorted.length - 12} more</span>}
              </div>
            </div>
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-4">
          {stats ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Mean',   val: stats.mean.toFixed(2), color: 'text-[var(--primary)]' },
                  { label: 'Median', val: String(stats.median),  color: 'text-[#006600]' },
                  { label: 'Mode',   val: stats.modes.length > 2 ? 'Multi' : stats.modes.join(', '), color: 'text-amber-700' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="p-5 bg-white border border-[var(--border)] text-center">
                    <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{label}</div>
                    <div className={`text-2xl font-black ${color}`}>{val}</div>
                  </div>
                ))}
              </div>

              {[
                { label: 'Range',        val: stats.range },
                { label: 'Min',          val: stats.min },
                { label: 'Max',          val: stats.max },
                { label: 'Count (n)',    val: stats.count },
                { label: 'Sum',          val: stats.mean * stats.count },
              ].map(({ label, val }) => (
                <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                  <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                  <span className="text-sm font-black font-mono text-[var(--text-main)]">{val}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="p-5 border border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold">Enter at least one number.</div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the mean?', answer: 'The arithmetic mean is the average — sum of all values divided by the count.' },
          { question: 'What is the median?', answer: 'The median is the middle value when data is sorted. For even counts, it is the average of the two middle values.' },
          { question: 'Can there be more than one mode?', answer: 'Yes. If two or more values appear the same number of times, the data is multimodal.' },
        ]} />
      }
    />
  );
}
