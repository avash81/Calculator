'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Plus, Trash2, Flame } from 'lucide-react';

const MOMO_TYPES = [
  { id: 'buff',    name: 'Buff Momo (Steamed)',    cal: 35, protein: 3.2, fat: 1.8, carbs: 3.5 },
  { id: 'chicken', name: 'Chicken Momo (Steamed)', cal: 30, protein: 2.8, fat: 1.2, carbs: 3.2 },
  { id: 'veg',     name: 'Veg Momo (Steamed)',     cal: 24, protein: 0.8, fat: 0.6, carbs: 4.8 },
  { id: 'cmomo',   name: 'C-Momo (Spicy Fried)',   cal: 48, protein: 2.5, fat: 2.5, carbs: 5.5 },
  { id: 'fried',   name: 'Fried Momo',             cal: 62, protein: 3.0, fat: 4.2, carbs: 3.8 },
];

export default function MomoCalculator() {
  const [items, setItems] = useState([{ typeId: 'buff', count: 10 }]);

  const result = useMemo(() => {
    let cals = 0, protein = 0, fat = 0, carbs = 0;
    items.forEach(item => {
      const t = MOMO_TYPES.find(m => m.id === item.typeId);
      if (t) { cals += t.cal * item.count; protein += t.protein * item.count; fat += t.fat * item.count; carbs += t.carbs * item.count; }
    });
    return { cals, protein: protein.toFixed(1), fat: fat.toFixed(1), carbs: carbs.toFixed(1) };
  }, [items]);

  const update = (i: number, f: string, v: any) => { const list = [...items]; (list[i] as any)[f] = v; setItems(list); };
  const add    = () => setItems([...items, { typeId: 'buff', count: 10 }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <CalculatorLayout
      title="Momo Calorie Counter 🥟"
      description="Track calories and macronutrients for Nepal's favourite dish. Mix varieties and serving sizes for a complete nutritional picture."
      category={{ label: 'Health', href: '/calculator/category/health' }}
      leftPanel={
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 bg-white border border-[var(--border)] space-y-3 relative">
              <div className="grid grid-cols-[1fr_120px] gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Type</label>
                  <select value={item.typeId} onChange={e => update(idx, 'typeId', e.target.value)}
                    className="w-full h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm outline-none focus:border-[var(--primary)] cursor-pointer">
                    {MOMO_TYPES.map(t => <option key={t.id} value={t.id}>{t.name} ({t.cal} kcal/pc)</option>)}
                  </select>
                </div>
                <ValidatedInput label="Qty (pcs)" value={item.count} onChange={v => update(idx, 'count', v)} min={1} max={100} />
              </div>

              <div className="flex gap-2">
                {[5, 10, 20].map(p => (
                  <button key={p} onClick={() => update(idx, 'count', p)}
                    className={`px-3 py-1.5 text-[10px] font-black border transition-all ${item.count === p ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                    {p === 5 ? 'Half' : p === 10 ? 'Full' : 'Double'} plate
                  </button>
                ))}
              </div>

              {items.length > 1 && (
                <button onClick={() => remove(idx)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white flex items-center justify-center transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <button onClick={add} className="w-full py-3 border border-dashed border-[var(--border)] text-[11px] font-bold text-[var(--primary)] uppercase hover:bg-[var(--bg-surface)] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Another Type
          </button>

          {/* Calorie Reference */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Per Piece Reference</h3>
            </div>
            {MOMO_TYPES.map(t => (
              <div key={t.id} className="px-4 py-2 border-b border-[var(--border)] flex justify-between hover:bg-[var(--bg-surface)]">
                <span className="text-[11px] font-bold text-[var(--text-secondary)]">{t.name}</span>
                <span className="text-[11px] font-black text-[var(--primary)]">{t.cal} kcal</span>
              </div>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Total Calories</div>
            </div>
            <div className="text-6xl font-black text-orange-500 tracking-tighter mb-2">{result.cals}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">kcal</div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Protein', val: result.protein, unit: 'g', color: 'text-blue-600' },
              { label: 'Fat',     val: result.fat,     unit: 'g', color: 'text-red-600'  },
              { label: 'Carbs',   val: result.carbs,   unit: 'g', color: 'text-amber-600'},
            ].map(({ label, val, unit, color }) => (
              <div key={label} className="p-4 bg-white border border-[var(--border)] text-center">
                <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{label}</div>
                <div className={`text-lg font-black ${color}`}>{val}{unit}</div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              {result.cals > 600
                ? '⚠️ High calorie meal. Consider a 30–45 min walk (≈300 kcal) to balance your intake.'
                : '✓ Moderate portion. Steamed momos are one of Nepal\'s healthiest street food choices.'}
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the healthiest momo?', answer: 'Steamed Veg Momos have the fewest calories (~24 kcal/piece), followed by Steamed Chicken (~30 kcal/piece).' },
          { question: 'Why are Fried Momos higher in calories?', answer: 'Deep frying adds significant fat, nearly doubling the calorie count compared to steamed versions of the same filling.' },
          { question: 'How accurate is this?', answer: 'These are estimated averages based on typical Kathmandu momo serving sizes. Exact values vary by restaurant and recipe.' },
        ]} />
      }
    />
  );
}
