import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 sm:px-8 py-5 bg-gradient-to-r from-[#0A192F] via-[#0D2040] to-[#0A192F] text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#00D2FF]">
              {isPrivacy ? (
                <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
              ) : (
                <FileText className="w-4 h-4 text-[#00D2FF]" />
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Last Updated: September 2026
          </p>

          {isPrivacy ? (
            <>
              <p>
                At VEXA IT ("we", "our", or "us"), we prioritize the security and confidentiality of our clients' and prospective clients' data. This Privacy Policy outlines our commitment to responsible data handling practices across our software development and IT consulting engagements.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">1. Data Collection & Project Inquiries</h4>
              <p>
                When submitting an inquiry through our contact portal, we collect basic contact information (such as your name, business email, phone number, and company name) strictly for the purpose of communicating project scope and technical assessments.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">2. Non-Disclosure & Intellectual Property</h4>
              <p>
                All proprietary concepts, architecture requirements, and codebase discussions are protected under standard corporate Non-Disclosure provisions. We do not sell, license, or share your data with third-party advertisers.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">3. Security Standards</h4>
              <p>
                We implement industry-standard encryption protocols (TLS/SSL) for all digital interactions and secure client storage repositories.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to VEXA IT. By accessing our website and engaging our technology engineering services, you agree to comply with and be bound by the following terms and conditions.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">1. Professional IT Engagements</h4>
              <p>
                All customized software engineering, web application development, and consulting projects are executed in accordance with formally defined Statements of Work (SOW) detailing milestone timelines, deliverables, and service levels.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">2. Client Ownership</h4>
              <p>
                Upon project completion and settlement of contractual terms, our clients retain full intellectual property ownership of bespoke source code and assets created for their systems.
              </p>
              <h4 className="font-bold text-slate-900 pt-2 text-sm sm:text-base">3. Limitation of Liability</h4>
              <p>
                VEXA IT strives for continuous operational excellence and adheres to strict quality assurance methodologies prior to production deployments.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
