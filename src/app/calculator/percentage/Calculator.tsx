'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Percent, TrendingUp, Search, Layers, ArrowRightLeft } from 'lucide-react';

type CalcMode = 'what_is' | 'what_percent' | 'original' | 'change' | 'add_sub';
const DEFAULT_STATE = { mode: 'what_is' as CalcMode, num: 20, den: 500, initial: 100, final: 120 };

const MODES = [
  { id: 'what_is', label: 'X% of Y', icon: Percent },
  { id: 'what_percent', label: 'X is ?% of Y', icon: Search },
  { id: 'original', label: 'X is Y% of ?', icon: Layers },
  { id: 'add_sub', label: 'Value ± %', icon: ArrowRightLeft },
  { id: 'change', label: '% Change', icon: TrendingUp },
] as const;

export default function PercentageCalculator() {
  const [state, setState] = useLocalStorage('calcpro_percentage_v2', DEFAULT_STATE);
  const { mode, num, den, initial, final } = state;
  const updateState = (u: Partial<typeof DEFAULT_STATE>) => setState({ ...state, ...u });

  const calc = useMemo(() => {
    let result = '', label = '', raw = 0, error: string | null = null;
    switch (mode) {
      case 'what_is':   raw = (num / 100) * den; result = raw.toLocaleString(); label = `${num}% of ${den}`; break;
      case 'what_percent': if (!den) { error = 'Division by zero'; break; } raw = (num / den) * 100; result = `${raw.toFixed(2)}%`; label = `${num} is ${raw.toFixed(2)}% of ${den}`; break;
      case 'original':  if (!num) { error = 'Percentage cannot be zero'; break; } raw = den / (num / 100); result = raw.toLocaleString(); label = `${den} is ${num}% of ${raw.toFixed(2)}`; break;
      case 'change':    if (!initial) { error = 'Initial cannot be zero'; break; } raw = ((final - initial) / initial) * 100; result = `${raw >= 0 ? '+' : ''}${raw.toFixed(2)}%`; label = `${raw >= 0 ? 'Increase' : 'Decrease'} from ${initial} → ${final}`; break;
      case 'add_sub':   raw = den + (num / 100) * den; result = raw.toLocaleString(); label = `${den} + ${num}% = ${result}`; break;
    }
    return { result, label, raw, error };
  }, [mode, num, den, initial, final]);

  const isChange = mode === 'change', isAddSub = mode === 'add_sub';

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Solve any percentage problem instantly — discounts, growth rates, original values, and more."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Calculation Mode</label>
            <div className="space-y-1">
              {MODES.map(m => (
                <button key={m.id} onClick={() => updateState({ mode: m.id as CalcMode })}
                  className={`w-full p-4 border text-left flex items-center gap-3 transition-all ${mode === m.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'}`}>
                  <m.icon className="w-4 h-4 shrink-0" />
                  <span className="text-[12px] font-bold uppercase tracking-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs by Mode */}
          <div className="space-y-4 p-5 bg-white border border-[var(--border)]">
            {isChange ? (
              <>
                <ValidatedInput label="Initial Value" value={initial} onChange={v => updateState({ initial: v })} required />
                <ValidatedInput label="Final Value" value={final} onChange={v => updateState({ final: v })} required />
              </>
            ) : isAddSub ? (
              <>
                <ValidatedInput label="Base Value" value={den} onChange={v => updateState({ den: v })} required />
                <ValidatedInput label="Percentage (%)" value={num} onChange={v => updateState({ num: v })} suffix="%" required />
              </>
            ) : (
              <>
                <ValidatedInput label={mode === 'original' ? 'Percentage (%)' : 'Value X'} value={num} onChange={v => updateState({ num: v })} suffix={mode === 'what_percent' ? '' : '%'} required />
                <ValidatedInput label={mode === 'original' ? 'Result Value' : 'Total Y'} value={den} onChange={v => updateState({ den: v })} required />
              </>
            )}
          </div>

          {/* Quick % Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Percentages</label>
            <div className="grid grid-cols-6 gap-2">
              {[5, 10, 13, 15, 20, 25].map(v => (
                <button key={v} onClick={() => updateState({ num: v })}
                  className="py-2 text-[11px] font-bold border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all">
                  {v}%
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {calc.error ? (
            <div className="p-6 bg-red-50 border border-red-300 text-red-700">
              <p className="text-xs font-black uppercase">Error</p>
              <p className="text-sm font-bold mt-1">{calc.error}</p>
            </div>
          ) : (
            <>
              {isAddSub ? (
                <div className="space-y-4">
                  <div className="p-8 bg-white border border-[var(--border)] text-center">
                    <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Add (+{num}%)</div>
                    <div className="text-5xl font-black text-[#006600] tracking-tighter">{(den * (1 + num / 100)).toLocaleString()}</div>
                  </div>
                  <div className="p-8 bg-white border border-[var(--border)] text-center">
                    <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Subtract (-{num}%)</div>
                    <div className="text-5xl font-black text-red-600 tracking-tighter">{(den * (1 - num / 100)).toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-white border border-[var(--border)] text-center">
                  <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Result</div>
                  <div className={`text-6xl font-black tracking-tighter mb-2 ${isChange && calc.raw >= 0 ? 'text-[#006600]' : isChange ? 'text-red-600' : 'text-[var(--primary)]'}`}>
                    {calc.result}
                  </div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-2">{calc.label}</div>
                </div>
              )}

              {/* Bar Graph */}
              {!isAddSub && (
                <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
                  <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-3">Visual Scale (0–100%)</div>
                  <div className="h-3 w-full bg-gray-200 relative overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${isChange && calc.raw < 0 ? 'bg-red-500' : 'bg-[var(--primary)]'}`}
                      style={{ width: `${Math.min(Math.abs(calc.raw), 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-2 font-medium">{calc.label}</div>
                </div>
              )}
            </>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How do I find the original amount?', answer: 'Use "X is Y% of ?" mode — enter the known result as X and the percentage as Y. The calculator divides X ÷ (Y/100).' },
          { question: 'What is percentage change?', answer: 'It measures the relative difference between initial and final values: ((Final − Initial) / Initial) × 100.' },
          { question: 'Are results rounded?', answer: 'Results show 2 decimal places for readability. The engine maintains full floating-point accuracy internally.' },
        ]} />
      }
    />
  );
}
