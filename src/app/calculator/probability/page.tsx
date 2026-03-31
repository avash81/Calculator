import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Probability Calculator | CalcPro.NP',
  description: 'Free online probability calculator. Convert favorable outcomes and sample space into percentage, decimal, and odds values instantly.',
  keywords: ['probability', 'odds', 'statistics', 'likelihood', 'chance', 'math calculator'],
};

export default function Page() {
  return <Calculator />;
}
