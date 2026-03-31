'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  crumbs: { label: string; href?: string }[];
  isNepal?: boolean;
  relatedCalcs?: { name: string; slug: string }[];
  children: ReactNode;
  formula?: string;
}

export function CalcWrapper({
  title, description, crumbs, isNepal,
  relatedCalcs = [], children, formula,
}: Props) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">

        {/* ── BREADCRUMBS & BACK BUTTON ──────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">home</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-gray-300 dark:text-gray-700">/</span>
                {c.href ? (
                  <Link href={c.href} className="text-blue-600 dark:text-blue-400 hover:underline">{c.label}</Link>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          
          <Link 
            href={crumbs.length > 0 && crumbs[0].href ? crumbs[0].href : '/'} 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-all w-fit shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            BACK TO TOOLS
          </Link>
        </div>

        {/* ── HEADER ────────────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
            {description}
          </p>
          
          {isNepal && (
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-full px-4 py-1.5 mt-6">
              <span className="w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              Verified Nepal FY 2082/83
            </div>
          )}
        </header>

        {/* ── MAIN TOOL ─────────────────────────────────────────── */}
        <main className="mb-8">
          {children}
        </main>

        {/* ── METHODOLOGY ───────────────────────────────────────── */}
        {formula && (
           <section className="mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 mb-8">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-600 rounded-full" />
                Calculation Methodology
              </h2>
              <div className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 inline-block shadow-sm">
                {formula}
              </div>
              <p className="mt-6 text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest max-w-xl">
                Formula verified against standard industry benchmarks and Nepal IRD guidelines where applicable. 
                Values provided are estimates and should not be used as the sole basis for critical financial or medical decisions.
              </p>
           </section>
        )}

        {/* ── RELATED ───────────────────────────────────────────── */}
        <footer className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 space-y-16">
          {relatedCalcs.length > 0 && (
            <div>
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Discover More Precision Tools</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedCalcs.map(c => (
                  <Link key={c.slug} href={`/calculator/${c.slug}`}
                    className="p-5 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-transparent hover:border-blue-100 dark:hover:border-blue-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Legal Disclaimer - CRITICAL for YMYL Authority */}
          <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-50 dark:border-red-900/20 rounded-[2.5rem] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-[2px] bg-red-600" />
               <h3 className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-[0.2em]">Disclaimer & Trust Certificate</h3>
            </div>
            <p className="text-xs text-red-600/70 dark:text-red-400/60 leading-relaxed font-semibold">
              The results provided by CalcPro.NP calculators are for informational and planning purposes only. We do not provide professional financial, legal, or medical advice. For complex tax liability, investment risk assessments, or health-critical diagnostics, consult a certified expert. We maintain 100% transparency in our algorithms, updated for Nepal FY 2082/83.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-12 border-t border-gray-50 dark:border-gray-900/50">
            <div className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.3em]">
              &copy; 2026 CalcPro Nepal &middot; Precision Engineering
            </div>
            <div className="flex gap-6">
               <Link href="/about" className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest">About</Link>
               <Link href="/contact" className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest">Support</Link>
               <Link href="/terms" className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest">Terms</Link>
            </div>
          </div>
        </footer>

        {/* ── JSON-LD SCHEMA BUNDLE ─────────────────────────────── */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'BreadcrumbList',
                  'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://calcpro.com.np' },
                    ...crumbs.map((c, i) => ({
                      '@type': 'ListItem',
                      'position': i + 2,
                      'name': c.label,
                      'item': c.href ? `https://calcpro.com.np${c.href}` : undefined
                    })).filter(x => x.item)
                  ]
                },
                {
                   '@type': 'SoftwareApplication',
                   'name': title,
                   'operatingSystem': 'All',
                   'applicationCategory': 'FinanceApplication, EducationalApplication',
                   'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'NPR' }
                }
              ]
            }),
          }}
        />
      </div>
    </div>
  );
}
