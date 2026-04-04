'use client';
import { useMemo } from 'react';
import { Target, History, Plus, Trash2, Info } from 'lucide-react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const UNIVERSITIES = {
  tu_ioe: { name: 'TU / IOE' },
  ku: { name: 'Kathmandu Uni (KU)' },
  pu: { name: 'Pokhara Uni (PU)' },
};

interface Semester {
  id: number;
  name: string;
  gpa: number;
  credits: number;
}

const DEFAULT_STATE = {
  uni: 'tu_ioe' as keyof typeof UNIVERSITIES,
  currentCGPA: 3.2,
  completedCredits: 60,
  targetCGPA: 3.5,
  remainingCredits: 60,
  semesters: [
    { id: 1, name: 'Semester 1', gpa: 3.4, credits: 18 },
    { id: 2, name: 'Semester 2', gpa: 3.0, credits: 20 },
  ] as Semester[]
};

export default function EngineeringGPACalculator() {
  const [state, setState] = useLocalStorage('calcpro_engineering_gpa_v2', DEFAULT_STATE);
  const { uni, currentCGPA, completedCredits, targetCGPA, remainingCredits, semesters } = state;

  const updateState = (updates: Partial<typeof DEFAULT_STATE>) => {
    setState({ ...state, ...updates });
  };

  const addSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1;
    updateState({ semesters: [...semesters, { id: newId, name: `Semester ${newId}`, gpa: 3.0, credits: 18 }] });
  };

  const removeSemester = (id: number) => {
    updateState({ semesters: semesters.filter(s => s.id !== id) });
  };

  const updateSemester = (id: number, field: keyof Semester, value: any) => {
    updateState({ semesters: semesters.map(s => s.id === id ? { ...s, [field]: value } : s) });
  };

  const analysis = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => { totalPoints += s.gpa * s.credits; totalCredits += s.credits; });
    const actualCGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const totalPossibleCredits = completedCredits + remainingCredits;
    const totalNeededPoints = targetCGPA * totalPossibleCredits;
    const currentPoints = currentCGPA * completedCredits;
    const remainingPointsNeeded = totalNeededPoints - currentPoints;
    const requiredGPA = remainingCredits > 0 ? remainingPointsNeeded / remainingCredits : 0;
    return { actualCGPA: actualCGPA.toFixed(2), requiredGPA: requiredGPA.toFixed(2), isPossible: requiredGPA <= 4.0 && requiredGPA >= 0, totalCredits };
  }, [semesters, currentCGPA, completedCredits, targetCGPA, remainingCredits]);

  return (
    <CalculatorLayout
      title="Engineering GPA Planner"
      description="Professional grade predictor for engineering students. Calculate needed GPA to reach your graduation CGPA targets."
      category={{ label: 'Education', href: '/calculator/category/education' }}
      leftPanel={
        <div className="space-y-8">
           {/* University Selection */}
           <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)] px-1">University standard</label>
              <select 
                value={uni} 
                onChange={(e) => updateState({ uni: e.target.value as any })}
                className="w-full h-12 px-4 border border-[var(--border)] bg-[var(--bg-surface)] text-sm font-bold focus:border-[var(--primary)] outline-none cursor-pointer"
              >
                {Object.entries(UNIVERSITIES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
           </div>

           {/* Goals */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white border border-[var(--border)] shadow-sm">
              <div className="sm:col-span-2 flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-[10px] font-black uppercase text-[var(--text-main)]">Target Prediction</span>
              </div>
              <ValidatedInput label="Current CGPA" value={currentCGPA} onChange={(v) => updateState({ currentCGPA: v })} min={0} max={4} step={0.01} />
              <ValidatedInput label="Completed Credits" value={completedCredits} onChange={(v) => updateState({ completedCredits: v })} min={0} max={220} />
              <ValidatedInput label="Target Goal CGPA" value={targetCGPA} onChange={(v) => updateState({ targetCGPA: v })} min={0} max={4} step={0.01} />
              <ValidatedInput label="Remaining Credits" value={remainingCredits} onChange={(v) => updateState({ remainingCredits: v })} min={0} max={220} />
           </div>

           {/* Semester List */}
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Semester History</h3>
                <button onClick={addSemester} className="text-[10px] font-black uppercase text-[var(--primary)] flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Semester
                </button>
              </div>
              <div className="space-y-3">
                 {semesters.map((s) => (
                   <div key={s.id} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] grid grid-cols-1 md:grid-cols-12 gap-3 relative group">
                      <div className="md:col-span-6">
                        <input value={s.name} onChange={(e) => updateSemester(s.id, 'name', e.target.value)} className="w-full h-10 px-3 bg-white border border-[var(--border)] text-xs font-bold" />
                      </div>
                      <div className="md:col-span-3">
                        <input type="number" value={s.gpa} onChange={(e) => updateSemester(s.id, 'gpa', Number(e.target.value))} className="w-full h-10 px-3 bg-white border border-[var(--border)] text-xs font-bold text-center" />
                      </div>
                      <div className="md:col-span-2">
                        <input type="number" value={s.credits} onChange={(e) => updateSemester(s.id, 'credits', Number(e.target.value))} className="w-full h-10 px-3 bg-white border border-[var(--border)] text-xs font-bold text-center" />
                      </div>
                      <div className="md:col-span-1 flex justify-end items-center">
                        <button onClick={() => removeSemester(s.id)} className="text-red-600 hover:scale-110 transition-transform">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      }
      rightPanel={
        <div className="space-y-8">
           <div className="text-center p-8 bg-white border border-[var(--border)] shadow-sm">
              <div className="text-xs font-bold uppercase tracking-tight text-[var(--text-muted)] mb-2">Needed GPA in Remaining Credits</div>
              <div className={`text-7xl font-black tracking-tighter mb-2 ${analysis.isPossible ? 'text-[#006600]' : 'text-red-600'}`}>
                {analysis.requiredGPA}
              </div>
              <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Target CGPA: {targetCGPA}</div>
           </div>

           <div className="p-6 bg-white border border-[var(--border)] space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Calculated actual CGPA</span>
                <span className="text-sm font-black text-[var(--text-main)]">{analysis.actualCGPA}</span>
              </div>
              <div className="flex justify-between items-center pb-3">
                 <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">Total Credits Tracked</span>
                 <span className="text-sm font-black text-[var(--text-main)]">{analysis.totalCredits}</span>
              </div>
           </div>

           <div className="p-6 bg-[var(--bg-subtle)] border border-[var(--border)] flex gap-4">
              <div className="w-10 h-10 bg-[var(--primary)]/10 rounded flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <p className="text-[13px] font-medium leading-relaxed">
                {analysis.isPossible 
                  ? `To reach your goal of ${targetCGPA}, you must maintain an average of ${analysis.requiredGPA} across your remaining ${remainingCredits} credits.`
                  : `Requirement exceeds 4.0. Your target of ${targetCGPA} is mathematically unreachable with ${remainingCredits} credits remaining.`}
              </p>
           </div>
        </div>
      }
      faqSection={
        <CalcFAQ
          faqs={[
            { question: 'How is "Needed GPA" calculated?', answer: 'It calculates the points needed to reach your target CGPA total across all credits and divides by remaining credits.' },
            { question: 'Is this specific to TU/IOE?', answer: 'Yes, it supports TU/IOE, KU, and PU grading standards.' }
          ]}
        />
      }
    />
  );
}
