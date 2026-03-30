import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Scientific Calculator — Online Math & Engineering Tool',
  description: 'A powerful online scientific calculator for students and professionals. Supports trigonometry, logarithms, square roots, and complex arithmetic operations. Free online tool.',
  slug: 'scientific-calculator',
  keywords: ['scientific calculator', 'online math calculator', 'engineering calculator', 'trigonometry calculator', 'logarithm calculator'],
});

export default function Page() {
  return <Calculator />;
}
