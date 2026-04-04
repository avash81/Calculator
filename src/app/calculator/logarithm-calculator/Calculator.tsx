'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function LogarithmCalculator() {
  const [base, setBase]     = useState(10);
  const [number, setNumber] = useState(100);

  const results = useMemo(() => {
    if (number <= 0 || base <= 0 || base === 1) return null;
    const logB = Math.log(number) / Math.log(base);
    const log10 = Math.log10(number);
    const ln    = Math.log(number);
    const log2  = Math.log2(number);
    return { logB, log10, ln, log2 };
  }, [base, number]);

  const QUICK_BASES = [
    { label: 'log₁₀ (Common)', base: 10 },
    { label: 'ln (Natural, e)', base: Math.E },
    { label: 'log₂ (Binary)',  base: 2 },
    { label: 'log₁₆ (Hex)',    base: 16 },
  ];

  return (
    <CalculatorLayout
      title="Logarithm Calculator"
      description="Calculate the logarithm of any number with any base. Supports log10, natural log (ln), log2, and custom bases using the change-of-base formula."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          {/* Visual equation display */}
          <div className="p-6 bg-white border border-[var(--border)] flex items-center justify-center gap-3">
            <span className="text-2xl font-black text-[var(--text-muted)]">log</span>
            <div className="text-center">
              <input type="number" value={base} onChange={e => setBase(Number(e.target.value))} min={0.001} step={0.1}
                className="w-20 h-10 text-center border-2 border-[var(--primary)] bg-blue-50 font-mono text-lg font-black focus:outline-none" />
              <div className="text-[9px] font-bold text-[var(--text-muted)] mt-1">base</div>
            </div>
            <span className="text-2xl font-black text-[var(--text-muted)]">(</span>
            <div className="text-center">
              <input type="number" value={number} onChange={e => setNumber(Number(e.target.value))} min={0.001}
                className="w-28 h-10 text-center border-2 border-[var(--border)] bg-white font-mono text-lg font-black focus:border-[var(--primary)] focus:outline-none" />
              <div className="text-[9px] font-bold text-[var(--text-muted)] mt-1">number</div>
            </div>
            <span className="text-2xl font-black text-[var(--text-muted)]">) = ?</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Base Presets</label>
            {QUICK_BASES.map(({ label, base: b }) => (
              <button key={label} onClick={() => setBase(b)}
                className="w-full p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left flex justify-between items-center transition-all">
                <span className="text-[12px] font-bold text-[var(--text-main)]">{label}</span>
                <span className="text-[11px] font-black font-mono text-[var(--primary)]">{b === Math.E ? 'e ≈ 2.718' : b}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Change of Base Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">log_b(x) = ln(x) / ln(b)</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-4">
          {results ? (
            <>
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">log<sub>{base === Math.E ? 'e' : base}</sub>({number})</div>
                <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-2">{results.logB.toFixed(6)}</div>
              </div>

              {[
                { label: 'log₁₀ (Common)', val: results.log10 },
                { label: 'ln (Natural)',   val: results.ln    },
                { label: 'log₂ (Binary)',  val: results.log2  },
              ].map(({ label, val }) => (
                <div key={label} className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                  <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{label}</span>
                  <span className="text-sm font-black font-mono text-[var(--text-main)]">{val.toFixed(6)}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="p-5 border border-red-200 bg-red-50 text-red-700 text-sm font-bold">
              Base must be a positive number other than 1. Number must be positive.
            </div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a logarithm?', answer: 'A logarithm answers: "what exponent do I raise the base to, to get this number?" log₁₀(100) = 2 means 10² = 100.' },
          { question: 'What is the natural log (ln)?', answer: 'The natural logarithm uses base e (≈2.71828). It is widely used in calculus, statistics, and natural growth models.' },
          { question: 'What is the change of base formula?', answer: 'log_b(x) = ln(x) / ln(b). This lets you compute any logarithm using natural log or log₁₀.' },
        ]} />
      }
    />
  );
}
