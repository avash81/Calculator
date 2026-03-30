'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Calculator, Info, Ruler } from 'lucide-react';

const GRADES = [
  { name: 'M5', ratio: [1, 5, 10], desc: '1:5:10 (Cement:Sand:Aggregate)' },
  { name: 'M7.5', ratio: [1, 4, 8], desc: '1:4:8' },
  { name: 'M10', ratio: [1, 3, 6], desc: '1:3:6' },
  { name: 'M15', ratio: [1, 2, 4], desc: '1:2:4' },
  { name: 'M20', ratio: [1, 1.5, 3], desc: '1:1.5:3 (Standard)' },
  { name: 'M25', ratio: [1, 1, 2], desc: '1:1:2' },
];

function fmt(n: number) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 3 });
}

export default function ConcreteCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [volume, setVolume] = useState(10);
  const [grade, setGrade] = useState(GRADES[4]); // M20
  const [wastage, setWastage] = useState(5);
  const [dryFactor, setDryFactor] = useState(1.54);

  const result = useMemo(() => {
    const totalVolume = volume * (1 + wastage / 100);
    const dryVolume = totalVolume * dryFactor;
    
    // Sum of ratio = 1 + sand + aggregate
    const sum = grade.ratio[0] + grade.ratio[1] + grade.ratio[2];
    
    // Cement calculation
    const cementVol = (grade.ratio[0] / sum) * dryVolume;
    const cementBags = cementVol / 0.0347; // 1 Bag = 0.0347 m3 approx
    const cementKg = cementBags * 50;

    // Sand calculation
    const sandVol = (grade.ratio[1] / sum) * dryVolume;
    const sandCft = sandVol * 35.3147;

    // Aggregate calculation
    const aggregateVol = (grade.ratio[2] / sum) * dryVolume;
    const aggregateCft = aggregateVol * 35.3147;

    return { 
      cementBags, 
      cementKg, 
      sandVol, 
      sandCft, 
      aggregateVol, 
      aggregateCft,
      dryVolume,
      totalVolume
    };
  }, [volume, grade, wastage, dryFactor]);

  return (
    <>
      <JsonLd type="calculator"
        name="Concrete Mix Calculator"
        description="Professional civil engineering calculator for estimating cement, sand, and aggregate requirement for various concrete grades (M5 to M25)."
        url="https://calcpro.com.np/calculator/concrete-mix" />

      <CalcWrapper
        title="Concrete Mix Calculator"
        description="Estimate the quantity of cement bags, sand, and stone aggregate required for your construction project based on volume and concrete grade."
        crumbs={[{label:'engineering',href:'/calculator?cat=engineering'}, {label:'concrete mix'}]}
        relatedCalcs={[
          {name:'Brick Calculator',slug:'brick-calculator'},
          {name:'Plaster Calculator',slug:'plaster-calculator'},
          {name:'Flooring Calculator',slug:'flooring-calculator'},
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setUnit('m')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${unit === 'm' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Metric (m³)
                </button>
                <button 
                  onClick={() => setUnit('ft')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${unit === 'ft' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Imperial (ft³)
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5" /> Total Wet Volume ({unit === 'm' ? 'm³' : 'ft³'})
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-2xl font-black text-gray-900 outline-none transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black uppercase text-[10px] tracking-widest">{unit === 'm' ? 'cubic meters' : 'cubic feet'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5" /> Concrete Grade
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GRADES.map(g => (
                    <button
                      key={g.name}
                      onClick={() => setGrade(g)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${grade.name === g.name ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="text-sm font-black text-gray-900">{g.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wastage (%)</label>
                    <input 
                      type="number"
                      value={wastage}
                      onChange={(e) => setWastage(Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dry Factor</label>
                    <input 
                      type="number"
                      step={0.01}
                      value={dryFactor}
                      onChange={(e) => setDryFactor(Number(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-3 font-bold text-gray-900 outline-none"
                    />
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/20">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 border-l-2 border-blue-500 pl-4">Estimation Results</div>
              
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-black text-white flex items-baseline gap-2">
                    {fmt(Math.ceil(result.cementBags))} <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bags</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-black uppercase mt-1">Cement Required (approx {fmt(result.cementKg)} kg)</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <div className="text-xl font-black text-white">{fmt(result.sandVol)} m³</div>
                      <div className="text-[10px] text-orange-400 font-bold uppercase mt-1">Sand ({fmt(result.sandCft)} cft)</div>
                   </div>
                   <div>
                      <div className="text-xl font-black text-white">{fmt(result.aggregateVol)} m³</div>
                      <div className="text-[10px] text-green-400 font-bold uppercase mt-1">Aggregate ({fmt(result.aggregateCft)} cft)</div>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-700 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Wet Volume</span>
                    <span className="text-white">{fmt(volume)} {unit === 'm' ? 'm³' : 'ft³'}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Dry Volume (Incl Wastage)</span>
                    <span className="text-blue-400">{fmt(result.dryVolume)} {unit === 'm' ? 'm³' : 'ft³'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
               <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1">Civil Eng Tip</div>
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">One bag of cement (50kg) is approximately 0.0347 cubic meters. For accurate hydration, use water-cement ratio specified by your engineer.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is Dry Volume Factor in concrete?',
            answer: 'When water is added to dry cement, sand, and aggregate, the air voids are filled and the volume decreases. To get 1m³ of wet concrete, you need approx 1.54m³ of dry ingredients. This 1.54 is the dry volume factor.'
          },
          {
            question: 'What is M20 concrete mix ratio?',
            answer: 'M20 is a nominal mix where "M" stands for Mix and "20" represents the characteristic compressive strength after 28 days in N/mm². The standard ratio is 1 : 1.5 : 3 (Cement : Sand : Aggregate).'
          }
        ]} />
      </CalcWrapper>
    </>
  );
}
