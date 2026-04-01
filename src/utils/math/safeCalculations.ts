/**
 * @fileoverview Safe math calculation utilities for CalcPro.NP
 * Includes validation for common financial and health metrics.
 */

export interface CalculationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Safe EMI Calculation with validation
 */
export function safeCalculateEMI(
  principal: number,
  annualRate: number,
  yearsOfTenure: number,
  method: 'reducing' | 'flat' = 'reducing'
): CalculationResult<{
  emi: number;
  totalInterest: number;
  totalPayment: number;
}> {
  // Validation
  if (principal <= 0) {
    return { success: false, error: 'Principal must be greater than 0' };
  }
  if (annualRate < 0 || annualRate > 100) {
    return { success: false, error: 'Interest rate must be between 0% and 100%' };
  }
  if (yearsOfTenure <= 0 || yearsOfTenure > 50) {
    return { success: false, error: 'Tenure must be between 1 and 50 years' };
  }

  const months = yearsOfTenure * 12;
  const monthlyRate = annualRate / 12 / 100;

  try {
    let emi: number, totalInterest: number;

    if (method === 'flat') {
      const totalInterestAmount = principal * (annualRate / 100) * yearsOfTenure;
      const totalAmount = principal + totalInterestAmount;
      emi = totalAmount / months;
      totalInterest = totalInterestAmount;
    } else {
      // Reducing balance formula
      const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
      const denominator = Math.pow(1 + monthlyRate, months) - 1;

      if (!isFinite(numerator) || !isFinite(denominator)) {
        return { 
          success: false, 
          error: 'Calculation resulted in invalid number. Please check inputs.' 
        };
      }

      emi = (principal * numerator) / denominator;
      const totalAmount = emi * months;
      totalInterest = totalAmount - principal;
    }

    // Check for reasonable results
    if (!isFinite(emi) || emi <= 0) {
      return { 
        success: false, 
        error: 'Invalid calculation result. Please verify inputs.' 
      };
    }

    return {
      success: true,
      data: {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(principal + totalInterest),
      },
    };
  } catch (err) {
    return { 
      success: false, 
      error: `Calculation failed: ${err instanceof Error ? err.message : 'Unknown error'}` 
    };
  }
}

/**
 * Safe BMI Calculation
 */
export function safeCalculateBMI(
  weight: number,
  height: number,
  unit: 'metric' | 'imperial' = 'metric'
): CalculationResult<{
  bmi: number;
  category: string;
  status: 'underweight' | 'normal' | 'overweight' | 'obese';
}> {
  // Validation
  if (weight <= 0 || weight > 500) {
    return { success: false, error: 'Weight must be between 1kg and 500kg' };
  }

  let heightInMeters: number;

  if (unit === 'metric') {
    if (height <= 0 || height > 300) {
      return { success: false, error: 'Height must be between 1cm and 300cm' };
    }
    heightInMeters = height / 100;
  } else {
    // Imperial: height in inches
    if (height <= 0 || height > 120) {
      return { success: false, error: 'Height must be between 1 and 120 inches' };
    }
    heightInMeters = height * 0.0254;
  }

  try {
    const bmi = weight / (heightInMeters * heightInMeters);

    if (!isFinite(bmi)) {
      return { success: false, error: 'Invalid BMI calculation' };
    }

    let category: string;
    let status: 'underweight' | 'normal' | 'overweight' | 'obese';

    if (bmi < 18.5) {
      category = 'Underweight';
      status = 'underweight';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      status = 'normal';
    } else if (bmi < 30) {
      category = 'Overweight';
      status = 'overweight';
    } else {
      category = 'Obese';
      status = 'obese';
    }

    return {
      success: true,
      data: { bmi: parseFloat(bmi.toFixed(1)), category, status },
    };
  } catch (err) {
    return { success: false, error: 'BMI calculation failed' };
  }
}

/**
 * Safe percentage calculation with zero-division handling
 */
export function safeCalculatePercentage(
  part: number,
  whole: number
): CalculationResult<number> {
  if (whole === 0) {
    return { success: false, error: 'Divisor cannot be zero' };
  }
  if (part < 0 || whole < 0) {
    return { success: false, error: 'Values must be non-negative' };
  }

  const percentage = (part / whole) * 100;
  return { success: true, data: percentage };
}

/**
 * Safe Quadratic Equation Solver
 */
export interface QuadraticResult {
  roots: Array<{ real: number; imaginary?: number; display: string }>;
  discriminant: number;
  hasComplex: boolean;
}

export function solveQuadratic(
  a: number,
  b: number,
  c: number
): CalculationResult<QuadraticResult> {
  // Validation
  if (a === 0) {
    return { success: false, error: 'Coefficient a cannot be zero (not a quadratic)' };
  }

  const discriminant = b * b - 4 * a * c;

  try {
    const roots: QuadraticResult['roots'] = [];
    const hasComplex = discriminant < 0;

    if (Math.abs(discriminant) < 1e-10) {
      // One repeated root
      const root = -b / (2 * a);
      roots.push({
        real: root,
        display: root.toFixed(4),
      });
    } else if (discriminant > 0) {
      // Two real roots
      const sqrtDis = Math.sqrt(discriminant);
      const root1 = (-b + sqrtDis) / (2 * a);
      const root2 = (-b - sqrtDis) / (2 * a);
      roots.push(
        { real: root1, display: root1.toFixed(4) },
        { real: root2, display: root2.toFixed(4) }
      );
    } else {
      // Two complex roots
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);

      roots.push(
        {
          real: realPart,
          imaginary: imaginaryPart,
          display: `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`,
        },
        {
          real: realPart,
          imaginary: -imaginaryPart,
          display: `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`,
        }
      );
    }

    return {
      success: true,
      data: { roots, discriminant, hasComplex },
    };
  } catch (err) {
    return { success: false, error: 'Calculation failed' };
  }
}

