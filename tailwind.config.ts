import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cp-blue':       '#1B4FBD',
        'cp-blue-light': '#EFF4FF',
        'cp-blue-dark':  '#1440A0',
        'cp-nepal':      '#E31837',
        'cp-nepal-light':'#FEF2F2',
        'cp-green':      '#16a34a',
        'cp-amber':      '#F59E0B',
        'cp-bg':         '#F8FAFB',
        'cp-text':       '#111827',
        'cp-muted':      '#6B7280',
        'cp-light':      '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
