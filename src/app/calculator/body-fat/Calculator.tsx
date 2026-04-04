'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

type Gender = 'male' | 'female';

const CATEGORIES = {
  male:   [{ max: 6,  label: 'Essential Fat', color: 'text-blue-600' }, { max: 14, label: 'Athletes', color: 'text-[#006600]' }, { max: 18, label: 'Fitness', color: 'text-[#006600]' }, { max: 25, label: 'Average', color: 'text-amber-600' }, { max: Infinity, label: 'Obese', color: 'text-red-600' }],
  female: [{ max: 14, label: 'Essential Fat', color: 'text-blue-600' }, { max: 21, label: 'Athletes', color: 'text-[#006600]' }, { max: 25, label: 'Fitness', color: 'text-[#006600]' }, { max: 32, label: 'Average', color: 'text-amber-600' }, { max: Infinity, label: 'Obese', color: 'text-red-600' }],
};

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(90);

  const bf = useMemo(() => {
    let val: number;
    if (gender === 'male') {
      val = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      val = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
    }
    return Math.max(0, Math.min(100, val));
  }, [gender, height, neck, waist, hip]);

  const { label: catLabel, color: catColor } = CATEGORIES[gender].find(c => bf < c.max)!;

  const RANGES = gender === 'male'
    ? [['Essential', '2–5%'], ['Athletes', '6–13%'], ['Fitness', '14–17%'], ['Average', '18–24%'], ['Obese', '25%+']]
    : [['Essential', '10–13%'], ['Athletes', '14–20%'], ['Fitness', '21–24%'], ['Average', '25–31%'], ['Obese', '32%+']];

  return (
    <CalculatorLayout
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the U.S. Navy circumference method. Enter neck, waist, and height for accurate results."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-6">
          {/* Gender Toggle */}
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

          {/* Measurements */}
          <div className="grid grid-cols-2 gap-4 p-5 bg-white border border-[var(--border)]">
            {[
              { label: 'Height (cm)', value: height, setter: setHeight },
              { label: 'Neck Circ. (cm)', value: neck, setter: setNeck },
              { label: 'Waist Circ. (cm)', value: waist, setter: setWaist },
              ...(gender === 'female' ? [{ label: 'Hip Circ. (cm)', value: hip, setter: setHip }] : []),
            ].map(({ label, value, setter }) => (
              <div key={label} className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</label>
                <input type="number" value={value} onChange={e => setter(Number(e.target.value))}
                  className="w-full h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none" />
              </div>
            ))}
          </div>

          {/* Reference Ranges */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Reference Ranges ({gender})</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {RANGES.map(([label, range]) => (
                <div key={label} className="px-4 py-2 flex justify-between">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">{label}</span>
                  <span className="text-[11px] font-black text-[var(--primary)]">{range}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula (Navy Method)</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">
              {gender === 'male' ? '495 / (1.0324 − 0.19077×log(W−N) + 0.15456×log(H)) − 450' : '495 / (1.29579 − 0.35004×log(W+Hip−N) + 0.221×log(H)) − 450'}
            </code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Body Fat Result */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Body Fat Percentage</div>
            <div className={`text-7xl font-black tracking-tighter mb-3 ${catColor}`}>{bf.toFixed(1)}<span className="text-3xl">%</span></div>
            <div className={`inline-block px-4 py-1 text-xs font-black uppercase tracking-widest border ${catColor} border-current`}>
              {catLabel}
            </div>
          </div>

          {/* Gauge Bar */}
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
            <div className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Scale (0–40%)</div>
            <div className="h-4 w-full bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-green-400 via-yellow-300 to-red-500 opacity-80" />
              <div className="absolute top-0 bottom-0 w-1.5 bg-[var(--primary)]"
                style={{ left: `${Math.min((bf / 40) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-[var(--text-muted)] uppercase">
              <span>0%</span><span>10%</span><span>20%</span><span>30%</span><span>40%</span>
            </div>
          </div>

          {/* Measurements Summary */}
          <div className="space-y-2">
            {[['Height', `${height} cm`], ['Neck', `${neck} cm`], ['Waist', `${waist} cm`], ...(gender === 'female' ? [['Hip', `${hip} cm`]] : [])].map(([l, v]) => (
              <div key={l} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{l}</span>
                <span className="text-sm font-black text-[var(--text-main)]">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">U.S. Navy circumference method. This is an estimate — DEXA scan provides clinical-grade accuracy.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How accurate is the Navy method?', answer: 'The Navy circumference method is a reliable estimate for most people using body measurements. It may slightly overestimate in highly muscular individuals.' },
          { question: 'What is a healthy body fat percentage?', answer: 'For men, 10–20% is healthy; for women, 18–28% is typically healthy. Athletes usually have lower ranges.' },
          { question: 'Why measure waist, not belly?', answer: 'The waist measurement for this formula is taken at the narrowest point — the navel level for men, and the narrowest part for women.' },
        ]} />
      }
    />
  );
}
