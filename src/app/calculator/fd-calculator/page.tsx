import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Fixed Deposit (FD) Calculator — Maturity & Interest',
  description: 'Calculate maturity amount and interest earned on your fixed deposit in Nepal. Supports quarterly and monthly compounding options common in Nepali banks. Free online tool.',
  slug: 'fd-calculator',
  keywords: ['fd calculator', 'fixed deposit calculator', 'nepal fd calculator', 'interest rate calculator', 'investment calculator'],
});

export default function Page() {
  return <Calculator />;
}
