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

      {/* Slide-out Explorer */}
      <aside className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white z-[201] transform transition-transform duration-500 ease-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1A73E8] rounded-xl flex items-center justify-center text-white font-black">C</div>
              <span className="font-extrabold text-[#202124] uppercase tracking-tighter text-sm">Matrix Explorer</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-10 flex-1">
             <div className="space-y-4">
                <Link href="/calculator" className="block text-lg font-bold text-[#202124] px-2">Tools Directory</Link>
                <Link href="/blog" className="block text-lg font-bold text-[#202124] px-2">Insights & Blog</Link>
                <Link href="/about" className="block text-lg font-bold text-[#202124] px-2">Our Mission</Link>
             </div>

             <div className="h-px bg-gray-100 mx-2" />

             {Object.entries(CATEGORIES).map(([cat, links]) => (
              <div key={cat}>
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 pl-2">
                   {cat}
                </h3>
                <div className="space-y-1">
                  {links.map(l => (
                    <Link 
                      key={l.s} 
                      href={`/calculator/${l.s}`}
                      className="group flex items-center justify-between px-3 py-3 hover:bg-[#F8F9FA] rounded-xl transition-all"
                    >
                      <span className="text-sm font-bold text-[#5F6368] group-hover:text-[#1A73E8] transition-colors">
                        {l.n}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-[#1A73E8] transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
             <div className="bg-[#F8F9FA] p-4 rounded-3xl flex items-center gap-4">
               <div className="text-2xl">🇳🇵</div>
               <div>
                  <div className="text-[10px] font-black text-[#5F6368] uppercase tracking-widest leading-none mb-1">Tax Update</div>
                  <div className="text-xs font-bold text-[#202124]">Fiscal Year 2082/83</div>
               </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}
