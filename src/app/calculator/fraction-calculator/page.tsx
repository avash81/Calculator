import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Fraction Calculator — Add, Subtract, Multiply & Divide',
  description: 'Add, subtract, multiply, and divide fractions. Get results in both simplified fraction and decimal forms. Perfect for students and math homework. Free online tool.',
  slug: 'fraction-calculator',
  keywords: ['fraction calculator', 'calculate fractions', 'add fractions', 'multiply fractions', 'math tool'],
});

export default function Page() {
  return <Calculator />;
}
