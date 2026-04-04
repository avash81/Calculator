'use client';
import { useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { safeCalculateBMI } from '@/utils/math/safeCalculations';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Info } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';

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
  const { unit, weight, height, feet, inches, lbs } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const result = useMemo(() => {
    if (unit === 'metric') {
      return safeCalculateBMI(weight, height, 'metric');
    } else {
      const totalInches = feet * 12 + inches;
      return safeCalculateBMI(lbs, totalInches, 'imperial');
    }
  }, [unit, weight, height, feet, inches, lbs]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'underweight': return 'text-blue-500';
      case 'normal': return 'text-[var(--success)]';
      case 'overweight': return 'text-amber-500';
      case 'obese': return 'text-rose-500';
      default: return 'text-[var(--text-secondary)]';
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
      setReadings([newReading, ...readings].slice(0, 10));
    }
  };

  return (
    <CalculatorErrorBoundary calculatorName="BMI">
      <CalculatorLayout
        title="BMI Calculator"
        description="Verify your Body Mass Index (BMI) based on World Health Organization standards. All calculations are private and instant."
        badge="Health"
        badgeColor="green"
        category={{ label: 'Health', href: '/calculator/category/health' }}
        leftPanel={
          <div className="space-y-6">
            {/* Unit Toggle - Classic Style */}
            <div className="flex p-1 bg-[var(--bg-surface)] border border-[var(--border)]">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  onClick={() => updateState({ unit: u as any })}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-tight transition-all ${
                    unit === u ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {unit === 'metric' ? (
                <>
                  <ValidatedInput label="Weight (kg)" value={weight} onChange={(v) => updateState({ weight: v })} min={2} max={500} required />
                  <ValidatedInput label="Height (cm)" value={height} onChange={(v) => updateState({ height: v })} min={30} max={300} required />
                </>
              ) : (
                <>
                  <ValidatedInput label="Weight (lbs)" value={lbs} onChange={(v) => updateState({ lbs: v })} min={5} max={1100} required />
                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput label="Feet" value={feet} onChange={(v) => updateState({ feet: v })} min={1} max={9} required />
                    <ValidatedInput label="Inches" value={inches} onChange={(v) => updateState({ inches: v })} min={0} max={11.9} required />
                  </div>
                </>
              )}
            </div>

            <div className="p-5 bg-[var(--primary-light)] border border-[var(--primary)]/10">
              <div className="flex items-center gap-2 mb-2 text-[var(--primary)] text-xs font-bold uppercase">
                <Info className="w-4 h-4" />
                <span>WHO Reference Range</span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Healthy weight range for your height: <span className="font-bold text-[var(--text-main)]">
                  {unit === 'metric' ? ((18.5 * (height/100)**2).toFixed(1)) : ((18.5 * (feet*12+inches)**2 / 703).toFixed(1))} - {unit === 'metric' ? ((25 * (height/100)**2).toFixed(1)) : ((25 * (feet*12+inches)**2 / 703).toFixed(1))} {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </p>
            </div>
          </div>
        }
        rightPanel={
          <div className="space-y-8">
            {result.success && result.data ? (
              <>
                <div className="text-center p-6 bg-white border border-[var(--border)]">
                  <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Calculated BMI Value</div>
                  <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2">{result.data.bmi}</div>
                  <div className={`text-sm font-bold uppercase tracking-widest ${getStatusColorClass(result.data.status)}`}>
                    {result.data.category}
                  </div>
                </div>

                {/* Simplified Gauge */}
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold text-[var(--text-main)]">
                    <span>18.5</span>
                    <span>25.0</span>
                    <span>30.0</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-green-400 via-yellow-300 to-red-400 opacity-80" />
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 bg-[var(--primary)] shadow-sm transition-all duration-500" 
                      style={{ left: `${Math.min(Math.max((result.data.bmi / 40) * 100, 0), 100)}%` }} 
                    />
                  </div>
                  <div className="text-[11px] text-center font-bold text-[var(--text-muted)] uppercase tracking-tight">
                    WHO BMI Scale Matrix
                  </div>
                </div>

                <button
                  onClick={saveReading}
                  className="w-full py-4 bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-sm"
                >
                  Save Result to History
                </button>
              </>
            ) : (
              <div className="p-4 bg-red-50 text-red-600 font-bold text-xs border border-red-200">
                {result.error || 'Please enter valid height and weight values.'}
              </div>
            )}
          </div>
        }
        faqSection={
          <div className="space-y-12">
            {/* History Table - Classic High Contrast */}
            {readings.length > 0 && (
              <div className="bg-white border border-[var(--border)]">
                <div className="p-4 bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between">
                   <h3 className="text-xs font-bold uppercase tracking-tight text-[var(--text-main)]">BMI History Log</h3>
                   <button onClick={() => setReadings([])} className="text-xs font-bold text-red-600 uppercase hover:underline">Clear History</button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-4 text-[11px] font-bold uppercase text-[var(--text-muted)] mb-4 border-b border-[var(--border)] pb-2 text-center">
                    <div>Date Recorded</div><div>BMI Index</div><div>Weight</div><div>Category</div>
                  </div>
                  <div className="space-y-3">
                    {readings.map((r, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm font-bold text-[var(--text-main)] text-center items-center">
                        <div className="text-[var(--text-secondary)] font-medium">{r.date}</div>
                        <div className="text-[var(--primary)]">{r.bmi}</div>
                        <div>{r.weight}{unit === 'metric' ? 'kg' : 'lbs'}</div>
                        <div className={`capitalize ${getStatusColorClass(r.status)}`}>{r.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <CalcFAQ
              faqs={[
                {
                  question: 'What is BMI and why does it matter?',
                  answer: 'Body Mass Index (BMI) is a simple index of weight-for-height used to classify weight categories. It is a useful population-level measure, though it does not account for muscle mass vs body fat.'
                },
                {
                  question: 'What are the WHO BMI categories?',
                  answer: 'Underweight: < 18.5, Normal: 18.5–24.9, Overweight: 25–29.9, and Obese: > 30.'
                }
              ]}
            />
          </div>
        }
      />
    </CalculatorErrorBoundary>
  );
}
