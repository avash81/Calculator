import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Logarithm Calculator — Calculate Log with Any Base',
  description: 'Calculate the logarithm of a number with any base. Essential for math and science students. Get results for log10, ln, and custom bases. Free online tool.',
  slug: 'logarithm-calculator',
  keywords: ['logarithm calculator', 'calculate log', 'log base', 'math tool', 'logarithm formula'],
});

export default function Page() {
  return <Calculator />;
}
