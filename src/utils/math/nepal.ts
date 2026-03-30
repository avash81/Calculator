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
export function calculateNepalTax(annualIncome: number, status: 'single' | 'married', isSsf: boolean): TaxResult {
  const baseSlab = status === 'single' ? 500000 : 600000;
  const slabs = [
    { limit: baseSlab, rate: isSsf ? 0 : 1 }, // 1% SST waived for SSF
    { limit: 200000, rate: 10 },
    { limit: 300000, rate: 20 },
    { limit: 1000000, rate: 30 },
    { limit: 3000000, rate: 36 },
    { limit: Infinity, rate: 39 },
  ];

  let remaining = annualIncome;
  let totalTax = 0;
  const breakdown = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const taxableInThisSlab = Math.min(remaining, slab.limit);
    const tax = (taxableInThisSlab * slab.rate) / 100;
    
    if (taxableInThisSlab > 0) {
      totalTax += tax;
      breakdown.push({
        label: i === 0 ? `Up to ${slab.limit}` : `Next ${slab.limit === Infinity ? 'Above' : slab.limit}`,
        taxableAmount: taxableInThisSlab,
        rate: slab.rate,
        tax: Number(tax.toFixed(2)),
      });
    }
    
    remaining -= taxableInThisSlab;
    if (remaining <= 0) break;
  }

  return {
    totalTax: Number(totalTax.toFixed(2)),
    effectiveRate: Number(((totalTax / annualIncome) * 100).toFixed(2)),
    monthlyTax: Number((totalTax / 12).toFixed(2)),
    takeHome: Number(((annualIncome - totalTax) / 12).toFixed(2)),
    slabs: breakdown,
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
