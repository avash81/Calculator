'use client';
import Link from 'next/link';
import { Globe, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-10">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-12 mb-12">
          
          <div className="col-span-2 lg:col-span-1 border-r border-slate-900 pr-8">
            <div className="mb-4">
              <Logo theme="white" />
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest">
              75+ Global Precision Tools. <br/>
              Fast. Universal. Private.
            </p>
          </div>

          <div>
            <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[11px]">Finance</h3>
            <ul className="space-y-3 text-[12px] font-bold text-slate-400">
              <li><Link href="/calculator/loan-emi" className="hover:text-blue-400 transition-colors">EMI Engine</Link></li>
              <li><Link href="/calculator/sip-calculator" className="hover:text-blue-400 transition-colors">SIP Wealth</Link></li>
              <li><Link href="/calculator/nepal-income-tax" className="hover:text-blue-400 transition-colors">Nepal Tax 2082</Link></li>
              <li><Link href="/calculator/discount-calculator" className="hover:text-blue-400 transition-colors">Discount Calc</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[11px]">Health</h3>
            <ul className="space-y-3 text-[12px] font-bold text-slate-400">
              <li><Link href="/calculator/bmi" className="hover:text-blue-400 transition-colors">BMI Professional</Link></li>
              <li><Link href="/calculator/bmr" className="hover:text-blue-400 transition-colors">Basal Metabolic</Link></li>
              <li><Link href="/calculator/momo-calorie-counter" className="hover:text-blue-400 transition-colors italic">Momo Intake</Link></li>
              <li><Link href="/calculator/pregnancy-due-date" className="hover:text-blue-400 transition-colors">Due Date Hub</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[11px]">Scientific</h3>
            <ul className="space-y-3 text-[12px] font-bold text-slate-400">
              <li><Link href="/calculator/scientific-calculator" className="hover:text-blue-400 transition-colors">Matrix Hub</Link></li>
              <li><Link href="/calculator/concrete-mix" className="hover:text-blue-400 transition-colors">Concrete Mix</Link></li>
              <li><Link href="/calculator/geometry-3d" className="hover:text-blue-400 transition-colors">3D Geometry</Link></li>
              <li><Link href="/calculator/physics-force" className="hover:text-blue-400 transition-colors">Physics Lab</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[11px]">Academic</h3>
            <ul className="space-y-3 text-[12px) font-bold text-slate-400">
              <li><Link href="/calculator/gpa" className="hover:text-blue-400 transition-colors">GPA Suite</Link></li>
              <li><Link href="/calculator/cgpa" className="hover:text-blue-400 transition-colors">CGPA Master</Link></li>
              <li><Link href="/calculator/age-calculator" className="hover:text-blue-400 transition-colors">Chronicle Age</Link></li>
              <li><Link href="/calculator/rounding" className="hover:text-blue-400 transition-colors">Precision Rounding</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4 uppercase tracking-widest text-[11px]">System</h3>
            <ul className="space-y-3 text-[12px] font-bold text-slate-400">
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Our Mission</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Shield</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Direct Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-white text-[11px] font-black uppercase tracking-widest">
              © {currentYear} Calcly.com
            </div>
            <div className="hidden md:block w-px h-3 bg-slate-800 mx-1"></div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> GDPR COMPLIANT</span>
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Zap className="w-3.5 h-3.5 text-amber-500" /> GREEN CLOUD</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded text-slate-300 border border-slate-800"><Globe className="w-3.5 h-3.5" /> Universal v4.2.0</span>
            <span className="hidden md:block w-1 h-1 bg-blue-500 rounded-full"></span>
            <span className="text-slate-300">Academic Standard</span>
          </div>
        </div>
      </div>
    </footer>

  );
}
