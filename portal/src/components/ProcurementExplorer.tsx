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
  FileCheck2,
  FolderOpen,
  ArrowUpDown,
  Tag
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

interface ProcurementExplorerProps {
  initialNotices: TenderNotice[];
}

export default function ProcurementExplorer({ initialNotices }: ProcurementExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'deadline' | 'published' | 'agency'>('deadline');

  // Extract unique agencies and sectors
  const agencies = useMemo(() => {
    const list = Array.from(new Set(initialNotices.map((n) => n.agency))).sort();
    return ['ALL', ...list];
  }, [initialNotices]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(initialNotices.map((n) => n.sector))).sort();
    return ['ALL', ...list];
  }, [initialNotices]);

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    return initialNotices.filter((n) => {
      // Agency filter
      if (selectedAgency !== 'ALL' && n.agency !== selectedAgency) {
        return false;
      }
      // Sector filter
      if (selectedSector !== 'ALL' && n.sector !== selectedSector) {
        return false;
      }
      // Search term
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
      if (sortBy === 'agency') {
        return a.agency.localeCompare(b.agency);
      }
      if (sortBy === 'published') {
        return b.published_date.localeCompare(a.published_date);
      }
      // Default: deadline
      return a.deadline.localeCompare(b.deadline);
    });
  }, [initialNotices, selectedAgency, selectedSector, searchTerm, sortBy]);

  // Agency badge colors
  const getAgencyColor = (agency: string) => {
    switch (agency.toUpperCase()) {
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
      case 'UN SECRETARIAT':
        return 'bg-teal-950/80 text-teal-300 border-teal-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
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
          <Clock className="w-3.5 h-3.5" /> Auto-synced from UNGM Public Gateway
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
  );
}
