'use client';
/**
 * @fileoverview MobileNav — Fixed bottom navigation bar
 *
 * Visible only on mobile (hidden md:hidden).
 * Fixed to bottom of viewport with iOS safe area support.
 * Active state highlighted by current pathname.
 *
 * @component
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',                     icon: '🏠', label: 'Home' },
  { href: '/calculator',           icon: '🧮', label: 'Tools' },
  { href: '/calculator/nepal-income-tax', icon: '🇳🇵', label: 'Nepal' },
  { href: '/blog',                 icon: '📝', label: 'Blog' },
  { href: '/search',               icon: '🔍', label: 'Search' },
];

export function MobileNav() {
  const path = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex h-14">
        {NAV_ITEMS.map(item => {
          const isActive =
            item.href === '/'
              ? path === '/'
              : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5
                transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <span className={`text-[9px] font-semibold leading-none
                ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
