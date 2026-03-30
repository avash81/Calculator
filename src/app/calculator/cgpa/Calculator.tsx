'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { Plus, Trash2 } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([{ gpa: 3.5, credits: 18 }]);

  const r = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      totalPoints += s.gpa * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [semesters]);

  const addSemester = () => setSemesters([...semesters, { gpa: 0, credits: 18 }]);
  const removeSemester = (i: number) => setSemesters(semesters.filter((_, idx) => idx !== i));
  const updateSemester = (i: number, field: 'gpa' | 'credits', val: number) => {
    const next = [...semesters];
    next[i][field] = val;
    setSemesters(next);
  };

  return (
    <>
      <JsonLd type="calculator"
        name="CGPA Calculator"
        description="Calculate your Cumulative Grade Point Average (CGPA) across multiple semesters. Supports credit-weighted calculations for university students."
        url="https://calcpro.com.np/calculator/cgpa" />

      <CalcWrapper
        title="CGPA Calculator"
        description="Calculate your Cumulative Grade Point Average (CGPA) across multiple semesters. Supports credit-weighted calculations."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'CGPA Calculator' }]}
        relatedCalcs={[
          { name: 'GPA Calculator', slug: 'gpa' },
          { name: 'Percentage Calculator', slug: 'percentage' },
          { name: 'Attendance Calculator', slug: 'attendance' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semesters</h3>
                <button onClick={addSemester} className="flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">
                  <Plus className="w-4 h-4" /> Add Semester
                </button>
              </div>
              <div className="p-6 space-y-4">
                {semesters.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_40px] gap-4 items-end">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">GPA</label>
                      <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" step="0.01" value={s.gpa} onChange={e => updateSemester(i, 'gpa', +e.target.value)} className="w-full h-10 px-3 rounded-lg border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Credits</label>
                      <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={s.credits} onChange={e => updateSemester(i, 'credits', +e.target.value)} className="w-full h-10 px-3 rounded-lg border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold" />
                    </div>
                    <button onClick={() => removeSemester(i)} className="h-10 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Your CGPA</div>
              <div className="text-4xl font-bold font-mono mb-4">{r.toFixed(2)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80 font-medium">Total Credits</span>
                  <span className="font-mono font-bold">{semesters.reduce((acc, s) => acc + s.credits, 0)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="CGPA Result" 
              result={`${r.toFixed(2)} CGPA`} 
              calcUrl={`https://calcpro.com.np/calculator/cgpa`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is CGPA?',
            answer: 'CGPA stands for Cumulative Grade Point Average. It is the average of Grade Point Averages (GPA) obtained in all semesters of a course, weighted by the credit hours of each semester.',
          },
          {
            question: 'How is CGPA calculated?',
            answer: 'To calculate CGPA, multiply each semester\'s GPA by its total credits, sum these products, and then divide by the total number of credits earned across all semesters.',
          },
          {
            question: 'What is the difference between GPA and CGPA?',
            answer: 'GPA is the average for a single semester or term, while CGPA is the average across multiple semesters or the entire duration of the program.',
          },
          {
            question: 'How to convert CGPA to percentage?',
            answer: 'The conversion formula varies by university. A common formula is Percentage = CGPA * 9.5, but you should check your specific institution\'s guidelines.',
          },
          {
            question: 'What is a good CGPA?',
            answer: 'A CGPA of 3.5 or above is generally considered excellent. Most competitive jobs and graduate programs look for a CGPA of at least 3.0 or 3.2.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
