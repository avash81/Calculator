'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { Plus, Trash2, X, GraduationCap, Info } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    { gpa: 3.5, credits: 18 },
    { gpa: 3.6, credits: 18 }
  ]);

  const r = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      totalPoints += s.gpa * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [semesters]);

  const addSemester = () => {
    if (semesters.length < 12) {
      setSemesters([...semesters, { gpa: 0, credits: 18 }]);
    }
  };

  const removeSemester = (i: number) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((_, idx) => idx !== i));
    }
  };

  const updateSemester = (i: number, field: 'gpa' | 'credits', val: number) => {
    const next = [...semesters];
    next[i][field] = val;
    setSemesters(next);
  };

  const clearAll = () => {
    setSemesters([{ gpa: 0, credits: 18 }]);
  };

  return (
    <>
      <JsonLd type="calculator"
        name="CGPA Calculator Nepal (TU/KU)"
        description="Professional CGPA calculator for university students. Calculate your Cumulative Grade Point Average across 8 to 12 semesters with credit weightage. Optimized for Nepal (TU, KU, PU) and international systems."
        url="https://calcpro.com.np/calculator/cgpa" />

      <CalcWrapper
        title="CGPA Calculator"
        description="Calculate your cumulative grade point average (CGPA) accurately by providing your individual semester GPAs and total credits earned in each. This tool supports the credit-weighting system used by Tribhuvan (TU), Kathmandu (KU), and other major universities."
        crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'CGPA Calculator' }]}
        relatedCalcs={[
          { name: 'GPA Calculator', slug: 'gpa' },
          { name: 'Percentage Calculator', slug: 'percentage' },
          { name: 'Marks Required', slug: 'marks-needed' },
        ]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                   <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Semester Performance</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Up to 12 Semesters supported</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={clearAll} className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest">Clear All</button>
                  <button onClick={addSemester} className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <Plus className="w-3.5 h-3.5" /> Add Semester
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="hidden sm:grid grid-cols-[60px_1fr_1fr_44px] gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                   <div>Sem</div>
                   <div>Semester GPA</div>
                   <div>Total Credits</div>
                   <div></div>
                </div>
                {semesters.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_44px] gap-4 sm:gap-6 items-center p-4 sm:p-0 bg-gray-50/50 sm:bg-transparent rounded-2xl border border-transparent hover:border-blue-50 transition-all group">
                    <div className="flex sm:block items-center justify-between">
                       <span className="sm:hidden text-[10px] font-black text-gray-400 uppercase">Semester</span>
                       <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">{i+1}</div>
                    </div>
                    <div>
                      <label className="sm:hidden block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Semester GPA</label>
                      <div className="relative">
                         <input type="number" inputMode="decimal" step="0.01" value={s.gpa || ''} onChange={e => updateSemester(i, 'gpa', +e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold text-gray-900 bg-white" placeholder="0.00" />
                         {s.gpa > 0 && <button onClick={() => updateSemester(i, 'gpa', 0)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X className="w-4 h-4"/></button>}
                      </div>
                    </div>
                    <div>
                      <label className="sm:hidden block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Credits</label>
                      <div className="relative">
                         <input type="number" inputMode="numeric" value={s.credits || ''} onChange={e => updateSemester(i, 'credits', +e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold text-gray-900 bg-white" placeholder="0" />
                         {s.credits > 0 && <button onClick={() => updateSemester(i, 'credits', 0)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X className="w-4 h-4"/></button>}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {semesters.length > 1 && (
                        <button onClick={() => removeSemester(i)} className="w-11 h-11 flex items-center justify-center text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <GraduationCap className="w-20 h-20" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Your CGPA</div>
               <div className="text-6xl font-black font-mono mb-4 tracking-tighter">{r.toFixed(2)}</div>
               <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                  <span className="opacity-80">Total Credits Earned</span>
                  <span className="font-mono font-bold">{semesters.reduce((acc, s) => acc + s.credits, 0)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="My CGPA Result"
              result={`${r.toFixed(2)} CGPA`} 
              calcUrl={`https://calcpro.com.np/calculator/cgpa`} 
            />
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
           <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Info className="w-8 h-8" />
           </div>
           <div className="space-y-4">
              <h4 className="text-xl font-black text-gray-900 tracking-tight">University-Specific Grading in Nepal</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                In Nepal, major universities like **Tribhuvan University (TU)** and **Kathmandu University (KU)** use different credit systems. TU usually has 120-140 total credits for a 4-year degree, whereas KU might differ slightly. This calculator uses the standard **Weighted Average** formula required by most international universities for WES and degree verification.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                 <div className="bg-white/80 border border-blue-200 rounded-2xl px-4 py-3">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Standard Formula</div>
                    <div className="text-xs font-mono font-bold text-gray-900">Σ (GPA × Credits) / Σ Credits</div>
                 </div>
                 <div className="bg-white/80 border border-blue-200 rounded-2xl px-4 py-3">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Pass Criterion</div>
                    <div className="text-xs font-mono font-bold text-gray-900">Minimum 2.0 CGPA (TU)</div>
                 </div>
              </div>
           </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is CGPA vs GPA?',
            answer: 'GPA is the Grade Point Average for a single semester. CGPA is the Cumulative average across all completed semesters. Importantly, CGPA is "credit-weighted," meaning a 4-credit course affects your CGPA more than a 2-credit course.',
          },
          {
            question: 'How do I calculate CGPA for 8 semesters?',
            answer: 'Simply click "Add Semester" until you have 8 rows. Enter your GPA for each semester (e.g., 3.42) and the total credits you took in that semester (e.g., 18). Our tool will calculate the weighted cumulative average instantly.',
          },
          {
            question: 'Does this work for TU and KU?',
            answer: 'Yes, this tool works for all universities in Nepal including Tribhuvan University (TU), Kathmandu University (KU), Pokhara University (PU), and Purbanchal University. The formula Σ(GPA*Credits)/Total Credits is universal for credit-weighted systems.',
          },
          {
            question: 'How many semesters can I add?',
            answer: 'You can add up to 12 semesters, which covers 4-year bachelor degrees, 5-year integrated programs, and 6-year engineering or medical courses.',
          },
          {
            question: 'Is there a backspace or clear button?',
            answer: 'Yes, every input field has a quick clear "X" button for better mobile usability, and there is a "Clear All" option at the top to reset the entire calculator.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
