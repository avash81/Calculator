'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function BrickCalculator() {
  const [length, setLength]   = useState(10);
  const [height, setHeight]   = useState(10);
  const [thickness, setThickness] = useState(9);
  const [brickL, setBrickL]   = useState(9);
  const [brickW, setBrickW]   = useState(4.5);
  const [brickH, setBrickH]   = useState(3);
  const [mortar, setMortar]   = useState(0.5);

  const result = useMemo(() => {
    const wallVol = length * 12 * height * 12 * thickness;
    const brickVol = (brickL + mortar) * (brickW + mortar) * (brickH + mortar);
    const numBricks = Math.ceil(wallVol / brickVol);
    const totalBricks = Math.ceil(numBricks * 1.05);
    return { totalBricks, wallArea: length * height, wallVol: (wallVol / 1728).toFixed(2) };
  }, [length, height, thickness, brickL, brickW, brickH, mortar]);

  return (
    <CalculatorLayout
      title="Brick Calculator (Nepal)"
      description="Estimate the number of bricks required for wall construction in Nepal. Includes 5% standard wastage, 9-inch and 4.5-inch wall options."
      category={{ label: 'Construction', href: '/calculator/category/construction' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Wall Length (ft)" value={length} onChange={setLength} min={0.1} required />
            <ValidatedInput label="Wall Height (ft)" value={height} onChange={setHeight} min={0.1} required />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Wall Thickness (Nepal Standard)</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 9, l: '9 Inch (Double)' }, { v: 4.5, l: '4.5 Inch (Single)' }].map(opt => (
                <button key={opt.v} onClick={() => setThickness(opt.v)}
                  className={`py-4 text-xs font-black border transition-all uppercase ${thickness === opt.v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-5 bg-white border border-[var(--border)]">
            <div className="text-[11px] font-black uppercase text-[var(--text-main)] mb-2">Brick Dimensions (inches)</div>
            <div className="grid grid-cols-3 gap-3">
              <ValidatedInput label="Length" value={brickL} onChange={setBrickL} min={1} />
              <ValidatedInput label="Width"  value={brickW} onChange={setBrickW} min={1} />
              <ValidatedInput label="Height" value={brickH} onChange={setBrickH} min={1} />
            </div>
            <ValidatedInput label="Mortar Joint (in)" value={mortar} onChange={setMortar} min={0} max={2} step={0.1} />
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200">
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Nepal standard brick: <strong>9" × 4.5" × 3"</strong>. Includes <strong>5% wastage</strong> as per standard construction practice.
            </p>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Bricks Required</div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2">{result.totalBricks.toLocaleString()}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Includes 5% wastage</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Wall Surface Area</span>
              <span className="text-sm font-black text-[var(--text-main)]">{result.wallArea} sq. ft</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Wall Volume</span>
              <span className="text-sm font-black text-[var(--text-main)]">{result.wallVol} ft³</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Bricks / sq.ft</span>
              <span className="text-sm font-black text-[var(--text-main)]">{(result.totalBricks / result.wallArea).toFixed(1)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Wall Thickness</span>
              <span className="text-sm font-black text-[var(--text-main)]">{thickness} inch</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">This is a draft estimate. Consult your site engineer for final material orders.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the standard brick size in Nepal?', answer: 'Standard Nepal brick is 9" × 4.5" × 3" (230mm × 110mm × 70mm) per NBC standard.' },
          { question: 'How much wastage should I allow?', answer: 'Add 5–10% for standard construction jobs in Nepal to account for breakage and site handling.' },
          { question: 'What is a 9-inch vs 4.5-inch wall?', answer: 'A 9-inch wall uses two brick lengths for load-bearing walls. A 4.5-inch single-brick wall is used for partitions and non-structural dividers.' },
        ]} />
      }
    />
  );
}
