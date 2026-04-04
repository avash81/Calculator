import { Metadata } from 'next';
import { Calculator } from './Calculator';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { JsonLd } from '@/components/seo/JsonLd';

const faqs = [
  {
    question: "What is a lead time calculator?",
    answer: "A lead time calculator helps procurement professionals and engineers determine the exact calendar date an item will arrive based on a stated lead time, or conversely, what date an order must be placed to ensure delivery by a specific target deadline."
  },
  {
    question: "How are business days calculated?",
    answer: "When 'Business Days Only' is toggled, the calculator strictly skips Saturdays and Sundays during the elapsed time calculation, giving you an accurate working-day delivery metric."
  },
  {
    question: "Should I calculate using days, weeks, or months?",
    answer: "If a supplier quotes a lead time in weeks or months, it generally refers to elapsed calendar time. If they quote in days (e.g., '14 days lead time'), clarify if they mean business days or calendar days. Our tool supports both."
  }
];

export const metadata: Metadata = {
  title: 'Lead Time Calculator - Expected Delivery & Order Dates | CalcPro',
  description: 'Easily calculate expected delivery dates and when to place your orders based on manufacturing and shipping lead times. Includes business day logic.',
  keywords: 'lead time calculator, expected delivery calculator, order-by date calculator, lead time business days, supply chain calculator engineering',
  alternates: {
    canonical: 'https://calcly.com/calculator/lead-time'
  }
};

export default function LeadTimeCalculatorPage() {
  return (
    <>
      <JsonLd 
        type="calculator"
        name="Lead Time Calculator"
        description={metadata.description as string}
        url={metadata.alternates?.canonical as string}
        category="UtilitiesApplication"
      />
      <JsonLd type="faq" faqs={faqs} />
      
      <div className="hp-container py-12">
        <Calculator />
        <div className="mt-16">
          <CalcFAQ faqs={faqs} />
        </div>
      </div>
    </>
  );
}
