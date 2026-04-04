'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

type Mode = 'force' | 'work' | 'power' | 'pressure';

const MODES: { key: Mode; label: string; formula: string; l1: string; l2: string; u: string }[] = [
  { key: 'force',    label: 'Force',    formula: 'F = m × a', l1: 'Mass (kg)',    l2: 'Acceleration (m/s²)', u: 'N'  },
  { key: 'work',     label: 'Work',     formula: 'W = F × d', l1: 'Force (N)',    l2: 'Distance (m)',         u: 'J'  },
  { key: 'power',    label: 'Power',    formula: 'P = W / t', l1: 'Work (J)',     l2: 'Time (s)',             u: 'W'  },
  { key: 'pressure', label: 'Pressure', formula: 'P = F / A', l1: 'Force (N)',    l2: 'Area (m²)',            u: 'Pa' },
];

export default function ForceCalc() {
  const [mode, setMode] = useState<Mode>('force');
  const [v1, setV1] = useState('10');
  const [v2, setV2] = useState('2');

  const res = useMemo(() => {
    const n1 = parseFloat(v1), n2 = parseFloat(v2);
    if (isNaN(n1) || isNaN(n2)) return null;
    const m = MODES.find(m => m.key === mode)!;
    const val = ['force','work'].includes(mode) ? n1 * n2 : n1 / n2;
    return { val: val.toFixed(4), unit: m.u, formula: m.formula };
  }, [v1, v2, mode]);

  const current = MODES.find(m => m.key === mode)!;

  return (
    <CalculatorLayout
      title="Physics Force Calculator"
      description="Calculate Force (F=ma), Work (W=Fd), Power (P=W/t), and Pressure (P=F/A) using Newton's laws of motion."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Calculation Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(m => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  className={`py-3 text-xs font-black border transition-all uppercase ${mode === m.key ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {m.label}
                  <span className="block text-[9px] font-mono mt-0.5 opacity-60">{m.formula}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{current.l1}</label>
              <input type="number" value={v1} onChange={e => setV1(e.target.value)}
                className="w-full h-12 px-4 border border-[var(--border)] bg-white font-mono font-bold text-xl focus:border-[var(--primary)] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{current.l2}</label>
              <input type="number" value={v2} onChange={e => setV2(e.target.value)}
                className="w-full h-12 px-4 border border-[var(--border)] bg-white font-mono font-bold text-xl focus:border-[var(--primary)] outline-none" />
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Active Formula</div>
            <code className="text-[14px] font-mono font-black text-[var(--primary)]">{current.formula}</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">{current.label} Result</div>
            {res ? (
              <>
                <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{res.val}</div>
                <div className="text-xl font-black text-[var(--text-secondary)] uppercase">{res.unit}</div>
              </>
            ) : (
              <div className="text-lg font-bold text-[var(--text-muted)]">Enter valid values</div>
            )}
          </div>

          <div className="space-y-2">
            {[
              { label: 'Input 1', val: `${v1} ${current.l1.split('(')[1]?.replace(')','') || ''}` },
              { label: 'Input 2', val: `${v2} ${current.l2.split('(')[1]?.replace(')','') || ''}` },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                <span className="text-sm font-black font-mono text-[var(--text-main)]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: "What is Newton's Second Law?", answer: "F = ma: the force acting on an object equals its mass times its acceleration. SI unit of force is the Newton (N = kg·m/s²)." },
          { question: 'What is work in physics?', answer: 'Work = Force × Distance. Work is done when a force causes displacement. Unit: Joules (J).' },
          { question: 'What is pressure?', answer: 'Pressure = Force / Area. It measures force per unit area. SI unit: Pascal (Pa = N/m²).' },
        ]} />
      }
    />
  );
}
