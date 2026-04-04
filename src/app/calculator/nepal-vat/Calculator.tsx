'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Receipt, Landmark } from 'lucide-react';

function fmt(n: number) { return Math.round(n).toLocaleString('en-IN'); }

export default function NepalVATCalculator() {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState(1000);

  const r = useMemo(() => {
    const rate = 0.13;
    let original = 0, vatAmount = 0, final = 0;
    if (mode === 'add') {
      original = amount; vatAmount = original * rate; final = original + vatAmount;
    } else {
      final = amount; original = final / (1 + rate); vatAmount = final - original;
    }
    return { original, vatAmount, final };
  }, [mode, amount]);

  const PRESETS = [1000, 5000, 10000, 50000];

  return (
    <CalculatorLayout
      title="Nepal VAT Calculator (13%)"
      description="Instantly add or remove 13% VAT from any amount. Updated for Nepal FY 2082/83 tax rules and IRD standards."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          {/* Mode selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Calculation Mode</label>
            <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-surface)]">
              {([{ id: 'add', label: 'Add VAT (13%)' }, { id: 'remove', label: 'Remove VAT' }] as const).map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${mode === m.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <ValidatedInput
            label={mode === 'add' ? 'Price (VAT Exclusive)' : 'Total Price (VAT Inclusive)'}
            value={amount} onChange={setAmount} min={0} prefix="Rs." required />

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Common Amounts</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(v => (
                <button key={v} onClick={() => setAmount(v)}
                  className={`py-3 text-[11px] font-bold border transition-all ${amount === v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]'}`}>
                  {fmt(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Nepal VAT info */}
          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)] flex gap-3">
            <Landmark className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-black uppercase text-[var(--text-main)] mb-1">Nepal IRD Standard</div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Nepal's standard VAT rate is <strong>13%</strong>, applied to most goods and services under the VAT Act 2052. Essential goods like fresh food are exempt.
              </p>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* Primary Result */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">
              {mode === 'add' ? 'Total (incl. VAT)' : 'Amount (excl. VAT)'}
            </div>
            <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2">
              Rs. {fmt(mode === 'add' ? r.final : r.original)}
            </div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">
              {mode === 'add' ? 'Gross Price' : 'Net Price'}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)] flex justify-between">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Pricing Breakdown</h3>
              <span className="text-[9px] font-black bg-[var(--primary)] text-white px-2 py-1 uppercase">Nepal Standard</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              <div className="px-4 py-4 flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Net Amount (excl. VAT)</span>
                <span className="text-sm font-black text-[var(--text-main)] font-mono">Rs. {fmt(r.original)}</span>
              </div>
              <div className="px-4 py-4 flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">VAT Amount (13%)</span>
                <span className="text-sm font-black text-amber-700 font-mono">+ Rs. {fmt(r.vatAmount)}</span>
              </div>
              <div className="px-4 py-5 flex justify-between bg-[var(--bg-subtle)]">
                <span className="text-[11px] font-black uppercase text-[var(--text-main)]">Gross Total (incl. VAT)</span>
                <span className="text-lg font-black text-[var(--primary)] font-mono">Rs. {fmt(r.final)}</span>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-[var(--border)] text-center">
              <Receipt className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2" />
              <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">Tax Method</div>
              <div className="text-[11px] font-black text-[var(--text-main)]">Nepal IRD</div>
            </div>
            <div className="p-5 bg-white border border-[var(--border)] text-center">
              <Landmark className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2" />
              <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">Fiscal Year</div>
              <div className="text-[11px] font-black text-[var(--text-main)]">FY 2082/83</div>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is Nepal\'s VAT rate?', answer: 'The standard VAT rate in Nepal is 13%, applied to most goods and services. Some essential items like unprocessed food and agricultural products are exempt.' },
          { question: 'How do I add VAT?', answer: 'Multiply the VAT-exclusive price by 1.13. Example: Rs. 1,000 + 13% VAT = Rs. 1,130.' },
          { question: 'How do I remove VAT from a total?', answer: 'Divide the VAT-inclusive amount by 1.13. Example: Rs. 1,130 ÷ 1.13 = Rs. 1,000 (net price).' },
          { question: 'Who needs to register for VAT in Nepal?', answer: 'Businesses with annual turnover exceeding Rs. 20 Lakh are required to register for VAT with the Inland Revenue Department (IRD).' },
        ]} />
      }
    />
  );
}
