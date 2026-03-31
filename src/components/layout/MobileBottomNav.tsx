'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Globe, Grid, BookOpen } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/calculator' },
    { name: 'Nepal', icon: Globe, path: '/calculator?cat=nepal', isSpecial: true },
    { name: 'Tools', icon: Grid, path: '/calculator' },
    { name: 'Blog', icon: BookOpen, path: '/blog' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-google-border z-50 px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <Link 
              key={tab.name} 
              href={tab.path}
              className={`flex flex-col items-center justify-center flex-1 transition-all ${isActive ? 'text-google-blue' : 'text-gray-400'}`}
            >
              <div className={`p-1 rounded-xl transition-all ${tab.isSpecial ? 'bg-red-50 text-nepal-red border border-red-100 -mt-8 shadow-lg w-12 h-12 flex items-center justify-center' : ''}`}>
                {tab.isSpecial ? (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 21h1v-7.15c.67.24 1.34.42 2 .57V21h1v-6.38c.67.12 1.34.2 2 .25V21h1v-6.08c1.34.05 2.68.04 4-.04V21h1v-6.38c1.34-.14 2.68-.42 4-.82V21h1V4.85C16.34 2.8 13.68 1.95 11 2.3c-2.68.35-5.34 1.2-8 3.25V21h1z" />
                  </svg>
                ) : (
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${tab.isSpecial ? 'text-nepal-red' : ''}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
