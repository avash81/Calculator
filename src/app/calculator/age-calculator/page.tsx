import { calcMeta } from '@/lib/calcMeta';
import AgeCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Age Calculator — Exact Age in Years, Months, Days',
  description: 'Calculate your exact age in years, months, and days. Find out how many days you have lived, your next birthday, and day of birth. Free online tool.',
  slug: 'age-calculator',
  keywords: ['age calculator', 'calculate age', 'how old am i', 'birthday calculator', 'age in days'],
});

export default function Page() {
  return <AgeCalculator />;
}
