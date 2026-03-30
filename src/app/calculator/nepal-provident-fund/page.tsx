import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal PF & Gratuity Calculator — Retirement Fund',
  description: 'Calculate your accumulated Provident Fund (PF) and Gratuity based on Nepal Labor Act 2074. Includes interest compounding for long-term projections. Free online tool.',
  slug: 'nepal-provident-fund',
  keywords: ['nepal pf calculator', 'gratuity calculator', 'retirement fund nepal', 'provident fund nepal', 'finance tool nepal'],
});

export default function Page() {
  return <Calculator />;
}
