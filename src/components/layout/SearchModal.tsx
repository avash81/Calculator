'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, ArrowRight } from 'lucide-react';
import { CALCULATORS, Calculator as CalcType } from '@/data/calculators';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalcType[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = CALCULATORS.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q) ||
      c.keywords?.some(k => k.toLowerCase().includes(q))
    ).slice(0, 8);
    setResults(filtered);
    setActiveIndex(0);
  }, [query]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(results.length, 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + results.length) % Math.max(results.length, 1));
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        router.push(`/calculator/${results[activeIndex].slug}`);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, results, activeIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center p-4 border-b border-[var(--border)] bg-[var(--bg-page)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search calculators (EMI, BMI, Tax...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
          />
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-lg text-[var(--text-muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {query && results.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)]">
              <p className="font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-sm">Try searching for finance, math, or health tools.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => {
                    router.push(`/calculator/${c.slug}`);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                    i === activeIndex ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-xl border border-[var(--border)]">
                      {typeof c.icon === 'string' ? c.icon : <Calculator className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">{c.category}</div>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${i === activeIndex ? 'translate-x-1' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 px-2 space-y-4">
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2">Popular Tools</div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {CALCULATORS.filter(c => c.isHot).slice(0, 4).map(c => (
                   <button
                     key={c.id}
                     onClick={() => {
                       router.push(`/calculator/${c.slug}`);
                       onClose();
                     }}
                     className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-all text-left group"
                   >
                     <span className="text-lg">{c.icon}</span>
                     <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">{c.name}</span>
                   </button>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--bg-page)] border-t border-[var(--border)] flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
           <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded text-[var(--text-main)]">↵</kbd> select</div>
           <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded text-[var(--text-main)]">↑↓</kbd> navigate</div>
           <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded text-[var(--text-main)]">esc</kbd> close</div>
        </div>
      </div>
    </div>
  );
}
