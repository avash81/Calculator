'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Plus, Trash2 } from 'lucide-react';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    { gpa: 3.5, credits: 18 },
    { gpa: 3.7, credits: 18 },
  ]);

  const r = useMemo(() => {
    let totalPoints = 0, totalCredits = 0;
    semesters.forEach(s => { totalPoints += s.gpa * s.credits; totalCredits += s.credits; });
    return { cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0, totalCredits };
  }, [semesters]);

  const add    = () => setSemesters([...semesters, { gpa: 0, credits: 18 }]);
  const remove = (i: number) => setSemesters(semesters.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'gpa' | 'credits', val: number) => {
    const next = [...semesters]; next[i][field] = val; setSemesters(next);
  };

  const letter = r.cgpa >= 3.7 ? 'A+' : r.cgpa >= 3.3 ? 'A' : r.cgpa >= 3.0 ? 'A−' : r.cgpa >= 2.7 ? 'B+' : r.cgpa >= 2.3 ? 'B' : r.cgpa >= 2.0 ? 'B−' : 'Below B−';

  return (
    <CalculatorLayout
      title="CGPA Calculator"
      description="Calculate your Cumulative GPA across multiple semesters using credit-weighted averaging. Supports all Nepal university GPA scales."
      category={{ label: 'Education', href: '/calculator/category/education' }}
      leftPanel={
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_40px] gap-3 px-2">
            <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">Semester GPA</span>
            <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">Credit Hours</span>
            <span />
          </div>

          {/* Rows */}
          {semesters.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_40px] gap-3 items-center">
              <input type="number" step="0.01" min={0} max={4} value={s.gpa} onChange={e => update(i, 'gpa', Number(e.target.value))}
                placeholder="0.00" className="h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none w-full" />
              <input type="number" min={0} max={40} value={s.credits} onChange={e => update(i, 'credits', Number(e.target.value))}
                className="h-11 px-3 border border-[var(--border)] bg-white font-bold text-sm focus:border-[var(--primary)] outline-none w-full" />
              <button onClick={() => remove(i)} className="h-11 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button onClick={add} className="w-full py-3 border border-dashed border-[var(--border)] text-[11px] font-bold text-[var(--primary)] uppercase hover:bg-[var(--bg-surface)] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Semester
          </button>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Formula</div>
            <code className="text-[11px] font-mono text-[var(--primary)]">CGPA = Σ(GPA × Credits) / Σ(Credits)</code>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Cumulative GPA</div>
            <div className="text-7xl font-black text-[var(--primary)] tracking-tighter mb-2">{r.cgpa.toFixed(2)}</div>
            <div className="inline-block px-4 py-1 bg-[var(--primary)] text-white text-xs font-black uppercase tracking-widest">{letter}</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Semesters</span>
              <span className="text-sm font-black text-[var(--text-main)]">{semesters.length}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Total Credit Hours</span>
              <span className="text-sm font-black text-[var(--text-main)]">{r.totalCredits}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Letter Grade</span>
              <span className="text-sm font-black text-[var(--primary)]">{letter}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Equiv. Percentage*</span>
              <span className="text-sm font-black text-[var(--text-main)]">{(r.cgpa * 9.5).toFixed(1)}%</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">* Percentage = CGPA × 9.5 (common formula — verify with your institution).</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is CGPA?', answer: 'Cumulative Grade Point Average — credit-weighted average of all semester GPAs over your entire program.' },
          { question: 'How is CGPA calculated?', answer: 'CGPA = Σ(Semester GPA × Credits) ÷ Σ(Total Credits).' },
          { question: 'What is a good CGPA?', answer: 'A CGPA of 3.5+ is considered excellent. Most competitive programs and employers prefer 3.0+.' },
          { question: 'How to convert CGPA to percentage?', answer: 'A common formula is Percentage = CGPA × 9.5. Verify with your specific university guidelines.' },
        ]} />
      }
    />
  );
}
