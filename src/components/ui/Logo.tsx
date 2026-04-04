import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', dark = false, className = '' }) => {
  const sizes = {
    sm: { glyph: 20, font: 'text-lg', icon: 10 },
    md: { glyph: 28, font: 'text-xl', icon: 14 },
    lg: { glyph: 36, font: 'text-2xl', icon: 18 },
  };

  const { glyph, font, icon } = sizes[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* SVG Glyph */}
      <svg 
        width={glyph} 
        height={glyph} 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="28" height="28" rx="6" fill="var(--primary)" />
        <path 
          d="M8 11H20M8 17H20" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Text */}
      <span className={`${font} tracking-tight flex items-baseline`}>
        <span className={`font-bold ${dark ? 'text-white' : 'text-[var(--primary)]'}`}>
          Calc
        </span>
        <span className={`font-light ${dark ? 'text-white/70' : 'text-[var(--text-main)]'}`}>
          ly
        </span>
      </span>
    </div>
  );
};
