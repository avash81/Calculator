'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CALCULATORS } from '@/data/calculators';
import { Search, ArrowRight } from 'lucide-react';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [q, setQ] = useState(queryParam);

  useEffect(() => {
    setQ(queryParam);
  }, [queryParam]);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    return CALCULATORS.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.keywords?.some(k => k.toLowerCase().includes(s))
    );
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Search <span className="text-blue-600">Calculators</span>
        </h1>
        <p className="text-gray-600">
          Find exactly what you need from our library of 80+ tools.
        </p>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          autoFocus
          placeholder="Type to search (e.g. 'tax', 'loan', 'bmi')..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="block w-full pl-14 pr-6 py-5 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-blue-500 shadow-sm hover:border-gray-300 transition-all outline-none"
        />
      </div>

      {q.trim().length >= 2 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Search Results ({results.length})
            </h2>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map(calc => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
              <p className="text-gray-500">No calculators match your search.</p>
              <button 
                onClick={() => setQ('')}
                className="mt-4 text-blue-600 font-semibold hover:underline"
              >
                Clear search and try again
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Income Tax', 'EMI', 'Nepali Date', 'BMI', 'GPA', 'VAT', 'Salary'].map(term => (
              <button
                key={term}
                onClick={() => setQ(term)}
                className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
              >
                {term}
              </button>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-50">
            <Link href="/calculator" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
              Browse All Calculators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-cp-bg font-sans py-12 sm:py-20 px-4">
      <Suspense fallback={<div className="text-center py-20">Loading search...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
