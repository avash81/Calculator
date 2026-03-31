'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { FlaskConical, Beaker, Pill, Info } from 'lucide-react';

const ELEMENTS: Record<string, number> = {
  'H': 1.008, 'He': 4.002, 'Li': 6.941, 'Be': 9.012, 'B': 10.811, 'C': 12.011, 'N': 14.007, 'O': 15.999,
  'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974, 'S': 32.065,
  'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38, 'Ag': 107.868,
  'Au': 196.967, 'Pb': 207.2
};

export default function MolarMassCalc() {
  const [formula, setFormula] = useState('H2O');

  const res = useMemo(() => {
    // Simple parser for H2O, NaCl, C6H12O6
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let total = 0;
    let breakdown: { el: string, mass: number, n: number }[] = [];

    while ((match = regex.exec(formula)) !== null) {
      const el = match[1];
      const count = match[2] === '' ? 1 : parseInt(match[2]);
      const mass = ELEMENTS[el];
      if (mass) {
        total += mass * count;
        breakdown.push({ el, mass, n: count });
      }
    }
    return { total: total.toFixed(3), breakdown };
  }, [formula]);

  return (
    <>
      <JsonLd type="calculator" name="Molar Mass Calculator" description="Calculate molar mass of chemical compounds like H2O or NaCl based on standard periodic atomic weights." url="https://calcpro.com.np/calculator/chemistry-molar" />
      
      <CalcWrapper
        title="Molar Mass"         description="Find the molar mass (Daltons) of chemical formulas using precise standard atomic weights from the periodic table."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'molar mass'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FlaskConical className="w-40 h-40" />
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Chemical Formula (Case Sensitive)</label>
                       <input type="text" value={formula} onChange={e=>setFormula(e.target.value)} placeholder="e.g. H2O" className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-google-blue rounded-3xl px-8 font-black text-3xl outline-none transition-all placeholder:text-gray-200" />
                       <div className="flex gap-2 flex-wrap mt-3">
                          {['H2O', 'NaCl', 'C6H12O6', 'CO2'].map(ex => (
                            <button key={ex} onClick={()=>setFormula(ex)} className="px-4 py-1.5 bg-google-gray rounded-full text-[10px] font-black text-gray-400 hover:text-google-blue transition-colors">Try {ex}</button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Atomic Breakdown</div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {res.breakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-google-blue shadow-sm">{item.el}</div>
                            <div className="text-[10px] font-black text-gray-400">× {item.n} Units</div>
                         </div>
                         <div className="font-mono font-bold text-gray-600">{(item.mass * item.n).toFixed(2)}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-20 h-20" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Molar Mass (g/mol)</div>
                 <div className="text-5xl font-black mb-8 leading-tight">{res.total}</div>
                 <div className="pt-8 border-t border-white/20 italic text-sm font-bold opacity-80 leading-relaxed">
                    &quot;Computed using IUPAC standard atomic weights."                  </div>
              </div>
              <ShareResult title="Molar Mass Solved" result={`${res.total} g/mol`} calcUrl="https://calcpro.com.np/calculator/chemistry-molar" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: "How is molar mass calculated?", answer: "It is the sum of the atomic masses of all atoms present in the chemical formula." },
            { question: "Is this case sensitive?", answer: "Yes. Elements must start with uppercase letters (e.g., 'Na' for Sodium, 'Cl' for Chlorine)." }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
