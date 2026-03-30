'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Globe, Grid, BookOpen } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: '/calculator', isSearch: true }, // Placeholder path for search trigger
    { name: 'Nepal', icon: Globe, path: '/calculator/nepal-income-tax', isSpecial: true },
    { name: 'Tools', icon: Grid, path: '/calculator' },
    { name: 'Blog', icon: BookOpen, path: '/blog' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-google-border z-[150] px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 relative">
        {tabs.map((tab) => {
          const Icon = typeof tab.icon === 'string' ? null : tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <Link 
              key={tab.name} 
              href={tab.path || '#'}
              className={`flex flex-col items-center justify-center flex-1 transition-all relative ${isActive ? 'text-google-blue' : 'text-gray-400'}`}
            >
              <div className={`transition-all duration-300 ${tab.isSpecial ? 'bg-[#1A73E8] text-white -mt-10 shadow-xl w-14 h-14 rounded-2xl flex items-center justify-center ring-4 ring-white' : 'p-1 rounded-xl'}`}>
                {tab.isSpecial ? (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 21h1v-7.15c.67.24 1.34.42 2 .57V21h1v-6.38c.67.12 1.34.2 2 .25V21h1v-6.08c1.34.05 2.68.04 4-.04V21h1v-6.38c1.34-.14 2.68-.42 4-.82V21h1V4.85C16.34 2.8 13.68 1.95 11 2.3c-2.68.35-5.34 1.2-8 3.25V21h1z" />
                  </svg>
                ) : Icon ? (
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                ) : null}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter mt-1 transition-colors ${tab.isSpecial ? 'text-google-blue' : isActive ? 'text-google-blue' : 'text-gray-400'}`}>
                {tab.name}
              </span>
              {isActive && !tab.isSpecial && (
                <div className="absolute -bottom-1 w-1 h-1 bg-google-blue rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
