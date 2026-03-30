import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'BMR Calculator — Basal Metabolic Rate & TDEE',
  description: 'Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily calorie needs for weight management. Free online tool.',
  slug: 'bmr',
  keywords: ['bmr calculator', 'basal metabolic rate', 'tdee calculator', 'calorie needs', 'weight management'],
});

export default function Page() {
  return <Calculator />;
}
