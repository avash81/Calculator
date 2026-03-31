import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Force Calculator (F=ma) | CalcPro.NP',
  description: 'Free online physics calculator for Newton\'s second law (F=ma). Find force, mass, or acceleration results instantly.',
  keywords: ['force', 'mass', 'acceleration', 'newton second law', 'physics solver', 'calculator'],
};

export default function Page() {
  return <Calculator />;
}
