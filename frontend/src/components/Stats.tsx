import React from 'react';
import { useSite } from '../context/SiteContext';
import { FolderCheck, Users, Briefcase, Clock, Award, Shield } from 'lucide-react';

export const Stats: React.FC = () => {
  const { settings } = useSite();

  const getIcon = (id: string) => {
    switch (id) {
      case 'projects':
        return <FolderCheck className="w-7 h-7 text-blue-600" />;
      case 'clients':
        return <Users className="w-7 h-7 text-blue-600" />;
      case 'services':
        return <Briefcase className="w-7 h-7 text-blue-600" />;
      case 'support':
        return <Clock className="w-7 h-7 text-blue-600" />;
      default:
        return <Award className="w-7 h-7 text-blue-600" />;
    }
  };

  return (
    <section id="trust" className="py-20 lg:py-24 bg-white border-b border-slate-200/80 relative">
      <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <span>WHY VEXA IT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Building Digital Solutions That Deliver Real Results.
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            We combine thoughtful design, reliable technology, and practical business solutions to create digital products that are built to perform.
          </p>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {(settings.stats || []).map((item) => (
            <div
              key={item.id}
              className="relative p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-600 to-[#00D2FF] rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between mb-4">
                <span className="p-3 rounded-xl bg-blue-50 border border-blue-100/60 group-hover:bg-blue-600/10 group-hover:border-blue-200 transition-colors">
                  {getIcon(item.id)}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Verified Metric
                </span>
              </div>

              {/* Number Value */}
              <div className="text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight group-hover:text-blue-600 transition-colors">
                {item.value}
              </div>

              {/* Label */}
              <h3 className="text-base font-bold text-slate-800 mt-2">
                {item.label}
              </h3>

              {/* Sublabel */}
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                {item.sublabel}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-14 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" /> Non-Disclosure Agreement (NDA) Protected
          </span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" /> Transparent Sprint Milestones
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> On-Time Delivery Guarantee
          </span>
        </div>

      </div>
    </section>
  );
};
