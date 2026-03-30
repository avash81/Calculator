import { Metadata } from 'next';
import ConcreteCalculator from '@/components/calculators/ConcreteCalculator';

export const metadata: Metadata = {
  title: 'Concrete Mix Calculator | Civil Engineering Tools',
  description: 'Calculate the quantity of cement, sand, and stone aggregates required for concrete. Professional engineering tool for construction projects.',
  keywords: 'concrete mix, cement bags, sand calculator, aggregate quantity, civil engineering nepal',
};

export default function ConcreteMixPage() {
  return <ConcreteCalculator />;
}
