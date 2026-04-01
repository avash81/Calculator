'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, Search } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Captured:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-white dark:bg-gray-950">
      <div className="max-w-2xl w-full text-center space-y-10">
        
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-[3rem] flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5 transition-transform hover:scale-105 duration-500">
            <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center animate-bounce">
             <span className="text-xl">🛠️</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            Calculation Interrupted
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto leading-relaxed font-medium">
            An unexpected error occurred while processing your data. We have logged this for our engineering team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/calculator"
            className="w-full sm:w-auto px-8 py-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-1 active:scale-95 shadow-sm"
          >
            <Search className="w-4 h-4" />
            Browse Other Tools
          </Link>
        </div>

        <div className="pt-10 border-t border-gray-50 dark:border-gray-900 flex flex-col sm:flex-row items-center justify-center gap-8">
           <Link href="/" className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
              Return Home
           </Link>
           <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full hidden sm:block" />
           <div className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest">
              Error ID: {error.digest || 'CALC_RUNTIME_01'}
           </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
           <div className="mt-10 p-6 bg-red-50 dark:bg-red-900/5 rounded-3xl border border-red-100 dark:border-red-900/20 text-left overflow-auto max-h-40">
              <pre className="text-[10px] font-mono text-red-800 dark:text-red-400 whitespace-pre-wrap">
                {error.stack || error.message}
              </pre>
           </div>
        )}
      </div>
    </div>
  );
}
