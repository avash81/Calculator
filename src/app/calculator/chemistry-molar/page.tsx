import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Molar Mass Calculator (Chemical Compounds) | CalcPro.NP',
  description: 'Free online chemistry molar mass calculator. Calculate molecular weight for chemical formulas like H2O, NaCl, C6H12O6 instantly.',
  keywords: ['molar mass', 'molecular weight', 'chemistry', 'composition', 'periodic table', 'atomic weight', 'calculator'],
};

export default function Page() {
  return <Calculator />;
}
