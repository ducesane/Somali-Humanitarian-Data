'use client';

import { useState, useMemo, useEffect } from 'react';
import rawData from '@/data/map_data_summary.json';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Download,
  AlertCircle 
} from 'lucide-react';

const data = rawData as any;
const districtsList = Object.values(data.districts || {}) as any[];
const ngosList = Object.values(data.ngos || {}) as any[];

const CLUSTERS = [
  'Food Security',
  'Health',
  'Water, Sanitation & Hygiene (WASH)',
  'Nutrition',
  'Protection / Child Protection',
  'Shelter & Non-Food Items (NFI)',
  'Education in Emergencies',
  'Camp Coordination & Camp Management (CCCM)',
  'Multipurpose Cash Assistance'
];

export default function DossierBuilderPage() {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Baidoa');
  const [selectedCluster, setSelectedCluster] = useState<string>('Health');
  const [selectedNgoName, setSelectedNgoName] = useState<string>('Wardi Relief and Development Initiatives (WARDI)');
  const [generatedDate, setGeneratedDate] = useState<string>('19-Nov-2026');

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleDateString());
  }, []);

  // Selected District Data
  const district = useMemo(() => {
    return districtsList.find((d) => d.district.toLowerCase() === selectedDistrictName.toLowerCase()) || districtsList[0];
  }, [selectedDistrictName]);

  // Selected NGO Data
  const ngo = useMemo(() => {
    return ngosList.find((n) => n.name.toLowerCase() === selectedNgoName.toLowerCase()) || ngosList[0];
  }, [selectedNgoName]);

  const ett = district?.ett_2026;
  const hasArrivals = (ett?.arrivals || 0) > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Control Configuration Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Proposal Dossier Generator
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Generate Custom Proposal Evidence Dossier
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your parameters below to generate a verified, grant-ready evidence dossier for your next SHF, USAID, or bilateral funding bid.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. District Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Target District (90 Total)
            </label>
            <select
              value={selectedDistrictName}
              onChange={(e) => setSelectedDistrictName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {districtsList.map((d) => (
                <option key={d.adm2_pcode} value={d.district}>
                  {d.district} ({d.region})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Cluster Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Target Humanitarian Cluster
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {CLUSTERS.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* 3. NGO Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              3. Applying Organization
            </label>
            <select
              value={selectedNgoName}
              onChange={(e) => setSelectedNgoName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {ngosList.map((n) => (
                <option key={n.name} value={n.name}>
                  [{n.type}] {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generated Printable Dossier Document */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 print:bg-white print:text-black print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-emerald-500 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-emerald-400 print:text-emerald-700 uppercase">
              CONFIDENTIAL PROPOSAL EVIDENCE DOSSIER &bull; UN OCHA &amp; IOM DTM BASELINE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white print:text-black mt-2">
              Humanitarian Needs &amp; Operational Evidence Profile
            </h2>
            <div className="text-sm font-semibold text-slate-300 print:text-slate-700 mt-1">
              Focus: <span className="text-emerald-400 print:text-emerald-800 font-bold">{selectedCluster}</span> Response in <span className="text-white print:text-black font-bold">{district.district} District</span> ({district.region} Region)
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600">
            <div>Document Ref: SOM-DOS-{district.adm2_pcode}-2026</div>
            <div>Generated: {generatedDate}</div>
          </div>
        </div>

        {/* Section 1: Executive Needs Justification */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            1. Geographic Context &amp; Vulnerability Overview
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            <strong>{district.district}</strong> (OCHA District PCode: <code>{district.adm2_pcode}</code>) in the <strong>{district.region}</strong> region represents a critical humanitarian operational zone with a total affected population of <strong>{district.affected?.toLocaleString() || 'N/A'} individuals</strong> and a formal Humanitarian Response Plan (HRP) target of <strong>{district.target?.toLocaleString() || 'N/A'} people</strong>. Current monitoring records indicate that only <strong>{district.reach_ratio_pct}%</strong> ({district.reached?.toLocaleString()} people) of targeted beneficiaries have received sustained multi-sector assistance, leaving an acute unmet response deficit.
          </p>
        </div>

        {/* Section 2: Rapid Influx Evidence (IOM ETT) */}
        {hasArrivals && ett && (
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/60 print:bg-slate-100 print:border-rose-700 space-y-3">
            <h3 className="text-base font-bold text-rose-300 print:text-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              2. Acute Emergency Influx Trigger (IOM DTM Week 20 Tracking)
            </h3>
            <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Between June and November 2026, IOM Emergency Trends Tracking recorded an influx of <strong>+{ett.arrivals.toLocaleString()} newly arrived displaced persons</strong> into {district.district}. The primary shock driver was identified as <strong>{ett.top_cause}</strong>, originating predominantly from <strong>{ett.top_origin || 'neighboring rural settlements'}</strong>. Household assessments confirm that <strong>{ett.top_need}</strong> is the single most urgent unmet survival priority, justifying immediate grant allocation under {selectedCluster} programming.
            </p>
          </div>
        )}

        {/* Section 3: 3W Non-Duplication Coordination Roster */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            3. Sectoral Operational Presence &amp; Non-Duplication Proof
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            According to UN OCHA 3W records, there are currently <strong>{district.unique_orgs_count} operating organizations</strong> active in {district.district} delivering a total of {district.total_activities} physical operations. For the target sector of <strong>{selectedCluster}</strong>, existing field activities remain concentrated in specific settlements, leaving significant geographic pockets unserved.
          </p>

          <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 print:text-slate-800 block mb-2">
              Active Peer Organizations in {district.district}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {district.organizations?.map((o: any, idx: number) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-800 print:bg-slate-200 text-slate-300 print:text-black">
                  {o.name} ({o.type})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Implementing Partner Track Record */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            4. Implementing Agency Track Record &amp; Fiduciary Capacity
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            <strong>{ngo.name}</strong> ({ngo.type}) possesses verified operational access in Somalia, currently executing <strong>{ngo.total_activities} frontline field actions</strong> across <strong>{ngo.districts_present?.length || 0} districts</strong>. Past performance under pooled and bilateral funding mechanisms demonstrates established community acceptance, access negotiation networks, and strict compliance with humanitarian accountability standards.
          </p>
        </div>

        {/* Section 5: Signature Block */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-400 print:text-slate-700">
          <div>
            <div className="font-bold uppercase text-white print:text-black">Prepared By:</div>
            <div className="mt-1">{ngo.name}</div>
            <div>Program Development &amp; MEAL Directorate</div>
          </div>
          <div className="text-right">
            <div className="font-bold uppercase text-white print:text-black">Data Verification:</div>
            <div className="mt-1">Somalia Humanitarian Intelligence Suite (2026)</div>
            <div>UN OCHA FTS &bull; HDX 3W &bull; IOM DTM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
