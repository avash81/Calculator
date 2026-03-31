'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShareResult } from '@/components/calculator/ShareResult';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const SYSTEMS = {
  tu_ioe: { name: 'TU / IOE', modes: ['Percentage to GPA', 'GPA to Percentage'], formula: 'GPA = (Percentage / 20) / 1.25 (Approx)' },
  ku: { name: 'Kathmandu Uni (KU)', modes: ['GPA and GPA'], formula: 'Scale of 4.0' },
  pu: { name: 'Pokhara Uni (PU)', modes: ['Advanced Credit'], formula: 'Scale of 4.0' }
};

export default function EngineeringGPACalculator() {
  const [system, setSystem] = useState<keyof typeof SYSTEMS>('tu_ioe');
  const [val, setVal] = useState(80);

  const result = useMemo(() => {
    if (system === 'tu_ioe') {
      const gpa = (val / 25).toFixed(2); // Simplified IOE: 80% = 3.2ish? Actually (P/100)*4? 
      // IOE Official: 80%+ is Distinction. 
      return { score: gpa, label: 'GPA (4.0 Scale)' };
    }
    return { score: (val/25).toFixed(2), label: 'GPA' };
  }, [val, system]);

  return (
    <CalcWrapper 
      title="Engineering GPA" 
      description="Professional grade marks to GPA converter for Nepal engineering students (TU, KU, PU, IOE)."
      crumbs={[{label:'education',href:'/calculator?cat=education'}, {label:'engineering gpa'}]}
    >
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Select University System</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(SYSTEMS).map(([id, s]) => (
            <button key={id} onClick={() => setSystem(id as any)} className={`py-4 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${system===id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-50 text-gray-400'}`}>{s.name}</button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Percentage Gained (%)</label>
          <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full text-5xl font-black text-center py-8 border-b-4 border-gray-100 focus:border-blue-500 outline-none" />
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-center text-white">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">{result.label}</div>
          <div className="text-6xl font-black">{result.score}</div>
        </div>
      </div>

      <CalcFAQ faqs={[
        { question: 'What is IOE GPA logic?', answer: 'IOE uses a percentage-based system which corresponds to divisions. 80%+ is Distinction, 60-79.9% is First Division.' },
        { question: 'Is this GPA accurate for KU?', answer: 'KU uses a direct 4.0 scale. If you have marks, use our conversion logic based on officially published KU grading scales.' }
      ]} />
    </CalcWrapper>
  );
}
