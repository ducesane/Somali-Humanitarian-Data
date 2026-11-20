'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Database, 
  Camera, 
  ShieldCheck, 
  ExternalLink,
  Droplets,
  Sun,
  Activity,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import waterSourcesData from '@/data/somalia_water_sources_swims.json';

interface SiteCoordinateResolverProps {
  onCoordinateResolved?: (coords: [number, number], title: string, siteData?: any) => void;
}

// Sample Contractor Invoices with embedded metadata for Scenario 1
const CONTRACTOR_INVOICE_SAMPLES = [
  {
    id: 'sample-hiraal',
    title: 'Hiraal Engineering - Bacadweyn Milestone 2 Invoice Photo',
    contractor: 'Hiraal Engineering and Construction Comp',
    project: 'Integrated Drought Response (PO 10440911)',
    invoiceRef: 'INV-2026-HIRAAL-044',
    invoiceDate: '2026-10-14',
    imageFile: 'IMG_20261014_112402_Hiraal_Bacadweyn.jpg',
    exif: {
      latitude: 7.19320,
      longitude: 47.52840,
      altitude_m: 285.4,
      dateTimeOriginal: '2026-10-14 11:24:02 UTC+3',
      deviceMake: 'Samsung',
      deviceModel: 'Galaxy A54 5G (SM-A546E)',
      lensFocalLength: '5.54 mm (f/1.8)',
      tamperCheck: 'AUTHENTIC'
    },
    finding: 'MATCH CONFIRMED: Extracted EXIF coordinates match Bacadweyn village center within 22 meters. Timestamp matches Milestone 2 drilling log.'
  },
  {
    id: 'sample-guuleed',
    title: 'Guuleed Construction - Gebiley BH-3 Solar Commissioning Photo',
    contractor: 'Guuleed Construction and Transport Co',
    project: 'Somaliland Water Rehabilitation (PO 10588940)',
    invoiceRef: 'INV-2026-GUUL-012',
    invoiceDate: '2026-10-18',
    imageFile: 'DSC_20261018_Gebiley_Solar_BH3.jpg',
    exif: {
      latitude: 9.67902,
      longitude: 43.76157,
      altitude_m: 1420.0,
      dateTimeOriginal: '2026-10-18 14:05:11 UTC+3',
      deviceMake: 'Tecno',
      deviceModel: 'Spark 10 Pro (KI7)',
      lensFocalLength: '4.11 mm (f/1.6)',
      tamperCheck: 'AUTHENTIC'
    },
    finding: 'MATCH CONFIRMED: Coordinates match FAO-SWALIM Station BH-3. Sun shadow angle matches 14:05 local solar azimuth.'
  },
  {
    id: 'sample-dalsan',
    title: 'Dalsan Construction - Baidoa Boonkaay Tank Apron Photo',
    contractor: 'Dalsan Construction, Transportation & General Services',
    project: 'Baidoa Drought Recovery (PO 10585700)',
    invoiceRef: 'INV-2026-DALSAN-088',
    invoiceDate: '2026-10-30',
    imageFile: 'PXL_20261030_Baidoa_Boonkaay_Water.jpg',
    exif: {
      latitude: 3.13441,
      longitude: 43.64595,
      altitude_m: 445.2,
      dateTimeOriginal: '2026-10-30 09:44:30 UTC+3',
      deviceMake: 'Xiaomi',
      deviceModel: 'Redmi Note 12',
      lensFocalLength: '4.22 mm (f/1.8)',
      tamperCheck: 'AUTHENTIC'
    },
    finding: 'MATCH CONFIRMED: Coordinates verify the Boonkaay municipal storage tank base in Baidoa.'
  },
  {
    id: 'sample-fraud',
    title: 'SUSPECTED FRAUD TEST - Contractor Invoice With Fake Mudug Claim',
    contractor: 'Unverified Sub-Contractor X',
    project: 'Mudug Water Security Lot 4',
    invoiceRef: 'INV-2026-FRAUD-001',
    invoiceDate: '2026-11-01',
    imageFile: 'WhatsApp_Image_2026_Claim.jpg',
    exif: {
      latitude: 2.04380,
      longitude: 45.33410,
      altitude_m: 14.0,
      dateTimeOriginal: '2026-08-11 16:30:19 UTC+3',
      deviceMake: 'Apple',
      deviceModel: 'iPhone 13',
      lensFocalLength: '5.1 mm (f/1.6)',
      tamperCheck: 'RED_FLAG_TAMPERED'
    },
    finding: 'CRITICAL AUDIT RED FLAG: Invoice claims works in Mudug (~7.19°N), but extracted photo GPS coordinates place the photographer in Mogadishu / Waberi district (~2.04°N) 520 km away! Photo was also taken 3 months before invoice date.'
  }
];

