'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

type Gender = 'male' | 'female';

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [heightCm, setHeightCm] = useState(170);

  const r = useMemo(() => {
    const heightInches = heightCm / 2.54;
    const inchesOver5ft = Math.max(0, heightInches - 60);
    const base = gender === 'male' ? 50.0 : 45.5;
    const ideal = base + 2.3 * inchesOver5ft;
    return { ideal, min: ideal * 0.9, max: ideal * 1.1 };
  }, [gender, heightCm]);

  const FORMULAS = [
    { name: 'Devine',   male: 50 + 2.3 * Math.max(0, heightCm / 2.54 - 60), female: 45.5 + 2.3 * Math.max(0, heightCm / 2.54 - 60) },
    { name: 'Robinson', male: 52 + 1.9 * Math.max(0, heightCm / 2.54 - 60), female: 49   + 1.7 * Math.max(0, heightCm / 2.54 - 60) },
    { name: 'Miller',   male: 56.2 + 1.41 * Math.max(0, heightCm / 2.54 - 60), female: 53.1 + 1.36 * Math.max(0, heightCm / 2.54 - 60) },
  ];

  return (
    <CalculatorLayout
      title="Ideal Weight Calculator"
      description="Calculate your ideal healthy weight range using the Devine formula, validated by healthcare professionals worldwide."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
          {/* Gender */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Gender</label>
            <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-surface)]">
              {(['male', 'female'] as Gender[]).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${gender === g ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Height</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{heightCm} cm ({(heightCm / 2.54 / 12 | 0)}&apos; {Math.round(heightCm / 2.54 % 12)}&quot;)</span>
            </div>
            <input type="number" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))} min={100} max={250}
              className="w-full h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none" />
            <input type="range" min={100} max={250} step={1} value={heightCm} onChange={e => setHeightCm(Number(e.target.value))}
              className="w-full accent-[#083366]" />
          </div>

          {/* Multi-formula comparison */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Formula Comparison</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {FORMULAS.map(f => (
                <div key={f.name} className="px-4 py-3 flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{f.name}</span>
                  <span className="text-sm font-black text-[var(--primary)]">
                    {(gender === 'male' ? f.male : f.female).toFixed(1)} kg
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Devine Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">
              {gender === 'male' ? '50.0 + 2.3 × (inches over 5ft)' : '45.5 + 2.3 × (inches over 5ft)'}
            </code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Ideal Weight Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Ideal Weight (Devine)</div>
            <div className="text-6xl font-black text-[#006600] tracking-tighter mb-3">{r.ideal.toFixed(1)} <span className="text-2xl">kg</span></div>
            <div className="text-sm font-bold text-[var(--text-secondary)]">≈ {(r.ideal * 2.20462).toFixed(1)} lbs</div>
          </div>

          {/* Range */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Lower Healthy Range</span>
              <span className="text-sm font-black text-[var(--text-main)]">{r.min.toFixed(1)} kg</span>
            </div>
            <div className="p-5 bg-[var(--primary)] text-white flex justify-between">
              <span className="text-[11px] font-bold uppercase">Ideal Target</span>
              <span className="text-sm font-black">{r.ideal.toFixed(1)} kg</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Upper Healthy Range</span>
              <span className="text-sm font-black text-[var(--text-main)]">{r.max.toFixed(1)} kg</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
              Range is ±10% of ideal. Consult a physician for personalized targets — athletes and those with high muscle mass may differ.
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the Devine formula?', answer: 'Developed in 1974 for medical drug dosing calculations. Male: 50 + 2.3 × inches over 5ft. Female: 45.5 + 2.3 × inches over 5ft.' },
          { question: 'Is ideal weight the same for everyone?', answer: 'No — bone density, muscle mass, and body composition all vary. The formula gives a general guideline, not an exact prescription.' },
          { question: 'How is this different from BMI?', answer: 'BMI is a ratio of weight to height squared. Ideal weight formulas target a specific weight based on height alone, without considering body composition.' },
        ]} />
      }
    />
  );
}
