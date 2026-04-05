'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Settings2, Activity, History, Calculator as CalcIcon,
  Grid3X3, ArrowRightLeft, Cpu, Sigma, Box
} from 'lucide-react';

// ─── Safe evaluator ───────────────────────────
function safeEval(expr: string): string {
  try {
    const clean = expr
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/π/g, String(Math.PI))
      .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(').replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^2/g, '**2');
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + clean + ')')();
    if (typeof result === 'number' && isFinite(result)) {
      return parseFloat(result.toPrecision(10)).toString();
    }
    return 'Error';
  } catch { return ''; }
}

// ─── Graph plotter ────────────────────────────
function plotGraph(
  canvas: HTMLCanvasElement,
  expr: string,
  result: string,
  historyValues: number[]
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2, scale = 40;

  // Grid
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x < W; x += scale) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y < H; y += scale) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();

  // Axes
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath();
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

  // Axis numbers
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace';
  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    ctx.fillText(String(i), cx + i * scale - 5, cy + 14);
    ctx.fillText(String(-i), cx - 22, cy - i * scale + 4);
  }

  if (!expr) return;

  if (expr.includes('x')) {
    // ── Plot y = f(x) curve ──
    const clean = expr.replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/π/g, String(Math.PI))
      .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(').replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^2/g, '**2');
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3; ctx.beginPath();
    let first = true;
    for (let px = 0; px < W; px++) {
      const x = (px - cx) / scale;
      try {
        // eslint-disable-next-line no-new-func
        const y = Function('"use strict"; const x=' + x + '; return (' + clean + ')')();
        const cy2 = cy - y * scale;
        if (!isFinite(cy2) || cy2 < -H || cy2 > H * 2) { first = true; continue; }
        first ? ctx.moveTo(px, cy2) : ctx.lineTo(px, cy2); first = false;
      } catch { first = true; }
    }
    ctx.stroke();
  } else {
    // ── Connected line chart from history ──
    const currentVal = parseFloat(result);
    const allVals = [...historyValues, ...(isNaN(currentVal) ? [] : [currentVal])];

    if (allVals.length === 0) return;

    // Auto-scale: find min/max to fit chart
    const minV = Math.min(...allVals);
    const maxV = Math.max(...allVals);
    const range = maxV - minV || 1;

    const padding = 60;
    const chartW = W - padding * 2;
    const chartH = H - padding * 2;

    // Compute pixel positions
    const points = allVals.map((v, i) => ({
      x: padding + (allVals.length === 1 ? chartW / 2 : (i / (allVals.length - 1)) * chartW),
      y: padding + chartH - ((v - minV) / range) * chartH,
      v,
    }));

    // Draw connecting pink/salmon line
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Draw navy dots + value labels
    points.forEach((p, i) => {
      // Dot
      ctx.fillStyle = '#1e3a8a';
      ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(30,58,138,0.3)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Value label above dot
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 11px monospace';
      const label = Number.isInteger(p.v) ? String(p.v) : p.v.toFixed(2);
      const lx = Math.max(8, Math.min(W - 40, p.x - ctx.measureText(label).width / 2));
      ctx.fillText(label, lx, p.y - 12);

      // Step label below dot (1, 2, 3…)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('#' + (i + 1), p.x - 6, p.y + 20);
    });

    // Y-axis min/max labels
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px monospace';
    ctx.fillText(maxV.toFixed(1), 4, padding);
    ctx.fillText(minV.toFixed(1), 4, padding + chartH + 4);
  }
}

// ─── Mode content panels (Engineering / PhD level) ────────────────────────
type ModeEntry = [string, string]; // [value, label]

