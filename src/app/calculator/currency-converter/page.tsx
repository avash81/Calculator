import { Metadata } from 'next';
import CurrencyCalculator from './Calculator';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';

export const metadata: Metadata = {
  title: 'Current Exchange Rates (NPR) & Currency Converter 2082',
  description: 'Convert USD, EUR, INR, GBP to Nepalese Rupees (NPR) with live-cached exchange rates. Professional currency calculator for travel and business in Nepal.',
  keywords: ['currency converter nepal', 'usd to npr', 'inr to npr', 'nepalese rupee exchange rate', 'live currency rates nepal'],
};

export default function CurrencyPage() {
  return (
    <CalcWrapper
      title="Currency Converter"
      description="Live benchmark exchange rates for top global currencies against the Nepalese Rupee (NPR). Updated hourly for accuracy."
      crumbs={[{ label: 'Utility', href: '/calculator?cat=utility' }, { label: 'Currency' }]}
      isNepal
    >
      <CurrencyCalculator />
    </CalcWrapper>
  );
}
