'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(170);

  const r = useMemo(() => {
    // Devine Formula
    // Male: 50.0 kg + 2.3 kg per inch over 5 feet
    // Female: 45.5 kg + 2.3 kg per inch over 5 feet
    const heightInches = heightCm / 2.54;
    const inchesOver5Feet = Math.max(0, heightInches - 60);
    
    let base = gender === 'male' ? 50.0 : 45.5;
    const ideal = base + (2.3 * inchesOver5Feet);
    
    // Range (Hamwi formula or +/- 10%)
    const min = ideal * 0.9;
    const max = ideal * 1.1;
    
    return { ideal, min, max };
  }, [gender, heightCm]);

  return (
    <>
      <JsonLd type="calculator"
        name="Ideal Weight Calculator"
        description="Calculate your ideal healthy weight range based on the Devine formula. Used by healthcare professionals worldwide to determine healthy weight targets."
        url="https://calcpro.com.np/calculator/ideal-weight" />

      <CalcWrapper
        title="Ideal Weight Calculator"
        description="Calculate your ideal healthy weight range based on the Devine formula. Used by healthcare professionals worldwide."
        crumbs={[{ label: 'Health', href: '/calculator?cat=health' }, { label: 'Ideal Weight' }]}
        relatedCalcs={[
          { name: 'BMI Calculator', slug: 'bmi' },
          { name: 'BMR Calculator', slug: 'bmr' },
          { name: 'Body Fat %', slug: 'body-fat' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['male', 'female'].map(g => (
                    <button key={g} onClick={() => setGender(g as any)} className={`py-3 rounded-xl text-[10px] font-bold border-2 capitalize transition-all uppercase tracking-widest ${gender === g ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Height (cm)</label>
                <input type="number" inputMode="numeric" pattern="[0-9.]*" value={heightCm} onChange={e => setHeightCm(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                <input type="range" min={100} max={250} step={1} value={heightCm} onChange={e => setHeightCm(+e.target.value)} className="w-full mt-2 accent-blue-600 h-1.5" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Ideal Weight</div>
              <div className="text-3xl font-bold font-mono mb-4">{r.ideal.toFixed(1)} kg</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Healthy Range</span>
                  <span className="font-mono font-bold text-yellow-300">{r.min.toFixed(1)} - {r.max.toFixed(1)} kg</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Ideal Weight Result" 
              result={`${r.ideal.toFixed(1)} kg (Ideal)`} 
              calcUrl={`https://calcpro.com.np/calculator/ideal-weight`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is the Devine formula for ideal weight?',
            answer: 'The Devine formula is a widely used method to estimate ideal body weight. For men, it is 50.0 kg + 2.3 kg for every inch over 5 feet. For women, it is 45.5 kg + 2.3 kg for every inch over 5 feet.',
          },
          {
            question: 'Is ideal weight the same for everyone of the same height?',
            answer: 'No, ideal weight can vary based on factors like bone structure, muscle mass, and age. The formula provides a general guideline, but a healthy weight range is usually more important than a single number.',
          },
          {
            question: 'How does ideal weight relate to BMI?',
            answer: 'Ideal weight formulas often aim for a weight that falls within the "normal" BMI range (18.5 to 24.9). However, BMI is a more general screening tool, while ideal weight formulas focus on specific height-to-weight ratios.',
          },
          {
            question: 'Should I follow the ideal weight exactly?',
            answer: 'It is important to consult with a healthcare professional to determine your personal healthy weight. Ideal weight formulas are estimates and may not be suitable for everyone, especially athletes or those with specific medical conditions.',
          },
          {
            question: 'What is a healthy weight range?',
            answer: 'A healthy weight range is typically defined as a weight that results in a BMI between 18.5 and 24.9. Our calculator provides this range (+/- 10% of the ideal weight) to give you a more realistic target.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
