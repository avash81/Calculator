import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'CGPA Calculator — Cumulative Grade Point Average',
  description: 'Calculate your Cumulative Grade Point Average (CGPA) across multiple semesters. Supports credit-weighted calculations for university students. Free online tool.',
  slug: 'cgpa',
  keywords: ['cgpa calculator', 'calculate cgpa', 'cumulative grade point average', 'gpa calculator', 'education tool'],
});

export default function Page() {
  return <Calculator />;
}
