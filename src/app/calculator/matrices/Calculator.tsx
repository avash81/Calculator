'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function MatrixCalc() {
  const [size, setSize] = useState<2|3>(2);
  const [matrix, setMatrix] = useState<number[][]>([[1,0,0],[0,1,0],[0,0,1]]);

  const results = useMemo(() => {
    const m = matrix;
    if (size === 2) {
      const det = m[0][0]*m[1][1] - m[0][1]*m[1][0];
      const trace = m[0][0] + m[1][1];
      const inverse = det === 0 ? null : [
        [m[1][1]/det, -m[0][1]/det],
        [-m[1][0]/det, m[0][0]/det],
      ];
      return { det, trace, inverse };
    }
    const det = m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1]) - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0]) + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
    const trace = m[0][0]+m[1][1]+m[2][2];
    return { det, trace, inverse: null };
  }, [matrix, size]);

  const upd = (r: number, c: number, v: number) => {
    const n = matrix.map(row => [...row]);
    n[r][c] = v;
    setMatrix(n);
  };

  const inputC = "w-full h-14 text-center border border-[var(--border)] bg-white font-mono text-lg font-black focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="Matrix Calculator"
      description="Calculate determinant, trace, and inverse of 2×2 and 3×3 matrices. Essential for linear algebra, physics, and engineering."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {([2,3] as const).map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`py-4 font-black border transition-all text-sm ${size===s ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                {s}×{s} Matrix
              </button>
            ))}
          </div>

          {/* Matrix grid */}
          <div className="p-6 bg-white border border-[var(--border)]">
            <div className="text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-4">Enter Matrix Values</div>
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
              {Array.from({ length:size }).map((_, r) =>
                Array.from({ length:size }).map((_, c) => (
                  <input key={`${r}-${c}`} type="number" value={matrix[r][c]}
                    onChange={e => upd(r, c, Number(e.target.value))}
                    className={inputC} />
                ))
              )}
            </div>
          </div>

          {/* Load identity */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Load Preset</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMatrix([[1,0,0],[0,1,0],[0,0,1]])}
                className="p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-[11px] font-bold transition-all">
                Identity Matrix
              </button>
              <button onClick={() => setMatrix([[2,1,0],[1,3,1],[0,1,2]])}
                className="p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-[11px] font-bold transition-all">
                Example Matrix
              </button>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Determinant |A|</div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter font-mono mb-1">{results.det.toFixed(2)}</div>
            {results.det === 0 && <div className="text-xs font-bold text-red-600 mt-1">Singular matrix — no inverse</div>}
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
            <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Trace tr(A)</span>
            <span className="text-xl font-black font-mono text-[#006600]">{results.trace}</span>
          </div>

          {size === 2 && results.inverse && (
            <div className="bg-white border border-[var(--border)]">
              <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
                <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Inverse Matrix A⁻¹</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {results.inverse.map((row, r) => row.map((v, c) => (
                  <div key={`${r}-${c}`} className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] text-center font-mono font-black text-sm text-[var(--primary)]">
                    {v.toFixed(4)}
                  </div>
                )))}
              </div>
            </div>
          )}

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Determinant Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">{size===2 ? '|A| = ad − bc' : '|A| = a(ei−fh) − b(di−fg) + c(dh−eg)'}</code>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is a matrix determinant?', answer: 'A scalar value encoding properties of the linear transformation the matrix represents. Non-zero determinant = invertible matrix.' },
          { question: 'What is the matrix trace?', answer: 'The sum of the diagonal elements (top-left to bottom-right). For a 2×2 matrix [[a,b],[c,d]], trace = a+d.' },
          { question: 'When does the inverse not exist?', answer: 'When the determinant is 0 (singular matrix). A singular matrix cannot be inverted.' },
        ]} />
      }
    />
  );
}
