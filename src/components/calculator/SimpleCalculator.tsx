'use client';
/**
 * @fileoverview SimpleCalculator — Basic 4-operation calculator widget
 *
 * Compact iOS-style calculator. Uses safeEval() — no eval() allowed.
 * Touch targets: min-h-[44px] for Apple HIG compliance.
 *
 * @component
 */
import { useState, useCallback } from 'react';
import { safeEval } from '@/utils/math/safeEval';

export function SimpleCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = useCallback((n: string) => {
    if (n === '.' && display.includes('.')) return;
    if (display === '0' && n !== '.') setDisplay(n);
    else setDisplay(prev => prev + n);
  }, [display]);

  const handleOperator = useCallback((op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  }, [display]);

  const calculate = useCallback(() => {
    if (!equation) return;
    const result = safeEval(equation + display);
    setDisplay(result);
    setEquation('');
  }, [equation, display]);

  const clear = useCallback(() => { setDisplay('0'); setEquation(''); }, []);

  const toggleSign = useCallback(() => {
    setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
  }, []);

  const percent = useCallback(() => {
    const v = parseFloat(display);
    if (!isNaN(v)) setDisplay(String(v / 100));
  }, [display]);

  const backspace = useCallback(() => {
    if (display.length === 1) setDisplay('0');
    else setDisplay(prev => prev.slice(0, -1));
  }, [display]);

  return (
    <div className="bg-gray-900 rounded-[2rem] p-4 shadow-2xl border border-gray-800 w-full max-w-[320px] mx-auto">
      <div className="mb-3 text-right px-2">
        <div className="text-[10px] text-gray-500 font-mono h-4 overflow-hidden">{equation || '\u00A0'}</div>
        <div className="text-3xl font-light text-white font-mono truncate" style={{fontSize:'clamp(1.5rem,8vw,2rem)'}}>{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="h-14 rounded-2xl bg-gray-400 text-black font-semibold text-sm hover:bg-gray-300 active:scale-95 transition-all min-h-[44px]">AC</button>
        <button onClick={toggleSign} className="h-14 rounded-2xl bg-gray-400 text-black font-semibold text-sm hover:bg-gray-300 active:scale-95 transition-all min-h-[44px]">+/−</button>
        <button onClick={percent} className="h-14 rounded-2xl bg-gray-400 text-black font-semibold text-sm hover:bg-gray-300 active:scale-95 transition-all min-h-[44px]">%</button>
        <button onClick={() => handleOperator('÷')} className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-2xl hover:bg-amber-400 active:scale-95 transition-all min-h-[44px]">÷</button>
        {['7','8','9'].map(n => <button key={n} onClick={() => handleNumber(n)} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">{n}</button>)}
        <button onClick={() => handleOperator('×')} className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-2xl hover:bg-amber-400 active:scale-95 transition-all min-h-[44px]">×</button>
        {['4','5','6'].map(n => <button key={n} onClick={() => handleNumber(n)} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">{n}</button>)}
        <button onClick={() => handleOperator('−')} className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-2xl hover:bg-amber-400 active:scale-95 transition-all min-h-[44px]">−</button>
        {['1','2','3'].map(n => <button key={n} onClick={() => handleNumber(n)} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">{n}</button>)}
        <button onClick={() => handleOperator('+')} className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-2xl hover:bg-amber-400 active:scale-95 transition-all min-h-[44px]">+</button>
        <button onClick={() => handleNumber('0')} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">0</button>
        <button onClick={() => handleNumber('.')} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">.</button>
        <button onClick={backspace} className="h-14 rounded-2xl bg-gray-700 text-white font-semibold text-xl hover:bg-gray-600 active:scale-95 transition-all min-h-[44px]">⌫</button>
        <button onClick={calculate} className="h-14 rounded-2xl bg-amber-500 text-white font-semibold text-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-lg min-h-[44px]">=</button>
      </div>
    </div>
  );
}
