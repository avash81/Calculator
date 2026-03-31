'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Trash2, Plus, Info } from 'lucide-react';

const UNIVERSITIES = {
  tu_ioe: {
    name: 'TU / IOE',
    fullName: 'Tribhuvan University — Institute of Engineering',
    desc: 'Official IOE grading scale: 80%+ = A/Distinction, 60-79% = B/First Division',
    grading: [
      { min: 80, gpa: 4.0, grade: 'A', div: 'Distinction' },
      { min: 70, gpa: 3.6, grade: 'A-', div: 'First Division' },
      { min: 60, gpa: 3.2, grade: 'B+', div: 'First Division' },
      { min: 50, gpa: 2.8, grade: 'B', div: 'Second Division' },
      { min: 45, gpa: 2.4, grade: 'B-', div: 'Second Division' },
      { min: 40, gpa: 2.0, grade: 'C', div: 'Pass' },
      { min: 35, gpa: 1.6, grade: 'D', div: 'Pass' },
      { min: 0,  gpa: 0.0, grade: 'F', div: 'Fail' },
    ],
  },
  ku: {
    name: 'Kathmandu Uni (KU)',
    fullName: 'Kathmandu University — Dhulikhel',
    desc: 'KU uses a 10-tier 4.0 GPA scale based on percent ranges per faculty.',
    grading: [
      { min: 90, gpa: 4.0, grade: 'A',  div: 'Distinction' },
      { min: 85, gpa: 3.7, grade: 'A-', div: 'Distinction' },
      { min: 80, gpa: 3.3, grade: 'B+', div: 'First Division' },
      { min: 75, gpa: 3.0, grade: 'B',  div: 'First Division' },
      { min: 70, gpa: 2.7, grade: 'B-', div: 'First Division' },
      { min: 65, gpa: 2.3, grade: 'C+', div: 'Second Division' },
      { min: 60, gpa: 2.0, grade: 'C',  div: 'Second Division' },
      { min: 55, gpa: 1.7, grade: 'C-', div: 'Second Division' },
      { min: 50, gpa: 1.0, grade: 'D',  div: 'Pass' },
      { min: 0,  gpa: 0.0, grade: 'F',  div: 'Fail' },
    ],
  },
  pu: {
    name: 'Pokhara Uni (PU)',
    fullName: 'Pokhara University — School of Engineering',
    desc: 'PU computes SGPA per semester, then aggregates to CGPA across all semesters.',
    grading: [
      { min: 80, gpa: 4.0, grade: 'A',  div: 'Distinction' },
      { min: 75, gpa: 3.7, grade: 'A-', div: 'First Division' },
      { min: 70, gpa: 3.3, grade: 'B+', div: 'First Division' },
      { min: 65, gpa: 3.0, grade: 'B',  div: 'First Division' },
      { min: 60, gpa: 2.7, grade: 'B-', div: 'Second Division' },
      { min: 55, gpa: 2.3, grade: 'C+', div: 'Second Division' },
      { min: 50, gpa: 2.0, grade: 'C',  div: 'Second Division' },
      { min: 45, gpa: 1.7, grade: 'C-', div: 'Pass' },
      { min: 40, gpa: 1.0, grade: 'D',  div: 'Pass' },
      { min: 0,  gpa: 0.0, grade: 'F',  div: 'Fail' },
    ],
  },
};

interface Subject {
  id: number;
  name: string;
  credits: number;
  score: number;
}

let nextId = 3;

