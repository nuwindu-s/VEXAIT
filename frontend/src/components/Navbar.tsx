import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Phone, Mail, Sparkles } from 'lucide-react';
import { companyData } from '../data/company';

export type TabType = 'home' | 'about' | 'services' | 'projects' | 'process' | 'contact';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs: { id: TabType; name: string }[] = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'services', name: 'Services' },
    { id: 'projects', name: 'Projects' },
    { id: 'process', name: 'Process' },
    { id: 'contact', name: 'Contact' },
  ];

  const handleTabSelect = (tabId: TabType) => {
    setMobileMenuOpen(false);
    onTabChange(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tabId;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-slate-800/80 py-3'
          : 'bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleTabSelect('home')}
            className="flex items-center group transition-transform hover:opacity-95 focus:outline-none text-left cursor-pointer shrink-0"
            aria-label="VEXA IT Homepage"
          >
            <Logo variant="dark" size="md" showTagline />
          </button>

          {/* Desktop Navigation Dock */}
          <nav
            className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-inner"
            aria-label="Main Navigation"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  className={`relative px-4 py-2 text-xs lg:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-[#0066FF] shadow-md shadow-blue-500/25 font-bold scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.name}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#00D2FF] rounded-full shadow-[0_0_8px_#00D2FF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Header Actions */}
          <div className="hidden lg:flex items-center gap-4 text-xs shrink-0">
            <a
              href={`tel:${companyData.phone}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="font-semibold">{companyData.phone}</span>
            </a>
            <div className="h-4 w-[1px] bg-slate-700" />
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100 border-b border-slate-800 bg-[#0A192F]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.name}</span>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-500'}`} />
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center font-semibold text-white bg-gradient-to-r from-blue-600 to-[#0066FF] rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center px-2 pt-2 text-xs text-slate-400">
              <a href={`mailto:${companyData.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{companyData.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

