import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'SIP Calculator Nepal — Systematic Investment Plan',
  description: 'Calculate the future value of your Systematic Investment Plan (SIP) in Nepal. Best for Mutual Funds and Stock Market investments. Free online tool.',
  slug: 'sip-calculator',
  keywords: ['sip calculator nepal', 'systematic investment plan', 'mutual fund calculator nepal', 'nepal stock market investment', 'finance tool'],
});

export default function Page() {
  return <Calculator />;
}