export default function EngineeringGPACalculator() {
  const [uni, setUni] = useState<keyof typeof UNIVERSITIES>('tu_ioe');
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [percent, setPercent] = useState(75);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Engineering Mathematics I', credits: 3, score: 78 },
    { id: 2, name: 'Applied Physics',           credits: 3, score: 65 },
  ]);

  const getGrade = (marks: number, university: keyof typeof UNIVERSITIES) => {
    for (const level of UNIVERSITIES[university].grading) {
      if (marks >= level.min) return level;
    }
    return UNIVERSITIES[university].grading[UNIVERSITIES[university].grading.length - 1];
  };

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: nextId++, name: `Subject ${nextId - 1}`, credits: 3, score: 70 }]);
  };

  const removeSubject = (id: number) => setSubjects(prev => prev.filter(s => s.id !== id));

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const result = useMemo(() => {
    if (mode === 'quick') {
      const g = getGrade(percent, uni);
      return { gpa: g.gpa.toFixed(2), grade: g.grade, division: g.div, totalCredits: 'N/A', subjectDetails: [] };
    }
    let totalPoints = 0;
    let totalCredits = 0;
    const subjectDetails = subjects.map(s => {
      const g = getGrade(s.score, uni);
      totalPoints += g.gpa * s.credits;
      totalCredits += s.credits;
      return { ...s, gpa: g.gpa, grade: g.grade };
    });
    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const overall = getGrade(cgpa * 25, uni);
    return {
      gpa: cgpa.toFixed(2),
      grade: overall.grade,
      division: cgpa >= 3.6 ? 'Distinction' : cgpa >= 3.0 ? 'First Division' : cgpa >= 2.0 ? 'Second Division' : cgpa >= 1.0 ? 'Pass' : 'Fail',
      totalCredits,
      subjectDetails,
    };
  }, [percent, subjects, uni, mode]);

  const uniData = UNIVERSITIES[uni];

  return (
    <CalcWrapper
      title="Engineering GPA & CGPA Calculator"
      description="Official credit-weighted GPA calculator for Nepal engineering students — supports TU (IOE), Kathmandu University (KU), and Pokhara University (PU) grading systems."
      crumbs={[{ label: 'Education', href: '/calculator?cat=education' }, { label: 'Engineering GPA' }]}
      isNepal
      formula="CGPA = Σ (Credit Hours × Grade Points) ÷ Σ Credit Hours"
    >
      <div className="space-y-8">

        {/* University Selector */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">
            Step 1 — Choose University System
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(UNIVERSITIES).map(([id, u]) => (
              <button
                key={id}
                onClick={() => setUni(id as keyof typeof UNIVERSITIES)}
                className={`py-5 px-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 text-center ${uni === id ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
              >
                <span className="text-xs font-black uppercase tracking-tight">{u.name}</span>
                <span className="text-[9px] font-bold opacity-60">4.0 Scale</span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-center text-[11px] text-blue-700 bg-blue-50 font-semibold rounded-xl px-4 py-2 flex items-center justify-center gap-2">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            {uniData.desc}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 p-1.5 rounded-full w-fit mx-auto">
          <button
            onClick={() => setMode('quick')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'quick' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            Quick % → GPA
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
          >
            Subject Tracker
          </button>
        </div>

        {/* Input Area */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          {mode === 'quick' ? (
            <div className="text-center space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Your Total Percentage /&nbsp;Marks (%)
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={percent}
                  onChange={e => setPercent(Number(e.target.value))}
                  className="w-full text-7xl font-black text-center py-4 bg-transparent border-b-8 border-gray-100 focus:border-blue-500 outline-none transition-all"
                />
                <span className="absolute right-0 bottom-6 text-3xl font-black text-gray-300">%</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject — Credit — Marks</span>
                <button
                  onClick={addSubject}
                  className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Subject
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map(s => (
                  <div key={s.id} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      value={s.name}
                      onChange={e => updateSubject(s.id, 'name', e.target.value)}
                      className="col-span-5 bg-gray-50 rounded-xl px-3 py-3 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 border border-transparent"
                    />
                    <div className="col-span-3 relative">
                      <input
                        type="number"
                        title="Credit Hours"
                        value={s.credits}
                        min={1}
                        max={6}
                        onChange={e => updateSubject(s.id, 'credits', Number(e.target.value))}
                        className="w-full bg-blue-50 rounded-xl px-2 py-3 text-xs font-black text-center text-blue-600 outline-none border border-transparent focus:ring-2 focus:ring-blue-300"
                      />
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-400 uppercase whitespace-nowrap">Credits</span>
                    </div>
                    <div className="col-span-3 relative">
                      <input
                        type="number"
                        title="Percentage Marks"
                        value={s.score}
                        min={0}
                        max={100}
                        onChange={e => updateSubject(s.id, 'score', Number(e.target.value))}
                        className="w-full bg-gray-50 rounded-xl px-2 py-3 text-xs font-black text-center text-gray-800 outline-none border border-transparent focus:ring-2 focus:ring-blue-300"
                      />
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-400 uppercase">Marks%</span>
                    </div>
                    <button
                      onClick={() => removeSubject(s.id)}
                      className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-end justify-end p-6">
            <span className="text-[160px] font-black leading-none">{UNIVERSITIES[uni].name.split(' ')[0]}</span>
          </div>
          <div className="relative z-10 space-y-2">
            <div className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60">{uniData.name}</div>
            <div className="text-9xl font-black tracking-tighter drop-shadow-lg leading-none">{result.gpa}</div>
            <div className="text-xl font-black tracking-wider opacity-80">/ 4.0 CGPA</div>
            <div className="flex justify-center items-center gap-6 pt-4 border-t border-white/20 mt-4">
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-widest opacity-60">Grade</div>
                <div className="text-lg font-black">{result.grade}</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-widest opacity-60">Division</div>
                <div className="text-lg font-black">{result.division}</div>
              </div>
              {mode === 'advanced' && (
                <>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-[9px] uppercase tracking-widest opacity-60">Total Credits</div>
                    <div className="text-lg font-black">{result.totalCredits}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Subject breakdown in advanced mode */}
        {mode === 'advanced' && result.subjectDetails.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {result.subjectDetails.map(s => (
                <div key={s.id} className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[50%]">{s.name}</span>
                  <div className="flex items-center gap-4 text-[10px] font-black">
                    <span className="text-gray-400">{s.credits} cr</span>
                    <span className="text-gray-400">{s.score}%</span>
                    <span className={`px-2 py-0.5 rounded-full ${s.gpa >= 3.6 ? 'bg-green-50 text-green-600' : s.gpa >= 2.4 ? 'bg-blue-50 text-blue-600' : s.gpa >= 1.0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                      {s.grade} ({s.gpa.toFixed(1)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grading Reference Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{uniData.name} — Official Grading Scale</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3 text-left">Marks %</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3 text-center">GPA</th>
                  <th className="px-4 py-3 text-right">Division</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {uniData.grading.slice(0, -1).map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-gray-600">
                      {row.min}%{i < uniData.grading.length - 2 ? ` – ${uniData.grading[i + 1].min - 1}%` : '+'}
                    </td>
                    <td className="px-4 py-2.5 text-center font-black text-blue-600">{row.grade}</td>
                    <td className="px-4 py-2.5 text-center font-black text-gray-900">{row.gpa.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-400">{row.div}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <ShareResult title="Engineering GPA Calculator — CalcPro.NP" result={`CGPA: ${result.gpa} (${result.grade}) — ${uniData.name}`} calcUrl="https://calcpro.com.np/calculator/engineering-gpa-calculator" />
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How does TU (IOE) calculate engineering GPA?',
            answer: 'IOE traditionally evaluates students by percentage marks. The official conversion maps: 80%+ = A (4.0, Distinction), 70-79% = A- (3.6, First Division), 60-69% = B+ (3.2, First Division), 50-59% = B (2.8, Second Division), 40-49% = C (2.0, Pass), 35-39% = D (1.6, Conditional Pass), below 35% = F (Fail). The SGPA/CGPA is calculated by summing credit × grade points across all subjects.',
          },
          {
            question: 'How does Kathmandu University (KU) calculate GPA?',
            answer: 'KU uses a 10-tier percentage-to-GPA conversion. A score of 90%+ earns a 4.0 (Grade A), 85–89% earns 3.7 (A-), 80–84% earns 3.3 (B+), and so on down to 50% which earns 1.0 (D). Below 50% is F. The CGPA is the credit-weighted average of all courses in all semesters in the program.',
          },
          {
            question: 'How does Pokhara University (PU) compute SGPA and CGPA?',
            answer: 'PU calculates SGPA per semester using the formula: SGPA = Σ (Credit Hours × Grade Points) ÷ Total Credit Hours. CGPA is then the weighted average of SGPA values across all semesters. PU uses an 9-tier 4.0 grading scale starting at 80% for an "A" (4.0) and 40% for a "D" (1.0).',
          },
          {
            question: 'What percentage is needed for a 3.6 GPA in Nepal engineering programs?',
            answer: 'For TU/IOE, a score of 70% or above gives a 3.6 GPA (A-). For KU, you need 85% or above for a 3.7 GPA (A-). For PU, 75% gives a 3.7 GPA (A-). The threshold varies by university, so always check your specific university grading chart.',
          },
          {
            question: 'Why is CGPA better than percentage for comparing students?',
            answer: 'CGPA accounts for the relative difficulty of subjects by weighting higher-credit subjects more heavily. Two students with the same percentage average may have different CGPAs if they passed different mixes of 1-credit lab courses versus 4-credit theoretical courses. CGPA is the internationally accepted standard for academic evaluation.',
          },
        ]} />
      </div>
    </CalcWrapper>
  );
}
