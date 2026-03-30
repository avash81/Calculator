/**
 * @fileoverview RootLayout — CalcPro.NP
 *
 * Root layout wrapping every page.
 *
 * Next.js 14 Rule: `dynamic()` with `ssr: false` is NOT allowed in
 * Server Components. This file exports `metadata` so it IS a Server
 * Component. All dynamic imports are moved to ClientShell.tsx.
 *
 * Architecture:
 *   layout.tsx (Server) → exports metadata, renders ClientShell
 *   ClientShell.tsx (Client) → dynamic imports with ssr:false
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


const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calcpro.com.np'),
  title: {
    default: 'CalcPro.NP — Best Free Nepal Calculator Suite & AI Math Solver',
    template: '%s | CalcPro.NP',
  },
  description:
    "The fastest professional-grade free calculators for Nepal. " +
    "Income tax 2082/83, EMI, BMI, & AI-powered step-by-step Math Solver. " +
    "80+ tools built for Nepal. No ads, no login required.",
  keywords: [
    'nepal calculator', 'nepal income tax 2082/83',
    'emi calculator nepal', 'nepali date converter',
    'bmi calculator', 'free calculator nepal',
    'ai math solver nepal', 'best calculator app nepal',
    'finance tool nepal'
  ].join(', '),
  openGraph: {
    siteName: 'CalcPro.NP',
    locale: 'en_NP',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash — must run before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CalcPro.NP",
              "url": "https://calcpro.com.np",
              "description": "Professional-grade free calculators for Nepal including Income Tax, EMI, and AI Math Solver.",
              "applicationCategory": "FinanceApplication, EducationalApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "NPR"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://calcpro.com.np/calculator?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1B4FBD" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-cp-bg text-cp-text antialiased`}
      >
        <GoogleAnalytics />
        {/* ClientShell handles all dynamic imports (ssr:false) */}
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
