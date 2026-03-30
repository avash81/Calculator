'use client';

import { useParams } from 'next/navigation';
import { CALCULATORS } from '@/data/calculators';
import { Info } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic imports for calculators
const EMICalculator = dynamic(() => import('@/components/calculators/EMICalculator'), { ssr: false });
const SIPCalculator = dynamic(() => import('@/components/calculators/SIPCalculator'), { ssr: false });
const IncomeTaxCalculator = dynamic(() => import('@/components/calculators/IncomeTaxCalculator'), { ssr: false });
const VATCalculator = dynamic(() => import('@/components/calculators/VATCalculator'), { ssr: false });

const CALCULATOR_COMPONENTS: Record<string, any> = {
  'loan-emi': EMICalculator,
  'sip-calculator': SIPCalculator,
  'nepal-income-tax': IncomeTaxCalculator,
  'nepal-vat': VATCalculator,
};

export default function CalculatorPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const calc = CALCULATORS.find(c => c.slug === slug);
  const CalcComponent = CALCULATOR_COMPONENTS[slug];

  if (!calc) return null;

  return (
    <div className="min-h-screen bg-cp-bg">
      {CalcComponent ? (
        <CalcComponent />
      ) : (
        <div className="page-container py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-cp-blue-light rounded-full flex items-center justify-center mx-auto">
            <Info className="w-10 h-10 text-cp-blue" />
          </div>
          <h1 className="text-display tracking-tight uppercase">{calc.name}</h1>
          <p className="text-cp-text-muted max-w-md mx-auto">
            We&apos;re currently building this tool to ensure it meets our high standards of accuracy and usability. Check back soon!
          </p>
          <div className="pt-4">
            <Link href="/calculators" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Explore Other Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
