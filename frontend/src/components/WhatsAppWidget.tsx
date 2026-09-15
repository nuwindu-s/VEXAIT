import React, { useState } from 'react';
import { companyData } from '../data/company';
import { X } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2.5 font-sans pointer-events-auto select-none">
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="relative max-w-xs p-3.5 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200/90 text-xs animate-scaleUp hidden sm:block">
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2.5 pr-4">
            <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="font-bold text-slate-900">Need a quick quote?</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Chat directly with our engineers on WhatsApp: <strong>071 269 6668</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animated WhatsApp Button Container */}
      <div className="relative animate-whatsapp-float">
        {/* Expanding Pulsing Ripple Radar Rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-ripple pointer-events-none -z-10" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-ripple-delayed pointer-events-none -z-10" />

        {/* The Button */}
        <a
          href={companyData.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#20ba59] hover:from-[#22c55e] hover:to-[#16a34a] text-white shadow-xl shadow-emerald-600/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Chat with Vexa IT on WhatsApp: 0712696668"
        >
          {/* Subtle Shimmer Overlay */}
          <span className="absolute inset-0 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Animated WhatsApp SVG Icon */}
          <div className="relative animate-whatsapp-wiggle">
            <svg className="w-6 h-6 fill-white shrink-0 drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>

          <span className="relative font-extrabold text-sm tracking-wide hidden sm:inline-block drop-shadow-sm">
            WhatsApp
          </span>

          {/* Active Online Indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
          </span>
        </a>
      </div>
    </div>
  );
};
