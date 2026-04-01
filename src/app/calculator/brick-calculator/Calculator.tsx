'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Warehouse, Ruler, Calculator as CalcIcon, Construction } from 'lucide-react';

export default function BrickCalculator() {
  const [length, setLength] = useState(10);
  const [height, setHeight] = useState(10);
  const [thickness, setThickness] = useState(9); // 9 inch or 4 inch
  const [brickL, setBrickL] = useState(9);
  const [brickW, setBrickW] = useState(4.5);
  const [brickH, setBrickH] = useState(3);
  const [mortar, setMortar] = useState(0.5); // 0.5 inch mortar

  const result = useMemo(() => {
    // Wall volume in cubic inches
    const wallVol = length * 12 * height * 12 * thickness;
    const brickVolWithMortar = (brickL + mortar) * (brickW + mortar) * (brickH + mortar);
    const numBricks = Math.ceil(wallVol / brickVolWithMortar);
    
    // 5% wastage is standard in Nepal construction
    const totalBricks = Math.ceil(numBricks * 1.05);

    return {
      totalBricks,
      wallArea: length * height,
      wallVolume: (wallVol / 1728).toFixed(2), // cubic feet (CFT)
    };
  }, [length, height, thickness, brickL, brickW, brickH, mortar]);

  return (
    <CalculatorErrorBoundary calculatorName="Brick Calculator">
      <JsonLd type="calculator"
        name="Brick Calculator Nepal"
        description="Estimate the number of bricks needed for construction in Nepal. Includes 9-inch and 4-inch wall options with standard brick sizes."
        url="https://calcpro.com.np/calculator/brick-calculator" />

      <CalcWrapper
        title="Bricks Estimate Suite"
        description="Estimate the number of bricks required for your wall construction project in Nepal. Includes estimates for mortar and standard wastage."
        crumbs={[{label:'Education',href:'/calculator?cat=education'}, {label:'brick calculator'}]}
        relatedCalcs={[{name:'Concrete Mix',slug:'concrete-mix'}]}
        isNepal
        formula="Total Bricks = (Wall Volume / Brick Volume with Mortar) × 1.05"
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ValidatedInput label="Wall Length (ft)" value={length} onChange={setLength} min={0.1} required />
                  <ValidatedInput label="Wall Height (ft)" value={height} onChange={setHeight} min={0.1} required />
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Wall Thickness (Nepal Standard)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[9, 4.5].map(v => (
                      <button 
                        key={v} 
                        onClick={() => setThickness(v)}
                        className={`py-4 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-tight min-h-[48px] ${thickness === v ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-100 dark:border-gray-800 text-gray-400'}`}
                      >
                        {v} Inch Wall {v === 9 ? '(Double)' : '(Single)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50 dark:border-gray-800 space-y-6">
                   <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                     <Construction className="w-4 h-4 text-blue-600" /> Standard Brick Dimensions (Inches)
                   </h4>
                   <div className="grid grid-cols-3 gap-4">
                      <ValidatedInput label="Length" value={brickL} onChange={setBrickL} min={1} />
                      <ValidatedInput label="Width" value={brickW} onChange={setBrickW} min={1} />
                      <ValidatedInput label="Height" value={brickH} onChange={setBrickH} min={1} />
                   </div>
                   <ValidatedInput label="Mortar Joint Thickness" value={mortar} onChange={setMortar} min={0} max={2} step={0.1} suffix="in" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Warehouse className="w-20 h-20" />
               </div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Quantity Summary</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-1">Wall Surface Area</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">{result.wallArea} sq. ft</span>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-1">Wall Volume (CFT)</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white font-mono">{result.wallVolume} ft³</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="Brick Report"
              primaryResult={{
                label: 'Total Bricks Required',
                value: result.totalBricks.toLocaleString(),
                description: 'Including 5% Wastage',
                bgColor: 'bg-red-600',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Bricks/Sq. Ft', value: (result.totalBricks / result.wallArea).toFixed(1) },
                { label: 'Wall Aspect', value: `${length} x ${height}` },
                { label: 'Mortar Load', value: `${mortar} inch` },
                { label: 'Estimation', value: 'Draft' }
              ]}
              onShare={() => {}}
            />

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                  <Ruler className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Units (Feet)</div>
               </div>
               <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm text-center group transition-all hover:bg-blue-50/50">
                  <CalcIcon className="w-6 h-6 text-gray-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Precise CFT</div>
               </div>
            </div>

            <ShareResult title="Brick Estimation Report" result={`${result.totalBricks} bricks`} calcUrl="https://calcpro.com.np/calculator/brick-calculator" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is the standard brick size in Nepal?', answer: 'The standard brick size in Nepal is approximately 9.0" x 4.5" x 3.0" (230mm x 110mm x 70mm).' },
            { question: 'How much wastage should be calculated?', answer: 'A 5% to 10% wastage factor is standard in Nepal construction to account for broken bricks and site handling.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
