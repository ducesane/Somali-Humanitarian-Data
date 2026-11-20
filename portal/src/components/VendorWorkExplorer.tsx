'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ArrowUpDown,
  ExternalLink,
  FolderGit2
} from 'lucide-react';

interface OrderItem {
  project_id: string;
  project_title: string;
  order_id: string;
  description: string;
  order_date: string;
  amount: number;
  year?: string;
}

interface VendorWorkExplorerProps {
  orders: OrderItem[];
  vendorName: string;
  totalAmount: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
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

function cleanDescription(desc: string): string {
  if (!desc) return 'Standard Procurement';
  let d = desc.trim();
  if (d.startsWith("b'") && d.endsWith("'")) {
    d = d.slice(2, -1);
  } else if (d.startsWith('b"') && d.endsWith('"')) {
    d = d.slice(2, -1);
  }
  return d.trim() || 'Standard Procurement';
}

export default function VendorWorkExplorer({
  orders,
  vendorName,
  totalAmount
}: VendorWorkExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('DATE_DESC');

  // Available unique years
  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    orders.forEach((o) => {
      const yr = (o.order_date || '').split('-')[0];
      if (yr && yr.length === 4) yrs.add(yr);
    });
    return Array.from(yrs).sort().reverse();
  }, [orders]);

  // Available unique projects
  const availableProjects = useMemo(() => {
    const pMap = new Map<string, { id: string; title: string; count: number; total: number }>();
    orders.forEach((o) => {
      if (!pMap.has(o.project_id)) {
        pMap.set(o.project_id, { id: o.project_id, title: o.project_title, count: 0, total: 0 });
      }
      const entry = pMap.get(o.project_id)!;
      entry.count += 1;
      entry.total += o.amount;
    });
    return Array.from(pMap.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchSearch =
          search.trim() === '' ||
          o.order_id.toLowerCase().includes(search.toLowerCase()) ||
          o.description.toLowerCase().includes(search.toLowerCase()) ||
          o.project_title.toLowerCase().includes(search.toLowerCase()) ||
          o.order_date.includes(search);

        const yr = (o.order_date || '').split('-')[0];
        const matchYear = selectedYear === 'ALL' || yr === selectedYear;
        const matchProj = selectedProject === 'ALL' || o.project_id === selectedProject;

        return matchSearch && matchYear && matchProj;
      })
      .sort((a, b) => {
        if (sortBy === 'DATE_DESC') return (b.order_date || '').localeCompare(a.order_date || '');
        if (sortBy === 'DATE_ASC') return (a.order_date || '').localeCompare(b.order_date || '');
        if (sortBy === 'AMOUNT_DESC') return b.amount - a.amount;
        if (sortBy === 'AMOUNT_ASC') return a.amount - b.amount;
        return 0;
      });
  }, [orders, search, selectedYear, selectedProject, sortBy]);

  const filteredTotal = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + o.amount, 0);
  }, [filteredOrders]);

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['PO ID', 'Project ID', 'Project Title', 'Description of Work', 'Disbursement Date', 'Fiscal Year', 'Amount (USD)'];
    const rows = filteredOrders.map((o) => [
      `"${o.order_id}"`,
      `"${o.project_id}"`,
      `"${(o.project_title || '').replace(/"/g, '""')}"`,
      `"${cleanDescription(o.description).replace(/"/g, '""')}"`,
      `"${o.order_date}"`,
      `"${(o.order_date || '').split('-')[0]}"`,
      o.amount.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${vendorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-purchase-orders.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-emerald-400" />
            All Work Done &amp; Purchase Orders ({orders.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full itemized breakdown of completed contracts, dates of disbursement, and monetary values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title="Download CSV export of this table"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            Filtered Total: ${filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PO ID, description, date..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Project Selector (if vendor worked on > 1 project) */}
        {availableProjects.length > 1 && (
          <div className="flex items-center gap-1.5 w-full lg:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <FolderGit2 className="w-3 h-3 text-emerald-400" /> Project:
            </span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold focus:outline-none focus:border-emerald-500 max-w-[240px] truncate"
            >
              <option value="ALL">All Projects ({orders.length} orders)</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.count} orders &bull; ${p.total.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Pills */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" /> Year:
          </span>
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedYear === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Years
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedYear === yr
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 w-full lg:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 whitespace-nowrap">
            <ArrowUpDown className="w-3 h-3 text-emerald-400" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value="DATE_DESC">Date (Newest First)</option>
            <option value="DATE_ASC">Date (Oldest First)</option>
            <option value="AMOUNT_DESC">Amount (Highest First)</option>
            <option value="AMOUNT_ASC">Amount (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Table of Orders */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 whitespace-nowrap">PO ID</th>
              <th className="py-3.5 px-4 min-w-[220px]">Project</th>
              <th className="py-3.5 px-4 min-w-[300px]">Description of Work Done</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Disbursement Date</th>
              <th className="py-3.5 px-4 text-right whitespace-nowrap">Amount (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-xs">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((po, idx) => (
                <tr 
                  key={`${po.order_id}-${idx}`}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  {/* PO ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {po.order_id}
                  </td>

                  {/* Project with clean spacing */}
                  <td className="py-3.5 px-4 font-sans text-xs">
                    <Link
                      href={`/undp-projects/${po.project_id}`}
                      className="font-bold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-1 block"
                      title={po.project_title}
                    >
                      {po.project_title}
                    </Link>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                      Project ID: {po.project_id}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    {cleanDescription(po.description)}
                  </td>

                  {/* Clean Formatted Date without duplicate year badge */}
                  <td className="py-3.5 px-4 font-sans whitespace-nowrap">
                    <span className="font-semibold text-slate-200 font-mono">
                      {formatDate(po.order_date)}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-bold text-right text-emerald-400 whitespace-nowrap font-mono text-sm">
                    ${Number(po.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans text-xs">
                  No purchase orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-950 font-bold border-t border-slate-800 text-xs">
            <tr>
              <td colSpan={4} className="py-3.5 px-4 text-right uppercase text-slate-400 font-sans">
                Filtered Total ({filteredOrders.length} orders):
              </td>
              <td className="py-3.5 px-4 text-right text-emerald-400 text-sm font-mono font-black">
                ${filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
