/**
 * @fileoverview Nepal-specific calculation utilities — CalcPro.NP
 *
 * Pure functions for Nepal government rule-based calculations.
 * All rules verified against official Nepal government sources.
 *
 * @nepalRule Income Tax: Nepal IRD FY 2082/83 (ird.gov.np)
 * @nepalRule SSF: Social Security Fund (ssf.gov.np)
 * @nepalRule VAT: IRD Nepal — 13% standard rate
 * @nepalRule NRB: Nepal Rastra Bank reference rates
 *
 * IMPORTANT: Update slabs each fiscal year (mid-July Nepal).
 *
 * @module utils/math/nepal
 */
/**
 * Nepal-specific Calculators (Tax, VAT, etc.)
 */

export interface TaxResult {
  totalTax: number;
  effectiveRate: number;
  monthlyTax: number;
  takeHome: number;
  slabs: Array<{
    label: string;
    taxableAmount: number;
    rate: number;
    tax: number;
  }>;
}

// Nepal Income Tax FY 2082/83 (2025/26) - Nepal IRD
// Source: https://ird.gov.np
// Next update: mid-July 2083 (approx Aug 2026)
// DEPRECATED: use calculateNepalIncomeTax() from
//   src/utils/math/country-rules/nepal.ts instead
// Edit slabs in src/data/nepal-tax-slabs.json ONLY
import { calculateNepalIncomeTax } from './country-rules/nepal';

export function calculateNepalTax(annualIncome: number, status: 'single' | 'married', isSsf: boolean): TaxResult {
  const result = calculateNepalIncomeTax(annualIncome, status === 'married', isSsf);
  
  return {
    totalTax: result.totalTax,
    effectiveRate: result.effectiveRate,
    monthlyTax: result.monthlyTax,
    takeHome: annualIncome - result.totalTax,
    slabs: result.breakdown.map(b => ({
      label: b.slabLabel,
      taxableAmount: b.taxableInSlab,
      rate: b.rate,
      tax: b.taxAmount,
    })),
  };
}

export function calculateVat(amount: number, rate: number = 13) {
  const vatAmount = (amount * rate) / 100;
  return {
    vatAmount: Number(vatAmount.toFixed(2)),
    total: Number((amount + vatAmount).toFixed(2)),
    base: amount,
  };
}
