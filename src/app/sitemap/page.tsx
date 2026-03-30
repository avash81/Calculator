'use client';

import { CATEGORIES } from '@/data/calculators';
import Link from 'next/link';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';

export default function SitemapPage() {
  return (
    <CalcWrapper
      title="Sitemap"
      description="Complete directory of all calculators and tools available on CalcPro.NP."
      crumbs={[{label:'sitemap'}]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-12">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
            </div>
            <ul className="space-y-3">
              {cat.calculators.map(calc => (
                <li key={calc.id}>
                  <Link 
                    href={`/calculator/${calc.slug}`}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{calc.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{calc.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="text-2xl">📄</span>
            <h2 className="text-xl font-bold text-gray-900">Pages</h2>
          </div>
          <ul className="space-y-3">
            {[
              { name: 'Home', href: '/' },
              { name: 'All Calculators', href: '/calculator' },
              { name: 'Blog', href: '/blog' },
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Terms of Service', href: '/terms' },
              { name: 'Search', href: '/search' },
            ].map(page => (
              <li key={page.href}>
                <Link 
                  href={page.href}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{page.name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CalcWrapper>
  );
}
