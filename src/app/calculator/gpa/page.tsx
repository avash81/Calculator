import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'GPA Calculator Nepal (NEB/TU) — Semester GPA Estimator',
  description: 'Calculate your semester or terminal GPA accurately using the Nepal NEB/TU grading standard or international US 4.0 scale. Includes credit-hour weightage for university students.',
  slug: 'gpa',
  keywords: ['gpa calculator nepal', 'neb gpa calculator', 'tu gpa calculator', 'semester gpa nepal', '4.0 gpa calculator', 'education calculator nepal'],
});

export default function Page() {
  return <Calculator />;
}
