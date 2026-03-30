/**
 * @fileoverview InternalLinks — Related calculator cards with SEO internal linking
 *
 * Renders a grid of related calculator links.
 * Used on blog posts and SEO guide pages to create internal link graph.
 * Each link passes link equity from content pages to calculator pages.
 *
 * @component
 */
import Link from 'next/link';
import { CALCULATORS } from '@/data/calculators';

interface InternalLinksProps {
  /** Array of calculator slugs to show */
  slugs: string[];
  /** Section heading */
  heading?: string;
  /** Optional context sentence above the links */
  context?: string;
}

/**
 * Shows related calculator links as a responsive grid.
 * Each card has the calculator name, description, and emoji icon.
 *
 * @param slugs    - Calculator slugs from CALCULATORS data
 * @param heading  - Section heading text
 * @param context  - Optional intro sentence
 */
export function InternalLinks({
  slugs,
  heading = 'Related Free Calculators',
  context,
}: InternalLinksProps) {
  const calcs = slugs
    .map(s => CALCULATORS.find(c => c.slug === s))
    .filter(Boolean) as typeof CALCULATORS;

  if (!calcs.length) return null;

  return (
    <div className="my-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
        {heading}
      </h3>
      {context && (
        <p className="text-xs text-gray-500 mb-4">{context}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {calcs.map(c => (
          <Link
            key={c.slug}
            href={`/calculator/${c.slug}`}
            className="flex items-center gap-3 bg-white border border-blue-100
                       rounded-xl px-3 py-2.5 hover:border-blue-400
                       hover:shadow-sm transition-all group"
          >
            <span className="text-xl flex-shrink-0" aria-hidden="true">
              {c.icon as string}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-blue-700
                               group-hover:text-blue-800 truncate">
                {c.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {c.description}
              </div>
            </div>
            <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact inline text link — use inside article body paragraphs.
 * Example: Use the <CalcLink slug="loan-emi" /> to calculate your EMI.
 */
export function CalcLink({
  slug,
  label,
}: {
  slug: string;
  label?: string;
}) {
  const calc = CALCULATORS.find(c => c.slug === slug);
  if (!calc) return null;
  return (
    <Link
      href={`/calculator/${slug}`}
      className="text-blue-600 hover:text-blue-800 underline
                 underline-offset-2 font-medium"
    >
      {label || calc.name}
    </Link>
  );
}
