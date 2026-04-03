import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Length & Distance Converter — Meters, Feet, Miles',
  description: 'Convert between all length units instantly. Supports meters, feet, inches, kilometers, miles and more with high precision.',
  slug: 'length-converter',
  keywords: ['length converter', 'meters to feet', 'km to miles', 'inch to cm', 'distance converter']
});

export default function Page() {
  return <Calculator />;
}
