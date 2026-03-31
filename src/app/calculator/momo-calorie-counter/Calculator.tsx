'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { Info, Plus, Utensils } from 'lucide-react';

const MOMO_TYPES = [
  { name: 'Buff Momo (Steamed)', calories: 35, protein: 3, fat: 1.5, carbs: 3 },
  { name: 'Chicken Momo (Steamed)', calories: 30, protein: 2.5, fat: 1, carbs: 3 },
  { name: 'Veg Momo (Steamed)', calories: 25, protein: 1, fat: 0.8, carbs: 4.5 },
  { name: 'C-Momo (Spicy)', calories: 45, extra: 'Varies by sauce' },
  { name: 'Fried Momo', calories: 60, extra: 'Higher fat content' },
];

export default function MomoCalculator() {
  const [items, setItems] = useState([{ type: MOMO_TYPES[0].name, count: 10 }]);

  const result = useMemo(() => {
    let totalCals = 0;
    items.forEach(item => {
      const type = MOMO_TYPES.find(t => t.name === item.type);
      if (type) totalCals += (type.calories) * item.count;
    });
    return { totalCals };
  }, [items]);

  const updateItem = (index: number, field: string, value: any) => {
    const list = [...items];
    (list[index] as any)[field] = value;
    setItems(list);
  };

  const addItem = () => setItems([...items, { type: MOMO_TYPES[0].name, count: 10 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <>
      <JsonLd 
        type="calculator" 
        name="Momo Calorie Counter 🥟" 
        description="The ultimate fitness tool for Nepal. Calculate calories, protein, and macros for Buff, Chicken, and Veg Momos." 
        url="https://calcpro.com.np/calculator/momo-calorie-counter" 
      />

      <CalcWrapper
        title="Momo Calorie Counter"
        description="A specialized nutritional tool for Nepal. Estimate your calorie intake from various types of Momos — Buff, Chicken, and Veg."
        crumbs={[{label:'health',href:'/calculator?cat=health'}, {label:'momo counter'}]}
        relatedCalcs={[{name:'BMI Calc',slug:'bmi'},{name:'TDEE Calc',slug:'calorie-calculator'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_340px] gap-10">
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-10 shadow-2xl shadow-gray-200/40">
             <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/20 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Momo Type</label>
                       <select 
                         value={item.type} 
                         onChange={e => updateItem(idx, 'type', e.target.value)}
                         className="w-full bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl h-14 px-5 text-sm font-black outline-none focus:border-blue-500 appearance-none cursor-pointer">
                         {MOMO_TYPES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                       </select>
                    </div>
                    <div className="w-full sm:w-32 space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Quantity</label>
                       <div className="flex items-center gap-4">
                          <input 
                            type="number" 
                            value={item.count} 
                            onChange={e => updateItem(idx, 'count', Number(e.target.value))}
                            className="w-full h-14 bg-white dark:bg-gray-950 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 text-center font-black text-lg outline-none focus:border-blue-500" />
                       </div>
                    </div>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(idx)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                         <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    )}
                  </div>
                ))}

                <button onClick={addItem} className="w-full h-16 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                  <Plus className="w-5 h-5" /> Add Another Variety
                </button>
             </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
             <div className="bg-orange-500 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Utensils className="w-24 h-24" />
                </div>
                <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 opacity-70">Total Energy</div>
                <div className="text-6xl font-black mb-6 tracking-tighter">{result.totalCals} <span className="text-xl opacity-60">kcal</span></div>
                
                <div className="bg-black/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase tracking-widest">Plate Equivalent</div>
                   <div className="text-sm font-black">{(result.totalCals / 350).toFixed(1)} Plates</div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-orange-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">Fitness AI Tip</span>
                   </div>
                   <p className="text-[11px] font-bold text-orange-100 leading-relaxed">
                     {result.totalCals > 500 ? 'Entering high-calorie territory. Consider a 30-minute walk at Durbar Square to burn these extra calories!' : 
                      'Healthy snack portion. Opt for the Jhol (soup) as long as it isn’t overly salty.'}
                   </p>
                </div>
             </div>

             <ShareResult title="My Momo Calorie Stats" result={`${result.totalCals} kcal`} calcUrl="https://calcpro.com.np/calculator/momo-calorie-counter" />
          </div>

        </div>

        <div className="mt-20">
           <CalcFAQ faqs={[
             { question: 'How many calories in one piece of Buff Momo?', answer: 'An average steamed Buff Momo piece contains roughly 35-40 calories depending on size and filling density.' },
             { question: 'Is Veg Momo healthier?', answer: 'Yes, Veg Momos are generally lower in calories (25-30 kcal per piece) and saturated fat compared to meat varieties.' }
           ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
