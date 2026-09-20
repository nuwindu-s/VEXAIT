import React, { useState } from 'react';
import { servicesData } from '../data/services';
import { useSite } from '../context/SiteContext';
import { ServicePricing, PricingPackage } from '../data/pricingData';
import { PricingModal } from './PricingModal';
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
  Sparkles,
  Tag,
  ShieldCheck,
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
  const [expandedFeatures, setExpandedFeatures] = useState<string | null>(null);
  const [activePackageTab, setActivePackageTab] = useState<{ [serviceId: string]: string }>({});
  const [modalState, setModalState] = useState<{
    service: ServicePricing | null;
    packageItem: PricingPackage | null;
  }>({
    service: null,
    packageItem: null,
  });

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

  const toggleFeatures = (id: string) => {
    setExpandedFeatures(expandedFeatures === id ? null : id);
  };

  const handleOpenModal = (service: ServicePricing, pkg: PricingPackage) => {
    setModalState({ service, packageItem: pkg });
  };

  const handleCloseModal = () => {
    setModalState({ service: null, packageItem: null });
  };

  return (
    <section id="services" className={`${isStandalone ? 'pt-36 pb-24 md:pt-44' : 'py-24'} bg-slate-50 relative`}>
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-100/70 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Core Capabilities & Transparent Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Services & Pricing Packages
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to build, launch, and grow your digital presence with upfront, transparent rates.
          </p>
        </div>

        {/* Services Grid with Integrated Pricing */}
        <div className="space-y-12">
          {servicesData.map((service) => {
            const pricingInfo = getPricingForService(service.id);
            const isFeaturesOpen = expandedFeatures === service.id;
            const activePkgId =
              activePackageTab[service.id] ||
              (pricingInfo && pricingInfo.packages.length > 0 ? pricingInfo.packages[0].id : '');
            
            const selectedPackage = pricingInfo?.packages.find((p) => p.id === activePkgId) || pricingInfo?.packages[0];

            return (
              <div
                key={service.id}
                id={service.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Main Card Top Banner */}
                <div className="p-6 sm:p-8 lg:p-10 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                        {getServiceIcon(service.iconName, "w-7 h-7 text-blue-600")}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {service.title}
                          </h2>
                          {pricingInfo && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Starting from {pricingInfo.startingPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                          {service.description || service.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap lg:flex-col lg:items-end gap-1.5 shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:block">
                        Technologies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {service.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details & Pricing Packages Section */}
                <div className="p-6 sm:p-8 lg:p-10 bg-white">
                  {pricingInfo && pricingInfo.packages && pricingInfo.packages.length > 0 ? (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span>Select a Package for {service.title}</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Compare packages below or request a custom proposal tailored to your requirements
                          </p>
                        </div>

                        {/* Toggle Key Features Accordion Button */}
                        <button
                          type="button"
                          onClick={() => toggleFeatures(service.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer self-start sm:self-auto"
                        >
                          <span>{isFeaturesOpen ? 'Hide Core Capabilities' : 'View Core Capabilities'}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isFeaturesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expandable Core Capabilities Checklist */}
                      {isFeaturesOpen && (
                        <div className="mb-8 p-5 rounded-2xl bg-blue-50/50 border border-blue-100 animate-fadeIn">
                          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                            Standard Included Capabilities
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                            {service.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                                <span className="font-medium">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3 Pricing Packages Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {pricingInfo.packages.map((pkg) => {
                          const isPopular = pkg.popular;
                          const formattedPrice = `${pkg.isStartingFrom ? 'Starting from ' : ''}${pkg.price}${pkg.billingPeriod || ''}`;

                          return (
                            <div
                              key={pkg.id}
                              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 ${
                                isPopular
                                  ? 'bg-blue-50/30 border-2 border-blue-600 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10'
                                  : 'bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {/* Most Popular Badge */}
                              {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                    <Sparkles className="w-3 h-3" />
                                    Popular Choice
                                  </span>
                                </div>
                              )}

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-lg font-bold text-slate-900">
                                    {pkg.name}
                                  </h4>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    LKR
                                  </span>
                                </div>

                                {/* Price */}
                                <div className="mb-3">
                                  {pkg.isStartingFrom && (
                                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                                      Starting from
                                    </span>
                                  )}
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                      {pkg.price}
                                    </span>
                                    {pkg.billingPeriod && (
                                      <span className="text-xs font-semibold text-slate-500">
                                        {pkg.billingPeriod}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[32px]">
                                  {pkg.suitableFor}
                                </p>

                                {/* Features */}
                                <div className="border-t border-slate-200/80 pt-4 mb-5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                                    Key Deliverables
                                  </span>
                                  <ul className="space-y-2">
                                    {pkg.features.slice(0, 5).map((feat, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                        <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                        <span className="line-clamp-2">{feat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Card Actions */}
                              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenModal(pricingInfo, pkg)}
                                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>Full Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectService(service.title, pkg.name, formattedPrice)
                                  }
                                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isPopular
                                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25'
                                      : 'bg-[#0A192F] hover:bg-[#132A4D] text-white'
                                  }`}
                                >
                                  <span>Request {pkg.name}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Fallback when no tiered packages */
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Custom Scoped Solution</h4>
                        <p className="text-xs text-slate-500">Contact our engineering team to get a detailed milestone breakdown.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectService(service.title)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Request Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Tailored Project Callout */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0A192F] via-[#0F2242] to-[#0A192F] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left max-w-xl relative z-10">
            <span className="text-xs font-bold text-[#00D2FF] uppercase tracking-wider">
              Bespoke Software & Digital Solutions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Have specific architecture or project requirements?
            </h3>
            <p className="text-sm text-slate-300">
              We engineer custom software systems and tailored digital roadmaps built specifically for your business operations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectService('Custom Strategy Consultation')}
            className="shrink-0 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#0066FF] hover:brightness-110 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer relative z-10"
          >
            Start Your Custom Project
          </button>
        </div>

      </div>

      {/* Package Detail Modal */}
      <PricingModal
        service={modalState.service}
        packageItem={modalState.packageItem}
        onClose={handleCloseModal}
        onRequestProposal={(serviceTitle, packageName, price) => {
          onSelectService(serviceTitle, packageName, price);
        }}
      />
    </section>
  );
};

