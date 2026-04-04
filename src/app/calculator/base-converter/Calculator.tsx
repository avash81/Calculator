'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Terminal, Cpu } from 'lucide-react';

interface ConversionResult {
  dec: string; bin: string; hex: string; oct: string; char: string | null;
  logic: { and: string; or: string; xor: string };
}
interface ErrorResult { error: string; }
type BaseResult = ConversionResult | ErrorResult | null;

export default function BaseConverter() {
  const [val, setVal] = useState('255');
  const [val2, setVal2] = useState('0');
  const [base, setBase] = useState<number>(10);

  const res = useMemo<BaseResult>(() => {
    if (val.length > 64) return { error: 'Input too long (max 64 chars)' };
    if (!val.trim()) return null;
    try {
      const cleanVal = val.trim();
      const decStr = base === 16 ? `0x${cleanVal}` : base === 8 ? `0o${cleanVal}` : base === 2 ? `0b${cleanVal}` : cleanVal;
      const dec = BigInt(decStr);
      const char = Number(dec) <= 126 && Number(dec) >= 32 ? String.fromCharCode(Number(dec)) : null;
      const paddedBin = dec.toString(2).padStart(8, '0');
      let logic = { and: '0', or: '0', xor: '0' };
      try {
        const d2 = BigInt(val2);
        logic = { and: (dec & d2).toString(10), or: (dec | d2).toString(10), xor: (dec ^ d2).toString(10) };
      } catch { /* ignore */ }
      return { dec: dec.toString(10), bin: paddedBin, hex: dec.toString(16).toUpperCase(), oct: dec.toString(8), char, logic };
    } catch { return { error: 'Invalid input for selected base' }; }
  }, [val, val2, base]);

  const d = useMemo(() => {
    if (res && 'dec' in res) {
      const r = res as ConversionResult;
      return { dec: r.dec, bin: r.bin, hex: r.hex, oct: r.oct, char: r.char, logic: r.logic };
    }
    return { dec: '---', bin: '---', hex: '---', oct: '---', char: null, logic: { and: '0', or: '0', xor: '0' } };
  }, [res]);

  const BASES = [{ id: 10, l: 'Decimal' }, { id: 2, l: 'Binary' }, { id: 16, l: 'Hex' }, { id: 8, l: 'Octal' }];
  const CONVERSIONS = [
    { l: 'Binary (Base 2)', v: d.bin, color: 'text-[var(--primary)]' },
    { l: 'Hexadecimal (Base 16)', v: d.hex !== '---' ? `0x${d.hex}` : '---', color: 'text-[var(--accent)]' },
    { l: 'Octal (Base 8)', v: d.oct, color: 'text-[#006600]' },
    { l: 'Decimal (Base 10)', v: d.dec, color: 'text-[var(--text-main)]' },
  ];

  return (
    <CalculatorLayout
      title="Number Base Converter"
      description="Convert numbers instantly between Decimal, Binary, Hexadecimal, and Octal. Includes ASCII preview and bitwise logic operations."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          {/* Base Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Input Base</label>
            <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] p-1">
              {BASES.map(b => (
                <button key={b.id} onClick={() => setBase(b.id)}
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${base === b.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}>
                  {b.l}
                </button>
              ))}
            </div>
          </div>

          {/* Main Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">
              Enter {base === 10 ? 'Decimal' : base === 2 ? 'Binary' : base === 16 ? 'Hexadecimal' : 'Octal'} Value
            </label>
            <input
              type="text" value={val}
              onChange={e => setVal(e.target.value.toUpperCase())}
              className="w-full h-14 px-4 border-2 border-[var(--border)] bg-white font-mono text-2xl font-bold focus:border-[var(--primary)] outline-none tracking-widest"
              placeholder="255" maxLength={64}
            />
            {res && 'error' in res && (
              <p className="text-xs text-red-600 font-bold px-1">{(res as ErrorResult).error}</p>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Values</label>
            <div className="grid grid-cols-4 gap-2">
              {['255', '1024', '65535', '16777215'].map(pv => (
                <button key={pv} onClick={() => { setBase(10); setVal(pv); }}
                  className="py-3 text-[11px] font-bold border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] hover:border-[var(--primary)] transition-all">
                  {parseInt(pv).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Bitwise Logic */}
          <div className="space-y-2 p-5 bg-[var(--bg-surface)] border border-[var(--border)]">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Bitwise Operations (vs. Value 2)</label>
            <input type="number" value={val2} onChange={e => setVal2(e.target.value)}
              className="w-full h-10 px-3 border border-[var(--border)] bg-white text-sm font-bold outline-none focus:border-[var(--primary)]"
              placeholder="Second operand" />
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[['AND', d.logic.and], ['OR', d.logic.or], ['XOR', d.logic.xor]].map(([op, val]) => (
                <div key={op} className="p-3 bg-white border border-[var(--border)] text-center">
                  <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{op}</div>
                  <div className="text-sm font-black text-[var(--primary)] font-mono">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* All Bases Result */}
          <div className="space-y-3">
            {CONVERSIONS.map(item => (
              <div key={item.l} className="p-5 bg-white border border-[var(--border)] flex justify-between items-center group hover:border-[var(--primary)] transition-all">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">{item.l}</span>
                <span className={`text-sm font-black font-mono tracking-tight ${item.color}`}>{item.v}</span>
              </div>
            ))}
          </div>

          {/* ASCII & Memory */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-[var(--border)] text-center">
              <Terminal className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2" />
              <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">ASCII Char</div>
              <div className="text-xl font-black text-[var(--primary)] font-mono">{d.char || 'N/A'}</div>
            </div>
            <div className="p-5 bg-white border border-[var(--border)] text-center">
              <Cpu className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2" />
              <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">Memory Size</div>
              <div className="text-xl font-black text-[#006600]">{d.hex !== '---' ? Math.ceil(d.hex.length / 2) : '0'} bytes</div>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed italic">
              * Binary shown with 8-bit padding. Hexadecimal uses uppercase letters (A–F).
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is Hexadecimal?', answer: 'Hex (Base-16) uses digits 0–9 and A–F. It\'s compact and widely used in computing, color codes, and memory addresses.' },
          { question: 'Why is Binary important?', answer: 'All digital electronics use binary (1s and 0s) as their base language because transistors have two states: on and off.' },
          { question: 'What is Octal used for?', answer: 'Octal (Base-8) is used in UNIX file permissions and some programming contexts as a shorter representation of binary.' },
        ]} />
      }
    />
  );
}
