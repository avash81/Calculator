/**
 * @fileoverview ClientShell — Client-side wrapper for layout components
 */
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then(m => m.Navbar),
  {
    ssr: false,
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-50 h-14 md:h-16 bg-white border-b border-gray-200" />
    ),
  }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then(m => m.Footer),
  { ssr: false }
);

const MobileNav = dynamic(
  () => import('@/components/layout/MobileNav').then(m => m.MobileNav),
  { ssr: false }
);

interface ClientShellProps {
  children: React.ReactNode;
}

export function ClientShell({ children }: ClientShellProps) {
  useEffect(() => {
    console.log('--- CALCPRO.NP V2026 HEARTBEAT ---');
    console.log('PLATFORM: 15+ RECONSTRUCTED TOOLS');
  }, []);

  return (
    <ErrorBoundary>
      <Navbar />
      <main className="pt-[14px] md:pt-[16px]" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
      <MobileNav />
    </ErrorBoundary>
  );
}
