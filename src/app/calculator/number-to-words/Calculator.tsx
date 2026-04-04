'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Copy, Check } from 'lucide-react';

const UNITS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS  = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function helper(n: number): string {
  if (n < 20) return UNITS[n];
  if (n < 100) return TENS[Math.floor(n/10)] + (n%10 ? ' ' + UNITS[n%10] : '');
  return UNITS[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' and ' + helper(n%100) : '');
}

function toIntl(n: number): string {
  const scales = ['','Thousand','Million','Billion','Trillion'];
  let r = ''; let si = 0;
  while (n > 0) { const c = n%1000; if (c) r = helper(c) + (scales[si] ? ' '+scales[si] : '') + (r ? ' '+r : ''); n = Math.floor(n/1000); si++; }
  return r;
}

function toLakh(n: number): string {
  let r = '';
  if (n >= 10000000) { r += helper(Math.floor(n/10000000)) + ' Crore '; n %= 10000000; }
  if (n >= 100000)   { r += helper(Math.floor(n/100000)) + ' Lakh '; n %= 100000; }
  if (n >= 1000)     { r += helper(Math.floor(n/1000)) + ' Thousand '; n %= 1000; }
  if (n > 0) r += helper(n);
  return r;
}

export default function NumberToWords() {
  const [number, setNumber]   = useState('12345');
  const [system, setSystem]   = useState<'intl'|'lakh'>('lakh');
  const [asCurrency, setAsCurr] = useState(false);
  const [copied, setCopied]   = useState(false);

  const r = useMemo(() => {
    const n = parseInt(number);
    if (isNaN(n)) return 'Invalid number';
    if (n === 0) return asCurrency ? 'Zero Rupees Only' : 'Zero';
    const w = system === 'intl' ? toIntl(n) : toLakh(n);
    return asCurrency ? `Rupees ${w.trim()} Only` : w.trim();
  }, [number, system, asCurrency]);

  const copy = () => { navigator.clipboard.writeText(r); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <CalculatorLayout
      title="Number to Words Converter"
      description="Convert any number to written English words. Supports international (millions) and South Asian (lakh/crore) systems. Perfect for checks and legal documents."
      category={{ label: 'Math', href: '/calculator/category/math' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Enter Number</label>
            <input type="number" value={number} onChange={e => setNumber(e.target.value)}
              className="w-full h-16 px-6 border-2 border-[var(--border)] bg-white font-mono text-3xl font-black focus:border-[var(--primary)] outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Number System</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'intl', label: 'International (Millions)' },
                { val: 'lakh', label: 'South Asian (Lakh/Crore)' },
              ].map(s => (
                <button key={s.val} onClick={() => setSystem(s.val as any)}
                  className={`py-4 text-xs font-black border transition-all uppercase ${system === s.val ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 border border-[var(--border)] bg-white hover:bg-[var(--bg-surface)] transition-all">
            <button onClick={() => setAsCurr(!asCurrency)}
              className={`relative w-10 h-6 shrink-0 transition-colors ${asCurrency ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white transition-all ${asCurrency ? 'left-5' : 'left-1'}`} />
            </button>
            <span className="text-sm font-bold text-[var(--text-main)]">Currency Mode (Rupees ... Only)</span>
          </label>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Examples</label>
            {['1000', '50000', '100000', '10000000'].map(ex => (
              <button key={ex} onClick={() => setNumber(ex)}
                className="w-full p-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-left font-mono font-bold text-sm text-[var(--primary)] transition-all">
                {parseInt(ex).toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)]">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-4">In Words</div>
            <p className="text-lg font-black text-[var(--primary)] leading-relaxed">{r}</p>
          </div>

          <button onClick={copy}
            className="w-full py-4 border border-[var(--primary)] text-[var(--primary)] font-black uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2">
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Words</>}
          </button>

          <div className="space-y-2">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">System</span>
              <span className="text-sm font-black text-[var(--text-main)]">{system === 'intl' ? 'International' : 'South Asian'}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Formatted Number</span>
              <span className="text-sm font-black font-mono text-[var(--primary)]">{parseInt(number)||0}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'When is number-to-words used?', answer: 'Writing amounts on checks and legal documents to prevent tampering and ensure clarity.' },
          { question: 'What is the difference between lakh and million?', answer: '1 lakh = 100,000. 1 million = 1,000,000. In Nepal/India, numbers use lakh/crore format.' },
          { question: 'Can it handle crore?', answer: 'Yes, the South Asian system supports up to multiple crores. 1 crore = 10,000,000.' },
        ]} />
      }
    />
  );
}
