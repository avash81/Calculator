import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Tip Calculator — Split Bills & Calculate Tips',
  description: 'Split bills and calculate tips easily. Perfect for dining out with friends and family. Supports custom tip percentages and splitting between multiple people. Free online tool.',
  slug: 'tip-calculator',
  keywords: ['tip calculator', 'split bill', 'calculate tip', 'restaurant tip calculator', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
