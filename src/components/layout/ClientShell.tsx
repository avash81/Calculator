/**
 * @fileoverview ClientShell — Client-side wrapper for layout components
 *
 * Next.js 14 Rule: `dynamic()` with `ssr: false` is ONLY allowed in
 * Client Components. layout.tsx is a Server Component (it exports metadata),
 * so dynamic imports must be moved here.
 *
 * This component loads Navbar, Footer, and MobileNav on the client side,
 * preventing SSR for these interactive components that use browser APIs
 * (localStorage for theme, pathname hooks, scroll events).
 *
 * @component
 */
'use client';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

/** Navbar — dynamic to avoid SSR (uses localStorage, scroll events) */
const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then(m => m.Navbar),
  {
    ssr: false,
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16
                      bg-white border-b border-gray-200" />
    ),
  }
);

/** Footer — dynamic to reduce initial bundle */
const Footer = dynamic(
  () => import('@/components/layout/Footer').then(m => m.Footer),
  { ssr: false }
);

/** MobileNav — dynamic, mobile-only bottom nav */
const MobileNav = dynamic(
  () => import('@/components/layout/MobileNav').then(m => m.MobileNav),
  { ssr: false }
);

interface ClientShellProps {
  children: React.ReactNode;
}

/**
 * Wraps app with client-side layout components.
 * Used by layout.tsx (Server Component) to safely
 * include dynamic imports with ssr:false.
 */
export function ClientShell({ children }: ClientShellProps) {
  return (
    <ErrorBoundary>
      <Navbar />
      <main className="pt-[var(--nav-height)]" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
      <MobileNav />
    </ErrorBoundary>
  );
}
