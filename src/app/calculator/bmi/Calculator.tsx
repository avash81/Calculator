'use client';
import { useMemo, useState } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { safeCalculateBMI } from '@/utils/math/safeCalculations';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TrendingDown, TrendingUp, History, Info, Scale } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

interface BMIReading {
  date: string;
  bmi: number;
  weight: number;
  status: string;
}

const DEFAULT_STATE = {
  unit: 'metric' as 'metric' | 'imperial',
  weight: 70,
  height: 170, // cm
  feet: 5,
  inches: 7,
  lbs: 154,
};

export default function BMICalculator() {
  const [state, setState] = useLocalStorage('calcpro_bmi_v2', DEFAULT_STATE);
  const [readings, setReadings] = useLocalStorage<BMIReading[]>('calcpro_bmi_history', []);
  const [showHistory, setShowHistory] = useState(false);

  const { unit, weight, height, feet, inches, lbs } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  // Calculate BMI
  const result = useMemo(() => {
    if (unit === 'metric') {
      return safeCalculateBMI(weight, height, 'metric');
    } else {
      const totalInches = feet * 12 + inches;
      return safeCalculateBMI(lbs, totalInches, 'imperial');
    }
  }, [unit, weight, height, feet, inches, lbs]);

  const getStatusColor = (status: string): "blue" | "green" | "yellow" | "red" | "gray" => {
    switch (status) {
      case 'underweight': return 'blue';
      case 'normal': return 'green';
      case 'overweight': return 'yellow';
      case 'obese': return 'red';
      default: return 'gray';
    }
  };

  const saveReading = () => {
    if (result.success && result.data) {
      const newReading: BMIReading = {
        date: new Date().toLocaleDateString('en-NP'),
        bmi: result.data.bmi,
        weight: unit === 'metric' ? weight : lbs,
        status: result.data.status,
      };
      setReadings([newReading, ...readings].slice(0, 10)); // Keep last 10
    }
  };

  return (
    <CalculatorErrorBoundary calculatorName="BMI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
             Health & Wellness
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            BMI <span className="text-emerald-600">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Check your Body Mass Index (BMI) and discover your ideal weight range based on WHO health standards.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-center pb-4">
          <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-3xl border border-gray-100 dark:border-gray-800 w-full max-w-md">
            {[
              { u: 'metric', l: 'Metric (kg/cm)' },
              { u: 'imperial', l: 'Imperial (lbs/ft)' },
            ].map(({ u, l }) => (
              <button
                key={u}
                onClick={() => updateState({ unit: u as any })}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  unit === u
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-100 dark:border-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {unit === 'metric' ? (
                <>
                  <ValidatedInput
                    label="Weight"
                    value={weight}
                    onChange={(v) => updateState({ weight: v })}
                    min={2}
                    max={500}
                    step={0.1}
                    suffix="kg"
                    hint="2kg - 500kg"
                    required
                  />
                  <ValidatedInput
                    label="Height"
                    value={height}
                    onChange={(v) => updateState({ height: v })}
                    min={30}
                    max={300}
                    step={0.1}
                    suffix="cm"
                    hint="30cm - 300cm"
                    required
                  />
                </>
              ) : (
                <>
                  <ValidatedInput
                    label="Weight"
                    value={lbs}
                    onChange={(v) => updateState({ lbs: v })}
                    min={5}
                    max={1100}
                    suffix="lbs"
                    hint="5 - 1100 lbs"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput
                      label="Feet"
                      value={feet}
                      onChange={(v) => updateState({ feet: v })}
                      min={1}
                      max={9}
                      suffix="ft"
                    />
                    <ValidatedInput
                      label="Inches"
                      value={inches}
                      onChange={(v) => updateState({ inches: v })}
                      min={0}
                      max={11.9}
                      suffix="in"
                    />
                  </div>
                </>
              )}
            </div>

            {/* WHO HEALTH INFO */}
            {result.success && result.data && (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 space-y-4">
                <div className="flex items-center gap-2">
                   <Info className="w-5 h-5 text-emerald-600" />
                   <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest">Ideal Weight Range</h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                     {unit === 'metric' ? ((18.5 * (height/100)**2).toFixed(1)) : ((18.5 * (feet*12+inches)**2 / 703).toFixed(1))} - {unit === 'metric' ? ((25 * (height/100)**2).toFixed(1)) : ((25 * (feet*12+inches)**2 / 703).toFixed(1))}
                  </span>
                  <span className="text-lg font-bold text-gray-400 capitalize">{unit === 'metric' ? 'kg' : 'lbs'}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Calculated based on World Health Organization (WHO) standards for your height.
                </p>
              </div>
            )}
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {result.success && result.data ? (
              <>
                <ResultCard
                  label="Computed Body Mass Index"
                  value={result.data.bmi}
                  unit=" BMI"
                  color={getStatusColor(result.data.status)}
                  title={result.data.category}
                  copyValue={`BMI: ${result.data.bmi} (${result.data.category})`}
                />

                {/* BMI Gauge */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Underweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="h-4 w-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full relative overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 w-2 bg-white dark:bg-gray-900 border-2 border-gray-900 dark:border-white rounded-full transition-all duration-1000 shadow-xl"
                      style={{ 
                        left: `${Math.min(Math.max((result.data.bmi / 40) * 100, 2), 98)}%`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>

                <button
                  onClick={saveReading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-gray-200/50 dark:shadow-none"
                >
                  <History className="w-5 h-5" />
                  Save Tracking
                </button>
              </>
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                <p className="font-black uppercase tracking-widest text-xs">Error Found</p>
                <p className="font-bold">{result.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {readings.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <History className="w-6 h-6 text-gray-400" />
                 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent History</h3>
              </div>
              <button 
                onClick={() => setReadings([])}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {readings.map((r, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 text-center">
                   <span className="text-[10px] font-black text-gray-400">{r.date}</span>
                   <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{r.bmi}</span>
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    r.status === 'normal' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    r.status === 'underweight' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                     {r.status}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'What is BMI and why does it matter?',
                  answer: 'Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults. It matters because high BMI counts are often associated with health risks such as heart disease and type 2 diabetes.'
                },
                {
                  question: 'Is BMI accurate for everyone?',
                  answer: 'BMI is a useful population-level measure of overweight and obesity, but it has limitations. It does not distinguish between body fat and lean muscle mass. Athletes with high muscle mass may have a high BMI despite low body fat.'
                },
                {
                  question: 'What are the WHO BMI categories?',
                  answer: 'Underweight: < 18.5, Normal: 18.5–24.9, Overweight: 25–29.9, and Obese: > 30. These standards are international and applied to most adults regardless of gender.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
