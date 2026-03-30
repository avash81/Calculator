import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Discount Calculator — Calculate Final Price & Savings',
  description: 'Calculate the final price after discount and see how much you save. Perfect for shopping, sales, and retail calculations. Free online tool.',
  slug: 'discount-calculator',
  keywords: ['discount calculator', 'calculate discount', 'final price calculator', 'shopping discount', 'retail math'],
});

export default function Page() {
  return <Calculator />;
}
