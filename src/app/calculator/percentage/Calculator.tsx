'use client';
import { useState, useMemo } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Percent, TrendingUp, Search, Layers, Zap, ArrowRightLeft, History } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

type CalcMode = 'what_is' | 'what_percent' | 'original' | 'change' | 'batch';

interface HistoryItem {
  calc: string;
  result: string;
  time: string;
}

const DEFAULT_STATE = {
  mode: 'what_is' as CalcMode,
  num: 20,
  den: 500,
  initial: 100,
  final: 120,
};

export default function PercentageCalculator() {
  const [state, setState] = useLocalStorage('calcpro_percentage_v2', DEFAULT_STATE);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('calcpro_percentage_history', []);
  
  const { mode, num, den, initial, final } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const saveToHistory = (calc: string, result: string) => {
    const newItem = {
      calc,
      result,
      time: new Date().toLocaleTimeString('en-NP'),
    };
    setHistory([newItem, ...history].slice(0, 10));
  };

  const calculation = useMemo(() => {
    let result = '';
    let label = 'Result';
    let raw = 0;

    switch (mode) {
      case 'what_is':
        raw = (num / 100) * den;
        result = raw.toLocaleString();
        label = `${num}% of ${den}`;
        break;
      case 'what_percent':
        if (den === 0) return { error: 'Division by zero' };
        raw = (num / den) * 100;
        result = `${raw.toFixed(2)}%`;
        label = `${num} is what % of ${den}`;
        break;
      case 'original':
        if (num === 0) return { error: 'Percentage cannot be zero' };
        raw = den / (num / 100);
        result = raw.toLocaleString();
        label = `${den} is ${num}% of what?`;
        break;
      case 'change':
        if (initial === 0) return { error: 'Initial value cannot be zero' };
        const diff = final - initial;
        raw = (diff / initial) * 100;
        result = `${raw.toFixed(2)}%`;
        label = `${diff >= 0 ? 'Increase' : 'Decrease'} from ${initial} to ${final}`;
        break;
      default:
        break;
    }

    return { result, label, raw, error: null };
  }, [mode, num, den, initial, final]);

  return (
    <CalculatorErrorBoundary calculatorName="Percentage Calculator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             Education Suite
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Percentage <span className="text-blue-600">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Solve complex percentage problems instantly—from simple discounts to growth rate tracking and target projections.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'what_is', label: 'What is X% of Y?', icon: Percent },
            { id: 'what_percent', label: 'X is what % of Y?', icon: Search },
            { id: 'original', label: 'X is Y% of what?', icon: Layers },
            { id: 'change', label: '% Change', icon: TrendingUp },
            { id: 'batch', label: 'Batch Calc', icon: Zap },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => updateState({ mode: m.id as CalcMode })}
              className={`flex-1 min-w-[140px] py-4 rounded-[1.25rem] flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === m.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <m.icon className="w-5 h-5" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mode === 'change' ? (
                <>
                  <ValidatedInput
                    label="Initial Value"
                    value={initial}
                    onChange={(v) => updateState({ initial: v })}
                    required
                  />
                  <ValidatedInput
                    label="Final Value"
                    value={final}
                    onChange={(v) => updateState({ final: v })}
                    required
                  />
                </>
              ) : mode === 'batch' ? (
                <div className="col-span-2 text-center py-12">
                   <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                   <h3 className="text-xl font-black uppercase tracking-tight">Batch Mode Coming Soon</h3>
                   <p className="text-gray-400 font-bold">Calculate multiple percentages at once in the next update.</p>
                </div>
              ) : (
                <>
                   <ValidatedInput
                    label={mode === 'original' ? 'Percentage' : 'Percentage (X)'}
                    value={num}
                    onChange={(v) => updateState({ num: v })}
                    suffix={mode === 'what_percent' ? '' : '%'}
                    required
                  />
                  <ValidatedInput
                    label={mode === 'original' ? 'Value (X)' : 'Of Total (Y)'}
                    value={den}
                    onChange={(v) => updateState({ den: v })}
                    required
                  />
                </>
              )}
            </div>

            {mode !== 'batch' && (
              <button 
                onClick={() => saveToHistory(calculation.label, calculation.result)}
                className="w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.01] transition-all"
              >
                Log Calculation
              </button>
            )}
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {calculation.error ? (
               <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] text-rose-600 text-center space-y-2">
                  <p className="font-black uppercase tracking-widest text-xs">Error Found</p>
                  <p className="font-bold">{calculation.error}</p>
                </div>
            ) : mode !== 'batch' && (
              <>
                <ResultCard
                  label="Calculated Result"
                  value={calculation.result}
                  unit={mode === 'change' || mode === 'what_percent' ? '' : ''}
                  color={mode === 'change' ? (calculation.raw >= 0 ? 'green' : 'red') : 'blue'}
                  title="Percentage"
                  copyValue={calculation.result}
                />

                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4">
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Scale</div>
                   <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${mode === 'change' ? (calculation.raw >= 0 ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(Math.abs(calculation.raw), 100)}%` }}
                      />
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                      {calculation.label}
                   </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <History className="w-6 h-6 text-gray-400" />
                 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight text-center">Calculation Log</h3>
              </div>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
              >
                Clear History
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {history.map((h, i) => (
                 <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex justify-between items-center group">
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black text-gray-400 uppercase">{h.time}</span>
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{h.calc}</span>
                    </div>
                    <span className="text-xl font-black text-blue-600 tracking-tighter">{h.result}</span>
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
                  question: 'How do I find the original amount if I only have the percentage?',
                  answer: 'Use the "X is Y% of What?" mode. Enter the current value as X and the percentage as Y. The calculator will divide X by (Y/100) to find the original 100% total.'
                },
                {
                  question: 'What is percentage change?',
                  answer: 'Percentage change measures the relative difference between an initial value and a final value. If the final is higher, it is an increase; if lower, a decrease.'
                },
                {
                  question: 'Are results rounded?',
                  answer: 'Most results are shown with 2 decimal precision for readability, though the underlying engine maintains high floating-point accuracy for all math steps.'
                }
              ]}
           />
        </div>
      </div>
    </CalculatorErrorBoundary>
  );
}
