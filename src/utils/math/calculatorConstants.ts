/**
 * Professional Scientific Constants & Unit Conversions Library
 * Standard CODATA 2018/2022 Values
 */

export interface ScientificConstant {
  id: string;
  name: string;
  symbol: string;
  value: number;
  unit: string;
  category: 'Universal' | 'Atomic' | 'Physico-Chemical' | 'Nuclear' | 'Electromagnetic';
}

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  // Universal
  { id: 'c', name: 'Speed of Light', symbol: 'c', value: 299792458, unit: 'm/s', category: 'Universal' },
  { id: 'G', name: 'Gravitational Constant', symbol: 'G', value: 6.67430e-11, unit: 'm³/(kg·s²)', category: 'Universal' },
  { id: 'h', name: 'Planck Constant', symbol: 'h', value: 6.62607015e-34, unit: 'J·s', category: 'Universal' },
  { id: 'hbar', name: 'Reduced Planck Constant', symbol: 'ħ', value: 1.054571817e-34, unit: 'J·s', category: 'Universal' },
  
  // Electromagnetic
  { id: 'e', name: 'Elementary Charge', symbol: 'e', value: 1.602176634e-19, unit: 'C', category: 'Electromagnetic' },
  { id: 'mu0', name: 'Magnetic Constant', symbol: 'μ₀', value: 1.25663706212e-6, unit: 'N/A²', category: 'Electromagnetic' },
  { id: 'eps0', name: 'Electric Constant', symbol: 'ε₀', value: 8.8541878128e-12, unit: 'F/m', category: 'Electromagnetic' },
  { id: 'Phi0', name: 'Magnetic Flux Quantum', symbol: 'Φ₀', value: 2.067833848e-15, unit: 'Wb', category: 'Electromagnetic' },
  
  // Atomic
  { id: 'me', name: 'Electron Mass', symbol: 'mₑ', value: 9.1093837015e-31, unit: 'kg', category: 'Atomic' },
  { id: 'mp', name: 'Proton Mass', symbol: 'mₚ', value: 1.67262192369e-27, unit: 'kg', category: 'Atomic' },
  { id: 'mn', name: 'Neutron Mass', symbol: 'mₙ', value: 1.67492749804e-27, unit: 'kg', category: 'Atomic' },
  { id: 'alpha', name: 'Fine-Structure Constant', symbol: 'α', value: 0.0072973525693, unit: '', category: 'Atomic' },
  { id: 'Rinf', name: 'Rydberg Constant', symbol: 'R∞', value: 10973731.56816, unit: 'm⁻¹', category: 'Atomic' },
  { id: 'muB', name: 'Bohr Magneton', symbol: 'μ_B', value: 9.2740100783e-24, unit: 'J/T', category: 'Atomic' },
  { id: 'muN', name: 'Nuclear Magneton', symbol: 'μ_N', value: 5.0507837461e-27, unit: 'J/T', category: 'Atomic' },
  
  // Physico-Chemical
  { id: 'NA', name: 'Avogadro Constant', symbol: 'N_A', value: 6.02214076e23, unit: 'mol⁻¹', category: 'Physico-Chemical' },
  { id: 'R', name: 'Molar Gas Constant', symbol: 'R', value: 8.314462618, unit: 'J/(mol·K)', category: 'Physico-Chemical' },
  { id: 'k', name: 'Boltzmann Constant', symbol: 'k', value: 1.380649e-23, unit: 'J/K', category: 'Physico-Chemical' },
  { id: 'F', name: 'Faraday Constant', symbol: 'F', value: 96485.33212, unit: 'C/mol', category: 'Physico-Chemical' },
  { id: 'sigma', name: 'Stefan-Boltzmann Constant', symbol: 'σ', value: 5.670374419e-8, unit: 'W/(m²·K⁴)', category: 'Physico-Chemical' },
  { id: 'u', name: 'Atomic Mass Constant', symbol: 'u', value: 1.66053906660e-27, unit: 'kg', category: 'Physico-Chemical' },
  
  // Gravitational / Planetary
  { id: 'g0', name: 'Standard Gravity', symbol: 'g₀', value: 9.80665, unit: 'm/s²', category: 'Universal' },
  { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', value: 101325, unit: 'Pa', category: 'Universal' },
];

export interface UnitCategory {
  id: string;
  name: string;
  units: string[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  { id: 'length', name: 'Length', units: ['m', 'km', 'cm', 'mm', 'mile', 'yard', 'foot', 'inch', 'n_mile'] },
  { id: 'area', name: 'Area', units: ['m2', 'km2', 'cm2', 'mm2', 'hectare', 'acre', 'sq_mile', 'sq_foot'] },
  { id: 'volume', name: 'Volume', units: ['m3', 'cm3', 'liter', 'ml', 'gallon_us', 'quart_us', 'pint_us', 'cup'] },
  { id: 'mass', name: 'Mass', units: ['kg', 'gram', 'mg', 'metric_ton', 'pound', 'ounce', 'stone'] },
  { id: 'velocity', name: 'Velocity', units: ['m/s', 'km/h', 'mph', 'knot', 'mach'] },
  { id: 'pressure', name: 'Pressure', units: ['Pa', 'bar', 'atm', 'psi', 'mmHg'] },
  { id: 'energy', name: 'Energy', units: ['J', 'kJ', 'cal', 'kcal', 'kWh', 'eV', 'BTU'] },
  { id: 'power', name: 'Power', units: ['W', 'kW', 'hp', 'ft_lb/s'] },
  { id: 'time', name: 'Time', units: ['s', 'min', 'h', 'day', 'week', 'year'] },
  { id: 'temp', name: 'Temperature', units: ['celsius', 'fahrenheit', 'kelvin'] },
];
