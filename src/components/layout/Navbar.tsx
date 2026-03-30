'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { Menu, X, Sun, Moon, Search, Globe, ChevronRight } from 'lucide-react';

const CATEGORIES = {
  'Finance': [
    {n:'EMI Calculator',s:'loan-emi'},
    {n:'SIP Calculator',s:'sip-calculator'},
    {n:'FD Calculator',s:'fd-calculator'},
    {n:'Compound Interest',s:'compound-interest'},
    {n:'Discount Calculator',s:'discount-calculator'},
  ],
  'Nepal Tools': [
    {n:'Income Tax 2082/83',s:'nepal-income-tax'},
    {n:'Salary + SSF',s:'nepal-salary'},
    {n:'VAT Calculator',s:'nepal-vat'},
    {n:'Nepali Date',s:'nepali-date'},
    {n:'Home Loan Nepal',s:'nepal-home-loan'},
  ],
  'Health': [
    {n:'BMI Calculator',s:'bmi'},
    {n:'BMR Calculator',s:'bmr'},
    {n:'Ideal Weight',s:'ideal-weight'},
    {n:'Body Fat %',s:'body-fat'},
  ],
  'Education': [
    {n:'GPA Calculator',s:'gpa'},
    {n:'Scientific',s:'scientific-calculator'},
    {n:'Fraction',s:'fraction-calculator'},
    {n:'Quadratic',s:'quadratic-solver'},
    {n:'Standard Dev',s:'standard-deviation'},
  ],
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm h-14' : 'bg-white dark:bg-gray-950 h-16 border-b border-gray-100 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-gray-900 dark:text-white font-black text-xl tracking-tighter">CalcPro</span>
              <span className="text-blue-600 font-black text-xl tracking-tighter">.NP</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full px-4 py-1.5 gap-3 w-full max-w-md mx-6">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggle}
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/calculator/nepal-income-tax" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-500/20">
              <Globe className="w-4 h-4" /> Nepal FY 82/83
            </Link>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Modern Side Drawer (Google/Android style) */}
      <aside className={`fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-[201] transform transition-transform duration-500 ease-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg" />
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">CalcPro Explorer</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {Object.entries(CATEGORIES).map(([cat, links]) => (
              <div key={cat}>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 pl-2">
                  {cat}
                </h3>
                <div className="space-y-1">
                  {links.map(l => (
                    <Link 
                      key={l.s} 
                      href={`/calculator/${l.s}`}
                      className="group flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                    >
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                        {l.n}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Link href="/blog" className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
              <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl shadow-sm flex items-center justify-center">
                📝
              </div>
              <div>
                <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Knowledge Base</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Learn tax & finance</div>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
