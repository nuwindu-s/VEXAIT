import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Phone, Mail } from 'lucide-react';
import { companyData } from '../data/company';

export type TabType = 'home' | 'about' | 'services' | 'pricing' | 'projects' | 'process' | 'contact';

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
    { id: 'pricing', name: 'Pricing' },
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
          ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-lg shadow-black/25 border-b border-slate-800/80 py-3.5'
          : 'bg-[#0A192F]/90 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleTabSelect('home')}
            className="flex items-center group transition-transform hover:opacity-95 focus:outline-none text-left"
            aria-label="Vexa IT Homepage"
          >
            <Logo variant="dark" size="md" showTagline />
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#00D2FF] bg-blue-900/50 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <span>{tab.name}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00D2FF] rounded-full shadow-[0_0_8px_#00D2FF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 group cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className={`w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-blue-600 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.name}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
