'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Globe, ChevronRight } from 'lucide-react';

const CATEGORIES = {
  'Nepal Specialized': [
    {n:'Income Tax 2082/83',s:'nepal-income-tax'},
    {n:'Salary Calculator',s:'nepal-salary'},
    {n:'Date Converter',s:'nepali-date'},
    {n:'VAT Calculator',s:'nepal-vat'},
    {n:'Home Loan EMI',s:'nepal-home-loan'},
  ],
  'Standard Suite': [
    {n:'EMI Calculator',s:'loan-emi'},
    {n:'BMI Calculator',s:'bmi'},
    {n:'GPA Calculator',s:'gpa'},
    {n:'Scientific Matrix',s:'scientific-calculator'},
    {n:'SIP Matrix',s:'sip-calculator'},
  ]
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [path]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm h-14' : 'bg-white h-16'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
             <Link href="/" className="flex items-center gap-1 group">
               <span className="text-[#202124] font-black text-xl tracking-tighter">CalcPro</span>
               <span className="text-[#1A73E8] font-black text-xl tracking-tighter">.NP</span>
             </Link>

             {/* Hidden on small screens, shows next to logo on desktop */}
             <div className="hidden lg:flex items-center gap-6">
                <Link href="/calculator" className="text-sm font-semibold text-[#5F6368] hover:text-[#1A73E8] transition-colors">Tools</Link>
                <Link href="/blog" className="text-sm font-semibold text-[#5F6368] hover:text-[#1A73E8] transition-colors">Blog</Link>
                <Link href="/about" className="text-sm font-semibold text-[#5F6368] hover:text-[#1A73E8] transition-colors">About</Link>
             </div>
          </div>

          {/* Desktop Central Search (Google Style) */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
             <div className={`w-full flex items-center bg-[#F1F3F4] rounded-xl px-4 py-2 gap-3 transition-all duration-300 border ${isSearchFocused ? 'bg-white border-[#1A73E8] shadow-md ring-4 ring-blue-50' : 'border-transparent hover:bg-[#E8EAED]'}`}>
                <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`} />
                <input 
                  type="text" 
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search 39 calculators..." 
                  className="bg-transparent border-none outline-none text-sm text-[#202124] w-full font-medium placeholder:text-[#5F6368]"
                />
             </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/calculator/nepal-income-tax" className="hidden sm:flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-lg shadow-blue-500/10">
              <Globe className="w-3.5 h-3.5" /> Nepal Tools
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modern Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Slide-out Explorer - IMAGE 11 MATCH */}
      <aside className={`fixed inset-0 bg-white z-[201] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header in Drawer */}
          <div className="p-4 flex items-center justify-between border-b border-google-border">
            <div className="flex items-center gap-1">
              <span className="text-google-dark font-black text-xl tracking-tighter">CalcPro</span>
              <span className="text-google-blue font-black text-xl tracking-tighter">.NP</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
               <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {/* Drawer Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search calculators..." 
                className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-google-blue outline-none"
              />
            </div>

            {/* Drawer Categories - Image 11 List */}
            <div className="space-y-6 px-2">
               {[
                 { n: 'All Tools', i: '🗂️', p: '/calculator' },
                 { n: 'Nepal Calculators', i: '🇳🇵', p: '/categories/nepal' },
                 { n: 'Finance', i: '💰', p: '/categories/finance' },
                 { n: 'Blog', i: '📖', p: '/blog' },
                 { n: 'About', i: 'ℹ️', p: '/about' }
               ].map(cat => (
                 <Link 
                   key={cat.n} 
                   href={cat.p}
                   className="flex items-center gap-4 group"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   <span className="text-xl">{cat.i}</span>
                   <span className="text-lg font-bold text-gray-700 group-hover:text-google-blue transition-colors">
                     {cat.n}
                   </span>
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
