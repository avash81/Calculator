import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal Growth (Capital Gains) Tax Calculator — Shareholders & Real Estate',
  description: 'Calculate Capital Gains Tax (CGT) on Nepal Stock Exchange (NEPSE) shares and real estate. Includes short-term vs long-term rates (5% vs 7.5%). Updated for FY 2081/82.',
  slug: 'nepal-tax-calculator',
  keywords: ['nepal cg tax calculator', 'nepse tax calculator', 'share investment tax nepal', 'real estate cgt nepal'],
});

export default function Page() {
  return <Calculator />;
}
