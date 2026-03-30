'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { useDebounce } from '@/hooks/useDebounce';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';

const SLABS_BY_YEAR = {
  '2082/83': {
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
  },
  '2081/82': {
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
  },
  '2080/81': {
    single: [
      {limit:500000, rate:0.01},
      {limit:200000, rate:0.10},
      {limit:300000, rate:0.20},
      {limit:1000000,rate:0.30},
      {limit:Infinity,rate:0.36},
    ],
    married: [
      {limit:600000, rate:0.01},
      {limit:200000, rate:0.10},
      {limit:300000, rate:0.20},
      {limit:1000000,rate:0.30},
      {limit:Infinity,rate:0.36},
    ],
  },
};

function calcTax(income:number, married:boolean,
  ssf:boolean, ssfAmt:number, pf:number, cit:number,
  insurance:number, medical:number, year:string) {
  
  const totalDeductions = (ssf ? ssfAmt : 0) + pf + Math.min(300000, cit) + Math.min(40000, insurance) + Math.min(20000, medical);
  const taxable = Math.max(0, income - totalDeductions);
  
  const slabs = (SLABS_BY_YEAR as any)[year][married ? 'married' : 'single'];
  let rem = taxable, total = 0;
  const rows:any[] = [];
  slabs.forEach((s:any, i:number) => {
    if (rem <= 0) return;
    const chunk = Math.min(rem, s.limit);
    const waived = i === 0 && ssf;
    const tax = waived ? 0 : chunk * s.rate;
    rows.push({
      label: `Slab ${i+1} @ ${(s.rate*100).toFixed(0)}%`
        + (waived?' (SSF waived)':''),
      amount: chunk, rate: s.rate, tax, waived,
    });
    total += tax;
    rem -= chunk;
  });
  return { total, monthly: total/12,
    netMonthly:(income-total)/12, taxable,
    effective: income>0?(total/income)*100:0, rows };
}

const fmt = (n:number) =>
  'NPR ' + Math.round(n).toLocaleString('en-IN');

