import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Body Fat Calculator — U.S. Navy Method',
  description: 'Estimate your body fat percentage using the U.S. Navy Method. Requires simple measurements of your neck, waist, and height for an accurate estimation. Free online tool.',
  slug: 'body-fat',
  keywords: ['body fat calculator', 'navy body fat method', 'calculate body fat', 'body composition', 'health tool'],
});

export default function Page() {
  return <Calculator />;
}
