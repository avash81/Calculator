'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NepalFlag } from '@/components/ui/NepalFlag';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2
                  2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/calculators',
    label: 'Tools',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <path d="M8 6h8M8 10h8M8 14h4"/>
      </svg>
    ),
  },
  {
    href: '/calculators/finance/nepal-income-tax',
    label: 'Nepal',
    icon: <NepalFlag />,
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4
                  19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    href: '/calculators?search=true',
    label: 'Search',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        bg-white border-t border-gray-200
        z-50
        safe-area-pb
      "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 h-14">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href ||
            (item.href !== '/' &&
             pathname.startsWith(item.href.split('?')[0]));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5
                transition-colors duration-150
                ${isActive
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {/* Icon */}
              <span className={isActive ? 'text-blue-600' : ''}>
                {item.icon}
              </span>
              {/* Label */}
              <span className="text-[9px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
