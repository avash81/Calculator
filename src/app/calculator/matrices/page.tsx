import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matrix Calculator (2x2 & 3x3) | CalcPro.NP',
  description: 'Free online matrix calculator for determinant, trace, and inverse calculations of 2x2 and 3x3 matrices. Step-by-step results.',
  keywords: ['matrix', 'determinant', 'trace', 'inverse matrix', 'matrix math', 'calculator'],
};

export default function Page() {
  return <Calculator />;
}
