import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Quadratic Equation Solver — Solve ax² + bx + c = 0',
  description: 'Solve quadratic equations of the form ax² + bx + c = 0. Get real and complex roots instantly with step-by-step discriminant analysis. Free online tool.',
  slug: 'quadratic-solver',
  keywords: ['quadratic solver', 'solve quadratic equation', 'quadratic formula', 'math equation solver', 'real and complex roots'],
});

export default function Page() {
  return <Calculator />;
}
