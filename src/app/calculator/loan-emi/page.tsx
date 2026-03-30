import { calcMeta } from '@/lib/calcMeta';
import EMICalculator from './Calculator';

export const metadata = calcMeta({
  title: 'EMI Calculator Nepal — Home Loan, Car Loan, Personal',
  description: 'Calculate monthly EMI for any loan in Nepal. Amortization schedule, total interest, principal breakdown. All Nepal bank rates supported. Free online tool.',
  slug: 'loan-emi',
  keywords: ['emi calculator nepal', 'loan emi calculator', 'home loan emi nepal', 'car loan calculator nepal'],
});

export default function Page() {
  return <EMICalculator />;
}
