import React from 'react';
import { Logo } from './Logo';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onBackToHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg space-y-6">
        <div className="flex justify-center mb-4">
          <Logo variant="dark" size="lg" showTagline />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-[#00D2FF] text-xs font-mono uppercase">
          Error 404 — Page Not Found
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
          System Notice: Missing Endpoint
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The page or system resource you requested does not exist or has been relocated within our architecture.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
