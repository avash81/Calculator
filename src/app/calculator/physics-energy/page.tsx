import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kinetic Energy Calculator (1/2mv²) | CalcPro.NP',
  description: 'Free online physics calculator for kinetic energy (KE = ½mv²). Solve for energy, mass, or velocity instantly.',
  keywords: ['kinetic energy', 'physics calculator', 'energy', 'velocity', 'mass', '1/2mv2'],
};

export default function Page() {
  return <Calculator />;
}
