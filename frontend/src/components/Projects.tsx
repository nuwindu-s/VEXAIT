import React, { useState, useEffect } from 'react';
import { portfolioData, ProjectItem } from '../data/portfolio';
import { ProjectModal } from './ProjectModal';
import { GalleryModal } from './GalleryModal';
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  Lock,
  Zap,
  Palette,
  Image as ImageIcon,
  Monitor,
  Globe,
} from 'lucide-react';

interface ProjectsProps {
  onSelectService: (serviceName: string) => void;
  isStandalone?: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectService, isStandalone = false }) => {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(portfolioData);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [galleryState, setGalleryState] = useState<{
    isOpen: boolean;
    project: ProjectItem | null;
    initialIndex: number;
  }>({
    isOpen: false,
    project: null,
    initialIndex: 0,
  });

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted: ProjectItem[] = data.data.map((p: any) => ({
            id: p.slug || p._id,
            name: p.name,
            category: p.category,
            tag: p.tag || p.category,
            badge: p.badge || (p.category === 'Software' ? 'DESKTOP APP' : 'WEB APP'),
            subtitle: p.subtitle || p.tag,
            shortDesc: p.shortDesc,
            fullDesc: p.fullDesc || p.shortDesc,
            client: p.client || 'Client',
            timeline: p.timeline || 'Completed',
            impact: p.impact || '',
            technologies: p.technologies || [],
            deliverables: p.deliverables || [],
            features: p.features || [],
            galleryImages: p.galleryImages || [],
            accentColor: p.accentColor || 'from-blue-600 via-indigo-600 to-sky-600',
            mockupType: p.mockupType || 'browser',
            url: p.url || '',
          }));
          setProjectsList(formatted);
        }
      } catch {
        // Keep static fallback
      }
    };
    fetchLiveProjects();
  }, []);

  const openGallery = (project: ProjectItem, index = 0) => {
    setGalleryState({
      isOpen: true,
      project,
      initialIndex: index,
    });
  };

  const renderCardMockup = (project: ProjectItem) => {
    if (project.id === 'ape-restaurant-pos') {
      return (
        <div className="h-48 bg-gradient-to-br from-[#0B0F19] via-[#121829] to-[#1F1728] p-4 text-white relative overflow-hidden flex flex-col justify-between border-b border-slate-800 group-hover:border-orange-500/40 transition-colors">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Mini Windows Window Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/90 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-400 font-sans font-semibold ml-1">Apé POS v1.0.0</span>
            </div>
            <span className="bg-orange-950/70 text-orange-400 border border-orange-800/60 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              Windows App
            </span>
          </div>

          {/* Mini Content Preview */}
          <div className="flex items-center gap-3 bg-[#0d1322]/90 p-2.5 rounded-xl border border-slate-800 backdrop-blur-sm">
            <img
              src="/ape-pos/pos-7.png"
              alt="Apé POS Terminal Preview"
              className="w-14 h-11 object-cover rounded-lg border border-slate-700 shrink-0 shadow-md"
            />
            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">Apé Restaurant POS</span>
              </div>
              <p className="text-[10px] text-orange-400 font-medium truncate">
                7 App Screenshots in Gallery
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-[#00D2FF] font-semibold">
              <Monitor className="w-3 h-3" /> Electron Desktop
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3" /> 100% Offline
            </span>
          </div>
        </div>
      );
    }

    if (project.id === 'nexora-recovery') {
      return (
        <div className="h-48 bg-gradient-to-br from-[#0A192F] via-[#0E1E38] to-[#162B4D] p-4 text-white relative overflow-hidden flex flex-col justify-between border-b border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Mini Browser Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[160px]">
              nexorarecovery.netlify.app
            </span>
          </div>

          {/* Mini Content Preview */}
          <div className="space-y-1.5 bg-[#0b1626]/80 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider text-white flex items-center gap-1">
                <span className="w-3.5 h-3.5 bg-orange-500 rounded text-[8px] flex items-center justify-center font-black">N</span>
                NEXORA
              </span>
              <span className="text-[9px] font-bold text-orange-400 bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-800/50">
                24/7 SRI LANKA
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-tight line-clamp-1">
              Smart Vehicle Recovery & Flatbed Towing Platform.
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Website
            </span>
            <span className="text-orange-400 flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3" /> Sub-Second Load
            </span>
          </div>
        </div>
      );
    }

    if (project.id === 'lahiru-udayanga') {
      return (
        <div className="h-48 bg-gradient-to-br from-[#0B0F19] via-[#141226] to-[#1E1638] p-4 text-white relative overflow-hidden flex flex-col justify-between border-b border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Mini Browser Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <div className="w-2 h-2 rounded-full bg-amber-500/80" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[160px]">
              lahiruudayanga.netlify.app
            </span>
          </div>

          {/* Mini Content Preview */}
          <div className="space-y-1.5 bg-[#120F24]/80 p-2.5 rounded-lg border border-purple-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider text-white flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                LAHIRU UDAYANGA
              </span>
              <span className="text-[9px] font-bold text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/50">
                CREATIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-tight line-clamp-1">
              Canvas Parallax & Glassmorphic Design Showcase.
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Portfolio
            </span>
            <span className="text-purple-300 flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3" /> Canvas Engine
            </span>
          </div>
        </div>
      );
    }

    // Dynamic Mockup for newly created projects (with photo or custom gradient)
    const firstImg = project.galleryImages?.[0]?.url;
    return (
      <div className={`h-48 bg-gradient-to-br ${project.accentColor || 'from-[#0B0F19] to-[#1E293B]'} relative overflow-hidden flex flex-col justify-between border-b border-slate-800 text-white`}>
        {firstImg ? (
          <>
            <img src={firstImg} alt={project.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
            
            {/* Top Bar */}
            <div className="relative p-3 flex items-center justify-between text-[10px] z-10">
              <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
                {project.url ? project.url.replace(/^https?:\/\//, '') : project.category}
              </span>
              {project.galleryImages && project.galleryImages.length > 0 && (
                <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> {project.galleryImages.length}
                </span>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="relative p-3 z-10">
              <span className="text-xs font-bold text-white block truncate">{project.name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Deliverable
              </span>
            </div>
          </>
        ) : (
          <div className="p-4 flex flex-col justify-between h-full bg-[#0B0F19]/80 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                {project.url ? project.url.replace(/^https?:\/\//, '') : 'VEXA IT Project'}
              </span>
            </div>
            <div className="py-2">
              <h4 className="text-sm font-bold text-white truncate">{project.name}</h4>
              <p className="text-[11px] text-slate-300 line-clamp-1">{project.shortDesc}</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-blue-400 font-semibold">{project.category}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3" /> High Performance
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="projects" className={`${isStandalone ? 'pt-36 pb-24 md:pt-44' : 'py-24'} bg-slate-50 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>FEATURED CLIENT DELIVERABLES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Projects
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore our custom software systems, desktop applications, and high-performance digital platforms.
          </p>
        </div>

        {/* 3-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projectsList.map((project) => {
            const hasGallery = project.galleryImages && project.galleryImages.length > 0;
            const isPos = project.id === 'ape-restaurant-pos';

            return (
              <div
                key={project.id}
                onClick={() => setActiveModalProject(project)}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1.5 flex flex-col justify-between ${
                  isPos
                    ? 'border-orange-200/90 shadow-lg hover:shadow-2xl hover:border-orange-400 ring-1 ring-orange-500/20'
                    : 'border-slate-200/90 shadow-md hover:shadow-2xl hover:border-blue-400'
                }`}
              >
                {/* Card Top: Mockup Preview */}
                {renderCardMockup(project)}

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Header Row with Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isPos ? 'text-orange-600' : project.id === 'nexora-recovery' ? 'text-blue-600' : 'text-purple-600'
                      }`}>
                        {isPos ? 'Desktop Software' : project.id === 'nexora-recovery' ? 'Commercial Platform' : 'Creative Showcase'}
                      </span>
                      {project.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide ${
                          isPos
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {project.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {project.name}
                    </h3>

                    {/* Subtitle / Tag */}
                    <p className={`text-xs font-bold tracking-wide ${
                      isPos ? 'text-sky-600 font-semibold' : 'text-blue-600'
                    }`}>
                      {project.subtitle || project.tag}
                    </p>

                    {/* Bullet Points / Feature Highlights */}
                    {isPos && project.features ? (
                      <div className="pt-2 space-y-2">
                        {project.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                            <span className="text-red-500 font-bold shrink-0 mt-0.5">▸</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {project.shortDesc}
                      </p>
                    )}
                  </div>

                  {/* Technologies & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] font-medium text-blue-600 px-1 py-0.5">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Card Buttons */}
                    <div className="space-y-2 pt-1">
                      {/* Prominent View App Gallery Button for Projects with Gallery */}
                      {hasGallery && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openGallery(project, 0);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0d1424] hover:bg-[#131d33] text-rose-300 hover:text-rose-200 border border-rose-500/60 hover:border-rose-400 shadow-md shadow-rose-950/30 text-xs font-bold transition-all transform hover:scale-[1.01] cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-rose-400" />
                          <span>View App Gallery ({project.galleryImages?.length} Screenshots)</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalProject(project);
                          }}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold shadow transition-all cursor-pointer ${
                            isPos
                              ? 'bg-slate-900 hover:bg-slate-800 text-white'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          <span>Case Study & Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-slate-50 transition-all cursor-pointer"
                            title="Open Live Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Click Prompt Hint */}
                <div className="bg-slate-50 border-t border-slate-100 py-1.5 px-4 text-center text-[10px] text-slate-400 font-medium">
                  {hasGallery ? 'Click to open case study & full gallery preview' : 'Click to open popup window with full details'}
                </div>
              </div>
            );
          })}
        </div>

        {/* NDA & Additional Projects Confidentiality Banner */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-[#0A192F] text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D2FF] uppercase">
                <Lock className="w-3.5 h-3.5" />
                <span>Client Confidentiality</span>
              </div>
              <h4 className="text-base font-bold text-white">
                More Enterprise Desktop & Web Platforms Available Under NDA
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                We respect our clients' proprietary software. Additional offline systems, POS terminals, and enterprise portals can be demonstrated upon request.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectService('Software & POS System Demonstration')}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow transition-all cursor-pointer"
            >
              Request Demos
            </button>
          </div>
        </div>

      </div>

      {/* Case Study Popup Modal Window */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onOpenGallery={(project, index) => openGallery(project, index)}
        onInquire={(serviceName) => {
          onSelectService(serviceName);
        }}
      />

      {/* Fullscreen Interactive Screenshot Gallery Modal */}
      <GalleryModal
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState({ isOpen: false, project: null, initialIndex: 0 })}
        projectName={galleryState.project?.name || 'Project Screenshots'}
        images={galleryState.project?.galleryImages || []}
        initialIndex={galleryState.initialIndex}
      />
    </section>
  );
};
