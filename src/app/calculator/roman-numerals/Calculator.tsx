'use client';
import { useState } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const MAP: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
  [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
  [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
];
const RMAP: Record<string,number> = { M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1 };

function toRoman(n: number): string {
  let r = ''; for (const [v,s] of MAP) { while (n >= v) { r += s; n -= v; } } return r;
}
function fromRoman(s: string): number {
  let r = 0, i = 0; s = s.toUpperCase();
  while (i < s.length) {
    const d = RMAP[s[i]+s[i+1]] ? (r += RMAP[s[i]+s[i+1]], 2) : (r += RMAP[s[i]] || 0, 1);
    i += d;
  } return r;
}

const REF = [{ r:'I',n:1 },{ r:'V',n:5 },{ r:'X',n:10 },{ r:'L',n:50 },{ r:'C',n:100 },{ r:'D',n:500 },{ r:'M',n:1000 }];

export default function RomanNumeralsCalculator() {
  const [number, setNumber] = useState('10');
  const [roman, setRoman]   = useState('X');

  const handleNum = (v: string) => {
    setNumber(v);
    const n = parseInt(v);
    setRoman(!isNaN(n) && n > 0 && n < 4000 ? toRoman(n) : '');
  };
  const handleRoman = (v: string) => {
    const u = v.toUpperCase(); setRoman(u);
    const n = fromRoman(u); if (n > 0) setNumber(String(n)); else setNumber('');
  };

  return (
    <CalculatorLayout
      title="Roman Numerals Converter"
      description="Convert Arabic numbers to Roman numerals and vice versa. Supports 1 to 3,999 with live bidirectional conversion."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Arabic Number (1–3999)</label>
            <input type="number" value={number} onChange={e => handleNum(e.target.value)} min={1} max={3999}
              className="w-full h-14 px-4 border-2 border-[var(--border)] bg-white font-mono text-2xl font-black focus:border-[var(--primary)] outline-none" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">↕ bidirectional</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Roman Numeral</label>
            <input type="text" value={roman} onChange={e => handleRoman(e.target.value)}
              className="w-full h-14 px-4 border-2 border-[var(--border)] bg-white font-mono text-2xl font-black uppercase focus:border-[var(--primary)] outline-none" />
          </div>

          {/* Reference Table */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Symbol Reference</h3>
            </div>
            <div className="grid grid-cols-4 divide-x divide-[var(--border)]">
              {REF.map(({ r, n }) => (
                <button key={r} onClick={() => handleNum(String(n))}
                  className="py-3 text-center hover:bg-[var(--bg-subtle)] transition-all">
                  <div className="text-sm font-black text-[var(--primary)]">{r}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{n}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-4">Conversion Result</div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-3">{roman || '—'}</div>
            <div className="text-lg font-bold text-[var(--text-secondary)]">{number ? `= ${number}` : '—'}</div>
          </div>

          {/* Example table */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Quick Examples</h3>
            </div>
            {[[1,'I'],[4,'IV'],[9,'IX'],[40,'XL'],[90,'XC'],[400,'CD'],[900,'CM']].map(([n,r]) => (
              <button key={n} onClick={() => handleNum(String(n))}
                className="w-full px-4 py-2 border-b border-[var(--border)] flex justify-between hover:bg-[var(--bg-surface)] transition-all">
                <span className="text-[11px] font-black text-[var(--primary)]">{n}</span>
                <span className="text-[11px] font-bold text-[var(--text-secondary)]">{r}</span>
              </button>
            ))}
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What are the basic Roman numeral symbols?', answer: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000.' },
          { question: 'Why limit to 3,999?', answer: 'Standard Roman numerals (without vinculum overline) cannot represent 4,000 and above in a standardized way.' },
          { question: 'How do subtractive notations work?', answer: 'If a smaller symbol precedes a larger one, subtract it. IV=4 (5−1), IX=9 (10−1), XL=40 (50−10).' },
        ]} />
      }
    />
  );
}
