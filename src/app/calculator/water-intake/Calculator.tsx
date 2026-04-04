'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Droplets } from 'lucide-react';

const ACTIVITY_OPTS = [
  { label: 'Sedentary (0 min)',  mins: 0   },
  { label: 'Light (30 min)',     mins: 30  },
  { label: 'Moderate (60 min)', mins: 60  },
  { label: 'Active (90 min)',    mins: 90  },
  { label: 'Very Active (120+)', mins: 120 },
];

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(30);

  const r = useMemo(() => {
    const base = weight * 35;
    const extra = (activity / 30) * 350;
    const totalMl = base + extra;
    return { totalMl, liters: totalMl / 1000, glasses: Math.ceil(totalMl / 250) };
  }, [weight, activity]);

  const glasses = Array.from({ length: Math.min(r.glasses, 12) }, (_, i) => i);

  return (
    <CalculatorLayout
      title="Daily Water Intake Calculator"
      description="Calculate your optimal daily water intake based on body weight and exercise level. Personalized hydration recommendations."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
          {/* Weight */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Body Weight</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{weight} kg</span>
            </div>
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} min={20} max={300}
              className="w-full h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none" />
            <input type="range" min={20} max={200} step={1} value={weight} onChange={e => setWeight(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Activity */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Daily Exercise Level</label>
            <div className="space-y-1">
              {ACTIVITY_OPTS.map(a => (
                <button key={a.mins} onClick={() => setActivity(a.mins)}
                  className={`w-full p-4 border text-left flex justify-between items-center transition-all ${activity === a.mins ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--border)] hover:bg-[var(--bg-subtle)]'}`}>
                  <span className="text-[12px] font-bold">{a.label}</span>
                  {a.mins > 0 && <span className={`text-[10px] font-medium ${activity === a.mins ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>+{(a.mins / 30 * 350 / 1000).toFixed(2)}L extra</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Formula note */}
          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">
              35ml × {weight}kg + ({activity}/30 × 350ml) = {r.totalMl.toFixed(0)}ml
            </code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Total Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Daily Recommendation</div>
            </div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2">{r.liters.toFixed(1)}<span className="text-3xl"> L</span></div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">≈ {r.glasses} glasses (250ml each)</div>
          </div>

          {/* Glass Visual */}
          <div className="p-5 bg-white border border-[var(--border)]">
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-3">Glass by Glass ({r.glasses} total)</div>
            <div className="flex flex-wrap gap-2">
              {glasses.map(i => (
                <div key={i} className="w-8 h-8 bg-blue-100 border border-blue-300 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
              ))}
              {r.glasses > 12 && (
                <div className="w-8 h-8 bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[9px] font-black text-[var(--text-muted)]">
                  +{r.glasses - 12}
                </div>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Base (weight-based)</span>
              <span className="text-sm font-black text-[var(--text-main)]">{(weight * 35 / 1000).toFixed(2)} L</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Exercise Bonus</span>
              <span className="text-sm font-black text-[#006600]">+ {((activity / 30) * 350 / 1000).toFixed(2)} L</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total in ml</span>
              <span className="text-sm font-black text-[var(--primary)]">{r.totalMl.toFixed(0)} ml</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How much water should I drink?', answer: 'A general guide is 35ml per kg of body weight daily, plus extra for exercise. The "8 glasses a day" rule is a simplification that doesn\'t account for weight or activity.' },
          { question: 'Does exercise increase water needs?', answer: 'Yes. Sweating causes fluid loss. A common recommendation is an extra 350ml (1 glass) per 30 minutes of moderate exercise.' },
          { question: 'Does coffee or tea count?', answer: 'Yes — caffeinated drinks do count toward daily fluid intake, though water remains the best source.' },
          { question: 'Signs of dehydration?', answer: 'Thirst, dark urine, fatigue, dizziness, and dry mouth are all signals you need more fluids.' },
        ]} />
      }
    />
  );
}
