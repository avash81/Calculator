'use client';
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BreakdownTableProps {
  headers: string[];
  rows: (string | number | ReactNode)[][];
  highlightLast?: boolean;
  className?: string;
}

export function BreakdownTable({
  headers,
  rows,
  highlightLast = false,
  className,
}: BreakdownTableProps) {
  return (
    <div className={twMerge('overflow-x-auto rounded-xl border border-cp-border', className)}>
      <table className="breakdown-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className={i === headers.length - 1 ? 'text-right' : ''}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={clsx(highlightLast && i === rows.length - 1 && 'bg-cp-bg font-bold')}>
              {row.map((cell, j) => (
                <td key={j} className={clsx(j === row.length - 1 && 'amount')}>
                  {typeof cell === 'number' ? cell.toLocaleString() : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
