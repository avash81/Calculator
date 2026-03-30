import Link from 'next/link';
import { NepalFlag } from '@/components/ui/NepalFlag';
import { Calculator } from '@/data/calculators';

interface Props {
  calc: Calculator;
  compact?: boolean;
}

export function CalculatorCard({ calc, compact = false }: Props) {
  return (
    <Link
      href={`/calculator/${calc.slug}`}
      className={`
        group flex flex-col gap-2 p-4 bg-white rounded-xl
        border border-gray-100 hover:border-blue-200
        hover:shadow-md transition-all duration-200
        cursor-pointer text-left no-underline h-full
        ${calc.isNepal ? 'border-t-2 border-t-red-400' : ''}
      `}
    >
      {/* Header row: icon + badges */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-2xl leading-none flex-shrink-0"
          role="img"
          aria-hidden="true"
        >
          {calc.icon}
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {calc.isNepal && <NepalFlag />}
          {calc.isNew && (
            <span className="inline-flex items-center bg-purple-50
                             text-purple-600 text-[9px] font-semibold
                             px-1.5 py-0.5 rounded border
                             border-purple-200">
              NEW
            </span>
          )}
          {calc.isHot && (
            <span className="inline-flex items-center bg-orange-50
                             text-orange-600 text-[9px] font-semibold
                             px-1.5 py-0.5 rounded border
                             border-orange-200">
              HOT
            </span>
          )}
        </div>
      </div>

      {/* Calculator name */}
      <div className="text-sm font-medium text-gray-900
                       group-hover:text-blue-600 transition-colors
                       leading-snug">
        {calc.name}
      </div>

      {/* Description (hide in compact mode) */}
      {!compact && (
        <div className="text-xs text-gray-500 leading-relaxed
                         line-clamp-2 flex-1">
          {calc.description}
        </div>
      )}

      {/* CTA */}
      <div className="text-xs text-blue-600 font-medium mt-auto
                       group-hover:translate-x-0.5 transition-transform">
        Calculate →
      </div>
    </Link>
  );
}
