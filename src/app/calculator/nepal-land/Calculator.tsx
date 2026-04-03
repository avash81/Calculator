'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Map, ArrowLeftRight, Ruler, MapPin, Layers } from 'lucide-react';

const SQFT_PER_ROPANI = 5476;
const SQFT_PER_BIGHA = 72900;
const SQM_FACTOR = 0.092903; // sq ft to sq m

export default function NepalLandCalculator() {
  const [system, setSystem] = useState<'hill' | 'terai' | 'intl'>('hill');
  
  // Hill State (Ropani-Aana-Paisa-Daam)
  const [ropani, setRopani] = useState(1);
  const [aana, setAana] = useState(0);
  const [paisa, setPaisa] = useState(0);
  const [daam, setDaam] = useState(0);

  // Terai State (Bigha-Kattha-Dhur)
  const [bigha, setBigha] = useState(0);
  const [kattha, setKattha] = useState(0);
  const [dhur, setDhur] = useState(0);

  // Intl State
  const [sqft, setSqft] = useState(5476);

  const totalSqft = useMemo(() => {
    if (system === 'hill') {
      return (ropani * SQFT_PER_ROPANI) + (aana * (SQFT_PER_ROPANI / 16)) + (paisa * (SQFT_PER_ROPANI / 64)) + (daam * (SQFT_PER_ROPANI / 256));
    } else if (system === 'terai') {
      return (bigha * SQFT_PER_BIGHA) + (kattha * (SQFT_PER_BIGHA / 20)) + (dhur * (SQFT_PER_BIGHA / 400));
    }
    return sqft;
  }, [system, ropani, aana, paisa, daam, bigha, kattha, dhur, sqft]);

  const results = useMemo(() => {
    const s = totalSqft;
    const m = s * SQM_FACTOR;
    
    // Convert to Hill System
    let rem = s;
    const r = Math.floor(rem / SQFT_PER_ROPANI); rem %= SQFT_PER_ROPANI;
    const a = Math.floor(rem / (SQFT_PER_ROPANI/16)); rem %= (SQFT_PER_ROPANI/16);
    const p = Math.floor(rem / (SQFT_PER_ROPANI/64)); rem %= (SQFT_PER_ROPANI/64);
    const d = (rem / (SQFT_PER_ROPANI/256)).toFixed(2);

    // Convert to Terai System
    let rem2 = s;
    const bg = Math.floor(rem2 / SQFT_PER_BIGHA); rem2 %= SQFT_PER_BIGHA;
    const kt = Math.floor(rem2 / (SQFT_PER_BIGHA/20)); rem2 %= (SQFT_PER_BIGHA/20);
    const dr = (rem2 / (SQFT_PER_BIGHA/400)).toFixed(2);

    return {
      sqft: s.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      sqm: m.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      hill: `${r}-${a}-${p}-${d} R-A-P-D`,
      terai: `${bg}-${kt}-${dr} B-K-D`,
      acres: (s / 43560).toFixed(4),
      hectares: (m / 10000).toFixed(4)
    };
  }, [totalSqft]);

  return (
    <CalculatorErrorBoundary calculatorName="Nepal Land Calculator">
      <JsonLd type="calculator"
        name="Nepal Land Measurement Calculator"
        description="Official Nepal land conversion for Hills (Ropani, Aana, Paisa, Daam) and Terai (Bigha, Kattha, Dhur). Precise conversions to Sq. Ft and Sq. Meters."
        url="https://calcpro.com.np/calculator/nepal-land" />

      <CalcWrapper
        title="Nepal Land Suite"
        description="Professional land unit conversion for Nepal. Seamlessly map between Ropani and Bigha systems with international standard outputs."
        crumbs={[{ label: 'Nepal Rules', href: '/calculator?cat=nepal' }, { label: 'Land Calculator' }]}
        isNepal
        formula="1 Ropani = 5476 sq. ft | 1 Bigha = 72900 sq. ft"
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-[2rem] border border-gray-200 dark:border-gray-700 mb-10">
                    <button onClick={() => setSystem('hill')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest min-h-[48px] transition-all ${system === 'hill' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Hills System</button>
                    <button onClick={() => setSystem('terai')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest min-h-[48px] transition-all ${system === 'terai' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Terai System</button>
                    <button onClick={() => setSystem('intl')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest min-h-[48px] transition-all ${system === 'intl' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Standard Intl</button>
                </div>

                {system === 'hill' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <ValidatedInput label="Ropani" value={ropani} onChange={setRopani} min={0} />
                        <ValidatedInput label="Aana" value={aana} onChange={setAana} min={0} max={15} />
                        <ValidatedInput label="Paisa" value={paisa} onChange={setPaisa} min={0} max={3} />
                        <ValidatedInput label="Daam" value={daam} onChange={setDaam} min={0} max={3} />
                    </div>
                )}

                {system === 'terai' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <ValidatedInput label="Bigha" value={bigha} onChange={setBigha} min={0} />
                        <ValidatedInput label="Kattha" value={kattha} onChange={setKattha} min={0} max={19} />
                        <ValidatedInput label="Dhur" value={dhur} onChange={setDhur} min={0} max={19} />
                    </div>
                )}

                {system === 'intl' && (
                    <div className="grid grid-cols-1 gap-6">
                        <ValidatedInput label="Total Square Feet" value={sqft} onChange={setSqft} min={0} suffix="sq ft" />
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-gray-50 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 5, 10, 20].map(v => (
                        <button key={v} onClick={() => { if(system === 'hill') setRopani(v); else if (system === 'terai') setBigha(v); else setSqft(v*5476); }} 
                        className="py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 border-transparent hover:border-blue-500 text-[10px] font-black uppercase transition-all">
                            {v} {system === 'terai' ? 'Bigha' : 'Ropani'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm transition-all overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-24 h-24" />
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 px-2 flex items-center gap-2">
                    <ArrowLeftRight className="w-3 h-3" /> Cross-System Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-800/50">
                        <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest block mb-2">Hill Mapping (R-A-P-D)</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono tracking-tighter">{results.hill.split(' ')[0]}</span>
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Units</span>
                        </div>
                    </div>
                    <div className="p-6 bg-teal-50/50 dark:bg-teal-900/10 rounded-3xl border border-teal-100/50 dark:border-teal-800/50">
                        <span className="text-[8px] font-black uppercase text-teal-400 tracking-widest block mb-2">Terai Mapping (B-K-D)</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-teal-700 dark:text-teal-300 font-mono tracking-tighter">{results.terai.split(' ')[0]}</span>
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Units</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50 dark:border-gray-800">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aana Equivalent</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{(totalSqft / 342.25).toFixed(2)} Aana</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Kattha Equivalent</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{(totalSqft / 3645).toFixed(2)} Kattha</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dhur Equivalent</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{(totalSqft / 182.25).toFixed(2)} Dhur</p>
                  </div>
                </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="Official Conversion"
              primaryResult={{
                label: 'Total Square Feet',
                value: `${results.sqft} ft²`,
                description: `${results.sqm} Square Meters`,
                bgColor: 'bg-blue-600',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Nepal (Hills)', value: results.hill },
                { label: 'Nepal (Terai)', value: results.terai },
                { label: 'International', value: `${results.acres} Acres` },
                { label: 'Standard', value: `${results.hectares} Ha` }
              ]}
              onShare={() => {}}
            />

            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                    <Ruler className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Standard</div>
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Metric/Bura</div>
                 </div>
                 <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                    <Layers className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Mapping</div>
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Dual Engine</div>
                 </div>
            </div>

            <ShareResult title="Nepal Land Calculation Report" result={`${results.hill} | ${results.terai}`} calcUrl="https://calcpro.com.np/calculator/nepal-land" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sm:p-10">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Quick Unit Guide</h3>
            <div className="space-y-4">
              {[
                { label: '1 Ropani', val: '16 Aana / 5476 sq. ft' },
                { label: '1 Aana', val: '4 Paisa / 342.25 sq. ft' },
                { label: '1 Bigha', val: '20 Kattha / 72900 sq. ft' },
                { label: '1 Kattha', val: '20 Dhur / 3645 sq. ft' },
                { label: '1 Dhur', val: '182.25 sq. ft' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
          <CalcFAQ faqs={[
            { question: 'What is the conversion for 1 Bigha to Ropani?', answer: 'One Bigha is approximately 13.31 Ropani in the Nepali land measurement system.' },
            { question: 'How many sq. ft. are in 1 Aana?', answer: 'One Aana is exactly 342.25 square feet, consisting of 4 Paisa.' },
            { question: 'Which system is used in Terai?', answer: 'The Terai region mainly uses the Bigha, Kattha, and Dhur system, while the Hills/Kathmandu use Ropani, Aana, Paisa, and Daam.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
const Hash = ({ className }: { className: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>;
