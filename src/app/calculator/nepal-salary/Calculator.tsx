'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

const SLABS = {
  single: [
    {limit:500000, rate:0.01},
    {limit:200000, rate:0.10},
    {limit:300000, rate:0.20},
    {limit:1000000,rate:0.30},
    {limit:3000000,rate:0.36},
    {limit:Infinity,rate:0.39},
  ],
  married: [
    {limit:600000, rate:0.01},
    {limit:200000, rate:0.10},
    {limit:300000, rate:0.20},
    {limit:1000000,rate:0.30},
    {limit:3000000,rate:0.36},
    {limit:Infinity,rate:0.39},
  ],
};

function calcTax(income:number, married:boolean, ssf:boolean, ssfAmt:number) {
  const taxable = ssf ? Math.max(0, income - ssfAmt) : income;
  const slabs = married ? SLABS.married : SLABS.single;
  let rem = taxable, total = 0;
  slabs.forEach((s, i) => {
    if (rem <= 0) return;
    const chunk = Math.min(rem, s.limit);
    const waived = i === 0 && ssf;
    const tax = waived ? 0 : chunk * s.rate;
    total += tax;
    rem -= chunk;
  });
  return total;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-IN');
}

export default function NepalSalaryCalculator() {
  const [basic, setBasic] = useState(50000);
  const [allowance, setAllowance] = useState(10000);
  const [married, setMarried] = useState(false);
  const [ssf, setSsf] = useState(true);
  const [cit, setCit] = useState(false);

  const debBasic = useDebounce(basic, 300);
  const debAllowance = useDebounce(allowance, 300);

  const result = useMemo(() => {
    const b = debBasic;
    const a = debAllowance;
    const grossMonthly = b + a;
    const grossAnnual = grossMonthly * 12;

    let ssfEmp = 0;
    let ssfEmpr = 0;
    let citEmp = 0;
    let citEmpr = 0;

    if (ssf) {
      ssfEmp = b * 0.11;
      ssfEmpr = b * 0.20;
    }
    
    if (cit) {
      citEmp = b * 0.10;
      citEmpr = b * 0.10;
    }

    const totalDeductionsMonthly = ssfEmp + citEmp;
    const totalDeductionsAnnual = totalDeductionsMonthly * 12;

    const annualTax = calcTax(grossAnnual, married, ssf, totalDeductionsAnnual);
    const monthlyTax = annualTax / 12;

    const netMonthly = grossMonthly - totalDeductionsMonthly - monthlyTax;
    const ctcMonthly = grossMonthly + ssfEmpr + citEmpr;

    return {
      grossMonthly, grossAnnual,
      ssfEmp, ssfEmpr, citEmp, citEmpr,
      totalDeductionsMonthly,
      monthlyTax, annualTax,
      netMonthly, ctcMonthly
    };
  }, [debBasic, debAllowance, married, ssf, cit]);

  return (
    <>
      <JsonLd type="calculator"
        name="Nepal Salary Calculator"
        description="Calculate your net take-home salary in Nepal after SSF, CIT, and Income Tax deductions. Updated for 2082/83 fiscal year."
        url="https://calcpro.com.np/calculator/nepal-salary" />

      <CalcWrapper
        title="Nepal Salary Calculator"
        description="Calculate your net take-home salary after SSF, CIT, and Income Tax deductions based on Nepal IRD rules. Includes CTC breakdown."
        crumbs={[{label:'nepal rules',href:'/calculator?cat=nepal'}, {label:'salary calculator'}]}
        isNepal
        relatedCalcs={[
          {name:'Income Tax 2082/83',slug:'nepal-income-tax'},
          {name:'Provident Fund',slug:'nepal-provident-fund'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_350px] lg:items-start">
          <div className="border border-gray-200 rounded-xl p-5 space-y-6 bg-white">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Basic Salary</label>
              <div className="relative">
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" pattern="[0-9]*" value={basic} onChange={e => setBasic(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 text-base text-gray-900 bg-white focus:outline-none focus:border-blue-500 font-mono font-bold" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">NPR</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Monthly Allowances</label>
              <div className="relative">
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" pattern="[0-9]*" value={allowance} onChange={e => setAllowance(Number(e.target.value))} className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pr-12 text-base text-gray-900 bg-white focus:outline-none focus:border-blue-500 font-mono font-bold" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">NPR</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Marital Status</label>
              <div className="grid grid-cols-2 gap-2">
                {[{v:false,l:'Single'},{v:true,l:'Married'}].map(({v,l}) => (
                  <button key={l} onClick={()=>setMarried(v)} className={`py-3 text-xs font-bold uppercase tracking-widest rounded-lg border-2 transition-all min-h-[44px] ${married===v ?'border-blue-500 bg-blue-50 text-blue-700' :'border-gray-200 text-gray-400'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                <button onClick={()=>setSsf(!ssf)} className={`relative w-10 h-5 rounded-full transition-colors ${ssf?'bg-blue-500':'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${ssf?'left-5':'left-0.5'}`}/>
                </button>
                <div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">SSF Contributor</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">11% Employee, 20% Employer</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                <button onClick={()=>setCit(!cit)} className={`relative w-10 h-5 rounded-full transition-colors ${cit?'bg-blue-500':'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cit?'left-5':'left-0.5'}`}/>
                </button>
                <div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">CIT / Provident Fund</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">10% Employee, 10% Employer</div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="bg-green-600 rounded-xl p-6 text-center text-white shadow-lg">
              <div className="text-[10px] font-bold opacity-75 uppercase tracking-widest mb-2">Net Take-Home / Month</div>
              <div className="text-4xl font-bold font-mono mb-2">NPR {fmt(result.netMonthly)}</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salary Breakdown (Monthly)</div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Gross Salary</span>
                  <span className="font-mono font-bold text-gray-900">{fmt(result.grossMonthly)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">SSF Deduction (11%)</span>
                  <span className="font-mono font-bold text-red-500">-{fmt(result.ssfEmp)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">CIT Deduction (10%)</span>
                  <span className="font-mono font-bold text-red-500">-{fmt(result.citEmp)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Income Tax</span>
                  <span className="font-mono font-bold text-red-500">-{fmt(result.monthlyTax)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Net Salary</span>
                  <span className="font-mono font-bold text-green-600 text-xl">{fmt(result.netMonthly)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost to Company (CTC)</div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Gross Salary</span>
                  <span className="font-mono font-bold text-gray-900">{fmt(result.grossMonthly)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Employer SSF (20%)</span>
                  <span className="font-mono font-bold text-blue-600">+{fmt(result.ssfEmpr)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Employer CIT (10%)</span>
                  <span className="font-mono font-bold text-blue-600">+{fmt(result.citEmpr)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Total CTC / Month</span>
                  <span className="font-mono font-bold text-gray-900 text-xl">{fmt(result.ctcMonthly)}</span>
                </div>
              </div>
            </div>

            <ShareResult 
              title="Salary Calculation" 
              result={`NPR ${fmt(result.netMonthly)}/mo`} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-salary?b=${basic}&a=${allowance}&m=${married}`} 
            />
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: 'How is net salary calculated in Nepal?',
            answer: 'Net salary is calculated by subtracting mandatory deductions (like Social Security Fund - SSF, Provident Fund, CIT) and Income Tax from your gross salary (Basic + Allowances).',
          },
          {
            question: 'What is the SSF contribution rate in Nepal?',
            answer: 'Under the Social Security Fund (SSF) rules, the employee contributes 11% of their basic salary, and the employer contributes 20%, making a total of 31% contribution.',
          },
          {
            question: 'Is CIT deduction tax-free in Nepal?',
            answer: 'Yes, contributions to the Citizen Investment Trust (CIT) are deducted from your gross income before calculating income tax, up to certain limits (usually 1/3 of total income or NPR 300,000 per year, whichever is lower).',
          },
          {
            question: 'What is CTC (Cost to Company)?',
            answer: 'CTC is the total amount an employer spends on an employee per year. It includes the gross salary plus all employer-side contributions like SSF (20%), CIT (10%), and other benefits.',
          },
          {
            question: 'How much income tax do I pay on my salary in Nepal?',
            answer: 'Income tax in Nepal is progressive, starting at 1% (waived for SSF contributors) for the first slab (NPR 500k for single, 600k for married) and going up to 39% for high earners.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
