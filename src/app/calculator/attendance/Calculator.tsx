'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function AttendanceCalculator() {
  const [total, setTotal]     = useState(50);
  const [present, setPresent] = useState(35);
  const [target, setTarget]   = useState(75);
  const [future, setFuture]   = useState(10);

  const r = useMemo(() => {
    const current       = total > 0 ? (present / total) * 100 : 0;
    const finalPotential = (total + future) > 0 ? ((present + future) / (total + future)) * 100 : 0;
    const needed  = current < target ? Math.max(0, Math.ceil((target * total - 100 * present) / (100 - target))) : 0;
    const canMiss = current > target ? Math.max(0, Math.floor((100 * present - target * total) / target)) : 0;
    const status  = current >= target ? 'safe' : finalPotential >= target ? 'warning' : 'danger';
    return { current, needed, canMiss, finalPotential, status };
  }, [total, present, target, future]);

  const STATUS_MAP = { safe: { label: 'Safe Zone ✓', color: '#006600' }, warning: { label: 'Recoverable ⚠', color: '#b45309' }, danger: { label: 'Critical ✗', color: '#dc2626' } };
  const s = STATUS_MAP[r.status as keyof typeof STATUS_MAP];

  const inputCls = "w-full h-12 px-4 border border-[var(--border)] bg-white font-bold text-xl focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="Attendance Calculator"
      description="Check if you meet Nepal's 75% attendance requirement. See how many classes you can still miss or need to attend to reach your target."
      category={{ label: 'Education', href: '/calculator/category/education' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Classes Held</label>
              <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} min={1} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Classes Attended</label>
              <input type="number" value={present} onChange={e => setPresent(Number(e.target.value))} min={0} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Classes Remaining</label>
              <input type="number" value={future} onChange={e => setFuture(Number(e.target.value))} min={0} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Target %</label>
              <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min={0} max={100} className={inputCls} />
            </div>
          </div>

          {/* Target Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Targets</label>
            <div className="grid grid-cols-4 gap-2">
              {[75, 80, 85, 90].map(t => (
                <button key={t} onClick={() => setTarget(t)}
                  className={`py-3 text-xs font-black border transition-all ${target === t ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {t}%
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-5 bg-white border border-[var(--border)] space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
              <span>Attendance Progress</span>
              <span>{r.current.toFixed(1)}% / {target}%</span>
            </div>
            <div className="h-4 bg-gray-200 w-full overflow-hidden relative">
              <div className="h-full transition-all duration-700" style={{ width: `${Math.min(r.current, 100)}%`, backgroundColor: s.color }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-[var(--primary)]" style={{ left: `${Math.min(target, 100)}%` }} />
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Vertical line = target ({target}%)</div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Current % Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Current Attendance</div>
            <div className="text-7xl font-black tracking-tighter mb-3" style={{ color: s.color }}>{r.current.toFixed(1)}<span className="text-3xl">%</span></div>
            <div className="inline-block px-4 py-1 text-xs font-black uppercase tracking-widest border" style={{ color: s.color, borderColor: s.color }}>{s.label}</div>
          </div>

          {/* Key Info */}
          <div className="space-y-3">
            {r.status !== 'safe' && r.needed > 0 && (
              <div className="p-5 bg-red-50 border border-red-200 flex justify-between">
                <span className="text-[11px] font-bold uppercase text-red-700">Classes Needed</span>
                <span className="text-sm font-black text-red-700">{r.needed} more</span>
              </div>
            )}
            {r.status === 'safe' && (
              <div className="p-5 bg-green-50 border border-green-200 flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[#006600]">Can Still Miss</span>
                <span className="text-sm font-black text-[#006600]">{r.canMiss} classes</span>
              </div>
            )}
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Target</span>
              <span className="text-sm font-black text-[var(--primary)]">{target}%</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Max Potential</span>
              <span className="text-sm font-black text-[var(--text-main)]">{r.finalPotential.toFixed(1)}%</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Present / Total</span>
              <span className="text-sm font-black text-[var(--text-main)]">{present} / {total}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the minimum attendance in Nepal?', answer: 'Most universities in Nepal (TU, KU, PU) require a minimum of 75% attendance to sit for final exams.' },
          { question: 'How is attendance percentage calculated?', answer: 'Attendance % = (Classes Attended / Total Classes Held) × 100.' },
          { question: 'How many classes can I miss at 75%?', answer: 'In 100 total classes, you can miss at most 25. Our calculator finds this number precisely based on your actual figures.' },
        ]} />
      }
    />
  );
}
