'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CALCULATORS, CATEGORIES } from '@/data/calculators';
import { Search } from 'lucide-react';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';

function CalculatorsListInner() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (catParam) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(search.toLowerCase()) || 
                          calc.description.toLowerCase().includes(search.toLowerCase()) ||
                          calc.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || calc.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
          All <span className="text-blue-600">Calculators</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our complete library of professional-grade tools. From complex financial projections to Nepal-specific tax rules.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-8 mb-16 max-w-4xl mx-auto">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for a calculator (e.g. 'Income Tax', 'EMI')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 text-base sm:text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 shadow-sm hover:border-gray-300 transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
              activeCategory === 'all' 
                ? "bg-blue-600 text-white border-transparent" 
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
                activeCategory === cat.id 
                  ? "bg-blue-600 text-white border-transparent" 
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCalculators.map((calc) => (
          <CalculatorCard key={calc.id} calc={calc} />
        ))}
      </div>

      {filteredCalculators.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No calculators found</h3>
          <p className="text-gray-500 text-lg">Try searching for something else or browse by category.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Wrapper that provides Suspense boundary for useSearchParams.
 * Required by Next.js 14 — useSearchParams must be wrapped in Suspense.
 */
export default function CalculatorsList() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cp-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cp-blue" />
      </div>
    }>
      <CalculatorsListInner />
    </Suspense>
  );
}
