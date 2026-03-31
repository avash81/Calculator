'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

export default function BrickCalculator() {
  const [length, setLength] = useState(10);
  const [height, setHeight] = useState(10);
  const [thickness, setThickness] = useState(9); // 9 inch or 4 inch
  const [brickL, setBrickL] = useState(9);
  const [brickW, setBrickW] = useState(4.5);
  const [brickH, setBrickH] = useState(3);
  const [mortar, setMortar] = useState(0.5); // 0.5 inch mortar

  const result = useMemo(() => {
    // Standard Brick size in Nepal: 9" x 4.5" x 3" (approx 230 x 110 x 70 mm)
    // All inputs in inches for volume calculation
    const wallVol = length * 12 * height * 12 * thickness;

    const brickVolWithMortar = (brickL + mortar) * (brickW + mortar) * (brickH + mortar);
    const numBricks = Math.ceil(wallVol / brickVolWithMortar);

    // Add 5% wastage
    const totalBricks = Math.ceil(numBricks * 1.05);

    return {
      totalBricks,
      wallArea: length * height,
      wallVolume: (wallVol / 1728).toFixed(2), // cubic feet
    };
  }, [length, height, thickness, brickL, brickW, brickH, mortar]);

  return (
    <>
      <JsonLd type="calculator" name="Brick Calculator Nepal" description="Calculate bricks required for construction in Nepal." url="https://calcpro.com.np/calculator/brick-calculator" />
      <CalcWrapper
        title="Bricks Calculator"
        description="Estimate the number of bricks required for your wall construction based on wall dimensions and brick size."
        crumbs={[{label:'Education',href:'/calculator?cat=education'}, {label:'brick calculator'}]}
        relatedCalcs={[{name:'Concrete Mix',slug:'concrete-mix'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Wall Length (ft)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" value={length} onChange={e => setLength(+e.target.value)} className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 font-bold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Wall Height (ft)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" value={height} onChange={e => setHeight(+e.target.value)} className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 font-bold outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Wall Thickness (inches)</label>
              <select value={thickness} onChange={e => setThickness(+e.target.value)} className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 font-bold outline-none">
                <option value={9}>9 inch (Double Brick)</option>
                <option value={4}>4 inch (Single Brick)</option>
              </select>
            </div>
            <div className="pt-4 border-t border-gray-100">
               <h4 className="text-xs font-black text-gray-900 uppercase mb-4">Standard Brick Size (Nepal)</h4>
               <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase">L (in)</label>
                    <input type="number" inputMode="decimal" pattern="[0-9.]*" value={brickL} onChange={e => setBrickL(+e.target.value)} className="w-full h-10 bg-gray-50 rounded-lg px-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase">W (in)</label>
                    <input type="number" inputMode="decimal" pattern="[0-9.]*" value={brickW} onChange={e => setBrickW(+e.target.value)} className="w-full h-10 bg-gray-50 rounded-lg px-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase">H (in)</label>
                    <input type="number" inputMode="decimal" pattern="[0-9.]*" value={brickH} onChange={e => setBrickH(+e.target.value)} className="w-full h-10 bg-gray-50 rounded-lg px-2 text-sm outline-none" />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Total Bricks Needed</div>
              <div className="text-5xl font-black">{result.totalBricks.toLocaleString()}</div>
              <div className="text-[10px] mt-4 opacity-60">*Includes 5% wastage</div>
            </div>
            <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-4">
               <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-bold">Wall Area</span>
                  <span className="text-sm font-black">{result.wallArea} sq. ft</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-bold">Wall Volume</span>
                  <span className="text-sm font-black">{result.wallVolume} cu. ft</span>
               </div>
            </div>
            <ShareResult title="Brick Estimation" result={`${result.totalBricks} bricks`} calcUrl="https://calcpro.com.np/calculator/brick-calculator" />
          </div>
        </div>
        <CalcFAQ faqs={[
          { question: 'What is the standard brick size in Nepal?', answer: 'The standard size of a brick in Nepal is approximately 9 inches x 4.5 inches x 3 inches (230mm x 110mm x 70mm).' },
          { question: 'How many bricks are in 1 cubic foot?', answer: 'Generally, for a 9-inch wall with mortar, there are about 13.5 bricks per cubic foot.' }
        ]} />
      </CalcWrapper>
    </>
  );
}
