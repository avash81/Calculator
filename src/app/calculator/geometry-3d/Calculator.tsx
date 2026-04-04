'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { CubeIcon, SphereIcon, ConeIcon, CylinderIcon, PyramidIcon } from '@/components/ui/GeometryIcons';

type Shape = 'sphere'|'cube'|'cylinder'|'cone'|'pyramid'|'capsule'|'torus';

const SHAPES: { id: Shape; label: string; icon: React.ReactNode }[] = [
  { id:'sphere',   label:'Sphere',    icon:<SphereIcon /> },
  { id:'cube',     label:'Box/Cube',  icon:<CubeIcon /> },
  { id:'cylinder', label:'Cylinder',  icon:<CylinderIcon /> },
  { id:'cone',     label:'Cone',      icon:<ConeIcon /> },
  { id:'pyramid',  label:'Pyramid',   icon:<PyramidIcon /> },
  { id:'capsule',  label:'Capsule',   icon:<CylinderIcon /> },
  { id:'torus',    label:'Torus',     icon:<SphereIcon /> },
];

export default function Geometry3D() {
  const [shape, setShape] = useState<Shape>('sphere');
  const [r, setR]           = useState(5);
  const [rMinor, setRMinor] = useState(2);
  const [h, setH]           = useState(10);
  const [l, setL]           = useState(10);
  const [w, setW]           = useState(10);

  const res = useMemo(() => {
    const PI = Math.PI;
    let vol = 0, sa = 0, fV = '', fS = '';
    switch (shape) {
      case 'sphere':   vol=(4/3)*PI*r**3; sa=4*PI*r**2; fV='V = 4/3πr³'; fS='SA = 4πr²'; break;
      case 'cube':     vol=l*w*h; sa=2*(l*w+w*h+h*l); fV='V = l×w×h'; fS='SA = 2(lw+lh+wh)'; break;
      case 'cylinder': vol=PI*r**2*h; sa=2*PI*r*(r+h); fV='V = πr²h'; fS='SA = 2πr(r+h)'; break;
      case 'cone':     { const s=Math.sqrt(r**2+h**2); vol=(1/3)*PI*r**2*h; sa=PI*r*(r+s); fV='V = ⅓πr²h'; fS='SA = πr(r+l)'; break; }
      case 'pyramid':  { const sl=Math.sqrt((w/2)**2+h**2), sw=Math.sqrt((l/2)**2+h**2); vol=l*w*h/3; sa=l*w+l*sl+w*sw; fV='V = (lwh)/3'; fS='SA = B + ½Pl'; break; }
      case 'capsule':  vol=PI*r**2*((4/3)*r+h); sa=2*PI*r*(2*r+h); fV='V = πr²(4r/3+h)'; fS='SA = 2πr(2r+h)'; break;
      case 'torus':    vol=PI*rMinor**2*(2*PI*r); sa=(2*PI*r)*(2*PI*rMinor); fV='V = (πr²)(2πR)'; fS='SA = (2πR)(2πr)'; break;
    }
    return { vol: vol.toFixed(4), sa: sa.toFixed(4), fV, fS };
  }, [shape, r, rMinor, h, l, w]);

  const showR   = ['sphere','cylinder','cone','capsule','torus'].includes(shape);
  const showH   = shape !== 'sphere' && shape !== 'torus';
  const showLW  = shape === 'cube' || shape === 'pyramid';
  const showRm  = shape === 'torus';
  const inputC  = "w-full h-11 px-3 border border-[var(--border)] bg-white font-mono font-bold text-sm focus:border-[var(--primary)] outline-none";

  return (
    <CalculatorLayout
      title="3D Geometry Calculator"
      description="Calculate volume and surface area of 3D shapes: sphere, cube, cylinder, cone, pyramid, capsule, and torus."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Shape</label>
            <div className="grid grid-cols-4 gap-2">
              {SHAPES.map(s => (
                <button key={s.id} onClick={() => setShape(s.id)}
                  className={`py-3 flex flex-col items-center gap-1 border text-center transition-all ${shape===s.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  <span className={`w-5 h-5 ${shape===s.id ? 'text-white' : 'text-[var(--text-muted)]'}`}>{s.icon}</span>
                  <span className="text-[9px] font-black uppercase">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {showR  && <div className="space-y-1"><label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">{shape==='torus'?'Major Radius (R)':'Radius (r)'}</label><input type="number" value={r} onChange={e=>setR(Number(e.target.value))} className={inputC} /></div>}
            {showRm && <div className="space-y-1"><label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Minor Radius (r)</label><input type="number" value={rMinor} onChange={e=>setRMinor(Number(e.target.value))} className={inputC} /></div>}
            {showH  && <div className="space-y-1"><label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Height (h)</label><input type="number" value={h} onChange={e=>setH(Number(e.target.value))} className={inputC} /></div>}
            {showLW && <>
              <div className="space-y-1"><label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Length (l)</label><input type="number" value={l} onChange={e=>setL(Number(e.target.value))} className={inputC} /></div>
              <div className="space-y-1"><label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Width (w)</label><input type="number" value={w} onChange={e=>setW(Number(e.target.value))} className={inputC} /></div>
            </>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white border border-[var(--border)]">
              <div className="text-[9px] font-black uppercase text-[var(--primary)] mb-1">Volume Formula</div>
              <code className="text-[11px] font-mono font-bold text-[var(--text-main)]">{res.fV}</code>
            </div>
            <div className="p-4 bg-white border border-[var(--border)]">
              <div className="text-[9px] font-black uppercase text-[#006600] mb-1">Surface Area Formula</div>
              <code className="text-[11px] font-mono font-bold text-[var(--text-main)]">{res.fS}</code>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Volume</div>
            <div className="text-5xl font-black text-[var(--primary)] tracking-tighter font-mono mb-1">{res.vol}</div>
            <div className="text-xs font-bold text-[var(--text-muted)]">cubic units</div>
          </div>
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Surface Area</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter font-mono mb-1">{res.sa}</div>
            <div className="text-xs font-bold text-[var(--text-muted)]">square units</div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the volume of a sphere?', answer: 'V = (4/3)πr³. For r=5 → V ≈ 523.6 cubic units.' },
          { question: 'What is surface area?', answer: 'The total area of all outer faces of a 3D shape. Measured in square units.' },
          { question: 'What is the difference between volume and capacity?', answer: 'Volume is the 3D space a shape occupies; capacity is how much liquid it can hold. They are numerically equal for containers.' },
        ]} />
      }
    />
  );
}
