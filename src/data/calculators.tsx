import { ReactNode } from 'react';

export interface Calculator {
  id: string;
  slug: string;
  name: string;
  icon: string | ReactNode;
  description: string;
  category: string;
  isNepal?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  keywords?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  calculators: Calculator[];
}

export const CALCULATORS: Calculator[] = [
  // NEPAL SPECIFIC (6 tools revitalized)
  {
    id: 'nepal-income-tax',
    slug: 'nepal-income-tax',
    name: 'Income Tax 2082/83',
    icon: '📋',
    description: 'Official Nepal tax calculator for FY 2082/83. Supports Marital status, EPF, SSF, and insurance deductions.',
    category: 'nepal',
    isNepal: true,
    isHot: true,
    keywords: ['nepal tax', 'income tax nepal', 'salary tax', 'ssf', 'epf']
  },
  {
    id: 'nepal-salary',
    slug: 'nepal-salary',
    name: 'Salary Calculator',
    icon: '💼',
    description: 'Calculate net-take-home salary with all Nepal legal deductions (SSF, CIT, Social Security Tax).',
    category: 'nepal',
    isNepal: true,
    isNew: true
  },
  {
    id: 'nepal-land',
    slug: 'nepal-land',
    name: 'Nepal Land (R-A-P-D)',
    icon: '🗺️',
    description: 'Convert between Ropani, Aana, Bigha, Kattha and Square Feet. Precision land measurement.',
    category: 'nepal',
    isNepal: true,
    isHot: true
  },
  {
    id: 'nepali-date',
    slug: 'nepali-date',
    name: 'Nepali Date Converter',
    icon: '📅',
    description: 'Bikram Sambat (BS) to Anno Domini (AD) official converter. Accurate for all historic dates.',
    category: 'nepal',
    isNepal: true
  },
  {
    id: 'nepal-vat',
    slug: 'nepal-vat',
    name: 'VAT & Bill Calc',
    icon: '🧾',
    description: 'Quick VAT (13%) addition and subtraction for business bills in Nepal.',
    category: 'nepal',
    isNepal: true
  },
  {
    id: 'nepal-home-loan',
    slug: 'nepal-home-loan',
    name: 'Home Loan (Nepal)',
    icon: '🏠',
    description: 'Calculate home loan EMI based on commercial bank rates in Nepal.',
    category: 'nepal',
    isNepal: true
  },

  // FINANCE PILLAR
  {
    id: 'loan-emi',
    slug: 'loan-emi',
    name: 'Loan EMI Pro',
    icon: '🏦',
    description: 'Professional EMI calculator for home, car, and personal loans with amortization schedules.',
    category: 'finance',
    isHot: true
  },
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    name: 'SIP/Investment',
    icon: '📈',
    description: 'Project your future wealth with Systematic Investment Plans (SIP) and compound interest.',
    category: 'finance',
    isHot: true
  },
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    name: 'Compound Interest',
    icon: '➕',
    description: 'Advanced compounding calculator with flexible contribution intervals.',
    category: 'finance'
  },
  
  // EDUCATION & MATH (Revitalized)
  {
    id: 'gpa',
    slug: 'gpa',
    name: 'GPA Calculator',
    icon: '🎓',
    description: 'Calculate your semester GPA or CGPA based on credit hours and grades. Supporting international systems.',
    category: 'education',
    isHot: true
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    name: 'Scientific Engine',
    icon: '⚙️',
    description: 'High-precision scientific calculator for complex calculus, trigonometry and engineering.',
    category: 'education',
    isHot: true
  },
  {
    id: 'physics-force',
    slug: 'physics-force',
    name: 'Physics: Force/Mass',
    icon: '⚛️',
    description: 'Calculate Force (F=ma), Acceleration, and Mass with unit normalization.',
    category: 'education',
    isNew: true
  },

  // CONVERSION & UTILITY (Revitalized)
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Converter',
    icon: '🔄',
    description: 'Convert Length, Weight, Temperature, and Volume across all international metrics.',
    category: 'conversion',
    isHot: true
  },
  {
    id: 'length-converter',
    slug: 'length-converter',
    name: 'Length & Distance',
    icon: '📏',
    description: 'Quickly convert between meters, kilometers, miles, and feet.',
    category: 'conversion',
    isNew: true
  },
  {
    id: 'weight-converter',
    slug: 'weight-converter',
    name: 'Weight & Mass',
    icon: '⚖️',
    description: 'Precision weight conversion: Grams, Kilograms, Pounds, and Ounces.',
    category: 'conversion',
    isNew: true
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'nepal',
    name: 'Nepal Specific',
    icon: '🇳🇵',
    calculators: CALCULATORS.filter(c => c.category === 'nepal'),
  },
  {
    id: 'finance',
    name: 'Finance & Tax',
    icon: '💰',
    calculators: CALCULATORS.filter(c => c.category === 'finance'),
  },
  {
    id: 'education',
    name: 'Math & Education',
    icon: '🎓',
    calculators: CALCULATORS.filter(c => c.category === 'education'),
  },
  {
    id: 'conversion',
    name: 'Converters',
    icon: '🔄',
    calculators: CALCULATORS.filter(c => c.category === 'conversion'),
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '❤️',
    calculators: CALCULATORS.filter(c => c.category === 'health'),
  }
];

export const FEATURED_NEPAL = CALCULATORS.filter(c => c.isNepal && (c.isHot || c.isNew));
