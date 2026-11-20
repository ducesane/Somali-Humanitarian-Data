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
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface BoreholeSite {
  id: string;
  name: string;
  region: string;
  district: string;
  agency: string;
  contractor: string;
  coords: [number, number];
  zoom: number;
  description: string;
  assets: {
    name: string;
    type: string;
    icon: string;
    bg: string;
    coords: [number, number];
    spec: string;
  }[];
}

const VERIFIED_BOREHOLE_SITES: BoreholeSite[] = [
  {
    id: 'bacadweyn',
    name: 'Bacadweyn Solar Borehole Yard',
    region: 'Mudug Region',
    district: 'Gaalkacyo District',
    agency: 'UNDP / Saudi Fund (01005998)',
    contractor: 'Hiraal Engineering & Construction',
    coords: [7.19320, 47.52840],
    zoom: 18,
    description: 'Active rural solar-powered deep borehole serving Bacadweyn town households and pastoralist livestock.',
    assets: [
      {
        name: 'Deep Borehole Wellhead (175m)',
        type: 'wellhead',
        icon: '💧',
        bg: 'bg-blue-600',
        coords: [7.19320, 47.52840],
        spec: '175m rotary drilled borehole, 8-inch steel casing, concrete sanitary apron & solar submersible pump.'
      },
      {
        name: 'Solar PV Array Platform (6.5 kWp)',
        type: 'solar',
        icon: '☀️',
        bg: 'bg-amber-500',
        coords: [7.19315, 47.52835],
        spec: '24 x 275W poly-crystalline modules on elevated galvanized steel rack with 18° south tilt.'
      },
      {
        name: 'Operator Kiosk & Pump House',
        type: 'kiosk',
        icon: '🏢',
        bg: 'bg-sky-600',
        coords: [7.19325, 47.52848],
        spec: '4m x 4m masonry control room with galvanized zinc corrugated roofing and inverter manifold.'
      },
      {
        name: 'Communal Water Tap Stand',
        type: 'tap',
        icon: '🚰',
        bg: 'bg-emerald-600',
        coords: [7.19330, 47.52842],
        spec: '4-spout pre-paid potable water kiosk with concrete apron and wastewater soakaway.'
      },
      {
        name: 'Animal Drinking Trough (20m)',
        type: 'trough',
        icon: '🐪',
        bg: 'bg-orange-600',
        coords: [7.19308, 47.52852],
        spec: '20m reinforced concrete double-sided livestock trough serving 1,200+ camels/goats daily.'
      }
    ]
  },
  {
    id: 'gebiley',
    name: 'Gebiley Deep Borehole BH-3',
    region: 'Maroodi Jeex / Gebiley',
    district: 'Gebiley District',
    agency: 'FAO-SWALIM / UNDP (Guuleed Contract)',
    contractor: 'Guuleed Construction & Transport',
    coords: [9.67902, 43.76157],
    zoom: 18,
    description: 'High-yield municipal deep borehole station with elevated water storage tank and pump house.',
    assets: [
      {
        name: 'Municipal Borehole Wellhead (BH-3)',
        type: 'wellhead',
        icon: '💧',
        bg: 'bg-blue-600',
        coords: [9.67902, 43.76157],
        spec: 'Official SWALIM monitored station BH-3; high-yield municipal groundwater source.'
      },
      {
        name: 'Elevated Water Reservoir Tower',
        type: 'tank',
        icon: '🗼',
        bg: 'bg-indigo-600',
        coords: [9.67908, 43.76165],
        spec: '50 m³ elevated steel water tank on 10m galvanized steel tower with gravity feed mains.'
      },
      {
        name: 'Pump House & Distribution Manifold',
        type: 'kiosk',
        icon: '🏢',
        bg: 'bg-sky-600',
        coords: [9.67895, 43.76150],
        spec: 'Masonry pump house housing high-output booster pumps and chlorination station.'
      }
    ]
  },
  {
    id: 'baidoa',
    name: 'Baidoa Boonkaay / Bayhow Station',
    region: 'Bay Region',
    district: 'Baidoa District',
    agency: 'SWALIM / UNDP (Dalsan Contract)',
    contractor: 'Dalsan Construction & Logistics',
    coords: [3.13441, 43.64595],
    zoom: 18,
    description: 'Major groundwater monitoring station GW1 supplying IDP settlements and peripheral wards in Baidoa.',
    assets: [
      {
        name: 'Groundwater Station GW-1 Wellhead',
        type: 'wellhead',
        icon: '💧',
        bg: 'bg-blue-600',
        coords: [3.13441, 43.64595],
        spec: 'Deep production borehole rehabilitated under UNDP Drought Response with heavy-duty pump.'
      },
      {
        name: 'Multi-Tap Water Distribution Yard',
        type: 'tap',
        icon: '🚰',
        bg: 'bg-emerald-600',
        coords: [3.13448, 43.64605],
        spec: 'Bulk water truck filling gantry and 8-tap public distribution stand for displaced families.'
      },
      {
        name: 'Perimeter Masonry Security Wall',
        type: 'fence',
        icon: '🛡️',
        bg: 'bg-amber-600',
        coords: [3.13435, 43.64585],
        spec: 'Garrisoned concrete perimeter security wall securing municipal water assets.'
      }
    ]
  },
  {
    id: 'adaado',
    name: 'Adaado Central Solar Water Yard',
    region: 'Galgaduud Region',
    district: 'Adaado District',
    agency: 'Ministry of Water / UNICEF',
    contractor: 'Galmudug Water Works',
    coords: [6.14636, 46.60667],
    zoom: 18,
    description: 'Massive solarized water yard with dual livestock watering wings and solar array on the outskirts of Adaado.',
    assets: [
      {
        name: 'Adaado Deep Production Wellhead',
        type: 'wellhead',
        icon: '💧',
        bg: 'bg-blue-600',
        coords: [6.14636, 46.60667],
        spec: '190m deep saline-filtered production well discharging to dual aeration ponds.'
      },
      {
        name: 'High-Capacity Solar PV Field',
        type: 'solar',
        icon: '☀️',
        bg: 'bg-amber-500',
        coords: [6.14630, 46.60660],
        spec: '12 kWp solar generator array providing 8 hours of uninterrupted daily pumping.'
      },
      {
        name: 'Extended Pastoralist Troughs (40m)',
        type: 'trough',
        icon: '🐪',
        bg: 'bg-orange-600',
        coords: [6.14645, 46.60675],
        spec: 'Dual 20m concrete livestock troughs handling migratory camel herds.'
      }
    ]
  }
];