function ModeSection({ title, items, color, onInsert }: {
  title: string; items: ModeEntry[]; color: string; onInsert: (v: string) => void;
}) {
  return (
    <div>
      <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${color}`}>{title}</p>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {items.map(([v, label]) => (
          <button key={v} onClick={() => onInsert(v)}
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all hover:brightness-95 active:scale-95 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700 leading-tight">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModePanel({ mode, onInsert }: { mode: string; onInsert: (v: string) => void }) {
  const scrollCls = "p-4 max-h-[380px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-200";

  if (mode === 'CONST') return (
    <div className={scrollCls}>
      <ModeSection title="⚛ Fundamental" color="text-slate-600" onInsert={onInsert} items={[
        ['3.14159265358979', 'π (Pi)'],
        ['2.71828182845904', 'e (Euler)'],
        ['1.61803398874989', 'φ (Golden Ratio)'],
        ['1.41421356237310', '√2 (Pythagoras)'],
        ['0.5772156649015', 'γ (Euler-Masch.)'],
        ['6.28318530717959', '2π (Tau)'],
      ]} />
      <ModeSection title="🔬 Physics (SI)" color="text-blue-600" onInsert={onInsert} items={[
        ['299792458', 'c — Speed of Light'],
        ['6.67430e-11', 'G — Gravity const.'],
        ['9.80665', 'g — Std. Gravity m/s²'],
        ['6.62607015e-34', 'h — Planck const.'],
        ['1.054571817e-34', 'ℏ — Reduced Planck'],
        ['1.380649e-23', 'kB — Boltzmann'],
        ['6.02214076e23', 'NA — Avogadro'],
        ['8.314462618', 'R — Gas constant'],
        ['5.670374419e-8', 'σ — Stefan-Boltzmann'],
        ['1.380649e-23', 'k — Boltzmann'],
      ]} />
      <ModeSection title="⚡ Electromagnetic" color="text-yellow-600" onInsert={onInsert} items={[
        ['1.602176634e-19', 'e — Electron charge'],
        ['9.1093837015e-31', 'me — Electron mass'],
        ['1.67262192369e-27', 'mp — Proton mass'],
        ['8.8541878128e-12', 'ε₀ — Permittivity'],
        ['1.25663706212e-6', 'μ₀ — Permeability'],
        ['6.957e8', 'R☉ — Sun radius'],
      ]} />
      <ModeSection title="🔭 Quantum / Atomic" color="text-purple-600" onInsert={onInsert} items={[
        ['0.0000000529177', 'a₀ — Bohr radius'],
        ['137.035999084', 'α — Fine structure'],
        ['2.8179403227e-15', 're — Electron radius'],
        ['1836.15267343', 'mp/me mass ratio'],
        ['13.605693122994', 'Ry — Rydberg eV'],
        ['2.179872361e-18', 'Ry — Rydberg J'],
      ]} />
      <ModeSection title="🌐 Astronomy" color="text-indigo-600" onInsert={onInsert} items={[
        ['1.496e11', 'AU — Astro Unit (m)'],
        ['9.461e15', 'ly — Light Year (m)'],
        ['3.086e16', 'pc — Parsec (m)'],
        ['5.972e24', 'M⊕ — Earth mass'],
        ['1.989e30', 'M☉ — Sun mass'],
        ['6.371e6', 'R⊕ — Earth radius'],
      ]} />
    </div>
  );

  if (mode === 'BASE') return (
    <div className={scrollCls}>
      <ModeSection title="🔢 Binary" color="text-green-600" onInsert={onInsert} items={[
        ['0b1010', 'BIN: 1010 = 10'],
        ['0b11111111', 'BIN: 11111111 = 255'],
        ['0b1000000000', 'BIN: 2^9 = 512'],
        ['0b10000000', 'BIN: 128'],
      ]} />
      <ModeSection title="🔣 Hexadecimal" color="text-green-600" onInsert={onInsert} items={[
        ['0xFF', 'HEX: FF = 255'],
        ['0x1A4', 'HEX: 1A4 = 420'],
        ['0xDEAD', 'HEX: DEAD = 57005'],
        ['0x100', 'HEX: 100 = 256'],
      ]} />
      <ModeSection title="🔠 Octal" color="text-green-600" onInsert={onInsert} items={[
        ['0o17', 'OCT: 17 = 15'],
        ['0o377', 'OCT: 377 = 255'],
        ['0o777', 'OCT: 777 = 511'],
        ['0o10', 'OCT: 10 = 8'],
      ]} />
      <ModeSection title="🔁 Bitwise Ops" color="text-green-600" onInsert={onInsert} items={[
        ['12 & 10', 'AND: 12 & 10 = 8'],
        ['12 | 10', 'OR: 12 | 10 = 14'],
        ['12 ^ 10', 'XOR: 12 ^ 10 = 6'],
        ['~0', 'NOT: ~0 = -1'],
        ['1 << 4', 'SHIFT LEFT: 16'],
        ['256 >> 2', 'SHIFT RIGHT: 64'],
      ]} />
    </div>
  );

  if (mode === 'MATRIX') return (
    <div className={scrollCls}>
      <ModeSection title="📐 2×2 Operations" color="text-orange-600" onInsert={onInsert} items={[
        ['1*4 - 2*3', 'Det 2×2 [1,2|3,4]'],
        ['(1+4)', 'Trace [1,2|3,4]'],
        ['sqrt(1^2+2^2+3^2+4^2)', 'Frobenius Norm'],
        ['(1*4-2*3)/(1*4-2*3)', 'Identity Check'],
      ]} />
      <ModeSection title="📊 Eigenvalue (2×2)" color="text-orange-600" onInsert={onInsert} items={[
        ['((1+4)+sqrt((1+4)^2-4*(1*4-2*3)))/2', 'λ₁ max'],
        ['((1+4)-sqrt((1+4)^2-4*(1*4-2*3)))/2', 'λ₂ min'],
        ['1+4', 'Tr(A) = λ₁+λ₂'],
        ['1*4-2*3', 'Det(A) = λ₁×λ₂'],
      ]} />
      <ModeSection title="📏 Vector / Norm" color="text-orange-600" onInsert={onInsert} items={[
        ['sqrt(3^2+4^2)', 'L2 Norm (3,4)'],
        ['sqrt(1^2+1^2+1^2)', 'Unit Diagonal'],
        ['abs(3)+abs(-4)', 'L1 Norm (3,−4)'],
        ['max(3,4)', 'L∞ Norm'],
      ]} />
      <ModeSection title="🔄 Transforms" color="text-orange-600" onInsert={onInsert} items={[
        ['(1/(1-0.99^2))', 'Lorentz γ (v=0.99c)'],
        ['sqrt(2)*3.14159/4', '45° rotation scale'],
        ['cos(3.14159/4)', 'cos(45°)'],
        ['sin(3.14159/6)', 'sin(30°)'],
      ]} />
    </div>
  );

  if (mode === 'VECTOR') return (
    <div className={scrollCls}>
      <ModeSection title="📍 Magnitude & Norm" color="text-purple-600" onInsert={onInsert} items={[
        ['sqrt(3^2+4^2)', '|v| 2D (3,4)=5'],
        ['sqrt(1^2+2^2+2^2)', '|v| 3D (1,2,2)=3'],
        ['sqrt(2^2+3^2+6^2)', '|v| 3D (2,3,6)=7'],
        ['sqrt(4^2+3^2+0^2)', '|v| 3D (4,3,0)=5'],
      ]} />
      <ModeSection title="🔁 Dot Product" color="text-purple-600" onInsert={onInsert} items={[
        ['1*4+2*5+3*6', 'v·w (1,2,3)·(4,5,6)'],
        ['2*1+3*0', 'v·w (2,3)·(1,0)'],
        ['1*0+0*1', 'v·w perpendicular'],
        ['3*3+4*4', 'v·v = |v|²'],
      ]} />
      <ModeSection title="📐 Angle Between" color="text-purple-600" onInsert={onInsert} items={[
        ['(1*4+2*5+3*6)/(sqrt(1^2+2^2+3^2)*sqrt(4^2+5^2+6^2))', 'cos θ (1,2,3)·(4,5,6)'],
        ['(3*5+4*0)/(5*5)', 'cos θ (3,4),(5,0)'],
        ['1/(sqrt(2)*sqrt(2))', 'cos 60°'],
        ['0', 'cos 90° (perpendicular)'],
      ]} />
      <ModeSection title="✖ Cross Product |·|" color="text-purple-600" onInsert={onInsert} items={[
        ['sqrt((2*6-3*5)^2+(3*4-1*6)^2+(1*5-2*4)^2)', '|a×b| (1,2,3)×(4,5,6)'],
        ['sqrt(1^2+(-2)^2+1^2)', '|a×b| (1,0,1)×(0,1,1)'],
        ['2*6-3*5', 'i component'],
        ['3*4-1*6', 'j component'],
      ]} />
      <ModeSection title="🎯 Projection" color="text-purple-600" onInsert={onInsert} items={[
        ['(1*4+2*5+3*6)/(4^2+5^2+6^2)', 'scalar proj'],
        ['(3*5+4*0)/25', 'proj₍₅,₀₎(3,4)'],
        ['(1*2+1*2)/(2^2+2^2)', 'proj (1,1) on (2,2)'],
        ['(1*0+0*1)/(1)', 'proj orthogonal=0'],
      ]} />
    </div>
  );

  if (mode === 'EQ') return (
    <div className={scrollCls}>
      <ModeSection title="📐 Quadratic ax²+bx+c=0" color="text-red-600" onInsert={onInsert} items={[
        ['(-2+sqrt(4-4*1*(-8)))/(2*1)', 'x [a=1,b=-2,c=-8]'],
        ['(-3+sqrt(9-4*1*2))/(2*1)', 'x₁ [a=1,b=3,c=2]'],
        ['(-3-sqrt(9-4*1*2))/(2*1)', 'x₂ [a=1,b=3,c=2]'],
        ['sqrt(9-4*1*2)', 'Discriminant'],
      ]} />
      <ModeSection title="📊 Polynomial" color="text-red-600" onInsert={onInsert} items={[
        ['2^3-3*2^2+4', 'p(2) for x³-3x²+4'],
        ['3^3-2*3^2-5*3+6', 'p(3) for x³-2x²-5x+6'],
        ['(-1)^4+(-1)^3-(-1)^2+1', 'p(-1) for x⁴+x³-x²+1'],
        ['1/3*x^3', '∫x² dx (symbolic)'],
      ]} />
      <ModeSection title="🔢 Number Theory" color="text-red-600" onInsert={onInsert} items={[
        ['12*8-11*7', 'Bezout (12,8): gcd=4'],
        ['2^7-1', 'Mersenne M7=127'],
        ['2^13-1', 'Mersenne M13=8191'],
        ['720', '6! (Factorial 6)'],
        ['3628800', '10! (Factorial 10)'],
        ['40320', '8! (Factorial 8)'],
      ]} />
      <ModeSection title="🧮 Series & Limits" color="text-red-600" onInsert={onInsert} items={[
        ['1+1/2+1/4+1/8+1/16', 'Geometric S5 (r=½)'],
        ['1-1/3+1/5-1/7+1/9', 'Leibniz π/4 approx'],
        ['1+1+1/2+1/6+1/24+1/120', 'e = Σ1/n! approx'],
        ['(1+1/1000)^1000', 'e approx (1+1/n)^n'],
      ]} />
    </div>
  );

  if (mode === 'UNITS') return (
    <div className={scrollCls}>
      <ModeSection title="📏 Length" color="text-teal-600" onInsert={onInsert} items={[
        ['1*1.60934', '1 mile → km'],
        ['1/0.3048', '1 m → feet'],
        ['1*2.54', '1 in → cm'],
        ['1*1609.34', '1 mi → m'],
        ['1*0.000621371', '1 m → miles'],
        ['1*3.28084', '1 m → feet'],
      ]} />
      <ModeSection title="⚖ Mass & Weight" color="text-teal-600" onInsert={onInsert} items={[
        ['1/2.20462', '1 lb → kg'],
        ['1*2.20462', '1 kg → lb'],
        ['1*1000', '1 metric ton → kg'],
        ['1*0.0353', '1 g → oz'],
        ['1*28.3495', '1 oz → g'],
        ['1*14.5939', '1 slug → kg'],
      ]} />
      <ModeSection title="🌡 Temperature" color="text-teal-600" onInsert={onInsert} items={[
        ['37*9/5+32', '37°C → °F'],
        ['(98.6-32)*5/9', '98.6°F → °C'],
        ['273.15+25', '25°C → K'],
        ['5778', 'Sun surface K'],
        ['(-40)*9/5+32', '-40°C = -40°F'],
        ['0*9/5+32', '0°C → 32°F'],
      ]} />
      <ModeSection title="⚡ Energy / Power" color="text-teal-600" onInsert={onInsert} items={[
        ['1*3600000', '1 kWh → J'],
        ['1/4.184', '1 J → cal'],
        ['1*4.184', '1 cal → J'],
        ['1*1055.06', '1 BTU → J'],
        ['1*745.7', '1 HP → W'],
        ['1*1e6', '1 MW → W'],
      ]} />
      <ModeSection title="🌍 Area & Volume" color="text-teal-600" onInsert={onInsert} items={[
        ['1*10000', '1 ha → m²'],
        ['1*2.471', '1 ha → acres'],
        ['1*0.000001', '1 cm³ → L? (1mL)'],
        ['1*3.78541', '1 gal (US) → L'],
        ['1*0.0929', '1 ft² → m²'],
        ['1*1609.34^2', '1 mi² → m²'],
      ]} />
    </div>
  );

  if (mode === 'STATS') return (
    <div className={scrollCls}>
      <ModeSection title="📊 Descriptive Stats" color="text-pink-600" onInsert={onInsert} items={[
        ['(10+20+30+40+50)/5', 'Mean (10,20,30,40,50)'],
        ['sqrt(((10-30)^2+(20-30)^2+(30-30)^2+(40-30)^2+(50-30)^2)/5)', 'Pop. Std Dev'],
        ['sqrt(((10-30)^2+(20-30)^2+(30-30)^2+(40-30)^2+(50-30)^2)/4)', 'Sample Std Dev'],
        ['((10-30)^2+(20-30)^2+(30-30)^2+(40-30)^2+(50-30)^2)/5', 'Variance'],
        ['50-10', 'Range (10..50)'],
        ['(10+50)/2', 'Midrange'],
      ]} />
      <ModeSection title="📈 Probability" color="text-pink-600" onInsert={onInsert} items={[
        ['(1/(sqrt(2*3.14159)))*2.71828^(-0.5)', 'Normal PDF (x=1)'],
        ['1-2.71828^(-1)', 'P(X≤1) Exp(λ=1)'],
        ['1-(1-0.01)^100', 'P(≥1 event) 100 trials'],
        ['2.71828^(-3)*3^4/24', 'Poisson P(X=4,λ=3)'],
        ['0.5*(1+0.6827)', 'P within 1σ'],
        ['10/(10+5)', 'Bayes posterior'],
      ]} />
      <ModeSection title="🧪 Hypothesis Testing" color="text-pink-600" onInsert={onInsert} items={[
        ['(50-45)/(10/sqrt(25))', 'z-score test stat'],
        ['(102-100)/(15/sqrt(30))', 't df=29 test'],
        ['1.96*15/sqrt(100)', '95% CI margin'],
        ['2.576*15/sqrt(100)', '99% CI margin'],
        ['1-0.05/2', 'α/2 two-tailed 5%'],
        ['((30-25)^2/25)', 'χ² one cell'],
      ]} />
      <ModeSection title="📉 Regression" color="text-pink-600" onInsert={onInsert} items={[
        ['(5*190-10*80)/(5*22-10^2/5)', 'Slope (least sq.)'],
        ['(80-1.4*10)/5', 'Intercept'],
        ['0.95^2', 'R² = 0.9025'],
        ['1-((1-0.95^2)*(5-1))/(5-2)', 'Adj. R²'],
        ['sqrt(1-0.95^2)', 'Standard error r'],
        ['0.95*sqrt(5-2)/sqrt(1-0.95^2)', 't-stat for r'],
      ]} />
    </div>
  );

  // CALC — no extra panel, keypad handles it
  return null;
}

// ─── Main Component ───────────────────────────

export default function AllInOneCalculator() {
  const [mode, setMode] = useState('CALC');
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<{ exp: string; res: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!expression) { setDisplay('0'); return; }
    const res = safeEval(expression);
    if (res !== '') setDisplay(res);
  }, [expression]);

  useEffect(() => {
    const historyNums = history.map(h => parseFloat(h.res)).filter(v => isFinite(v));
    if (canvasRef.current) plotGraph(canvasRef.current, expression, display, historyNums);
  }, [expression, display, history]);

  const press = (k: string) => {
    if (k === 'DEL') { setExpression(p => p.slice(0, -1)); return; }
    if (k === 'AC') {
      if (expression && display !== '0') setHistory(p => [{ exp: expression, res: display }, ...p].slice(0, 8));
      setExpression(''); setDisplay('0'); return;
    }
    if (k === '=') {
      const res = safeEval(expression);
      if (res && res !== 'Error') { setHistory(p => [{ exp: expression, res }, ...p].slice(0, 8)); setExpression(res); }
      return;
    }
    setExpression(p => p + k);
  };

  const insertText = (v: string) => { setExpression(v); };

  const modes = [
    { id: 'CALC', label: 'CALCULATE', icon: CalcIcon, color: '#2563eb' },
    { id: 'BASE', label: 'BASE-N', icon: Cpu, color: '#16a34a' },
    { id: 'MATRIX', label: 'MATRIX', icon: Grid3X3, color: '#ea580c' },
    { id: 'VECTOR', label: 'VECTOR', icon: Box, color: '#9333ea' },
    { id: 'EQ', label: 'EQUATION', icon: Sigma, color: '#dc2626' },
    { id: 'UNITS', label: 'UNITS', icon: ArrowRightLeft, color: '#0d9488' },
    { id: 'CONST', label: 'CONSTANTS', icon: Settings2, color: '#64748b' },
    { id: 'STATS', label: 'STATISTICS', icon: Activity, color: '#db2777' },
  ];

  const fnKeys = ['sin(', 'cos(', 'tan(', '√', 'x²', 'π', 'x', 'DEL'];
  const numKeys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '(', ')', '+', '='];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT: Calculator ── */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-4">

          {/* Device shell */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Calcly Ultimate</span>
              <div className="flex gap-2 items-center text-[10px] font-mono text-slate-400">
                <span>D</span><span>R</span><span className="font-black text-slate-600">FIX</span>
              </div>
            </div>

            {/* LCD Display */}
            <div className="mx-4 mb-3 bg-slate-100 rounded-2xl px-5 py-4 min-h-[80px] flex flex-col justify-end border border-slate-200">
              <div className="text-[11px] text-slate-400 font-mono truncate mb-1 min-h-[16px]">
                {expression || (mode !== 'CALC' ? `${mode} MODE — Select below` : 'Main Menu — Select Mode')}
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight leading-none text-right">{display}</div>
            </div>

            {/* Mode grid — 4×2 */}
            <div className="grid grid-cols-4 gap-2 px-4 pb-4">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all active:scale-95 ${
                    mode === m.id
                      ? 'bg-white border-slate-300 shadow-md ring-2 ring-blue-100'
                      : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'
                  }`}
                >
                  <m.icon size={22} style={{ color: m.color }} strokeWidth={2} />
                  <span className="text-[8px] font-bold uppercase text-slate-500 tracking-tight leading-none text-center">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Mode-specific panel (shown when not in CALC mode) */}
            {mode !== 'CALC' && (
              <div className="border-t border-slate-100">
                <ModePanel mode={mode} onInsert={insertText} />
              </div>
            )}
          </div>

          {/* Scientific keypad */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-4 flex flex-col gap-2">
            {/* Functions */}
            <div className="grid grid-cols-4 gap-2">
              {fnKeys.map(k => (
                <button key={k}
                  onClick={() => press(k === '√' ? 'sqrt(' : k === 'x²' ? '^2' : k === 'π' ? 'π' : k)}
                  className={`h-11 rounded-xl text-[12px] font-bold transition-all active:scale-90 border ${
                    k === 'DEL'
                      ? 'bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}>
                  {k}
                </button>
              ))}
            </div>
            {/* Numbers + operators */}
            <div className="grid grid-cols-4 gap-2">
              {numKeys.map(k => (
                <button key={k} onClick={() => press(k)}
                  className={`h-12 rounded-xl text-[15px] font-bold transition-all active:scale-90 border ${
                    k === '='
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      : /[0-9.]/.test(k)
                        ? 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}>
                  {k}
                </button>
              ))}
            </div>
            {/* AC */}
            <button onClick={() => press('AC')}
              className="w-full h-11 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-all tracking-widest">
              AC — Clear All
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <History size={13} /> History
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} onClick={() => setExpression(h.res)}
                    className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                    <span className="text-[11px] text-slate-400 font-mono truncate flex-1">{h.exp}</span>
                    <span className="text-[13px] font-black text-slate-800 ml-2">{h.res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Graph ── */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden min-h-[520px]">
          {/* Graph header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">Visual Graph</span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono uppercase">
              {expression.includes('x') ? 'y = f(x) curve' : 'Number Line'}
            </span>
          </div>

          {/* Hint */}
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[11px] text-slate-400">
              Tip: use <code className="bg-white border border-slate-200 px-1 rounded text-slate-600 font-mono">x</code> in your expression to plot a curve — e.g. <code className="bg-white border border-slate-200 px-1 rounded text-slate-600 font-mono">sin(x)</code>
            </p>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <canvas ref={canvasRef} width={900} height={600} className="w-full h-full" />
            {!expression && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <CalcIcon size={36} className="text-slate-200 mb-3" />
                <p className="text-slate-300 text-sm text-center font-medium">
                  Start typing to see results<br />
                  <span className="text-xs">Enter <span className="font-mono">sin(x)</span> to plot a wave</span>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
