'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Search, 
  Filter, 
  Building2, 
  Users, 
  DollarSign, 
  CreditCard, 
  ExternalLink,
  ChevronDown,
  Layers,
  ChevronRight,
  Maximize2,
  X,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import cvaData from '@/data/somalia_cva_audit_data.json';
import rawData from '@/data/somalia_raw_cwg_records.json';
import householdsData from '@/data/somalia_reach_households.json';

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
}

export default function CashTransferAuditDashboard() {
  const [activeTab, setActiveTab] = useState<'districts' | 'households' | 'organizations'>('districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem>(cvaData.districts[0] as DistrictItem);
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'districts' | 'households' | 'cwg' | 'reach'>('districts');
  const [modalSearch, setModalSearch] = useState('');

  const totalCamps = useMemo(() => cvaData.districts.reduce((acc, d) => acc + (d.idp_camps_count || 0), 0), []);
  const totalShelters = useMemo(() => cvaData.districts.reduce((acc, d) => acc + (d.total_idp_shelters || 0), 0), []);

  // Filter districts
  const filteredDistricts = useMemo(() => {
    return (cvaData.districts as DistrictItem[]).filter(d => {
      if (d.district === 'Localisation_District_Label') return false;
      const matchesSearch = searchTerm === '' || 
        d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.active_organizations.some(org => org.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [searchTerm]);

  // Filter households
  const filteredHouseholds = useMemo(() => {
    return householdsData.households.filter(h => {
      const matchSearch = searchTerm === '' ||
        h.household_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.settlement_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.resp_gender.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // Modal filters
  const modalFilteredCwg = useMemo(() => {
    return rawData.real_cwg_transfers.filter(r => 
      modalSearch === '' || 
      r.organization.toLowerCase().includes(modalSearch.toLowerCase()) ||
      r.district.toLowerCase().includes(modalSearch.toLowerCase()) ||
      r.settlement.toLowerCase().includes(modalSearch.toLowerCase())
    ).slice(0, 100);
  }, [modalSearch]);

  const modalFilteredReach = useMemo(() => {
    return rawData.real_reach_settlements.filter(r => 
      modalSearch === '' || 
      r.district.toLowerCase().includes(modalSearch.toLowerCase()) ||
      r.management_structure.toLowerCase().includes(modalSearch.toLowerCase())
    ).slice(0, 100);
  }, [modalSearch]);

  const modalFilteredHouseholds = useMemo(() => {
    return householdsData.households.filter(h =>
      modalSearch === '' ||
      h.household_id.toLowerCase().includes(modalSearch.toLowerCase()) ||
      h.settlement_name.toLowerCase().includes(modalSearch.toLowerCase()) ||
      h.area.toLowerCase().includes(modalSearch.toLowerCase())
    ).slice(0, 100);
  }, [modalSearch]);

  return (
    <div className="space-y-10">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER / HERO BANNER                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold mb-4">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Somalia Cash Working Group (CWG) & REACH Initiative</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Humanitarian Cash &amp; Voucher Assistance (CVA) Explorer
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-2xl leading-relaxed">
              Empirical records of <strong>$592.1M in humanitarian cash distributions</strong> across Somalia. Real operational lines tracking mobile money transfers (Hormuud EVC Plus / Telesom ZAAD), food vouchers, surveyed IDP households, and active international implementers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/cash-audit/data"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-600/30"
              title="Open full data spreadsheet in a new window"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open List in New Window</span>
            </Link>
            <button
              onClick={() => setQuickModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>Quick Data Popup</span>
            </button>
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
            <span className="text-xs font-medium text-slate-400 block mb-1">Assessed IDP Settlements</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-200">
                {totalCamps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">Camps</span>
            </div>
            <span className="text-xs text-slate-400 block mt-1">
              {totalShelters.toLocaleString()} Shelters
            </span>
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
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Districts Overview ({filteredDistricts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('households')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'households'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Individual Surveyed Households ({filteredHouseholds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('organizations')}
          className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'organizations'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Top Implementing Agencies (WFP, FAO, CARE)</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DISTRICT SUMMARY OVERVIEW                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'districts' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district (e.g. Baydhaba, Cabudwaaq, Belet Weyne)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/cash-audit/data"
                target="_blank"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full 74-District Table ↗</span>
              </Link>
            </div>
          </div>

          {/* Master District Grid & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Interactive District Table */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Somalia Districts Master Table ({filteredDistricts.length})
                </span>
                <span className="text-xs text-slate-500">
                  Click any row to inspect district breakdown
                </span>
              </div>

              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 text-slate-300 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4 text-right">Total Transferred</th>
                      <th className="py-3 px-4 text-right">Mobile Money</th>
                      <th className="py-3 px-4 text-right">Voucher</th>
                      <th className="py-3 px-4 text-right">Households</th>
                      <th className="py-3 px-4 text-right">IDP Camps</th>
                      <th className="py-3 px-4 text-right">Shelters</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {filteredDistricts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
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
                                ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                                : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-3 px-4 font-sans font-bold text-white whitespace-nowrap">
                              {d.district}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-400">
                              ${d.total_usd_transferred.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-200">
                              ${d.mobile_money_usd.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-indigo-300">
                              ${d.voucher_usd.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-300">
                              {d.households_reached.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-300">
                              {d.idp_camps_count}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400">
                              {d.total_idp_shelters.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <ChevronRight className="w-4 h-4 text-slate-500 inline" />
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
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">District Operational Summary</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{selectedDistrict.district}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedDistrict.idp_camps_count} Assessed IDP Camps · {selectedDistrict.total_idp_shelters.toLocaleString()} Shelters
                    </p>
                  </div>

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
                        <span className="text-[11px] text-slate-400 block">Voucher Assistance</span>
                        <span className="text-base font-bold text-indigo-300 font-mono">
                          ${selectedDistrict.voucher_usd.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                        <span className="text-[11px] text-slate-400 block">Households Reached</span>
                        <span className="text-base font-bold text-slate-200 font-mono">
                          {selectedDistrict.households_reached.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Camp Demographics */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IDP Camp Presence</h4>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/60 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Assessed Camps:</span>
                        <span className="font-mono text-white font-bold">{selectedDistrict.idp_camps_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Recorded Shelters:</span>
                        <span className="font-mono text-slate-200">{selectedDistrict.total_idp_shelters.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Informal Management (Gatekeeper):</span>
                        <span className="font-mono text-slate-200">
                          {selectedDistrict.gatekeeper_camps_count} ({selectedDistrict.gatekeeper_prevalence_pct}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Implementing Partners */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Implementing Partners</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDistrict.active_organizations.length > 0 ? (
                        selectedDistrict.active_organizations.map((org) => (
                          <span
                            key={org}
                            className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700"
                          >
                            {org}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">None directly recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="pt-6 border-t border-slate-800">
                <Link
                  href="/cash-audit/data"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Inspect All 74 Districts in New Window</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: INDIVIDUAL SURVEYED HOUSEHOLDS (1,211 HHs)             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'households' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search household, settlement, area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/cash-audit/data"
                target="_blank"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Household Explorer & CSV ↗</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[650px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Household ID</th>
                    <th className="py-3 px-4">District / Area</th>
                    <th className="py-3 px-4">Settlement Name</th>
                    <th className="py-3 px-4">Head Gender</th>
                    <th className="py-3 px-4 text-right">Head Age</th>
                    <th className="py-3 px-4 text-right">Family Size</th>
                    <th className="py-3 px-4 text-right">Children</th>
                    <th className="py-3 px-4 text-center">Pregnant / Lactating</th>
                    <th className="py-3 px-4 text-center">Aid Registered</th>
                    <th className="py-3 px-4 text-center">Camp Gatekeeper (Horjooge)</th>
                    <th className="py-3 px-4 text-right">Camp Tax / Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredHouseholds.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400 font-sans">
                        No households found matching &ldquo;{searchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    filteredHouseholds.slice(0, 100).map(h => (
                      <tr key={h.household_id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-400 whitespace-nowrap">{h.household_id}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-300">{h.district} ({h.area})</td>
                        <td className="py-2.5 px-4 font-sans font-bold text-white whitespace-nowrap">{h.settlement_name}</td>
                        <td className="py-2.5 px-4 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.resp_gender === 'female' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {h.resp_gender.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-200">{h.head_age > 0 ? h.head_age : '—'}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-100">{h.family_size}</td>
                        <td className="py-2.5 px-4 text-right text-slate-300">{h.children_count}</td>
                        <td className="py-2.5 px-4 text-center">
                          {h.pregnant_lactating > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">YES ({h.pregnant_lactating})</span>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.registered_for_aid === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {h.registered_for_aid.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.registered_by_horjooge_gatekeeper === 'YES'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {h.registered_by_horjooge_gatekeeper}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-sans">
                          {h.camp_charge_usd > 0 ? (
                            <span className="font-mono text-amber-400 font-bold">${h.camp_charge_usd}/mo</span>
                          ) : h.pays_camp_rent_tax === 'yes' ? (
                            <span className="text-amber-400 text-xs">Yes (In-kind)</span>
                          ) : (
                            <span className="text-slate-600">None</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              Showing first 100 of {filteredHouseholds.length} surveyed households. Click &ldquo;Open Household Explorer &amp; CSV&rdquo; to view or export all 1,211 household interviews.
            </div>
          </div>
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
                      <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
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
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    Master Raw Dataset Quick Inspector
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Somalia Cash Programming &amp; IDP Settlement Master Data
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/cash-audit/data"
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Standalone Window ↗</span>
                </Link>
                <button
                  onClick={() => setQuickModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tab Switcher & Search */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalTab('districts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modalTab === 'districts'
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  District Summary (74)
                </button>

                <button
                  onClick={() => setModalTab('households')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modalTab === 'households'
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Surveyed Households ({householdsData.households.length})
                </button>

                <button
                  onClick={() => setModalTab('cwg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modalTab === 'cwg'
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  CWG Activity Lines
                </button>

                <button
                  onClick={() => setModalTab('reach')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    modalTab === 'reach'
                      ? 'bg-emerald-600 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  REACH IDP Settlements
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-y-auto overflow-x-auto flex-1 p-4">
              {modalTab === 'districts' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3 text-right">Total Transferred (USD)</th>
                      <th className="py-2.5 px-3 text-right">Mobile Money (USD)</th>
                      <th className="py-2.5 px-3 text-right">Voucher (USD)</th>
                      <th className="py-2.5 px-3 text-right">Households</th>
                      <th className="py-2.5 px-3 text-right">IDP Camps Count</th>
                      <th className="py-2.5 px-3 text-right">Total Shelters</th>
                      <th className="py-2.5 px-3">Active Implementers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {filteredDistricts.map(d => (
                      <tr key={d.district} className={`hover:bg-slate-800/50 transition-colors ${d.district === 'Cabudwaaq' ? 'bg-indigo-950/20' : ''}`}>
                        <td className="py-2 px-3 font-sans font-bold text-white whitespace-nowrap">{d.district}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400">${d.total_usd_transferred.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-200">${d.mobile_money_usd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-indigo-300">${d.voucher_usd.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-200">{d.households_reached.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{d.idp_camps_count}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{d.total_idp_shelters.toLocaleString()}</td>
                        <td className="py-2 px-3 font-sans text-slate-400 max-w-xs truncate" title={d.active_organizations.join(', ')}>
                          {d.active_organizations.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {modalTab === 'households' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Household ID</th>
                      <th className="py-2.5 px-3">District / Area</th>
                      <th className="py-2.5 px-3">Settlement Name</th>
                      <th className="py-2.5 px-3">Head Gender</th>
                      <th className="py-2.5 px-3 text-right">Age</th>
                      <th className="py-2.5 px-3 text-right">Family Size</th>
                      <th className="py-2.5 px-3 text-right">Children</th>
                      <th className="py-2.5 px-3 text-center">PLW</th>
                      <th className="py-2.5 px-3 text-center">Aid Registered</th>
                      <th className="py-2.5 px-3 text-right">Camp Rent/Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {modalFilteredHouseholds.map(h => (
                      <tr key={h.household_id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-2 px-3 text-slate-400 font-bold">{h.household_id}</td>
                        <td className="py-2 px-3 font-sans text-slate-300">{h.district} ({h.area})</td>
                        <td className="py-2 px-3 font-sans font-bold text-white">{h.settlement_name}</td>
                        <td className="py-2 px-3 font-sans">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            h.resp_gender === 'female' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {h.resp_gender.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-300">{h.head_age || '—'}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-100">{h.family_size}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{h.children_count}</td>
                        <td className="py-2 px-3 text-center">
                          {h.pregnant_lactating > 0 ? <span className="text-emerald-400 font-bold">YES</span> : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            h.registered_for_aid === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'
                          }`}>
                            {h.registered_for_aid.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-sans text-amber-400">
                          {h.camp_charge_usd > 0 ? `$${h.camp_charge_usd}/mo` : h.pays_camp_rent_tax === 'yes' ? 'In-kind' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {modalTab === 'cwg' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Record ID</th>
                      <th className="py-2.5 px-3">Organization</th>
                      <th className="py-2.5 px-3">Region</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Settlement</th>
                      <th className="py-2.5 px-3">Mechanism</th>
                      <th className="py-2.5 px-3 text-right">Value/HH</th>
                      <th className="py-2.5 px-3 text-right">Total Transferred</th>
                      <th className="py-2.5 px-3 text-right">Households</th>
                      <th className="py-2.5 px-3">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {modalFilteredCwg.map(r => (
                      <tr key={r.record_id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-2 px-3 text-slate-500">{r.record_id}</td>
                        <td className="py-2 px-3 font-sans font-bold text-white whitespace-nowrap">{r.organization}</td>
                        <td className="py-2 px-3 font-sans text-slate-300">{r.region}</td>
                        <td className="py-2 px-3 font-sans text-slate-200">{r.district}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{r.settlement}</td>
                        <td className="py-2 px-3 font-sans text-emerald-400">{r.mechanism}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-200">{r.transfer_value_usd > 0 ? `$${r.transfer_value_usd.toFixed(0)}` : '—'}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400 font-mono">${r.total_usd_transferred.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{r.households_reached.toLocaleString()}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{r.delivery_month} {r.delivery_year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {modalTab === 'reach' && (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Site ID</th>
                      <th className="py-2.5 px-3">Region</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Settlement Type</th>
                      <th className="py-2.5 px-3 text-right">Estimated Shelters</th>
                      <th className="py-2.5 px-3">Leadership / Management</th>
                      <th className="py-2.5 px-3 text-center">Cash Assistance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                    {modalFilteredReach.map(r => (
                      <tr key={r.site_id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-2 px-3 text-slate-500">{r.site_id}</td>
                        <td className="py-2 px-3 font-sans text-slate-300">{r.region}</td>
                        <td className="py-2 px-3 font-sans font-bold text-white">{r.district}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{r.settlement_type}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-200">{r.estimated_shelters.toLocaleString()}</td>
                        <td className="py-2 px-3 font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {r.management_structure}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {r.received_cash_support ? <span className="text-emerald-400 font-bold">YES</span> : <span className="text-slate-600">NO</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-500">Source: UN Somalia Cash Working Group (CWG) &amp; REACH Detailed Site Assessment</span>
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
