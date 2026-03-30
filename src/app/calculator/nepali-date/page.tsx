import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepali Date Converter — AD to BS / BS to AD',
  description: 'Convert English date (AD) to Nepali date (BS) and vice versa instantly. Accurate Nepali calendar converter for Nepal. Free online tool.',
  slug: 'nepali-date',
  keywords: ['nepali date converter', 'ad to bs', 'bs to ad', 'nepali calendar', 'date conversion nepal'],
});

export default function Page() {
  return <Calculator />;
}
