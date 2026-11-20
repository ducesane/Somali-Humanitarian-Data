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
  FileText,
  Clock,
  Coins,
  Trophy
} from 'lucide-react';
import vendorsData from '@/data/undp_somalia_vendors.json';
import VendorWorkExplorer from '@/components/VendorWorkExplorer';

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

export default async function VendorDetailPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = vendorsData.find((v) => v.slug === slug);

  if (!vendor) {
    notFound();
  }

  const isTier1 = vendor.total_amount >= 1000000;
  const yearlyBreakdown = (vendor as any).yearly_breakdown || {};
  const operatingLocations = (vendor as any).operating_locations || [];
  const firstActivity = (vendor as any).first_activity || 'N/A';
  const latestActivity = (vendor as any).latest_activity || vendor.latest_activity || 'N/A';
  const latestOrder = vendor.orders.find((o: any) => o.order_date === latestActivity) || vendor.orders[0];
  const firstOrder = vendor.orders.find((o: any) => o.order_date === firstActivity) || vendor.orders[vendor.orders.length - 1];

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
            {latestActivity !== 'N/A' && (
              <span className="flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Latest Disbursement: <strong className="text-white font-mono">{formatDate(latestActivity)}</strong>
                {latestOrder && (
                  <span className="text-emerald-400 font-mono text-xs">
                    (${Number(latestOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                )}
                {latestOrder && (
                  <span className="text-slate-400 text-[11px] font-normal hidden sm:inline">
                    &bull; {latestOrder.project_title}
                  </span>
                )}
              </span>
            )}
            {firstActivity !== 'N/A' && (
              <span className="flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                First Award: <strong className="text-slate-200 font-mono">{formatDate(firstActivity)}</strong>
                {firstOrder && (
                  <span className="text-slate-300 font-mono text-xs">
                    (${Number(firstOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                )}
                {firstOrder && (
                  <span className="text-slate-500 text-[11px] font-normal hidden sm:inline">
                    &bull; {firstOrder.project_title}
                  </span>
                )}
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
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mt-2.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Contract Period: <strong className="text-slate-200">{formatDate(firstActivity)} &ndash; {formatDate(latestActivity)}</strong>
            </span>
            {operatingLocations.length > 0 && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Operational Footprint: <span className="text-slate-300 font-medium">{operatingLocations.slice(0, 6).join(', ')}{operatingLocations.length > 6 ? ` +${operatingLocations.length - 6} more` : ''}</span>
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Tracked Earnings</div>
            <div className="text-xl sm:text-3xl font-black text-emerald-400 mt-0.5">
              ${vendor.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Across all UNDP Somalia projects</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Purchase Orders</div>
            <div className="text-xl sm:text-3xl font-black text-white mt-0.5">
              {vendor.orders_count} Orders
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Individual disbursements</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Projects Involved</div>
            <div className="text-xl sm:text-3xl font-black text-white mt-0.5">
              {vendor.projects_count} Projects
            </div>
            <div className="text-[10px] text-slate-500 mt-1">UN &amp; Joint programmes</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Average Value Per PO</div>
            <div className="text-xl sm:text-3xl font-black text-slate-300 mt-0.5">
              ${(vendor.total_amount / (vendor.orders_count || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Disbursement average</div>
          </div>
        </div>
      </div>

      {/* Yearly Financial Trajectory Section */}
      {Object.keys(yearlyBreakdown).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Yearly Disbursement Trajectory ({Object.keys(yearlyBreakdown).length} Active Years)
            </h2>
            <span className="text-xs text-slate-400">
              Total Cumulative: <strong className="text-emerald-400">${vendor.total_amount.toLocaleString()}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(yearlyBreakdown).map(([year, amount]: [string, any]) => {
              const pct = vendor.total_amount > 0 ? (amount / vendor.total_amount) * 100 : 0;
              const yearOrders = vendor.orders.filter((o: any) => o.order_date?.startsWith(year)).length;
              return (
                <div 
                  key={year}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 hover:border-emerald-800/80 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded">
                      {year}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-base font-black text-emerald-400 font-mono mt-1">
                    ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {yearOrders} order{yearOrders > 1 ? 's' : ''} in {year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

                {/* Dates Active on this Project */}
                <div className="text-[11px] text-slate-400 pt-1 space-y-0.5 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Latest Payment:</span>
                    <span className="font-semibold text-slate-300 font-mono">
                      {formatDate(proj.latest_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Period Active:</span>
                    <span className="text-slate-400 font-mono">
                      {formatDate(proj.first_date)} &ndash; {formatDate(proj.latest_date)}
                    </span>
                  </div>
                </div>
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

      {/* UNGM Official Contract Award Wins (if any) */}
      {(vendor as any).ungm_awards && (vendor as any).ungm_awards.length > 0 && (
        <div className="space-y-4 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 border border-amber-800/60 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Verified UNGM Contract Award Wins ({(vendor as any).ungm_awards.length})
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Official bid wins confirmed on the United Nations Global Marketplace (UNGM) across UN Agencies.
              </p>
            </div>
            <Link
              href="/tenders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-all self-start sm:self-center"
            >
              <span>Explore All UNGM Awards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {(vendor as any).ungm_awards.map((aw: any) => (
              <div
                key={aw.award_id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-amber-900/40 space-y-2 hover:border-amber-700/60 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {aw.agency || 'UN Agency'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Ref: {aw.reference || 'N/A'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {aw.award_date}
                  </span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-2">
                  {aw.title}
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Award #{aw.award_id}
                  </span>
                  <a
                    href={aw.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>View UNGM Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Work Explorer with Year Filter, Search, CSV Export, Dates & Amounts */}
      <VendorWorkExplorer 
        orders={vendor.orders}
        vendorName={vendor.name}
        totalAmount={vendor.total_amount}
      />

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
