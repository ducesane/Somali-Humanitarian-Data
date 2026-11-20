'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Download,
  ExternalLink,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  CheckCircle,
  FolderDown,
  FileSpreadsheet,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';
import undpData from '@/data/undp_somalia_projects_documents.json';
import vendorNameToSlugRaw from '@/data/vendor_name_to_slug.json';

const vendorNameToSlug = vendorNameToSlugRaw as Record<string, string>;

export default function UndpProjectsPage() {
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return undpData.filter((p) => {
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.locations.some(loc => loc.toLowerCase().includes(search.toLowerCase())) ||
        p.top_vendors.some(v => v.name.toLowerCase().includes(search.toLowerCase()));

      const matchFormat =
        selectedFormat === 'ALL' ||
        p.documents.some((d) => {
          if (selectedFormat === 'PDF') return d.format.includes('pdf');
          if (selectedFormat === 'DOC') return d.format.includes('doc') || d.format.includes('word');
          if (selectedFormat === 'XLS') return d.format.includes('sheet') || d.format.includes('excel') || d.format.includes('xlsx');
          return true;
        });

      return matchSearch && matchFormat;
    });
  }, [search, selectedFormat]);

  // Aggregate stats
  const totalSpend = useMemo(() => {
    return undpData.reduce((acc, p) => acc + (p.total_tracked_spent || 0), 0);
  }, []);

  const totalDocuments = useMemo(() => {
    return undpData.reduce((acc, p) => acc + (p.documents?.length || 0), 0);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  const getFormatBadge = (fmt: string) => {
    if (fmt.includes('pdf')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-950 text-red-400 border border-red-800">
          <FileText className="w-3 h-3" /> PDF
        </span>
      );
    }
    if (fmt.includes('doc') || fmt.includes('word')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">
          <FileText className="w-3 h-3" /> DOC
        </span>
      );
    }
    if (fmt.includes('sheet') || fmt.includes('excel') || fmt.includes('xlsx')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
          <FileSpreadsheet className="w-3 h-3" /> EXCEL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
        <ExternalLink className="w-3 h-3" /> LINK
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <FolderDown className="w-3.5 h-3.5" />
          UNDP Somalia Open Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Active Projects, Contractors &amp; Document Downloads
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Real-time synchronization with UNDP Open API (<code className="text-emerald-400">Operating Unit: SOM</code>).
          Explore every active project, identify top contractors and purchase orders, and directly download official signed project documents (ProDocs), annual workplans, and budgets.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Active Projects</div>
          <div className="text-3xl font-black text-white mt-1">{undpData.length} Projects</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">All with verified purchase orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Downloadable Docs</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{totalDocuments} Files</div>
          <div className="text-xs text-slate-500 mt-1">Signed ProDocs, Budgets, Workplans</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Tracked Procurement</div>
          <div className="text-3xl font-black text-white mt-1">${(totalSpend / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-slate-500 mt-1">Directly mapped to commercial vendors</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Top Vendor Category</div>
          <div className="text-xl font-black text-emerald-400 mt-2 truncate">HR &amp; Engineering</div>
          <div className="text-xs text-slate-500 mt-1">CTG, Deloitte, Hiraal, Arkaan</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project title, ID, vendor, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Format:
          </span>
          {['ALL', 'PDF', 'DOC', 'XLS'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedFormat === fmt
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Showing {filteredProjects.length} of {undpData.length} projects
        </div>

        {filteredProjects.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-all overflow-hidden"
            >
              {/* Project Header Summary */}
              <div
                onClick={() => toggleExpand(proj.id)}
                className="p-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ID: {proj.id}
                    </span>
                    {proj.latest_po_date && (
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Latest Order: {proj.latest_po_date}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-emerald-300 font-medium bg-slate-800 px-2 py-0.5 rounded">
                      <FolderDown className="w-3 h-3 text-emerald-400" />
                      {proj.documents.length} Downloadable Docs
                    </span>
                  </div>

                  <Link
                    href={`/undp-projects/${proj.id}`}
                    className="text-lg font-bold text-white hover:text-emerald-400 transition-colors leading-snug block"
                  >
                    {proj.title}
                  </Link>

                  {/* Footprint / locations */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Locations:</span>
                    {proj.locations.length > 0 ? (
                      proj.locations.map((loc) => (
                        <span key={loc} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium">
                          {loc}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">National Framework</span>
                    )}
                  </div>
                </div>

                {/* Right side stats + Toggle button */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold uppercase">Tracked Procurement</div>
                    <div className="text-lg font-black text-emerald-400">
                      ${(proj.total_tracked_spent || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      across {proj.total_orders} purchase orders
                    </div>
                  </div>

                  <button
                    aria-label="Toggle details"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details: Vendors & Document Downloads */}
              {isExpanded && (
                <div className="p-6 bg-slate-950/70 border-t border-slate-800 space-y-6">
                  {/* Top Vendors Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      Top Commercial Contractors &amp; Money Allocation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {proj.top_vendors.map((v) => {
                        const slug = vendorNameToSlug[v.name] || vendorNameToSlug[(v.name || '').toLowerCase()];
                        return (
                          <Link
                            key={v.name}
                            href={slug ? `/vendors/${slug}` : '#'}
                            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex items-center justify-between group"
                            title={`View all work done by ${v.name}`}
                          >
                            <div className="truncate pr-2">
                              <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                {v.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {v.order_count} order{v.order_count > 1 ? 's' : ''} &bull; Click for dossier
                              </div>
                            </div>
                            <div className="text-right font-black text-emerald-400 text-sm whitespace-nowrap">
                              ${v.total_amount.toLocaleString()}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Downloadable Documents Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      Official Project Documents &amp; Direct Downloads ({proj.documents.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {proj.documents.map((doc, idx) => (
                        <div
                          key={`${doc.url}-${idx}`}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {getFormatBadge(doc.format)}
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate" title={doc.title}>
                                {doc.title}
                              </div>
                              <div className="text-[10px] text-slate-500 uppercase mt-0.5 font-medium">
                                Category: {doc.category}
                              </div>
                            </div>
                          </div>

                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-950 flex-shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Dedicated Project Dossier */}
                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-800">
                    <span className="text-xs text-slate-400">
                      View full line-item purchase order breakdown and official project records:
                    </span>
                    <Link
                      href={`/undp-projects/${proj.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
                    >
                      <span>Open Full Project &amp; {proj.total_orders} Purchase Orders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
