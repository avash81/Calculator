'use client';
import Link from 'next/link';
import { TrendingUp, Globe, Calculator, Zap, MoveUpRight, Clock, Clipboard, Briefcase, CalendarDays, ReceiptText, Landmark, ChevronRight } from 'lucide-react';
import { CALCULATORS } from '@/data/calculators';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const popular = CALCULATORS.filter(c => ['loan-emi', 'bmi', 'sip', 'gpa', 'compound'].includes(c.id));

  if (!mounted) return null;

  return (
    <div className="w-full lg:w-[380px] space-y-4 shrink-0">
      
      {/* CARD 1: NEPAL TOOLS */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
        
        <div className="mb-4">
           <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
              <div className="w-1 h-1 rounded-full bg-red-500" />
              Nepal Specific
           </div>
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-3">Nepal Tools</h3>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Income Tax 2082/83', slug: 'nepal-income-tax', hot: true, icon: Clipboard },
            { name: 'Salary Calculator', slug: 'nepal-salary', hot: true, icon: Briefcase },
            { name: 'Nepali Date Converter', slug: 'nepali-date', icon: CalendarDays },
            { name: 'VAT Calculator', slug: 'nepal-vat', icon: ReceiptText },
            { name: 'Provident Fund (PF)', slug: 'nepal-provident-fund', icon: Landmark }
          ].map(tool => (
            <Link 
              key={tool.slug} 
              href={`/calculator/${tool.slug}`}
              className="group/item flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-red-50 transition-colors">
                    <tool.icon className="w-4 h-4 text-gray-400 group-hover/item:text-red-500" strokeWidth={2.5} />
                 </div>
                 <span className="text-sm font-bold text-gray-700 group-hover/item:text-gray-900">{tool.name}</span>
                 {tool.hot && <span className="text-[8px] bg-[#FFC107]/20 text-[#D48806] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-[#FFC107]/30">HOT</span>}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 group-hover/item:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* CARD 2: POPULAR RIGHT NOW */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Popular Right Now</h3>
        <div className="space-y-3">
          {popular.map(tool => (
            <Link 
              key={tool.id} 
              href={`/calculator/${tool.slug}`}
              className="group/item flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-base">
                    {tool.icon as string}
                 </div>
                 <span className="text-sm font-bold text-gray-700 group-hover/item:text-[#1A73E8]">{tool.name}</span>
                 {tool.id === 'loan-emi' && <span className="text-[8px] bg-[#FFC107]/20 text-[#D48806] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-[#FFC107]/30">HOT</span>}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 group-hover/item:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* CARD 3: QUICK CONVERSION */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Conversion</h3>
        <div className="grid grid-cols-2 gap-3">
           {['NPR ↔ USD', 'km ↔ miles', '°C ↔ °F', 'kg ↔ lbs'].map(conv => (
             <Link 
               key={conv} 
               href="/calculator/unit-converter"
               className="h-11 border border-gray-100 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all bg-white shadow-sm"
             >
               {conv}
             </Link>
           ))}
        </div>
        <Link href="/calculator/unit-converter" className="mt-4 block text-[10px] font-black text-[#1A73E8] uppercase tracking-widest text-center hover:underline">View all converters →</Link>
      </div>

    </div>
  );
}
