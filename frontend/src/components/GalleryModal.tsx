import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';

export interface GalleryImage {
  url: string;
  title: string;
  caption: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  images: GalleryImage[];
  initialIndex?: number;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  projectName,
  images,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (isOpen && thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-h-[96vh] flex flex-col bg-[#0B0F19] text-white rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden ${
          isFullscreen ? 'max-w-[98vw] h-[96vh]' : 'max-w-5xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#070B14]/90 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {projectName} <span className="text-xs font-normal text-slate-400 hidden sm:inline">— App Screenshots</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Screenshot {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden sm:inline-flex cursor-pointer"
              title={isFullscreen ? 'Exit Expand' : 'Expand View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
              title="Close Gallery (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image Display Area */}
        <div className="relative flex-1 min-h-[320px] max-h-[62vh] sm:max-h-[66vh] bg-[#050811] flex items-center justify-center overflow-hidden p-2 sm:p-4">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 transform scale-100"
          />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white border border-slate-700/80 flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-sm group"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white border border-slate-700/80 flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-sm group"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Image Caption and Metadata */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#090E1A] border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              {currentImage.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {currentImage.caption}
            </p>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-800/40 self-start sm:self-auto shrink-0">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Thumbnails Carousel Bar */}
        <div className="p-3 sm:p-4 bg-[#060911] border-t border-slate-800/60 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 w-max min-w-full px-2 justify-start sm:justify-center">
            {images.map((img, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer h-12 w-20 sm:h-14 sm:w-24 shrink-0 ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/50 scale-105 opacity-100 shadow-lg shadow-orange-500/20'
                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                  }`}
                  title={img.title}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center font-mono py-0.5 text-slate-300">
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
