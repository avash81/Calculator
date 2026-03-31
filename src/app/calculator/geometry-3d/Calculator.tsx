'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { CubeIcon, SphereIcon, ConeIcon, CylinderIcon, PyramidIcon } from '@/components/ui/GeometryIcons';

type Shape = 'sphere' | 'cube' | 'cylinder' | 'cone' | 'pyramid';

export default function Geometry3D() {
  const [shape, setShape] = useState<Shape>('sphere');
  const [r, setR] = useState(5);
  const [h, setH] = useState(10);
  const [l, setL] = useState(10);
  const [w, setW] = useState(10);

  const res = useMemo(() => {
    let vol = 0; let sa = 0;
    const PI = Math.PI;

    switch (shape) {
      case 'sphere':
        vol = (4/3) * PI * Math.pow(r, 3);
        sa = 4 * PI * Math.pow(r, 2);
        break;
      case 'cube':
        vol = l * w * h;
        sa = 2 * (l*w + w*h + h*l);
        break;
      case 'cylinder':
        vol = PI * Math.pow(r, 2) * h;
        sa = 2 * PI * r * (r + h);
        break;
      case 'cone':
        vol = (1/3) * PI * Math.pow(r, 2) * h;
        const s = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
        sa = PI * r * (r + s);
        break;
      case 'pyramid':
        vol = (l * w * h) / 3;
        const sl = Math.sqrt(Math.pow(w/2, 2) + Math.pow(h, 2));
        const sw = Math.sqrt(Math.pow(l/2, 2) + Math.pow(h, 2));
        sa = l*w + l*sl + w*sw;
        break;
    }
    return { vol: vol.toFixed(2), sa: sa.toFixed(2) };
  }, [shape, r, h, l, w]);

  return (
    <>
      <JsonLd type="calculator" name="Volume & Surface Area Calculator" description="Calculate the volume and surface area of 3D shapes like Sphere, Cube, Cone, and Cylinder." url="https://calcpro.com.np/calculator/geometry-3d" />
      
      <CalcWrapper
        title="3D Geometry (Volume)"
        description="Solve for volume and surface area of standard geometric 3D shapes accurately."
        crumbs={[{label:'education',href:'/calculator/category/education'},{label:'geometry 3d'}]}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8">
           <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                 <div className="grid grid-cols-5 gap-3 mb-10">
                    {[
                      {id:'sphere', icon: <SphereIcon />, l:'Sphere'},
                      {id:'cube', icon: <CubeIcon />, l:'Cube'},
                      {id:'cylinder', icon: <CylinderIcon />, l:'Cylinder'},
                      {id:'cone', icon: <ConeIcon />, l:'Cone'},
                      {id:'pyramid', icon: <PyramidIcon />, l:'Pyramid'},
                    ].map(s => (
                      <button key={s.id} onClick={()=>setShape(s.id as Shape)} className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border-2 ${shape === s.id ? 'bg-blue-50 border-google-blue' : 'border-transparent hover:bg-gray-50 text-gray-400'}`}>
                         <span className={`w-10 h-10 ${shape === s.id ? 'text-google-blue' : 'text-gray-300'}`}>{s.icon}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">{s.l}</span>
                      </button>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(shape === 'sphere' || shape === 'cylinder' || shape === 'cone') && (
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Radius (r)</label>
                         <input type="number" value={r} onChange={e=>setR(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 rounded-2xl font-bold focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                      </div>
                    )}
                    {(shape !== 'sphere') && (
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Height (h)</label>
                         <input type="number" value={h} onChange={e=>setH(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 rounded-2xl font-bold focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                      </div>
                    )}
                    {(shape === 'cube' || shape === 'pyramid') && (
                      <>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Length (l)</label>
                           <input type="number" value={l} onChange={e=>setL(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 rounded-2xl font-bold focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Width (w)</label>
                           <input type="number" value={w} onChange={e=>setW(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 rounded-2xl font-bold focus:border-google-blue outline-none border-2 border-transparent transition-all" />
                        </div>
                      </>
                    )}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-google-blue rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                 <div className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-8">3D Metrics</div>
                 <div className="space-y-8">
                    <div>
                       <div className="text-xs font-bold opacity-50 mb-1">Volume (V)</div>
                       <div className="text-5xl font-black">{res.vol}</div>
                    </div>
                    <div>
                       <div className="text-xs font-bold opacity-50 mb-1">Surface Area (SA)</div>
                       <div className="text-5xl font-black">{res.sa}</div>
                    </div>
                 </div>
              </div>
              <ShareResult title={`Solved ${shape} Geometry`} result={`V: ${res.vol}`} calcUrl="https://calcpro.com.np/calculator/geometry-3d" />
           </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is Volume?', answer: 'The total amount of 3rd spaces an object occupies, measured in cubic units.' },
            { question: 'Sphere Volume Formula?', answer: 'V = (4/3) × π × r³' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
