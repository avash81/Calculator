import { calcMeta } from '@/lib/calcMeta';
import GPACalculator from './Calculator';

export const metadata = calcMeta({
  title: 'GPA Calculator (Nepal & US) — Free Online Tool',
  description: 'Calculate your Grade Point Average (GPA) for Nepal (NEB, TU, KU, PU) or US grading systems. Supports credit-based GPA calculation. Free, no login required.',
  slug: 'gpa',
  keywords: ['gpa calculator', 'nepal gpa calculator', 'us gpa calculator', 'calculate gpa', 'cgpa calculator'],
});

export default function Page() {
  return <GPACalculator />;
}
