import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Base Converter — Binary, Hex, Decimal, Octal',
  description: 'Convert numbers between any bases (2-64) instantly. Supports Binary, Hexadecimal, Octal, and custom base conversions with step-by-step logic.',
  slug: 'base-converter',
  keywords: ['base converter', 'binary to hex', 'decimal to binary', 'hex to decimal', 'base 64 converter']
});

export default function Page() {
  return <Calculator />;
}
