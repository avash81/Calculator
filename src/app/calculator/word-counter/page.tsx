import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Word Counter — Count Words, Characters, Sentences',
  description: 'Count words, characters, sentences, and paragraphs in real-time. Estimate reading time and find most frequent words with our free online word counter. Free online tool.',
  slug: 'word-counter',
  keywords: ['word counter', 'character counter', 'word count tool', 'reading time calculator', 'text analysis tool'],
});

export default function Page() {
  return <Calculator />;
}
