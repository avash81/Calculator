/**
 * @fileoverview useDebounce hook — CalcPro.NP
 *
 * Delays updating a value until after a period of inactivity.
 * Prevents expensive recalculations on every keystroke.
 * Essential for calculator sliders and number inputs.
 *
 * @example
 * // In a calculator — prevents recalc on every slider move:
 * const debouncedIncome = useDebounce(income, 300);
 * const result = useMemo(() => calcTax(debouncedIncome), [debouncedIncome]);
 */
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}
