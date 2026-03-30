/**
 * @fileoverview Calorie Calculator — CalcPro.NP
 * Formula: Mifflin-St Jeor BMR × Activity Multiplier
 * Source: Mifflin MD et al. Am J Clin Nutr. 1990;51(2):241-7
 * @component
 */
'use client';
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { JsonLd } from '@/components/seo/JsonLd';

const ACTIVITY = [
  {id:'sedentary',label:'Sedentary',desc:'Little/no exercise',mult:1.2},
  {id:'light',label:'Lightly Active',desc:'1-3 days/week',mult:1.375},
  {id:'moderate',label:'Moderately Active',desc:'3-5 days/week',mult:1.55},
  {id:'very',label:'Very Active',desc:'6-7 days/week',mult:1.725},
  {id:'extra',label:'Extra Active',desc:'Physical job',mult:1.9},
];

export default function CalorieCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [male, setMale] = useState(true);
  const [activity, setActivity] = useState('moderate');

  const result = useMemo(() => {
    if (!weight || !height || !age) return null;
    const bmr = male
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const mult = ACTIVITY.find(a => a.id === activity)!.mult;
    const tdee = Math.round(bmr * mult);
    return {
      bmr: Math.round(bmr), tdee,
      lose1: Math.max(1200, tdee - 1000),
      lose05: Math.max(1200, tdee - 500),
      gain: tdee + 500,
    };
  }, [weight, height, age, male, activity]);

  return (
    <>
      <JsonLd type="calculator" name="Calorie Calculator"
        description="Calculate daily calorie needs based on BMR and activity level"
        url="https://calcpro.com.np/calculator/calorie-calculator" />
      <CalcWrapper title="Calorie Calculator — Daily Needs"
        description="Calculate your daily calorie requirements using the Mifflin-St Jeor equation. Get personalized targets for weight loss, maintenance, and gain."
        crumbs={[{label:'health',href:'/calculator?cat=health'},{label:'calorie calculator'}]}
        relatedCalcs={[{name:'BMI Calculator',slug:'bmi'},{name:'BMR Calculator',slug:'bmr'},{name:'Ideal Weight',slug:'ideal-weight'}]}>
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-5">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2">
                {[{v:true,l:'Male'},{v:false,l:'Female'}].map(({v,l}) => (
                  <button key={l} onClick={() => setMale(v)}
                    className={`min-h-[44px] py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${male===v?'border-blue-500 bg-blue-50 text-blue-700':'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[{l:'Age',v:age,s:setAge,u:'yrs',min:10,max:100},{l:'Weight',v:weight,s:setWeight,u:'kg',min:30,max:200},{l:'Height',v:height,s:setHeight,u:'cm',min:100,max:250}].map(({l,v,s,u,min,max}) => (
                <div key={l}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">{l}</label>
                  <div className="relative">
                    <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={v} onChange={e => s(+e.target.value||0)} min={min} max={max}
                      className="w-full border-2 border-gray-200 rounded-lg px-2 py-2.5 pr-7 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-900 bg-white" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{u}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Activity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">Activity Level</label>
              <div className="space-y-2">
                {ACTIVITY.map(a => (
                  <button key={a.id} onClick={() => setActivity(a.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition-all min-h-[44px] ${activity===a.id?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}>
                    <span className={`text-sm font-medium ${activity===a.id?'text-blue-700':'text-gray-900'}`}>{a.label}</span>
                    <span className="text-xs text-gray-400">{a.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {result && (
            <div className="space-y-3 lg:sticky lg:top-20">
              <div className="bg-green-600 rounded-xl p-5 text-white shadow-lg shadow-green-200">
                <div className="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">Maintenance Calories</div>
                <div className="text-3xl font-bold font-mono">{result.tdee.toLocaleString()}</div>
                <div className="text-xs opacity-75 mt-1">BMR: {result.bmr.toLocaleString()} kcal</div>
              </div>
              {[{l:'Lose 1kg/week',v:result.lose1,c:'text-red-600'},{l:'Lose 0.5kg/week',v:result.lose05,c:'text-orange-600'},{l:'Maintain',v:result.tdee,c:'text-green-600'},{l:'Gain 0.5kg/week',v:result.gain,c:'text-blue-600'}].map(({l,v,c}) => (
                <div key={l} className="bg-white border border-gray-200 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">{l}</span>
                  <span className={`text-sm font-bold font-mono ${c}`}>{v.toLocaleString()} cal</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <CalcFAQ faqs={[
          {question:'How are daily calorie needs calculated?',answer:'We use the Mifflin-St Jeor equation for BMR, then multiply by an activity factor (TDEE). This is the most accurate method for most people.'},
          {question:'What is BMR?',answer:'Basal Metabolic Rate — calories your body needs at complete rest to maintain organ function. Typically 60-75% of total calorie burn.'},
          {question:'How many calories to lose weight?',answer:'A 500 calorie/day deficit leads to ~0.5kg loss per week. Never go below 1200 cal/day for women or 1500 cal/day for men.'},
          {question:'Is this accurate?',answer:'The Mifflin-St Jeor formula is accurate within ±10% for most people. Individual metabolism varies. Use this as a starting point and adjust based on results.'},
        ]} />
      </CalcWrapper>
    </>
  );
}
