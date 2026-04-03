'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Zap, Weight, FastForward, Info } from 'lucide-react';

type Mode = 'force' | 'work' | 'power' | 'pressure';

export default function ForceCalc() {
  const [mode, setMode] = useState<Mode>('force');
  const [v1, setV1] = useState('10');
  const [v2, setV2] = useState('2');
  const [unit, setUnit] = useState<'si' | 'imp'>('si');

  const res = useMemo(() => {
    const n1 = parseFloat(v1); const n2 = parseFloat(v2);
    if (isNaN(n1) || isNaN(n2)) return { val: 0, label: 'Enter values', unit: '' };

    let val = 0; let label = ''; let u = '';
    
    switch (mode) {
      case 'force':
        val = n1 * n2;
        label = 'Force (F)';
        u = unit === 'si' ? 'N' : 'lbf';
        break;
      case 'work':
        val = n1 * n2;
        label = 'Work (W)';
        u = unit === 'si' ? 'J' : 'ft-lb';
        break;
      case 'power':
        val = n1 / n2;
        label = 'Power (P)';
        u = unit === 'si' ? 'W' : 'hp';
        break;
      case 'pressure':
        val = n1 / n2;
        label = 'Pressure (P)';
        u = unit === 'si' ? 'Pa' : 'psi';
        break;
    }

    return { val: val.toFixed(2), label, unit: u };
  }, [v1, v2, mode, unit]);

  const labels = {
    force: ['Mass (kg)', 'Acc (m/s²)'],
    work: ['Force (N)', 'Dist (m)'],
    power: ['Work (J)', 'Time (s)'],
    pressure: ['Force (N)', 'Area (m²)']
  };

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
            <div className="space-y-8">
               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
                     {(['force', 'work', 'power', 'pressure'] as Mode[]).map(m => (
                       <button key={m} onClick={()=>setMode(m)} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === m ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                          {m}
                       </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{labels[mode][0]}</label>
                        <input type="number" value={v1} onChange={e=>setV1(e.target.value)} className="w-full h-14 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 font-black text-xl outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{labels[mode][1]}</label>
                        <input type="number" value={v2} onChange={e=>setV2(e.target.value)} className="w-full h-14 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 font-black text-xl outline-none transition-all" />
                     </div>
                  </div>
               </div>

               <div className="bg-gray-900 text-white rounded-3xl p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
                       <Zap className="w-7 h-7" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Formula</div>
                       <div className="text-lg font-black text-white italic">
                          {mode === 'force' ? 'F = m × a' : 
                           mode === 'work' ? 'W = F × d' :
                           mode === 'power' ? 'P = W / t' : 'P = F / A'}
                       </div>
                    </div>
                  </div>
                  <button onClick={()=>setUnit(unit === 'si' ? 'imp' : 'si')} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                     System: {unit.toUpperCase()}
                  </button>
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
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">{res.label}</div>
                  <div className="flex items-baseline gap-2 mb-8">
                     <span className="text-6xl font-black">{res.val}</span>
                     <span className="text-xl font-bold opacity-60">{res.unit}</span>
                  </div>
                  <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80">
                     &quot;All variables are processed with SI base units for maximum precision.&quot;                  </div>
               </div>
               <ShareResult title="Mechanics Result" result={`${res.label}: ${res.val} ${res.unit}`} calcUrl="https://calcpro.com.np/calculator/physics-force" />
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
