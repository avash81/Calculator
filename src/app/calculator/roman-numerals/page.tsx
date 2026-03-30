import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Roman Numerals Converter — Arabic to Roman',
  description: 'Convert Arabic numbers to Roman numerals and vice versa. Supports numbers from 1 to 3,999. Includes a reference table for standard Roman numeral symbols. Free online tool.',
  slug: 'roman-numerals',
  keywords: ['roman numerals converter', 'arabic to roman', 'roman numeral symbols', 'convert number to roman', 'math tool'],
});

export default function Page() {
  return <Calculator />;
}
