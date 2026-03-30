import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Simple Interest Calculator — Calculate Interest Easily',
  description: 'Calculate simple interest and total amount based on principal, rate, and time. Perfect for basic loans, savings, and educational purposes. Free online tool.',
  slug: 'simple-interest',
  keywords: ['simple interest calculator', 'calculate simple interest', 'loan interest', 'savings interest', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
