import { calculateNepalIncomeTax, calculateNepalVAT } from '../../utils/math/country-rules/nepal';

describe('nepal math utils', () => {
  test('calculateNepalIncomeTax - non-positive income returns zeros', () => {
    const res = calculateNepalIncomeTax(0, false, false);
    expect(res.totalTax).toBe(0);
    expect(res.taxableIncome).toBe(0);
    expect(res.monthlyTax).toBe(0);
  });

  test('calculateNepalIncomeTax - SSF waiver applies (single, first-slab only)', () => {
    // annualIncome = 550,000
    // SSF deduction (max) = min(550k/3, 500k, 550k*0.11) = 60,500
    // taxableIncome = 489,500 which falls fully inside first slab (<= 500k)
    // => first slab is waived => total tax must be 0
    const res = calculateNepalIncomeTax(550000, false, true);
    expect(res.taxableIncome).toBe(489500);
    expect(res.totalTax).toBe(0);
  });

  test('calculateNepalIncomeTax - single without SSF spans first+second slabs', () => {
    // taxableIncome = 550,000
    // first slab: 500,000 @ 1% => 5,000
    // second slab: 50,000 @ 10% => 5,000
    const res = calculateNepalIncomeTax(550000, false, false);
    expect(res.totalTax).toBe(10000);
  });

  test('calculateNepalIncomeTax - ssfAmountInput is capped to policy max', () => {
    // For annualIncome 800,000 the max allowed SSF deduction is 11% => 88,000
    // Even if caller supplies a larger amount, deduction must be capped.
    const res = calculateNepalIncomeTax(800000, false, true, 999999);
    expect(res.taxableIncome).toBe(712000);
    expect(res.totalTax).toBe(22400);
  });

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
