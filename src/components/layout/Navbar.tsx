'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Sun, Moon, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const path = usePathname();

  // Dark Mode Toggle
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => setIsMenuOpen(false), [path]);

  const navLinks = [
    { name: 'Directory', href: '/calculator' },
    { name: 'Financial', href: '/calculator/category/finance' },
    { name: 'Health', href: '/calculator/category/health' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-11 bg-[var(--primary)] text-white z-[200] select-none shadow-sm">
        <div className="hp-container h-full flex items-center justify-between">
          
          {/* Left: Logo + Desktop Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
               <span className="text-lg font-black tracking-tight">Calcly</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1 h-11">
              {navLinks.map((link) => {
                const active = path === link.href || (link.href !== '/' && path.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 h-11 flex items-center text-[12px] font-bold transition-all relative ${
                      active ? 'text-white bg-white/10' : 'text-blue-100/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Simple Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
              <span className="hidden sm:inline text-[11px] font-bold text-white/70 group-hover:text-white">Search tools...</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-1.5 hover:bg-white/10 rounded text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--bg-surface)] z-[301] shadow-2xl transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full uppercase tracking-widest font-black text-[10px]">
          <div className="p-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-page)]">
            <Logo size="sm" />
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-[var(--bg-subtle)] rounded-lg text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {[
              { name: 'Directory', href: '/calculator', icon: '📁' },
              { name: 'Financial', href: '/calculator/category/finance', icon: '💰' },
              { name: 'Health', href: '/calculator/category/health', icon: '❤️' },
              { name: 'Math', href: '/calculator/category/math', icon: '📐' },
              { name: 'Nepal 🇳🇵', href: '/calculator/category/nepal', icon: '🚩' },
              { name: 'Blog', href: '/blog', icon: '📖' },
              { name: 'About', href: '/about', icon: 'ℹ️' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--primary-light)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg opacity-80 group-hover:opacity-100">{link.icon}</span>
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-[var(--border)] text-center text-[var(--text-muted)] bg-[var(--bg-page)]">
            © 2026 Calcly — Built for Precision
          </div>
        </div>
      </aside>
    </>
  );
}
