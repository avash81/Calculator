'use client';

import { Button } from '@/components/ui';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-cp-bg">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cp-blue-light/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cp-green-light/30 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cp-border shadow-cp-sm mb-10"
        >
          <Sparkles className="w-4 h-4 text-cp-gold" />
          <span className="text-[10px] font-bold text-cp-text-muted uppercase tracking-widest">Nepal&apos;s #1 SaaS Calculator Engine</span>
        </div>

        {/* Main Headline */}
        <h1 
          className="display-text text-cp-text leading-tight mb-8"
        >
          Precision for <span className="text-cp-blue">Nepal.</span>
        </h1>

        {/* Subheadline */}
        <p 
          className="max-w-2xl mx-auto text-sm md:text-base text-cp-text-muted mb-10 leading-relaxed"
        >
          Calculate your Nepal income tax, loan EMIs, and health metrics instantly with tools tailored for Nepal&apos;s unique rules.
        </p>

        {/* Actions */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/calculators">
            <Button variant="primary" className="h-12 px-8 text-sm font-medium rounded-lg shadow-cp-sm flex items-center gap-2 group">
              Calculate Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/calculator">
            <Button variant="outline" className="h-12 px-8 text-sm font-medium rounded-lg flex items-center gap-2">
              View Formula
            </Button>
          </Link>
        </div>

        {/* Stats/Trust */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto pt-20 border-t border-cp-divider"
        >
          <div className="space-y-1">
            <div className="text-4xl font-black text-cp-text">80+</div>
            <div className="text-[10px] font-bold text-cp-text-light uppercase tracking-widest">Calculators</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black text-cp-text">100%</div>
            <div className="text-[10px] font-bold text-cp-text-light uppercase tracking-widest">Nepal Compliant</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black text-cp-text">10k+</div>
            <div className="text-[10px] font-bold text-cp-text-light uppercase tracking-widest">Monthly Users</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-black text-cp-text">0.1s</div>
            <div className="text-[10px] font-bold text-cp-text-light uppercase tracking-widest">Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
