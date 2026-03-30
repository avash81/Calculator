'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(90);

  const r = useMemo(() => {
    let bf = 0;
    if (gender === 'male') {
      // Navy formula for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // Navy formula for women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.221 * log10(height)) - 450
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }
    return Math.max(0, Math.min(100, bf));
  }, [gender, height, neck, waist, hip]);

  const category = useMemo(() => {
    if (gender === 'male') {
      if (r < 6) return 'Essential Fat';
      if (r < 14) return 'Athletes';
      if (r < 18) return 'Fitness';
      if (r < 25) return 'Average';
      return 'Obese';
    } else {
      if (r < 14) return 'Essential Fat';
      if (r < 21) return 'Athletes';
      if (r < 25) return 'Fitness';
      if (r < 32) return 'Average';
      return 'Obese';
    }
  }, [r, gender]);

  return (
    <>
      <JsonLd type="calculator"
        name="Body Fat Percentage Calculator"
        description="Estimate your body fat percentage using the U.S. Navy Method. Requires simple measurements of your neck, waist, and height for an accurate estimation."
        url="https://calcpro.com.np/calculator/body-fat" />

      <CalcWrapper
        title="Body Fat Percentage Calculator"
        description="Estimate your body fat percentage using the U.S. Navy Method. Requires simple measurements of your neck, waist, and height."
        crumbs={[{ label: 'Health', href: '/calculator?cat=health' }, { label: 'Body Fat' }]}
        relatedCalcs={[
          { name: 'BMI Calculator', slug: 'bmi' },
          { name: 'BMR Calculator', slug: 'bmr' },
          { name: 'Ideal Weight', slug: 'ideal-weight' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female'].map(g => (
                    <button key={g} onClick={() => setGender(g as any)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold border-2 transition-all capitalize uppercase tracking-widest ${gender === g ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Height (cm)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={height} onChange={e => setHeight(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Neck (cm)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={neck} onChange={e => setNeck(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Waist (cm)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={waist} onChange={e => setWaist(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                </div>
                {gender === 'female' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hip (cm)</label>
                    <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={hip} onChange={e => setHip(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono text-lg font-bold" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Body Fat Percentage</div>
              <div className="text-4xl font-bold font-mono mb-2">{r.toFixed(1)}%</div>
              <div className="inline-flex px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                {category}
              </div>
              <div className="pt-4 border-t border-white/20 text-xs opacity-80 leading-relaxed font-medium">
                Based on the U.S. Navy circumference method. This is an estimate and may vary by individual.
              </div>
            </div>

            <ShareResult 
              title="Body Fat Result" 
              result={`${r.toFixed(1)}% (${category})`} 
              calcUrl={`https://calcpro.com.np/calculator/body-fat`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How accurate is the U.S. Navy body fat method?',
            answer: 'The U.S. Navy method is a widely used and relatively accurate way to estimate body fat percentage using body circumferences. While it may not be as precise as a DEXA scan, it is a reliable tool for tracking progress over time.',
          },
          {
            question: 'What is a healthy body fat percentage?',
            answer: 'Healthy body fat ranges vary by age and gender. Generally, for men, 10-20% is considered healthy, while for women, 18-28% is often cited as a healthy range.',
          },
          {
            question: 'Why do women need more body fat than men?',
            answer: 'Women naturally require more body fat for reproductive and hormonal health. Essential fat for women is around 10-13%, whereas for men it is about 2-5%.',
          },
          {
            question: 'Can I use this calculator if I have a lot of muscle?',
            answer: 'The Navy method can sometimes overestimate body fat in individuals with high muscle mass, as it primarily relies on circumferences. However, it is still a useful tool for most people.',
          },
          {
            question: 'How often should I measure my body fat?',
            answer: 'Measuring once every 4-8 weeks is usually sufficient to track meaningful changes in body composition. Consistency in measurement technique and time of day is key.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
