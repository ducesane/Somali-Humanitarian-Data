'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Search, 
  Filter, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Users, 
  Sparkles, 
  Coins, 
  Activity, 
  Network, 
  Smartphone, 
  ArrowUpRight, 
  Globe,
  PieChart,
  BadgeDollarSign
} from 'lucide-react';
import { NGOData } from '@/types';

interface NgosDirectoryClientProps {
  initialNgos: NGOData[];
}

function NgosDirectoryContent({ initialNgos }: NgosDirectoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL query params
  const initialType = searchParams.get('type') || 'NNGO'; // Default to NNGO as requested!
  const initialNgoParam = searchParams.get('ngo') || '';
  const initialDistrictParam = searchParams.get('district') || '';

  // State
  const [selectedType, setSelectedType] = useState<string>(initialType.toUpperCase());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [fundingFilter, setFundingFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'activities' | 'funding' | 'districts' | 'name'>('activities');
  
  // Selected NGO for deep audit inspection drawer/modal
  const [selectedNgo, setSelectedNgo] = useState<NGOData | null>(null);
  const [activeTab, setActiveTab] = useState<'funding' | 'activities'>('funding');

  // Sync with initial URL params if present
  useEffect(() => {
    if (initialNgoParam) {
      const match = initialNgos.find(
        (n) => n.name.toLowerCase() === initialNgoParam.toLowerCase() ||
               n.name.toLowerCase().includes(initialNgoParam.toLowerCase())
      );
      if (match) {
        setSelectedNgo(match);
      }
    }
  }, [initialNgoParam, initialNgos]);

  // All NNGOs list for quick selector
  const allNngos = useMemo(() => {
    return initialNgos
      .filter((n) => n.type === 'NNGO')
      .sort((a, b) => (b.total_activities || 0) - (a.total_activities || 0));
  }, [initialNgos]);

  // Unique regions
  const allRegions = useMemo(() => {
    const s = new Set<string>();
    initialNgos.forEach((n) => (n.regions || []).forEach((r) => s.add(r)));
    return Array.from(s).sort();
  }, [initialNgos]);

  // Unique clusters
  const allClusters = useMemo(() => {
    const s = new Set<string>();
    initialNgos.forEach((n) => (n.clusters || []).forEach((c) => s.add(c)));
    return Array.from(s).sort();
  }, [initialNgos]);

  // Executive counts
  const nngoList = useMemo(() => initialNgos.filter((n) => n.type === 'NNGO'), [initialNgos]);
  const ingoList = useMemo(() => initialNgos.filter((n) => n.type === 'INGO'), [initialNgos]);
  const unList = useMemo(() => initialNgos.filter((n) => n.type === 'UN'), [initialNgos]);

  const totalNngoActivities = useMemo(() => {
    return nngoList.reduce((acc, n) => acc + (n.total_activities || 0), 0);
  }, [nngoList]);

  const totalShfNngoFunding = useMemo(() => {
    return nngoList.reduce((acc, n) => acc + (n.total_tracked_funding_usd || n.shf_budget || 0), 0);
  }, [nngoList]);

  const directlyFundedNngosCount = useMemo(() => {
    return nngoList.filter((n) => (n.total_tracked_funding_usd || n.shf_budget || 0) > 0).length;
  }, [nngoList]);

  // Filtered & sorted NGOs
  const filteredNgos = useMemo(() => {
    return initialNgos.filter((ngo) => {
      // Type filter
      if (selectedType !== 'ALL' && ngo.type !== selectedType) {
        return false;
      }

      // Search query (name, acronym, districts, regions)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = ngo.name.toLowerCase().includes(q);
        const matchesAcronym = (ngo.acronym || '').toLowerCase().includes(q);
        const matchesDistricts = (ngo.districts || []).some((d) => d.toLowerCase().includes(q));
        const matchesRegions = (ngo.regions || []).some((r) => r.toLowerCase().includes(q));
        const matchesClusters = (ngo.clusters || []).some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesAcronym && !matchesDistricts && !matchesRegions && !matchesClusters) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion !== 'ALL' && !(ngo.regions || []).includes(selectedRegion)) {
        return false;
      }

      // Cluster filter
      if (selectedCluster !== 'ALL' && !(ngo.clusters || []).includes(selectedCluster)) {
        return false;
      }

      // Funding status filter
      if (fundingFilter === 'DIRECT') {
        const amt = ngo.total_tracked_funding_usd || ngo.shf_budget || 0;
        if (amt <= 0) return false;
      } else if (fundingFilter === 'IP') {
        const amt = ngo.total_tracked_funding_usd || ngo.shf_budget || 0;
        if (amt > 0) return false;
      } else if (fundingFilter === 'CVA') {
        if (!ngo.cwg_cva_active) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'activities') {
        return (b.total_activities || 0) - (a.total_activities || 0);
      }
      if (sortBy === 'funding') {
        const amtA = a.total_tracked_funding_usd || a.shf_budget || 0;
        const amtB = b.total_tracked_funding_usd || b.shf_budget || 0;
        return amtB - amtA;
      }
      if (sortBy === 'districts') {
        return (b.districts?.length || 0) - (a.districts?.length || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [initialNgos, selectedType, searchQuery, selectedRegion, selectedCluster, fundingFilter, sortBy]);

  // Handler for quick selector
  const handleSelectNgoByName = (name: string) => {
    if (!name) return;
    const found = initialNgos.find((n) => n.name === name);
    if (found) {
      setSelectedNgo(found);
      setActiveTab('funding');
      // Also scroll to view or open modal
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Localization Architecture Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-black tracking-wide">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Somalia Localization & Operational Partner Intelligence (2026)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            UN OCHA 3W Verified Operational Presence
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Somalia National NGOs & Humanitarian Partners
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Track where Somali National NGOs (NNGOs) execute frontline actions across all 90 districts, 
              verify direct <strong className="text-emerald-400">Somalia Humanitarian Fund (SHF)</strong> pooled allocations, 
              and audit the <strong className="text-teal-300">Downstream Sub-Grant</strong> mechanisms that fund frontline operations.
            </p>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Somali National NGOs</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {nngoList.length}
            </div>
            <p className="text-[11px] text-slate-400">
              Executing <strong className="text-emerald-300">{totalNngoActivities.toLocaleString()}</strong> 3W actions (40.8% of all aid)
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-800/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-teal-400">
              <span>SHF Pooled Localization</span>
              <Coins className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              ${(totalShfNngoFunding / 1000000).toFixed(1)}M
            </div>
            <p className="text-[11px] text-slate-400">
              <strong className="text-teal-300">84.6%</strong> of OCHA SHF allocated directly to NNGOs
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-800/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <span>Direct Primary Grantees</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {directlyFundedNngosCount}
            </div>
            <p className="text-[11px] text-slate-400">
              Direct primary awards via SHF, KSrelief, or UNDP
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Downstream Sub-Grantees</span>
              <Network className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {nngoList.length - directlyFundedNngosCount}
            </div>
            <p className="text-[11px] text-slate-400">
              Funded via UN Field Agreements & INGO consortia
            </p>
          </div>
        </div>
      </div>

      {/* PROMINENT NNGO SELECTOR SECTION (Requested by User) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-600/70 shadow-2xl shadow-emerald-950/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Select a Somali National NGO (NNGO)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Quick Selector
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Choose any National NGO to immediately inspect their <strong>activities by district</strong>, 
              verified <strong>funds received</strong>, and the <strong>channels/mechanisms</strong> through which they get funded.
            </p>
          </div>

          {selectedNgo && (
            <button
              onClick={() => setSelectedNgo(null)}
              className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-1.5 self-start md:self-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Selection
            </button>
          )}
        </div>

        {/* Dropdown Combobox */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <select
              value={selectedNgo ? selectedNgo.name : ''}
              onChange={(e) => handleSelectNgoByName(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-slate-950 border-2 border-emerald-700/80 hover:border-emerald-500 focus:border-emerald-400 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-inner appearance-none"
            >
              <option value="" disabled>
                -- Choose a Somali National NGO (156 organizations available) --
              </option>
              {allNngos.map((ngo) => {
                const amt = ngo.total_tracked_funding_usd || ngo.shf_budget || 0;
                const fundingTag = amt > 0 
                  ? `[Funded: $${(amt / 1000).toFixed(0)}k]` 
                  : `[Downstream Sub-Grant IP]`;
                return (
                  <option key={ngo.name} value={ngo.name} className="bg-slate-950 text-white py-1">
                    {ngo.name} {fundingTag} — {ngo.districts?.length || 0} Districts ({ngo.total_activities} actions)
                  </option>
                );
              })}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedNgo ? (
              <button
                onClick={() => {
                  // Already selected, ensure tab is set
                  setActiveTab('funding');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
              >
                <span>Inspecting: {selectedNgo.acronym || selectedNgo.name.slice(0, 15)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs font-medium flex items-center justify-center text-center">
                Select an organization above to view their activity map & funding flow
              </div>
            )}
          </div>
        </div>

        {/* Quick Selected Highlight Summary (if an NGO is chosen) */}
        {selectedNgo && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-emerald-500 text-slate-950">
                    {selectedNgo.type}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {selectedNgo.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  {selectedNgo.funding_tier || 'Frontline Humanitarian Operational Partner'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('funding')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'funding'
                      ? 'bg-emerald-600 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  How They Get Funds
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'activities'
                      ? 'bg-emerald-600 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Where They Do Activities ({selectedNgo.districts?.length || 0})
                </button>
                <Link
                  href={`/dossier-builder?ngo=${encodeURIComponent(selectedNgo.name)}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-teal-900/60 border border-slate-700 hover:border-teal-600 text-teal-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Build Evidence Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* TAB CONTENT: FUNDING MECHANISMS */}
            {activeTab === 'funding' && (
              <div className="space-y-4 pt-2 border-t border-emerald-900/60">
                {/* Funding Status Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Tracked Funding
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {(selectedNgo.total_tracked_funding_usd || selectedNgo.shf_budget || 0) > 0
                        ? `$${(selectedNgo.total_tracked_funding_usd || selectedNgo.shf_budget || 0).toLocaleString()}`
                        : '$0 Direct Primary Grants'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {(selectedNgo.total_tracked_funding_usd || selectedNgo.shf_budget || 0) > 0
                        ? 'Verified from SHF Pooled Funds / FTS'
                        : 'Funded via Downstream Sub-Grants / FLAs'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Funding Status
                    </span>
                    <span className="text-base sm:text-lg font-black text-white block mt-0.5">
                      {selectedNgo.funding_status || 'Downstream Implementing Partner'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedNgo.cwg_cva_active ? 'Active CWG Mobile Money Delivery' : 'Field Cluster Execution'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Frontline Field Delivery
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-teal-300">
                      {selectedNgo.total_activities} Actions
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Across {selectedNgo.districts?.length || 0} districts in {selectedNgo.regions?.length || 0} regions
                    </span>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Funding & Operational Narrative</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedNgo.funding_narrative || 
                     `${selectedNgo.name} operates as a frontline implementing partner in Somalia, executing ${selectedNgo.total_activities} verified actions across ${selectedNgo.districts?.length || 0} districts under UN cluster coordination and field-level agreements.`}
                  </p>
                </div>

                {/* Verified SHF Projects (If any) */}
                {selectedNgo.shf_projects && selectedNgo.shf_projects.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Verified Somalia Humanitarian Fund (SHF) Allocations ({selectedNgo.shf_projects.length})
                      </span>
                      <span className="font-mono text-white">
                        Total: ${(selectedNgo.shf_projects.reduce((acc, p) => acc + p.budget, 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedNgo.shf_projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/80 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                              {proj.project_title}
                            </h4>
                            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-700 self-start sm:self-auto shrink-0">
                              ${proj.budget.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                            <span>Fund: <strong className="text-slate-300">{proj.fund_source}</strong></span>
                            <span>Status: <strong className="text-emerald-400">{proj.status}</strong></span>
                            {proj.target_beneficiaries?.total > 0 && (
                              <span>Target: <strong className="text-teal-300">{proj.target_beneficiaries.total.toLocaleString()} people</strong> ({proj.target_beneficiaries.women.toLocaleString()} women, {proj.target_beneficiaries.girls.toLocaleString()} girls)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct FTS Bilateral Grants (If any) */}
                {selectedNgo.fts_grants && selectedNgo.fts_grants.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Direct Bilateral Donor Grants (FTS Tracked)
                    </span>
                    <div className="space-y-2">
                      {selectedNgo.fts_grants.map((grant, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-blue-800/80 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white">
                              {grant.source_donor}
                            </span>
                            <span className="text-xs font-mono font-bold text-blue-300">
                              ${grant.amount_usd.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{grant.description}</p>
                          <span className="text-[11px] text-slate-400">Sector: <strong>{grant.sector}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Funding Channels & Architecture Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    How {selectedNgo.acronym || selectedNgo.name} Secures Funds (Modality & Channels)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {(selectedNgo.funding_mechanisms || []).map((mech, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {mech.is_verified ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Network className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            {mech.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mech.is_verified 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {mech.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {mech.details}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 pt-0.5 truncate">
                          Path: {mech.channel_path}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: WHERE THEY DO ACTIVITIES */}
            {activeTab === 'activities' && (
              <div className="space-y-4 pt-2 border-t border-emerald-900/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      Operational Footprint across {selectedNgo.districts?.length || 0} Districts in {selectedNgo.regions?.length || 0} Regions
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Click any district below to view that district's humanitarian needs, gap analysis, and satellite data.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 self-start sm:self-auto">
                    {selectedNgo.total_activities} Total Field Actions
                  </span>
                </div>

                {/* District Badges Cloud */}
                <div className="flex flex-wrap gap-2">
                  {(selectedNgo.districts || []).map((district) => {
                    const slug = district.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link
                        key={district}
                        href={`/districts/${slug}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-600 text-xs font-bold text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-1.5 group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                        <span>{district}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>

                {/* Regions and Clusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Clusters / Sectors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedNgo.clusters || []).map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-teal-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Regions Covered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedNgo.regions || []).map((r) => (
                        <span key={r} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed District Actions Matrix (if available) */}
                {selectedNgo.district_details && selectedNgo.district_details.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Frontline Operational Actions Breakdown ({selectedNgo.district_details.length} Cluster Deployments)
                    </span>
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                      {selectedNgo.district_details.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950/80 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.district}</span>
                            <span className="text-[11px] text-slate-500">({item.region})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-teal-300 border border-slate-800">
                              {item.cluster}
                            </span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {item.actions} actions
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FILTER CONTROLS & DIRECTORY SEARCH */}
      <div className="space-y-4 pt-4">
        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedType === 'ALL'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Partners ({initialNgos.length})
            </button>

            <button
              onClick={() => setSelectedType('NNGO')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                selectedType === 'NNGO'
                  ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-900/30'
                  : 'bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-800/70'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>★ Somali National NGOs ({nngoList.length})</span>
            </button>

            <button
              onClick={() => setSelectedType('INGO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedType === 'INGO'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-blue-400 hover:bg-blue-950/60 border border-blue-900/70'
              }`}
            >
              International NGOs ({ingoList.length})
            </button>

            <button
              onClick={() => setSelectedType('UN')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedType === 'UN'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-purple-400 hover:bg-purple-950/60 border border-purple-900/70'
              }`}
            >
              UN Agencies ({unList.length})
            </button>
          </div>

          <div className="text-xs font-bold text-slate-400">
            Showing <strong className="text-white">{filteredNgos.length}</strong> matching organizations
          </div>
        </div>

        {/* Detailed Filter Inputs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, acronym, district, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Regions ({allRegions.length})</option>
              {allRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Cluster filter */}
          <div>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Clusters / Sectors</option>
              {allClusters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Funding Status filter */}
          <div>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Funding Statuses</option>
              <option value="DIRECT">🟢 Direct Grantees (SHF / FTS)</option>
              <option value="IP">🔵 Downstream Sub-Grantees (IPs)</option>
              <option value="CVA">🟣 CWG Cash Partners</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Sort organizations by:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'activities', label: 'Most Frontline Actions' },
              { id: 'funding', label: 'Highest Tracked Funding ($)' },
              { id: 'districts', label: 'Most Districts Covered' },
              { id: 'name', label: 'Alphabetical (A-Z)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sortBy === s.id
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ORGANIZATIONS DIRECTORY GRID */}
      {filteredNgos.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No organizations match your filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, region, cluster, or funding filters to see more organizations.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('ALL');
              setSelectedCluster('ALL');
              setFundingFilter('ALL');
              setSelectedType('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNgos.map((ngo) => {
            const isSelected = selectedNgo?.name === ngo.name;
            const trackedFunding = ngo.total_tracked_funding_usd || ngo.shf_budget || 0;
            const hasDirectFunding = trackedFunding > 0;
            const districtsList = ngo.districts || [];
            const displayDistricts = districtsList.slice(0, 4);
            const extraDistrictsCount = districtsList.length - displayDistricts.length;

            return (
              <div
                key={ngo.name}
                className={`p-5 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/50'
                    : 'border-slate-800 hover:border-emerald-700/70 hover:shadow-lg hover:shadow-slate-950/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header: Type Badge & Funding Badge */}
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-black ${
                        ngo.type === 'NNGO'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ngo.type === 'INGO'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-purple-950 text-purple-400 border border-purple-800'
                      }`}
                    >
                      {ngo.type}
                    </span>

                    {/* Funding Status Badge */}
                    {hasDirectFunding ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>${(trackedFunding / 1000).toFixed(0)}k Tracked</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <Network className="w-3 h-3 text-slate-500" />
                        <span>Downstream IP</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Acronym */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {ngo.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span className="text-emerald-400">{ngo.total_activities} frontline actions</span>
                      <span>•</span>
                      <span>{districtsList.length} districts</span>
                    </div>
                  </div>

                  {/* WHERE THEY DO ACTIVITIES */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-300">
                            Districts Active ({districtsList.length}):
                          </span>
                          <span className="text-slate-500 font-mono">
                            {(ngo.regions || []).length} regions
                          </span>
                        </div>
                        {/* District Pills */}
                        <div className="flex flex-wrap gap-1">
                          {displayDistricts.map((d) => (
                            <Link
                              key={d}
                              href={`/districts/${d.toLowerCase().replace(/\s+/g, '-')}`}
                              className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 hover:border-emerald-600 text-[11px] font-medium text-slate-300 hover:text-emerald-300 transition-colors"
                            >
                              {d}
                            </Link>
                          ))}
                          {extraDistrictsCount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedNgo(ngo);
                                setActiveTab('activities');
                              }}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-bold text-emerald-400 hover:bg-slate-800 transition-colors"
                            >
                              +{extraDistrictsCount} more
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Clusters */}
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-[11px] text-slate-400 truncate">
                        {(ngo.clusters || []).slice(0, 3).join(', ')}
                        {((ngo.clusters || []).length > 3) && ` +${(ngo.clusters || []).length - 3}`}
                      </span>
                    </div>

                    {/* HOW THEY GET FUNDS */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-400">Funding Mechanism:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {hasDirectFunding ? 'Direct Grant' : 'Sub-Grant Pass-Through'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {hasDirectFunding && ngo.shf_projects && ngo.shf_projects.length > 0
                          ? `Somalia Humanitarian Fund (SHF): ${ngo.shf_projects[0].project_title}`
                          : hasDirectFunding && ngo.fts_grants && ngo.fts_grants.length > 0
                          ? `Direct FTS Grant: ${ngo.fts_grants[0].source_donor} (${ngo.fts_grants[0].sector})`
                          : `Downstream partner agreement via UN agencies (WFP, UNICEF) & INGO consortia.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedNgo(ngo);
                      setActiveTab('funding');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-600 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Activities & Funding</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href={`/dossier-builder?ngo=${encodeURIComponent(ngo.name)}`}
                    title="Generate Proposal Evidence Dossier"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-900/60 border border-slate-700 hover:border-teal-600 text-teal-300 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NgosDirectoryClient({ initialNgos }: NgosDirectoryClientProps) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading Somalia Operational Partner Intelligence...
      </div>
    }>
      <NgosDirectoryContent initialNgos={initialNgos} />
    </Suspense>
  );
}
