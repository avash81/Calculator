'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Zap, Weight, FastForward, Info } from 'lucide-react';

export default function ForceCalc() {
  const [f, setF] = useState('10');
  const [m, setM] = useState('2');
  const [a, setA] = useState(''); // Unknown target

  const res = useMemo(() => {
    const nf = parseFloat(f); const nm = parseFloat(m); const na = parseFloat(a);
    let val: number | null = null;
    let label = '';
    
    if (isNaN(nf)) { val = nm * na; label = 'Force = ' + val.toFixed(2) + ' N'; }
    else if (isNaN(nm)) { val = nf / na; label = 'Mass = ' + val.toFixed(2) + ' kg'; }
    else if (isNaN(na)) { val = nf / nm; label = 'Acc = ' + val.toFixed(2) + ' m/s²'; }

    return { val, label };
  }, [f, m, a]);

  return (
    <>
      <JsonLd type="calculator" name="Force Calculator (F=ma)" description="Solve for Newton force, mass, or acceleration using Newton&apos;s second law." url="https://calcpro.com.np/calculator/physics-force" />
      
      <CalcWrapper
        title="Force Calculator (F=ma)"
        description="Calculate Force, Mass, or Acceleration using Newton&apos;s Second Law. Solve any variable by leaving it blank."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'force'}]}
        formula="F = m × a"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-40 h-40" />
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Force (N)</label>
                          <input type="number" value={f} onChange={e=>setF(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Mass (kg)</label>
                          <input type="number" value={m} onChange={e=>setM(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Acc (m/s²)</label>
                          <input type="number" value={a} onChange={e=>setA(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-google-gray rounded-3xl p-8 flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-google-blue shadow-lg">
                    <Weight className="w-8 h-8" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Newton&apos;s Law</div>
                    <div className="text-lg font-black text-gray-900 leading-none">Mass vs Acceleration</div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:rotate-12 transition-transform">
                    <FastForward className="w-20 h-20" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Physical Vector</div>
                 <div className="text-5xl font-black mb-8 leading-tight">{res.label.split('=')[1] || 'Enter 2 values'}</div>
                 <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80">
                    &quot;Force is equal to the rate of change of momentum, assuming constant mass.&quot;                  </div>
              </div>
              <ShareResult title="Force Result" result={res.label} calcUrl="https://calcpro.com.np/calculator/physics-force" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "What is Newton&apos;s Second Law?", answer: "Newton&apos;s second law of motion states that the force acting on an object is equal to its mass times its acceleration (F = ma)." },
            { question: "Units of Force?", answer: "The SI unit of force is the Newton (N), which equals kg·m/s²." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
