import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Unit Converter — Convert Length, Weight, Temp, Area, Volume',
  description: 'Convert between different units of length, weight, temperature, area, and volume instantly. Supports metric and imperial units. Free online tool.',
  slug: 'unit-converter',
  keywords: ['unit converter', 'convert units', 'length converter', 'weight converter', 'temperature converter', 'area converter', 'volume converter', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
