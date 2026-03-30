import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Ideal Weight Calculator — Healthy Weight Range',
  description: 'Calculate your ideal healthy weight range based on the Devine formula. Used by healthcare professionals worldwide to determine healthy weight targets. Free online tool.',
  slug: 'ideal-weight',
  keywords: ['ideal weight calculator', 'healthy weight range', 'calculate ideal weight', 'devine formula', 'health tool'],
});

export default function Page() {
  return <Calculator />;
}
