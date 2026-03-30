import { calculateNepalIncomeTax, calculateNepalVAT } from '../../utils/math/country-rules/nepal';

describe('nepal math utils', () => {
  test('calculateNepalIncomeTax - single, no SSF', () => {
    // 8 lakh income, single, no SSF:
    // 5 lakh @ 1% = 5000
    // 2 lakh @ 10% = 20000
    // 1 lakh @ 20% = 20000
    // Total = 45000
    const res = calculateNepalIncomeTax(800000, false, false);
    expect(res.totalTax).toBe(45000);
  });

  test('calculateNepalIncomeTax - married, SSF', () => {
    // 8 lakh income, married, SSF:
    // SSF deduction (11% of 800k = 88k)
    // Taxable = 712k
    // 6 lakh @ 0% (waived) = 0
    // 1.12 lakh @ 10% = 11200
    // Total = 11200
    const res = calculateNepalIncomeTax(800000, true, true);
    expect(res.totalTax).toBe(11200);
  });

  test('calculateNepalVAT', () => {
    expect(calculateNepalVAT(100, 'exclusive').vatAmount).toBe(13);
    expect(calculateNepalVAT(113, 'inclusive').priceExcludingVAT).toBe(100);
  });
});
