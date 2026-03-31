'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Zap, MoveRight, Atom, Info } from 'lucide-react';

export default function EnergyCalc() {
  const [e, setE] = useState('');
  const [m, setM] = useState('2');
  const [v, setV] = useState('10');

  const res = useMemo(() => {
    const ne = parseFloat(e); const nm = parseFloat(m); const nv = parseFloat(v);
    let val: number | null = null;
    let label = '';
    
    if (isNaN(ne)) { val = 0.5 * nm * Math.pow(nv, 2); label = 'Energy = ' + val.toFixed(2) + ' J'; }
    else if (isNaN(nm)) { val = (2 * ne) / Math.pow(nv, 2); label = 'Mass = ' + val.toFixed(2) + ' kg'; }
    else if (isNaN(nv)) { val = Math.sqrt((2 * ne) / nm); label = 'Velocity = ' + val.toFixed(2) + ' m/s'; }

    return { val, label };
  }, [e, m, v]);

  return (
    <>
      <JsonLd type="calculator" name="Kinetic Energy Calculator (1/2mv²)" description="Solve for kinetic energy, mass, or velocity of moving bodies accurately." url="https://calcpro.com.np/calculator/physics-energy" />
      
      <CalcWrapper
        title="Kinetic Energy"
        description="Calculate Kinetic Energy, Mass, or Velocity (1/2mv²). Perfect for physics students and science lovers."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'kinetic energy'}]}
        formula="KE = ½mv²"
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
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Energy (J)</label>
                          <input type="number" value={e} onChange={e=>setE(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Mass (kg)</label>
                          <input type="number" value={m} onChange={e=>setM(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Velocity (m/s)</label>
                          <input type="number" value={v} onChange={e=>setV(e.target.value)} placeholder="?" className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-2xl px-5 font-black text-xl outline-none" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-google-gray rounded-3xl p-8 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-google-blue shadow-lg">
                       <Atom className="w-8 h-8" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Energy Profile</div>
                       <div className="text-lg font-black text-gray-900 leading-none">Mass vs Speed</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:rotate-12 transition-transform">
                    <Zap className="w-20 h-20" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Energy Vector</div>
                 <div className="text-5xl font-black mb-8 leading-tight">{res.label.split('=')[1] || 'Enter 2 values'}</div>
                 <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80">
                    &quot;Kinetic energy is proportional to the square of its speed."                  </div>
              </div>
              <ShareResult title="KE Result" result={res.label} calcUrl="https://calcpro.com.np/calculator/physics-energy" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "What is kinetic energy?", answer: "Kinetic energy is the energy that an object possesses due to its motion." },
            { question: "Mass vs Speed impact?", answer: "Double the mass = double the energy. Double the speed = quadruple the energy (square impact)." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
