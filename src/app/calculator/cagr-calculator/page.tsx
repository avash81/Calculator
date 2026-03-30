import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'CAGR Calculator — Compound Annual Growth Rate',
  description: 'Calculate the Compound Annual Growth Rate (CAGR) of your investments over a period of time. Essential for comparing different investment returns. Free online tool.',
  slug: 'cagr-calculator',
  keywords: ['cagr calculator', 'compound annual growth rate', 'investment returns', 'calculate cagr', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
