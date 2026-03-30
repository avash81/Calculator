'use client';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1c1e] text-[#f8f9fa] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-white font-black text-2xl tracking-tighter">CalcPro</span>
              <span className="text-[#1A73E8] font-black text-2xl tracking-tighter">.NP</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Nepal&apos;s most comprehensive free online calculator platform. Built for students, professionals, and businesses. All 39 calculators are free. Your data stays on your device.
            </p>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Education</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator/gpa" className="hover:text-blue-400 transition-colors">GPA Calculator</Link></li>
              <li><Link href="/calculator/scientific-calculator" className="hover:text-blue-400 transition-colors">Scientific Calculator</Link></li>
              <li><Link href="/calculator/fraction-calculator" className="hover:text-blue-400 transition-colors">Fraction Calculator</Link></li>
              <li><Link href="/calculator/quadratic-solver" className="hover:text-blue-400 transition-colors">Quadratic Solver</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/calculator" className="hover:text-blue-400 transition-colors">All Calculators</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed text-center italic">
            <strong>Disclaimer:</strong> The calculators and tools provided on CalcPro.NP are for informational and educational purposes only. While we strive for absolute accuracy, financial decisions and tax filings should be verified with a professional accountant or certified tax advisor. CalcPro.NP is not responsible for any financial loss or incorrect tax filings based on these results.
          </p>
        </div>

        {/* Localized Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs font-medium">
            © {currentYear} CalcPro.NP — Free forever. No ads. No data collection.
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for <span className="flex items-center gap-1.5 ml-1 text-white">🇳🇵 Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
