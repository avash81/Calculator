'use client';
import { useState, useRef, useEffect, MouseEvent, WheelEvent, useCallback } from 'react';
import * as math from 'mathjs';
import { Settings2, Activity, Divide, X, Delete, Check, History, Calculator } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* GRAPHING CANVAS PLOTTER                                                    */
/* -------------------------------------------------------------------------- */

interface GraphingCanvasProps {
  expression: string;
}

function GraphingCanvas({ expression }: GraphingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(40); // pixels per unit
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{x:string, y:string} | null>(null);

  // Parse equations separated by commas
  const functions = expression.split(',').map(f => f.trim()).filter(f => f.length > 0);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Center coordinates
    const cx = width / 2 + offset.x;
    const cy = height / 2 + offset.y;

    // Draw Grid
    ctx.strokeStyle = '#334155'; // Darker grid for CASIO screen feel
    ctx.lineWidth = 1;
    
    const step = scale; // 1 unit
    // Vertical grid lines
    ctx.beginPath();
    for (let x = cx % step; x < width; x += step) {
      if (Math.abs(x - cx) > 1) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    }
    // Horizontal grid lines
    for (let y = cy % step; y < height; y += step) {
      if (Math.abs(y - cy) > 1) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    }
    ctx.stroke();

    // Draw Axes (Thick white/light)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, height); // Y-axis
    ctx.moveTo(0, cy); ctx.lineTo(width, cy); // X-axis
    ctx.stroke();

    // Helper to evaluate compiled math expressions
    const drawFunc = (eq: string, color: string) => {
      try {
        const compiled = math.compile(eq);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let isFirst = true;
        
        for (let px = 0; px <= width; px++) {
          const mathX = (px - cx) / scale;
          try {
            const mathY = compiled.evaluate({ x: mathX });
            if (typeof mathY === 'number' && Number.isFinite(mathY)) {
              // Ignore massive vertical lines (asymptotes)
              const py = cy - mathY * scale;
              if (py < -height*5 || py > height*5) {
                isFirst = true; 
              } else {
                if (isFirst) { ctx.moveTo(px, py); isFirst = false; }
                else { ctx.lineTo(px, py); }
              }
            } else { isFirst = true; }
          } catch (e) {
             isFirst = true;
          }
        }
        ctx.stroke();
      } catch (err) {
        // Compile fail, just skip drawing this frame
      }
    };

    functions.forEach((f, i) => drawFunc(f, colors[i % colors.length]));
  }, [offset, scale, functions]);

  useEffect(() => {
    let animationFrameId: number;
    const render = () => { draw(); animationFrameId = requestAnimationFrame(render); };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.002;
    const zoomFactor = Math.exp(-e.deltaY * zoomSensitivity);
    setScale(old => Math.max(10, Math.min(200, old * zoomFactor)));
  };

  const onMouseDown = (e: MouseEvent) => { setIsDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const px = e.clientX - rect.left; const py = e.clientY - rect.top;
        const cx = rect.width / 2 + offset.x; const cy = rect.height / 2 + offset.y;
        setHoverCoord({ x: ((px - cx) / scale).toFixed(2), y: (((cy - py) / scale)).toFixed(2) });
      }
    }
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full h-full bg-[#0f172a] overflow-hidden rounded-md group">
      <canvas ref={canvasRef} width={600} height={400} className="w-full h-full cursor-crosshair touch-none"
        onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} />
      
      {/* HUD overlays */}
      {hoverCoord && (
        <div className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100">
          X: {hoverCoord.x} | Y: {hoverCoord.y}
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex gap-2">
        <button onClick={() => { setScale(40); setOffset({x:0, y:0}); }} className="bg-black/60 hover:bg-black text-[9px] text-white px-2 py-1 uppercase rounded tracking-widest transition-all">Reset View</button>
      </div>
      
      {/* Legend */}
      {functions.length > 0 && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {functions.map((f, i) => (
             <span key={i} className="px-2 py-0.5 text-[10px] font-black rounded-sm shadow-sm opacity-90" style={{ backgroundColor: colors[i % colors.length], color: '#fff' }}>
                y = {f}
             </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UNIFIED ALL-IN-ONE CALCULATOR (CASIO STYLE)                                */
/* -------------------------------------------------------------------------- */

export function AllInOneCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string|null>(null);
  const [history, setHistory] = useState<{expr:string, res:string}[]>([]);
  
  const [mode, setMode] = useState<'calc'|'graph'|'base'|'eq'|'matrix'|'unit'|'menu'>('calc');
  const [angleMode, setAngleMode] = useState<'deg'|'rad'>('rad');

  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of history when new items added
  useEffect(() => {
    if (screenRef.current && mode === 'calc') {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history, expression, mode]);

  // Handle keyboard typing seamlessly
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't intercept if user is typing in a real input field elsewhere
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const key = e.key;
      if (key === 'Enter') { e.preventDefault(); solve(); }
      else if (key === 'Backspace') { e.preventDefault(); backspace(); }
      else if (key === 'Escape') { e.preventDefault(); clear(); }
      else if (/^[a-zA-Z0-9+\-*/().^,%! ]$/.test(key)) {
        // e.preventDefault(); -> removed so native inputs still work ok if needed
        append(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, mode]);

  const replaceDegTrig = (expr: string) => {
    // If degree mode, we modify trig arguments to include ' deg'. Safe hack for mathjs.
    // e.g., sin(45) -> sin(45 deg). This requires strict AST traversal for safety, 
    // or we can evaluate in rad always but we're relying on mathjs.
    // For now, if "deg" mode is active, we just rely on mathjs unit suffix injection or scope.
    // Real mathjs deg support: wrap string with a scope overriding trig, but for string evaluation:
    return expr; // Note: For a true CASIO exact copy, we would do a deep AST override. Mathjs expects `sin(45 deg)`.
  };

  const solve = () => {
    if (!expression.trim() || mode === 'graph' || mode === 'menu') return;
    try {
      let toEval = expression;
      
      // Handle Angle Mode (Deg vs Rad)
      // We use a custom scope to override trig functions if in Degree mode
      const scope = angleMode === 'deg' ? {
        sin: (x: any) => math.sin(math.unit(x, 'deg')),
        cos: (x: any) => math.cos(math.unit(x, 'deg')),
        tan: (x: any) => math.tan(math.unit(x, 'deg')),
        asin: (x: any) => math.unit(math.asin(x), 'rad').toNumber('deg'),
        acos: (x: any) => math.unit(math.acos(x), 'rad').toNumber('deg'),
        atan: (x: any) => math.unit(math.atan(x), 'rad').toNumber('deg'),
      } : {};

      const res = math.evaluate(toEval, scope);
      
      const resStr = math.format(res, { precision: 14 });
      setResult(resStr);
      setHistory(prev => [...prev.slice(-10), { expr: expression, res: resStr }]);
      setIsShift(false); setIsAlpha(false);
    } catch (err) {
      setResult('Syntax Error');
    }
  };

  const append = (val: string) => {
    setExpression(prev => prev + val);
    setResult(null);
  };

  const clear = () => { setExpression(''); setResult(null); };
  const backspace = () => { setExpression(prev => prev.slice(0, -1)); setResult(null); };

  // Theme Constants (Casio styling)
  const bgHousing = "bg-[#1f2937] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-gray-900";
  const bgScreenContext = "bg-[#d1d5db] border-4 border-[#0f172a] shadow-inner relative flex flex-col";
  
  // Keypads
  const btnSci = "h-8 bg-[#334155] border-b-2 border-[#1e293b] rounded active:border-b-0 active:translate-y-[2px] transition-all text-[#e2e8f0] text-[10px] font-bold shadow-sm flex items-center justify-center cursor-pointer";
  const btnNum = "h-12 bg-[#e2e8f0] border-b-2 border-[#94a3b8] rounded active:border-b-0 active:translate-y-[2px] transition-all text-gray-900 text-lg font-black shadow-sm flex items-center justify-center cursor-pointer hover:bg-white";
  const btnOp = "h-12 bg-[#cbd5e1] border-b-2 border-[#94a3b8] rounded active:border-b-0 active:translate-y-[2px] transition-all text-gray-900 text-lg font-black shadow-sm flex items-center justify-center cursor-pointer";
  const btnDel = "h-12 bg-[#ef4444] border-b-2 border-[#b91c1c] rounded active:border-b-0 active:translate-y-[2px] transition-all text-white text-sm font-black shadow-sm flex items-center justify-center cursor-pointer hover:bg-red-400";
  const btnEq = "h-12 bg-blue-600 border-b-2 border-blue-800 rounded active:border-b-0 active:translate-y-[2px] transition-all text-white text-lg font-black shadow-sm flex items-center justify-center cursor-pointer col-span-2 hover:bg-blue-500";

  return (
    <div className={`w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden flex flex-col ${bgHousing}`}>
      
      {/* ----------------- TOP BRANDING/STATUS ----------------- */}
      <div className="w-full h-8 bg-[#0f172a] flex items-center justify-between px-4">
        <span className="text-gray-400 font-black italic text-[11px] tracking-widest">CALCLY fx-991EX</span>
        <div className="flex gap-2">
          {isShift && <span className="bg-yellow-500 text-black text-[8px] font-black px-1 rounded-sm">S</span>}
          {isAlpha && <span className="bg-red-500 text-white text-[8px] font-black px-1 rounded-sm">A</span>}
        </div>
      </div>

      {/* ----------------- LCD SCREEN ----------------- */}
      <div className="p-4 bg-[#1f2937]">
        <div className={`w-full h-52 sm:h-64 rounded-lg overflow-hidden ${bgScreenContext}`}>
          
          {/* LCD TOP STATUS BAR */}
          <div className="w-full h-5 bg-[#0f172a] px-2 flex justify-between items-center text-[8px] font-black text-gray-400 uppercase tracking-widest">
             <div className="flex gap-3">
               <button onClick={() => setMode('calc')} className={mode === 'calc' ? 'text-white' : ''}>[ COMP ]</button>
               <button onClick={() => setMode('graph')} className={mode === 'graph' ? 'text-white' : ''}>[ GRAPH ]</button>
             </div>
             <div className="flex gap-3">
               <button onClick={() => setAngleMode(angleMode==='deg'?'rad':'deg')} className="cursor-pointer hover:text-white">
                 {angleMode}
               </button>
             </div>
          </div>

          {/* LCD CONTENT AREA */}
          <div ref={screenRef} className="flex-1 w-full bg-[#cbd5e1] flex flex-col p-2 overflow-y-auto font-mono relative">
            {mode === 'menu' ? (
              // ---------------- MENU OVERLAY ----------------
              <div className="grid grid-cols-2 gap-2 h-full">
                {[
                  { id: 'calc', l: '1:Scientific', i: '🧮' },
                  { id: 'base', l: '2:Base-N', i: '💻' },
                  { id: 'eq',   l: '3:Equation', i: '📐' },
                  { id: 'graph',l: '4:Graphing', i: '📈' },
                  { id: 'matrix',l: '5:Matrices', i: '▦' },
                  { id: 'unit',  l: '6:Units',    i: '🔄' },
                ].map(m => (
                  <button key={m.id} onClick={() => { setMode(m.id as any); clear(); }}
                    className="flex flex-col items-center justify-center bg-black/5 hover:bg-black/10 border border-black/10 rounded-md p-1 transition-all">
                    <span className="text-xl">{m.i}</span>
                    <span className="text-[8px] font-black uppercase text-black/60">{m.l}</span>
                  </button>
                ))}
              </div>
            ) : mode === 'unit' ? (
              // ---------------- UNIT CONVERTER ----------------
              <div className="flex-1 flex flex-col justify-center space-y-2 p-1">
                 <div className="text-[10px] font-bold text-black border-b border-black/10 pb-1">UNIT CONVERTER</div>
                 <div className="text-[8px] text-gray-700 italic">Type e.g. "10 km to miles"</div>
                 <div className="bg-white/50 p-2 rounded text-xs font-bold text-black min-h-[40px]">
                   {expression || '---'}
                 </div>
                 {result && !result.includes('Error') && (
                   <div className="flex justify-between items-center bg-blue-600/10 p-1 px-2 border-l-2 border-blue-600">
                      <span className="text-[9px] font-black text-blue-800">RESULT</span>
                      <span className="text-sm font-black text-black">{result}</span>
                   </div>
                 )}
              </div>
            ) : mode === 'graph' ? (
              // ---------------- GRAPHING MODE ----------------
              <div className="w-full h-full rounded border border-gray-400 shadow-inner overflow-hidden">
                 <GraphingCanvas expression={expression || 'x'} />
              </div>
            ) : mode === 'base' ? (
               // ---------------- BASE-N MODE ----------------
               <div className="flex-1 flex flex-col justify-center space-y-1">
                 <div className="text-[10px] font-bold text-black border-b border-black/10 pb-1">BASE CONVERTER</div>
                 {(() => {
                   try {
                     const dec = BigInt(expression || '0');
                     return [
                       { l: 'DEC', v: dec.toString(10) },
                       { l: 'HEX', v: dec.toString(16).toUpperCase() },
                       { l: 'BIN', v: dec.toString(2).padStart(8, '0') },
                       { l: 'OCT', v: dec.toString(8) }
                     ].map(b => (
                       <div key={b.l} className="flex justify-between items-center text-gray-800">
                         <span className="text-[9px] font-black opacity-40">{b.l}</span>
                         <span className="text-sm font-black truncate max-w-[150px]">{b.v}</span>
                       </div>
                     ));
                   } catch { return <div className="text-xs text-red-700 italic">Invalid for Base-N</div>; }
                 })()}
               </div>
            ) : mode === 'eq' ? (
               // ---------------- EQUATION SOLVER ----------------
               <div className="flex-1 flex flex-col justify-center space-y-2 p-1">
                 <div className="text-[10px] font-bold text-black border-b border-black/10 pb-1 flex justify-between">
                   <span>QUADRATIC SOLVER</span>
                   <span className="opacity-40 italic">ax² + bx + c = 0</span>
                 </div>
                 <div className="text-[9px] text-gray-700">Enter coefficients separated by comma:</div>
                 <div className="bg-white/50 p-2 rounded text-xs font-bold text-black">
                   {expression || '---'}
                 </div>
                 {(() => {
                   const parts = expression.split(',').map(p => parseFloat(p.trim()));
                   if (parts.length === 3 && !parts.some(isNaN)) {
                     const [a, b, c] = parts;
                     const disc = b*b - 4*a*c;
                     if (disc < 0) return <div className="text-[10px] text-gray-900 font-bold mt-1">No Real Roots</div>;
                     const x1 = (-b + Math.sqrt(disc)) / (2*a);
                     const x2 = (-b - Math.sqrt(disc)) / (2*a);
                     return (
                       <div className="mt-1 space-y-1">
                         <div className="flex justify-between border-t border-black/5 pt-1">
                           <span className="text-[9px] opacity-40">x₁</span>
                           <span className="text-xs font-black">{x1.toFixed(4)}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-[9px] opacity-40">x₂</span>
                           <span className="text-xs font-black">{x2.toFixed(4)}</span>
                         </div>
                       </div>
                     );
                   }
                   return <div className="text-[9px] text-gray-500 italic mt-1">Waiting for 3 values...</div>;
                 })()}
               </div>
            ) : mode === 'matrix' ? (
              // ---------------- MATRIX PREVIEW ----------------
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="text-[10px] font-black opacity-30 uppercase">Matrix Input Template</div>
                 <div className="grid grid-cols-3 gap-1 p-2 bg-black/5 border border-black/10 rounded mt-2">
                    {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-6 h-6 bg-white flex items-center justify-center text-[10px] font-bold">0</div>)}
                 </div>
                 <p className="text-[8px] mt-2 italic text-gray-500">Coming in v2: Full Matrix Suite</p>
              </div>
            ) : (
              // ---------------- DEFAULT CALC MODE ----------------
              <div className="flex-1 flex flex-col justify-end">
                {history.map((h, i) => (
                  <div key={i} className="mb-3 opacity-60 text-right">
                    <div className="text-xs text-gray-700 tracking-tight">{h.expr}</div>
                    <div className="text-sm font-bold text-gray-900">{h.res}</div>
                  </div>
                ))}
                
                <div className="text-right">
                  <div className="text-sm sm:text-base text-gray-800 tracking-tight break-all">
                    {expression || '0'}
                  </div>
                  {result && (
                    <div className="text-xl sm:text-3xl font-black text-black mt-1">
                      {result === 'Syntax Error' ? <span className="text-red-700 text-lg">Syntax Error</span> : result}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- CASIO KEYPAD BASE ----------------- */}
      <div className="flex-1 bg-[#1e293b] p-4 flex flex-col gap-3 rounded-b-3xl pb-6">
        
        {/* CONTEXTUAL HEX PAD (Shown in Base-N mode) */}
        {mode === 'base' && (
          <div className="grid grid-cols-6 gap-1.5 mb-1 px-1">
             {['A','B','C','D','E','F'].map(h => (
               <button key={h} onClick={() => append(h)} 
                 className="h-6 bg-red-900/40 border-b border-red-900 rounded text-red-100 text-[10px] font-black hover:bg-red-800/60 active:translate-y-[1px]">
                 {h}
               </button>
             ))}
          </div>
        )}
        
        {/* ROW 1: System Toggles */}
        <div className="flex justify-between items-center px-1 mb-2">
           <button onClick={() => setIsShift(!isShift)} className="w-10 h-6 bg-yellow-600 rounded-full text-white text-[8px] font-black uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-95">SHIFT</button>
           <button onClick={() => setIsAlpha(!isAlpha)} className="w-10 h-6 bg-red-700 rounded-full text-white text-[8px] font-black uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-95">ALPHA</button>
           <div className="w-16 h-8 rounded-full border border-gray-600 flex bg-[#0f172a] shadow-inner items-center justify-between p-1">
             <button onClick={() => setMode('calc')} className={`flex-1 flex justify-center text-white ${mode==='calc'?'opacity-100':'opacity-30'}`}><Calculator className="w-4 h-4" /></button>
             <button onClick={() => setMode('graph')} className={`flex-1 flex justify-center text-white ${mode==='graph'?'opacity-100':'opacity-30'}`}><Activity className="w-4 h-4" /></button>
           </div>
           <button onClick={() => append('derivative(')} className="w-10 h-6 bg-gray-600 rounded text-white text-[8px] font-black shadow-sm hover:brightness-110 active:scale-95">d/dx</button>
           <button onClick={() => setMode('menu')} className="w-10 h-6 bg-gray-600 rounded text-white text-[8px] font-black shadow-sm hover:brightness-110 active:scale-95">MENU</button>
        </div>

        {/* ROW 2 & 3: Scientific Grid */}
        <div className="grid grid-cols-6 gap-2">
           <button className={btnSci} onClick={() => append('abs(')}>abs</button>
           <button className={btnSci} onClick={() => append('x')}>x</button>
           <button className={btnSci} onClick={() => append('x^-1')}>x⁻¹</button>
           <button className={btnSci} onClick={() => append('log(')}>log</button>
           <button className={btnSci} onClick={() => append('ln(')}>ln</button>
           <button className={btnSci} onClick={() => append('e')}>e</button>

           <button className={btnSci} onClick={() => append('^2')}>x²</button>
           <button className={btnSci} onClick={() => append('^')}>xⁿ</button>
           <button className={btnSci} onClick={() => append('sqrt(')}>√</button>
           <button className={btnSci} onClick={() => append('sin(')}>sin</button>
           <button className={btnSci} onClick={() => append('cos(')}>cos</button>
           <button className={btnSci} onClick={() => append('tan(')}>tan</button>

           <button className={btnSci} onClick={() => append('(')}>(</button>
           <button className={btnSci} onClick={() => append(')')}>)</button>
           <button className={btnSci} onClick={() => append(',')}>,</button>
           <button className={btnSci} onClick={() => append('%')}>%</button>
           <button className={btnSci} onClick={() => append('!')}>x!</button>
           <button className={btnSci} onClick={() => append('pi')}>π</button>
        </div>

        <div className="w-full h-px bg-gray-700 my-1"></div>

        {/* Numpad + Operations */}
        <div className="grid grid-cols-5 gap-2">
           {/* Row 1 */}
           <button className={btnNum} onClick={() => append('7')}>7</button>
           <button className={btnNum} onClick={() => append('8')}>8</button>
           <button className={btnNum} onClick={() => append('9')}>9</button>
           <button className={btnDel} onClick={backspace}>DEL</button>
           <button className={btnDel} onClick={clear}>AC</button>
           
           {/* Row 2 */}
           <button className={btnNum} onClick={() => append('4')}>4</button>
           <button className={btnNum} onClick={() => append('5')}>5</button>
           <button className={btnNum} onClick={() => append('6')}>6</button>
           <button className={btnOp} onClick={() => append('*')}>×</button>
           <button className={btnOp} onClick={() => append('/')}>÷</button>

           {/* Row 3 */}
           <button className={btnNum} onClick={() => append('1')}>1</button>
           <button className={btnNum} onClick={() => append('2')}>2</button>
           <button className={btnNum} onClick={() => append('3')}>3</button>
           <button className={btnOp} onClick={() => append('+')}>+</button>
           <button className={btnOp} onClick={() => append('-')}>−</button>

           {/* Row 4 */}
           <button className={btnNum} onClick={() => append('0')}>0</button>
           <button className={btnNum} onClick={() => append('.')}>.</button>
           <button className={btnNum} onClick={() => append('10^')}>10˟</button>
           <button className={btnEq} onClick={solve}>=</button>
        </div>
      </div>

    </div>
  );
}
