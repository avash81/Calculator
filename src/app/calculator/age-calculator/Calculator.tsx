'use client';
import { useMemo } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Calendar, Gift, Star } from 'lucide-react';

const DEFAULT = { dob: '1995-06-15', targetDate: new Date().toISOString().split('T')[0] };

function getZodiac(d: number, m: number) {
  const cutoffs = [21,20,21,21,22,22,23,24,24,24,23,22];
  const signs = ['Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius'];
  let month = m;
  if (d < cutoffs[month]) month--;
  if (month < 0) month = 11;
  return signs[month];
}

export default function AgeCalculator() {
  const [state, setState] = useLocalStorage('calcpro_age_v2', DEFAULT);
  const { dob, targetDate } = state;
  const update = (u: Partial<typeof DEFAULT>) => setState({ ...state, ...u });

  const a = useMemo(() => {
    if (!dob || !targetDate) return null;
    const d1 = new Date(dob), d2 = new Date(targetDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    if (days < 0) { months--; days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const diffMs   = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBday <= d2) nextBday = new Date(d2.getFullYear() + 1, d1.getMonth(), d1.getDate());
    const nextBdayDays = Math.ceil((nextBday.getTime() - d2.getTime()) / 86400000);
    const dayOfWeek   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d1.getDay()];
    const zodiac      = getZodiac(d1.getDate(), d1.getMonth());

    return { years, months, days, totalDays, totalWeeks, totalMonths, nextBdayDays, dayOfWeek, zodiac };
  }, [dob, targetDate]);

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days. Discover milestones, next birthday countdown, and fun life stats."
      category={{ label: 'Utility', href: '/calculator/category/utility' }}
      leftPanel={
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-white border border-[var(--border)]">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Date of Birth</label>
              <div className="flex items-center border border-[var(--border)] bg-white">
                <Calendar className="w-4 h-4 ml-3 text-[var(--text-muted)] shrink-0" />
                <input type="date" value={dob} onChange={e => update({ dob: e.target.value })}
                  className="flex-1 h-12 px-3 bg-transparent font-bold text-sm focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Age at this date (default: today)</label>
              <div className="flex items-center border border-[var(--border)] bg-white">
                <Calendar className="w-4 h-4 ml-3 text-[var(--text-muted)] shrink-0" />
                <input type="date" value={targetDate} onChange={e => update({ targetDate: e.target.value })}
                  className="flex-1 h-12 px-3 bg-transparent font-bold text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {a && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Days', value: a.totalDays.toLocaleString() },
                { label: 'Total Weeks', value: a.totalWeeks.toLocaleString() },
                { label: 'Total Months', value: a.totalMonths.toLocaleString() },
              ].map(s => (
                <div key={s.label} className="p-4 bg-white border border-[var(--border)] text-center">
                  <div className="text-[9px] font-black uppercase text-[var(--text-muted)] mb-1">{s.label}</div>
                  <div className="text-lg font-black text-[var(--primary)]">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Fun Facts */}
          {a && (
            <div className="p-5 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-black uppercase text-[var(--text-main)]">Fun Facts</span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Born on a <strong>{a.dayOfWeek}</strong>. Zodiac: <strong>{a.zodiac}</strong>.
                Est. heartbeats: <strong>{(a.totalDays * 24 * 60 * 80).toLocaleString()}</strong> (at 80 bpm).
              </p>
            </div>
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          {a ? (
            <>
              {/* Exact Age Hero */}
              <div className="p-8 bg-white border border-[var(--border)] text-center">
                <div className="text-xs font-bold uppercase text-[var(--text-muted)] mb-2">Your Exact Age</div>
                <div className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-1">
                  {a.years}<span className="text-2xl"> yrs</span>
                </div>
                <div className="text-xl font-black text-[var(--text-secondary)]">
                  {a.months} months {a.days} days
                </div>
              </div>

              {/* Birthday Countdown */}
              <div className="p-6 bg-white border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-4 h-4 text-rose-500" />
                  <h4 className="text-[11px] font-black uppercase text-[var(--text-main)]">Next Birthday</h4>
                </div>
                <div className="text-4xl font-black text-[var(--primary)] mb-1">{a.nextBdayDays} <span className="text-lg">days</span></div>
                <div className="text-[11px] text-[var(--text-muted)] font-medium">Until your next celebration</div>

                {/* Life Progress Bar */}
                <div className="mt-5 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    <span>Life Progress (est. 80 yrs)</span>
                    <span>{Math.min(100, (a.years / 80) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 w-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, (a.years / 80) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700">
              <p className="text-xs font-black uppercase mb-1">Invalid Date</p>
              <p className="text-sm">Please enter a valid date of birth.</p>
            </div>
          )}
        </div>
      }
      faqSection={
        <CalcFAQ faqs={[
          { question: 'How is the age calculated?', answer: 'The calculator uses the exact difference between the dates, accounting for leap years and variable month lengths.' },
          { question: 'What is "Total Days Lived"?', answer: 'The absolute count of days since your birth date — popular for "Days Since Born" social media milestones.' },
          { question: 'Does this support Nepali (B.S.) dates?', answer: 'This tool uses the Gregorian calendar. Use our dedicated "Nepali Date Converter" for Bikram Sambat calculations.' },
        ]} />
      }
    />
  );
}
