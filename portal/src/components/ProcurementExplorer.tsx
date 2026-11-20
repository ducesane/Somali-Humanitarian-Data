'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Calendar, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Clock, 
  FolderOpen,
  ArrowUpDown,
  Tag,
  Trophy,
  CheckCircle2,
  Radio,
  FileCheck2,
  DollarSign
} from 'lucide-react';

export interface MatchedVendor {
  name: string;
  slug: string;
  total_amount: number;
  orders_count: number;
  operating_locations: string[];
}

export interface MatchedProject {
  id: string;
  title: string;
}

export interface TenderNotice {
  id: string;
  title: string;
  agency: string;
  notice_type: string;
  reference: string;
  published_date: string;
  deadline: string;
  url: string;
  sector: string;
  location: string;
  matched_vendors: MatchedVendor[];
  matched_projects: MatchedProject[];
}

export interface ContractAward {
  award_id: string;
  title: string;
  supplier: string;
  award_date: string;
  agency: string;
  reference: string;
  destination: string;
  url: string;
  is_matched: boolean;
  match_type: string;
  undp_vendor?: {
    name: string;
    slug: string;
    total_amount: number;
    orders_count: number;
    projects_count: number;
    first_activity: string;
    latest_activity: string;
    operating_locations: string[];
  } | null;
}

interface ProcurementExplorerProps {
  initialNotices: TenderNotice[];
  initialAwards: ContractAward[];
}

