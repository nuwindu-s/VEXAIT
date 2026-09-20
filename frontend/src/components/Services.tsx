import React, { useState } from 'react';
import { servicesData, ServiceItem } from '../data/services';
import { useSite } from '../context/SiteContext';
import { ServicePricing, PricingPackage } from '../data/pricingData';
import {
  Globe,
  Code,
  Layout,
  ShoppingCart,
  Share2,
  Compass,
  ArrowRight,
  Check,
  Sparkles,
  Tag,
  ShieldCheck,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string, packageName?: string, price?: string) => void;
  isStandalone?: boolean;
}

export const Services: React.FC<ServicesProps> = ({
  onSelectService,
  isStandalone = false,
}) => {
  const { pricingList } = useSite();
  const [selectedService, setSelectedService] = useState<{
    service: ServiceItem;
    pricing?: ServicePricing;
  } | null>(null);

  const getServiceIcon = (name: string, className = "w-6 h-6 text-blue-600") => {
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
        return <Code className={className} />;
    }
  };

  const getPricingForService = (serviceId: string): ServicePricing | undefined => {
    return pricingList.find((p) => p.id === serviceId);
  };

  const handleCardClick = (service: ServiceItem) => {
    const pricing = getPricingForService(service.id);
    setSelectedService({ service, pricing });
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleSelectPackage = (serviceTitle: string, packageName: string, price: string) => {
    onSelectService(serviceTitle, packageName, price);
    handleCloseModal();
  };

  return (
    <section id="services" className={`${isStandalone ? 'pt-36 pb-24 md:pt-40' : 'py-24'} bg-slate-50 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Our Capabilities & Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore our core services below. Click any service card to view complete specifications, features, and package pricing.
          </p>
        </div>

        {/* Small Compact Service Cards Grid (Symmetrically Balanced) */}
        <div className="flex flex-wrap justify-center gap-6">
          {servicesData.map((service) => {
            const pricing = getPricingForService(service.id);

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service)}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div>
                  {/* Top Row: Icon & Starting Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <span className="group-hover:text-white transition-colors">
                        {getServiceIcon(service.iconName, "w-6 h-6")}
                      </span>
                    </div>

                    {pricing && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                        From {pricing.startingPrice}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {service.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {service.tags.length > 3 && (
                      <span className="text-[10px] font-medium text-slate-400 self-center">
                        +{service.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>View Details & Pricing</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Project Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0A192F] via-[#0F2242] to-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Need custom architecture or a specialized digital solution?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              We design tailor-made software systems and custom roadmaps built around your exact requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectService('Custom Strategy Consultation')}
            className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Start Custom Project
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL SERVICE INFORMATION & PRICING PACKAGES MODAL */}
      {/* ========================================================================= */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative px-6 sm:px-8 py-6 bg-gradient-to-r from-[#0A192F] to-[#0F2242] text-white border-b border-slate-800">
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#00D2FF]">
                  {getServiceIcon(selectedService.service.iconName, "w-6 h-6 text-[#00D2FF]")}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/20 text-[#00D2FF] border border-blue-400/30">
                      Service Details
                    </span>
                    {selectedService.pricing && (
                      <span className="text-xs font-semibold text-slate-300">
                        Starting from {selectedService.pricing.startingPrice}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedService.service.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              {/* Full Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Overview
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {selectedService.service.description || selectedService.service.shortDesc}
                </p>
              </div>

              {/* Core Features & Deliverables Checklist */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Core Included Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Used */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Technologies & Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.service.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Pricing Packages */}
              {selectedService.pricing && selectedService.pricing.packages && selectedService.pricing.packages.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="mb-5">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span>Available Packages & Rates</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select a package to request a customized proposal with your requirements
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {selectedService.pricing.packages.map((pkg) => {
                      const isPopular = pkg.popular;
                      const formattedPrice = `${pkg.isStartingFrom ? 'Starting from ' : ''}${pkg.price}${pkg.billingPeriod || ''}`;

                      return (
                        <div
                          key={pkg.id}
                          className={`relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all ${
                            isPopular
                              ? 'bg-blue-50/40 border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10'
                              : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                <Sparkles className="w-3 h-3" />
                                Popular
                              </span>
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="text-base font-bold text-slate-900">
                                {pkg.name}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                LKR
                              </span>
                            </div>

                            <div className="mb-2.5">
                              {pkg.isStartingFrom && (
                                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                                  Starting from
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                  {pkg.price}
                                </span>
                                {pkg.billingPeriod && (
                                  <span className="text-xs font-semibold text-slate-500">
                                    {pkg.billingPeriod}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[36px]">
                              {pkg.suitableFor}
                            </p>

                            <div className="border-t border-slate-200/80 pt-3 mb-4">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Inclusions
                              </span>
                              <ul className="space-y-1.5">
                                {pkg.features.map((feat, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                    <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </div>
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSelectPackage(
                                selectedService.service.title,
                                pkg.name,
                                formattedPrice
                              )
                            }
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isPopular
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                                : 'bg-[#0A192F] hover:bg-[#132A4D] text-white'
                            }`}
                          >
                            <span>Select {pkg.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectService(selectedService.service.title);
                  handleCloseModal();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <span>Request Custom Quote for {selectedService.service.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

