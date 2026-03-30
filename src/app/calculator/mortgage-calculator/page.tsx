import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Mortgage & Property Calculator — Include Tax & Insurance',
  description: 'Comprehensive mortgage calculator that includes property tax, home insurance, and principal/interest payments. Google search style UI and exact tax estimation for properties.',
  slug: 'mortgage-calculator',
  keywords: ['mortgage calculator with tax', 'home loan payment calculator', 'property tax calculator', 'property insurance calculator'],
});

export default function Page() {
  return <Calculator />;
}
