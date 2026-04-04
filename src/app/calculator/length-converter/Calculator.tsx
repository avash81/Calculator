'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ArrowLeftRight } from 'lucide-react';

const UNITS: Record<string, { name: string; factor: number }> = {
  m:    { name: 'Meter (m)',          factor: 1        },
  km:   { name: 'Kilometer (km)',     factor: 1000     },
  cm:   { name: 'Centimeter (cm)',    factor: 0.01     },
  mm:   { name: 'Millimeter (mm)',    factor: 0.001    },
  mile: { name: 'Mile (mi)',          factor: 1609.34  },
  yard: { name: 'Yard (yd)',          factor: 0.9144   },
  foot: { name: 'Foot (ft)',          factor: 0.3048   },
  inch: { name: 'Inch (in)',          factor: 0.0254   },
};

const QUICK = [
  { label: '1 km → m',    f: 'km', t: 'm',    v: 1 },
  { label: '1 mile → km', f: 'mile', t: 'km', v: 1 },
  { label: '1 foot → in', f: 'foot', t: 'inch', v: 1 },
  { label: '1 m → ft',    f: 'm', t: 'foot', v: 1 },
];

export default function LengthConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom]   = useState('km');
  const [to, setTo]       = useState('m');

  const result = useMemo(() => {
    const r = (value * UNITS[from].factor) / UNITS[to].factor;
    return r.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, from, to]);

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  return (
    <CalculatorLayout
      title="Length Converter"
      description="Convert between meters, kilometers, miles, feet, inches and more with engineering-grade precision."
      category={{ label: 'Conversion', href: '/calculator/category/conversion' }}
      leftPanel={
        <div className="space-y-6">
          {/* Value Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Amount</label>
            <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} min={0}
              className="w-full h-14 px-4 border-2 border-[var(--border)] bg-white font-mono text-2xl font-black focus:border-[var(--primary)] outline-none" />
          </div>

          {/* From / Swap / To */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">From</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full h-12 px-3 border border-[var(--border)] bg-[var(--bg-surface)] font-bold text-sm outline-none focus:border-[var(--primary)] cursor-pointer">
                {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            <button onClick={swap}
              className="mt-6 h-10 w-10 border border-[var(--border)] bg-white flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all">
              <ArrowLeftRight className="w-4 h-4" />
            </button>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">To</label>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="w-full h-12 px-3 border border-[var(--border)] bg-[var(--bg-surface)] font-bold text-sm outline-none focus:border-[var(--primary)] cursor-pointer">
                {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
          </div>

          {/* Quick refs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Conversions</label>
            {QUICK.map(q => (
              <button key={q.label} onClick={() => { setValue(q.v); setFrom(q.f); setTo(q.t); }}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{q.label}</span>
                <span className="text-[11px] font-black text-[var(--primary)]">
                  {((q.v * UNITS[q.f].factor) / UNITS[q.t].factor).toFixed(4)} {q.t}
                </span>
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Result</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter mb-2 font-mono break-all">{result}</div>
            <div className="text-sm font-bold text-[var(--text-secondary)] uppercase">{UNITS[to].name}</div>
          </div>

          <div className="space-y-2">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Input</span>
              <span className="text-sm font-black text-[var(--text-main)]">{value} {UNITS[from].name}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Factor</span>
              <span className="text-sm font-black text-[var(--text-main)] font-mono">{(UNITS[from].factor / UNITS[to].factor).toFixed(6)}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How many meters in a kilometer?', answer: '1 kilometer = exactly 1,000 meters.' },
          { question: 'How do you convert miles to km?', answer: '1 mile = approximately 1.60934 km. Multiply miles by 1.60934.' },
        ]} />
      }
    />
  );
}
