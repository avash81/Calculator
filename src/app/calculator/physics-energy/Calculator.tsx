'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function EnergyCalc() {
  const [eVal, setE] = useState('');
  const [mVal, setM] = useState('2');
  const [vVal, setV] = useState('10');

  const res = useMemo(() => {
    const e = parseFloat(eVal), m = parseFloat(mVal), v = parseFloat(vVal);
    if (isNaN(e) && !isNaN(m) && !isNaN(v)) return { label: 'Kinetic Energy (KE)', val: (0.5 * m * v * v).toFixed(4), unit: 'J' };
    if (isNaN(m) && !isNaN(e) && !isNaN(v)) return { label: 'Mass (m)', val: ((2 * e) / (v * v)).toFixed(4), unit: 'kg' };
    if (isNaN(v) && !isNaN(e) && !isNaN(m)) return { label: 'Velocity (v)', val: Math.sqrt((2 * e) / m).toFixed(4), unit: 'm/s' };
    return null;
  }, [eVal, mVal, vVal]);

  const inputCls = (empty: boolean) =>
    `w-full h-12 px-4 border-2 font-mono text-xl font-black focus:outline-none transition-all ${empty ? 'border-dashed border-[var(--primary)] bg-blue-50 placeholder-blue-300' : 'border-[var(--border)] bg-white focus:border-[var(--primary)]'}`;

  return (
    <CalculatorLayout
      title="Kinetic Energy Calculator"
      description="Calculate kinetic energy (KE = ½mv²), mass, or velocity. Leave one field blank to solve for it."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-[12px] text-blue-800 font-bold">Leave one field blank — the calculator will solve for it.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Kinetic Energy — E (Joules)</label>
              <input type="number" value={eVal} onChange={e => setE(e.target.value)} placeholder="? (leave blank to solve)" className={inputCls(eVal === '')} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Mass — m (kg)</label>
              <input type="number" value={mVal} onChange={e => setM(e.target.value)} placeholder="? (leave blank to solve)" className={inputCls(mVal === '')} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Velocity — v (m/s)</label>
              <input type="number" value={vVal} onChange={e => setV(e.target.value)} placeholder="? (leave blank to solve)" className={inputCls(vVal === '')} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Examples</label>
            {[
              { label: 'Ball (2kg, 10m/s)',   e:'', m:'2',  v:'10' },
              { label: 'Car (1000kg, 30m/s)', e:'', m:'1000', v:'30' },
              { label: 'Fast mass?',           e:'4500', m:'', v:'30' },
            ].map(ex => (
              <button key={ex.label} onClick={() => { setE(ex.e); setM(ex.m); setV(ex.v); }}
                className="w-full p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left text-[12px] font-bold text-[var(--text-main)] transition-all">
                {ex.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[14px] font-mono font-black text-[var(--primary)]">KE = ½ × m × v²</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            {res ? (
              <>
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">{res.label}</div>
                <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{res.val}</div>
                <div className="text-xl font-black text-[var(--text-secondary)]">{res.unit}</div>
              </>
            ) : (
              <div className="text-lg font-bold text-[var(--text-muted)] py-4">Leave exactly one field blank to solve for it.</div>
            )}
          </div>

          <div className="space-y-2">
            {[
              { l: 'Energy (E)', v: eVal || '?', u: 'J' },
              { l: 'Mass (m)',   v: mVal || '?', u: 'kg' },
              { l: 'Velocity (v)', v: vVal || '?', u: 'm/s' },
            ].map(({ l, v, u }) => (
              <div key={l} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{l}</span>
                <span className="text-sm font-black font-mono text-[var(--text-main)]">{v} <span className="text-[var(--text-muted)]">{u}</span></span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)]">Note: Doubling velocity quadruples energy (v² relationship). Mass has a linear effect.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is kinetic energy?', answer: 'KE is the energy an object has due to its motion. KE = ½mv² where m is mass (kg) and v is velocity (m/s). Unit: Joules (J).' },
          { question: 'Why does speed affect energy more than mass?', answer: 'Because KE is proportional to v². Doubling speed quadruples energy, while doubling mass only doubles energy.' },
          { question: 'What is the difference between KE and PE?', answer: 'Kinetic Energy (KE) is energy of motion; Potential Energy (PE) is stored energy (e.g., gravitational: mgh).' },
        ]} />
      }
    />
  );
}
