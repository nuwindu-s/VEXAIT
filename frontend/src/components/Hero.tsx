import React from 'react';
import { ArrowRight, Code2, Layers, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface HeroProps {
  onStartProjectClick: () => void;
  onExploreServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartProjectClick,
  onExploreServicesClick,
}) => {
  const { settings } = useSite();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A192F] text-white flex items-center overflow-hidden"
    >
      {/* Background Ambience & Geometric Tech Mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      {/* Radial Gradient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Eyebrow Tag / Dynamic Announcement */}
            {settings.announcementBanner?.enabled && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
                <span>{settings.announcementBanner.text || 'Full-Cycle IT & Software Engineering'}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {settings.heroHeadline || 'Technology & Digital Growth That Moves Your Business Forward.'}
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings.heroSubtext}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartProjectClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 group focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreServicesClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <span>Explore Our Services</span>
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D2FF]" />
                <span>Custom Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D2FF]" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00D2FF]" />
                <span>Scalable Performance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Technology Architecture Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Tech Architecture Interactive Container */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-[460px] flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent border border-blue-500/20 shadow-2xl backdrop-blur-xl" />

              {/* Main Architectural Console Frame */}
              <div className="relative z-10 w-full max-w-[420px] bg-[#0E1E38]/90 border border-slate-700/70 rounded-2xl p-5 shadow-2xl shadow-black/50 space-y-4">
                
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">vexa-system-core.ts</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>

                {/* System Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#132644] p-2.5 rounded-xl border border-blue-900/40 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Performance</span>
                    <span className="text-lg font-bold text-[#00D2FF]">99.8%</span>
                  </div>
                  <div className="bg-[#132644] p-2.5 rounded-xl border border-blue-900/40 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Response</span>
                    <span className="text-lg font-bold text-blue-400">&lt;120ms</span>
                  </div>
                  <div className="bg-[#132644] p-2.5 rounded-xl border border-blue-900/40 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Uptime</span>
                    <span className="text-lg font-bold text-emerald-400">99.99%</span>
                  </div>
                </div>

                {/* Code / Architecture Representation */}
                <div className="bg-[#081224] p-3.5 rounded-xl font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>// VEXA IT Core Architecture Stack</span>
                    <span className="text-blue-400">Production</span>
                  </div>
                  <div className="text-cyan-300">
                    <span className="text-blue-400">const</span> stack = <span className="text-amber-300">&#123;</span>
                  </div>
                  <div className="pl-4 text-slate-300">
                    frontend: <span className="text-emerald-300">"React / Next.js / TypeScript"</span>,
                  </div>
                  <div className="pl-4 text-slate-300">
                    backend: <span className="text-emerald-300">"Node.js / Python / Cloud APIs"</span>,
                  </div>
                  <div className="pl-4 text-slate-300">
                    infrastructure: <span className="text-emerald-300">"High-Availability Cluster"</span>,
                  </div>
                  <div className="pl-4 text-slate-300">
                    security: <span className="text-emerald-300">"End-to-End Encryption"</span>
                  </div>
                  <div className="text-amber-300">&#125;;</div>
                </div>

                {/* Execution Status Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span>Clean Modular Architecture</span>
                  </div>
                  <span className="text-blue-400 font-semibold">Ready to Deploy</span>
                </div>
              </div>

              {/* Floating Technology Badge 1 (Top Right) */}
              <div className="absolute -top-4 -right-4 sm:-right-6 z-20 bg-[#102344] border border-blue-500/40 p-3 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-float-slow">
                <div className="p-2 rounded-lg bg-blue-600/20 text-[#00D2FF]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Engineered for</p>
                  <p className="text-xs font-bold text-white">Scalable Growth</p>
                </div>
              </div>

              {/* Floating Technology Badge 2 (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 z-20 bg-[#102344] border border-emerald-500/40 p-3 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-float-slow" style={{ animationDelay: '2.5s' }}>
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Enterprise</p>
                  <p className="text-xs font-bold text-white">Quality Assured</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
