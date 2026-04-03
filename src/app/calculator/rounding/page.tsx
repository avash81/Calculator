import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Rounding Calculator — Nearest Tenth, Hundredth, Whole Number',
  description: 'Precision rounding for any number. Round to the nearest unit, decimal place, or significant figures instantly.',
  slug: 'rounding',
  keywords: ['rounding calculator', 'round to nearest tenth', 'round to nearest hundredth', 'significant figures calculator']
});

export default function Page() {
  return <Calculator />;
}
