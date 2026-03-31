import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Z-Score Calculator | CalcPro.NP',
  description: 'Free online Z-score calculator for statistical analysis. Calculate standard scores from population mean and standard deviation instantly.',
  keywords: ['z-score', 'standard score', 'normal distribution', 'statistics', 'bell curve', 'standard deviation', 'calculator'],
};

export default function Page() {
  return <Calculator />;
}
