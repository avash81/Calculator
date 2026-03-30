import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Percentage Calculator — Add/Remove & Find %',
  description: 'Calculate percentages, percentage increases, and decreases. Simple and fast tool for everyday math, shopping, and finance. Free online tool.',
  slug: 'percentage',
  keywords: ['percentage calculator', 'calculate percentage', 'percentage increase', 'percentage decrease', 'math tool'],
});

export default function Page() {
  return <Calculator />;
}
