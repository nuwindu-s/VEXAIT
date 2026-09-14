import React from 'react';
import { ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface CTAProps {
  onStartProjectClick: () => void;
  onContactClick: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartProjectClick, onContactClick }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#071326] text-white relative overflow-hidden">
      {/* Dynamic Background Mesh & Electric Accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/40 text-[#00D2FF] text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Your Digital Presence</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Have a Project in Mind?
        </h2>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Let's turn your idea into a powerful digital solution.
        </p>

        {/* Dual Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartProjectClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 rounded-xl shadow-xl shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-[#00D2FF]" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Reassurance text */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" /> Free Technical Scoping Call
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" /> Guaranteed 24-Hour Response
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00D2FF]" /> Transparent Fixed Estimates
          </span>
        </div>

      </div>
    </section>
  );
};
