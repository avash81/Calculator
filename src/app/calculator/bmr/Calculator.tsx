'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function BMRCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const debAge = useDebounce(age, 300);
  const debW = useDebounce(weight, 300);
  const debH = useDebounce(height, 300);

  const result = useMemo(() => {
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * debW) + (6.25 * debH) - (5 * debAge) + 5;
    } else {
      bmr = (10 * debW) + (6.25 * debH) - (5 * debAge) - 161;
    }

    const tdee = {
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      active: Math.round(bmr * 1.725),
      veryActive: Math.round(bmr * 1.9),
    };

    return { bmr: Math.round(bmr), tdee };
  }, [gender, debAge, debW, debH]);

  return (
    <>
      <JsonLd type="calculator"
        name="BMR Calculator"
        description="Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily calorie needs for weight management."
        url="https://calcpro.com.np/calculator/bmr" />

      <CalcWrapper
        title="BMR Calculator"
        description="Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily calorie needs."
        crumbs={[{label:'health',href:'/calculator?cat=health'}, {label:'bmr calculator'}]}
        relatedCalcs={[
          {name:'BMI Calculator',slug:'bmi'},
          {name:'Ideal Weight',slug:'ideal-weight'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                {[{v:'male',l:'Male'},{v:'female',l:'Female'}].map(({v,l}) => (
                  <button key={l} onClick={()=>setGender(v as any)} className={`py-3 text-[10px] font-bold rounded-lg border-2 transition-all min-h-[44px] uppercase tracking-widest ${gender===v ?'border-blue-500 bg-blue-50 text-blue-700' :'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Age (Years)</label>
              <input type="number" inputMode="numeric" pattern="[0-9]*" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Weight (kg)</label>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Height (cm)</label>
              <input type="number" inputMode="decimal" pattern="[0-9.]*" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-orange-500 rounded-xl p-6 text-center text-white shadow-lg shadow-orange-900/20">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">Your BMR</div>
              <div className="text-5xl font-bold font-mono mb-1">{result.bmr}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Calories / Day</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Calorie Needs (TDEE)</div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sedentary</span>
                  <span className="font-mono font-bold text-gray-900">{result.tdee.sedentary}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Lightly active</span>
                  <span className="font-mono font-bold text-gray-900">{result.tdee.light}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Moderately active</span>
                  <span className="font-mono font-bold text-gray-900">{result.tdee.moderate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Very active</span>
                  <span className="font-mono font-bold text-gray-900">{result.tdee.active}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Extra active</span>
                  <span className="font-mono font-bold text-gray-900">{result.tdee.veryActive}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="BMR Result" 
              result={`${result.bmr} kcal/day (BMR)`} 
              calcUrl={`https://calcpro.com.np/calculator/bmr`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is BMR?',
            answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to perform basic life-sustaining functions while at rest, such as breathing, circulation, and cell production.',
          },
          {
            question: 'What is TDEE?',
            answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories you burn in a day, including physical activity. It is calculated by multiplying your BMR by an activity factor.',
          },
          {
            question: 'How can I use BMR to lose weight?',
            answer: 'To lose weight, you need to consume fewer calories than your TDEE. Knowing your BMR helps you set a realistic calorie goal that ensures your body still gets enough energy for basic functions.',
          },
          {
            question: 'Does BMR change with age?',
            answer: 'Yes, BMR typically decreases as you get older, mainly due to a loss of muscle mass and changes in hormonal and neurological processes.',
          },
          {
            question: 'How accurate is the BMR calculation?',
            answer: 'Our calculator uses the Mifflin-St Jeor Equation, which is considered one of the most accurate formulas for predicting BMR. However, individual factors like body composition and genetics can cause variations.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
