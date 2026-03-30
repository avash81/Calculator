import { Metadata } from 'next';
import { Mail, MessageCircle, MapPin, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | CalcPro.NP Support',
  description: 'Need help or have a feature request? Contact the CalcPro Nepal team for support or business inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:p-24">
        
        <div className="text-center mb-24">
           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/10">
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
           </div>
           <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter mb-6">Let&apos;s <span className="text-blue-600">Connect.</span></h1>
           <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto leading-relaxed italic">
              &quot;We&apos;re here to help you solve your most complex numeric problems, one calculation at a time.&quot;
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-2xl shadow-gray-200/50 hover:border-blue-200 transition-all group">
              <div className="mb-10 flex items-center justify-between">
                 <Mail className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
                 <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Support Email</h2>
              <p className="text-sm text-gray-400 mb-8 font-black uppercase tracking-widest">Available 24/7</p>
              <a href="mailto:support@calcpro.com.np" className="text-xl font-black text-blue-600 hover:scale-105 inline-block transition-all">support@calcpro.com.np</a>
           </div>

           <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl hover:bg-black transition-all">
              <div className="mb-10">
                 <MapPin className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">Digital Presence</h2>
              <p className="text-[10px] font-black text-gray-500 mb-8 uppercase tracking-[0.3em]">Rooted in Nepal</p>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Kathmandu, Nepal</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Reach</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-20 text-center">
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-all">← Back to World of Calculators</Link>
        </div>

      </div>
    </div>
  );
}
