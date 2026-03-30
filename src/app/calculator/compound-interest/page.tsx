import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Compound Interest Calculator — Grow Your Wealth',
  description: 'Calculate compound interest on your savings or investments in Nepal. Supports monthly, quarterly, and yearly compounding. See the power of compounding. Free online tool.',
  slug: 'compound-interest',
  keywords: ['compound interest calculator', 'calculate compound interest', 'investment growth', 'savings calculator', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
