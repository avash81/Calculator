/**
 * Tax Config — Phase 1 Optimization
 * 
 * Centralized fiscal year management for Nepal Income Tax.
 * Allows easy updating of tax slabs for future budgets.
 */

export const TAX_YEARS = {
  '2082/83': {
    year: '2082/83',
    label: 'FY 2082/83 (Current)',
    status: 'active' as const,
    slabs: [
      { min: 0, max: 500000, rate: 0.01, label: 'First 5 lakhs @ 1%' },
      { min: 500000, max: 700000, rate: 0.10, label: 'Next 2 lakhs @ 10%' },
      { min: 700000, max: 1000000, rate: 0.20, label: 'Next 3 lakhs @ 20%' },
      { min: 1000000, max: 2000000, rate: 0.30, label: 'Next 10 lakhs @ 30%' },
      { min: 2000000, max: 5000000, rate: 0.36, label: 'Next 30 lakhs @ 36%' },
      { min: 5000000, max: Infinity, rate: 0.39, label: 'Above 50 lakhs @ 39%' },
    ],
  },
  '2083/84': {
    year: '2083/84',
    label: 'FY 2083/84 (Projection)',
    status: 'upcoming' as const,
    slabs: [
      { min: 0, max: 550000, rate: 0.01, label: 'First 5.5 lakhs @ 1%' },
      { min: 550000, max: 750000, rate: 0.10, label: 'Next 2 lakhs @ 10%' },
      { min: 750000, max: 1050000, rate: 0.20, label: 'Next 3 lakhs @ 20%' },
      { min: 1050000, max: 2050000, rate: 0.30, label: 'Next 10 lakhs @ 30%' },
      { min: 2050000, max: 5050000, rate: 0.36, label: 'Next 30 lakhs @ 36%' },
      { min: 5050000, max: Infinity, rate: 0.39, label: 'Above 50.5 lakhs @ 39%' },
    ],
  },
};

export const DEDUCTIONS = {
  life_insurance: {
    name: 'Life Insurance Premium',
    limit: 100000,
    description: 'Max ₹1 lakh per year',
  },
  home_loan_interest: {
    name: 'Home Loan Interest',
    limit: 'unlimited',
    description: 'Full interest on first home only',
  },
  education_allowance: {
    name: 'Education Allowance',
    limit: 'unlimited',
    description: 'For dependent children (up to 4 children)',
  },
  professional_fees: {
    name: 'Professional/Trading Fees',
    limit: Infinity,
    description: 'For self-employed professionals',
  },
};
