'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { PlusCircle, Trash2, GraduationCap, RotateCcw } from 'lucide-react';

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
  { grade: 'C+', point: 2.3 },
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
      if (g && creditValue > 0) {
        totalPoints += g.point * creditValue;
        totalCredits += creditValue;
      }
    });
    const gpaValue = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    const gpa = gpaValue.toFixed(2);
    
    let classification = '';
    let bgColor = 'bg-indigo-600';
    
    if (system === 'nepal') {
      if (gpaValue >= 3.6) { classification = 'Outstanding'; bgColor = 'bg-green-600'; }
      else if (gpaValue >= 3.2) { classification = 'Excellent'; bgColor = 'bg-blue-600'; }
      else if (gpaValue >= 2.8) { classification = 'Very Good'; bgColor = 'bg-indigo-600'; }
      else if (gpaValue >= 2.4) { classification = 'Good'; bgColor = 'bg-yellow-600'; }
      else { classification = 'Passing'; bgColor = 'bg-gray-600'; }
    }
    return { gpa, totalCredits, totalPoints: totalPoints.toFixed(2), classification, bgColor };
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

  const resetAll = () => {
    setSubjects(INITIAL_SUBJECTS.map(s => ({ ...s, id: Math.random() })));
  };

  return (
    <CalculatorErrorBoundary calculatorName="GPA Calculator">
      <JsonLd type="calculator" name="Advanced GPA Calculator" description="Professional grade tool for calculating GPA based on credit-weighted system." url="https://calcpro.com.np/calculator/gpa" />

      <CalcWrapper
        title="GPA Calculator"
        description="Professional grade tool for calculating GPA based on credit-weighted system used in Nepal (TU/KU) and international US systems."
        crumbs={[{label:'education',href:'/calculator?cat=education'}, {label:'gpa'}]}
        relatedCalcs={[{name:'CGPA Calc',slug:'cgpa'},{name:'Percentage',slug:'percentage'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/20 overflow-hidden">
              <div className="flex bg-gray-50/50 dark:bg-gray-800/20 p-2">
                <button 
                  onClick={() => setSystem('nepal')} 
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all min-h-[48px] ${system === 'nepal' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Nepal (NEB/TU)
                </button>
                <button 
                  onClick={() => setSystem('us')} 
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all min-h-[48px]  ${system === 'us' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  US System
                </button>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="hidden sm:grid grid-cols-[1fr_100px_140px_48px] gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                  <div>Course/Subject</div>
                  <div className="text-center">Credits</div>
                  <div className="text-center">Grade</div>
                  <div></div>
                </div>
                
                <div className="space-y-6">
                  {subjects.map((sub, idx) => (
                    <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_140px_48px] gap-4 sm:gap-6 p-6 sm:p-0 bg-gray-50/50 dark:bg-gray-800/20 sm:bg-transparent rounded-3xl group border border-transparent hover:border-blue-50 dark:hover:border-blue-900/30 transition-all items-end sm:items-center">
                      <div>
                        <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Subject {idx+1}</label>
                        <input 
                          type="text" 
                          value={sub.name} 
                          onChange={e => updateSubject(sub.id, 'name', e.target.value)} 
                          className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all scroll-m-20" 
                          placeholder="Subject Name" 
                        />
                      </div>
                      <div>
                        <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block text-center">Units</label>
                        <input 
                          type="number" 
                          value={sub.credit} 
                          onChange={e => updateSubject(sub.id, 'credit', Number(e.target.value))} 
                          className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block text-center">Grade</label>
                        <select 
                          value={sub.grade} 
                          onChange={e => updateSubject(sub.id, 'grade', e.target.value)} 
                          className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                          {gradesList.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
                        </select>
                      </div>
                      <div className="flex justify-center items-center">
                        <button 
                          onClick={() => removeSubject(sub.id)} 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-400 border-2 border-transparent hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  <button 
                    onClick={addSubject} 
                    className="group w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:border-blue-200 hover:text-blue-600 transition-all min-h-[48px]"
                  >
                    <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                    New Course
                  </button>
                  <button 
                    onClick={resetAll} 
                    className="group w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-red-50/30 dark:hover:bg-red-900/10 hover:border-red-200 hover:text-red-500 transition-all min-h-[48px]"
                  >
                    <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
                    Reset Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="GPA Calculation Result"
              primaryResult={{
                label: 'Cumulative GPA',
                value: resultInfo.gpa,
                description: resultInfo.classification,
                bgColor: resultInfo.bgColor,
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Total Credits', value: resultInfo.totalCredits },
                { label: 'Total Points', value: resultInfo.totalPoints },
                { label: 'System', value: system.toUpperCase() }
              ]}
              onShare={() => {}}
            />

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 flex justify-between items-center share-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="w-20 h-20" />
               </div>
               <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{resultInfo.classification || '---'}</div>
               </div>
               <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800 relative z-10 transition-transform group-hover:scale-110">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
               </div>
            </div>

            <ShareResult title="My Academic Performance" result={`${resultInfo.gpa} GPA`} calcUrl="https://calcpro.com.np/calculator/gpa" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is NEB Grading?', answer: 'Nepal Education Board uses a 4.0 scale where A+ (90+) is 4.0, A (80-90) is 3.6, and B+ (70-80) is 3.2.' },
            { question: 'How is GPA calculated?', answer: 'GPA = Sum(Grade Point * Credits) / Sum(Credits). Each subject is weighted by its credit hours.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
