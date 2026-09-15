import React, { useState, useEffect } from 'react';
import { companyData } from '../data/company';
import { servicesData } from '../data/services';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

interface ContactProps {
  initialService?: string;
  initialPackage?: string;
  initialPrice?: string;
  isStandalone?: boolean;
}

export const Contact: React.FC<ContactProps> = ({
  initialService,
  initialPackage,
  initialPrice,
  isStandalone = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: initialService || 'Web Development',
    details: initialPackage
      ? `I would like to request a proposal for the ${initialService} — ${initialPackage} package (${initialPrice || ''}).`
      : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({
        ...prev,
        service: initialService,
        details: initialPackage
          ? `I would like to request a proposal for the ${initialService} — ${initialPackage} package (${initialPrice || ''}).`
          : prev.details,
      }));
    }
  }, [initialService, initialPackage, initialPrice]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Please briefly describe your project or inquiry.';
    } else if (formData.details.trim().length < 15) {
      newErrors.details = 'Please provide at least 15 characters describing your requirements.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Submit to VEXA IT MongoDB Backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not specified',
          company: formData.company || 'Not specified',
          service: formData.service,
          details: formData.details,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.success) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'Web Development',
          details: '',
        });
      } else {
        // If the backend returned a specific error message, display it
        throw new Error(data?.error || data?.message || 'Failed to submit inquiry to server.');
      }
    } catch (err: unknown) {
      console.warn('Backend submission attempted:', err);

      // Optional fallback to formsubmit email forwarding if offline or during static test
      try {
        const fallbackRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(companyData.email)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            Name: formData.name,
            Email: formData.email,
            Phone: formData.phone || 'Not specified',
            Company: formData.company || 'Not specified',
            'Primary Service': formData.service,
            'Project Details & Goals': formData.details,
            _subject: `New Project Inquiry from ${formData.name} - VEXA IT`,
            _template: 'table',
            _captcha: 'false',
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && (fallbackData.success === 'true' || fallbackData.success === true || fallbackData.message)) {
          setIsSuccess(true);
          setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            service: 'Web Development',
            details: '',
          });
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }

      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong while sending your inquiry. Please try again or reach out directly to vexa.it2026@gmail.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(companyData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const faqs = [
    {
      q: "How soon will I receive a response after submitting?",
      a: "Our senior engineering team reviews every inquiry and responds within 24 business hours with initial questions or a calendar invitation for a technical discovery call."
    },
    {
      q: "Do you sign Non-Disclosure Agreements (NDAs)?",
      a: "Yes. We execute mutual NDAs before discussing any proprietary architectures, business workflows, or sensitive systems."
    },
    {
      q: "Who owns the source code upon project completion?",
      a: "You do. Full intellectual property, git repositories, and design assets are transferred to your organization upon milestone completion."
    },
    {
      q: "Do you offer post-launch maintenance and support?",
      a: "Absolutely. We provide flexible SLA support agreements covering security patches, monitoring, uptime optimization, and feature enhancements."
    }
  ];

  return (
    <section id="contact" className={`${isStandalone ? 'pt-32 pb-24' : 'py-24'} bg-white relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <span>GET IN TOUCH</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Let's Build Something Great.
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Have a project in mind or need expert technical advisory? Tell us about your goals and our team will get back to you within 24 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Contact Information & Direct Channels (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl bg-[#0A192F] p-8 text-white shadow-xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                <span className="text-xs font-bold text-[#00D2FF] tracking-wider uppercase">
                  Contact Information
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Connect Directly
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Reach out through your preferred communication channel or schedule an introductory discovery session.
                </p>
              </div>

              {/* Info Items */}
              <div className="space-y-6 text-sm">
                
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-600/20 text-[#00D2FF] shrink-0 border border-blue-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Email Us</p>
                    <a
                      href={`mailto:${companyData.email}`}
                      className="text-white font-medium hover:text-[#00D2FF] transition-colors"
                    >
                      {companyData.email}
                    </a>
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied to clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy email address</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-600/20 text-[#00D2FF] shrink-0 border border-blue-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
                    <p className="text-white font-medium">
                      {companyData.location}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-600/20 text-[#00D2FF] shrink-0 border border-blue-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Business Hours</p>
                    <p className="text-white font-medium">
                      {companyData.businessHours}
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Quick Chat */}
              <div className="pt-4 border-t border-slate-800">
                <a
                  href={companyData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat With Us on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>

          {/* Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl relative">
              
              {isSuccess ? (
                <div className="py-12 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for contacting VEXA IT. A senior technology consultant will review your project requirements and get in touch within 24 hours.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                          errors.name
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                          errors.email
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+94 7X XXX XXXX (Optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm focus:outline-none transition-all"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                        Company / Organization
                      </label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Acme Enterprises"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm focus:outline-none transition-all"
                      />
                    </div>

                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                      Primary Service Needed <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm focus:outline-none bg-white transition-all cursor-pointer"
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Custom Architecture Scoping">Custom Architecture Scoping</option>
                      <option value="General Technical Advisory">General Technical Advisory</option>
                    </select>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label htmlFor="details" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                      Project Details & Goals <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="details"
                      rows={4}
                      placeholder="Please tell us about your project objectives, timeline, key features, or problems you're looking to solve..."
                      value={formData.details}
                      onChange={(e) => {
                        setFormData({ ...formData, details: e.target.value });
                        if (errors.details) setErrors({ ...errors, details: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                        errors.details
                          ? 'border-red-500 ring-1 ring-red-500'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                      }`}
                    />
                    {errors.details && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.details}
                      </p>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Processing Inquiry...</span>
                      ) : (
                        <>
                          <span>Send Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-500 mt-3">
                      🔒 Your information is confidential and protected by NDA standards. No spam.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* Standalone Extra Content: FAQ Section */}
        {isStandalone && (
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Common Questions About Working With VEXA IT
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
