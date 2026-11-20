import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  ReceiptText, 
  DollarSign, 
  Calendar, 
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';
import vendorsData from '@/data/undp_somalia_vendors.json';

interface VendorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return vendorsData.map((v) => ({
    slug: v.slug,
  }));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
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
  return d.trim();
}

export default async function VendorDetailPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = vendorsData.find((v) => v.slug === slug);

  if (!vendor) {
    notFound();
  }

  const isTier1 = vendor.total_amount >= 1000000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
        <Link 
          href="/" 
          className="hover:text-emerald-400 transition-colors font-semibold"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link 
          href="/vendors" 
          className="hover:text-emerald-400 transition-colors font-semibold"
        >
          Vendors
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-md">
          {vendor.name}
        </span>
      </nav>

      {/* Vendor Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
              Contractor Dossier
            </span>
            {isTier1 && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800">
                Tier 1 Prime Partner (&gt; $1M)
              </span>
            )}
            {vendor.latest_activity && vendor.latest_activity !== 'N/A' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Latest Contract: {formatDate(vendor.latest_activity)}
              </span>
            )}
          </div>

          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All 364 Vendors</span>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {vendor.name}
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Consolidated record of commercial contracts, service delivery, and procurement disbursements awarded by the United Nations Development Programme (UNDP) in Somalia.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Tracked Earnings</div>
            <div className="text-xl sm:text-3xl font-black text-emerald-400 mt-0.5">
              ${vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Purchase Orders</div>
            <div className="text-xl sm:text-3xl font-black text-white mt-0.5">
              {vendor.orders_count} Orders
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Projects Involved</div>
            <div className="text-xl sm:text-3xl font-black text-white mt-0.5">
              {vendor.projects_count} Projects
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Average Value Per PO</div>
            <div className="text-xl sm:text-3xl font-black text-slate-300 mt-0.5">
              ${(vendor.total_amount / (vendor.orders_count || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Project Distribution */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-emerald-400" />
            Projects Supported by this Contractor ({vendor.projects.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any project to view its full dossier, donor documents, and counterpart awards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendor.projects.map((proj: any) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    Project ID: {proj.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {proj.order_count} order{proj.order_count > 1 ? 's' : ''}
                  </span>
                </div>

                <Link
                  href={`/undp-projects/${proj.id}`}
                  className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 block leading-snug"
                  title={proj.title}
                >
                  {proj.title}
                </Link>

                {proj.locations && proj.locations.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{proj.locations.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Earned from Project</div>
                  <div className="text-base font-black text-emerald-400 font-mono">
                    ${proj.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <Link
                  href={`/undp-projects/${proj.id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-colors"
                  title="View Project Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Work Done & Purchase Orders Table across all projects */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <ReceiptText className="w-6 h-6 text-emerald-400" />
              All Work Done &amp; Purchase Orders ({vendor.orders.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Line-item breakdown of every completed contract, description of services, dates, and amounts.
            </p>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 w-fit">
            Total Awarded: ${vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">PO ID</th>
                <th className="py-3.5 px-4 min-w-[200px]">Project</th>
                <th className="py-3.5 px-4 min-w-[320px]">Description of Work Done</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono text-xs">
              {vendor.orders.map((po: any, idx: number) => (
                <tr 
                  key={`${po.order_id}-${idx}`}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  {/* PO ID */}
                  <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                    {po.order_id}
                  </td>

                  {/* Project Title with Link */}
                  <td className="py-3.5 px-4 font-sans text-xs">
                    <Link
                      href={`/undp-projects/${po.project_id}`}
                      className="font-bold text-slate-200 hover:text-emerald-400 transition-colors line-clamp-1 block"
                      title={po.project_title}
                    >
                      {po.project_title}
                    </Link>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ID: {po.project_id}
                    </span>
                  </td>

                  {/* Description of Work Done */}
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    {cleanDescription(po.description)}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 font-sans text-slate-400 whitespace-nowrap">
                    {formatDate(po.order_date)}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-bold text-right text-emerald-400 whitespace-nowrap font-mono text-sm">
                    ${Number(po.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold border-t border-slate-800 text-xs">
              <tr>
                <td colSpan={4} className="py-3.5 px-4 text-right uppercase text-slate-400">
                  Total Value of All Work Done:
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-400 text-sm font-mono font-black">
                  ${vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Back button */}
      <div className="pt-6 border-t border-slate-800">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Contractor Directory (364 Vendors)
        </Link>
      </div>
    </div>
  );
}