export default function BoreholeZoomMap({ initialZoom = 18 }: { initialZoom?: number }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any }>({});
  const markersGroupRef = useRef<any>(null);

  const [selectedSite, setSelectedSite] = useState<BoreholeSite>(VERIFIED_BOREHOLE_SITES[0]);
  const [currentZoom, setCurrentZoom] = useState(18);
  const [activeBaseLayer, setActiveBaseLayer] = useState<'googleSat' | 'googleHybrid' | 'esriSat'>('googleSat');
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Render / Update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize Map at selected site
      const map = L.map(mapContainerRef.current, {
        center: selectedSite.coords,
        zoom: selectedSite.zoom,
        maxZoom: 20,
        minZoom: 6,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Tile Providers (Supporting maxZoom 20!)
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
        attribution: '&copy; Esri, Maxar Earthstar',
      });

      layersRef.current = { googleSat, googleHybrid, esriSat };
      layersRef.current[activeBaseLayer].addTo(map);

      // Scale Bar
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Markers Layer Group
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // Compound Security Perimeter Polygon around site
      const lat = selectedSite.coords[0];
      const lon = selectedSite.coords[1];
      const dLat = 0.00022;
      const dLon = 0.00025;

      const fenceBounds: [number, number][] = [
        [lat + dLat, lon - dLon],
        [lat + dLat, lon + dLon],
        [lat - dLat, lon + dLon],
        [lat - dLat, lon - dLon],
      ];

      L.polygon(fenceBounds, {
        color: '#10B981',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#10B981',
        fillOpacity: 0.12,
      }).addTo(markersGroup);

      // Render Assets
      selectedSite.assets.forEach((asset) => {
        const pinIcon = L.divIcon({
          className: 'custom-leaflet-pin',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full ${asset.bg} border-2 border-white text-white flex items-center justify-center text-sm shadow-xl font-bold cursor-pointer hover:scale-125 transition-transform">
                ${asset.icon}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(asset.coords, { icon: pinIcon }).addTo(markersGroup);
        marker.bindPopup(`
          <div class="p-2 font-sans text-xs">
            <div class="flex items-center gap-1.5 font-bold text-sm text-slate-900">
              <span>${asset.name}</span>
            </div>
            <div class="text-slate-700 mt-1 font-medium">${asset.spec}</div>
            <div class="mt-1.5 text-[10px] text-slate-500 font-mono">
              GPS: ${asset.coords[0].toFixed(5)}°N, ${asset.coords[1].toFixed(5)}°E
            </div>
          </div>
        `);
        marker.on('click', () => setSelectedAsset(`${asset.name} — ${asset.spec}`));
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedSite]);

  // Handle Site Selection
  const handleSelectSite = (site: BoreholeSite) => {
    setSelectedSite(site);
    setSelectedAsset(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(site.coords, site.zoom, { duration: 1.5 });
    }
  };

  // Switch Base Tile Layer
  const switchBaseLayer = (layerKey: 'googleSat' | 'googleHybrid' | 'esriSat') => {
    if (!mapInstanceRef.current || !layersRef.current[layerKey]) return;

    if (layersRef.current[activeBaseLayer]) {
      mapInstanceRef.current.removeLayer(layersRef.current[activeBaseLayer]);
    }

    layersRef.current[layerKey].addTo(mapInstanceRef.current);
    setActiveBaseLayer(layerKey);
  };

  // Zoom to preset level
  const jumpToZoom = (zoomLevel: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(selectedSite.coords, zoomLevel, { duration: 1.2 });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Verified Physical Water Yard Satellite Inspector
            </span>
          </div>
          <h4 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
            <span>{selectedSite.name}</span>
            <span className="text-xs font-normal text-slate-400">({selectedSite.region})</span>
          </h4>
          <p className="text-xs text-slate-400 line-clamp-1">{selectedSite.description}</p>
        </div>

        {/* Site Selector Dropdown / Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch Site:</span>
          </span>
          {VERIFIED_BOREHOLE_SITES.map((site) => {
            const isSelected = selectedSite.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => handleSelectSite(site)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {site.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layer Selection & Quick Jumps Bar */}
      <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Base Layers */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Tile Layer:</span>
          </span>
          <button
            onClick={() => switchBaseLayer('googleSat')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
              activeBaseLayer === 'googleSat' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Satellite (Z20)
          </button>
          <button
            onClick={() => switchBaseLayer('googleHybrid')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
              activeBaseLayer === 'googleHybrid' 
                ? 'bg-sky-950 text-sky-300 border border-sky-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Hybrid (Labels)
          </button>
          <button
            onClick={() => switchBaseLayer('esriSat')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all ${
              activeBaseLayer === 'esriSat' 
                ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Esri World Imagery (Maxar)
          </button>
        </div>

        {/* Right: Zoom Level Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Zoom:</span>
          <button
            onClick={() => jumpToZoom(13)}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            District (Z13)
          </button>
          <button
            onClick={() => jumpToZoom(16)}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            Settlement (Z16)
          </button>
          <button
            onClick={() => jumpToZoom(18)}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950 border border-blue-800 text-blue-300 hover:bg-blue-900"
          >
            Compound (Z18)
          </button>
          <button
            onClick={() => jumpToZoom(19)}
            className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900"
          >
            Close-Up (Z19)
          </button>
          <button
            onClick={() => jumpToZoom(20)}
            className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500 text-slate-950 border border-amber-400 shadow-sm"
          >
            Extreme Z20 (~0.3m/px)
          </button>

          <button
            onClick={toggleMarkers}
            className={`ml-2 px-2.5 py-0.5 rounded border text-[11px] font-semibold transition-all ${
              showMarkers 
                ? 'bg-slate-800 text-emerald-300 border-emerald-600/60' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {showMarkers ? 'Hide Pins' : 'Show Pins'}
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[540px] sm:h-[640px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Custom Zoom Controls (Top Right) */}
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
            title="Recenter Site"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Active Asset Info Card (Bottom Right) */}
        <div className="absolute bottom-6 right-4 z-10 bg-slate-950/95 backdrop-blur border border-slate-800 rounded-xl p-3.5 shadow-2xl text-xs max-w-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[10px] uppercase">
            <span>Verified Physical Infrastructure</span>
            <span className="text-emerald-400 font-bold">● Active Ground Station</span>
          </div>
          <div className="text-white font-extrabold text-sm truncate">
            {selectedAsset || 'Click any marker pin on the map to inspect'}
          </div>
          <div className="text-[11px] text-slate-400">
            Agency / Contractor: <strong className="text-slate-200">{selectedSite.agency}</strong>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
            <span className="text-emerald-400">
              GPS: {selectedSite.coords[0].toFixed(5)}° N, {selectedSite.coords[1].toFixed(5)}° E
            </span>
            <a
              href={`https://www.google.com/maps/@${selectedSite.coords[0]},${selectedSite.coords[1]},18z/data=!3m1!1e3`}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Legend Overlay Card (Bottom Left) */}
        <div className="absolute bottom-6 left-4 z-10 bg-slate-950/95 backdrop-blur border border-slate-800 rounded-xl p-3 shadow-2xl text-[11px] hidden sm:block">
          <div className="text-slate-400 font-bold text-[10px] uppercase mb-1.5 flex items-center justify-between">
            <span>Asset Legend:</span>
            <span className="text-slate-500 font-mono">Zoom: {currentZoom}/20</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
            <span className="flex items-center gap-1.5"><span>💧</span> Borehole Wellhead</span>
            <span className="flex items-center gap-1.5"><span>☀️</span> Solar Array (6.5 kWp)</span>
            <span className="flex items-center gap-1.5"><span>🏢</span> Operator Kiosk (Zinc)</span>
            <span className="flex items-center gap-1.5"><span>🚰</span> Communal Tap Stand</span>
            <span className="flex items-center gap-1.5"><span>🐪</span> Animal Troughs</span>
            <span className="flex items-center gap-1.5 text-emerald-400">--- 1,850m² Perimeter</span>
          </div>
        </div>

      </div>
    </div>
  );
}
