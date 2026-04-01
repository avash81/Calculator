'use client';

import React from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { TrendingSidebar } from '@/components/layout/TrendingSidebar';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  crumbs: { label: string; href?: string }[];
  isNepal?: boolean;
  relatedCalcs?: { name: string; slug: string }[];
  children: ReactNode;
  formula?: string;
}

/**
 * CalcWrapper — Phase 4 Premium Layout & A11y
 * 
 * Standardized wrapper for all 60+ calculators.
 * Implements high-aesthetics grid, sidebar retention, and full ARIA compliance.
 */
export function CalcWrapper({
  title, description, crumbs, isNepal,
  children, formula,
}: Props) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">

        {/* ── BREADCRUMBS & NAVIGATION ──────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <nav aria-label="Breadcrumb" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-800" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{c.label}</Link>
                ) : (
                  <span className="text-gray-800 dark:text-gray-200" aria-current="page">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <Link 
            href={crumbs.length > 0 && crumbs[0].href ? crumbs[0].href : '/'} 
            className="group inline-flex items-center justify-center gap-3 px-6 py-3 text-[10px] font-black text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500 hover:text-blue-600 rounded-2xl transition-all w-fit shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO TOOLS
          </Link>
        </div>

        {/* ── HEADER ────────────────────────────────────────────── */}
        <header className="mb-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium">
            {description}
          </p>
          
          {isNepal && (
            <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border border-red-100/50 dark:border-red-900/20 rounded-2xl px-6 py-2.5 mt-8 animate-in fade-in slide-in-from-left-4">
              <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse shadow-sm shadow-red-500/50" />
              Verified Nepal FY 2082/83
            </div>
          )}
        </header>

        {/* ── CORE CONTENT GRID ────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-10 items-start">
          <main className="space-y-12">
            <section aria-label="Calculator Tool">
              {children}
            </section>

            {/* ── METHODOLOGY ───────────────────────────────────────── */}
            {formula && (
               <section className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-12 shadow-sm animate-in fade-in duration-700">
                  <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    How we calculate
                  </h2>
                  <div className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 inline-block shadow-inner w-full overflow-x-auto whitespace-pre-wrap">
                    {formula}
                  </div>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                      Our algorithms are verified against official Nepal IRD guidelines and international financial standards. 
                      Updated regularly for FY 2082/83 integrity.
                    </p>
                    <div className="flex gap-4 items-center">
                       <div className="h-px bg-gray-50 dark:bg-gray-800 flex-1" />
                       <span className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">Algorithm V4.0.0</span>
                    </div>
                  </div>
               </section>
            )}
          </main>

          {/* ── SIDEBAR (Retention/SEO) ─────────────────────────── */}
          <aside className="sticky top-10 space-y-8 hidden xl:block">
            <TrendingSidebar currentSlug={crumbs.length > 0 ? crumbs[crumbs.length - 1].label.toLowerCase().replace(/\s+/g, '-') : undefined} />
            <div className="bg-blue-600/5 rounded-3xl p-8 border border-blue-100/50 text-center">
               <div className="text-[8px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Power Optimization</div>
               <p className="text-[10px] font-bold text-blue-600/60 leading-relaxed uppercase tracking-widest">
                 CalcPro computations run entirely on your browser for zero latency and maximum privacy.
               </p>
            </div>
          </aside>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-900 space-y-16">
          
          {/* Mobile Trending Hub (only visible on mobile) */}
          <div className="xl:hidden">
            <TrendingSidebar />
          </div>

          <div className="bg-red-50/20 dark:bg-red-950/5 border border-red-50 dark:border-red-900/20 rounded-[2.5rem] p-10 sm:p-14 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-red-600/10 transition-colors" />
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-0.5 bg-red-600" />
               <h3 className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-[0.3em]">Compliance & Transparency</h3>
            </div>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 leading-relaxed font-bold max-w-3xl">
              Calculations provided are for planning and informational purposes only. We maintain strict mathematical integrity aligned with Nepal's 2082/83 regulations. 
              CalcPro.NP is not a substitute for certified financial or legal consultation. All compute cycles remain local to your device.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 pb-16">
            <div className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em]">
              &copy; 2026 CALCPRO NEPAL &middot; AUTOMATED BY CORTEX
            </div>
            <div className="flex gap-8">
               {['About', 'Contact', 'Terms', 'Privacy'].map(link => (
                 <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">{link}</Link>
               ))}
            </div>
          </div>
        </footer>

        {/* ── BREADCRUMB SCHEMA (SEO MASTERY) ──────────────────── */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
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
            })
          }}
        />
      </div>
    </div>
  );
}
