import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Weight & Mass Converter — kg, lb, oz, g',
  description: 'Precision weight conversion for everyday and professional use. Convert instantly between kilograms, pounds, ounces, grams and more.',
  slug: 'weight-converter',
  keywords: ['weight converter', 'kg to lbs', 'lbs to kg', 'oz to g', 'grams to ounces']
});

export default function Page() {
  return <Calculator />;
}
