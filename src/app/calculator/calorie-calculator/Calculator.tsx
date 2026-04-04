'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const ACTIVITY_LEVELS = [
  { id: 'sedentary',  label: 'Sedentary',          desc: 'Little/no exercise',     mult: 1.2   },
  { id: 'light',      label: 'Lightly Active',      desc: '1–3 days/week',          mult: 1.375 },
  { id: 'moderate',   label: 'Moderately Active',   desc: '3–5 days/week',          mult: 1.55  },
  { id: 'very',       label: 'Very Active',          desc: '6–7 days/week',          mult: 1.725 },
  { id: 'extra',      label: 'Extra Active',         desc: 'Physical job',           mult: 1.9   },
];

export default function CalorieCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge]       = useState(25);
  const [male, setMale]     = useState(true);
  const [activity, setActivity] = useState('moderate');

  const result = useMemo(() => {
    if (!weight || !height || !age) return null;
    const bmr = male
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const mult = ACTIVITY_LEVELS.find(a => a.id === activity)!.mult;
    const tdee = Math.round(bmr * mult);
    return {
      bmr: Math.round(bmr), tdee,
      lose1:  Math.max(1200, tdee - 1000),
      lose05: Math.max(1200, tdee - 500),
      gain:   tdee + 500,
    };
  }, [weight, height, age, male, activity]);

  const GOALS = result
    ? [
        { label: 'Lose 1 kg/week',   cal: result.lose1,  color: 'text-red-600'  },
        { label: 'Lose 0.5 kg/week', cal: result.lose05, color: 'text-amber-600'},
        { label: 'Maintain Weight',  cal: result.tdee,   color: 'text-[#006600]'},
        { label: 'Gain 0.5 kg/week', cal: result.gain,   color: 'text-[var(--primary)]' },
      ]
    : [];

  return (
    <CalculatorLayout
      title="Daily Calorie Calculator"
      description="Calculate your daily calorie needs (TDEE) using the Mifflin-St Jeor equation. Get personalized targets for weight loss, maintenance, and gain."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
          {/* Gender */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Biological Sex</label>
            <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-surface)]">
              {[{ v: true, l: 'Male' }, { v: false, l: 'Female' }].map(({ v, l }) => (
                <button key={l} onClick={() => setMale(v)}
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${male === v ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Stats inputs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Age', value: age, setter: setAge, unit: 'yrs', min: 10, max: 100 },
              { label: 'Weight', value: weight, setter: setWeight, unit: 'kg', min: 30, max: 200 },
              { label: 'Height', value: height, setter: setHeight, unit: 'cm', min: 100, max: 250 },
            ].map(({ label, value, setter, unit, min, max }) => (
              <div key={label} className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</label>
                <div className="relative">
                  <input type="number" value={value} onChange={e => setter(Number(e.target.value))} min={min} max={max}
                    className="w-full h-11 px-2 pr-7 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)] font-bold">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Activity Level</label>
            <div className="space-y-1">
              {ACTIVITY_LEVELS.map(a => (
                <button key={a.id} onClick={() => setActivity(a.id)}
                  className={`w-full p-4 border text-left flex justify-between items-center transition-all ${activity === a.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--border)] hover:bg-[var(--bg-subtle)]'}`}>
                  <span className="text-[12px] font-bold">{a.label}</span>
                  <span className={`text-[10px] font-medium ${activity === a.id ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>{a.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {result ? (
            <>
              {/* TDEE Hero */}
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Maintenance Calories (TDEE)</div>
                <div className="text-6xl font-black text-[#006600] tracking-tighter mb-2">{result.tdee.toLocaleString()}</div>
                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">kcal / day</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-2">BMR: {result.bmr.toLocaleString()} kcal</div>
              </div>

              {/* Goal Targets */}
              <div className="bg-white border border-[var(--border)]">
                <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
                  <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Calorie Targets by Goal</h3>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {GOALS.map(g => (
                    <div key={g.label} className="px-4 py-3 flex justify-between items-center hover:bg-[var(--bg-surface)]">
                      <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{g.label}</span>
                      <span className={`text-sm font-black font-mono ${g.color}`}>{g.cal.toLocaleString()} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 border border-[var(--border)] text-[var(--text-secondary)] text-sm">
              Enter your details to see results.
            </div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How are daily calories calculated?', answer: 'We use the Mifflin-St Jeor BMR equation, then multiply by the Harris-Benedict activity factor to get your TDEE (Total Daily Energy Expenditure).' },
          { question: 'What is BMR?', answer: 'Basal Metabolic Rate — the calories your body needs at complete rest to maintain organ function. Typically 60–75% of total energy expenditure.' },
          { question: 'How many calories to lose weight?', answer: 'A 500 kcal/day deficit leads to ~0.5 kg/week loss. Never go below 1200 cal/day (women) or 1500 cal/day (men) without medical supervision.' },
          { question: 'Is this accurate?', answer: 'The Mifflin-St Jeor formula is accurate within ±10% for most people. Use this as a starting point and adjust based on real-world results.' },
        ]} />
      }
    />
  );
}
