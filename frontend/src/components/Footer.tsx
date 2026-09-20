import React, { useState } from 'react';
import { Logo } from './Logo';
import { useSite } from '../context/SiteContext';
import { LegalModal } from './LegalModal';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { TabType } from './Navbar';

interface FooterProps {
  onTabChange: (tab: TabType) => void;
  onSelectService: (serviceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onSelectService }) => {
  const { settings } = useSite();
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTab = (tab: TabType) => {
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tab;
  };

  const handleServiceClick = (serviceTitle: string) => {
    onSelectService(serviceTitle);
    onTabChange('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = 'contact';
  };

  return (
    <footer className="bg-[#060D1A] text-slate-400 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <button
              type="button"
              onClick={() => handleNavTab('home')}
              className="inline-block text-left cursor-pointer"
            >
              <Logo variant="dark" size="lg" showTagline />
            </button>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings.description ||
                'Vexa IT builds modern websites, software, digital solutions, and social media growth strategies designed to help businesses grow with speed, scalability, and clean engineering.'}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Facebook */}
              <a
                href={settings.socials?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 text-xs font-semibold transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4 fill-current text-blue-400 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow on Facebook</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (Tabs) (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('projects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('process')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Process
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('Web Development')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Web Development
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('Software Development')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Software Development
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('Social Media Management')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Social Media Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('UI/UX Design')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  UI/UX Design
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleServiceClick('E-Commerce Development')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  E-Commerce
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Reach Out (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  WhatsApp: {settings.phone || '071 269 6668'}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Vexa IT. All Rights Reserved.</p>

          <div className="flex items-center space-x-6">
            <button
              type="button"
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModalType('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Legal Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </footer>
  );
};
