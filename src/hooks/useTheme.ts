/**
 * @fileoverview useTheme hook — CalcPro.NP
 *
 * Manages dark/light mode preference with localStorage persistence.
 * Reads saved theme on mount, applies class to document root.
 * Default: light mode (only dark if user explicitly chose it).
 *
 * @example
 * const { isDark, toggle } = useTheme();
 */
'use client';
import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(false); // DEFAULT: light

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    // Only dark if explicitly saved as 'dark'
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    const theme = newDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', newDark);
  };

  return { isDark, toggle };
}
