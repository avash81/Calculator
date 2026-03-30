import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Daily Water Intake Calculator — Hydration Needs',
  description: 'Calculate how much water you should drink daily based on your body weight and activity level for optimal hydration and health. Free online tool.',
  slug: 'water-intake',
  keywords: ['water intake calculator', 'daily water needs', 'hydration calculator', 'how much water to drink', 'health tool'],
});

export default function Page() {
  return <Calculator />;
}
