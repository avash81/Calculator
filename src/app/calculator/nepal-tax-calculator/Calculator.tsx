'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

function fmt(n: number) { return 'NPR ' + Math.round(n).toLocaleString('en-IN'); }

export default function GrowthTaxCalculator() {
  const [assetType, setAssetType]         = useState<'share'|'land'>('share');
  const [buyPrice, setBuyPrice]           = useState(1000000);
  const [sellPrice, setSellPrice]         = useState(1500000);
  const [holdingPeriod, setHolding]       = useState(1);

  const r = useMemo(() => {
    const profit = Math.max(0, sellPrice - buyPrice);
    const isShortTerm = assetType === 'share' ? holdingPeriod < 1 : holdingPeriod < 5;
    const rate    = isShortTerm ? 0.075 : 0.05;
    const tax     = profit * rate;
    return { profit, tax, rate, netProfit: profit - tax, isShortTerm };
  }, [assetType, buyPrice, sellPrice, holdingPeriod]);

  const RULES = assetType === 'share'
    ? [{ term: 'Short-term (<1yr)', rate: '7.5%' }, { term: 'Long-term (≥1yr)', rate: '5%' }]
    : [{ term: 'Short-term (<5yr)', rate: '7.5%' }, { term: 'Long-term (≥5yr)', rate: '5%' }];

  return (
    <CalculatorLayout
      title="Nepal Capital Gains Tax Calculator"
      description="Calculate Capital Gains Tax (CGT) on NEPSE shares and real estate in Nepal. Based on FY 2081/82 rules with short-term and long-term rates."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Asset Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: 'share', l: 'Shares (NEPSE)' }, { v: 'land', l: 'Real Estate' }].map(a => (
                <button key={a.v} onClick={() => setAssetType(a.v as any)}
                  className={`py-4 text-xs font-black border transition-all uppercase ${assetType === a.v ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                  {a.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ValidatedInput label="Purchase Price (NPR)" value={buyPrice} onChange={setBuyPrice} min={0} prefix="NPR" />
            <ValidatedInput label="Selling Price (NPR)" value={sellPrice} onChange={setSellPrice} min={0} prefix="NPR" />
          </div>
          <ValidatedInput label={`Holding Period (${assetType === 'share' ? 'years' : 'years'})`} value={holdingPeriod} onChange={setHolding} min={0} max={50} step={0.5} suffix="yr" />

          {/* CGT Rate Table */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">CGT Rates (FY 2081/82)</h3>
            </div>
            {RULES.map((row, i) => (
              <div key={i} className={`px-4 py-3 border-b border-[var(--border)] flex justify-between last:border-0 ${(!r.isShortTerm && i===1) || (r.isShortTerm && i===0) ? 'bg-amber-50' : ''}`}>
                <span className="text-[11px] font-bold text-[var(--text-secondary)]">{row.term}</span>
                <span className="text-[11px] font-black text-[var(--primary)]">{row.rate}</span>
              </div>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Tax Payable</div>
            <div className="text-6xl font-black text-red-600 tracking-tighter mb-2">{fmt(r.tax)}</div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">{(r.rate*100).toFixed(1)}% — {r.isShortTerm ? 'Short-term' : 'Long-term'}</div>
          </div>

          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Purchase Price</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(buyPrice)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Selling Price</span>
              <span className="text-sm font-black text-[var(--text-main)]">{fmt(sellPrice)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Gross Profit</span>
              <span className="text-sm font-black text-[#006600]">{fmt(r.profit)}</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Net Profit After Tax</span>
              <span className="text-sm font-black text-[#006600]">{fmt(r.netProfit)}</span>
            </div>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is CGT on NEPSE shares?', answer: 'Individual investors pay 7.5% on short-term gains (<1 year) and 5% on long-term gains (≥1 year) in the Nepal Stock Exchange.' },
          { question: 'What are real estate CGT rates in Nepal?', answer: 'As per FY 2081/82 budget: 7.5% if sold within 5 years, 5% if held for 5+ years.' },
        ]} />
      }
    />
  );
}
