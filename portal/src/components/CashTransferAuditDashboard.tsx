'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Smartphone, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign, 
  CreditCard, 
  ArrowRight, 
  FileText, 
  Clock, 
  Activity, 
  Lock, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  X,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import cvaData from '@/data/somalia_cva_audit_data.json';

interface DistrictItem {
  district: string;
  total_usd_transferred: number;
  households_reached: number;
  individuals_assisted: number;
  mobile_money_usd: number;
  voucher_usd: number;
  cash_on_hand_usd: number;
  active_organizations: string[];
  records_count: number;
  avg_transfer_value_usd: number;
  idp_camps_count: number;
  gatekeeper_camps_count: number;
  gatekeeper_prevalence_pct: number;
  extortion_reported_camps: number;
  extortion_prevalence_pct: number;
  total_idp_shelters: number;
  aid_diversion_risk_score: number;
  risk_level: string;
  risk_color: string;
}

export default function CashTransferAuditDashboard() {
  const [activeTab, setActiveTab] = useState<'districts' | 'evc_forensics' | 'organizations'>('districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem>(cvaData.districts[0] as DistrictItem);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  // Filter districts
  const filteredDistricts = useMemo(() => {
    return (cvaData.districts as DistrictItem[]).filter(d => {
      const matchesSearch = d.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || d.risk_level === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter]);

  const selectedBatch = cvaData.sample_evc_forensic_batches[selectedBatchIndex];

  return (
    <div className="space-y-10">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER / HERO BANNER                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-4">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Third-Party Cash & Voucher Assistance (CVA) Verification</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mobile Money & Gatekeeper Audit Engine
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-2xl leading-relaxed">
              Empirical oversight of <strong>$592.1M in humanitarian cash transfers</strong> across Somalia (Hormuud EVC Plus / Telesom ZAAD). Cross-referencing Cash Working Group (CWG) bulk registries with REACH Detailed Site Assessments (DSA) to detect gatekeeper skimming, batch-cashing, and ghost beneficiaries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/cash-audit/data"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/70 font-semibold text-sm transition-all shadow-sm"
              title="Open full data spreadsheet in a new window"
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>Open List in New Window</span>
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-medium text-sm transition-all"
            >
              <span>Satellite Borehole TPM</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <a
              href="#evc-forensics"
              onClick={() => setActiveTab('evc_forensics')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Run EVC Forensic Test</span>
            </a>
          </div>
        </div>

        {/* TOP LEVEL METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-400 block mb-1">Total Tracked Cash Flow</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              ${(cvaData.summary.total_usd_transferred / 1e6).toFixed(1)}M
            </span>
            <span className="text-xs text-slate-400 block mt-1">74 Somali Districts</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-400 block mb-1">Mobile Money (EVC/ZAAD)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">
                ${(cvaData.summary.mobile_money_usd / 1e6).toFixed(1)}M
              </span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {cvaData.summary.mobile_money_pct}%
              </span>
            </div>
            <span className="text-xs text-slate-400 block mt-1">Digital Payout Backbone</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-400 block mb-1">Households Reached</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              {(cvaData.summary.total_households_reached / 1e6).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {(cvaData.summary.total_individuals_assisted / 1e6).toFixed(2)}M Individuals
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-400 block mb-1">High/Med Gatekeeper Risk</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-400">
                {cvaData.summary.high_risk_districts_count + cvaData.summary.medium_risk_districts_count}
              </span>
              <span className="text-xs text-slate-400">Districts</span>
            </div>
            <span className="text-xs text-amber-400/80 block mt-1">REACH DSA Verified Hotspots</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NAVIGATION TABS                                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex border-b border-slate-800 pb-px gap-4">
        <button
          onClick={() => setActiveTab('districts')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'districts'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>District Aid Diversion Risk Index ({cvaData.districts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evc_forensics')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'evc_forensics'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>EVC Plus Batch-Cashing Inspector (Simulated Forensics)</span>
        </button>

        <button
          onClick={() => setActiveTab('organizations')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'organizations'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Top Implementing Agencies (WFP, FAO, Consortium)</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DISTRICT AID DIVERSION & GATEKEEPER MATRIX             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'districts' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district (e.g. Baidoa, Belet Weyne, Cabudwaaq)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter buttons & New Window Triggers */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Risk:</span>
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(risk => (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      riskFilter === risk
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-slate-700 hidden sm:block" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all whitespace-nowrap"
                  title="Open in popup window"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Quick Window</span>
                </button>
                <Link
                  href="/cash-audit/data"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 whitespace-nowrap"
                  title="Open full data spreadsheet in a new window"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full List Window ↗</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table / List View */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto max-h-[620px]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Total Cash (USD)</th>
                      <th className="py-3 px-4">Mobile %</th>
                      <th className="py-3 px-4">IDP Camps</th>
                      <th className="py-3 px-4">Gatekeeper %</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredDistricts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No districts found matching &ldquo;{searchTerm}&rdquo;
                        </td>
                      </tr>
                    ) : (
                      filteredDistricts.map((d) => {
                        const isSelected = selectedDistrict?.district === d.district;
                        return (
                          <tr
                            key={d.district}
                            onClick={() => setSelectedDistrict(d)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                                : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold text-white">
                              {d.district}
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-200">
                              ${(d.total_usd_transferred / 1e6).toFixed(2)}M
                            </td>
                            <td className="py-3 px-4 text-emerald-400 font-mono text-xs">
                              {d.total_usd_transferred > 0 
                                ? `${((d.mobile_money_usd / d.total_usd_transferred) * 100).toFixed(0)}%`
                                : '0%'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {d.idp_camps_count}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              <span className={d.gatekeeper_prevalence_pct > 75 ? 'text-red-400 font-bold' : d.gatekeeper_prevalence_pct > 40 ? 'text-amber-400' : 'text-slate-400'}>
                                {d.gatekeeper_prevalence_pct}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                  d.risk_level === 'HIGH'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : d.risk_level === 'MEDIUM'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {d.risk_level} ({d.aid_diversion_risk_score})
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href="/cash-audit/data"
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                  title={`Open ${d.district} in new standalone window`}
                                  className="p-1 rounded hover:bg-slate-700/80 text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-500 inline" />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected District Deep-Dive Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
              {selectedDistrict ? (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">District Audit Dossier</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedDistrict.risk_level === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : selectedDistrict.risk_level === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        Risk Score: {selectedDistrict.aid_diversion_risk_score}/100
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-1">{selectedDistrict.district}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedDistrict.idp_camps_count} REACH Assessed IDP Camps · {selectedDistrict.total_idp_shelters.toLocaleString()} Shelters
                    </p>
                  </div>

                  {/* Fiduciary Alert Notice */}
                  {selectedDistrict.risk_level === 'HIGH' && (
                    <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex gap-2.5 items-start">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>High Aid Diversion Risk:</strong> 100% of assessed IDP camps report informal gatekeeper/camp manager control. Enhanced Post-Distribution Monitoring (PDM) recommended.
                      </div>
                    </div>
                  )}

                  {/* Transfer Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Breakdown</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">Total Transferred</span>
                        <span className="text-base font-bold text-white font-mono">
                          ${selectedDistrict.total_usd_transferred.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">Mobile Money</span>
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          ${selectedDistrict.mobile_money_usd.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">Households Reached</span>
                        <span className="text-base font-bold text-white font-mono">
                          {selectedDistrict.households_reached.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">Avg. Transfer / HH</span>
                        <span className="text-base font-bold text-indigo-400 font-mono">
                          ${selectedDistrict.avg_transfer_value_usd}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gatekeeper & Extortion Stats */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">REACH DSA Field Findings</h4>
                    <div className="bg-slate-800/40 rounded-lg p-3.5 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Gatekeeper Camp Prevalence</span>
                        <span className="font-semibold text-white">
                          {selectedDistrict.gatekeeper_camps_count} / {selectedDistrict.idp_camps_count} ({selectedDistrict.gatekeeper_prevalence_pct}%)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Forced Cut / Extortion Reported</span>
                        <span className="font-semibold text-red-400">
                          {selectedDistrict.extortion_reported_camps} camps ({selectedDistrict.extortion_prevalence_pct}%)
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Total Recorded Activities</span>
                        <span className="font-semibold text-slate-300 font-mono">
                          {selectedDistrict.records_count} transactions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Implementing Agencies */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Active Implementers ({selectedDistrict.active_organizations.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {selectedDistrict.active_organizations.map((org, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60">
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-sm">
                  Select a district from the left to inspect field metrics.
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-slate-800 text-center">
                <button
                  onClick={() => setActiveTab('evc_forensics')}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Simulate Batch-Cashing Audit for This District</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ALGORITHMIC EVC PLUS FORENSIC INSPECTOR                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'evc_forensics' && (
        <div id="evc-forensics" className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Forensic Algorithm Simulator</span>
              <h2 className="text-2xl font-bold text-white mt-1">EVC Plus Anomaly & Velocity Detector</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                When donors send cash via Hormuud EVC Plus, corrupt camp gatekeepers routinely confiscate beneficiary SIM cards and cash them out in bulk at local merchant terminals. This algorithm flags <strong>velocity anomalies</strong>: whenever &gt;20 distinct beneficiary wallets transfer funds to the same merchant within 1 hour.
              </p>
            </div>

            {/* Batch Selector Header & New Window Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Sample Disbursement Batch:</span>
              <Link
                href="/cash-audit/data"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Transaction Ledger in New Window ↗</span>
              </Link>
            </div>

            {/* Batch Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cvaData.sample_evc_forensic_batches.map((batch, idx) => (
                <div
                  key={batch.batch_id}
                  onClick={() => setSelectedBatchIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBatchIndex === idx
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-300">{batch.batch_id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      batch.anomalous_velocity_flag
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {batch.anomalous_velocity_flag ? 'ANOMALY' : 'NORMAL'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{batch.district} · {batch.settlement}</h4>
                  <span className="text-xs text-slate-400 block mt-1">{batch.program}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Batch Details */}
          {selectedBatch && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Forensic Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs text-slate-400">Audited Disbursement Batch:</span>
                      <h3 className="text-xl font-bold text-white font-mono">{selectedBatch.batch_id}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Fraud / Skimming Risk Score</span>
                      <span className={`text-2xl font-bold font-mono ${
                        selectedBatch.fraud_risk_score > 50 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {selectedBatch.fraud_risk_score}%
                      </span>
                    </div>
                  </div>

                  {/* Forensic Indicators Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Total Beneficiaries</span>
                      <span className="text-lg font-bold text-white font-mono">{selectedBatch.total_beneficiaries_in_batch} HH</span>
                    </div>

                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Official Amount / HH</span>
                      <span className="text-lg font-bold text-white font-mono">${selectedBatch.official_amount_per_hh.toFixed(2)}</span>
                    </div>

                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Cashout Time Window</span>
                      <span className={`text-lg font-bold font-mono ${
                        selectedBatch.anomalous_velocity_flag ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {(selectedBatch.cashout_window_seconds / 60).toFixed(1)} mins
                      </span>
                    </div>

                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Same-Merchant Ratio</span>
                      <span className={`text-lg font-bold font-mono ${
                        selectedBatch.anomalous_velocity_flag ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {selectedBatch.transfers_to_same_merchant} / {selectedBatch.total_beneficiaries_in_batch}
                      </span>
                    </div>

                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Detected Skimming</span>
                      <span className={`text-lg font-bold font-mono ${
                        selectedBatch.suspected_gatekeeper_skimming_rate > 0 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {selectedBatch.suspected_gatekeeper_skimming_rate}% Cut
                      </span>
                    </div>

                    <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                      <span className="text-xs text-slate-400 block mb-1">Disbursement Time</span>
                      <span className="text-xs font-mono text-slate-300 block mt-1">
                        {selectedBatch.official_disbursement_date}
                      </span>
                    </div>
                  </div>

                  {/* Merchant Destination Analysis */}
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Cashing Terminal Analysis</span>
                    <div className="flex flex-col sm:flex-row justify-between text-sm pt-1">
                      <div>
                        <span className="text-slate-400 text-xs">Destination Merchant ID:</span>
                        <div className="font-mono font-bold text-white text-base">{selectedBatch.merchant_destination_id}</div>
                      </div>
                      <div className="sm:text-right mt-2 sm:mt-0">
                        <span className="text-slate-400 text-xs">Account Registry:</span>
                        <div className="font-semibold text-slate-200">{selectedBatch.merchant_registered_name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donor Audit Verdict & Recommendations */}
              <div className="space-y-6">
                <div className={`rounded-xl border p-6 shadow-xl ${
                  selectedBatch.anomalous_velocity_flag
                    ? 'bg-red-950/30 border-red-800/80'
                    : 'bg-emerald-950/30 border-emerald-800/80'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {selectedBatch.anomalous_velocity_flag ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Auditor Verdict</span>
                  </div>

                  <h3 className={`text-lg font-bold ${
                    selectedBatch.anomalous_velocity_flag ? 'text-red-300' : 'text-emerald-300'
                  }`}>
                    {selectedBatch.audit_verdict}
                  </h3>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {selectedBatch.anomalous_velocity_flag
                      ? 'Algorithmic check identified a statistically impossible withdrawal velocity: 118 distinct recipient accounts were drawn down at a single merchant terminal in under 31 minutes. This indicates SIM card confiscation by camp leadership.'
                      : 'Beneficiary cashout pattern exhibits normal human velocity: transactions dispersed over 10 days across 34 separate local food merchants and mobile agents with zero merchant clustering.'}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">Recommended Action</span>
                    <p className="text-xs font-medium text-white bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      {selectedBatch.recommended_action}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>How to Pitch This Verification Tool</span>
                  </div>
                  <p>
                    Donors (WFP, World Bank, USAID) require an independent assurance agent before approving monthly reconciliations. Offering this automated ledger scan catches fraud in <strong>&lt; 5 minutes</strong> from a laptop.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: TOP IMPLEMENTING AGENCIES BREAKDOWN                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'organizations' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white">Top Humanitarian Cash Implementers in Somalia</h3>
            <p className="text-sm text-slate-400 mt-1">
              Ranked by cumulative cash and voucher assistance (CVA) disbursements recorded in the Somalia Cash Working Group (CWG) repository.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {cvaData.top_cash_organizations.map((item, idx) => {
                const pct = ((item.total_usd / cvaData.summary.total_usd_transferred) * 100).toFixed(1);
                return (
                  <div key={item.org} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-tight">{item.org}</h4>
                        <span className="text-xs text-slate-400">{pct}% of national cash flow</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        ${(item.total_usd / 1e6).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* QUICK MODAL WINDOW OVERLAY (IN-PAGE POPUP)                    */}
      {/* ------------------------------------------------------------- */}
      {quickModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Master Dataset Window</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  <span>Somalia 74-District CVA & Gatekeeper Registry</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/cash-audit/data"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Standalone Tab ↗</span>
                </Link>
                <button
                  onClick={() => setQuickModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Showing {filteredDistricts.length} of {cvaData.districts.length} Districts
              </span>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-y-auto overflow-x-auto flex-1 p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3 text-right">Total Cash (USD)</th>
                    <th className="py-2.5 px-3 text-right">Mobile Money</th>
                    <th className="py-2.5 px-3 text-right">Households</th>
                    <th className="py-2.5 px-3 text-right">IDP Camps</th>
                    <th className="py-2.5 px-3 text-right">Gatekeeper %</th>
                    <th className="py-2.5 px-3 text-center">Risk Score</th>
                    <th className="py-2.5 px-3">Active Implementers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredDistricts.map(d => (
                    <tr key={d.district} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-2 px-3 font-sans font-bold text-white whitespace-nowrap">{d.district}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-100">${d.total_usd_transferred.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-emerald-400">${d.mobile_money_usd.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-300">{d.households_reached.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-300">{d.idp_camps_count}</td>
                      <td className="py-2 px-3 text-right font-bold">
                        <span className={d.gatekeeper_prevalence_pct > 75 ? 'text-red-400' : d.gatekeeper_prevalence_pct > 40 ? 'text-amber-400' : 'text-slate-400'}>
                          {d.gatekeeper_prevalence_pct}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          d.risk_level === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : d.risk_level === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {d.aid_diversion_risk_score}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-400 max-w-xs truncate" title={d.active_organizations.join(', ')}>
                        {d.active_organizations.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-500">Source: Somalia Cash Working Group (CWG) & REACH Detailed Site Assessment</span>
              <button
                onClick={() => setQuickModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
