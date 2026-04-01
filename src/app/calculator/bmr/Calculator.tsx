'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Activity, Flame, Heart, Info, Scale, User } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

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
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity].factor);

    return {
      bmr: Math.round(bmr),
      tdee,
    };
  }, [gender, age, weight, height, activity]);

  return (
    <CalculatorErrorBoundary calculatorName="BMR">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
             Metabolic Science
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            BMR <span className="text-orange-600">Engine</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) for precision weight management and fitness tracking.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
             
             {/* Identity Selection */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Biological Gender</label>
                   <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      {['male', 'female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => updateState({ gender: g as 'male' | 'female' })}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === g ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm border border-gray-100 dark:border-gray-600' : 'text-gray-400'}`}
                        >
                          {g}
                        </button>
                      ))}
                   </div>
                </div>
                <ValidatedInput label="Current Age" value={age} onChange={(v) => updateState({ age: v })} min={5} max={110} suffix="Years" required />
             </div>

             {/* Metrics */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ValidatedInput label="Weight" value={weight} onChange={(v) => updateState({ weight: v })} min={5} max={500} step={0.1} suffix="kg" required />
                <ValidatedInput label="Height" value={height} onChange={(v) => updateState({ height: v })} min={50} max={300} step={0.1} suffix="cm" required />
             </div>

             {/* Activity Selector */}
             <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Weekly Activity Intensity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, data]) => (
                     <button
                        key={key}
                        onClick={() => updateState({ activity: key as any })}
                        className={`p-6 rounded-[2rem] border-2 text-left transition-all group ${activity === key ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                     >
                        <div className={`text-xs font-black uppercase tracking-tight ${activity === key ? 'text-orange-600' : 'text-gray-900 dark:text-gray-100'}`}>{data.label}</div>
                        <div className="text-[10px] text-gray-400 font-bold leading-relaxed">{data.desc}</div>
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
             <ResultCard
                label="Basal Metabolic Rate"
                value={analysis.bmr}
                unit=" kcal"
                color="yellow"
                title="Resting Energy"
                copyValue={`My BMR is ${analysis.bmr} kcal/day.`}
             />

             <ResultCard
                label="Daily Energy Spending"
                value={analysis.tdee}
                unit=" kcal"
                color="red"
                title="In-Motion Burn"
                copyValue={`My TDEE is ${analysis.tdee} kcal/day.`}
             />

             <div className="bg-gray-950 text-white p-8 rounded-[2.5rem] space-y-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                   <Flame className="w-5 h-5 text-orange-500" />
                   <h3 className="text-sm font-black uppercase tracking-widest">Weight Goal Targets</h3>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-500 uppercase">Weight Loss (-0.5kg/wk)</span>
                      <span className="text-emerald-400">{analysis.tdee - 500} kcal</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-500 uppercase">Maintain Weight</span>
                      <span className="text-blue-400">{analysis.tdee} kcal</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-500 uppercase">Weight Gain (+0.5kg/wk)</span>
                      <span className="text-orange-400">{analysis.tdee + 500} kcal</span>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'What is the difference between BMR and TDEE?',
                  answer: 'BMR (Basal Metabolic Rate) is the energy your body needs just to stay alive at complete rest (breathing, heart beating). TDEE (Total Daily Energy Expenditure) is your BMR plus all the physical activity you perform throughout the day.'
                },
                {
                  question: 'How accurate is the Mifflin-St Jeor formula?',
                  answer: 'Research shows it is one of the most reliable methods for estimating calorie needs in clinical settings, typically accurate within 10% for most individuals.'
                },
                {
                  question: 'Should I eat below my BMR to lose weight?',
                  answer: 'Generally, it is not recommended to eat significantly below your BMR for long periods, as your body needs those calories for basic organ function. Aim to stay between your BMR and TDEE for safe, sustainable weight loss.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
