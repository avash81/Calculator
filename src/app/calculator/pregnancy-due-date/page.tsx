import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Pregnancy Due Date Calculator — Expected Delivery Date',
  description: 'Estimate your expected delivery date based on your last menstrual period (LMP) using Naegele\'s rule for accurate pregnancy tracking. Free online tool.',
  slug: 'pregnancy-due-date',
  keywords: ['pregnancy due date calculator', 'expected delivery date', 'calculate pregnancy due date', 'lmp calculator', 'pregnancy tracking'],
});

export default function Page() {
  return <Calculator />;
}
