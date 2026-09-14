import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const isDarkBg = variant === 'dark';

  const sizeClasses = {
    sm: 'h-8 text-lg',
    md: 'h-10 text-xl',
    lg: 'h-12 text-2xl',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric V Logo Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background subtle hexagon/shield glow */}
          <circle cx="60" cy="60" r="50" fill={isDarkBg ? "#0066FF" : "#00D2FF"} opacity={isDarkBg ? "0.15" : "0.1"} />
          
          {/* Outer Geometric Frame */}
          <path
            d="M24 28 L44 28 L60 76 L76 28 L96 28 L68 98 L52 98 Z"
            fill={isDarkBg ? "#FFFFFF" : "#0A192F"}
          />
          
          {/* Electric Blue Inner Accent Dynamic Strokes */}
          <path
            d="M38 32 L50 32 L60 62 L70 32 L82 32 L64 82 L56 82 Z"
            fill="#0066FF"
          />
          
          {/* Cyan High-Tech Intersection Bar */}
          <path
            d="M48 48 L72 48 L68 58 L52 58 Z"
            fill="#00D2FF"
          />
          
          {/* Angular Tech Notch Lines */}
          <path
            d="M74 24 L94 24 L80 62"
            stroke="#00D2FF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark Typography */}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-black tracking-wider uppercase font-sans ${sizeClasses[size].split(' ')[1]} ${
            isDarkBg ? 'text-white' : 'text-[#0A192F]'
          }`}
          style={{ letterSpacing: '0.08em' }}
        >
          VEXA <span className="text-[#0066FF] font-extrabold">IT</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] tracking-widest font-semibold uppercase ${
              isDarkBg ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Innovate. Build. Grow.
          </span>
        )}
      </div>
    </div>
  );
};
