import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'google-blue': '#1A73E8',
        'google-blue-dark': '#1557B0',
        'google-blue-light': '#E8F0FE',
        'google-gray': '#F8F9FA',
        'google-border': '#E8EAED',
        'nepal-red': '#DC143C',
      },
      gridTemplateColumns: {
        '7': 'repeat(7, minmax(0, 1fr))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
