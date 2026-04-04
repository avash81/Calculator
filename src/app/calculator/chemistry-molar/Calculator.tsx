'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const ELEMENTS: Record<string,number> = {
  'H':1.008,'He':4.002,'Li':6.941,'Be':9.012,'B':10.811,'C':12.011,'N':14.007,'O':15.999,
  'F':18.998,'Ne':20.180,'Na':22.990,'Mg':24.305,'Al':26.982,'Si':28.085,'P':30.974,'S':32.065,
  'Cl':35.453,'Ar':39.948,'K':39.098,'Ca':40.078,'Fe':55.845,'Cu':63.546,'Zn':65.38,'Ag':107.868,
  'Au':196.967,'Pb':207.2,'I':126.904,'Br':79.904
};

const COMPOUNDS = [
  { label:'Water',       formula:'H2O'     },
  { label:'Salt',        formula:'NaCl'    },
  { label:'Glucose',     formula:'C6H12O6' },
  { label:'CO₂',         formula:'CO2'     },
  { label:'H₂SO₄',       formula:'H2SO4'   },
  { label:'Ammonia',     formula:'NH3'     },
];

export default function MolarMassCalc() {
  const [formula, setFormula] = useState('H2O');

  const res = useMemo(() => {
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let m, total = 0;
    const breakdown: { el:string; mass:number; n:number }[] = [];
    while ((m = regex.exec(formula)) !== null) {
      const el = m[1], count = m[2] === '' ? 1 : parseInt(m[2]);
      const mass = ELEMENTS[el];
      if (mass) { total += mass * count; breakdown.push({ el, mass, n:count }); }
    }
    return { total: total.toFixed(3), breakdown };
  }, [formula]);

  return (
    <CalculatorLayout
      title="Molar Mass Calculator"
      description="Calculate the molar mass of any chemical compound. Enter the formula (e.g., H2O, NaCl, C6H12O6) to get the molecular weight in g/mol."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Chemical Formula (Case Sensitive)</label>
            <input type="text" value={formula} onChange={e => setFormula(e.target.value)} placeholder="e.g. H2O"
              className="w-full h-16 px-6 border border-[var(--border)] bg-white font-mono text-3xl font-black focus:border-[var(--primary)] outline-none" />
            <p className="text-[10px] text-[var(--text-muted)]">Use element symbols exactly as on the periodic table (e.g., Na, Cl, Fe).</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Compounds</label>
            <div className="grid grid-cols-2 gap-2">
              {COMPOUNDS.map(c => (
                <button key={c.formula} onClick={() => setFormula(c.formula)}
                  className={`p-3 border text-left transition-all ${formula===c.formula ? 'border-[var(--primary)] bg-blue-50' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{c.label}</div>
                  <div className="text-sm font-black font-mono text-[var(--primary)]">{c.formula}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Atomic breakdown */}
          {res.breakdown.length > 0 && (
            <div className="bg-white border border-[var(--border)]">
              <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
                <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Atomic Breakdown</h3>
              </div>
              {res.breakdown.map((item, i) => (
                <div key={i} className="px-4 py-3 border-b border-[var(--border)] last:border-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center font-black text-[var(--primary)] text-sm">{item.el}</div>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">× {item.n} atoms</span>
                  </div>
                  <span className="text-sm font-black font-mono text-[var(--text-main)]">{(item.mass*item.n).toFixed(3)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Molar Mass</div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{res.total}</div>
            <div className="text-sm font-black text-[var(--text-secondary)] uppercase">g/mol (Daltons)</div>
          </div>

          <div className="space-y-2">
            {res.breakdown.map((item) => (
              <div key={item.el} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-center">
                <span className="text-sm font-black text-[var(--primary)]">{item.el}</span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase">{item.n} × {item.mass.toFixed(3)}</span>
                <span className="text-sm font-black font-mono text-[var(--text-main)]">{(item.mass*item.n).toFixed(3)}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">Using IUPAC standard atomic weights from the periodic table.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is molar mass?', answer: 'Molar mass is the mass of one mole (6.022×10²³ atoms) of a substance, measured in g/mol. It equals the sum of atomic masses in the formula.' },
          { question: 'Is the formula case sensitive?', answer: 'Yes. Element symbols must start with a capital letter followed by lowercase (e.g., Na not NA, Fe not FE).' },
          { question: 'What is a mole?', answer: 'A mole is 6.022×10²³ particles (Avogadro\'s number). One mole of H₂O has a mass of 18.015g.' },
        ]} />
      }
    />
  );
}
