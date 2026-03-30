/**
 * @fileoverview Finance calculation utilities — CalcPro.NP
 *
 * Pure functions for financial calculations. No side effects.
 * Safe to use in React useMemo hooks.
 *
 * Formulas:
 *   EMI: Standard reducing balance (P × R × (1+R)^N / ((1+R)^N - 1))
 *   SIP: Future value of monthly investments
 *   Compound: A = P(1 + r/n)^(nt)
 *   CAGR: (endValue/startValue)^(1/years) - 1
 *
 * @module utils/math/finance
 */
/**
 * Finance Math Engine
 * All results rounded to 2 decimal places.
 */

/**
 * Calculate Equated Monthly Installment (EMI)
 */
export function calculateEMI(principal: number, annualRate: number, tenureYears: number) {
  const P = principal;
  const R = annualRate / 12 / 100;
  const N = tenureYears * 12;

  if (R === 0) return { emi: P / N, totalPayment: P, totalInterest: 0 };

  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;

  const schedule = [];
  let balance = P;
  for (let i = 1; i <= N; i++) {
    const interest = balance * R;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    schedule.push({
      month: i,
      emi: Number(emi.toFixed(2)),
      principal: Number(principalPaid.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      balance: Number(Math.max(0, balance).toFixed(2)),
    });
  }

  return {
    emi: Number(emi.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    principalPercentage: Number(((P / totalPayment) * 100).toFixed(2)),
    interestPercentage: Number(((totalInterest / totalPayment) * 100).toFixed(2)),
    schedule,
  };
}

/**
 * Calculate Compound Interest
 */
export function calculateCompoundInterest(principal: number, rate: number, time: number, n: number = 1) {
  const amount = principal * Math.pow(1 + (rate / 100) / n, n * time);
  const interest = amount - principal;

  const yearlyBreakdown = [];
  let currentBalance = principal;
  for (let i = 1; i <= time; i++) {
    const opening = currentBalance;
    const yearlyInterest = currentBalance * (Math.pow(1 + (rate / 100) / n, n) - 1);
    currentBalance += yearlyInterest;
    yearlyBreakdown.push({
      year: i,
      opening: Number(opening.toFixed(2)),
      interest: Number(yearlyInterest.toFixed(2)),
      closing: Number(currentBalance.toFixed(2)),
    });
  }

  return {
    amount: Number(amount.toFixed(2)),
    interest: Number(interest.toFixed(2)),
    yearlyBreakdown,
  };
}

/**
 * Calculate SIP (Systematic Investment Plan)
 */
export function calculateSIP(monthlyInvestment: number, annualRate: number, tenureYears: number) {
  const P = monthlyInvestment;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalInvested = P * n;
  const wealthGained = futureValue - totalInvested;

  const projection = [];
  for (let i = 1; i <= tenureYears; i++) {
    const currentN = i * 12;
    const currentFV = P * ((Math.pow(1 + r, currentN) - 1) / r) * (1 + r);
    projection.push({
      year: i,
      value: Number(currentFV.toFixed(2)),
    });
  }

  return {
    futureValue: Number(futureValue.toFixed(2)),
    totalInvested: Number(totalInvested.toFixed(2)),
    wealthGained: Number(wealthGained.toFixed(2)),
    projection,
  };
}

/**
 * Calculate Fixed Deposit (FD)
 */
export function calculateFD(principal: number, rate: number, time: number, compoundingFrequency: number = 4) {
  const amount = principal * Math.pow(1 + (rate / 100) / compoundingFrequency, compoundingFrequency * time);
  const totalInterest = amount - principal;

  return {
    maturityAmount: Number(amount.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    effectiveRate: Number(((Math.pow(1 + (rate / 100) / compoundingFrequency, compoundingFrequency) - 1) * 100).toFixed(2)),
  };
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export function calculateCAGR(initialValue: number, finalValue: number, years: number) {
  const cagr = Math.pow(finalValue / initialValue, 1 / years) - 1;
  return {
    cagr: Number((cagr * 100).toFixed(2)),
    growthMultiple: Number((finalValue / initialValue).toFixed(2)),
  };
}

/**
 * Calculate Inflation
 */
export function calculateInflation(presentValue: number, rate: number, years: number) {
  const futureValue = presentValue * Math.pow(1 + rate / 100, years);
  const purchasingPowerLoss = futureValue - presentValue;
  return {
    futureValue: Number(futureValue.toFixed(2)),
    purchasingPowerLoss: Number(purchasingPowerLoss.toFixed(2)),
    inflationIndex: Number(Math.pow(1 + rate / 100, years).toFixed(2)),
  };
}

/**
 * Calculate Retirement Corpus
 */
export function calculateRetirement(currentAge: number, retirementAge: number, monthlyExpense: number, inflationRate: number) {
  const yearsToRetire = retirementAge - currentAge;
  const monthlyNeededAtRetirement = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
  
  // Simplified corpus calculation: 25x annual expense
  const projectedCorpus = monthlyNeededAtRetirement * 12 * 25;
  
  return {
    monthlyNeeded: Number(monthlyNeededAtRetirement.toFixed(2)),
    yearsToRetire,
    projectedCorpus: Number(projectedCorpus.toFixed(2)),
  };
}

/**
 * Calculate Discount
 */
export function calculateDiscount(originalPrice: number, discountPercentage: number) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discountAmount;
  return {
    discountAmount: Number(discountAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2)),
    savings: Number(discountAmount.toFixed(2)),
    savingsPercentage: discountPercentage,
  };
}

/**
 * Calculate Split Bill
 */
export function calculateSplitBill(total: number, tipPercentage: number, numberOfPeople: number) {
  const tip = (total * tipPercentage) / 100;
  const grandTotal = total + tip;
  const perPerson = grandTotal / numberOfPeople;
  return {
    total: Number(total.toFixed(2)),
    tip: Number(tip.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    perPerson: Number(perPerson.toFixed(2)),
  };
}
