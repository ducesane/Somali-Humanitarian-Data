'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Maximize2,
  RefreshCw,
  Sun,
  Droplets,
  Building,
  CheckCircle2
} from 'lucide-react';

interface BoreholeZoomMapProps {
  initialZoom?: number;
}

export default function BoreholeZoomMap({ initialZoom = 18 }: BoreholeZoomMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any }>({});
  const markersGroupRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);

  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [activeBaseLayer, setActiveBaseLayer] = useState<'googleSat' | 'googleHybrid' | 'esriSat' | 'osm'>('googleSat');
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Exact coordinates of Bacadweyne Borehole installation
  const SITE_COORDS: [number, number] = [6.44020, 47.34180];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Dynamically import Leaflet
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize Map
      const map = L.map(mapContainerRef.current, {
        center: SITE_COORDS,
        zoom: initialZoom,
        maxZoom: 20,
        minZoom: 6,
        zoomControl: false, // We'll add custom modern zoom controls
      });

      mapInstanceRef.current = map;

      // Define Base Tile Layers
      const googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps / Earth',
      });

      const googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps Hybrid',
      });

      const esriSat = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      });

      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });

      layersRef.current = { googleSat, googleHybrid, esriSat, osm };

      // Set initial base layer
      googleSat.addTo(map);

      // Add Scale Bar
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      // Listen to zoom events
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Markers Layer Group
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // Compound Security Perimeter Polygon (~48.5m x 38.2m)
      const fenceBounds: [number, number][] = [
        [6.44038, 47.34162],
        [6.44038, 47.34202],
        [6.44002, 47.34202],
        [6.44002, 47.34162],
      ];

      const fencePolygon = L.polygon(fenceBounds, {
        color: '#10B981',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#10B981',
        fillOpacity: 0.12,
      }).addTo(markersGroup);

      fencePolygon.bindPopup(`
        <div class="text-xs p-1 font-sans">
          <strong class="text-emerald-600 block text-sm font-bold">Compound Security Perimeter</strong>
          <span class="text-slate-600">Contracted Spec: 50m x 40m Chain-Link Security Fence with Double Gate</span>
          <div class="mt-1 text-[11px] text-slate-500">Verified Footprint: ~1,852 m²</div>
        </div>
      `);
      polygonRef.current = fencePolygon;

      // Helper function to create custom HTML pin
      const createPin = (iconChar: string, bgColor: string, borderColor: string, pulse: boolean = false) => {
        return L.divIcon({
          className: 'custom-leaflet-pin',
          html: `
            <div class="relative flex items-center justify-center">
              ${pulse ? `<div class="absolute -inset-1 rounded-full ${bgColor} opacity-40 animate-ping"></div>` : ''}
              <div class="w-8 h-8 rounded-full ${bgColor} border-2 ${borderColor} text-white flex items-center justify-center text-sm shadow-xl font-bold cursor-pointer hover:scale-110 transition-transform">
                ${iconChar}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });
      };

      // 1. Deep Borehole Wellhead
      const markerBorehole = L.marker([6.44020, 47.34180], {
        icon: createPin('💧', 'bg-blue-600', 'border-white', true),
      }).addTo(markersGroup);

      markerBorehole.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
            <span>Deep Borehole Wellhead</span>
            <span class="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-mono">100% Verified</span>
          </div>
          <div class="text-slate-700 mt-1 font-medium">Rotary Drilled Deep Well (175m Depth)</div>
          <ul class="text-slate-500 list-disc list-inside mt-1 space-y-0.5 text-[11px]">
            <li>8-inch steel casing with slotted screen filters</li>
            <li>Reinforced concrete sanitary apron collar</li>
            <li>Submersible multi-stage solar pump installed</li>
          </ul>
        </div>
      `);
      markerBorehole.on('click', () => setSelectedAsset('Borehole Wellhead (175m)'));

      // 2. Solar PV Generator Array
      const markerSolar = L.marker([6.44015, 47.34173], {
        icon: createPin('☀️', 'bg-amber-500', 'border-white'),
      }).addTo(markersGroup);

      markerSolar.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
            <span>Solar PV Generator Sub-Station</span>
            <span class="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-mono">6.5 kWp</span>
          </div>
          <div class="text-slate-700 mt-1 font-medium">24 x 275W Poly-Crystalline Modules</div>
          <ul class="text-slate-500 list-disc list-inside mt-1 space-y-0.5 text-[11px]">
            <li>Galvanized tilt-rack structure (18° South Azimuth)</li>
            <li>DC solar inverter and lightning surge arrester</li>
            <li>Zero fuel operating cost for Bacadweyn community</li>
          </ul>
        </div>
      `);
      markerSolar.on('click', () => setSelectedAsset('Solar PV Array (6.5 kWp)'));

      // 3. Control Kiosk / Pump House
      const markerKiosk = L.marker([6.44026, 47.34190], {
        icon: createPin('🏢', 'bg-sky-600', 'border-white'),
      }).addTo(markersGroup);

      markerKiosk.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="flex items-center gap-1.5 text-sky-600 font-bold text-sm">
            <span>Pump House &amp; Control Kiosk</span>
            <span class="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.2 rounded font-mono">Zinc Roof</span>
          </div>
          <div class="text-slate-700 mt-1 font-medium">4m x 4m Masonry Building</div>
          <ul class="text-slate-500 list-disc list-inside mt-1 space-y-0.5 text-[11px]">
            <li>Galvanized corrugated sheet roofing (albedo verified)</li>
            <li>Lockable metal door &amp; inline chlorine doser</li>
            <li>Operator control desk &amp; pressure gauge manifold</li>
          </ul>
        </div>
      `);
      markerKiosk.on('click', () => setSelectedAsset('Pump House & Control Kiosk'));

      // 4. Communal Water Tap Stand
      const markerTap = L.marker([6.44032, 47.34185], {
        icon: createPin('🚰', 'bg-emerald-600', 'border-white'),
      }).addTo(markersGroup);

      markerTap.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
            <span>Communal Water Tap Stand</span>
            <span class="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-mono">4 Faucets</span>
          </div>
          <div class="text-slate-700 mt-1 font-medium">Clean Potable Water Distribution Point</div>
          <ul class="text-slate-500 list-disc list-inside mt-1 space-y-0.5 text-[11px]">
            <li>Concrete drainage slab with soakaway gravel pit</li>
            <li>Serves 2,800+ Bacadweyn village residents</li>
          </ul>
        </div>
      `);
      markerTap.on('click', () => setSelectedAsset('Communal Water Tap Stand'));

      // 5. Animal Drinking Trough
      const markerTrough = L.marker([6.44006, 47.34195], {
        icon: createPin('🐪', 'bg-orange-600', 'border-white'),
      }).addTo(markersGroup);

      markerTrough.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="flex items-center gap-1.5 text-orange-600 font-bold text-sm">
            <span>Livestock Drinking Trough</span>
            <span class="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.2 rounded font-mono">20m Length</span>
          </div>
          <div class="text-slate-700 mt-1 font-medium">Reinforced Concrete Double-Sided Trough</div>
          <ul class="text-slate-500 list-disc list-inside mt-1 space-y-0.5 text-[11px]">
            <li>Float valve automatic water level regulation</li>
            <li>Capacitated for 1,200+ livestock (camels, goats, sheep) daily</li>
          </ul>
        </div>
      `);
      markerTrough.on('click', () => setSelectedAsset('Livestock Drinking Trough'));

    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Layer Switching
  const switchBaseLayer = (layerKey: 'googleSat' | 'googleHybrid' | 'esriSat' | 'osm') => {
    if (!mapInstanceRef.current || !layersRef.current[layerKey]) return;

    // Remove active layer
    if (layersRef.current[activeBaseLayer]) {
      mapInstanceRef.current.removeLayer(layersRef.current[activeBaseLayer]);
    }

    // Add new layer
    layersRef.current[layerKey].addTo(mapInstanceRef.current);
    setActiveBaseLayer(layerKey);
  };

  // Zoom preset helper
  const jumpToZoom = (zoomLevel: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(SITE_COORDS, zoomLevel, { duration: 1.2 });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const toggleMarkers = () => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    if (showMarkers) {
      mapInstanceRef.current.removeLayer(markersGroupRef.current);
    } else {
      mapInstanceRef.current.addLayer(markersGroupRef.current);
    }
    setShowMarkers(!showMarkers);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Action Toolbar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Interactive Ultra-Zoom Satellite Inspection
            </span>
          </div>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            Post-Installation Borehole &amp; Solar Compound Zoom Viewer
          </h4>
          <p className="text-xs text-slate-400">
            Zoom down to level 20 (~0.3m/pixel) to visually verify wellhead casing, solar array, and water troughs
          </p>
        </div>

        {/* Zoom Quick Jump Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Quick Jumps:</span>
          <button
            onClick={() => jumpToZoom(13)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              currentZoom === 13 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Corridor (Z13)
          </button>
          <button
            onClick={() => jumpToZoom(16)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              currentZoom === 16 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Village (Z16)
          </button>
          <button
            onClick={() => jumpToZoom(18)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              currentZoom === 18 ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Compound (Z18)
          </button>
          <button
            onClick={() => jumpToZoom(19)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              currentZoom === 19 ? 'bg-emerald-600 text-slate-950 border-emerald-500 font-extrabold shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Close-Up (Z19)
          </button>
          <button
            onClick={() => jumpToZoom(20)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors border ${
              currentZoom === 20 ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm' : 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
            }`}
          >
            Extreme Zoom (Z20)
          </button>
        </div>
      </div>

      {/* Layer Selection & Feature Toggle Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Base Layer:</span>
          </span>
          <button
            onClick={() => switchBaseLayer('googleSat')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeBaseLayer === 'googleSat' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Satellite (Z20)
          </button>
          <button
            onClick={() => switchBaseLayer('googleHybrid')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeBaseLayer === 'googleHybrid' 
                ? 'bg-sky-950 text-sky-300 border border-sky-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Hybrid (Labels)
          </button>
          <button
            onClick={() => switchBaseLayer('esriSat')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeBaseLayer === 'esriSat' 
                ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Esri World Imagery (Maxar)
          </button>
        </div>

        {/* Feature Pin Toggles & Active Asset Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMarkers}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold transition-all ${
              showMarkers 
                ? 'bg-slate-800 text-emerald-300 border-emerald-600/60' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{showMarkers ? 'Hide Infrastructure Pins' : 'Show Infrastructure Pins'}</span>
          </button>

          <span className="font-mono text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Zoom Level: <strong className="text-white">{currentZoom} / 20</strong>
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[520px] sm:h-[620px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Modern Zoom Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-lg shadow-md transition-colors"
            title="Zoom In (High-Res)"
          >
            <ZoomIn className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-lg shadow-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => jumpToZoom(18)}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xs shadow-md transition-colors font-mono"
            title="Recenter Compound"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Telemetry Overlay Card (Bottom Right) */}
        <div className="absolute bottom-6 right-4 z-10 bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl p-3 shadow-2xl text-xs max-w-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[10px] uppercase">
            <span>Verified Installation Asset</span>
            <span className="text-emerald-400 font-bold">● Active Online</span>
          </div>
          <div className="text-white font-extrabold text-sm truncate">
            {selectedAsset || 'Click any marker on map to inspect'}
          </div>
          <div className="text-[11px] text-slate-400">
            Location: <strong className="text-slate-200">Bacadweyn, Mudug Region</strong>
          </div>
          <div className="text-[10px] font-mono text-emerald-400">
            GPS: 6.44020° N, 47.34180° E
          </div>
        </div>

        {/* Legend Overlay Card (Bottom Left) */}
        <div className="absolute bottom-6 left-4 z-10 bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl p-2.5 shadow-2xl text-[11px] hidden sm:block">
          <div className="text-slate-400 font-bold text-[10px] uppercase mb-1.5">Asset Legend:</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
            <span className="flex items-center gap-1.5"><span className="text-xs">💧</span> Wellhead (175m)</span>
            <span className="flex items-center gap-1.5"><span className="text-xs">☀️</span> Solar Array (6.5 kWp)</span>
            <span className="flex items-center gap-1.5"><span className="text-xs">🏢</span> Kiosk (Zinc Roof)</span>
            <span className="flex items-center gap-1.5"><span className="text-xs">🚰</span> Tap Stand (4 Spouts)</span>
            <span className="flex items-center gap-1.5"><span className="text-xs">🐪</span> Livestock Trough</span>
            <span className="flex items-center gap-1.5 text-emerald-400">--- 1,850m² Perimeter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
