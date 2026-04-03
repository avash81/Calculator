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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.calculators.map((calc) => (
            <Link 
              key={calc.id} 
              href={`/calculator/${calc.slug}`}
              className="group bg-white border border-gray-100 hover:border-google-blue p-8 rounded-[2.5rem] transition-all hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{calc.icon}</span>
                {calc.isHot && (
                  <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">Hot</span>
                )}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-google-blue transition-colors">{calc.name}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{calc.description}</p>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-google-blue uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                Open Tool <ArrowRight className="w-3 h-3" />
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
