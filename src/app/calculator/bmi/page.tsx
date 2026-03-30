import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'BMI Calculator — Healthy Weight Range (WHO)',
  description: 'Calculate your Body Mass Index (BMI) to determine your healthy weight range based on WHO standards. Supports metric and imperial units. Free online tool.',
  slug: 'bmi',
  keywords: ['bmi calculator', 'body mass index', 'healthy weight range', 'bmi chart', 'calculate bmi'],
});

export default function Page() {
  return <Calculator />;
}
