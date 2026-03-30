import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'CGPA Calculator Nepal (TU/KU) — Cumulative Grade Point Average',
  description: 'Professional CGPA calculator for university students in Nepal (TU, KU, PU) and international systems. Calculate your Cumulative Grade Point Average across 8-12 semesters with credit weightage. WES compatible calculations.',
  slug: 'cgpa',
  keywords: ['cgpa calculator nepal', 'tu cgpa calculator', 'ku cgpa calculator', 'calculate cgpa nepal', 'cumulative grade point average', 'gpa calculator nepal'],
});

export default function Page() {
  return <Calculator />;
}
