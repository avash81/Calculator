import { ReactNode } from 'react';
import { NepalFlag } from '@/components/ui/NepalFlag';

export interface Calculator {
  id: string;
  slug: string;
  name: string;
  icon: ReactNode;
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
  icon: ReactNode;
  calculators: Calculator[];
}

// ALL 80+ CALCULATORS:
export const CALCULATORS: Calculator[] = [

  // ── FINANCE ─────────────────────────────────────────
  { id:'loan-emi', slug:'loan-emi', name:'EMI Calculator',
    icon:'🏦', category:'finance', isHot:true,
    description:'Calculate monthly EMI for any loan',
    keywords:['emi','loan','home loan','car loan','monthly'] },

  { id:'sip', slug:'sip-calculator', name:'SIP Calculator',
    icon:'📈', category:'finance', isHot:true,
    description:'Calculate SIP returns and wealth growth',
    keywords:['sip','mutual fund','investment','returns'] },

  { id:'fd', slug:'fd-calculator', name:'Fixed Deposit (FD)',
    icon:'🏛️', category:'finance',
    description:'Calculate FD maturity with interest',
    keywords:['fd','fixed deposit','savings','interest'] },

  { id:'compound', slug:'compound-interest',
    name:'Compound Interest', icon:'💹', category:'finance',
    description:'Calculate compound interest over time',
    keywords:['compound','interest','growth'] },

  { id:'cagr', slug:'cagr-calculator', name:'CAGR Calculator',
    icon:'📊', category:'finance',
    description:'Compound annual growth rate calculator',
    keywords:['cagr','growth rate','investment return'] },

  { id:'simple-interest', slug:'simple-interest',
    name:'Simple Interest', icon:'🧮', category:'finance',
    description:'Calculate simple interest quickly',
    keywords:['simple interest','si','principal'] },

  { id:'discount', slug:'discount-calculator',
    name:'Discount Calculator', icon:'🏷️', category:'finance',
    description:'Calculate discounted price and savings',
    keywords:['discount','sale','percentage off'] },

  { id:'tip', slug:'tip-calculator', name:'Tip Calculator',
    icon:'🤝', category:'finance',
    description:'Split bills and calculate tips',
    keywords:['tip','bill split','restaurant'] },

  // ── NEPAL RULES ─────────────────────────────────────
  { id:'nepal-tax', slug:'nepal-income-tax',
    name:'Income Tax (2082/83)', icon:'📋',
    category:'nepal', isNepal:true, isHot:true,
    description:'Nepal income tax based on FY 2082/83 slabs',
    keywords:['nepal tax','income tax','ird','tax 2082'] },

  { id:'nepal-salary', slug:'nepal-salary',
    name:'Nepal Salary Calculator', icon:'💼',
    category:'nepal', isNepal:true, isHot:true,
    description:'Net salary after SSF and CIT deductions',
    keywords:['nepal salary','ssf','cit','take home','monthly salary','paycheck'] },

  { id:'nepal-vat', slug:'nepal-vat',
    name:'VAT Calculator', icon:'🧾',
    category:'nepal', isNepal:true,
    description:'13% VAT inclusive or exclusive calculation',
    keywords:['vat','nepal vat','13 percent','tax','value added tax','bill vat'] },

  { id:'nepali-date', slug:'nepali-date',
    name:'Nepali Date Converter', icon:'📅',
    category:'nepal', isNepal:true, isHot:true,
    description:'Convert BS to AD and AD to BS dates instantly',
    keywords:['nepali date','bs to ad','bikram sambat','calendar'] },

  { id:'nepal-home-loan', slug:'nepal-home-loan',
    name:'Nepal Home Loan EMI', icon:'🏠',
    category:'nepal', isNepal:true,
    description:'Home loan EMI with NRB reference rates',
    keywords:['nepal home loan','housing loan','nrb rate'] },

  { id:'nepal-pf', slug:'nepal-provident-fund',
    name:'Provident Fund (PF)', icon:'🏦',
    category:'nepal', isNepal:true,
    description:'Calculate PF and gratuity for Nepal employees',
    keywords:['provident fund','pf','nepal pf','gratuity'] },

  { id:'growth-tax', slug:'nepal-tax-calculator',
    name:'Growth / CGT Tax', icon:'📈',
    category:'nepal', isNepal:true,
    description:'Calculate Capital Gains Tax on shares and land',
    keywords:['cgt','stock tax','real estate tax','nepse'] },

  { id:'mortgage-tax', slug:'mortgage-calculator',
    name:'Mortgage & Property Tax', icon:'🏠',
    category:'finance',
    description:'Comprehensive mortgage with tax and insurance',
    keywords:['mortgage','property tax','home insurance'] },

  // ── HEALTH ──────────────────────────────────────────
  { id:'bmi', slug:'bmi', name:'BMI Calculator',
    icon:'⚖️', category:'health', isHot:true,
    description:'Body Mass Index — WHO international standard',
    keywords:['bmi','body mass index','weight','height'] },

  { id:'bmr', slug:'bmr', name:'BMR & Calorie Calculator',
    icon:'🔥', category:'health',
    description:'Basal metabolic rate and daily calorie needs',
    keywords:['bmr','calories','tdee','diet'] },

  { id:'ideal-weight', slug:'ideal-weight',
    name:'Ideal Weight', icon:'🏋️', category:'health',
    description:'Calculate your ideal healthy weight range',
    keywords:['ideal weight','healthy weight','devine formula'] },

  { id:'body-fat', slug:'body-fat',
    name:'Body Fat %', icon:'📐', category:'health',
    description:'Estimate body fat percentage (Navy formula)',
    keywords:['body fat','fat percentage','navy formula'] },

  { id:'due-date', slug:'pregnancy-due-date',
    name:'Pregnancy Due Date', icon:'🤱', category:'health',
    description:'Calculate expected delivery date from LMP',
    keywords:['pregnancy','due date','lmp','delivery'] },

  { id:'water', slug:'water-intake',
    name:'Water Intake', icon:'💧', category:'health',
    description:'Daily water intake recommendation',
    keywords:['water','hydration','daily water'] },

  // ── EDUCATION ───────────────────────────────────────
  { id:'gpa', slug:'gpa', name:'GPA Calculator',
    icon:'🎓', category:'education', isHot:true,
    description:'Calculate GPA for TU, KU, PU and US system',
    keywords:['gpa','grade point','nepal gpa','tu gpa'] },

  { id:'cgpa', slug:'cgpa', name:'CGPA Calculator',
    icon:'📚', category:'education',
    description:'Calculate CGPA from semester grades',
    keywords:['cgpa','cumulative gpa','semester'] },

  { id:'percentage', slug:'percentage',
    name:'Percentage Calculator', icon:'%', category:'education',
    description:'Calculate percentage from marks obtained',
    keywords:['percentage','marks','grade','score'] },

  { id:'attendance', slug:'attendance',
    name:'Attendance Calculator', icon:'✅', category:'education',
    description:'Check if you have minimum 75% attendance',
    keywords:['attendance','minimum attendance','75 percent'] },

  { id:'marks-needed', slug:'marks-needed',
    name:'Marks Required', icon:'🎯', category:'education',
    description:'Calculate marks needed to achieve target grade',
    keywords:['marks needed','minimum marks','target grade'] },

  // ── CONVERSION ──────────────────────────────────────
  { id:'age', slug:'age-calculator', name:'Age Calculator',
    icon:'🎂', category:'conversion', isHot:true,
    description:'Calculate exact age in years, months, days',
    keywords:['age','birthday','how old','years'] },

  { id:'unit', slug:'unit-converter', name:'Unit Converter',
    icon:'🔄', category:'conversion',
    description:'Convert length, weight, temperature and more',
    keywords:['unit','convert','length','weight','temperature'] },

  { id:'roman', slug:'roman-numerals',
    name:'Roman Numerals', icon:'🏛️', category:'conversion',
    description:'Convert between Roman and Arabic numerals',
    keywords:['roman','numeral','convert','iv','xvi'] },

  { id:'num-words', slug:'number-to-words',
    name:'Number to Words', icon:'🔤', category:'conversion',
    description:'Convert numbers to Nepali and English words',
    keywords:['number words','rupees words','amount words'] },

  // ── UTILITY ─────────────────────────────────────────
  { id:'password', slug:'password-generator',
    name:'Password Generator', icon:'🔐', category:'utility',
    description:'Generate strong, secure random passwords',
    keywords:['password','generator','secure','random'] },

  { id:'qr', slug:'qr-generator', name:'QR Code Generator',
    icon:'📱', category:'utility',
    description:'Create QR codes for any URL or text',
    keywords:['qr code','qr','barcode','scan'] },

  { id:'word-count', slug:'word-counter',
    name:'Word Counter', icon:'📝', category:'utility',
    description:'Count words, characters, paragraphs',
    keywords:['word count','character count','text'] },

  // ── NEW EDUCATION / SCIENTIFIC ──────────────────────
  { id:'scientific', slug:'scientific-calculator',
    name:'Scientific Calculator', icon:'🔬', category:'education',
    description:'Full scientific calculator with trig and logs',
    keywords:['scientific','trig','sin','cos','log'] },

  { id:'fraction', slug:'fraction-calculator',
    name:'Fraction Calculator', icon:'➗', category:'education',
    description:'Add, subtract, multiply, divide fractions',
    keywords:['fraction','math','simplify'] },

  { id:'quadratic', slug:'quadratic-solver',
    name:'Quadratic Solver', icon:'📉', category:'education',
    description:'Solve quadratic equations ax² + bx + c = 0',
    keywords:['quadratic','roots','equation'] },

  { id:'sd', slug:'standard-deviation',
    name:'Standard Deviation', icon:'📊', category:'education',
    description:'Calculate mean, variance, and SD',
    keywords:['sd','statistics','mean','variance'] },

  { id:'log', slug:'logarithm-calculator',
    name:'Logarithm Calculator', icon:'🪵', category:'education',
    description:'Calculate log with any base',
    keywords:['log','logarithm','base'] },

  // ── ENGINEERING ─────────────────────────────────────
  { id:'concrete', slug:'concrete-mix',
    name:'Concrete Mix', icon:'🏗️', category:'engineering',
    isNew:true, isHot:true,
    description:'Estimate cement, sand and stone for concrete',
    keywords:['concrete','civil','cement bags','sand','aggregate'] },

  { id:'brick', slug:'brick-calculator',
    name:'Bricks Calculator', icon:'🧱', category:'engineering',
    isNew:true,
    description:'Calculate number of bricks for a wall',
    keywords:['bricks','wall','construction','quantity'] },
];

// Featured Nepal calculators (shown in red section)
export const FEATURED_NEPAL: Calculator[] = CALCULATORS.filter(
  c => c.isNepal && c.isHot
);

// Categories with their calculators (6-pillar architecture as per high-fidelity UI)
export const CATEGORIES: Category[] = [
  {
    id: 'nepal',
    name: 'Nepal Specific',
    icon: <NepalFlag />,
    calculators: CALCULATORS.filter(c => c.category === 'nepal'),
  },
  {
    id: 'finance',
    name: 'Finance Suite',
    icon: '💰',
    calculators: CALCULATORS.filter(c => c.category === 'finance'),
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '❤️',
    calculators: CALCULATORS.filter(c => c.category === 'health'),
  },
  {
    id: 'education',
    name: 'Education Hub',
    icon: '🎓',
    calculators: CALCULATORS.filter(c => c.category === 'education'),
  },
  {
    id: 'conversion',
    name: 'Conversion Tools',
    icon: '🔄',
    calculators: CALCULATORS.filter(c => c.category === 'conversion' || c.category === 'utility'),
  },
  {
    id: 'engineering',
    name: 'Engineering Hub',
    icon: '🏗️',
    calculators: CALCULATORS.filter(c => c.category === 'engineering'),
  },
];
