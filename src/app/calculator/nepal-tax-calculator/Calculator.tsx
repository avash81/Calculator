'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

export default function GrowthTaxCalculator() {
  const [assetType, setAssetType] = useState<'share' | 'land'>('share');
  const [buyPrice, setBuyPrice] = useState(1000000);
  const [sellPrice, setSellPrice] = useState(1500000);
  const [holdingPeriod, setHoldingPeriod] = useState(1); // years

  const dBuy = useDebounce(buyPrice, 300);
  const dSell = useDebounce(sellPrice, 300);

  const r = useMemo(() => {
    const profit = Math.max(0, dSell - dBuy);
    let rate = 0;
    
    if (assetType === 'share') {
      rate = holdingPeriod < 1 ? 0.075 : 0.05; // 7.5% for short term, 5% for long term
    } else {
      rate = holdingPeriod < 5 ? 0.075 : 0.05; // Nepal Real Estate CGT rules
    }
    
    const tax = profit * rate;
    const netProfit = profit - tax;
    
    return { profit, tax, rate, netProfit };
  }, [assetType, dBuy, dSell, holdingPeriod]);

  const fmt = (n: number) => 'NPR ' + Math.round(n).toLocaleString('en-IN');

  return (
    <>
      <JsonLd type="calculator"
        name="Nepal Growth (Capital Gains) Tax Calculator"
        description="Calculate Capital Gains Tax (CGT) on shares and real estate in Nepal. Updated rules for FY 2081/82."
        url="https://calcpro.com.np/calculator/nepal-tax-calculator" />

      <CalcWrapper
        title="Growth & Capital Gains Tax"
        description="Calculate the tax on your investment growth in Nepal. Supports Shares (NEPSE) and Real Estate CGT."
        crumbs={[{ label: 'Nepal Rules', href: '/calculator?cat=nepal' }, { label: 'Growth Tax' }]}
        isNepal
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Asset Type</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button onClick={() => setAssetType('share')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${assetType === 'share' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Shares (NEPSE)</button>
                  <button onClick={() => setAssetType('land')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${assetType === 'land' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Real Estate</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Purchase Price</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={buyPrice} onChange={e => setBuyPrice(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selling Price</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" value={sellPrice} onChange={e => setSellPrice(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Holding Period (Years)</label>
                <input type="number" inputMode="decimal" pattern="[0-9.]*" value={holdingPeriod} onChange={e => setHoldingPeriod(+e.target.value)} className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-mono font-bold" />
                <p className="mt-2 text-[10px] text-gray-400">
                  {assetType === 'share' ? 'Short term: < 365 days (7.5%), Long term: > 365 days (5%)' : 'Short term: < 5 years (7.5%), Long term: > 5 years (5%)'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Tax Payable</div>
              <div className="text-3xl font-bold font-mono mb-4">{fmt(r.tax)}</div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Profit</span>
                  <span className="font-mono font-bold">{fmt(r.profit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Tax Rate</span>
                  <span className="font-mono font-bold">{(r.rate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-base pt-2 font-bold text-green-300">
                  <span>Net Growth</span>
                  <span className="font-mono">{fmt(r.netProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'What is CGT on shares in Nepal?',
            answer: 'For individual investors in the Nepal Stock Exchange (NEPSE), the Capital Gains Tax is 5% for long-term (holding > 365 days) and 7.5% for short-term (holding < 365 days).',
          },
          {
            question: 'What are the real estate tax rules in Nepal 2081/82?',
            answer: 'As per the recent budget, the CGT on land and house sales is 5% if held for more than 5 years, and 7.5% if sold within 5 years of purchase.',
          }
        ]} />
      </CalcWrapper>
    </>
  );
}
