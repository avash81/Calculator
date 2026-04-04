'use client';
import React from 'react';
import Link from 'next/link';

interface CalculatorLayoutProps {
  children?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  category?: string | { label: string; href: string };
  categoryHref?: string;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  faqSection?: React.ReactNode;
  focusKeyword?: string;
}

export function CalculatorLayout({
  children,
  title,
  description,
  category,
  categoryHref,
  leftPanel,
  rightPanel,
  faqSection
}: CalculatorLayoutProps) {
  const catLabel = typeof category === 'object' ? category.label : category;
  const catLink = typeof category === 'object' ? category.href : categoryHref;

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* 1. Slim Navy Breadcrumb/Header */}
      <div className="bg-[#083366] text-white/80 py-2 border-b border-white/5">
        <div className="hp-container flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {catLabel && (
            <>
              <span className="opacity-30">/</span>
              <Link href={catLink || '/calculator'} className="hover:text-white transition-colors">
                {catLabel}
              </Link>
            </>
          )}
          <span className="opacity-30">/</span>
          <span className="text-white truncate">{title}</span>
        </div>
      </div>

      <main className="hp-container py-8">
        {/* 2. Professional Header Section */}
        <header className="mb-10 border-b border-[#CCCCCC] pb-8">
          <h1 className="text-3xl font-black text-[#006600] tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-[14px] text-[#333333] leading-relaxed max-w-4xl">
            {description}
          </p>
        </header>

        {/* 3. Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-12 items-start">
          {leftPanel && rightPanel ? (
            <>
              {/* Refactored 60/40 Split */}
              <section className="lg:col-span-6 space-y-8">
                <div className="bg-white">
                  {leftPanel}
                </div>
              </section>
              <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-20">
                <div className="bg-white">
                  {rightPanel}
                </div>
              </aside>
            </>
          ) : (
            <>
              {/* Backwards Compatible Single Column */}
              <section className="lg:col-span-7 space-y-8">
                {children}
              </section>
              <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-20">
                <div className="p-6 bg-[#F8F8F8] border border-[#CCCCCC]">
                  <h4 className="text-xs font-bold uppercase text-[#000000] mb-4 tracking-normal">Quick Navigation</h4>
                  <nav className="space-y-3">
                    <Link href="/calculator" className="block text-[13px] text-[#0000CC] font-bold hover:underline">View All Tools</Link>
                    <Link href="/blog" className="block text-[13px] text-[#0000CC] font-bold hover:underline">Expert Guides</Link>
                    <Link href="/calculator/category/finance" className="block text-[13px] text-[#0000CC] font-bold hover:underline">Finance Tools</Link>
                  </nav>
                </div>
              </aside>
            </>
          )}
        </div>

        {/* 4. Shared FAQ/Detail Section */}
        {faqSection && (
          <section className="mt-16 pt-12 border-t border-[#CCCCCC]">
             <div className="prose prose-slate max-w-none">
                {faqSection}
             </div>
          </section>
        )}
      </main>

      {/* 5. Minimal Bottom Link Bar */}
      <footer className="mt-24 py-12 bg-[#F8F8F8] border-t border-[#CCCCCC]">
        <div className="hp-container text-center">
           <p className="text-[12px] text-[#666666] font-bold uppercase tracking-widest">
             © 2026 Calcly — Precision Professional Utility Suite
           </p>
        </div>
      </footer>
    </div>
  );
}
