'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Users } from 'lucide-react';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }
const TIP_PRESETS = [5, 10, 15, 20];
const PEOPLE_PRESETS = [1, 2, 3, 4, 5, 6];

export default function TipCalculator() {
  const [bill, setBill] = useState(1500);
  const [tipPercent, setTipPercent] = useState(10);
  const [people, setPeople] = useState(2);

  const r = useMemo(() => {
    const totalTip = (bill * tipPercent) / 100;
    const totalBill = bill + totalTip;
    const perPerson = people > 0 ? totalBill / people : 0;
    const tipPerPerson = people > 0 ? totalTip / people : 0;
    return { totalTip, totalBill, perPerson, tipPerPerson };
  }, [bill, tipPercent, people]);

  return (
    <CalculatorLayout
      title="Tip & Bill Split Calculator"
      description="Calculate tip amounts and split bills evenly among any number of people. Perfect for restaurants and group dining in Nepal."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Bill Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Bill Amount</label>
            <div className="flex">
              <span className="h-12 px-4 bg-[var(--bg-surface)] border border-r-0 border-[var(--border)] text-[12px] font-black text-[var(--text-muted)] flex items-center">NPR</span>
              <input type="number" value={bill} onChange={e => setBill(Number(e.target.value))} min={0}
                className="flex-1 h-12 px-4 border border-[var(--border)] bg-white font-bold text-lg focus:border-[var(--primary)] outline-none" />
            </div>
          </div>

          {/* Tip Selector */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Tip Percentage</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{tipPercent}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIP_PRESETS.map(v => (
                <button key={v} onClick={() => setTipPercent(v)}
                  className={`py-3 text-xs font-black border transition-all ${tipPercent === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v}%
                </button>
              ))}
            </div>
            <input type="range" min={0} max={30} step={1} value={tipPercent} onChange={e => setTipPercent(Number(e.target.value))}
              className="w-full accent-[#083366] mt-1" />
          </div>

          {/* People Selector */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Number of People</label>
              <span className="text-[11px] font-black text-[var(--primary)]">{people} people</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PEOPLE_PRESETS.map(v => (
                <button key={v} onClick={() => setPeople(v)}
                  className={`py-3 text-xs font-black border transition-all ${people === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {v}
                </button>
              ))}
            </div>
            <input type="number" value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value)))} min={1}
              className="w-full h-10 px-4 border border-[var(--border)] bg-white text-sm font-bold focus:border-[var(--primary)] outline-none" />
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Per Person Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[var(--text-muted)]" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Each Person Pays</div>
            </div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2">
              {Math.round(r.perPerson).toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">NPR · Split {people} {people === 1 ? 'way' : 'ways'}</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Original Bill</span>
              <span className="text-sm font-black">{fmt(bill)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Tip ({tipPercent}%)</span>
              <span className="text-sm font-black text-[#006600]">+ {fmt(r.totalTip)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Bill + Tip</span>
              <span className="text-sm font-black text-[var(--primary)]">{fmt(r.totalBill)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Tip Per Person</span>
              <span className="text-sm font-black">{fmt(r.tipPerPerson)}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How do I calculate a tip?', answer: 'Tip = Bill × Tip% / 100. Add it to the original bill for the total. Divide by people for per-person share.' },
          { question: 'What is the standard tip in Nepal?', answer: 'A 10% service charge is often included at formal restaurants. Where it isn\'t, 5–10% is appreciated but not mandatory.' },
          { question: 'Should I tip if service charge is included?', answer: 'If the bill shows a 10% service charge, no further tip is expected — though rounding up for exceptional service is kind.' },
        ]} />
      }
    />
  );
}
