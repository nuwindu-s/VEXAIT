import React from 'react';
import { whyChooseUsData } from '../data/features';
import { Layers, Sliders, Smartphone, TrendingUp, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Layers':
        return <Layers className="w-6 h-6 text-blue-600" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-blue-600" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="why-choose-us" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <span>The Vexa Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Businesses Choose Vexa IT
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            We operate with engineering discipline, client transparency, and a relentless focus on delivering software that fuels real business growth.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUsData.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <span className="group-hover:text-white transition-colors">
                    {getIcon(item.iconName)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  <Check className="w-3 h-3" />
                  {item.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
