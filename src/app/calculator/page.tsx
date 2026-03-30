import { Suspense } from 'react';
import { Metadata } from 'next';
import CalculatorsList from './CalculatorsList';

export const metadata: Metadata = {
  title: 'All Calculators — CalcPro Nepal',
  description: 'Browse our complete library of professional-grade tools. From complex financial projections to Nepal-specific tax rules. Free online calculators.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-cp-bg font-sans py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center py-20">Loading calculators...</div>}>
        <CalculatorsList />
      </Suspense>
    </div>
  );
}
