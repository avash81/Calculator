import Calculator from './Calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mean, Median, Mode Calculator | CalcPro.NP',
  description: 'Free online statistics calculator for mean, median, mode, and range of any data set. Analyze datasets instantly.',
  keywords: ['mean', 'median', 'mode', 'range', 'statistics calculator', 'averages', 'datasets'],
};

export default function Page() {
  return <Calculator />;
}
