import React from 'react';
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
} from 'lucide-react';

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
  if (!project) return null;

  const hasGallery = project.galleryImages && project.galleryImages.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 focus:outline-none"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0A192F] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-[11px] font-semibold text-[#00D2FF] uppercase">
              {project.category}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {project.badge || 'Live Production Deliverable'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                {project.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {project.name}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {hasGallery && onOpenGallery && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(project, 0)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>View Screenshots Gallery</span>
                </button>
              )}

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Meta Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Client</span>
                <span className="font-bold">{project.client}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                <span className="font-bold text-emerald-600">Live in Production</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-700">
              <Award className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Performance</span>
                <span className="font-bold text-blue-700">{project.impact}</span>
              </div>
            </div>
          </div>

          {/* Interactive Gallery Preview Section */}
          {hasGallery && (
            <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Application Interface Gallery ({project.galleryImages?.length} Screenshots)
                  </h4>
                </div>
                {onOpenGallery && (
                  <button
                    type="button"
                    onClick={() => onOpenGallery(project, 0)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Lightbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mini Gallery Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {project.galleryImages?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenGallery && onOpenGallery(project, idx)}
                    className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-orange-500 cursor-pointer transition-all aspect-[16/10] bg-slate-950"
                    title={`Click to view: ${img.title}`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-white truncate">
                        {img.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Specifications / Key Features */}
          {project.features && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Platform Highlights & Capabilities</span>
              </h4>
              <div className="space-y-2.5">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {feat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Overview & Architecture */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Architecture Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.fullDesc}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Key Engineering Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Core Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-semibold text-slate-700 bg-blue-50 border border-blue-200/80 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Need a similar high-performance digital application built for your business?
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {hasGallery && onOpenGallery && (
                <button
                  type="button"
                  onClick={() => onOpenGallery(project, 0)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-orange-300 hover:border-orange-400 text-orange-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Open Gallery</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInquire(project.tag);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>Discuss Similar Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
