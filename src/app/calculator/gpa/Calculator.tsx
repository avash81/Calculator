'use client';
import { useState, useMemo } from 'react';
import { PlusCircle, Trash2, GraduationCap, RotateCcw } from 'lucide-react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const NEPAL_GRADES = [
  { grade: 'A+', point: 4.0, desc: 'Outstanding' },
  { grade: 'A', point: 3.6, desc: 'Excellent' },
  { grade: 'B+', point: 3.2, desc: 'Very Good' },
  { grade: 'B', point: 2.8, desc: 'Good' },
  { grade: 'C+', point: 2.4, desc: 'Satisfactory' },
  { grade: 'C', point: 2.0, desc: 'Acceptable' },
  { grade: 'D', point: 1.6, desc: 'Basic' },
  { grade: 'E', point: 0.8, desc: 'Insufficient' },
  { grade: 'N', point: 0.0, desc: 'Not Graded' },
];

const US_GRADES = [
  { grade: 'A', point: 4.0 },
  { grade: 'A-', point: 3.7 },
  { grade: 'B+', point: 3.3 },
  { grade: 'B', point: 3.0 },
  { grade: 'B-', point: 2.7 },
  { grade: 'C+', pool: 2.3 },
  { grade: 'C', point: 2.0 },
  { grade: 'C-', point: 1.7 },
  { grade: 'D+', point: 1.3 },
  { grade: 'D', point: 1.0 },
  { grade: 'F', point: 0.0 },
];

const INITIAL_SUBJECTS = [
  { id: 1, name: 'Mathematics', credit: 3, grade: 'A' },
  { id: 2, name: 'Science', credit: 3, grade: 'A' },
  { id: 3, name: 'English', credit: 3, grade: 'A' },
];

export default function GPACalculator() {
  const [system, setSystem] = useState<'nepal' | 'us'>('nepal');
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);

  const gradesList = system === 'nepal' ? NEPAL_GRADES : US_GRADES;

  const resultInfo = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(sub => {
      const g = gradesList.find(g => g.grade === sub.grade);
      const creditValue = parseFloat(sub.credit.toString()) || 0;
      if (g && (g as any).point !== undefined && creditValue > 0) {
        totalPoints += (g as any).point * creditValue;
        totalCredits += creditValue;
      }
    });
    const gpaValue = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    const gpa = gpaValue.toFixed(2);
    
    let classification = '';
    if (system === 'nepal') {
      if (gpaValue >= 3.6) classification = 'Outstanding';
      else if (gpaValue >= 3.2) classification = 'Excellent';
      else if (gpaValue >= 2.8) classification = 'Very Good';
      else if (gpaValue >= 2.4) classification = 'Good';
      else classification = 'Passing';
    }
    return { gpa, totalCredits, totalPoints: totalPoints.toFixed(2), classification };
  }, [subjects, system, gradesList]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', credit: 3, grade: gradesList[0].grade }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: number, field: string, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const faqs = [
    { question: 'What is NEB Grading?', answer: 'Nepal Education Board uses a 4.0 scale where A+ (90+) is 4.0, A (80-90) is 3.6, and B+ (70-80) is 3.2.' },
    { question: 'How is GPA calculated?', answer: 'GPA = Sum(Grade Point * Credits) / Sum(Credits). Each subject is weighted by its credit hours.' }
  ];

  return (
    <CalculatorLayout
      title="GPA Calculator"
      description="Advanced GPA calculation for Nepal (NEB/TU) and US academic systems. Professional credit-weighted results with classification."
      category={{ label: 'Education', href: '/calculator/category/education' }}
      leftPanel={
        <div className="space-y-6">
          {/* System Toggle */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)] px-1">Grading System</label>
            <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] p-1">
              {(['nepal', 'us'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSystem(s)}
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${
                    system === s ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {s === 'nepal' ? 'Nepal (NEB / TU)' : 'US System'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             {subjects.map((sub, idx) => (
               <div key={sub.id} className="p-4 bg-white border border-[var(--border)] shadow-sm space-y-4 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Course {idx + 1}</span>
                    {subjects.length > 1 && (
                      <button onClick={() => removeSubject(sub.id)} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <input 
                        type="text" value={sub.name} 
                        onChange={e => updateSubject(sub.id, 'name', e.target.value)}
                        placeholder="Course Name"
                        className="w-full h-11 px-3 border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-bold focus:border-[var(--primary)] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input 
                        type="number" value={sub.credit} 
                        onChange={e => updateSubject(sub.id, 'credit', Number(e.target.value))}
                        className="w-full h-11 px-3 border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-bold text-center"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select 
                        value={sub.grade} 
                        onChange={e => updateSubject(sub.id, 'grade', e.target.value)}
                        className="w-full h-11 px-3 border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-bold text-center cursor-pointer appearance-none"
                      >
                        {gradesList.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
                      </select>
                    </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="flex gap-4">
            <button onClick={addSubject} className="flex-1 py-3 border-2 border-dashed border-[var(--border)] text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add Course
            </button>
            <button onClick={() => setSubjects(INITIAL_SUBJECTS)} className="px-6 py-3 border-2 border-dashed border-[var(--border)] text-[11px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
           <div className="p-8 bg-white border border-[var(--border)] text-center">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Calculated GPA</div>
              <div className="text-7xl font-black text-[var(--primary)] tracking-tighter mb-2">{resultInfo.gpa}</div>
              <div className="text-sm font-bold text-[var(--success)] uppercase tracking-widest">{resultInfo.classification}</div>
           </div>

           <div className="space-y-4">
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-center">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Total Credits</span>
                <span className="text-lg font-black text-[var(--text-main)]">{resultInfo.totalCredits}</span>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-center">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Total Grade Points</span>
                <span className="text-lg font-black text-[var(--text-main)]">{resultInfo.totalPoints}</span>
              </div>
           </div>

           <div className="p-6 bg-[var(--primary)] text-white/90 border border-[var(--primary)] flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <p className="text-[13px] font-medium leading-relaxed">
                Your performance is categorized as <span className="font-black text-white">{resultInfo.classification || 'Satisfactory'}</span> according to the {system.toUpperCase()} standard.
              </p>
           </div>
        </div>
      }
      faqSection={<CalcFAQ faqs={faqs} />}
    />
  );
}
