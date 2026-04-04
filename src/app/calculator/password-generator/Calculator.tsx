'use client';
import { useState, useMemo, useCallback } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMS  = '0123456789';
const SYMS  = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const SIMILAR = 'il1Lo0O';

function genPass(len: number, upper: boolean, lower: boolean, nums: boolean, syms: boolean, noSim: boolean): string {
  let cs = '';
  if (upper) cs += UPPER; if (lower) cs += LOWER; if (nums) cs += NUMS; if (syms) cs += SYMS;
  if (noSim) cs = cs.split('').filter(c => !SIMILAR.includes(c)).join('');
  if (!cs) return 'Select at least one type';
  return Array.from({ length: len }, () => cs[Math.floor(Math.random() * cs.length)]).join('');
}

export default function PasswordGenerator() {
  const [length, setLength]             = useState(16);
  const [useUpper, setUpper]            = useState(true);
  const [useLower, setLower]            = useState(true);
  const [useNums, setNums]              = useState(true);
  const [useSyms, setSyms]              = useState(true);
  const [excludeSimilar, setExclude]    = useState(false);
  const [passwords, setPasswords]       = useState<string[]>([]);
  const [copied, setCopied]             = useState<number | null>(null);

  const generate = useCallback(() => {
    setPasswords([
      genPass(length, useUpper, useLower, useNums, useSyms, excludeSimilar),
      genPass(length, useUpper, useLower, useNums, useSyms, excludeSimilar),
      genPass(length, useUpper, useLower, useNums, useSyms, excludeSimilar),
    ]);
    setCopied(null);
  }, [length, useUpper, useLower, useNums, useSyms, excludeSimilar]);

  // Generate on first render
  useMemo(() => { if (passwords.length === 0) generate(); }, [generate, passwords.length]);

  const copy = (pwd: string, i: number) => {
    navigator.clipboard.writeText(pwd); setCopied(i); setTimeout(() => setCopied(null), 2000);
  };

  const strength = useMemo(() => {
    let s = 0;
    if (length > 8) s++; if (length > 12) s++; if (length >= 16) s++;
    if (useUpper && useLower) s++; if (useNums) s++; if (useSyms) s++;
    return s < 3 ? { label: 'Weak', color: '#dc2626', w: '25%' }
         : s < 5 ? { label: 'Fair', color: '#b45309', w: '50%' }
         : s < 6 ? { label: 'Strong', color: '#006600', w: '75%' }
         :         { label: 'Very Strong', color: '#083366', w: '100%' };
  }, [length, useUpper, useLower, useNums, useSyms]);

  const OPTS = [
    { label: 'Uppercase (A–Z)', val: useUpper, set: setUpper },
    { label: 'Lowercase (a–z)', val: useLower, set: setLower },
    { label: 'Numbers (0–9)',   val: useNums,  set: setNums  },
    { label: 'Symbols (!@#$)', val: useSyms,  set: setSyms  },
    { label: 'Exclude similar (i, l, 1, O, 0)', val: excludeSimilar, set: setExclude },
  ];

  return (
    <CalculatorLayout
      title="Password Generator"
      description="Generate strong, secure, random passwords with custom length and character options. Runs entirely in your browser — never sent to servers."
      category={{ label: 'Utility', href: '/calculator/category/utility' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Password Length</label>
              <span className="text-sm font-black text-[var(--primary)]">{length} characters</span>
            </div>
            <input type="range" min={8} max={64} step={1} value={length} onChange={e => { setLength(Number(e.target.value)); }} className="w-full accent-[#083366]" />
            <div className="grid grid-cols-5 gap-2">
              {[8, 12, 16, 24, 32].map(v => (
                <button key={v} onClick={() => setLength(v)}
                  className={`py-2 text-[10px] font-black border transition-all ${length === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Character Types</label>
            {OPTS.map(opt => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                <button onClick={() => opt.set(!opt.val)}
                  className={`relative w-10 h-6 shrink-0 transition-colors ${opt.val ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white transition-all ${opt.val ? 'left-5' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-[var(--text-main)]">{opt.label}</span>
              </label>
            ))}
          </div>

          <button onClick={generate}
            className="w-full py-4 bg-[var(--primary)] text-white font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Generate New Passwords
          </button>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Strength */}
          <div className="p-5 bg-white border border-[var(--border)] space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: strength.color }} />
                <span className="text-[11px] font-bold uppercase" style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase">{length} chars</span>
            </div>
            <div className="h-2 bg-gray-200 w-full">
              <div className="h-full transition-all duration-700" style={{ width: strength.w, backgroundColor: strength.color }} />
            </div>
          </div>

          {/* Generated passwords */}
          <div className="space-y-3">
            {(passwords.length > 0 ? passwords : ['Generating...','']).map((pwd, i) => (
              <div key={i} className="p-4 bg-white border border-[var(--border)] flex items-center gap-3">
                <div className="flex-1 font-mono text-sm break-all text-[var(--text-main)] font-bold">{pwd}</div>
                <button onClick={() => copy(pwd, i)}
                  className="shrink-0 h-10 w-10 border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all">
                  {copied === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">All passwords are generated in your browser and never sent to our servers.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What makes a strong password?', answer: 'At least 12–16 characters, mixing uppercase, lowercase, numbers, and symbols. Never use dictionary words or personal info.' },
          { question: 'Is this generator secure?', answer: 'Yes — it runs entirely in your browser using Math.random(). Your passwords are never transmitted to any server.' },
          { question: 'What does "Exclude Similar" do?', answer: 'Removes visually similar characters (i, l, 1, I, L, O, 0) to avoid reading errors when manually typing passwords.' },
        ]} />
      }
    />
  );
}
