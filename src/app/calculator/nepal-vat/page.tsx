import { calcMeta } from '@/lib/calcMeta';
import NepalVATCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal VAT Calculator (13%) — Free Online Tool',
  description: 'Calculate 13% VAT for Nepal. Easily add or remove VAT from any amount. Updated for latest Nepal tax rules. Instant result. Free, no login required.',
  slug: 'nepal-vat',
  keywords: ['nepal vat calculator', 'vat calculator', '13% vat nepal', 'add vat', 'remove vat'],
});

export default function Page() {
  return <NepalVATCalculator />;
}
