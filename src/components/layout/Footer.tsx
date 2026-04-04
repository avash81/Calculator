'use client';
import Link from 'next/link';
import { Globe, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--border)] py-6 mt-8 text-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid: 6 Pillars of Utility */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-6 mb-6">
          
          {/* Identity Column */}
          <div className="col-span-2 lg:col-span-1 border-r border-gray-200 pr-4">
            <div className="mb-2">
              <Logo />
            </div>
            <p className="text-gray-700 text-[11px] leading-snug font-bold uppercase tracking-wider">
              75+ Global Precision Tools. <br/>
              Fast. Universal. Private.
            </p>
          </div>

          {/* Finance Column */}
          <div>
            <h3 className="text-gray-900 font-black mb-2 uppercase tracking-wider text-[11px]">Finance</h3>
            <ul className="space-y-1.5 text-[12px] font-bold text-gray-700">
              <li><Link href="/calculator/loan-emi" className="hover:text-[var(--primary)] transition-colors">EMI Engine</Link></li>
              <li><Link href="/calculator/sip-calculator" className="hover:text-[var(--primary)] transition-colors">SIP Wealth</Link></li>
              <li><Link href="/calculator/nepal-income-tax" className="hover:text-[var(--primary)] transition-colors">Nepal Tax 2082</Link></li>
              <li><Link href="/calculator/discount-calculator" className="hover:text-[var(--primary)] transition-colors">Discount Calc</Link></li>
            </ul>
          </div>

          {/* Health Column */}
          <div>
            <h3 className="text-gray-900 font-black mb-2 uppercase tracking-wider text-[11px]">Health</h3>
            <ul className="space-y-1.5 text-[12px] font-bold text-gray-700">
              <li><Link href="/calculator/bmi" className="hover:text-[var(--primary)] transition-colors">BMI Professional</Link></li>
              <li><Link href="/calculator/bmr" className="hover:text-[var(--primary)] transition-colors">Basal Metabolic</Link></li>
              <li><Link href="/calculator/momo-calorie-counter" className="hover:text-[var(--primary)] transition-colors italic">Momo Intake</Link></li>
              <li><Link href="/calculator/pregnancy-due-date" className="hover:text-[var(--primary)] transition-colors">Due Date Hub</Link></li>
            </ul>
          </div>

          {/* Scientific Column */}
          <div>
            <h3 className="text-gray-900 font-black mb-2 uppercase tracking-wider text-[11px]">Scientific</h3>
            <ul className="space-y-1.5 text-[12px] font-bold text-gray-700">
              <li><Link href="/calculator/scientific-calculator" className="hover:text-[var(--primary)] transition-colors">Matrix Hub</Link></li>
              <li><Link href="/calculator/concrete-mix" className="hover:text-[var(--primary)] transition-colors">Concrete Mix</Link></li>
              <li><Link href="/calculator/geometry-3d" className="hover:text-[var(--primary)] transition-colors">3D Geometry</Link></li>
              <li><Link href="/calculator/physics-force" className="hover:text-[var(--primary)] transition-colors">Physics Lab</Link></li>
            </ul>
          </div>

          {/* Academic Column */}
          <div>
            <h3 className="text-gray-900 font-black mb-2 uppercase tracking-wider text-[11px]">Academic</h3>
            <ul className="space-y-1.5 text-[12px] font-bold text-gray-700">
              <li><Link href="/calculator/gpa" className="hover:text-[var(--primary)] transition-colors">GPA Suite</Link></li>
              <li><Link href="/calculator/cgpa" className="hover:text-[var(--primary)] transition-colors">CGPA Master</Link></li>
              <li><Link href="/calculator/age-calculator" className="hover:text-[var(--primary)] transition-colors">Chronicle Age</Link></li>
              <li><Link href="/calculator/rounding" className="hover:text-[var(--primary)] transition-colors">Precision Rounding</Link></li>
            </ul>
          </div>

          {/* System Column */}
          <div>
            <h3 className="text-gray-900 font-black mb-2 uppercase tracking-wider text-[11px]">System</h3>
            <ul className="space-y-1.5 text-[12px] font-bold text-gray-700">
              <li><Link href="/blog" className="hover:text-[var(--primary)] transition-colors">Resources</Link></li>
              <li><Link href="/about" className="hover:text-[var(--primary)] transition-colors">Our Mission</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Shield</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--primary)] transition-colors">Direct Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Professional Verification and Compliance */}
        <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="text-[var(--primary)] text-[11px] font-black uppercase tracking-wider">
              © {currentYear} Calcly.com
            </div>
            <div className="hidden md:block w-px h-3 bg-gray-300 mx-1"></div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-wider"><ShieldCheck className="w-3 h-3 text-[#006600]" /> GDPR COMPLIANT</span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-wider"><Zap className="w-3 h-3 text-amber-500" /> GREEN CLOUD</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded"><Globe className="w-3 h-3" /> Universal v4.2.0</span>
            <span className="hidden md:block w-1 h-1 bg-[var(--primary)] rounded-full"></span>
            <span className="text-gray-700">Academic Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
