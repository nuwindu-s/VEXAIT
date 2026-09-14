import React, { useState } from 'react';
import { portfolioData, ProjectItem } from '../data/portfolio';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, Layers, ArrowRight, Laptop, Smartphone, LayoutDashboard } from 'lucide-react';

interface PortfolioProps {
  onSelectService: (serviceName: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Web', 'Software', 'Mobile', 'E-Commerce'];

  const filteredProjects = selectedCategory === 'All'
    ? portfolioData
    : portfolioData.filter((p) => p.category === selectedCategory);

  const renderProjectVisual = (project: ProjectItem) => {
    switch (project.mockupType) {
      case 'mobile':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-slate-900 via-[#0A192F] to-blue-950 p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="w-36 h-40 bg-slate-900 border-2 border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-col justify-between">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />
              <div className="space-y-1.5 px-1">
                <div className="h-2 w-14 bg-blue-500 rounded" />
                <div className="h-1.5 w-full bg-slate-700 rounded" />
                <div className="h-1.5 w-3/4 bg-slate-700 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div className="h-8 bg-blue-600/30 rounded border border-blue-500/30" />
                <div className="h-8 bg-[#00D2FF]/20 rounded border border-cyan-500/30" />
              </div>
              <div className="w-8 h-1 bg-slate-700 rounded-full mx-auto" />
            </div>
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Smartphone className="w-3 h-3 text-[#00D2FF]" /> iOS & Android
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-[#060D1A] via-[#0A192F] to-[#102344] p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="w-full max-w-[280px] bg-slate-900/90 border border-slate-700 rounded-xl p-3 shadow-2xl space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-1.5 w-16 bg-blue-500/50 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-6 bg-slate-800 rounded p-1">
                  <div className="h-1.5 w-6 bg-[#00D2FF] rounded" />
                </div>
                <div className="h-6 bg-slate-800 rounded p-1">
                  <div className="h-1.5 w-6 bg-blue-500 rounded" />
                </div>
                <div className="h-6 bg-slate-800 rounded p-1">
                  <div className="h-1.5 w-6 bg-emerald-500 rounded" />
                </div>
              </div>
              <div className="h-10 bg-slate-950/80 rounded border border-slate-800 flex items-end px-2 py-1 gap-1.5">
                <div className="w-1/6 h-3 bg-blue-600 rounded-t" />
                <div className="w-1/6 h-6 bg-[#00D2FF] rounded-t" />
                <div className="w-1/6 h-4 bg-blue-500 rounded-t" />
                <div className="w-1/6 h-7 bg-blue-600 rounded-t" />
                <div className="w-1/6 h-5 bg-sky-400 rounded-t" />
                <div className="w-1/6 h-8 bg-emerald-400 rounded-t" />
              </div>
            </div>
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <LayoutDashboard className="w-3 h-3 text-blue-400" /> Web App
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-gradient-to-br from-[#071326] via-[#0A192F] to-[#122b52] p-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
            <div className="w-full max-w-[280px] bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl">
              <div className="h-5 bg-slate-800/90 px-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="h-2 w-28 bg-slate-700 rounded-full mx-auto" />
              </div>
              <div className="p-3 space-y-2 bg-[#091528]">
                <div className="h-4 bg-blue-600/30 rounded w-2/3 border border-blue-500/20" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-slate-800/80 rounded border border-slate-700/50" />
                  <div className="h-8 bg-slate-800/80 rounded border border-slate-700/50" />
                </div>
                <div className="h-3 bg-cyan-500/20 rounded w-1/2" />
              </div>
            </div>
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Laptop className="w-3 h-3 text-[#00D2FF]" /> Web Portal
            </div>
          </div>
        );
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <span>PROVEN DELIVERABLES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Selected Work
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Explore a curated selection of custom software, enterprise platforms, and digital applications engineered for our clients.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 group"
            >
              {/* Visual Mockup Header */}
              <div className="overflow-hidden cursor-pointer" onClick={() => setActiveModalProject(project)}>
                {renderProjectVisual(project)}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {project.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                  >
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.shortDesc}
                  </p>
                </div>

                {/* Tech Pills & View Project Trigger */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl border border-slate-200 hover:border-blue-600 transition-all duration-200 group/btn"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onInquire={(serviceName) => {
          onSelectService(serviceName);
          const contact = document.getElementById('contact');
          if (contact) {
            contact.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </section>
  );
};
