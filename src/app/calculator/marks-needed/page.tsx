import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Marks Needed Calculator — Final Exam Grade',
  description: 'Calculate the minimum score you need on your final exam to achieve your target overall grade. Perfect for students planning their study goals. Free online tool.',
  slug: 'marks-needed',
  keywords: ['marks needed calculator', 'final exam grade', 'calculate required grade', 'target grade', 'study goals'],
});

export default function Page() {
  return <Calculator />;
}
