import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nepal Calculator Guides — Free SEO Resources | CalcPro.NP',
  description: 'Free guides on Nepal income tax, EMI, Nepali date conversion, GPA, and more. Written by CalcPro.NP team.',
  alternates: { canonical: 'https://calcpro.com.np/guide' },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700
                          text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Free Nepal Guides
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Nepal Calculator Guides
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Detailed guides on Nepal tax rules, finance, health, and education
            calculators — updated for FY 2082/83.
          </p>
        </div>
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Guides coming soon.</p>
          <Link href="/blog" className="text-blue-600 hover:underline text-sm mt-2 block">
            Browse Blog Posts →
          </Link>
        </div>
      </div>
    </div>
  );
}
