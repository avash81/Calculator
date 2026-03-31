'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState(30); // minutes of exercise per day

  const r = useMemo(() => {
    // Basic formula: 35ml per kg of body weight
    // Plus 350ml for every 30 mins of exercise
    const base = weight * 35;
    const extra = (activity / 30) * 350;
    const totalMl = base + extra;
    const glasses = totalMl / 250; // 250ml per glass
    
    return {
      totalMl,
      liters: totalMl / 1000,
      glasses: Math.ceil(glasses)
    };
  }, [weight, activity]);

  return (
    <>
      <JsonLd type="calculator"
        name="Daily Water Intake Calculator"
        description="Calculate how much water you should drink daily based on your body weight and activity level for optimal hydration and health."
        url="https://calcpro.com.np/calculator/water-intake" />

      <CalcWrapper
        title="Daily Water Intake Calculator"
        description="Calculate how much water you should drink daily based on your body weight and activity level."
        crumbs={[{ label: 'Health', href: '/calculator?cat=health' }, { label: 'Water Intake' }]}
        relatedCalcs={[
          { name: 'BMI Calculator', slug: 'bmi' },
          { name: 'BMR Calculator', slug: 'bmr' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Daily Exercise (minutes)</label>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={activity} onChange={e => setActivity(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Daily Recommendation</div>
              <div className="text-3xl font-bold font-mono mb-2">{r.liters.toFixed(1)} Liters</div>
              <div className="inline-flex px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                Approx. {r.glasses} Glasses
              </div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                * Based on 250ml per glass. Hydration needs vary by climate and health conditions.
              </div>
            </div>

            <ShareResult 
              title="Water Intake Result" 
              result={`${r.liters.toFixed(1)} Liters/day`} 
              calcUrl={`https://calcpro.com.np/calculator/water-intake`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How much water should I drink a day?',
            answer: 'A general rule is to drink about 35ml of water per kilogram of body weight. However, this can increase significantly with exercise, heat, and other factors.',
          },
          {
            question: 'Does exercise increase my water needs?',
            answer: 'Yes, physical activity causes you to lose fluids through sweat. A common recommendation is to add about 350ml of water for every 30 minutes of exercise.',
          },
          {
            question: 'Can I drink too much water?',
            answer: 'While rare, it is possible to drink too much water, a condition known as hyponatremia. It is important to listen to your body and drink when you are thirsty.',
          },
          {
            question: 'What are the signs of dehydration?',
            answer: 'Common signs of dehydration include thirst, dark-colored urine, fatigue, dizziness, and dry mouth.',
          },
          {
            question: 'Does coffee or tea count toward my water intake?',
            answer: 'Yes, caffeinated beverages like coffee and tea do contribute to your daily fluid intake, although water is still the best source of hydration.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
