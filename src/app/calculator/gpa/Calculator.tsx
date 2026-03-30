'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { PlusCircle, Trash2, GraduationCap } from 'lucide-react';

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

export default function GPACalculator() {
  const [system, setSystem] = useState<'nepal' | 'us'>('nepal');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Core Mathematics', credit: 3, grade: 'A' },
    { id: 2, name: 'Physics Laboratory', credit: 2, grade: 'B+' },
    { id: 3, name: 'English Communication', credit: 3, grade: 'A' },
  ]);

  const gradesList = system === 'nepal' ? NEPAL_GRADES : US_GRADES;

  const result = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(sub => {
      const g = gradesList.find(g => g.grade === sub.grade);
      if (g && sub.credit > 0) {
        totalPoints += g.point * sub.credit;
        totalCredits += sub.credit;
      }
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    let classification = '';
    if (system === 'nepal') {
      if (gpa >= 3.6) classification = 'Outstanding';
      else if (gpa >= 3.2) classification = 'Excellent';
      else if (gpa >= 2.8) classification = 'Very Good';
      else if (gpa >= 2.4) classification = 'Good';
      else classification = 'Passing';
    }
    return { gpa: gpa.toFixed(2), totalCredits, classification };
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

  return (
    <>
      <JsonLd type="calculator" name="Advanced GPA Calculator" description="Calculate institutional GPA for TU, KU, PU or international US systems." url="https://calcpro.com.np/calculator/gpa" />

      <CalcWrapper
        title="GPA Calculator"
        description="Professional grade tool for calculating GPA based on credit-weighted system used in Nepal (TU/KU) and US."
        crumbs={[{label:'education',href:'/calculator?cat=education'}, {label:'gpa'}]}
        relatedCalcs={[{name:'CGPA Calc',slug:'cgpa'},{name:'Percentage',slug:'percentage'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_320px] gap-8">
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="flex bg-gray-50/50 dark:bg-gray-800/20 p-2">
              <button onClick={() => setSystem('nepal')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${system === 'nepal' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Nepal (NEB/TU)</button>
              <button onClick={() => setSystem('us')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${system === 'us' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>US System</button>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="hidden sm:grid grid-cols-[1fr_80px_120px_48px] gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <div>Course/Subject Name</div>
                <div className="text-center">Credits</div>
                <div className="text-center">Grade</div>
                <div></div>
              </div>
              
              <div className="space-y-4">
                {subjects.map((sub, idx) => (
                  <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_48px] gap-4 sm:gap-6 p-6 sm:p-0 bg-gray-50/50 dark:bg-gray-800/10 sm:bg-transparent rounded-3xl group border border-transparent hover:border-blue-50 dark:hover:border-blue-900/30 transition-all">
                    <div>
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Course {idx+1}</label>
                      <input type="text" inputMode="decimal" pattern="[0-9.]*" value={sub.name} onChange={e => updateSubject(sub.id, 'name', e.target.value)} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all" placeholder="Enter course name..." />
                    </div>
                    <div>
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Credits</label>
                      <input type="number" inputMode="decimal" pattern="[0-9.]*" value={sub.credit} onChange={e => updateSubject(sub.id, 'credit', Number(e.target.value))} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">Grade</label>
                      <select value={sub.grade} onChange={e => updateSubject(sub.id, 'grade', e.target.value)} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                        {gradesList.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-center items-center">
                      <button onClick={() => removeSubject(sub.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addSubject} className="group w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-blue-50/30 hover:border-blue-200 hover:text-blue-600 transition-all">
                <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                Add New Course
              </button>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <div className="bg-gradient-to-br from-indigo-600 offset-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/30 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <GraduationCap className="w-20 h-20" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Cumulative GPA</div>
               <div className="text-7xl font-black mb-4 tracking-tighter">{result.gpa}</div>
               {result.classification && (
                 <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full inline-block text-[10px] font-black uppercase tracking-widest border border-white/20">
                   {result.classification} Status
                 </div>
               )}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 flex justify-between items-center share-shadow">
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Units</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{result.totalCredits}</div>
               </div>
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
               </div>
            </div>

            <ShareResult title="My Academic Performance" result={`${result.gpa} GPA`} calcUrl="https://calcpro.com.np/calculator/gpa" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is NEB Grading?', answer: 'Nepal Education Board uses a 4.0 scale where A+ (90+) is 4.0, A (80-90) is 3.6, and B+ (70-80) is 3.2.' },
            { question: 'TU vs KU GPA?', answer: 'Tribhuvan and Kathmandu universities both utilize the 4.0 scale but may differ in individual grade points. Always verify with your specific campus transcript.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
