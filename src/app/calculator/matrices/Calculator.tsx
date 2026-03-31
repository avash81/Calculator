'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { LayoutGrid, Grid3X3, Settings, Calculator } from 'lucide-react';

export default function MatrixCalc() {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<number[][]>([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

  const results = useMemo(() => {
    const m = matrix;
    if (size === 2) {
      const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      const trace = m[0][0] + m[1][1];
      const inverse = det === 0 ? null : [
        [m[1][1]/det, -m[0][1]/det],
        [-m[1][0]/det, m[0][0]/det]
      ];
      return { det, trace, inverse };
    } else {
      const det = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
                  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
                  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      const trace = m[0][0] + m[1][1] + m[2][2];
      return { det, trace, inverse: null };
    }
  }, [matrix, size]);

  const updateVal = (r: number, c: number, v: number) => {
    const newM = [...matrix.map(row => [...row])];
    newM[r][c] = v;
    setMatrix(newM);
  };

  return (
    <>
      <JsonLd type="calculator" name="Matrix Calculator" description="Free online matrix calculator for Add, Determinant, Trace and Inverse operations on 2x2 and 3x3 matrices." url="https://calcpro.com.np/calculator/matrices" />
      
      <CalcWrapper
        title="Matrix Calculator"
        description="Solve complex matrix problems: Calculate Determinants, Trace, and Inverses for 2x2 and 3x3 matrices."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'matrices'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative">
                 <div className="flex bg-google-gray p-1.5 rounded-2xl mb-10 w-48 mx-auto">
                    <button onClick={()=>setSize(2)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${size === 2 ? 'bg-white shadow-sm text-google-blue' : 'text-gray-400'}`}>2 × 2</button>
                    <button onClick={()=>setSize(3)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${size === 3 ? 'bg-white shadow-sm text-google-blue' : 'text-gray-400'}`}>3 × 3</button>
                 </div>

                 <div className={`grid gap-4 max-w-sm mx-auto`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                    {Array.from({length: size}).map((_, r) => (
                      Array.from({length: size}).map((_, c) => (
                        <input key={`${r}-${c}`} type="number" value={matrix[r][c]} onChange={e=>updateVal(r, c, +e.target.value)} className="w-full h-16 bg-gray-50 rounded-2xl text-xl font-bold text-center border-2 border-transparent focus:border-google-blue outline-none transition-all" />
                      ))
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Grid3X3 className="w-20 h-20 group-hover:rotate-12 transition-transform" />
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-gray-400">Results Vector</div>
                 
                 <div className="space-y-6 pb-6 border-b border-white/10">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="opacity-50">Determinant |A|</span>
                       <span className="text-3xl text-google-blue">{results.det}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="opacity-50">Trace tr(A)</span>
                       <span className="text-3xl text-green-500">{results.trace}</span>
                    </div>
                 </div>

                 {size === 2 && results.inverse && (
                   <div className="pt-6">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Inverse Matrix Solution</div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                         {results.inverse.map((row, r) => row.map((v, c) => (
                           <div key={`${r}-${c}`} className="bg-white/5 py-3 rounded-lg text-xs font-mono">{v.toFixed(2)}</div>
                         )))}
                      </div>
                   </div>
                 )}
              </div>
              <ShareResult title="Matrix Solved" result={`Det: ${results.det}`} calcUrl="https://calcpro.com.np/calculator/matrices" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is a determinant?', answer: 'It is a scalar value calculated from a square matrix, representing properties of the transformation it encodes.' },
            { question: 'What is matrix trace?', answer: 'The sum of the elements on the main diagonal (from upper left to lower right) of a square matrix.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
