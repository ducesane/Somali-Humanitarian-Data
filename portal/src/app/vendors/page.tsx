'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  Filter, 
  DollarSign, 
  ReceiptText, 
  FolderGit2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';
import vendorsData from '@/data/undp_somalia_vendors.json';

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthIdx >= 0 && monthIdx < 12) {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        return `${dayStr} ${months[monthIdx]} ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function VendorsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TIER1' | 'TIER2' | 'TIER3'>('ALL');
  const [sortBy, setSortBy] = useState<'AMOUNT' | 'ORDERS' | 'PROJECTS'>('AMOUNT');

  // Total stats
  const totalProcurement = useMemo(() => {
    return vendorsData.reduce((acc, v) => acc + v.total_amount, 0);
  }, []);

  const totalOrders = useMemo(() => {
    return vendorsData.reduce((acc, v) => acc + v.orders_count, 0);
  }, []);

  // Filtered & sorted vendors
  const filteredVendors = useMemo(() => {
    return vendorsData
      .filter((v) => {
        const matchSearch =
          search.trim() === '' ||
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.projects.some(p => p.title.toLowerCase().includes(search.toLowerCase()));

        let matchTier = true;
        if (tierFilter === 'TIER1') matchTier = v.total_amount >= 1000000;
        if (tierFilter === 'TIER2') matchTier = v.total_amount >= 100000 && v.total_amount < 1000000;
        if (tierFilter === 'TIER3') matchTier = v.total_amount < 100000;

        return matchSearch && matchTier;
      })
      .sort((a, b) => {
        if (sortBy === 'AMOUNT') return b.total_amount - a.total_amount;
        if (sortBy === 'ORDERS') return b.orders_count - a.orders_count;
        if (sortBy === 'PROJECTS') return b.projects_count - a.projects_count;
        return 0;
      });
  }, [search, tierFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          Commercial Contractors &amp; Vendors Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Contractor Intelligence Directory
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive tracking of every commercial vendor, NGO partner, engineering firm, and consultancy agency awarded UN and UNDP procurement contracts in Somalia. Explore the exact work done, line-item purchase orders, and total disbursements across all projects.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Tracked Contractors</div>
          <div className="text-3xl font-black text-white mt-1">{vendorsData.length} Vendors</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">Local &amp; international entities</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Total Procurement</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            ${(totalProcurement / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">Cumulative tracked contract value</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Purchase Orders</div>
          <div className="text-3xl font-black text-white mt-1">
            {totalOrders.toLocaleString()} Orders
          </div>
          <div className="text-xs text-slate-500 mt-1">Verified commercial line items</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Top Vendor Tier</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {vendorsData.filter(v => v.total_amount >= 1000000).length} Over $1M
          </div>
          <div className="text-xs text-slate-500 mt-1">Prime UN implementing contractors</div>
        </div>
      </div>

      {/* Live Procurement Pipeline Alert Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Live UN Procurement Pipeline (47 Opportunities Active)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-xs text-slate-300">
              Active tenders from UNGM (UNICEF, FAO, IOM, UNOPS, WHO, UNHCR) mapped to verified historical contractors and regions.
            </div>
          </div>
        </div>
        <Link
          href="/tenders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-extrabold tracking-wide transition-all shadow-md shrink-0"
        >
          Explore Live Tenders
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Controls: Search, Tier Filter, Sorting */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor name, keyword, or project..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Tier Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Tier:
            </span>
            <button
              onClick={() => setTierFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tierFilter === 'ALL' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({vendorsData.length})
            </button>
            <button
              onClick={() => setTierFilter('TIER1')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tierFilter === 'TIER1' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              &gt; $1M
            </button>
            <button
              onClick={() => setTierFilter('TIER2')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tierFilter === 'TIER2' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $100k - $1M
            </button>
            <button
              onClick={() => setTierFilter('TIER3')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                tierFilter === 'TIER3' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              &lt; $100k
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Sort:</span>
            <button
              onClick={() => setSortBy('AMOUNT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'AMOUNT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Amount
            </button>
            <button
              onClick={() => setSortBy('ORDERS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'ORDERS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setSortBy('PROJECTS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                sortBy === 'PROJECTS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Projects
            </button>
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Showing {filteredVendors.length} of {vendorsData.length} contractors</span>
          <span>Ranked by {sortBy.toLowerCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor, index) => {
            const isMillion = vendor.total_amount >= 1000000;
            return (
              <div
                key={vendor.slug}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                      #{index + 1}
                    </span>
                    {isMillion && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Tier 1 Contractor
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 block"
                    title={vendor.name}
                  >
                    {vendor.name}
                  </Link>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Awarded:</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        ${vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {vendor.latest_activity && vendor.latest_activity !== 'N/A' && (
                      <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800/50">
                        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          Latest Payment:
                        </span>
                        <span className="font-mono font-bold text-slate-200 text-[11px]">
                          {formatDate(vendor.latest_activity)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Purchase Orders:</span>
                      <span className="font-semibold text-slate-300">
                        {vendor.orders_count} orders across {vendor.projects_count} projects
                      </span>
                    </div>

                    {(vendor as any).operating_locations && (vendor as any).operating_locations.length > 0 && (
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          Locations:
                        </span>
                        <span className="text-slate-300 truncate max-w-[170px]" title={(vendor as any).operating_locations.join(', ')}>
                          {(vendor as any).operating_locations.slice(0, 3).join(', ')}
                          {(vendor as any).operating_locations.length > 3 ? ` +${(vendor as any).operating_locations.length - 3}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>View All Work Done</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
