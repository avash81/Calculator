'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { PlusCircle, Trash2, GraduationCap, X } from 'lucide-react';

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

  const clearAll = () => {
    setSubjects([{ id: Date.now(), name: '', credit: 3, grade: gradesList[0].grade }]);
  };

  return (
    <>
      <JsonLd type="calculator" name="Advanced GPA Calculator Nepal (NEB/TU)" description="Professional GPA calculator for students in Nepal and international systems. Supports NEB, TU, KU, and US 4.0 grading scales with credit hour weightage." url="https://calcpro.com.np/calculator/gpa" />

      <CalcWrapper
        title="GPA Calculator"
        description="Calculate your semester or terminal GPA accurately using our advanced credit-weighted calculator. Supports Nepal's NEB/TU grading standards and international US 4.0 scale."
        crumbs={[{label:'education',href:'/calculator?cat=education'}, {label:'gpa'}]}
        relatedCalcs={[{name:'CGPA Calc',slug:'cgpa'},{name:'Percentage',slug:'percentage'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_320px] gap-8">
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="flex bg-gray-50/50 dark:bg-gray-800/20 p-2 items-center justify-between">
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex-1 mr-4">
                 <button onClick={() => setSystem('nepal')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${system === 'nepal' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Nepal (NEB/TU)</button>
                 <button onClick={() => setSystem('us')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${system === 'us' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>US System</button>
              </div>
              <button onClick={clearAll} className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-4">Reset</button>
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
                    <div className="relative group/field">
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block font-bold">Course {idx+1}</label>
                      <input type="text" value={sub.name} onChange={e => updateSubject(sub.id, 'name', e.target.value)} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all" placeholder="Enter course name..." />
                      {sub.name && <button onClick={() => updateSubject(sub.id, 'name', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 sm:opacity-0 group-hover/field:opacity-100 transition-opacity"><X className="w-4 h-4"/></button>}
                    </div>
                    <div>
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center font-bold">Credits</label>
                      <input type="number" value={sub.credit || ''} onChange={e => updateSubject(sub.id, 'credit', Number(e.target.value))} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all" placeholder="0" />
                    </div>
                    <div>
                      <label className="sm:hidden text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center font-bold">Grade</label>
                      <select value={sub.grade} onChange={e => updateSubject(sub.id, 'grade', e.target.value)} className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 text-sm font-black text-center text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                        {gradesList.map(g => <option key={g.grade} value={g.grade}>{g.grade}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-center items-center">
                      {subjects.length > 1 && (
                        <button onClick={() => removeSubject(sub.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-transparent hover:border-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
            <div className="bg-gradient-to-br from-indigo-600 offset-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/30 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <GraduationCap className="w-20 h-20" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Semester GPA</div>
               <div className="text-7xl font-black mb-4 tracking-tighter">{result.gpa}</div>
               {result.classification && (
                 <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full inline-block text-[10px] font-black uppercase tracking-widest border border-white/20">
                   {result.classification} Status
                 </div>
               )}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 flex justify-between items-center shadow-sm">
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Units</div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{result.totalCredits}</div>
               </div>
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
               </div>
            </div>

            <ShareResult title="My Semester GPA" result={`${result.gpa} GPA`} calcUrl="https://calcpro.com.np/calculator/gpa" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is NEB Grading?', answer: 'Nepal Education Board uses a 4.0 scale where A+ (90+) is 4.0, A (80-90) is 3.6, and B+ (70-80) is 3.2.' },
            { question: 'How are credits used in GPA calculation?', answer: 'GPA is a weighted average. Each grade point is multiplied by the course credit hours, summed up, and then divided by the total credits. This means a 4-credit course has double the impact of a 2-credit course.' },
            { question: 'TU vs KU GPA Standards?', answer: 'Tribhuvan and Kathmandu universities both utilize the 4.0 scale but may differ in individual grade points. This calculator provides the standard NEB/TU scale which is widely used across Nepal.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
