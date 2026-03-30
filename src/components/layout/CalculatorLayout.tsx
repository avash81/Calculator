'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Info, HelpCircle, ArrowRight } from 'lucide-react';
import { NepalFlag } from '@/components/ui/NepalFlag';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  category: string;
  categoryHref: string;
  focusKeyword: string;
  faqs: { question: string; answer: string }[];
  relatedCalcs?: { label: string; href: string; icon: ReactNode; desc: string }[];
  lastUpdated?: string;
  isNepal?: boolean;
  children: [ReactNode, ReactNode]; // [Inputs, Results]
}

export default function CalculatorLayout({
  title,
  description,
  category,
  categoryHref,
  faqs,
  relatedCalcs = [],
  lastUpdated = 'March 2026',
  isNepal = false,
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="page-container py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight className="breadcrumb-sep" />
        <Link href={categoryHref}>{category}</Link>
        <ChevronRight className="breadcrumb-sep" />
        <span className="text-cp-text font-medium">{title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-display tracking-tight">{title}</h1>
            {isNepal ? (
              <span className="badge badge-nepal"><NepalFlag /> NEPAL RULES</span>
            ) : (
              <span className="badge badge-blue">FREE TOOL</span>
            )}
          </div>
          <p className="text-base text-cp-text-muted leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-cp-text-light uppercase tracking-widest whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          Last updated: {lastUpdated}
        </div>
      </header>

      {/* Nepal Disclaimer */}
      {isNepal && (
        <div className="nepal-disclaimer mb-8 flex gap-3 items-start">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Official Data:</strong> This calculator is based on Nepal Inland Revenue Department (IRD) rules for FY 2082/83. 
            While highly accurate, please verify complex filings with a certified Chartered Accountant.
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="calc-grid">
        {/* Left: Inputs */}
        <div className="calc-inputs">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-cp-divider">
            <div className="w-1.5 h-5 bg-cp-blue rounded-full" />
            <h2 className="text-h3 uppercase tracking-widest font-bold text-cp-text-muted">Input Details</h2>
          </div>
          <div className="space-y-8">
            {children[0]}
          </div>
        </div>

        {/* Right: Results */}
        <div className="calc-results">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-cp-divider">
            <div className="w-1.5 h-5 bg-cp-green rounded-full" />
            <h2 className="text-h3 uppercase tracking-widest font-bold text-cp-text-muted">Calculation Results</h2>
          </div>
          <div className="space-y-6">
            {children[1]}
          </div>
          
          <div className="mt-8 p-4 bg-cp-bg rounded-xl border border-cp-border border-dashed text-center">
            <p className="text-xs text-cp-text-muted mb-3">Found this helpful? Share with your friends.</p>
            <button className="btn-secondary w-full py-2.5 text-xs">Copy Result Link</button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="mt-20 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-6 h-6 text-cp-blue" />
          <h2 className="text-h2">How to use this calculator</h2>
        </div>
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-full bg-cp-blue-light text-cp-blue flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-bold mb-2">Enter your data</h4>
              <p className="text-sm text-cp-text-muted">Fill in the required fields in the input panel. Use the sliders for quick adjustments or type exact values for precision.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-full bg-cp-blue-light text-cp-blue flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-bold mb-2">Review real-time results</h4>
              <p className="text-sm text-cp-text-muted">Watch the results panel update instantly as you change inputs. No need to click &quot;submit&quot; or &quot;calculate&quot;.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-full bg-cp-blue-light text-cp-blue flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-bold mb-2">Analyze the breakdown</h4>
              <p className="text-sm text-cp-text-muted">Scroll down to see detailed tables, charts, or slab-wise breakdowns of how the final numbers were reached.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 max-w-3xl">
        <h2 className="text-h2 mb-8">Frequently Asked Questions</h2>
        <div className="border-t border-cp-border">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item group">
              <summary className="faq-question">
                {faq.question}
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </summary>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      {relatedCalcs.length > 0 && (
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2">You may also need</h2>
            <Link href="/calculators" className="text-sm font-bold text-cp-blue hover:underline flex items-center gap-1">
              View all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCalcs.map((calc) => (
              <Link key={calc.href} href={calc.href} className="calc-card">
                <span className="calc-card-icon">{calc.icon}</span>
                <h3 className="calc-card-name">{calc.label}</h3>
                <p className="calc-card-desc">{calc.desc}</p>
                <span className="calc-card-link">Try now →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}
