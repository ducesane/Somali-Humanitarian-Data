'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Eye, 
  SlidersHorizontal, 
  Maximize2, 
  ExternalLink,
  ShieldCheck,
  Compass,
  ZoomIn
} from 'lucide-react';

const MAP_LAYERS = [
  {
    id: 'google-hybrid',
    name: 'Google Maps Hybrid (Z16)',
    desc: 'Satellite with arterial road labels & settlement context',
    src: '/audit/google_z16_hybrid.jpg',
    tag: 'Regional Context',
    color: 'border-sky-500 text-sky-400'
  },
  {
    id: 'google-sat-18',
    name: 'Google Earth High-Res (Z18)',
    desc: 'Sub-meter (~0.6m) optical inspection of physical structures',
    src: '/audit/google_z18_sat.jpg',
    tag: 'Sub-Meter Zoom',
    color: 'border-emerald-500 text-emerald-400'
  },
  {
    id: 'page1-optical',
    name: '3-Panel Optical Audit (FIG-01)',
    desc: 'Regional Access vs Baseline vs Completed Compound',
    src: '/audit/dossier_page1_optical_audit.png',
    tag: 'Full Dossier Fig 1',
    color: 'border-amber-500 text-amber-400'
  },
  {
    id: 'page2-boq',
    name: 'Structural BOQ Audit (FIG-02)',
    desc: 'Component extraction: Solar, Pump House, Trough',
    src: '/audit/dossier_page2_structural_audit.png',
    tag: 'Full Dossier Fig 2',
    color: 'border-indigo-500 text-indigo-400'
  },
  {
    id: 'page3-ndvi',
    name: 'NDVI Hydrological Plume (FIG-03)',
    desc: 'Photosynthetic moisture plume proving active water discharge',
    src: '/audit/dossier_page3_ndvi_hydrological.png',
    tag: 'Full Dossier Fig 3',
    color: 'border-teal-500 text-teal-400'
  }
];

export default function InteractiveAuditViewer() {
  const [activeLayer, setActiveLayer] = useState(MAP_LAYERS[0]);
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'single' | 'slider'>('single');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Controls Header */}
      <div className="border-b border-slate-800 p-4 sm:p-5 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Interactive Geospatial Inspection Console
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white mt-1">
            Multi-Source Satellite &amp; Google Earth Mapping Suite
          </h3>
          <p className="text-xs text-slate-400">
            Switch between Google Maps Hybrid, sub-meter optical imagery, and multi-temporal change detection
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Layer Viewer</span>
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'slider'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Before / After Slider</span>
          </button>
        </div>
      </div>

      {/* Layer Selectors */}
      <div className="p-3 sm:p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        {MAP_LAYERS.map((layer) => {
          const isSelected = activeLayer.id === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all border ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {layer.tag}
                </span>
                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {layer.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{layer.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Map Display Canvas */}
      <div className="relative p-2 sm:p-4 bg-slate-950 flex flex-col items-center">
        {viewMode === 'single' ? (
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src={activeLayer.src}
              alt={activeLayer.name}
              className="w-full h-auto object-contain block"
            />

            {/* Floating Coordinate HUD */}
            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl px-3 py-2 shadow-lg text-xs font-mono">
              <div className="text-slate-400 text-[10px] font-bold uppercase">Target Location</div>
              <div className="text-emerald-400 font-bold">6.4402° N, 47.3418° E</div>
              <div className="text-slate-500 text-[10px]">Bacadweyn &bull; Gaalkacyo &bull; Mudug</div>
            </div>

            {/* Quick External Map Links */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <a
                href="https://www.google.com/maps/@6.4402,47.3418,17z/data=!3m1!1e3"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg shadow-md transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        ) : (
          /* Before / After Wipe Slider */
          <div className="w-full max-w-5xl space-y-4">
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden border border-slate-800 select-none shadow-2xl bg-black">
              {/* After Image (Full width underneath) */}
              <img
                src="/audit/google_z18_sat.jpg"
                alt="Monitoring T1 (Current Google Satellite)"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-slate-950/90 border border-emerald-500 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold shadow">
                T1: Post-Construction (Sub-Meter)
              </div>

              {/* Before Image (Clipped above) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src="/audit/highres_optical_site.jpg"
                  alt="Baseline T0 (Untouched Scrub)"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-90 sepia-[0.2]"
                  style={{ width: '100%', maxWidth: 'none' }}
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 border border-rose-500 text-rose-400 px-3 py-1 rounded-lg text-xs font-bold shadow">
                  T0: Baseline (Pre-Construction)
                </div>
              </div>

              {/* Slider Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center text-xs shadow-2xl border-2 border-slate-950">
                  ↔
                </div>
              </div>
            </div>

            {/* Slider Control Input */}
            <div className="flex items-center gap-4 px-2">
              <span className="text-xs text-rose-400 font-semibold shrink-0">Baseline (May 2026)</span>
              <input 
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-ew-resize"
              />
              <span className="text-xs text-emerald-400 font-semibold shrink-0">Operational (Nov 2026)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
