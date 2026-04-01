'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { ResultDisplay } from '@/components/calculator/ResultDisplay';
import { ValidatedInput } from '@/components/calculator/ValidatedInput';
import { CalculatorErrorBoundary } from '@/components/calculator/CalculatorErrorBoundary';
import { Utensils, Info, Flame, ChevronRight, Plus, Trash2, Dumbbell } from 'lucide-react';

const MOMO_TYPES = [
  { id: 'buff', name: 'Buff Momo (Steamed)', calories: 35, protein: 3.2, fat: 1.8, carbs: 3.5 },
  { id: 'chicken', name: 'Chicken Momo (Steamed)', calories: 30, protein: 2.8, fat: 1.2, carbs: 3.2 },
  { id: 'veg', name: 'Veg Momo (Steamed)', calories: 24, protein: 0.8, fat: 0.6, carbs: 4.8 },
  { id: 'cmomo', name: 'C-Momo (Spicy)', calories: 48, protein: 2.5, fat: 2.5, carbs: 5.5 },
  { id: 'fried', name: 'Fried Momo', calories: 62, protein: 3.0, fat: 4.2, carbs: 3.8 },
];

export default function MomoCalculator() {
  const [items, setItems] = useState([{ typeId: 'buff', count: 10 }]);

  const result = useMemo(() => {
    let totalCals = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    items.forEach(item => {
      const type = MOMO_TYPES.find(t => t.id === item.typeId);
      if (type) {
        totalCals += type.calories * item.count;
        totalProtein += type.protein * item.count;
        totalFat += type.fat * item.count;
        totalCarbs += type.carbs * item.count;
      }
    });

    return { 
      totalCals, 
      totalProtein: totalProtein.toFixed(1),
      totalFat: totalFat.toFixed(1),
      totalCarbs: totalCarbs.toFixed(1),
      plates: (totalCals / 350).toFixed(1)
    };
  }, [items]);

  const updateItem = (index: number, field: string, value: any) => {
    const list = [...items];
    (list[index] as any)[field] = value;
    setItems(list);
  };

  const addItem = () => setItems([...items, { typeId: 'buff', count: 10 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  return (
    <CalculatorErrorBoundary calculatorName="Momo Calorie Counter">
      <JsonLd 
        type="calculator" 
        name="Momo Calorie Counter 🥟" 
        description="The ultimate fitness tool for Nepal. Calculate calories, protein, and macros for Buff, Chicken, and Veg Momos." 
        url="https://calcpro.com.np/calculator/momo-calorie-counter" 
      />

      <CalcWrapper
        title="Momo Fitness Suite"
        description="A specialized nutritional tool for Nepal's favorite dish. Track calories and macronutrients for diverse Momo varieties."
        crumbs={[{label:'health',href:'/calculator?cat=health'}, {label:'momo counter'}]}
        isNepal
        relatedCalcs={[{name:'BMI Calc',slug:'bmi'},{name:'Calorie Needs',slug:'calorie-calculator'}]}
        formula="Total Calories = Σ (Momo Type kcal × Quantity)"
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 block mb-2">Select Variety</label>
                        <div className="relative">
                          <select 
                            value={item.typeId} 
                            onChange={e => updateItem(idx, 'typeId', e.target.value)}
                            className="w-full bg-white dark:bg-gray-950 border-2 border-transparent focus:border-blue-500 rounded-2xl h-14 px-5 text-xs font-black outline-none appearance-none cursor-pointer shadow-sm">
                            {MOMO_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                      </div>
                      <ValidatedInput
                        label="Qty (pcs)"
                        value={item.count}
                        onChange={v => updateItem(idx, 'count', v)}
                        min={1}
                        max={100}
                      />
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                       {[5, 10, 20].map(p => (
                         <button 
                           key={p} 
                           onClick={() => updateItem(idx, 'count', p)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${item.count === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-blue-500'}`}
                         >
                           {p === 5 ? 'Half' : p === 10 ? 'Full' : 'Double'} Plate
                         </button>
                       ))}
                    </div>

                    {items.length > 1 && (
                      <button 
                        onClick={() => removeItem(idx)} 
                        className="absolute -top-3 -right-3 w-10 h-10 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-all shadow-red-200/50"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button 
                  onClick={addItem} 
                  className="w-full h-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 hover:text-blue-600 transition-all font-black"
                >
                  <Plus className="w-5 h-5" /> Mix Another Plate
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm group overflow-hidden relative transition-all hover:bg-orange-50/20">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Utensils className="w-24 h-24" />
               </div>
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 px-2 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Macronutrient Breakdown
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-800/50">
                    <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest block mb-1">Protein</span>
                    <span className="text-xl font-black text-blue-700 dark:text-blue-300 font-mono tracking-tighter">{result.totalProtein}g</span>
                  </div>
                  <div className="p-6 bg-red-50/50 dark:bg-red-900/10 rounded-3xl border border-red-100/50 dark:border-red-800/50">
                    <span className="text-[8px] font-black uppercase text-red-400 tracking-widest block mb-1">Fat</span>
                    <span className="text-xl font-black text-red-700 dark:text-red-300 font-mono tracking-tighter">{result.totalFat}g</span>
                  </div>
                  <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100/50 dark:border-amber-800/50">
                    <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest block mb-1">Carbs</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tighter">{result.totalCarbs}g</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-10">
            <ResultDisplay
              title="Calorie Intake"
              primaryResult={{
                label: 'Total Estimated Energy',
                value: `${result.totalCals} kcal`,
                description: `Equivalent to ${result.plates} Plates`,
                bgColor: 'bg-orange-500',
                color: 'text-white'
              }}
              secondaryResults={[
                { label: 'Protien Score', value: `${result.totalProtein}g` },
                { label: 'Macro Match', value: 'Moderate' },
                { label: 'Activity Goal', value: '30m Walk' },
                { label: 'Calorie Density', value: 'Standard' }
              ]}
              onShare={() => {}}
            />

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
               <Dumbbell className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fitness Insight</div>
               <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                  {result.totalCals > 600 ? 'High energy meal detected. Consider a high-intensity workout session or long trek to maintain your caloric balance.' : 
                  'Perfect balanced portion for a light meal. Steamed varieties remain the healthiest choice for regular consumption.'}
               </p>
            </div>

            <ShareResult title="My Momo Calorie Stats" result={`${result.totalCals} kcal`} calcUrl="https://calcpro.com.np/calculator/momo-calorie-counter" />
          </div>
        </div>

        <div className="mt-16">
          <CalcFAQ faqs={[
            { question: 'What is the healthiest type of Momo?', answer: 'Steamed Veg Momos are generally the lowest in calories (approx 24 kcal per piece), followed by Steamed Chicken (30 kcal).' },
            { question: 'Why are Fried Momos so high in calories?', answer: 'Deep frying adds significant saturated fat, increasing the calorie count by nearly 100% compared to steamed versions.' }
          ]} />
        </div>
      </CalcWrapper>
    </CalculatorErrorBoundary>
  );
}
