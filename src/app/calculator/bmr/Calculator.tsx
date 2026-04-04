'use client';
import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_STATE = {
  gender: 'male' as 'male' | 'female',
  age: 28,
  weight: 75,
  height: 175,
  activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'extra',
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: 'Sedentary', desc: 'Little or no exercise', factor: 1.2 },
  light: { label: 'Lightly Active', desc: 'Exercise 1-3 times/week', factor: 1.375 },
  moderate: { label: 'Moderately Active', desc: 'Exercise 4-5 times/week', factor: 1.55 },
  active: { label: 'Very Active', desc: 'Intense exercise daily', factor: 1.725 },
  extra: { label: 'Extra Active', desc: 'Physical job or 2x training', factor: 1.9 },
};

export default function BMRCalculator() {
  const [state, setState] = useLocalStorage('calcpro_bmr_v2', DEFAULT_STATE);
  const { gender, age, weight, height, activity } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const analysis = useMemo(() => {
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity].factor);
    return { bmr: Math.round(bmr), tdee };
  }, [gender, age, weight, height, activity]);

  return (
    <CalculatorLayout
      title="BMR Calculator"
      description="Professional Basal Metabolic Rate (BMR) and TDEE engine. Calculate your daily calorie requirements for weight management."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)] px-1">Biological Gender</label>
                 <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] p-1">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateState({ gender: g as 'male' | 'female' })}
                        className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${gender === g ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)]'}`}
                      >
                        {g}
                      </button>
                    ))}
                 </div>
              </div>
              <ValidatedInput label="Age" value={age} onChange={(v) => updateState({ age: v })} min={5} max={110} required />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput label="Weight (kg)" value={weight} onChange={(v) => updateState({ weight: v })} min={10} max={500} step={0.1} required />
              <ValidatedInput label="Height (cm)" value={height} onChange={(v) => updateState({ height: v })} min={50} max={300} step={0.1} required />
           </div>

           <div className="pt-6 border-t border-[var(--border)] space-y-4">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-secondary)] px-1">Activity Intensity</h3>
              <div className="space-y-2">
                 {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, data]) => (
                   <button
                      key={key}
                      onClick={() => updateState({ activity: key as any })}
                      className={`w-full p-4 border border-[var(--border)] text-left transition-all ${activity === key ? 'bg-[var(--bg-subtle)] border-[var(--primary)]' : 'bg-white hover:bg-gray-50'}`}
                   >
                      <div className="flex justify-between items-center">
                        <span className={`text-[12px] font-bold uppercase tracking-tight ${activity === key ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'}`}>{data.label}</span>
                        {activity === key && <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">{data.desc}</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      }
      rightPanel={
        <div className="space-y-8">
           <div className="text-center p-8 bg-white border border-[var(--border)]">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Daily Maintenance Calories</div>
              <div className="text-7xl font-black text-[#006600] tracking-tighter mb-2">{analysis.tdee}</div>
              <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">KCAL / Day</div>
           </div>

           <div className="space-y-4">
              <div className="p-4 border border-[var(--border)] bg-gray-50 flex justify-between items-center">
                 <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Basal Metabolic Rate (BMR)</span>
                 <span className="text-sm font-black text-[var(--text-main)]">{analysis.bmr} kcal</span>
              </div>
              
              <div className="p-6 bg-white border border-[var(--border)] space-y-5">
                 <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <h4 className="text-[11px] font-black uppercase text-[var(--text-main)]">Weight Goal Targets</h4>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-[var(--text-muted)] font-bold uppercase text-[9px]">Fat Loss (-0.5kg/wk)</span>
                       <span className="font-black text-[var(--primary)]">{analysis.tdee - 500} kcal</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-[var(--text-muted)] font-bold uppercase text-[9px]">Weight Gain (+0.5kg/wk)</span>
                       <span className="font-black text-orange-600">{analysis.tdee + 500} kcal</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-5 border border-[var(--border)] bg-[var(--bg-subtle)]">
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed italic">
                * Based on the Mifflin-St Jeor Equation, the most accurate clinical standard for BMR calculation.
              </p>
           </div>
        </div>
      }
      faqSection={
        <CalcFAQ
          faqs={[
            {
              question: 'What is BMR and TDEE?',
              answer: 'BMR is energy burned at rest. TDEE is total energy burned including exercise.'
            },
            {
              question: 'How accurate is this?',
              answer: 'Mifflin-St Jeor is accurate within 10% for most adults.'
            }
          ]}
        />
      }
    />
  );
}
