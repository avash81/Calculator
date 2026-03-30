'use client';

import { useParams } from 'next/navigation';
import { CATEGORIES } from '@/data/calculators';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!category) return null;

  return (
    <div className="page-container py-12 md:py-20">
      <div className="mb-12">
        <Link href="/calculators" className="inline-flex items-center gap-2 text-cp-text-light hover:text-cp-blue transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="w-4 h-4" /> All Categories
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="w-16 h-16 bg-cp-surface border border-cp-border rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm">
            {category.icon}
          </div>
          <h1 className="text-display mb-4">
            {category.name} <span className="text-cp-blue">Tools.</span>
          </h1>
          <p className="text-cp-text-muted max-w-2xl text-lg">
            Professional tools for {category.name.toLowerCase()} specifically designed for the Nepali market.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-4xl font-black text-cp-text leading-none">{category.calculators.length}</div>
          <div className="text-xs font-bold text-cp-text-light uppercase tracking-widest">Calculators</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.calculators.map((calc) => (
          <Link key={calc.id} href={`/calculators/${category.id}/${calc.slug}`} className="calc-card">
            <div className="calc-card-icon">{calc.icon}</div>
            <h3 className="calc-card-name">{calc.name}</h3>
            <p className="calc-card-desc">{calc.description}</p>
            <div className="calc-card-link">Open Calculator →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
