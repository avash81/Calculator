'use client';
import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';

const SQFT_PER_ROPANI = 5476;
const SQFT_PER_BIGHA  = 72900;
const SQM_PER_SQFT    = 0.092903;

export default function NepalLandCalculator() {
  const [system, setSystem] = useState<'hill'|'terai'|'intl'>('hill');
  const [ropani, setRopani] = useState(1); const [aana, setAana] = useState(0); const [paisa, setPaisa] = useState(0); const [daam, setDaam] = useState(0);
  const [bigha,  setBigha]  = useState(0); const [kattha, setKattha] = useState(0); const [dhur, setDhur] = useState(0);
  const [sqft,   setSqft]   = useState(5476);

  const totalSqft = useMemo(() => {
    if (system === 'hill')  return ropani*SQFT_PER_ROPANI + aana*(SQFT_PER_ROPANI/16) + paisa*(SQFT_PER_ROPANI/64) + daam*(SQFT_PER_ROPANI/256);
    if (system === 'terai') return bigha*SQFT_PER_BIGHA   + kattha*(SQFT_PER_BIGHA/20) + dhur*(SQFT_PER_BIGHA/400);
    return sqft;
  }, [system,ropani,aana,paisa,daam,bigha,kattha,dhur,sqft]);

  const res = useMemo(() => {
    const s = totalSqft, m = s * SQM_PER_SQFT;
    let rem = s;
    const r = Math.floor(rem/SQFT_PER_ROPANI); rem %= SQFT_PER_ROPANI;
    const a = Math.floor(rem/(SQFT_PER_ROPANI/16)); rem %= (SQFT_PER_ROPANI/16);
    const p = Math.floor(rem/(SQFT_PER_ROPANI/64)); rem %= (SQFT_PER_ROPANI/64);
    const d = (rem/(SQFT_PER_ROPANI/256)).toFixed(2);
    let rem2 = s;
    const bg = Math.floor(rem2/SQFT_PER_BIGHA); rem2 %= SQFT_PER_BIGHA;
    const kt = Math.floor(rem2/(SQFT_PER_BIGHA/20)); rem2 %= (SQFT_PER_BIGHA/20);
    const dr = (rem2/(SQFT_PER_BIGHA/400)).toFixed(2);
    return {
      sqft: s.toLocaleString('en-IN', { maximumFractionDigits:2 }),
      sqm:  m.toLocaleString('en-IN', { maximumFractionDigits:2 }),
      hill:  `${r} Ropani ${a} Aana ${p} Paisa ${d} Daam`,
      terai: `${bg} Bigha ${kt} Kattha ${dr} Dhur`,
      acres: (s/43560).toFixed(4),
      hectares: (m/10000).toFixed(4),
    };
  }, [totalSqft]);

  const SYSTEMS = [
    { k:'hill',  l:'Hills System (Ropani)' },
    { k:'terai', l:'Terai System (Bigha)' },
    { k:'intl',  l:'International (Sq.Ft)' },
  ];

  return (
    <CalculatorLayout
      title="Nepal Land Calculator"
      description="Convert Nepal land measurements between Hills (Ropani, Aana, Paisa, Daam), Terai (Bigha, Kattha, Dhur), and international units (Sq.Ft, Sq.M, Acres)."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {SYSTEMS.map(s => (
              <button key={s.k} onClick={() => setSystem(s.k as any)}
                className={`py-3 text-xs font-black border transition-all uppercase text-left px-4 ${system===s.k ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                {s.l}
              </button>
            ))}
          </div>

          {system === 'hill' && (
            <div className="grid grid-cols-2 gap-4">
              <ValidatedInput label="Ropani" value={ropani} onChange={setRopani} min={0} />
              <ValidatedInput label="Aana (max 15)" value={aana} onChange={setAana} min={0} max={15} />
              <ValidatedInput label="Paisa (max 3)" value={paisa} onChange={setPaisa} min={0} max={3} />
              <ValidatedInput label="Daam (max 3)" value={daam} onChange={setDaam} min={0} max={3} />
            </div>
          )}

          {system === 'terai' && (
            <div className="grid grid-cols-2 gap-4">
              <ValidatedInput label="Bigha" value={bigha} onChange={setBigha} min={0} />
              <ValidatedInput label="Kattha (max 19)" value={kattha} onChange={setKattha} min={0} max={19} />
              <ValidatedInput label="Dhur (max 19)" value={dhur} onChange={setDhur} min={0} max={19} />
            </div>
          )}

          {system === 'intl' && (
            <ValidatedInput label="Total Square Feet" value={sqft} onChange={setSqft} min={0} suffix="sq ft" />
          )}

          {/* Quick load presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Quick Sizes</label>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,5,10].map(v => (
                <button key={v} onClick={() => {
                  if (system==='hill')  { setRopani(v); setAana(0); setPaisa(0); setDaam(0); }
                  if (system==='terai') { setBigha(v);  setKattha(0); setDhur(0); }
                  if (system==='intl')  setSqft(v*5476);
                }}
                  className="py-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)] text-[10px] font-black transition-all uppercase">
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion reference */}
          <div className="bg-white border border-[var(--border)]">
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)]">
              <h3 className="text-[11px] font-bold uppercase text-[var(--text-main)]">Conversion Reference</h3>
            </div>
            {[
              '1 Ropani = 5,476 sq.ft',
              '1 Bigha = 72,900 sq.ft',
              '1 Bigha = 13.31 Ropani',
              '1 Aana = 342.25 sq.ft',
              '1 Kattha = 3,645 sq.ft',
            ].map(t => (
              <div key={t} className="px-4 py-2 border-b border-[var(--border)] last:border-0 text-[11px] text-[var(--text-secondary)] font-bold">
                {t}
              </div>
            ))}
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Total Area</div>
            <div className="text-4xl font-black text-[var(--primary)] tracking-tighter mb-1">{res.sqft} sq.ft</div>
            <div className="text-lg font-black text-[var(--text-secondary)]">{res.sqm} sq.m</div>
          </div>

          <div className="space-y-2">
            {[
              { label:'Hills (Ropani)',   val: res.hill  },
              { label:'Terai (Bigha)',    val: res.terai },
              { label:'Acres',           val: `${res.acres} ac` },
              { label:'Hectares',        val: `${res.hectares} ha` },
            ].map(({ label, val }) => (
              <div key={label} className="p-4 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between items-start gap-2">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)] shrink-0">{label}</span>
                <span className="text-sm font-black text-[var(--text-main)] text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is the Nepal Hills land system?', answer: 'The Hills system uses Ropani-Aana-Paisa-Daam. 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq.ft. Used in hilly areas of Nepal.' },
          { question: 'What is the Nepal Terai land system?', answer: 'The Terai system uses Bigha-Kattha-Dhur. 1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq.ft. Used in the plains (Terai) of Nepal.' },
          { question: 'How many Ropani in 1 Bigha?', answer: '1 Bigha = 72,900 sq.ft ÷ 5,476 sq.ft ≈ 13.31 Ropani.' },
        ]} />
      }
    />
  );
}
