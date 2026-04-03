'use client';
import { useState } from 'react';
import { 
  BarChart3, 
  Binary, 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  ExternalLink, 
  Info, 
  Layers, 
  Monitor, 
  ShieldCheck, 
  XCircle 
} from 'lucide-react';

interface CalculatorItem {
  id: string;
  name: string;
  category: 'graphing' | 'scientific' | 'financial' | 'foundation';
  specs: string[];
  features: string[];
  exams: {
    sat?: boolean;
    act?: boolean;
    ap?: boolean;
    ib?: boolean;
    cfa?: boolean;
  };
  note?: string;
  display?: string;
  processor?: string;
  power?: string;
}

const CALCULATORS_DATA: CalculatorItem[] = [
  // GRAPHING
  {
    id: 'ti-84-ce',
    name: 'TI-84 Plus CE',
    category: 'graphing',
    display: '320×240px Color, 2.8" Backlit',
    processor: 'Zilog eZ80 @ 48 MHz',
    power: 'Rechargeable Li-ion',
    specs: ['154 KB RAM', '3.0 MB Flash Storage'],
    features: ['MathPrint™', 'Python Support', 'Image overlays', 'Periodic Table App'],
    exams: { sat: true, act: true, ap: true },
    note: 'The current industry standard. 30% thinner and lighter than predecessors.'
  },
  {
    id: 'ti-84-plus',
    name: 'TI-84 Plus',
    category: 'graphing',
    display: '96×64px monochrome',
    processor: 'Zilog Z80 @ 15 MHz',
    power: '4x AAA batteries',
    specs: ['24 KB user-accessible RAM', '480 KB Flash archive'],
    features: ['Real-time clock', 'Classic interface', 'Serial I/O port'],
    exams: { sat: true, act: true, ap: true },
    note: 'The older, still-in-production classic. Still common in US middle schools.'
  },
  {
    id: 'ti-nspire-cx-ii',
    name: 'TI-Nspire™ CX II',
    category: 'graphing',
    display: '320×240px Color, 3.2" Backlit',
    processor: 'ARM9 @ 396 MHz',
    power: 'Rechargeable Li-ion',
    specs: ['64 MB RAM', '128 MB Flash'],
    features: ['3D Graphing', 'Touchpad nav', 'Interactive Geometry', 'Python Support'],
    exams: { sat: true, act: true, ap: true, ib: true },
    note: 'Premium non-CAS handheld. Allowed on all major tests including ACT.'
  },
  {
    id: 'ti-nspire-cx-ii-cas',
    name: 'TI-Nspire™ CX II CAS',
    category: 'graphing',
    display: '320×240px Color, 3.2" Backlit',
    processor: 'ARM9 @ 396 MHz',
    power: 'Rechargeable Li-ion',
    specs: ['64 MB RAM', '128 MB Flash'],
    features: ['Computer Algebra System', 'Exact Math Expressions', '3D Graphing', 'Lua/Python'],
    exams: { sat: true, act: false, ap: true, ib: true },
    note: 'The most powerful TI handheld. Note: CAS models are NOT allowed on the ACT.'
  },
  {
    id: 'ti-89-titanium',
    name: 'TI-89 Titanium',
    category: 'graphing',
    display: '100×160px monochrome',
    processor: 'Motorola 68000 @ 16 MHz',
    power: '4x AAA batteries',
    specs: ['188 KB RAM', '2.7 MB Flash Storage'],
    features: ['Full Symbolic CAS', 'Pretty Print', 'Engineering Apps (EE*Pro)', 'Programmable'],
    exams: { sat: true, act: false, ap: true, ib: true },
    note: 'Classic CAS flagship. Legacy device but still highly powerful for engineering.'
  },

  // SCIENTIFIC
  {
    id: 'ti-36x-pro',
    name: 'TI-36X Pro',
    category: 'scientific',
    display: '4-line Dot Matrix',
    power: 'Solar + Battery',
    specs: ['Advanced Non-graphing'],
    features: ['Numerical Calculus', 'Matrix/Vectors', 'Equation Solver', 'Complex Numbers'],
    exams: { sat: true, act: true, ap: true },
    note: 'The most advanced non-graphing TI calculator. Perfect for university engineering.'
  },
  {
    id: 'ti-30xs-multiview',
    name: 'TI-30XS MultiView™',
    category: 'scientific',
    display: '4-line Dot Matrix',
    power: 'Solar + Battery',
    specs: ['High-value choice'],
    features: ['MathPrint™', 'Full Fraction Math', 'Radical Simplification', 'X-Y Tables'],
    exams: { sat: true, act: true, ap: true },
    note: 'Best overall value. Allows entering expressions exactly as written in textbooks.'
  },
  {
    id: 'ti-30xiis',
    name: 'TI-30XIIS™',
    category: 'scientific',
    display: '2-line LCD',
    power: 'Solar + Battery',
    specs: ['Classroom Standard'],
    features: ['Trig/Log/Exponents', '2-variable stats', 'Edit previous entries'],
    exams: { sat: true, act: true, ap: true },
    note: 'The most widely sold basic TI scientific calculator in US classrooms.'
  },

  // FINANCIAL
  {
    id: 'ba2-plus-standard',
    name: 'BA II Plus™',
    category: 'financial',
    display: '10-digit LCD',
    power: 'CR2032 Lithium',
    specs: ['Finance Specialist'],
    features: ['TVM Sheets', 'Amortization', 'NPV/IRR', 'Bond Price/Yield'],
    exams: { cfa: true },
    note: 'Standard choice for finance and accounting students globally.'
  },
  {
    id: 'ba2-plus-pro',
    name: 'BA II Plus™ Professional',
    category: 'financial',
    display: '10-digit LCD (Metal Bezel)',
    power: 'CR2032 Lithium',
    specs: ['Premium Finance'],
    features: ['Net Future Value (NFV)', 'Modified Duration', 'MIRR', 'Payback Period'],
    exams: { cfa: true },
    note: 'Enhanced functionality with better build quality for serious professionals.'
  },

  // FOUNDATION
  {
    id: 'ti-15-explorer',
    name: 'TI-15 Explorer™',
    category: 'foundation',
    display: 'LCD Multi-line',
    power: 'Solar + Battery',
    specs: ['Elementary K-6'],
    features: ['Fraction Math', 'Problem Solving Mode', 'Place Value', 'Integer Division'],
    exams: { sat: false, act: false, ap: false },
    note: 'Designed for early learners to explore patterns and fraction operations.'
  },
  {
    id: 'little-professor',
    name: 'Little Professor™ Solar',
    category: 'foundation',
    display: 'Custom numeric',
    power: 'Solar Only',
    specs: ['Math Practice Game'],
    features: ['Math drill patterns', 'Instant right/wrong feedback', '3 Difficulty levels'],
    exams: { sat: false, act: false, ap: false },
    note: 'Not a standard calculator—a game designed to make learning math facts fun.'
  }
];

