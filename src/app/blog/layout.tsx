import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CalcPro.NP Blog & Nepal Calculator Guides',
  description: 'Expert guides on Nepal income tax 2082/83, investment tips for mutual funds and stocks, and detailed tutorials for all our 80+ calculators.',
  keywords: 'nepal finance blog, tax guide nepal 2082, sip investment nepal, mutual fund nepal tips, emi calculation guide',
  openGraph: {
    title: 'CalcPro.NP Blog & Nepal Calculator Guides',
    description: 'Expert guides on Nepal income tax, and investment tips.',
    url: 'https://calcpro.com.np/blog',
    siteName: 'CalcPro.NP',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
