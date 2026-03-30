import { calcMeta } from '@/lib/calcMeta';
import NepalSalaryCalculator from './Calculator';

export const metadata = calcMeta({
  title: 'Nepal Salary Calculator — Net Take-Home Pay',
  description: 'Calculate your net take-home salary in Nepal after SSF, CIT, and Income Tax deductions. Updated for 2082/83 fiscal year. Free online tool.',
  slug: 'nepal-salary',
  keywords: ['nepal salary calculator', 'net salary nepal', 'ssf calculator nepal', 'cit calculator nepal', 'take home salary nepal'],
});

export default function Page() {
  return <NepalSalaryCalculator />;
}
