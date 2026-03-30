import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Number to Words Converter — English Word Representation',
  description: 'Convert any number into its written English word representation. Useful for writing checks, legal documents, and educational purposes. Supports numbers up to trillions. Free online tool.',
  slug: 'number-to-words',
  keywords: ['number to words', 'convert number to text', 'write number on check', 'english number converter', 'math tool'],
});

export default function Page() {
  return <Calculator />;
}
