import { calcMeta } from '@/lib/calcMeta';
import AttendanceCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Attendance Calculator — Track & Meet Requirements',
  description: 'Check if you meet the minimum attendance requirement (usually 75% in Nepal). Calculate how many more classes you need to attend or can afford to miss. Free online tool.',
  slug: 'attendance',
  keywords: ['attendance calculator', 'calculate attendance', 'attendance percentage', 'school attendance', 'university attendance'],
});

export default function Page() {
  return <AttendanceCalculator />;
}
