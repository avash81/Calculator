import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ratio & Proportion Calculator | CalcPro.NP',
  description: 'Free online ratio and proportion solver. Solve for unknown values in any A:B = C:D equation instantly.',
  keywords: ['ratio', 'proportion', 'cross multiply', 'math solver', 'scaling', 'calculator'],
};

export default function Page() {
  return <Calculator />;
}
