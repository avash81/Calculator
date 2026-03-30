import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal Home Loan EMI Calculator — NRB Guidelines',
  description: 'Calculate monthly EMI for home loans in Nepal. Includes interest rate trends from major commercial banks and NRB guidelines. Free online tool.',
  slug: 'nepal-home-loan',
  keywords: ['nepal home loan calculator', 'home loan emi calculator', 'nepal bank loan', 'nrb home loan', 'finance tool nepal'],
});

export default function Page() {
  return <Calculator />;
}
