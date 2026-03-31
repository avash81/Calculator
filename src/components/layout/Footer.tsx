'use client';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121416] text-[#f8f9fa] pt-12 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hub Row - High-Density 6 Pillar Architecture */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 mb-12">
          
          {/* Column 1: Branding and Identity */}
          <div className="col-span-2 lg:col-span-1 border-r border-white/5 pr-4">
            <Link href="/" className="flex items-center gap-0.5 group mb-4">
              <span className="text-white font-black text-xl tracking-tighter">CalcPro</span>
              <span className="text-google-blue font-black text-xl tracking-tighter">.NP</span>
            </Link>
            <p className="text-gray-500 text-[10px] leading-relaxed font-bold">
              Nepal&apos;s 75+ precision tools hub. Fast. Private.
            </p>
          </div>

          {/* Column 2: Core Finance */}
          <div>
            <h3 className="text-white font-black mb-5 uppercase tracking-[0.2em] text-[9px] opacity-60">Finance</h3>
            <ul className="space-y-3 text-[10.5px] font-bold text-gray-400">
              <li><Link href="/calculator/loan-emi" className="hover:text-google-blue transition-all">EMI Hub</Link></li>
              <li><Link href="/calculator/sip-calculator" className="hover:text-google-blue transition-all">SIP Returns</Link></li>
              <li><Link href="/calculator/nepal-income-tax" className="hover:text-google-blue transition-all">Income Tax</Link></li>
              <li><Link href="/calculator/nepal-salary" className="hover:text-google-blue transition-all">Salary Calc</Link></li>
            </ul>
          </div>

          {/* Column 3: Daily Health */}
          <div>
            <h3 className="text-white font-black mb-5 uppercase tracking-[0.2em] text-[9px] opacity-60">Health</h3>
            <ul className="space-y-3 text-[10.5px] font-bold text-gray-400">
              <li><Link href="/calculator/bmi" className="hover:text-google-blue transition-all">BMI Master</Link></li>
              <li><Link href="/calculator/momo-calorie-counter" className="hover:text-google-blue transition-all">Momo Intake</Link></li>
              <li><Link href="/calculator/bmr" className="hover:text-google-blue transition-all">BMR/TDEE</Link></li>
              <li><Link href="/calculator/pregnancy-due-date" className="hover:text-google-blue transition-all">Pregnancy</Link></li>
            </ul>
          </div>

          {/* Column 4: Academic Suite */}
          <div>
            <h3 className="text-white font-black mb-5 uppercase tracking-[0.2em] text-[9px] opacity-60">Academic</h3>
            <ul className="space-y-3 text-[10.5px] font-bold text-gray-400">
              <li><Link href="/calculator/gpa" className="hover:text-google-blue transition-all">GPA Suite</Link></li>
              <li><Link href="/calculator/see-gpa-calculator" className="hover:text-google-blue transition-all">SEE GPA</Link></li>
              <li><Link href="/calculator/engineering-gpa-calculator" className="hover:text-google-blue transition-all">Engineering</Link></li>
              <li><Link href="/calculator/scientific-calculator" className="hover:text-google-blue transition-all">Scientific</Link></li>
            </ul>
          </div>

          {/* Column 5: Engineering Hub */}
          <div>
            <h3 className="text-white font-black mb-5 uppercase tracking-[0.2em] text-[9px] opacity-60">Technical</h3>
            <ul className="space-y-3 text-[10.5px] font-bold text-gray-400">
              <li><Link href="/calculator/concrete-mix" className="hover:text-google-blue transition-all">Concrete Hub</Link></li>
              <li><Link href="/calculator/unit-converter" className="hover:text-google-blue transition-all">Unit Switch</Link></li>
              <li><Link href="/calculator/percentage" className="hover:text-google-blue transition-all">Percentages</Link></li>
              <li><Link href="/calculator/area-calculator" className="hover:text-google-blue transition-all">Area Finder</Link></li>
            </ul>
          </div>

          {/* Column 6: Site Meta */}
          <div>
            <h3 className="text-white font-black mb-5 uppercase tracking-[0.2em] text-[9px] opacity-60">Support</h3>
            <ul className="space-y-3 text-[10.5px] font-bold text-gray-400">
              <li><Link href="/blog" className="hover:text-google-blue transition-all">Blog/Articles</Link></li>
              <li><Link href="/contact" className="hover:text-google-blue transition-all">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-google-blue transition-all">About Platform</Link></li>
            </ul>
          </div>
        </div>

        {/* Dense Professional Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
              © {currentYear} CalcPro.NP — Precision for Nepal.
            </div>
            <p className="text-[8px] text-gray-600 uppercase tracking-widest font-bold max-w-2xl">
              Disclaimer: Estimates based on standard rules. Verify with pros. No data is stored.
            </p>
          </div>
          <div className="flex items-center gap-5 text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">
            <span className="flex items-center gap-1.5 opacity-60"><Globe className="w-3 h-3" /> Asia Oceania Hub</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span className="hover:text-google-blue cursor-help">100% Secure SSL</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
            <span>Nepal Core <span className="text-red-600 opacity-60 leading-none">❤</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
