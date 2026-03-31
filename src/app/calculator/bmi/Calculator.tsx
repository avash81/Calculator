'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [lbs, setLbs] = useState(154);

  const debW = useDebounce(weight, 300);
  const debH = useDebounce(height, 300);
  const debF = useDebounce(feet, 300);
  const debI = useDebounce(inches, 300);
  const debL = useDebounce(lbs, 300);

  const result = useMemo(() => {
    let bmi = 0;
    let h = 0; // height in meters
    
    if (unit === 'metric') {
      h = debH / 100;
      bmi = debW / (h * h);
    } else {
      const totalInches = (debF * 12) + debI;
      h = totalInches * 0.0254;
      bmi = (debL / (totalInches * totalInches)) * 703;
    }

    let category = '';
    let color = '';
    let bg = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
      bg = 'bg-blue-50 border-blue-200';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = 'text-green-500';
      bg = 'bg-green-50 border-green-200';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
      bg = 'bg-yellow-50 border-yellow-200';
    } else {
      category = 'Obese';
      color = 'text-red-500';
      bg = 'bg-red-50 border-red-200';
    }

    const minWeightKg = 18.5 * (h * h);
    const maxWeightKg = 24.9 * (h * h);
    
    const minWeight = unit === 'metric' ? minWeightKg : minWeightKg * 2.20462;
    const maxWeight = unit === 'metric' ? maxWeightKg : maxWeightKg * 2.20462;
    const unitLabel = unit === 'metric' ? 'kg' : 'lbs';

    return { 
      bmi: isNaN(bmi) || !isFinite(bmi) ? '0.0' : bmi.toFixed(1), 
      category, 
      color, 
      bg,
      minWeight: minWeight.toFixed(1), 
      maxWeight: maxWeight.toFixed(1),
      unitLabel,
      bmiValue: bmi
    };
  }, [unit, debW, debH, debF, debI, debL]);

  // Calculate position for the gauge
  const gaugePos = Math.min(Math.max((result.bmiValue - 15) / (40 - 15) * 100, 0), 100);

  return (
    <>
      <JsonLd type="calculator"
        name="BMI Calculator"
        description="Calculate your Body Mass Index (BMI) to determine your healthy weight range based on WHO standards. Supports metric and imperial units."
        url="https://calcpro.com.np/calculator/bmi" />

      <CalcWrapper
        title="BMI Calculator"
        description="Calculate your Body Mass Index (BMI) to determine your healthy weight range based on WHO standards."
        crumbs={[{label:'health',href:'/calculator?cat=health'}, {label:'bmi calculator'}]}
        relatedCalcs={[
          {name:'BMR Calculator',slug:'bmr'},
          {name:'Ideal Weight',slug:'ideal-weight'},
          {name:'Body Fat %',slug:'body-fat'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUnit('metric')}
                className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-colors min-h-[44px] uppercase tracking-widest ${unit === 'metric' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-colors min-h-[44px] uppercase tracking-widest ${unit === 'imperial' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Imperial
              </button>
            </div>

            {unit === 'metric' ? (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Weight (kg)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Height (cm)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Weight (lbs)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={lbs} onChange={e => setLbs(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Height (ft)</label>
                    <input type="number" inputMode="numeric" pattern="[0-9]*" value={feet} onChange={e => setFeet(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Height (in)</label>
                    <input type="number" inputMode="numeric" pattern="[0-9]*" value={inches} onChange={e => setInches(Number(e.target.value))} className="w-full border-2 border-gray-100 rounded-lg px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono font-bold" />
                  </div>
                </div>
              </>
            )}

            <button onClick={() => { setWeight(70); setHeight(170); setFeet(5); setInches(7); setLbs(154); }} className="w-full py-4 mt-6 border-2 border-dashed border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all">Reset Entry / Backspace</button>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className={`border rounded-xl p-6 text-center shadow-lg ${result.bg}`}>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Your BMI</div>
              <div className={`text-5xl font-bold font-mono mb-2 ${result.color}`}>{result.bmi}</div>
              <div className={`text-lg font-bold uppercase tracking-widest ${result.color}`}>{result.category}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Healthy Weight Range</div>
              <div className="text-lg font-bold text-gray-900 font-mono">{result.minWeight} - {result.maxWeight} {result.unitLabel}</div>
            </div>
            
            {/* Visual Gauge */}
            <div className="pt-4 pb-2">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex relative">
                <div className="bg-blue-400 h-full" style={{width: '14%'}}></div> {/* < 18.5 */}
                <div className="bg-green-400 h-full" style={{width: '25.6%'}}></div> {/* 18.5 - 24.9 */}
                <div className="bg-yellow-400 h-full" style={{width: '20%'}}></div> {/* 25 - 29.9 */}
                <div className="bg-red-400 h-full" style={{width: '40.4%'}}></div> {/* > 30 */}
                
                {/* Marker */}
                <div className="absolute top-0 bottom-0 w-1 bg-gray-900 shadow-sm transition-all duration-300" style={{left: `${gaugePos}%`}}></div>
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono font-bold">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            <ShareResult 
              title="BMI Result" 
              result={`${result.bmi} (${result.category})`} 
              calcUrl={`https://calcpro.com.np/calculator/bmi`} 
            />
          </div>
        </div>

        <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BMI Categories (WHO)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-right px-4 py-2">BMI Range</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-blue-600 font-bold uppercase text-xs tracking-widest">Underweight</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-600">&lt; 18.5</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-green-600 font-bold uppercase text-xs tracking-widest">Normal Weight</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-600">18.5 - 24.9</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-yellow-600 font-bold uppercase text-xs tracking-widest">Overweight</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-600">25 - 29.9</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-red-600 font-bold uppercase text-xs tracking-widest">Obese</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-600">&ge; 30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is BMI?',
            answer: 'BMI (Body Mass Index) is a measurement of a person\'s weight with respect to their height. It is more of an indicator than a direct measurement of a person\'s total body fat.',
          },
          {
            question: 'Is BMI accurate for everyone?',
            answer: 'While BMI is a useful screening tool, it has limitations. It does not account for muscle mass, bone density, or overall body composition. Athletes or highly muscular individuals may have a high BMI but low body fat.',
          },
          {
            question: 'What is a healthy BMI range?',
            answer: 'According to the World Health Organization (WHO), a healthy BMI for adults is between 18.5 and 24.9.',
          },
          {
            question: 'How can I improve my BMI?',
            answer: 'Improving BMI usually involves a combination of a balanced diet and regular physical activity. Consult with a healthcare professional before starting any new weight loss or exercise program.',
          },
          {
            question: 'What are the risks of a high BMI?',
            answer: 'A high BMI (overweight or obese) is associated with an increased risk of several health conditions, including heart disease, type 2 diabetes, high blood pressure, and certain types of cancer.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
