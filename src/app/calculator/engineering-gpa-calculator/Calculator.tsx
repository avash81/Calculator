'use client';
import { useMemo, useState } from 'react';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultCard } from '@/components/calculator/ResultCard';
import { QuickPresets } from '@/components/calculator/QuickPresets';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Trash2, Plus, Info, BookOpen, GraduationCap, School, Target, History } from 'lucide-react';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const UNIVERSITIES = {
  tu_ioe: {
    name: 'TU / IOE',
    grading: [
      { min: 80, gpa: 4.0, grade: 'A' },
      { min: 70, gpa: 3.6, grade: 'A-' },
      { min: 60, gpa: 3.2, grade: 'B+' },
      { min: 50, gpa: 2.8, grade: 'B' },
      { min: 40, gpa: 2.0, grade: 'C' },
      { min: 0,  gpa: 0.0, grade: 'F' },
    ],
  },
  ku: {
    name: 'Kathmandu Uni',
    grading: [
      { min: 90, gpa: 4.0, grade: 'A' },
      { min: 80, gpa: 3.3, grade: 'B+' },
      { min: 70, gpa: 2.7, grade: 'B-' },
      { min: 60, gpa: 2.0, grade: 'C' },
      { min: 50, gpa: 1.0, grade: 'D' },
      { min: 0,  gpa: 0.0, grade: 'F' },
    ],
  },
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

  const presets = [
    { name: 'Distinction Goal', description: 'Aim for 3.6+ CGPA', icon: 'graduation', values: { targetCGPA: 3.6, remainingCredits: 60 } },
    { name: 'First Division', description: 'Aim for 3.0+ CGPA', icon: 'target', values: { targetCGPA: 3.0, remainingCredits: 60 } },
    { name: 'Semester Push', description: 'High performance focus', icon: 'briefcase', values: { targetCGPA: 3.8, remainingCredits: 20 } },
  ];

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
    // Current actual CGPA from semesters
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      totalPoints += s.gpa * s.credits;
      totalCredits += s.credits;
    });

    const actualCGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Target calculation
    // Target points total = targetCGPA * (completed + remaining)
    // Needed points = Target points total - current points total
    const totalPossibleCredits = completedCredits + remainingCredits;
    const totalNeededPoints = targetCGPA * totalPossibleCredits;
    const currentPoints = currentCGPA * completedCredits;
    const remainingPointsNeeded = totalNeededPoints - currentPoints;
    const requiredGPA = remainingCredits > 0 ? remainingPointsNeeded / remainingCredits : 0;

    return {
      actualCGPA: actualCGPA.toFixed(2),
      requiredGPA: requiredGPA.toFixed(2),
      isPossible: requiredGPA <= 4.0 && requiredGPA >= 0,
      totalCredits
    };
  }, [semesters, currentCGPA, completedCredits, targetCGPA, remainingCredits]);

  return (
    <CalculatorErrorBoundary calculatorName="Engineering GPA">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
             Academic Excellence
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            GPA <span className="text-blue-600">Planner</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
             Track your semester progress and predict the grades needed to hit your target graduation CGPA with TU/KU/PU verified scales.
          </p>
        </div>

        {/* Quick Presets */}
        <QuickPresets 
           presets={presets as any[]} 
           onSelect={(p) => updateState(p.values)} 
        />

        {/* Target Predictor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Target Settings */}
            <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20">
               <div className="flex items-center gap-2 mb-8">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Goal Setting</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ValidatedInput label="Current CGPA" value={currentCGPA} onChange={(v) => updateState({ currentCGPA: v })} min={0} max={4} step={0.01} />
                  <ValidatedInput label="Completed Credits" value={completedCredits} onChange={(v) => updateState({ completedCredits: v })} min={0} max={200} />
                  <ValidatedInput label="Target CGPA" value={targetCGPA} onChange={(v) => updateState({ targetCGPA: v })} min={0} max={4} step={0.01} />
                  <ValidatedInput label="Remaining Credits" value={remainingCredits} onChange={(v) => updateState({ remainingCredits: v })} min={0} max={200} />
               </div>
            </div>

            {/* Semester Tracker */}
            <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Semester History</h3>
                  </div>
                  <button onClick={addSemester} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                    <Plus className="w-4 h-4" /> Add Semester
                  </button>
               </div>

               <div className="space-y-4">
                  {semesters.map((s) => (
                    <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_48px] gap-4 items-end p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                       <ValidatedInput label="Semester Name" value={s.name} variant="minimal" type="text" onChange={(v) => updateSemester(s.id, 'name', v)} />
                       <ValidatedInput label="GPA" value={s.gpa} variant="minimal" onChange={(v) => updateSemester(s.id, 'gpa', v)} min={0} max={4} step={0.01} />
                       <ValidatedInput label="Credits" value={s.credits} variant="minimal" onChange={(v) => updateSemester(s.id, 'credits', v)} min={0} max={40} />
                       <button onClick={() => removeSemester(s.id)} className="h-12 w-12 flex items-center justify-center text-rose-300 hover:text-rose-500 transition-all">
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            <ResultCard
              label="Needed GPA (Remaining)"
              value={analysis.requiredGPA}
              color={analysis.isPossible ? 'blue' : 'red'}
              title={analysis.isPossible ? 'Target Reachable' : 'Target Over Limit'}
              copyValue={`Needed GPA for target: ${analysis.requiredGPA}`}
            />

            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-5">
               <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-widest">Current Actual CGPA</span>
                  <span className="font-black text-gray-900 dark:text-white">{analysis.actualCGPA}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-widest">Total Credits Logged</span>
                  <span className="font-black text-gray-900 dark:text-white">{analysis.totalCredits}</span>
               </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-[2rem] space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Insight</span>
               </div>
               <p className="text-xs font-medium leading-relaxed">
                  {analysis.isPossible 
                    ? `To reach your target of ${targetCGPA}, you need an average of ${analysis.requiredGPA} in your remaining ${remainingCredits} credits.`
                    : `Your target of ${targetCGPA} is mathematically impossible with your remaining credits, even if you score a 4.0.`}
               </p>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-8">
           <CalcFAQ
              faqs={[
                {
                  question: 'How does the Target GPA predictor work?',
                  answer: 'It calculates the total grade points required to reach your final goal across all credits (completed + remaining) and subtracts the points you have already earned. The remainder is what you need to achieve in your upcoming semesters.'
                },
                {
                  question: 'What is a "good" GPA in Nepal?',
                  answer: 'For IOE/TU, a CGPA above 3.6 is considered "Distinction" (First Division with Distinction). Above 3.0 is usually a strong First Division and highly competitive for international master\'s applications.'
                },
                {
                  question: 'Do all universities use the same credit system?',
                  answer: 'Most engineering universities in Nepal (TU, KU, PU) followed a similar credit system based on lecture hours, but their grading scales (A, A-, B+) differ slightly. Always verify with your university\'s specific handbook.'
                }
              ]}
           />
        </div>

      </div>
    </CalculatorErrorBoundary>
  );
}
