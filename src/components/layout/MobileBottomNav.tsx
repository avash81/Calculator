'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, BookOpen } from 'lucide-react';
import { NepalFlag } from '@/components/ui/NepalFlag';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/calculator',
    label: 'Tools',
    icon: Grid,
  },
  {
    href: '/calculator/nepal-income-tax',
    label: 'Nepal',
    icon: NepalFlag,
    special: true,
  },
  {
    href: '/calculator?search=true',
    label: 'Search',
    icon: Search,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: BookOpen,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[100] shadow-[0_-8px_24px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5 h-16 relative">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
          
          if (item.special) {
            return (
              <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center pt-1 group">
                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 transform -translate-y-6 transition-all active:scale-90 ${isActive ? 'ring-4 ring-blue-50 border-blue-100' : ''}`}>
                   <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                      <Icon />
                   </div>
                </div>
                <span className={`text-[10px] font-bold absolute bottom-2 tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-12 h-0.5 bg-blue-600 rounded-b-full shadow-[0_4px_12px_rgba(37,99,235,0.4)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