export default function NepalTaxCalculator() {
  const [year, setYear] = useState('2082/83');
  const [income, setIncome] = useState(800000);
  const [isMonthly, setIsMonthly] = useState(false);
  const [married, setMarried] = useState(false);
  const [ssf, setSsf] = useState(false);
  const [pf, setPf] = useState(0);
  const [cit, setCit] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [medical, setMedical] = useState(0);
  
  const debouncedIncome = useDebounce(income, 300);
  const annualIncome = isMonthly ? debouncedIncome * 12 : debouncedIncome;
  const ssfAmt = Math.round(annualIncome * 0.11);
  
  const r = useMemo(()=>calcTax(annualIncome,married,ssf,ssfAmt,pf,cit,insurance,medical,year),
    [annualIncome,married,ssf,ssfAmt,pf,cit,insurance,medical,year]);

  return (
    <>
      <JsonLd type="calculator"
        name={`Nepal Income Tax Calculator ${year}`}
        description={`Calculate Nepal income tax FY ${year} with SSF, CIT, and insurance deductions.`}
        url={`https://calcpro.com.np/calculator/nepal-income-tax`} />

      <CalcWrapper
        title={`Nepal Income Tax Calculator ${year}`}
        description={`Calculate annual income tax based on Nepal IRD progressive tax slabs. Supports SSF, PF, CIT, and insurance deductions. Updated for FY ${year}.`}
        crumbs={[{label:'nepal rules',href:'/calculator?cat=nepal'},
                 {label:`income tax ${year}`}]}
        isNepal
        relatedCalcs={[
          {name:'Nepal Salary Calculator',slug:'nepal-salary'},
          {name:'VAT Calculator',slug:'nepal-vat'},
          {name:'Nepali Date Converter',slug:'nepali-date'},
          {name:'EMI Calculator',slug:'loan-emi'},
        ]}
      >
        <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Inputs */}
          <div className="border border-gray-200 rounded-xl p-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">
                  Fiscal Year
                </label>
                <select value={year} onChange={e=>setYear(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900 bg-white">
                  {Object.keys(SLABS_BY_YEAR).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">
                  Income Type
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button onClick={()=>setIsMonthly(false)} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${!isMonthly?'bg-white shadow text-blue-600':'text-gray-500'}`}>Annual</button>
                  <button onClick={()=>setIsMonthly(true)} className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${isMonthly?'bg-white shadow text-blue-600':'text-gray-500'}`}>Monthly</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">
                {isMonthly ? 'Monthly' : 'Annual'} Gross Income
              </label>
              <div className="relative">
                <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" pattern="[0-9]*" value={income}
                  onChange={e=>setIncome(+e.target.value||0)}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 pr-12 text-base sm:text-sm focus:outline-none focus:border-blue-500 font-mono text-gray-900 bg-white"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                  NPR
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 tracking-wide">
                Marital Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[{v:false,l:'Single'},{v:true,l:'Married'}].map(({v,l}) => (
                  <button key={l} onClick={()=>setMarried(v)}
                    className={`min-h-[44px] py-2.5 text-sm font-medium rounded-lg border-2 transition-all
                      ${married===v ?'border-blue-500 bg-blue-50 text-blue-700' :'border-gray-200 text-gray-600'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Deductions & Benefits</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <button onClick={()=>setSsf(!ssf)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${ssf?'bg-blue-500':'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${ssf?'left-5':'left-0.5'}`}/>
                </button>
                <div>
                  <div className="text-sm font-medium text-gray-900">SSF Contributor</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-tight">Auto-deduct 11%, waive 1% SST</div>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">PF (Provident Fund)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={pf} onChange={e=>setPf(+e.target.value||0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 bg-white focus:outline-none focus:border-blue-500" placeholder="0"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">CIT (Trust)</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={cit} onChange={e=>setCit(+e.target.value||0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 bg-white focus:outline-none focus:border-blue-500" placeholder="Max 3L"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Life Insurance</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={insurance} onChange={e=>setInsurance(+e.target.value||0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 bg-white focus:outline-none focus:border-blue-500" placeholder="Max 40K"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Medical Ins.</label>
                  <input type="number" inputMode="decimal" pattern="[0-9.]*" inputMode="numeric" value={medical} onChange={e=>setMedical(+e.target.value||0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 bg-white focus:outline-none focus:border-blue-500" placeholder="Max 20K"/>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3 lg:sticky lg:top-20">
            <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
              <div className="text-xs font-semibold opacity-75 uppercase tracking-wide mb-1">
                Annual Tax
              </div>
              <div className="text-3xl font-bold font-mono">
                {fmt(r.total)}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {r.effective.toFixed(2)}% effective rate
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-75">Taxable Income:</span>
                  <span className="font-mono font-bold">{fmt(r.taxable)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {[
                {l:'Monthly Tax',v:fmt(r.monthly)},
                {l:'Net Take-home /mo',v:fmt(r.netMonthly), green:true},
              ].map(({l,v,green})=>(
                <div key={l} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
                    {l}
                  </div>
                  <div className={`text-lg font-bold font-mono ${green?'text-green-600':'text-gray-900'}`}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <ShareResult 
              title={`Nepal Income Tax ${year}`} 
              result={fmt(r.total)} 
              calcUrl={`https://calcpro.com.np/calculator/nepal-income-tax?income=${income}&married=${married}&ssf=${ssf}&year=${year}`} 
            />
            
            <button 
              onClick={() => window.print()}
              className="w-full py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              Print Estimate
            </button>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tax Slab Breakdown</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">{year}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-6 py-3">Slab</th>
                  <th className="text-right px-6 py-3">Income</th>
                  <th className="text-right px-6 py-3">Rate</th>
                  <th className="text-right px-6 py-3">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {r.rows.map((row:any,i:number)=>(
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-mono text-gray-600">
                      {Math.round(row.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-600">
                      {(row.rate*100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-mono font-bold text-gray-900">
                      {row.waived ? (
                        <span className="text-green-600">Waived</span>
                      ) : Math.round(row.tax).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50/50">
                  <td colSpan={3} className="px-6 py-4 font-bold text-sm text-gray-900 uppercase tracking-widest">
                    Total Income Tax
                  </td>
                  <td className="px-6 py-4 text-right font-black text-base font-mono text-blue-700">
                    {Math.round(r.total).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CalcFAQ faqs={[
          {
            question: `What are Nepal income tax slabs for ${year}?`,
            answer: `For single individuals in ${year}: 1% up to NPR 5 lakh, 10% next 2 lakh, 20% next 3 lakh, 30% next 10 lakh, 36% next 30 lakh, and 39% above. Married couples get a higher threshold of NPR 6 lakh for the 1% slab.`,
          },
          {
            question: 'How does SSF affect Nepal income tax?',
            answer: 'SSF (Social Security Fund) contributors get two main benefits: the SSF contribution (11% of basic salary) is deducted from taxable income, and the 1% Social Security Tax (SST) on the first slab is completely waived.',
          },
          {
            question: 'What is the CIT deduction limit in Nepal?',
            answer: 'Under the Nepal Income Tax Act, you can deduct up to NPR 300,000 or 1/3rd of your assessable income (whichever is lower) for contributions made to the Citizen Investment Trust (CIT).',
          },
          {
            question: 'Can I get tax deduction for life insurance in Nepal?',
            answer: 'Yes, you can claim a deduction for life insurance premiums paid, up to a maximum of NPR 40,000 per year.',
          },
          {
            question: 'How is Dashain bonus taxed in Nepal?',
            answer: 'Dashain bonus is treated as part of your annual gross income. It is added to your total salary and taxed according to the progressive slabs.',
          },
        ]} />
      </CalcWrapper>
    </>
  );
}
