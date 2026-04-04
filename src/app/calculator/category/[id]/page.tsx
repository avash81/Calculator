import { CATEGORIES } from '@/data/calculators';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MoveLeft, ArrowRight } from 'lucide-react';
import { PhysicalCalculatorGuide } from '@/components/education/PhysicalCalculatorGuide';

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = CATEGORIES.find(c => c.id === params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-google-blue transition-colors mb-12">
          <MoveLeft className="w-3 h-3" /> Back to all Categories
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-google-gray rounded-[2rem] flex items-center justify-center text-3xl shadow-sm border border-google-border">
              {category.icon}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{category.name}</h1>
              <p className="text-gray-500 font-medium mt-1">Free professional tools & calculators</p>
            </div>
          </div>
          <div className="h-1 w-20 bg-google-blue rounded-full" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {category.calculators.map((calc) => (
            <Link 
              key={calc.id} 
              href={`/calculator/${calc.slug}`}
              className="group bg-white border border-[#E5E5E5] hover:border-[#0000CC] p-4 flex items-start gap-3 transition-colors shrink-0"
            >
              <div className="text-2xl mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{calc.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[14px] font-bold text-[#0000CC] group-hover:underline truncate">{calc.name}</h3>
                  {calc.isHot && (
                    <span className="text-[9px] font-black bg-[var(--accent)] text-white px-1 py-0.5 rounded-sm uppercase tracking-tighter shrink-0">Hot</span>
                  )}
                </div>
                <p className="text-[12px] text-[#666666] leading-tight line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Content Block */}
        <div className="mt-24 pt-12 border-t border-gray-100">
           <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-6">About {category.name} Suite</h2>
           <p className="text-sm text-gray-500 leading-relaxed font-medium">
             Our {category.name} collection features {category.calculators.length} specialized tools designed specifically for the Nepal market. 
             Every calculator in this category follows international standards and Nepal government regulations where applicable. 
             Updates for FY 2082/83 are applied across all financial and legal tools.
           </p>
        </div>

        {/* PHYSICAL CALCULATOR GUIDE (Only for Education) */}
        {params.id === 'education' && <PhysicalCalculatorGuide />}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
  }));
}
