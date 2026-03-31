import { Metadata } from 'next';
import Calculator from './Calculator';

export const metadata: Metadata = {
  title: 'Engineering GPA ⚙️ — IOE, TU and KU Nepal | CalcPro.NP',
  description: 'Convert Engineering marks and percentages to GPA for IOE, Kathmandu University (KU), and TU students. Updated for 2082/83.',
  keywords: ['engineering gpa', 'ioe gpa', 'nepal gpa converter', 'tu engineering marks'],
  alternates: {
    canonical: 'https://calcpro.com.np/calculator/engineering-gpa-calculator',
  },
};

export default function Page() {
  return <Calculator />;
}
