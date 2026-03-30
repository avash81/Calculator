import { calcMeta } from '@/lib/calcMeta';
import NepalTaxCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal Income Tax Calculator 2082/83 — Free IRD Tool',
  description: 'Calculate Nepal income tax FY 2082/83. Progressive slabs, SSF, CIT, PF deductions. Updated per Nepal IRD rules. Instant result. Free, no login required.',
  slug: 'nepal-income-tax',
  keywords: ['nepal income tax calculator 2082 83', 'nepal tax calculator', 'salary tax nepal', 'income tax nepal', 'nepal ird tax calculator'],
});

export default function Page() {
  return <NepalTaxCalculator />;
}
