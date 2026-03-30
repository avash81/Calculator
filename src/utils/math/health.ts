/**
 * @fileoverview Health calculation utilities — CalcPro.NP
 *
 * Pure functions for health/fitness calculations.
 * All formulas use WHO/international standards.
 *
 * BMI: WHO formula — weight(kg) / height(m)²
 * BMR: Mifflin-St Jeor (most accurate for general population)
 * Ideal Weight: Devine formula (±10% range)
 * Body Fat: US Navy formula
 *
 * @module utils/math/health
 */
/**
 * Health Math Engine
 */

export function calculateBMI(weight: number, height: number, unit: 'metric' | 'imperial' = 'metric') {
  let bmi: number;
  if (unit === 'metric') {
    bmi = weight / Math.pow(height / 100, 2);
  } else {
    bmi = (weight / Math.pow(height, 2)) * 703;
  }

  let category = '';
  let color = '';
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
  } else if (bmi < 25) {
    category = 'Normal';
    color = 'text-emerald-500';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'text-orange-500';
  } else if (bmi < 35) {
    category = 'Obese Class 1';
    color = 'text-red-500';
  } else if (bmi < 40) {
    category = 'Obese Class 2';
    color = 'text-red-600';
  } else {
    category = 'Obese Class 3';
    color = 'text-red-700';
  }

  return {
    bmi: Number(bmi.toFixed(2)),
    category,
    color,
    healthyRange: unit === 'metric' 
      ? { min: Number((18.5 * Math.pow(height / 100, 2)).toFixed(1)), max: Number((24.9 * Math.pow(height / 100, 2)).toFixed(1)) }
      : { min: Number(((18.5 * Math.pow(height, 2)) / 703).toFixed(1)), max: Number(((24.9 * Math.pow(height, 2)) / 703).toFixed(1)) }
  };
}

export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female') {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  return {
    bmr: Number(bmr.toFixed(0)),
    tdee: {
      sedentary: Number((bmr * multipliers.sedentary).toFixed(0)),
      light: Number((bmr * multipliers.light).toFixed(0)),
      moderate: Number((bmr * multipliers.moderate).toFixed(0)),
      active: Number((bmr * multipliers.active).toFixed(0)),
      veryActive: Number((bmr * multipliers.veryActive).toFixed(0))
    }
  };
}

export function calculatePregnancyDueDate(lmpDate: Date) {
  // Naegele's rule: LMP + 9 months + 7 days
  const dueDate = new Date(lmpDate);
  dueDate.setMonth(dueDate.getMonth() + 9);
  dueDate.setDate(dueDate.getDate() + 7);

  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    dueDate: dueDate.toDateString(),
    daysRemaining: Math.max(0, daysRemaining)
  };
}
