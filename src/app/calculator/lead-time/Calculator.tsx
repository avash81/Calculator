'use client';

import { useState } from 'react';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { format } from 'date-fns';

type Mode = 'delivery' | 'order';
type Unit = 'days' | 'weeks' | 'months';

export function Calculator() {
  const [mode, setMode] = useState<Mode>('delivery');
  
  // States
  const [baseDate, setBaseDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [leadTime, setLeadTime] = useState<string>('5');
  const [unit, setUnit] = useState<Unit>('days');
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(true);

  // Computed results
  let targetDate: Date | null = null;
  let calculationMethod = '';
  
  const parsedLeadTime = parseFloat(leadTime);
  
  if (!isNaN(parsedLeadTime) && baseDate) {
    targetDate = new Date(baseDate);
    // JS dates can be tricky with timezone if we just use string. Better to parse YYYY-MM-DD as local.
    const [year, month, day] = baseDate.split('-').map(Number);
    targetDate = new Date(year, month - 1, day);
    
    if (excludeWeekends && unit === 'days') {
      let daysCounter = 0;
      const step = mode === 'delivery' ? 1 : -1;
      
      while (daysCounter < parsedLeadTime) {
        targetDate.setDate(targetDate.getDate() + step);
        if (targetDate.getDay() !== 0 && targetDate.getDay() !== 6) {
          daysCounter++;
        }
      }
      calculationMethod = `Counted ${parsedLeadTime} business days ${mode === 'delivery' ? 'forward' : 'backward'}, skipping Saturdays and Sundays.`;
    } else {
      const step = mode === 'delivery' ? 1 : -1;
      if (unit === 'days') {
        targetDate.setDate(targetDate.getDate() + (parsedLeadTime * step));
        calculationMethod = `Added standard elapsed calendar days.`;
      } else if (unit === 'weeks') {
        targetDate.setDate(targetDate.getDate() + (parsedLeadTime * 7 * step));
        calculationMethod = `Added elapsed weeks (7 days per week).`;
      } else if (unit === 'months') {
        targetDate.setMonth(targetDate.getMonth() + (parsedLeadTime * step));
        calculationMethod = `Adjusted calendar months.`;
      }
    }
  }

  // Generate Inputs View
  const Inputs = (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-bold shadow-inner">
        <button
          onClick={() => setMode('delivery')}
          className={`flex-1 py-3 rounded-md transition-all ${mode === 'delivery' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Expected Delivery
        </button>
        <button
          onClick={() => setMode('order')}
          className={`flex-1 py-3 rounded-md transition-all ${mode === 'order' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Order By Date
        </button>
      </div>

      <div className="space-y-4">
        {/* Base Date */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {mode === 'delivery' ? 'Order Placement Date' : 'Target Need-By Date'}
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full calc-input"
          />
        </div>

        {/* Lead Time & Unit */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Lead Time Required</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="1"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full calc-input"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="calc-input lg:w-1/3"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Settings Toggle */}
        {unit === 'days' && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer" onClick={() => setExcludeWeekends(!excludeWeekends)}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${excludeWeekends ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-gray-300 bg-white'}`}>
               {excludeWeekends && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800">Business Days Only</div>
              <div className="text-xs text-gray-500 font-medium">Skip weekends in calculation</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Generate Results View
  const Results = (
    <div className="space-y-6">
      {targetDate ? (
        <div className="calc-result-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>
          </div>

          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">
            {mode === 'delivery' ? 'Expected Arrival Date' : 'Order Must Be Placed By'}
          </h3>
          
          <div className="text-3xl md:text-5xl font-black text-[var(--success)] tracking-tighter mb-4 relative z-10">
            {format(targetDate, 'MMMM d, yyyy')}
          </div>
          
          <div className="text-sm font-bold text-gray-600 border-l-4 border-gray-200 pl-3 relative z-10">
            <span className="text-gray-800">Calculation Method:</span> {calculationMethod}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Standard Gregorian Logic Applied
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
            <p className="text-sm font-bold text-gray-400">Please enter a valid lead time value to view the calculated target date.</p>
        </div>
      )}
    </div>
  );

  return (
    <CalculatorLayout
      title="Lead Time Calculator"
      description="Calculate expected delivery schedules or required order dates based on lead time metrics."
      category={{ label: "Finance & Logistics", href: "/calculator/category/finance" }}
      leftPanel={Inputs}
      rightPanel={Results}
    />
  );
}
