'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { CubeIcon, SphereIcon, ConeIcon, CylinderIcon, PyramidIcon } from '@/components/ui/GeometryIcons';

type Shape = 'sphere' | 'cube' | 'cylinder' | 'cone' | 'pyramid' | 'capsule' | 'torus';

export default function Geometry3D() {
  const [shape, setShape] = useState<Shape>('sphere');
  const [r, setR] = useState(5);
  const [rMinor, setRMinor] = useState(2); // for Torus
  const [h, setH] = useState(10);
  const [l, setL] = useState(10);
  const [w, setW] = useState(10);

  const res = useMemo(() => {
    let vol = 0; let sa = 0; let formulaV = ''; let formulaS = '';
    const PI = Math.PI;

    switch (shape) {
      case 'sphere':
        vol = (4/3) * PI * Math.pow(r, 3);
        sa = 4 * PI * Math.pow(r, 2);
        formulaV = 'V = 4/3πr³';
        formulaS = 'SA = 4πr²';
        break;
      case 'cube':
        vol = l * w * h;
        sa = 2 * (l*w + w*h + h*l);
        formulaV = 'V = lwb';
        formulaS = 'SA = 2(lw+lh+wh)';
        break;
      case 'cylinder':
        vol = PI * Math.pow(r, 2) * h;
        sa = 2 * PI * r * (r + h);
        formulaV = 'V = πr²h';
        formulaS = 'SA = 2πrh + 2πr²';
        break;
      case 'cone':
        vol = (1/3) * PI * Math.pow(r, 2) * h;
        const s = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
        sa = PI * r * (r + s);
        formulaV = 'V = 1/3πr²h';
        formulaS = 'SA = πrl + πr²';
        break;
      case 'pyramid':
        vol = (l * w * h) / 3;
        const sl = Math.sqrt(Math.pow(w/2, 2) + Math.pow(h, 2));
        const sw = Math.sqrt(Math.pow(l/2, 2) + Math.pow(h, 2));
        sa = l*w + l*sl + w*sw;
        formulaV = 'V = (lwh)/3';
        formulaS = 'SA = B + 1/2Pl';
        break;
      case 'capsule':
        vol = PI * r**2 * ((4/3)*r + h);
        sa = 2*PI*r*(2*r + h);
        formulaV = 'V = πr²(4/3r + h)';
        formulaS = 'SA = 2πr(2r + h)';
        break;
      case 'torus':
        vol = (PI * rMinor**2) * (2 * PI * r);
        sa = (2 * PI * r) * (2 * PI * rMinor);
        formulaV = 'V = (πr²) (2πR)';
        formulaS = 'SA = (2πR) (2πr)';
        break;
    }
    return { vol: vol.toFixed(2), sa: sa.toFixed(2), formulaV, formulaS };
  }, [shape, r, rMinor, h, l, w]);

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
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-10 overflow-x-auto no-scrollbar">
                     {[
                       {id:'sphere', icon: <SphereIcon />, l:'Sphere'},
                       {id:'cube', icon: <CubeIcon />, l:'Rect/Cube'},
                       {id:'cylinder', icon: <CylinderIcon />, l:'Cylinder'},
                       {id:'cone', icon: <ConeIcon />, l:'Cone'},
                       {id:'pyramid', icon: <PyramidIcon />, l:'Pyramid'},
                       {id:'capsule', icon: <CylinderIcon />, l:'Capsule'},
                       {id:'torus', icon: <SphereIcon />, l:'Torus'},
                     ].map(s => (
                       <button key={s.id} onClick={()=>setShape(s.id as Shape)} className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border-2 min-w-[80px] ${shape === s.id ? 'bg-blue-50 border-blue-600 shadow-sm' : 'border-transparent hover:bg-gray-50 text-gray-400'}`}>
                          <span className={`w-8 h-8 ${shape === s.id ? 'text-blue-600' : 'text-gray-300'}`}>{s.icon}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">{s.l}</span>
                       </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {(shape === 'sphere' || shape === 'cylinder' || shape === 'cone' || shape === 'capsule' || shape === 'torus') && (
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{shape === 'torus' ? 'Major Radius (R)' : 'Radius (r)'}</label>
                          <input type="number" value={r} onChange={e=>setR(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold focus:border-blue-600 outline-none border-2 border-transparent transition-all" />
                       </div>
                    )}
                    {shape === 'torus' && (
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Minor Radius (r)</label>
                          <input type="number" value={rMinor} onChange={e=>setRMinor(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold focus:border-blue-600 outline-none border-2 border-transparent transition-all" />
                       </div>
                    )}
                    {(shape !== 'sphere' && shape !== 'torus') && (
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Height (h)</label>
                         <input type="number" value={h} onChange={e=>setH(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold focus:border-blue-600 outline-none border-2 border-transparent transition-all" />
                      </div>
                    )}
                    {(shape === 'cube' || shape === 'pyramid') && (
                      <>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Length (l)</label>
                           <input type="number" value={l} onChange={e=>setL(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold focus:border-blue-600 outline-none border-2 border-transparent transition-all" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Width (w)</label>
                           <input type="number" value={w} onChange={e=>setW(+e.target.value)} className="w-full h-12 px-5 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold focus:border-blue-600 outline-none border-2 border-transparent transition-all" />
                        </div>
                      </>
                    )}
                 </div>

                 <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Geometric Summary</div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <span className="text-[8px] font-black uppercase text-blue-600 mb-1 block">Volume Formula</span>
                          <span className="text-xs font-bold font-mono">{res.formulaV}</span>
                       </div>
                       <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                          <span className="text-[8px] font-black uppercase text-emerald-600 mb-1 block">Surface Area Formula</span>
                          <span className="text-xs font-bold font-mono">{res.formulaS}</span>
                       </div>
                    </div>
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
