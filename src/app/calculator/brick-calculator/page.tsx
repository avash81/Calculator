import { calcMeta } from '@/lib/calcMeta';
import BrickCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Bricks Calculator Nepal — Wall Construction Estimator',
  description: 'Calculate the number of bricks and amount of cement and sand required for a wall. Professional construction tool for Nepal.',
  slug: 'brick-calculator',
  keywords: ['brick calculator nepal', 'wall brick estimator', 'construction calculator', 'cement sand for wall'],
});

export default function Page() {
  return <BrickCalculator />;
}
