/**
 * @fileoverview RootLayout — Calcly Precision Suite
 */
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClientShell } from '@/components/layout/ClientShell';
import { GoogleAnalytics } from '@/components/seo/GoogleAnalytics';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calcly.com'),
  title: {
    default: 'Calcly — Precision Online Calculators',
    template: '%s | Calcly',
  },
  description:
    "Calcly provides professional-grade, high-precision free online calculators for finance, math, health, and science. Zero ads, zero signup, built for speed.",
  keywords: [
    'online calculator', 'precision calculator', 'free calculators',
    'finance calculator', 'math solver', 'health calculator', 'calcly'
  ].join(', '),
  openGraph: {
    siteName: 'Calcly',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#083366" />
      </head>
      <body className="bg-[var(--bg-page)] text-[var(--text-secondary)] antialiased font-sans">
        <GoogleAnalytics />
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
