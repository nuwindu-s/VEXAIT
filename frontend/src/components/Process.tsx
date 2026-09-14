import React from 'react';
import { processSteps } from '../data/features';
import { Search, FileText, Palette, Code2, Rocket, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface ProcessProps {
  onStartProjectClick: () => void;
  isStandalone?: boolean;
}

export const Process: React.FC<ProcessProps> = ({ onStartProjectClick, isStandalone = false }) => {
  const getStepIcon = (name: string) => {
    switch (name) {
      case 'Search':
        return <Search className="w-5 h-5 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-blue-600" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-blue-600" />;
      default:
        return <Code2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const deliveryStandards = [
    { title: 'Bi-Weekly Demonstrations', desc: 'Working software demos every two weeks so you see live progress, give feedback, and stay fully in control.' },
    { title: 'Code Quality Audits', desc: 'Every pull request passes automated linting, test suites, and senior engineering review before staging deployment.' },
    { title: 'Zero Vendor Lock-In', desc: 'Clean documentation and containerized codebases ensuring your internal team can take over at any time.' },
  ];

  return (
    <section id="process" className={`${isStandalone ? 'pt-32 pb-24' : 'py-24'} bg-slate-900 text-white relative overflow-hidden`}>
      {/* Subtle Background Mesh & Highlights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-[#00D2FF] text-xs font-bold tracking-wider uppercase">
            <span>Structured Execution</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How We Work
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            A proven, milestone-driven framework designed to deliver transparent results on time and within scope.
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-600 via-[#00D2FF] to-blue-600 -translate-y-12 opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((item, index) => (
              <div
                key={item.number}
                className="relative flex flex-col justify-between p-6 rounded-2xl bg-[#0E1E38]/90 border border-slate-700/80 hover:border-blue-400 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group hover:-translate-y-1.5"
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-blue-500 font-mono">
                    {item.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <span className="text-[#00D2FF] group-hover:text-white transition-colors">
                      {getStepIcon(item.iconName)}
                    </span>
                  </div>
                </div>

                {/* Step Title */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00D2FF] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-300/90 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                {/* Arrow indicator between steps */}
                {index < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600 group-hover:text-[#00D2FF] transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Standalone Extra Content: Standards & SLA */}
        {isStandalone && (
          <div className="mt-20 pt-16 border-t border-slate-800">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="text-xs font-bold text-[#00D2FF] uppercase tracking-wider">
                OUR COMMITMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                How We Guarantee Engineering Quality
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deliveryStandards.map((std, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#0A192F] border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-[#00D2FF] flex items-center justify-center mb-3">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{std.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{std.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process CTA Sub-banner */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 mb-4">
            Ready to initiate Step 01 for your project?
          </p>
          <button
            type="button"
            onClick={onStartProjectClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Your Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