export default function ProcurementExplorer({ initialNotices, initialAwards }: ProcurementExplorerProps) {
  const [activeTab, setActiveTab] = useState<'TENDERS' | 'AWARDS'>('TENDERS');
  
  // Notice filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'deadline' | 'published' | 'agency'>('deadline');

  // Awards filters
  const [awardSearch, setAwardSearch] = useState('');
  const [awardAgency, setAwardAgency] = useState<string>('ALL');
  const [onlyMatched, setOnlyMatched] = useState<boolean>(false);

  // Extract unique agencies and sectors for notices
  const agencies = useMemo(() => {
    const list = Array.from(new Set(initialNotices.map((n) => n.agency))).sort();
    return ['ALL', ...list];
  }, [initialNotices]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(initialNotices.map((n) => n.sector))).sort();
    return ['ALL', ...list];
  }, [initialNotices]);

  // Extract unique agencies for awards
  const awardAgencies = useMemo(() => {
    const list = Array.from(new Set(initialAwards.map((a) => a.agency).filter(Boolean))).sort();
    return ['ALL', ...list];
  }, [initialAwards]);

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    return initialNotices.filter((n) => {
      if (selectedAgency !== 'ALL' && n.agency !== selectedAgency) return false;
      if (selectedSector !== 'ALL' && n.sector !== selectedSector) return false;
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesRef = n.reference.toLowerCase().includes(query);
        const matchesAgency = n.agency.toLowerCase().includes(query);
        const matchesLoc = n.location.toLowerCase().includes(query);
        const matchesSector = n.sector.toLowerCase().includes(query);
        const matchesVendor = n.matched_vendors.some((v) => v.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesRef && !matchesAgency && !matchesLoc && !matchesSector && !matchesVendor) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'agency') return a.agency.localeCompare(b.agency);
      if (sortBy === 'published') return b.published_date.localeCompare(a.published_date);
      return a.deadline.localeCompare(b.deadline);
    });
  }, [initialNotices, selectedAgency, selectedSector, searchTerm, sortBy]);

  // Filter awards
  const filteredAwards = useMemo(() => {
    return initialAwards.filter((a) => {
      if (onlyMatched && !a.is_matched) return false;
      if (awardAgency !== 'ALL' && a.agency !== awardAgency) return false;
      if (awardSearch.trim() !== '') {
        const query = awardSearch.toLowerCase();
        const matchesSupplier = a.supplier.toLowerCase().includes(query);
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesRef = a.reference.toLowerCase().includes(query);
        const matchesAgency = a.agency.toLowerCase().includes(query);
        const matchesUndp = a.undp_vendor ? a.undp_vendor.name.toLowerCase().includes(query) : false;
        if (!matchesSupplier && !matchesTitle && !matchesRef && !matchesAgency && !matchesUndp) {
          return false;
        }
      }
      return true;
    });
  }, [initialAwards, onlyMatched, awardAgency, awardSearch]);

  const matchedAwardsCount = useMemo(() => {
    return initialAwards.filter((a) => a.is_matched).length;
  }, [initialAwards]);

  // Agency badge colors
  const getAgencyColor = (agency: string) => {
    switch (agency?.toUpperCase()) {
      case 'UNICEF':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      case 'FAO':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'IOM':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'UNOPS':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'WHO':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'UNHCR':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      case 'ILO':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
      case 'ITC':
        return 'bg-violet-950/80 text-violet-300 border-violet-800';
      case 'UNDP':
        return 'bg-emerald-900/80 text-emerald-200 border-emerald-700';
      case 'UN SECRETARIAT':
        return 'bg-teal-950/80 text-teal-300 border-teal-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('TENDERS')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'TENDERS'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Active Tenders &amp; Opportunities ({initialNotices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AWARDS')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'AWARDS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Contract Winners &amp; Awards ({initialAwards.length})</span>
            <span className="text-[10px] bg-slate-950/80 text-emerald-300 px-2 py-0.5 rounded-md font-mono border border-emerald-800/60">
              {matchedAwardsCount} UNDP Mapped
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Source: <strong className="text-white">UN Global Marketplace (UNGM)</strong>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ACTIVE TENDERS */}
      {/* ============================================================== */}
      {activeTab === 'TENDERS' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tender title, reference, region (e.g. Mudug, Jowhar), or contractor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              {/* Agency Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                  <Building2 className="w-3.5 h-3.5" /> Agency:
                </span>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  aria-label="Filter by UN Agency"
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency === 'ALL' ? 'All UN Agencies (10)' : agency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort tenders by"
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="deadline">Submission Deadline</option>
                  <option value="published">Publication Date</option>
                  <option value="agency">Agency Name</option>
                </select>
              </div>
            </div>

            {/* Sector Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" /> Sector:
              </span>
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                    selectedSector === sec
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white font-semibold">{filteredNotices.length}</strong> active procurement opportunities in Somalia
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Real-time UNGM sync
            </span>
          </div>

          {/* Notices Cards Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-emerald-950/10 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Agency, Reference, Notice Type & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getAgencyColor(notice.agency)}`}>
                        {notice.agency}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Ref: {notice.reference || 'N/A'}
                      </span>
                      <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {notice.notice_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active Bid
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                    {notice.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/70">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <strong>Location:</strong> {notice.location}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <strong>Sector:</strong> {notice.sector}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <strong>Published:</strong> {notice.published_date}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                      <Clock className="w-3.5 h-3.5" />
                      <strong>Deadline:</strong> {notice.deadline}
                    </span>
                  </div>

                  {/* Mapped Intelligence: Matching Historical Vendors */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Historical Suppliers in this Sector ({notice.matched_vendors.length}):
                        </span>
                        <span className="text-[11px] text-slate-500">Track Record from UNDP Somalia Orders</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        {notice.matched_vendors.map((v) => (
                          <Link
                            key={v.slug}
                            href={`/vendors/${v.slug}`}
                            className="bg-slate-950/80 hover:bg-emerald-950/30 border border-slate-800/80 hover:border-emerald-700/50 rounded-xl p-2.5 transition-all text-left flex flex-col justify-between group/v"
                          >
                            <span className="text-xs font-semibold text-slate-200 group-hover/v:text-emerald-300 line-clamp-1 mb-1">
                              {v.name}
                            </span>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-mono text-emerald-400 font-semibold">
                                ${v.total_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              <span>{v.orders_count} orders</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Related Projects */}
                    {notice.matched_projects && notice.matched_projects.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1.5 uppercase tracking-wider">
                          <FolderOpen className="w-3 h-3 text-sky-400" /> Interlinked Ongoing Projects:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {notice.matched_projects.map((p) => (
                            <Link
                              key={p.id}
                              href={`/undp-projects/${p.id}`}
                              className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-sky-300 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1"
                            >
                              <span className="font-mono text-[10px] text-sky-400 font-bold">{p.id}</span>
                              <span className="truncate max-w-[260px]">{p.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    UNGM Opportunity #{notice.id}
                  </span>
                  <a
                    href={notice.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-950/40 transition-all hover:scale-102"
                  >
                    View Notice on UNGM &amp; Express Interest
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CONTRACT AWARD WINNERS */}
      {/* ============================================================== */}
      {activeTab === 'AWARDS' && (
        <div className="space-y-6">
          {/* Awards Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search winner supplier name, contract scope, or reference number..."
                  value={awardSearch}
                  onChange={(e) => setAwardSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Agency Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                  <Building2 className="w-3.5 h-3.5" /> Buying Agency:
                </span>
                <select
                  value={awardAgency}
                  onChange={(e) => setAwardAgency(e.target.value)}
                  aria-label="Filter awards by Agency"
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {awardAgencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency === 'ALL' ? 'All UN Agencies' : agency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Matched Toggle */}
              <button
                onClick={() => setOnlyMatched(!onlyMatched)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  onlyMatched
                    ? 'bg-emerald-600 text-slate-950 border-emerald-500 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>⭐ Only Verified UNDP Vendors ({matchedAwardsCount})</span>
              </button>
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white font-semibold">{filteredAwards.length}</strong> official contract awards in Somalia
            </span>
            <span className="text-amber-400 flex items-center gap-1 font-medium">
              <Trophy className="w-3.5 h-3.5" /> Historical contract wins from UNGM
            </span>
          </div>

          {/* Awards Table / Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredAwards.map((award) => (
              <div
                key={award.award_id}
                className={`rounded-2xl p-5 border transition-all ${
                  award.is_matched
                    ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-800/80 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getAgencyColor(award.agency)}`}>
                      {award.agency || 'UN'}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Ref: {award.reference || 'N/A'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      Awarded: <strong className="text-slate-200">{award.award_date}</strong>
                    </span>
                  </div>

                  {/* Match Status Badge */}
                  {award.is_matched ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/80 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Contractor in UNDP Portal</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      Cross-Agency Contractor
                    </span>
                  )}
                </div>

                {/* Contract Title & Winner */}
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white leading-snug">
                    {award.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">Awarded Winner:</span>
                    <span className="font-extrabold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/50">
                      🏆 {award.supplier}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      &bull; Destination: {award.destination}
                    </span>
                  </div>

                  {/* Mapped UNDP Profile Banner */}
                  {award.is_matched && award.undp_vendor && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> UNDP Somalia Disbursement Profile:
                        </div>
                        <div className="text-sm font-black text-white mt-0.5">
                          {award.undp_vendor.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Total UNDP Tracked: <strong className="text-emerald-400 font-mono">${award.undp_vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          {' '}&bull; {award.undp_vendor.orders_count} purchase orders across {award.undp_vendor.projects_count} projects
                        </div>
                      </div>

                      <Link
                        href={`/vendors/${award.undp_vendor.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all shrink-0"
                      >
                        <span>View Contractor Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    UNGM Contract #{award.award_id}
                  </span>
                  <a
                    href={award.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <span>View Record on UNGM</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
