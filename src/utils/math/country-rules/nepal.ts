import taxSlabs from '../../../data/nepal-tax-slabs.json';

/**
 * Nepal Income Tax Calculation FY 2082/83
 */
export function calculateNepalIncomeTax(
  annualIncome: number,
  isMarried: boolean,
  isSSFContributor: boolean,
  ssfAmountInput?: number
) {
  if (annualIncome <= 0) {
    return {
      grossIncome: 0,
      taxableIncome: 0,
      totalTax: 0,
      monthlyTax: 0,
      effectiveRate: 0,
      breakdown: [],
      isSSFBenefit: isSSFContributor
    };
  }

  const slabs = isMarried ? taxSlabs.individual.married : taxSlabs.individual.single;
  
  // SSF Deduction (Max 1/3 of income or 500,000)
  // Standard SSF is 11% from employee
  const ssfDeduction = isSSFContributor 
    ? (ssfAmountInput || Math.min(annualIncome / 3, 500000, annualIncome * 0.11))
    : 0;
  
  const taxableIncome = Math.max(0, annualIncome - ssfDeduction);
  let remaining = taxableIncome;
  let totalTax = 0;
  const breakdown = [];

  let previousLimit = 0;
  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const limit = slab.upTo === null ? Infinity : slab.upTo;
    const slabRange = limit - previousLimit;
    
    const taxableInSlab = Math.min(remaining, slabRange);
    
    if (taxableInSlab > 0) {
      let rate = slab.rate;
      
      // If SSF contributor, 1% SST is waived on the first slab
      if (i === 0 && isSSFContributor && taxSlabs.ssfWaivesFirstSlab) {
        rate = 0;
      }
      
      const taxAmount = taxableInSlab * rate;
      totalTax += taxAmount;
      
      breakdown.push({
        slabLabel: slab.label,
        taxableInSlab: Number(taxableInSlab.toFixed(2)),
        rate: rate * 100,
        taxAmount: Number(taxAmount.toFixed(2))
      });
      
      remaining -= taxableInSlab;
    }
    
    previousLimit = limit;
    if (remaining <= 0) break;
  }

  return {
    grossIncome: annualIncome,
    taxableIncome: Number(taxableIncome.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    monthlyTax: Number((totalTax / 12).toFixed(2)),
    effectiveRate: Number(((totalTax / annualIncome) * 100).toFixed(2)),
    breakdown,
    isSSFBenefit: isSSFContributor
  };
}

/**
 * Nepal Salary Breakdown
 */
export function calculateNepalSalary(
  grossSalary: number,
  isSSFContributor: boolean,
  isCITContributor: boolean,
  allowances: { hra: number; medical: number; transport: number; other: number } = { hra: 0, medical: 0, transport: 0, other: 0 }
) {
  const basicSalary = grossSalary * 0.6; // Assuming 60% is basic for SSF calculation
  
  const ssf_employee = isSSFContributor ? basicSalary * 0.11 : 0;
  const ssf_employer = isSSFContributor ? basicSalary * 0.20 : 0;
  
  const cit_employee = isCITContributor ? basicSalary * 0.10 : 0;
  const cit_employer = isCITContributor ? basicSalary * 0.10 : 0;
  
  const totalAllowances = allowances.hra + allowances.medical + allowances.transport + allowances.other;
  const totalGross = grossSalary + totalAllowances;
  
  const taxResult = calculateNepalIncomeTax(totalGross, false, isSSFContributor, ssf_employee + cit_employee);
  
  return {
    grossSalary,
    allowances,
    totalGross: Number(totalGross.toFixed(2)),
    deductions: {
      ssf_employee: Number(ssf_employee.toFixed(2)),
      ssf_employer: Number(ssf_employer.toFixed(2)),
      cit_employee: Number(cit_employee.toFixed(2)),
      cit_employer: Number(cit_employer.toFixed(2)),
      incomeTax: taxResult.totalTax
    },
    taxableIncome: taxResult.taxableIncome,
    incomeTax: taxResult.totalTax,
    netSalary: Number((totalGross - ssf_employee - cit_employee - (taxResult.totalTax / 12)).toFixed(2)),
    costToCompany: Number((totalGross + ssf_employer + cit_employer).toFixed(2))
  };
}

/**
 * Nepal VAT Calculator
 */
export function calculateNepalVAT(price: number, vatType: 'inclusive' | 'exclusive', rate: number = 13) {
  if (vatType === 'exclusive') {
    const vatAmount = (price * rate) / 100;
    return {
      priceExcludingVAT: Number(price.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      priceIncludingVAT: Number((price + vatAmount).toFixed(2)),
      vatRate: rate
    };
  } else {
    const priceExcludingVAT = price / (1 + rate / 100);
    const vatAmount = price - priceExcludingVAT;
    return {
      priceExcludingVAT: Number(priceExcludingVAT.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
      priceIncludingVAT: Number(price.toFixed(2)),
      vatRate: rate
    };
  }
}
