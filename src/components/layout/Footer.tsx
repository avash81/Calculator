import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center flex-shrink-0 whitespace-nowrap mb-4">
              <span className="text-white font-semibold text-xl">Calc</span>
              <span className="text-blue-500 font-semibold text-xl">Pro</span>
              <span className="text-red-500 font-semibold text-xl">.np</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Nepal&apos;s most comprehensive suite of free online calculators for finance, health, education, and daily utilities.
            </p>
          </div>

          {/* Finance */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Finance</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator/loan-emi" className="hover:text-blue-400 transition-colors">EMI Calculator</Link></li>
              <li><Link href="/calculator/sip-calculator" className="hover:text-blue-400 transition-colors">SIP Calculator</Link></li>
              <li><Link href="/calculator/fd-calculator" className="hover:text-blue-400 transition-colors">Fixed Deposit</Link></li>
              <li><Link href="/calculator/compound-interest" className="hover:text-blue-400 transition-colors">Compound Interest</Link></li>
            </ul>
          </div>

          {/* Nepal */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Nepal Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator/nepal-income-tax" className="hover:text-blue-400 transition-colors">Income Tax 2082/83</Link></li>
              <li><Link href="/calculator/nepal-salary" className="hover:text-blue-400 transition-colors">Salary Calculator</Link></li>
              <li><Link href="/calculator/nepal-vat" className="hover:text-blue-400 transition-colors">VAT Calculator</Link></li>
              <li><Link href="/calculator/nepali-date" className="hover:text-blue-400 transition-colors">Nepali Date</Link></li>
            </ul>
          </div>

          {/* Health */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Health</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculator/bmi" className="hover:text-blue-400 transition-colors">BMI Calculator</Link></li>
              <li><Link href="/calculator/bmr" className="hover:text-blue-400 transition-colors">BMR Calculator</Link></li>
              <li><Link href="/calculator/ideal-weight" className="hover:text-blue-400 transition-colors">Ideal Weight</Link></li>
              <li><Link href="/calculator/body-fat" className="hover:text-blue-400 transition-colors">Body Fat %</Link></li>
            </ul>
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {year} CalcPro.NP. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
