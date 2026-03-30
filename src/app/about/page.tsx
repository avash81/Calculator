import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Target, Users, Mail, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About CalcPro.NP | Professional Calculators for Nepal',
  description: 'CalcPro.NP is Nepal’s premier destination for high-precision financial, tax, health, and engineering calculators. Built for accuracy, No Ads, 100% Free.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        <header className="mb-20 text-center">
           <Link href="/" className="inline-block text-xs font-black text-blue-600 uppercase tracking-widest mb-6 px-4 py-1.5 bg-blue-50 rounded-full">Explore Tools →</Link>
           <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-8">
             Precision Meets <span className="text-blue-600">Trust.</span>
           </h1>
           <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
             We build advanced tools that empower Nepalese people to make smarter decisions, every single day.
           </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
           <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Empowering 30 Million <br/> Minds in Nepal.</h2>
              <p className="text-gray-600 leading-relaxed">
                 Calculating Income Tax, EMI, or even BMI shouldn't involve complex spreadsheets or ad-filled websites. CalcPro.NP was founded with a single mission: to provide the most accurate, secure, and user-friendly calculation ecosystem for the Nepalese people.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-black text-blue-900 uppercase">Privacy First</span>
                 </div>
                 <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-black text-green-900 uppercase">100% Accurate</span>
                 </div>
              </div>
           </div>
           <div className="bg-gray-50 rounded-[3rem] p-10 flex flex-col justify-center border border-gray-100">
              <div className="text-4xl font-black text-gray-900 mb-2">40+</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Specialized Tools</div>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                 "Our goal is to make precision accessible, helping users from Kathmandu to Kanchanpur solve their numeric problems in seconds."
              </p>
           </div>
        </section>

        <div className="bg-gray-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
           <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <h2 className="text-3xl font-black">Join our mission.</h2>
                 <p className="text-gray-400 font-medium">We are always looking for feedback to improve our tools.</p>
              </div>
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-3xl shadow-xl shadow-blue-500/20 transition-all">
                CONTACT US
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
