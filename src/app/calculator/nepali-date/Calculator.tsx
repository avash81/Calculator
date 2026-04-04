'use client';
import { useState, useEffect, useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import NepaliDate from 'nepali-date-converter';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { Calendar } from 'lucide-react';

function convertADtoBS(s: string): string | null {
  try { const d = new Date(s); if (isNaN(d.getTime())) return null; return new NepaliDate(d).format('YYYY-MM-DD'); } catch { return null; }
}
function convertBStoAD(s: string): string | null {
  try { const [y,m,d] = s.split('-').map(Number); if (isNaN(y)||isNaN(m)||isNaN(d)) return null; return new NepaliDate(y, m-1, d).toJsDate().toISOString().split('T')[0]; } catch { return null; }
}

const DAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAYS_NP = ['आइतबार','सोमबार','मंगलबार','बुधबार','बिहीबार','शुक्रबार','शनिबार'];

export default function NepaliDateConverter() {
  const [tab, setTab]           = useState<'ad2bs'|'bs2ad'>('ad2bs');
  const [inputDate, setInput]   = useState('');
  const [todayAD, setTodayAD]   = useState('');
  const [todayBS, setTodayBS]   = useState('');

  useEffect(() => {
    const now = new Date();
    const t = now.toISOString().split('T')[0];
    const bs = new NepaliDate(now).format('YYYY-MM-DD');
    setTodayAD(t); setTodayBS(bs); setInput(t);
  }, []);

  const result = useMemo(() => {
    if (!inputDate) return null;
    let converted = '', dayIndex = 0;
    if (tab === 'ad2bs') {
      converted = convertADtoBS(inputDate) || '';
      const d = new Date(inputDate); if (!isNaN(d.getTime())) dayIndex = d.getDay();
    } else {
      converted = convertBStoAD(inputDate) || '';
      try { dayIndex = new NepaliDate(inputDate).getDay(); } catch { dayIndex = 0; }
    }
    if (!converted) return null;
    const targetAD = tab === 'ad2bs' ? inputDate : converted;
    const diffDays = Math.ceil((new Date(targetAD).getTime() - new Date(todayAD).getTime()) / 86400000);
    return { date: converted, dayEn: DAYS_EN[dayIndex], dayNp: DAYS_NP[dayIndex], diffDays };
  }, [inputDate, tab, todayAD]);

  return (
    <CalculatorLayout
      title="Nepali Date Converter (AD ↔ BS)"
      description="Convert English (Gregorian) dates to Nepali Bikram Sambat (BS) and vice versa. Shows day of week in both English and Nepali."
      category={{ label: 'Nepal Tools', href: '/calculator/category/nepal' }}
      leftPanel={
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'ad2bs', label: 'AD → BS (English to Nepali)', today: todayAD },
              { key: 'bs2ad', label: 'BS → AD (Nepali to English)', today: todayBS },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key as any); setInput(t.today); }}
                className={`py-4 text-xs font-black border transition-all uppercase ${tab === t.key ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] bg-white hover:bg-[var(--bg-subtle)]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">
              {tab === 'ad2bs' ? 'Enter English Date (AD)' : 'Enter Nepali Date (BS)'}
            </label>
            <div className="flex items-center gap-3">
              {tab === 'ad2bs' ? (
                <input type="date" value={inputDate} onChange={e => setInput(e.target.value)}
                  className="flex-1 h-12 px-3 border border-[var(--border)] bg-white font-mono font-bold focus:border-[var(--primary)] outline-none" />
              ) : (
                <input type="text" placeholder="YYYY-MM-DD (e.g., 2081-01-15)" value={inputDate} onChange={e => setInput(e.target.value)}
                  className="flex-1 h-12 px-3 border border-[var(--border)] bg-white font-mono font-bold focus:border-[var(--primary)] outline-none" />
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Format: YYYY-MM-DD</p>
          </div>

          <button onClick={() => setInput(tab === 'ad2bs' ? todayAD : todayBS)}
            className="py-3 px-5 border border-[var(--primary)] text-[var(--primary)] text-[11px] font-bold uppercase hover:bg-[var(--primary)] hover:text-white transition-all">
            Set to Today
          </button>

          {/* Today info */}
          <div className="p-5 bg-white border border-[var(--border)]">
            <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2">Today's Date</div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="font-mono text-sm font-bold text-[var(--text-main)]">AD: {todayAD}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span className="font-mono text-sm font-bold text-[var(--primary)]">BS: {todayBS}</span>
            </div>
          </div>
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <div className="p-8 bg-white border border-[var(--border)] text-center">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">
              {tab === 'ad2bs' ? 'Nepali Date (BS)' : 'English Date (AD)'}
            </div>
            <div className="text-4xl font-black text-[var(--primary)] tracking-tight font-mono mb-3">{result?.date || '—'}</div>
            {result && <div className="text-sm font-bold text-[var(--text-secondary)]">{result.dayEn} / {result.dayNp}</div>}
          </div>

          {result && (
            <div className="space-y-3">
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Day of Week</span>
                <span className="text-sm font-black text-[var(--text-main)]">{result.dayEn}</span>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Nepali Day</span>
                <span className="text-sm font-black text-[var(--primary)]">{result.dayNp}</span>
              </div>
              <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border)] flex justify-between">
                <span className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">From Today</span>
                <span className="text-sm font-black text-[var(--text-main)]">
                  {result.diffDays === 0 ? 'Today' : result.diffDays > 0 ? `In ${result.diffDays} days` : `${Math.abs(result.diffDays)} days ago`}
                </span>
              </div>
            </div>
          )}

          <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="text-[11px] text-[var(--text-secondary)] italic">BS is approximately 56 years and 8 months ahead of AD. Verify dates against official Panchanga for legal purposes.</p>
          </div>
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'What is Bikram Sambat (BS)?', answer: 'BS is Nepal\'s official calendar, approximately 56 years and 8 months ahead of the Gregorian calendar (AD). 1 Baisakh BS ≈ mid-April AD.' },
          { question: 'How many months are in the Nepali calendar?', answer: 'The Nepali calendar has 12 months: Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, and Chaitra.' },
          { question: 'When does the Nepali New Year start?', answer: 'Nepali New Year begins on 1 Baisakh, which usually falls in mid-April in the Gregorian calendar.' },
        ]} />
      }
    />
  );
}
