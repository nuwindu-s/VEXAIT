import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { PricingPackage, ServicePricing } from '../data/pricingData';

interface PricingModalProps {
  service: ServicePricing | null;
  packageItem: PricingPackage | null;
  onClose: () => void;
  onRequestProposal: (serviceTitle: string, packageName: string, price: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  service,
  packageItem,
  onClose,
  onRequestProposal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!service || !packageItem) return null;

  const handleProposalClick = () => {
    const priceFormatted = `${packageItem.isStartingFrom ? 'Starting from ' : ''}${packageItem.price}${packageItem.billingPeriod || ''}`;
    onRequestProposal(service.serviceTitle, packageItem.name, priceFormatted);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-[#0A192F] to-[#0F284E] text-white border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/20 text-[#00D2FF] border border-blue-400/30">
              {service.serviceTitle}
            </span>
            {packageItem.popular && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            )}
          </div>

          <h3 id="pricing-modal-title" className="text-2xl font-extrabold tracking-tight text-white">
            {packageItem.name} Package
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            {packageItem.isStartingFrom && (
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Starting from
              </span>
            )}
            <span className="text-3xl font-extrabold text-[#00D2FF]">
              {packageItem.price}
            </span>
            {packageItem.billingPeriod && (
              <span className="text-sm font-medium text-slate-300">
                {packageItem.billingPeriod}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Suitable for Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Best Suited For
            </h4>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              {packageItem.suitableFor}
            </p>
          </div>

          {/* Features List */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Complete Feature Deliverables
            </h4>
            <ul className="space-y-2.5">
              {packageItem.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Specific Notes */}
          {service.importantNote && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> {service.importantNote}
              </span>
            </div>
          )}

          {/* Transparent Trust Note */}
          <div className="text-xs text-slate-500 bg-slate-100/70 p-3 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              All packages include clean code standards, milestone updates, and post-delivery handoff.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleProposalClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Request Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
