import Link from 'next/link';
import { Search, Home, ArrowRight, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white dark:bg-gray-950">
      <div className="max-w-3xl w-full text-center space-y-12">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 bg-blue-50/50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-blue-100 dark:border-blue-800 animate-[spin_20s_linear_infinite]">
             <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
             </div>
          </div>
          <div className="absolute -top-4 -right-4 w-14 h-14 bg-red-500 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xs shadow-xl rotate-12 transition-transform hover:scale-110">
            404
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            Lost in the Numbers?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl max-w-xl mx-auto leading-relaxed font-medium">
            We couldn&apos;t find the calculator you were looking for. It might have been moved or updated to a newer version.
          </p>
        </div>

        {/* Quick Search Redirect */}
        <div className="w-full max-w-lg mx-auto relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:blur-2xl transition-all" />
          <Link 
            href="/calculator" 
            className="relative block w-full px-8 py-6 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 transition-all flex items-center justify-between group shadow-sm overflow-hidden"
          >
            <span>Search all 60+ tools...</span>
            <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
               <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Popular Tags */}
        <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center gap-3">
             <TrendingUp className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trending Categories</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Finance', 'Nepal Rules', 'Education', 'Health', 'Engineering'].map(cat => (
              <Link 
                key={cat} 
                href={`/calculator?cat=${cat.toLowerCase().replace(' ', '-')}`} 
                className="px-6 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Essential Navigation */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Home Base
          </Link>
        </div>

        <div className="pt-12 text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em]">
          &copy; 2026 CALCPRO.NP PRECISION SUITE
        </div>
      </div>
    </div>
  );
}
