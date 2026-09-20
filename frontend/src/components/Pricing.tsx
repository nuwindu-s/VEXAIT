import React, { useState } from 'react';
import { ServicePricing, PricingPackage } from '../data/pricingData';
import { useSite } from '../context/SiteContext';
import { PricingModal } from './PricingModal';
import {
  Globe,
  Code,
  Layout,
  ShoppingCart,
  Share2,
  Compass,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Layers,
  MessageSquare,
} from 'lucide-react';

interface PricingProps {
  onSelectPackage: (serviceTitle: string, packageName?: string, price?: string) => void;
  isStandalone?: boolean;
  selectedServiceId?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPackage,
  isStandalone = false,
  selectedServiceId,
}) => {
  const { pricingList } = useSite();
  const [activeServiceId, setActiveServiceId] = useState<string>(
    selectedServiceId || 'web-development'
  );
  const [modalState, setModalState] = useState<{
    service: ServicePricing | null;
    packageItem: PricingPackage | null;
  }>({
    service: null,
    packageItem: null,
  });

  const getServiceIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case 'Globe':
        return <Globe className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'Layout':
        return <Layout className={className} />;
      case 'ShoppingCart':
        return <ShoppingCart className={className} />;
      case 'Share2':
        return <Share2 className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const currentService =
    pricingList.find((s) => s.id === activeServiceId) || pricingList[0];

  const handleOpenModal = (service: ServicePricing, pkg: PricingPackage) => {
    setModalState({ service, packageItem: pkg });
  };

  const handleCloseModal = () => {
    setModalState({ service: null, packageItem: null });
  };

  return (
    <section id="pricing" className={`${isStandalone ? 'pt-32 pb-24' : 'py-24'} bg-slate-50 relative`}>
      {/* Background Decorative Accent */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-100/80 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Affordable & Transparent Packages</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Choose a package that fits your business. Need something different? We can build a solution around your requirements.
          </p>

          <p className="text-xs text-slate-400 font-medium">
            Affordable technology solutions tailored for Sri Lankan startups, SMEs, and growing enterprises.
          </p>
        </div>

        {/* Service Selector Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-full overflow-x-auto">
            {pricingList.map((service) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveServiceId(service.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0A192F] text-white shadow-md shadow-slate-900/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#00D2FF]' : 'text-blue-600'}>
                    {getServiceIcon(service.iconName, "w-4 h-4")}
                  </span>
                  <span>{service.serviceTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Service Summary Banner */}
        <div className="max-w-3xl mx-auto text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              {currentService.serviceTitle}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Starting from {currentService.startingPrice}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {currentService.serviceSubtitle}
          </p>

          {/* Important Service Note banner */}
          {currentService.importantNote && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium mt-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{currentService.importantNote}</span>
            </div>
          )}
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {currentService.packages.map((pkg) => {
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-2xl transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10 md:-translate-y-2'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300'
                } p-7 sm:p-8`}
              >
                {/* Most Popular Highlight Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-[#00D2FF] text-white shadow-md shadow-blue-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Package Name & Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900">
                      {pkg.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                      LKR
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="mb-4">
                    {pkg.isStartingFrom && (
                      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Starting from
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {pkg.price}
                      </span>
                      {pkg.billingPeriod && (
                        <span className="text-sm font-semibold text-slate-500">
                          {pkg.billingPeriod}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description / Suitable For */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 min-h-[36px]">
                    {pkg.suitableFor}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-slate-100 pt-5 mb-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                      What's Included
                    </span>
                    <ul className="space-y-3">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(currentService, pkg)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Package Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const priceFormatted = `${pkg.isStartingFrom ? 'Starting from ' : ''}${pkg.price}${pkg.billingPeriod || ''}`;
                      onSelectPackage(currentService.serviceTitle, pkg.name, priceFormatted);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                        : 'bg-[#0A192F] hover:bg-[#132A4D] text-white'
                    }`}
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Services Quick Switch Grid on bottom */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-16">
          <div className="text-center mb-5">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Explore Pricing Across All Services
            </h4>
            <p className="text-xs text-slate-500">
              Click any service below to view its complete package options
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {pricingData.map((s) => {
              const isCurrent = s.id === activeServiceId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveServiceId(s.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={isCurrent ? 'text-blue-600' : 'text-slate-600'}>
                      {getServiceIcon(s.iconName, "w-4 h-4")}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mb-0.5">
                      {s.serviceTitle}
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      From {s.startingPrice}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action Callout */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#0A192F] via-[#0D2240] to-[#0A192F] text-white border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D2FF]">
                Custom Requirements?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Not sure which package you need?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tell us what you're trying to build and we'll recommend a solution based on your requirements and budget.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onSelectPackage(currentService.serviceTitle)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
              >
                Request a Proposal
              </button>
              <button
                type="button"
                onClick={() => onSelectPackage('General Inquiry')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/10 transition-colors cursor-pointer text-center"
              >
                Contact Vexa IT
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Package Detail Modal */}
      <PricingModal
        service={modalState.service}
        packageItem={modalState.packageItem}
        onClose={handleCloseModal}
        onRequestProposal={(serviceTitle, packageName, price) => {
          onSelectPackage(serviceTitle, packageName, price);
        }}
      />
    </section>
  );
};
