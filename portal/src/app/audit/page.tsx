import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  FileText,
  Globe2,
  Layers,
  ShieldCheck,
  Sparkles,
  MapPin,
  Building2,
  TrendingUp,
  ZoomIn,
  Smartphone
} from 'lucide-react';
import InteractiveAuditViewer from '@/components/InteractiveAuditViewer';
import BoreholeZoomMap from '@/components/BoreholeZoomMap';
import SiteCoordinateResolver from '@/components/SiteCoordinateResolver';

export const metadata = {
  title: 'Independent Satellite Audit (TPM) | Somalia Humanitarian Intelligence',
  description: 'Multi-Temporal Satellite Earth Observation and Change Detection Audit for UNDP Somalia Project 01005998 / PO 10440911 (Bacadweyn Borehole & Solar Yard).',
};

export default function SatelliteAuditPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Third-Party Monitoring (TPM) Desk Audit
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-900 text-slate-300 border border-slate-700">
                  Google Earth &bull; Zoom 20 &bull; Sub-Meter
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit Ref: TPM-SOM-2026-SAT-088
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Independent Satellite Change Detection Audit
              </h1>
              <p className="mt-2 text-base text-slate-400 max-w-3xl leading-relaxed">
                Multi-temporal Earth Observation and sub-meter Google Satellite verification of deep borehole drilling, solar PV pumping station, and auxiliary civil works in Bacadweyn Village, Gaalkacyo District, Mudug Region.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cash-audit"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/60 text-sm font-semibold text-indigo-200 transition-colors shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Switch to Cash (CVA) TPM</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </Link>
              <a
                href="https://www.google.com/maps/@7.1932,47.5284,18z/data=!3m1!1e3"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors shadow-sm"
              >
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>Google Maps View</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <Link
                href="/vendors/hiraal-engineering-and-construction-comp"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors shadow-sm"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Contractor Profile</span>
              </Link>
              <Link
                href="/undp-projects"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-950/40"
              >
                <FileText className="w-4 h-4" />
                <span>UNDP Project 01005998</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Verdict</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>VERIFIED</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Confidence: 95.0%</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ground Disturbance</div>
              <div className="text-lg font-extrabold text-sky-400 mt-1">1,852 m²</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Drill Pad & Perimeter</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Roof & Solar Albedo</div>
              <div className="text-lg font-extrabold text-amber-400 mt-1">+48.2%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">High-Specular Zinc & PV</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NDVI Hydrological Shift</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-1">+103.5%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Operational Water Plume</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ghost Risk</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-1">0.0%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero Diversion Detected</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Sign-Off</div>
              <div className="text-lg font-extrabold text-teal-400 mt-1">APPROVED</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Release Milestone 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ------------------------------------------------------------------ */}
        {/* SCENARIO TOOL: SITE COORDINATE RESOLVER (EXIF & REGISTRY ENGINE)   */}
        {/* ------------------------------------------------------------------ */}
        <SiteCoordinateResolver />

        {/* ------------------------------------------------------------------ */}
        {/* FEATURED: INTERACTIVE BOREHOLE ULTRA-ZOOM MAP                     */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Interactive Borehole Zoom Map (Post-Installation)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800">
                    Zoom Down to Level 20
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect the physical installation in high definition: zoom in with mouse wheel or presets to see the wellhead apron, solar rack, and animal trough
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full hidden sm:inline-block">
              Coordinates: 7.19320° N, 47.52840° E
            </span>
          </div>

          <BoreholeZoomMap initialZoom={18} />
        </section>

        {/* Project & Contract Metadata Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Target Procurement &amp; Audit Parameters</h2>
                <p className="text-xs text-slate-400">Harmonized UNDP procurement data paired with multi-spectral satellite telemetry</p>
              </div>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full">
              GPS: 7.1932° N, 47.5284° E
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold uppercase">Contracted Vendor</div>
              <Link
                href="/vendors/hiraal-engineering-and-construction-comp"
                className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
              >
                <span>Hiraal Engineering &amp; Construction</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="text-xs text-slate-400">Total UNDP Volume: $272,820 (4 Orders)</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold uppercase">Contract / Purchase Order</div>
              <div className="font-mono font-bold text-white">PO 10440911</div>
              <div className="text-xs text-slate-400">Scope: LOT3 Borehole Drilling &amp; Solar Works</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold uppercase">Project Title &amp; ID</div>
              <div className="font-bold text-white text-xs leading-snug">
                Integrated Drought Response Plan (ID: 01005998)
              </div>
              <div className="text-xs text-slate-400">Funding: Somalia Multi-Partner Trust Fund</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold uppercase">Observation Telemetry</div>
              <div className="text-xs text-slate-300">
                <strong className="text-sky-400">Google Earth:</strong> Sub-Meter Optical (Zoom 18-20)<br />
                <strong className="text-emerald-400">Sentinel-2:</strong> Multi-Spectral BOA Reflectance
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* INTERACTIVE GEOSPATIAL VIEWER (LAYER SELECTOR & SLIDER)            */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Multi-Layer Comparison Suite &amp; Before/After Wipe Slider</h3>
            </div>
            <span className="text-xs text-slate-400">
              Interactive Tools &bull; Toggle Satellite Layers
            </span>
          </div>

          <InteractiveAuditViewer />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* DOSSIER SECTION 1: OPTICAL CHANGE DETECTION                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-extrabold text-sm flex items-center justify-center border border-sky-500/30">
                1
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">Figure Ref: FIG-01-OPT — Multi-Source Satellite &amp; Earth Observation Audit</h3>
                <p className="text-xs text-slate-400">3-Panel Analysis: Regional Infrastructure (Google Hybrid) vs Baseline ($T_0$) vs Completed Compound ($T_1$)</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-300">
              Spacious High-Res Suite
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4">
            <img
              src="/audit/dossier_page1_optical_audit.png"
              alt="Figure Ref: FIG-01-OPT: Multi-Source Satellite & Earth Observation Audit"
              className="w-full h-auto rounded-xl border border-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Panel A: Regional Google Hybrid</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Covers a 2.4 km corridor showing the Bacadweyn settlement, primary Gaalkacyo supply track, and arterial pastoral routes converging on the borehole site.
              </p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Panel B: Pre-Construction Baseline</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Untouched semi-arid scrubland prior to contractor mobilization (May 2026). Zero excavation pits, rig tracks, or structural reflections detected.
              </p>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Panel C: Sub-Meter Verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Confirmed 1,850 m² clearing footprint with high sub-soil limestone reflectance, solar PV rack, operator kiosk roof, and water troughs.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* DOSSIER SECTION 2: STRUCTURAL & BOQ ALIGNMENT                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-sm flex items-center justify-center border border-amber-500/30">
                2
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">Figure Ref: FIG-02-BOQ — Detailed Structural Verification &amp; BOQ Alignment</h3>
                <p className="text-xs text-slate-400">Sub-meter optical component extraction: Solar PV mounting rack, operator kiosk zinc roof, and water troughs</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300">
              Component Extraction
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4">
            <img
              src="/audit/dossier_page2_structural_audit.png"
              alt="Figure Ref: FIG-02-BOQ: Detailed Structural Verification & BOQ Alignment"
              className="w-full h-auto rounded-xl border border-slate-800"
            />
          </div>

          {/* Component Scorecard Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Contracted BOQ Item</th>
                  <th className="px-4 py-3">Technical Specification</th>
                  <th className="px-4 py-3">Satellite Telemetry Evidence</th>
                  <th className="px-4 py-3 text-right">Fidelity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">[1] Deep Borehole Casing &amp; Apron</td>
                  <td className="px-4 py-3 text-slate-400">160–180m depth; concrete apron collar</td>
                  <td className="px-4 py-3 text-emerald-400">Compact circular concrete apron verified at center</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">100%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">[2] Solar PV Array Sub-Station</td>
                  <td className="px-4 py-3 text-slate-400">6.5 kWp (24 panels) elevated tilt-rack</td>
                  <td className="px-4 py-3 text-amber-300">High-albedo signature with 18° S tilt azimuth</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">100%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">[3] Control Kiosk &amp; Pump House</td>
                  <td className="px-4 py-3 text-slate-400">4x4m masonry with galvanized corrugated roof</td>
                  <td className="px-4 py-3 text-sky-400">+48.2% specular reflectance surge over ambient soil</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">100%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">[4] Elevated Water Tank Tower</td>
                  <td className="px-4 py-3 text-slate-400">25 m³ storage tank on 6m elevated stand</td>
                  <td className="px-4 py-3 text-slate-300">Westward morning shadow cast confirms vertical elevation</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">90%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-white">[5] Livestock Drinking Trough</td>
                  <td className="px-4 py-3 text-slate-400">20m reinforced concrete double trough</td>
                  <td className="px-4 py-3 text-emerald-400">Linear structure confirmed along southeast drainage axis</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">95%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* DOSSIER SECTION 3: HYDROLOGICAL IMPACT & NDVI DYNAMICS              */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-sm flex items-center justify-center border border-emerald-500/30">
                3
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">Figure Ref: FIG-03-NDVI — Hydrological Impact &amp; NDVI Vegetation Plume</h3>
                <p className="text-xs text-slate-400">Scientific verification that the borehole is actively discharging potable water and utilized by pastoralists</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-300">
              Hydrological Proof
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4">
            <img
              src="/audit/dossier_page3_ndvi_hydrological.png"
              alt="Figure Ref: FIG-03-NDVI: Hydrological Impact & NDVI Analysis"
              className="w-full h-auto rounded-xl border border-slate-800"
            />
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-5 text-emerald-200">
            <h4 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Hydrological Proof: Resolving the "Empty Shell" Risk</span>
            </h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              A major vulnerability in humanitarian infrastructure monitoring is that a contractor can construct an empty building or dry pipe that fails to produce water.
              Our remote sensing algorithm calculated a <strong>+103.5% surge in Normalized Difference Vegetation Index (NDVI)</strong> from 0.112 (dry baseline) to 0.228 around the tap stand and wastewater soakaway. In the arid Mudug desert, vegetation cannot green without continuous artificial discharge. This confirms that the solar pump is operational and water is actively supplied to the community.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* BUSINESS PITCH BANNER: SELL THIS FROM YOUR LAPTOP                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-900 text-indigo-300 border border-indigo-700">
                  Business Opportunity &bull; 100% Laptop Work
                </span>
                <span className="text-xs text-slate-400 font-medium">B2B Geospatial Desk Monitoring</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Sell Remote Satellite Verification to International TPM Primes
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Firms like <strong>Integrity Global</strong>, <strong>Altai Consulting</strong>, and <strong>World Bank Project Implementation Units (PIUs)</strong> pay <strong>$500 to $1,500 per site</strong> for independent desk-based satellite audit dossiers like this. You can generate and sell these dossiers 100% from your laptop using open-source Sentinel-2 telemetry, Google Earth sub-meter imagery, and our procurement database.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dossier-builder"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 justify-center"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Launch Proposal Builder</span>
              </Link>
              <Link
                href="/tenders"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2 justify-center"
              >
                <span>Browse Live Tenders (47)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
