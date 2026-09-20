import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Phone, Mail, Sparkles, Folder, CheckCircle } from 'lucide-react';
import { companyData } from '../data/company';

export type TabType = 'home' | 'about' | 'services' | 'projects' | 'process' | 'contact';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItemConfig {
  id: TabType;
  tabName: string;
  isDarkTab?: boolean;
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

  const navItems: NavItemConfig[] = [
    {
      id: 'home',
      tabName: 'Home',
    },
    {
      id: 'services',
      tabName: 'Services',
    },
    {
      id: 'about',
      tabName: 'Company',
    },
    {
      id: 'projects',
      tabName: 'Gallery',
      isDarkTab: true,
    },
    {
      id: 'process',
      tabName: 'Process',
    },
    {
      id: 'contact',
      tabName: 'Contact us',
      isDarkTab: true,
    },
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
          ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-slate-800/80 py-2.5'
          : 'bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10 py-3'
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
            <Logo variant="dark" size="sm" showTagline />
          </button>

          {/* Desktop Skeuomorphic Folder Navigation Tabs Bar */}
          <nav
            className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-inner backdrop-blur-md"
            aria-label="Folder Navigation"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelect(item.id)}
                  className={`relative group px-3.5 sm:px-4 lg:px-5 py-2 text-xs lg:text-[13px] font-bold tracking-wide transition-all duration-200 cursor-pointer rounded-xl border ${
                    isActive
                      ? 'bg-gradient-to-b from-[#0A192F] via-[#102344] to-[#0A192F] text-white border-blue-500/50 shadow-md shadow-blue-500/15 scale-[1.02]'
                      : 'bg-gradient-to-b from-[#ffffff] via-[#eef2f7] to-[#d8e2ee] text-slate-800 border-slate-300/90 hover:text-slate-950 hover:brightness-105 shadow-sm'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? 'inset 0 1px 1px rgba(0,210,255,0.4), 0 2px 8px rgba(0,0,0,0.3)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{item.tabName}</span>
                  </div>

                  {/* Active Tab Accent Top Light Line */}
                  {isActive && (
                    <div className="absolute top-0 inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Header Contact & CTA */}
          <div className="hidden lg:flex items-center gap-4 text-xs shrink-0">
            <a
              href={`tel:${companyData.phone}`}
              className="hidden xl:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="font-semibold">{companyData.phone}</span>
            </a>
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Get a Quote</span>
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
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{item.tabName}</span>
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

