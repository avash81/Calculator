import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Standard Deviation Calculator — Statistics Tool',
  description: 'Calculate mean, variance, and standard deviation for a set of numbers. Essential for statistics students and data analysis. Free online tool.',
  slug: 'standard-deviation',
  keywords: ['standard deviation calculator', 'calculate standard deviation', 'statistics calculator', 'variance calculator', 'mean calculator'],
});

export default function Page() {
  return <Calculator />;
}
