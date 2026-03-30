'use client';

import { useState } from 'react';
import { CALCULATORS } from '@/data/calculators';
import { Search } from 'lucide-react';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';
import { NepalFlag } from '@/components/ui/NepalFlag';

export default function NepalCalculatorsPage() {
  const [search, setSearch] = useState('');

  const nepalCalculators = CALCULATORS.filter(calc => calc.isNepal);
  
  const filteredCalculators = nepalCalculators.filter(calc => {
    return calc.name.toLowerCase().includes(search.toLowerCase()) || 
           calc.description.toLowerCase().includes(search.toLowerCase()) ||
           calc.keywords?.some(k => k.includes(search.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-cp-bg font-sans py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <NepalFlag />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Nepal <span className="text-red-600">Calculators</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tools specifically designed for Nepal, including Income Tax (2082/83), Salary, VAT, and more.
          </p>
        </div>

        {/* Search */}
        <div className="space-y-8 mb-16 max-w-4xl mx-auto">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search Nepal tools (e.g. 'Tax', 'Salary')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 text-base sm:text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-red-500 shadow-sm hover:border-gray-300 transition-all outline-none"
            />
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-500 text-lg">Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
}
