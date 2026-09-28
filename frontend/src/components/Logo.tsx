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
      {/* Precision Official VEXA IT Logo Mark */}
      <div className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-lg ${iconSizes[size]}`}>
        <img
          src="/vexa_logo.png"
          alt="VEXA IT Logo"
          className="w-full h-full object-contain"
        />
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
