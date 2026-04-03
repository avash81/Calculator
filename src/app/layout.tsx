/**
 * @fileoverview RootLayout — CalcPro.NP
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
    'bmi calculator', 'free calculator nepal'
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1B4FBD" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-cp-bg text-cp-text antialiased`}>
        <GoogleAnalytics />
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