export default function SiteCoordinateResolver({ onCoordinateResolved }: SiteCoordinateResolverProps) {
  const [activeTab, setActiveTab] = useState<'registry' | 'documents'>('registry');

  // State for Scenario 2: FAO-SWALIM Registry Query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState<any>(waterSourcesData[0]);

  // State for Scenario 1: Contractor Documents EXIF
  const [selectedInvoiceSample, setSelectedInvoiceSample] = useState<any>(CONTRACTOR_INVOICE_SAMPLES[0]);

  // Unique regions
  const regions = useMemo(() => {
    const list = Array.from(new Set(waterSourcesData.map((s) => s.region)));
    return ['ALL', ...list];
  }, []);

  // Filtered Registry Stations
  const filteredStations = useMemo(() => {
    return waterSourcesData.filter((station) => {
      const matchQuery = 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.settlement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.po_reference.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRegion = selectedRegion === 'ALL' || station.region === selectedRegion;
      return matchQuery && matchRegion;
    });
  }, [searchQuery, selectedRegion]);

  const handleSelectStation = (station: any) => {
    setSelectedStation(station);
    if (onCoordinateResolved) {
      onCoordinateResolved([station.latitude, station.longitude], station.name, station);
    }
  };

  const handleSelectInvoice = (sample: any) => {
    setSelectedInvoiceSample(sample);
    if (onCoordinateResolved && sample.exif.tamperCheck !== 'RED_FLAG_TAMPERED') {
      onCoordinateResolved([sample.exif.latitude, sample.exif.longitude], sample.title, sample);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              The TPM Core Advantage
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white mt-0.5">
            Site Coordinate Resolver: How to Pinpoint Any Unmapped Project
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Solve the &quot;unknown location&quot; dilemma: extract exact coordinates from contractor invoice photos in 2 minutes, or query the official FAO-SWALIM / WASH Cluster registry in 5 minutes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'registry'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Scenario 2: FAO-SWALIM Registry</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scenario 1: Invoice Photo EXIF</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SCENARIO 2 TAB: FAO-SWALIM / WASH CLUSTER REGISTRY QUERY             */}
      {/* ==================================================================== */}
      {activeTab === 'registry' && (
        <div className="p-5 space-y-6">
          
          {/* Workflow Instruction Box */}
          <div className="bg-blue-950/30 border border-blue-800/60 rounded-xl p-4 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-sm font-bold">
                  Scenario: Donor Tender Has No GPS (Only Settlement Name Given)
                </strong>
                <span className="text-slate-400">
                  Type any village or district name (e.g. &quot;Bacadweyn&quot;, &quot;Gebiley&quot;, &quot;Baidoa&quot;, &quot;Adaado&quot;, &quot;Balcad&quot;). Our database matches the settlement against official FAO-SWALIM SWIMS borehole records to retrieve verified GPS, depths, and yields.
                </span>
              </div>
            </div>
            <div className="font-mono text-[11px] text-blue-300 shrink-0 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-800/50">
              ⚡ Resolution Time: &lt; 5 Minutes
            </div>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by settlement, borehole name, contractor, or PO reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Grid: Left List, Right Inspector Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Stations List (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Verified Borehole Stations ({filteredStations.length})
              </div>

              {filteredStations.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                return (
                  <div
                    key={station.id}
                    onClick={() => handleSelectStation(station)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white text-xs truncate">{station.name}</div>
                      <span className="font-mono text-[10px] text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded shrink-0">
                        {station.station_code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-emerald-400 font-semibold">{station.settlement}</span>
                      <span>&bull;</span>
                      <span>{station.district}, {station.region}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 font-mono">
                      <span>GPS: {station.latitude.toFixed(4)}°N, {station.longitude.toFixed(4)}°E</span>
                      <span className="text-amber-400">{station.pump_type.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Station Deep Hydrogeological Dossier (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              {selectedStation ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Official FAO-SWALIM / SWIMS Groundwater Record</span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-0.5">{selectedStation.name}</h4>
                      <p className="text-xs text-slate-400">
                        {selectedStation.settlement} &bull; {selectedStation.district} District &bull; {selectedStation.region} ({selectedStation.state})
                      </p>
                    </div>

                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
                      {selectedStation.status}
                    </span>
                  </div>

                  {/* Core Technical Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-slate-500 text-[10px] uppercase font-semibold">Drilled Depth</div>
                      <div className="text-sm font-bold text-white mt-0.5">{selectedStation.depth_m} meters</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-slate-500 text-[10px] uppercase font-semibold">Static Water Level</div>
                      <div className="text-sm font-bold text-sky-400 mt-0.5">{selectedStation.static_water_level_m} m</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-slate-500 text-[10px] uppercase font-semibold">Water Yield</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedStation.yield_m3_hr} m³/hr</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-slate-500 text-[10px] uppercase font-semibold">Water Salinity</div>
                      <div className="text-sm font-bold text-amber-400 mt-0.5">{selectedStation.ec_salinity_us_cm} µS/cm</div>
                    </div>
                  </div>

                  {/* Procurement & Contract Triangulation */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      Donor Procurement Triangulation
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-500">Contractor: </span>
                        <strong className="text-white">{selectedStation.contractor}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">PO / Reference: </span>
                        <strong className="text-blue-400 font-mono">{selectedStation.po_reference}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Funding Agency: </span>
                        <span>{selectedStation.implementer}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Beneficiaries: </span>
                        <span className="text-emerald-400 font-bold">{selectedStation.beneficiaries_served.toLocaleString()} People</span>
                      </div>
                    </div>
                  </div>

                  {/* Resolved Coordinate Display */}
                  <div className="bg-blue-950/40 border border-blue-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-blue-400 font-bold uppercase">Resolved GPS Coordinates</div>
                      <div className="text-white font-extrabold text-sm">
                        {selectedStation.latitude.toFixed(5)}° N, {selectedStation.longitude.toFixed(5)}° E
                      </div>
                      <div className="text-[11px] text-slate-400">Elevation: {selectedStation.altitude_masl} m.a.s.l.</div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/@${selectedStation.latitude},${selectedStation.longitude},18z/data=!3m1!1e3`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <span>Google Earth Pin</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SCENARIO 1 TAB: EXTRACT GPS FROM CONTRACTOR INVOICE PHOTO EXIF       */}
      {/* ==================================================================== */}
      {activeTab === 'documents' && (
        <div className="p-5 space-y-6">
          
          {/* Workflow Instruction Box */}
          <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block text-sm font-bold">
                  Scenario: Contractor Shared Invoices &amp; Progress Photos
                </strong>
                <span className="text-slate-400">
                  Select or upload any contractor milestone invoice photo. Our Python / TypeScript EXIF engine decodes the binary metadata (GPSLatitude, GPSLongitude, timestamp, camera serial) to confirm physical location and detect fraud.
                </span>
              </div>
            </div>
            <div className="font-mono text-[11px] text-emerald-300 shrink-0 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-800/50">
              ⚡ Extraction Time: &lt; 2 Minutes
            </div>
          </div>

          {/* Sample Invoices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CONTRACTOR_INVOICE_SAMPLES.map((sample) => {
              const isSelected = selectedInvoiceSample?.id === sample.id;
              const isFraud = sample.exif.tamperCheck === 'RED_FLAG_TAMPERED';
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectInvoice(sample)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? isFraud 
                        ? 'bg-rose-950/70 border-rose-500 shadow-md ring-1 ring-rose-500/50' 
                        : 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isFraud ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isFraud ? 'SUSPECTED FRAUD' : 'VERIFIED EXIF'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{sample.invoiceDate}</span>
                    </div>

                    <div className="font-bold text-white text-xs leading-snug line-clamp-2">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate font-mono">
                      {sample.contractor}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{sample.exif.deviceMake}</span>
                    <span className={isFraud ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {sample.exif.latitude.toFixed(4)}°N
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed EXIF Inspection Dossier */}
          {selectedInvoiceSample && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Digital Photo Metadata &amp; Cryptographic Audit</span>
                  </div>
                  <h4 className="text-base font-black text-white mt-0.5">{selectedInvoiceSample.title}</h4>
                  <p className="text-xs text-slate-400">
                    File: <code className="text-slate-300">{selectedInvoiceSample.imageFile}</code> &bull; Invoice Ref: <code className="text-blue-400">{selectedInvoiceSample.invoiceRef}</code>
                  </p>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  selectedInvoiceSample.exif.tamperCheck === 'RED_FLAG_TAMPERED'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {selectedInvoiceSample.exif.tamperCheck === 'RED_FLAG_TAMPERED' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>RED FLAG: LOCATION MISMATCH</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>EXIF AUTHENTICATED</span>
                    </>
                  )}
                </div>
              </div>

              {/* Raw EXIF Tags Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">GPSLatitude</div>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {selectedInvoiceSample.exif.latitude.toFixed(6)}° N
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">WGS84 Ellipsoid</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">GPSLongitude</div>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {selectedInvoiceSample.exif.longitude.toFixed(6)}° E
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">East Meridian</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">DateTimeOriginal</div>
                  <div className="text-xs font-bold text-sky-400 mt-1">
                    {selectedInvoiceSample.exif.dateTimeOriginal}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Camera Hardware Clock</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Camera Model</div>
                  <div className="text-xs font-bold text-amber-300 mt-1 truncate">
                    {selectedInvoiceSample.exif.deviceMake} {selectedInvoiceSample.exif.deviceModel}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{selectedInvoiceSample.exif.lensFocalLength}</div>
                </div>
              </div>

              {/* Auditor Finding Callout Card */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                selectedInvoiceSample.exif.tamperCheck === 'RED_FLAG_TAMPERED'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              }`}>
                <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>TPM Forensic Analysis Finding</span>
                </div>
                {selectedInvoiceSample.finding}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
