'use client';
import { useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RefreshCcw, Globe } from 'lucide-react';

const CURRENCIES: Record<string, { label: string; symbol: string; rate: number; flag: string }> = {
  USD: { label: 'US Dollar',          symbol: '$',   rate: 133.50, flag: '🇺🇸' },
  INR: { label: 'Indian Rupee',       symbol: '₹',   rate: 1.60,   flag: '🇮🇳' },
  EUR: { label: 'Euro',               symbol: '€',   rate: 144.20, flag: '🇪🇺' },
  GBP: { label: 'British Pound',      symbol: '£',   rate: 168.45, flag: '🇬🇧' },
  AUD: { label: 'Australian Dollar',  symbol: 'A$',  rate: 88.10,  flag: '🇦🇺' },
  CAD: { label: 'Canadian Dollar',    symbol: 'C$',  rate: 98.30,  flag: '🇨🇦' },
};

const DEFAULT = { fromCurrency: 'USD', amount: 100 };

export default function CurrencyCalculator() {
  const [state, setState] = useLocalStorage('calcpro_currency_v2', DEFAULT);
  const { fromCurrency, amount } = state;
  const update = (u: Partial<typeof DEFAULT>) => setState({ ...state, ...u });

  const results = useMemo(() => {
    const rate = CURRENCIES[fromCurrency].rate;
    const npr  = amount * rate;
    const quickView = Object.entries(CURRENCIES).map(([code, data]) => ({
      code, flag: data.flag, label: data.label,
      val: (npr / data.rate).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    }));
    return { npr, quickView };
  }, [fromCurrency, amount]);

  const PRESETS = [
    { label: 'USD 100', currency: 'USD', amt: 100 },
    { label: 'EUR 50',  currency: 'EUR', amt: 50  },
    { label: 'GBP 10',  currency: 'GBP', amt: 10  },
    { label: 'INR 1000',currency: 'INR', amt: 1000 },
  ];

  return (
    <CalculatorLayout
      title="Currency Converter (NPR)"
      description="Convert global currencies to Nepalese Rupee (NPR) using NRB-benchmarked exchange rates. INR pegged at fixed 1:1.60 ratio."
      category={{ label: 'Finance', href: '/calculator/category/finance' }}
      leftPanel={
        <div className="space-y-6">
          {/* Amount Input */}
          <ValidatedInput label="Amount to Convert" value={amount} onChange={v => update({ amount: v })} min={0} required />

          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">From Currency</label>
            <div className="space-y-1">
              {Object.entries(CURRENCIES).map(([code, data]) => (
                <button key={code} onClick={() => update({ fromCurrency: code })}
                  className={`w-full p-4 border text-left flex items-center gap-3 transition-all ${fromCurrency === code ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white border-[var(--border)] hover:bg-[var(--bg-subtle)]'}`}>
                  <span className="text-xl">{data.flag}</span>
                  <div>
                    <div className="text-[12px] font-black">{code} — {data.label}</div>
                    <div className={`text-[10px] font-medium ${fromCurrency === code ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      1 {code} = {data.rate} NPR
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Scenarios</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => update({ fromCurrency: p.currency, amount: p.amt })}
                  className="py-3 text-[11px] font-bold border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all uppercase">
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {/* NPR Result Hero */}
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">NPR Equivalent</div>
            <div className="text-5xl font-black text-[#006600] tracking-tighter mb-2">
              {Math.round(results.npr).toLocaleString('en-IN')}
            </div>
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Nepalese Rupees</div>
          </div>

          {/* Rate Info */}
          <div className="space-y-3">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Exchange Rate</span>
              <span className="text-sm font-black text-[var(--text-main)]">1 {fromCurrency} = {CURRENCIES[fromCurrency].rate} NPR</span>
            </div>
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
              <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Inverted Rate</span>
              <span className="text-sm font-black text-[var(--text-main)]">1 NPR = {(1 / CURRENCIES[fromCurrency].rate).toFixed(5)} {fromCurrency}</span>
            </div>
          </div>

          {/* Multi-Currency Grid */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Equivalent in Other Currencies</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {results.quickView.map(curr => (
                <div key={curr.code} className="px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-surface)]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{curr.flag}</span>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">{curr.code}</span>
                  </div>
                  <span className="text-sm font-black text-[var(--primary)] font-mono">{curr.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)] flex gap-3">
            <Globe className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              INR is pegged to NPR at a fixed 1:1.60 rate by Nepal Rastra Bank. All other rates are NRB mid-market benchmarks.
            </p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'Is the INR rate fixed?', answer: 'Yes. The Indian Rupee is pegged to the Nepalese Rupee at 1 INR = 1.60 NPR. This has been maintained by the Nepal Rastra Bank for decades.' },
          { question: 'How current are the rates?', answer: 'Our benchmarks are NRB mid-market reference rates. Actual bank buy/sell rates vary by 1–2%.' },
          { question: 'Where can I exchange in Nepal?', answer: 'USD, EUR, and GBP are exchangeable at most commercial banks and authorized exchange counters in Kathmandu and Pokhara.' },
        ]} />
      }
    />
  );
}
