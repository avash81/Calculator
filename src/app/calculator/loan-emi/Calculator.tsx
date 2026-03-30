'use client';
import { useState, useMemo } from 'react';
import { CalcWrapper } from '@/components/calculator/CalcWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalcFAQ } from '@/components/calculator/CalcFAQ';
import { ShareResult } from '@/components/calculator/ShareResult';
import { PiggyBank, Briefcase, FileCheck, Info } from 'lucide-react';

export default function LoanEMICalculator() {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(11.5);
  const [tenure, setTenure] = useState(15);
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');
  const [fee, setFee] = useState(1);

  const result = useMemo(() => {
    const P = loan;
    const processingFee = (fee / 100) * P;
    const totalPrincipal = P + processingFee;
    
    if (method === 'flat') {
      const totalInterest = (P * (rate / 100) * tenure);
      const totalPayment = P + totalInterest;
      const emi = totalPayment / (tenure * 12);
      return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        feeAmount: Math.round(processingFee)
      };
    } else {
      const monthlyRate = rate / 12 / 100;
      const months = tenure * 12;
      const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - P;
      return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        feeAmount: Math.round(processingFee)
      };
    }
  }, [loan, rate, tenure, method, fee]);

  const nf = (n: number) => new Intl.NumberFormat('en-NP', { style:'currency', currency:'NPR', maximumFractionDigits:0 }).format(n);

  return (
    <>
      <JsonLd type="calculator" name="Advanced EMI Calculator (NPR)" description="Professional EMI calculator for Home, Car, and Personal loans in Nepal. Supports Flat and Reducing rates." url="https://calcpro.com.np/calculator/loan-emi" />

      <CalcWrapper
        title="EMI Calculator"
        description="Professional financial tool for calculating equated monthly installments with support for processing fees and multiple calculation methods."
        crumbs={[{label:'finance',href:'/calculator?cat=finance'}, {label:'emi calculator'}]}
        relatedCalcs={[{name:'Home Loan',slug:'nepal-home-loan'},{name:'Personal Loan',slug:'loan-emi'}]}
      >
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_360px] gap-10">
          
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/40 border border-gray-50 dark:border-gray-800 space-y-10">
            
            <div className="flex bg-gray-50/80 dark:bg-gray-800/20 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800">
               <button onClick={() => setMethod('reducing')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all ${method === 'reducing' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Reducing Rate</button>
               <button onClick={() => setMethod('flat')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all ${method === 'flat' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Flat Rate</button>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loan Principal (Rs.)</label>
                     <span className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-full border border-blue-100">{nf(loan)}</span>
                  </div>
                  <input type="range" min="100000" max="20000000" step="100000" value={loan} onChange={e => setLoan(Number(e.target.value))} className="w-full accent-blue-600 opacity-80 hover:opacity-100 transition-opacity cursor-pointer h-2 bg-gray-100 rounded-lg" />
                  <input type="number" value={loan} onChange={e => setLoan(Number(e.target.value))} className="w-full h-14 bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 font-black text-xl text-gray-900 dark:text-white outline-none transition-all" />
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Interest Rate (%)</label>
                     <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 font-black text-lg text-gray-900 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tenure (Years)</label>
                     <input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 font-black text-lg text-gray-900 outline-none transition-all" />
                  </div>
               </div>

               <div className="p-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-50 dark:border-blue-900/30 flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                     <PiggyBank className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                     <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Processing Fee</div>
                     <div className="flex items-center gap-3">
                        <input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} className="w-20 bg-transparent text-xl font-black text-gray-900 outline-none" />
                        <span className="text-xl font-black text-gray-400">%</span>
                        <div className="ml-auto text-sm font-bold text-blue-600 bg-white/80 px-3 py-1 rounded-lg border border-blue-100">{nf(result.feeAmount)}</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-10">
            <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
               <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-gray-400">Monthly EMI</div>
               <div className="text-6xl font-black mb-8 tracking-tighter text-blue-500">{nf(result.emi)}</div>
               
               <div className="space-y-4 pt-6 border-t border-white/5">
                 <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500 uppercase tracking-widest">Total Interest</span>
                    <span className="font-black text-gray-200">{nf(result.totalInterest)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs pb-4">
                    <span className="font-bold text-gray-500 uppercase tracking-widest">Total Repayment</span>
                    <span className="font-black text-white">{nf(result.totalPayment)}</span>
                 </div>
               </div>

               <div className="mt-8">
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                     <div className="bg-blue-600 h-full rounded-full" style={{width: `${(loan/result.totalPayment)*100}%`}} />
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase tracking-widest">
                     <span>Principal: {Math.round((loan/result.totalPayment)*100)}%</span>
                     <span>Interest: {Math.round((result.totalInterest/result.totalPayment)*100)}%</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white border border-gray-100 p-6 rounded-3xl text-center">
                  <Briefcase className="w-5 h-5 text-gray-300 mx-auto mb-2" />
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Fee Coverage</div>
                  <div className="text-sm font-black text-gray-900">{nf(result.feeAmount)}</div>
               </div>
               <div className="bg-white border border-gray-100 p-6 rounded-3xl text-center">
                  <FileCheck className="w-5 h-5 text-gray-300 mx-auto mb-2" />
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-sm font-black text-green-500 uppercase">Verified</div>
               </div>
            </div>

            <ShareResult title="My EMI Projection" result={`${nf(result.emi)} per month`} calcUrl="https://calcpro.com.np/calculator/loan-emi" />
          </div>
        </div>

        <div className="mt-20">
          <CalcFAQ faqs={[
            { question: 'What is Reducing vs Flat Rate?', answer: 'Reducing balance calculates interest only on the outstanding principal, meaning interest decreases over time. Flat rate calculates interest on the initial loan amount for the entire duration.' },
            { question: 'Do I need to pay a Processing Fee?', answer: 'Most banks in Nepal charge 0.5% to 1.5% as a one-time processing fee which is normally deducted from the sanctioned loan amount.' }
          ]} />
        </div>
      </CalcWrapper>
    </>
  );
}
