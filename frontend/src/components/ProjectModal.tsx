import React, { useEffect } from 'react';
import { ProjectItem } from '../data/portfolio';
import {
  X,
  ExternalLink,
  Calendar,
  User,
  Award,
  CheckCircle2,
  ArrowRight,
  Globe,
  Zap,
  Image as ImageIcon,
  Layers,
  Eye,
} from 'lucide-react';
import { formatCaseStudyHtml } from '../utils/formatHtml';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (serviceName: string) => void;
  onOpenGallery?: (project: ProjectItem, index?: number) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire,
  onOpenGallery,
}) => {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const galleryList = project.galleryImages || [];
  const hasGallery = galleryList.length > 0;
  const maxPreviewCount = 6;
  const displayGallery = galleryList.slice(0, maxPreviewCount);
  const remainingCount = galleryList.length - maxPreviewCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-[#0A192F] via-[#0D2040] to-[#0A192F] text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-[#00D2FF] uppercase tracking-wider">
              {project.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {project.badge || 'Live Production Deliverable'}
            </span>
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-7">
          
          {/* Title & Quick Action CTAs */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">
                {project.tag || project.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {project.name}
              </h3>
              {project.subtitle && project.subtitle !== project.tag && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {hasGallery && onOpenGallery && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(project, 0)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>View Screenshots ({galleryList.length})</span>
                </button>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* 4-Column Key Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Client */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Client</span>
                <span className="text-xs font-bold text-slate-800 truncate block" title={project.client}>
                  {project.client || 'Enterprise Client'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status</span>
                <span className="text-xs font-bold text-emerald-600 truncate block">
                  {project.timeline || 'Live in Production'}
                </span>
              </div>
            </div>

            {/* Platform / Type */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Platform / Type</span>
                <span className="text-xs font-bold text-indigo-700 truncate block">
                  {project.badge || project.tag || project.category}
                </span>
              </div>
            </div>

            {/* Performance / Impact */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Performance</span>
                <span className="text-xs font-bold text-slate-800 truncate block" title={project.impact || 'High Reliability & Sub-Second Execution'}>
                  {project.impact || 'High Reliability & Sub-Second Execution'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Screenshots Gallery Section */}
          {hasGallery && (
            <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] via-[#0E1A38] to-[#070C18] text-white border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      Application Interface Gallery
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {galleryList.length} Screenshots
                      </span>
                    </h4>
                  </div>
                </div>

                {onOpenGallery && (
                  <button
                    type="button"
                    onClick={() => onOpenGallery(project, 0)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <span>Full Lightbox</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Gallery Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {displayGallery.map((img, idx) => {
                  const isLastSlot = idx === maxPreviewCount - 1 && remainingCount > 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => onOpenGallery && onOpenGallery(project, idx)}
                      className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-orange-500/80 cursor-pointer transition-all duration-300 aspect-[16/10] bg-slate-950 shadow-md"
                      title={img.title}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Normal Hover Overlay */}
                      {!isLastSlot ? (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5">
                          <div className="self-end p-1 rounded-md bg-orange-500/80 text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] font-semibold text-white line-clamp-1">
                            {img.title}
                          </span>
                        </div>
                      ) : (
                        /* "+ N More" Card for extra screenshots */
                        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] group-hover:bg-slate-950/75 transition-colors flex flex-col items-center justify-center p-3 text-center border-2 border-dashed border-orange-500/50 group-hover:border-orange-500">
                          <span className="text-xl sm:text-2xl font-black text-orange-400">
                            +{remainingCount + 1}
                          </span>
                          <span className="text-[11px] font-bold text-white mt-0.5">
                            More Screenshots
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <Eye className="w-3 h-3 text-orange-400" /> Click to view all
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Specifications / Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Platform Highlights & Capabilities</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {feat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Overview & Architecture */}
          {project.fullDesc && (
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Architecture Overview & Case Study
              </h4>
              <div
                className="case-study-html text-xs sm:text-sm text-slate-600 leading-relaxed p-4 rounded-xl bg-slate-50/70 border border-slate-200/60"
                dangerouslySetInnerHTML={{
                  __html: formatCaseStudyHtml(project.fullDesc),
                }}
              />
            </div>
          )}

          {/* Key Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Engineering Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Core Technologies & Frameworks
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-700 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Need a similar high-performance digital solution for your business?
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {hasGallery && onOpenGallery && (
              <button
                type="button"
                onClick={() => onOpenGallery(project, 0)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-300 hover:border-orange-500 text-orange-700 hover:bg-orange-50 text-xs font-bold transition-all cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery ({galleryList.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(project.tag);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Discuss Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
