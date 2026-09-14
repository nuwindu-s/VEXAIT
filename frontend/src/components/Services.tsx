import React, { useState } from 'react';
import { servicesData } from '../data/services';
import {
  Globe,
  Code,
  Layout,
  ShoppingCart,
  Share2,
  Compass,
  ArrowRight,
  Check,
  ChevronDown,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
  isStandalone?: boolean;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService, isStandalone = false }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-blue-600" />;
      case 'Code':
        return <Code className="w-6 h-6 text-blue-600" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-blue-600" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-6 h-6 text-blue-600" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-blue-600" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-blue-600" />;
      default:
        return <Code className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleInquire = (serviceTitle: string) => {
    onSelectService(serviceTitle);
  };

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section id="services" className={`${isStandalone ? 'pt-32 pb-24' : 'py-24'} bg-slate-50 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <span>Core Capabilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Everything you need to build, launch, and grow your digital presence.
          </p>
        </div>

        {/* 6 Services Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const isExpanded = expandedCard === service.id;

            return (
              <div
                key={service.id}
                className={`group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-7 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                <div>
                  {/* Icon & Category Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <span className="group-hover:text-white transition-colors">
                        {getServiceIcon(service.iconName)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                      Enterprise
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Deliverables / Feature List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleExpand(service.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Key Features' : 'View Key Features'}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <ul className="pt-2 space-y-2 text-xs text-slate-600 animate-fadeIn">
                        {service.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleInquire(service.title)}
                    className="w-full inline-flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-600 py-2 transition-colors group/btn cursor-pointer"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Tailored Project Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Need a specialized digital strategy or custom technology stack?</h3>
            <p className="text-sm text-slate-300">
              We design bespoke solutions to fit your exact operational and growth requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleInquire('Custom Strategy Consultation')}
            className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Schedule a Strategy Consultation
          </button>
        </div>

      </div>
    </section>
  );
};
