import React from 'react';
import { aboutPillars } from '../data/features';
import {
  Target,
  Cpu,
  TrendingUp,
  Headphones,
  MessagesSquare,
  CheckCircle2,
  CheckCircle,
  Layers,
  ArrowRight,
  Shield,
  Award,
  Users,
} from 'lucide-react';

interface AboutProps {
  isStandalone?: boolean;
  onStartProjectClick?: () => void;
}

export const About: React.FC<AboutProps> = ({ isStandalone = false, onStartProjectClick }) => {
  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Target':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-blue-600" />;
      case 'MessagesSquare':
        return <MessagesSquare className="w-5 h-5 text-blue-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const clientCategories = [
    { title: 'Startups & Founders', desc: 'Rapid prototyping, MVP development, and architecture built to scale with funding.' },
    { title: 'Small Businesses', desc: 'Modern web presence, customer portals, and automation tools to increase operational margins.' },
    { title: 'Medium-Sized Enterprises', desc: 'Custom internal software, secure database systems, and robust API integrations.' },
    { title: 'Organizations & Non-Profits', desc: 'Accessible digital systems, member portals, and compliant data management.' },
  ];

  return (
    <section id="about" className={`${isStandalone ? 'pt-32 pb-24' : 'py-24'} bg-white relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline, Narrative & Abstract Visual */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
              <span>ABOUT VEXA IT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Technology Built Around Your Business.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              At Vexa IT, we believe that software succeeds only when it directly advances your business goals. Before we write a single line of code, our team works closely with you to understand your market dynamics, operational workflows, and long-term vision.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We eliminate technical jargon in favor of strategic clarity. Whether you are an ambitious startup launching your flagship digital product or an established company seeking to automate complex legacy processes, Vexa IT delivers clean, dependable, and high-performance solutions engineered for the long haul.
            </p>

            {/* Visual Engineering Diagram Card */}
            <div className="pt-4">
              <div className="rounded-2xl bg-[#0A192F] p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#00D2FF]" />
                    <span className="text-sm font-semibold text-white">Vexa Engineering Methodology</span>
                  </div>
                  <span className="text-xs text-blue-400 font-mono">Precision SLA</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#102344] p-3 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400">Phase 1</div>
                    <div className="text-sm font-bold text-white mt-0.5">Strategy</div>
                  </div>
                  <div className="bg-[#102344] p-3 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400">Phase 2</div>
                    <div className="text-sm font-bold text-[#00D2FF] mt-0.5">Execution</div>
                  </div>
                  <div className="bg-[#102344] p-3 rounded-xl border border-slate-700/60">
                    <div className="text-xs text-slate-400">Phase 3</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">Scale</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Foundational Pillars Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    {getPillarIcon(pillar.iconName)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Standalone Extra Content: Target Customers & Commitment */}
        {isStandalone && (
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                WHO WE SERVE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tailored Technology For Every Growth Stage
              </h2>
              <p className="text-sm text-slate-600">
                We partner with businesses and organizations across various sectors to engineer solutions matching their operational scale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {clientCategories.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all">
                  <h3 className="text-base font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>

            {onStartProjectClick && (
              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={onStartProjectClick}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <span>Discuss Your Project With Our Engineers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
