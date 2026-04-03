import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal Land Measurement Calculator (Ropani-Aana-Bigha)',
  description: 'Convert between Ropani, Aana, Bigha, Kattha and Square Feet with precision. Official Nepal land unit converter for all regions.',
  slug: 'nepal-land',
  keywords: ['nepal land calculator', 'ropani to sq ft', 'bigha to ropani', 'land measurement nepal', 'aana to sq ft']
});

export default function Page() {
  return <Calculator />;
}
