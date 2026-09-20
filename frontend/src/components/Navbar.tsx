import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Phone, Mail, Sparkles, Folder, CheckCircle } from 'lucide-react';
import { companyData } from '../data/company';

export type TabType = 'home' | 'about' | 'services' | 'pricing' | 'projects' | 'process' | 'contact';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItemConfig {
  id: TabType;
  tabName: string;
  subTitle: string;
  subDesc: string;
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
      subTitle: 'Home page',
      subDesc: 'Main portal',
    },
    {
      id: 'services',
      tabName: 'Services',
      subTitle: 'Solutions',
      subDesc: 'What we do for you',
    },
    {
      id: 'about',
      tabName: 'Company',
      subTitle: 'About us',
      subDesc: 'Our team & story',
    },
    {
      id: 'projects',
      tabName: 'Gallery',
      subTitle: 'Showcase',
      subDesc: 'Client portfolio',
      isDarkTab: true,
    },
    {
      id: 'pricing',
      tabName: 'Pricing',
      subTitle: 'Packages',
      subDesc: 'Affordable rates',
    },
    {
      id: 'process',
      tabName: 'Process',
      subTitle: 'Workflow',
      subDesc: 'How we build',
    },
    {
      id: 'contact',
      tabName: 'Contact us',
      subTitle: 'Get in Touch',
      subDesc: 'Start a project',
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
          ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-slate-800/80 pt-2.5 pb-2'
          : 'bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10 pt-3 pb-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Header Row: Logo & Quick Actions */}
        <div className="flex items-center justify-between pb-2.5">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleTabSelect('home')}
            className="flex items-center group transition-transform hover:opacity-95 focus:outline-none text-left cursor-pointer"
            aria-label="VEXA IT Homepage"
          >
            <Logo variant="dark" size="sm" showTagline />
          </button>

          {/* Quick Header Contact Callout & CTA */}
          <div className="hidden lg:flex items-center gap-5 text-xs">
            <a
              href={`tel:${companyData.phone}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="font-semibold">{companyData.phone}</span>
            </a>
            <div className="h-4 w-[1px] bg-slate-700" />
            <a
              href={`mailto:${companyData.email}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{companyData.email}</span>
            </a>
            <button
              type="button"
              onClick={() => handleTabSelect('contact')}
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP SKEUOMORPHIC FOLDER TABS & GLOSSY SUB-BAR (Matching Reference UI) */}
        {/* ========================================================================= */}
        <div className="hidden md:block select-none mt-1">
          {/* Top Folder Tab Row */}
          <nav className="flex items-end gap-1.5 px-2 relative z-10 -mb-[1px]" aria-label="Folder Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isDark = isActive || item.isDarkTab;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelect(item.id)}
                  className={`relative group px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-150 cursor-pointer rounded-t-xl sm:rounded-t-2xl border-t border-l border-r ${
                    isActive
                      ? 'bg-gradient-to-b from-[#0A192F] via-[#0F2242] to-[#0A192F] text-white border-slate-600 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] z-20 scale-[1.02] transform -translate-y-0.5'
                      : isDark
                      ? 'bg-gradient-to-b from-[#162744] via-[#102038] to-[#0c182a] text-slate-200 border-slate-700/80 hover:text-white hover:brightness-110 shadow-sm'
                      : 'bg-gradient-to-b from-[#ffffff] via-[#e8eef6] to-[#d6e0ec] text-slate-700 border-slate-300 hover:text-slate-900 hover:brightness-105 shadow-sm'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? 'inset 0 1px 1px rgba(255,255,255,0.25), 0 -3px 8px rgba(0,0,0,0.3)'
                      : isDark
                      ? 'inset 0 1px 0 rgba(255,255,255,0.15)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.9)',
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

          {/* Glossy White Sub-Bar / Shelf Container */}
          <div className="relative rounded-xl bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e8edf5] border border-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">
            {/* Glossy Reflection Highlight Streak */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-white via-white to-white opacity-90 pointer-events-none" />
            <div className="absolute top-[2px] inset-x-0 h-4 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

            {/* Sub-navigation Items Grid */}
            <div className="grid grid-cols-7 divide-x divide-slate-200/90 py-2.5 px-1 relative z-10">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabSelect(item.id)}
                    className={`flex flex-col items-center justify-center text-center px-2 py-1 transition-all duration-150 cursor-pointer group ${
                      isActive
                        ? 'bg-blue-50/70 rounded-lg'
                        : 'hover:bg-slate-100/70 rounded-lg'
                    }`}
                  >
                    {/* Top Dot / Pin Indicator */}
                    <div className="mb-1 flex items-center justify-center">
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          isActive
                            ? 'bg-[#0066FF] ring-2 ring-blue-300 shadow-sm scale-110'
                            : 'bg-slate-500/80 group-hover:bg-slate-800'
                        }`}
                      />
                    </div>

                    {/* Main Sub-Label */}
                    <span
                      className={`text-xs font-bold leading-tight transition-colors ${
                        isActive
                          ? 'text-[#0066FF]'
                          : 'text-slate-800 group-hover:text-slate-950'
                      }`}
                    >
                      {item.subTitle}
                    </span>

                    {/* Subtext Description (lorem/subtitle in original) */}
                    <span className="text-[10px] text-slate-400 font-medium leading-tight truncate max-w-full group-hover:text-slate-500">
                      {item.subDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-[550px] opacity-100 border-b border-slate-800 bg-[#0A192F]' : 'max-h-0 opacity-0'
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
                <div className="flex flex-col text-left">
                  <span>{item.tabName}</span>
                  <span className={`text-[11px] font-normal ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.subDesc}
                  </span>
                </div>
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

