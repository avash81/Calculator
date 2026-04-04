'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function ZScoreCalc() {
  const [x, setX]         = useState(85);
  const [mu, setMu]       = useState(70);
  const [sigma, setSigma] = useState(10);

  const z = useMemo(() => sigma === 0 ? 0 : (x - mu) / sigma, [x, mu, sigma]);

  const interpretation =
    Math.abs(z) < 1  ? 'Within ±1σ (69% of distribution)' :
    Math.abs(z) < 2  ? 'Within ±2σ (95% of distribution)' :
    Math.abs(z) < 3  ? 'Within ±3σ (99.7% of distribution)' :
    'Outlier (>±3σ from mean)';

  const inputCls = "w-full h-12 px-4 border border-[var(--border)] bg-white font-mono font-bold text-xl focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="Z-Score Calculator"
      description="Calculate the standard score (Z-score) of any raw value in a normal distribution. Shows how many standard deviations a value is from the mean."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Raw Value (x)</label>
            <input type="number" value={x} onChange={e => setX(Number(e.target.value))} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Population Mean (μ)</label>
              <input type="number" value={mu} onChange={e => setMu(Number(e.target.value))} className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Std Deviation (σ)</label>
              <input type="number" value={sigma} onChange={e => setSigma(Number(e.target.value))} min={0.001} className={inputCls} />
            </div>
          </div>

          {/* Quick scenarios */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Try an Example</label>
            {[
              { label: 'Class exam (avg 70, σ=10)',    x: 85, μ: 70, σ: 10 },
              { label: 'Height (avg 170cm, σ=8)',      x: 185, μ: 170, σ: 8 },
              { label: 'IQ test (avg 100, σ=15)',      x: 130, μ: 100, σ: 15 },
            ].map(ex => (
              <button key={ex.label} onClick={() => { setX(ex.x); setMu(ex.μ); setSigma(ex.σ); }}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{ex.label}</span>
                <span className="text-[10px] text-[var(--text-muted)]">x={ex.x}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">Z = (x − μ) / σ</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Z-Score</div>
            <div className="text-7xl font-black text-[var(--primary)] tracking-tighter font-mono mb-3">{z.toFixed(4)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">
              {z > 0 ? `${z.toFixed(2)}σ above mean` : `${Math.abs(z).toFixed(2)}σ below mean`}
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2">Statistical Interpretation</div>
            <p className="text-sm font-bold text-[var(--text-main)]">{interpretation}</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Raw Value (x)',  val: x },
              { label: 'Mean (μ)',       val: mu },
              { label: 'Std Dev (σ)',    val: sigma },
              { label: 'x − μ',          val: x - mu },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                <span className="text-sm font-black font-mono text-[var(--text-main)]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a Z-score?', answer: 'A Z-score (standard score) measures how many standard deviations a value is above or below the population mean. Z=0 means exactly equal to the mean.' },
          { question: 'Is a higher Z-score better?', answer: 'It depends on context. In exams, higher Z-score = above average. In error tracking, lower/negative Z-score may be better.' },
          { question: 'What does Z=2 mean?', answer: 'Z=2 means the value is 2 standard deviations above the mean, placing it in approximately the top 2.3% of the distribution.' },
        ]} />
      }
    />
  );
}