export function PhysicalCalculatorGuide() {
  const [activeTab, setActiveTab] = useState<'graphing' | 'scientific' | 'financial' | 'foundation'>('graphing');

  const filtered = CALCULATORS_DATA.filter(c => c.category === activeTab);

  return (
    <div className="mt-32 space-y-16">
      
      {/* HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-google-blue/10 text-google-blue rounded-full text-[10px] font-black uppercase tracking-widest">
           <BookOpen className="w-3 h-3" /> Educational Resource
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Physical Calculator Reference Hub</h2>
        <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
           Choosing the right physical calculator is critical for students and professionals. 
           This comprehensive guide features official research on the Texas Instruments lineup to help you select the ideal hardware for your academic journey.
        </p>
      </div>

      {/* QUICK TABLE - SUMMARY VIEW */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Quick Comparison Matrix</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">CFA / SAT / ACT Reference</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white border-b border-gray-50">
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Model</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">CAS</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Approved Exams</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Best For</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {[
                    { m: 'TI-84 Plus CE', t: 'Graphing', cas: '❌', ex: 'SAT, ACT, AP', bf: 'High School All-round' },
                    { m: 'Nspire CX II CAS', t: 'Graphing', cas: '✅', ex: 'SAT, AP, IB', bf: 'Calculus & College' },
                    { m: 'TI-36X Pro', t: 'Scientific', cas: '❌', ex: 'SAT, ACT, AP', bf: 'Engineering' },
                    { m: 'TI-30XS', t: 'Scientific', cas: '❌', ex: 'SAT, ACT, AP', bf: 'General High School' },
                    { m: 'BA II Plus Pro', t: 'Financial', cas: '❌', ex: 'CFA, CMA', bf: 'Finance Professionals' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-5 text-sm font-black text-gray-900">{row.m}</td>
                       <td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-tighter">{row.t}</td>
                       <td className="px-8 py-5 text-sm text-center">{row.cas}</td>
                       <td className="px-8 py-5 text-[9px] font-black text-google-blue uppercase tracking-widest text-center">
                          {row.ex}
                       </td>
                       <td className="px-8 py-5 text-xs font-medium text-gray-500">{row.bf}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* SEGMENTED GUIDE */}
      <div className="space-y-10">
         <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2">
            {(['graphing', 'scientific', 'financial', 'foundation'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-google-blue' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab} Solutions
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-google-blue rounded-full" />
                )}
              </button>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map(item => (
              <div key={item.id} className="group bg-white border border-gray-100 hover:border-google-blue/30 rounded-[32px] p-10 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden">
                 
                 {/* ID Watermark */}
                 <div className="absolute -top-4 -right-4 text-[120px] font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                    TI
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className="text-2xl font-black text-gray-900 tracking-tight">{item.name}</h4>
                       <div className="flex gap-2">
                          {item.exams.sat && <span className="text-[8px] font-black bg-google-blue/10 text-google-blue px-2 py-1 rounded-sm uppercase">SAT</span>}
                          {item.exams.act && <span className="text-[8px] font-black bg-purple-50 text-purple-600 px-2 py-1 rounded-sm uppercase">ACT</span>}
                          {item.exams.cfa && <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded-sm uppercase">CFA</span>}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Monitor className="w-3 h-3" /> Display
                          </div>
                          <div className="text-xs font-bold text-gray-700">{item.display}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Cpu className="w-3 h-3" /> Brain
                          </div>
                          <div className="text-xs font-bold text-gray-700">{item.processor || 'Optmized ASIC'}</div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Core Capabilities</label>
                       <div className="flex flex-wrap gap-2">
                          {item.features.map(f => (
                            <span key={f} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                               <CheckCircle2 className="w-3 h-3 text-google-blue" /> {f}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50">
                       <p className="text-xs font-medium text-gray-500 leading-relaxed italic">
                          &quot;{item.note}&quot;
                       </p>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* FOOTNOTE */}
      <div className="bg-gray-50 border border-gray-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-gray-100">
            💡
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Platform Note</h4>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
               While physical calculators are indispensable for proctored exams (SAT/ACT), CalcPro.NP provides high-precision digital versions of these same algorithms for study and professional work — ensuring you have the exact computational power you need, whenever you have an internet connection.
            </p>
         </div>
      </div>
    </div>
  );
}
