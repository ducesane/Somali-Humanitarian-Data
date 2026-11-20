import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  FileText, 
  Download, 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowLeft,
  FolderDown, 
  FileSpreadsheet, 
  CheckCircle2,
  ChevronRight,
  ReceiptText,
  BadgeDollarSign
} from 'lucide-react';
import undpData from '@/data/undp_somalia_projects_documents.json';
import vendorNameToSlugRaw from '@/data/vendor_name_to_slug.json';

const vendorNameToSlug = vendorNameToSlugRaw as Record<string, string>;

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return undpData.map((p) => ({
    id: p.id,
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

export default async function UndpProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = undpData.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const purchaseOrders = (project as any).purchase_orders || [];
  const totalPoSpend = purchaseOrders.reduce((acc: number, po: any) => acc + (po.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation - Exactly matching user specification */}
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
        <Link 
          href="/" 
          className="hover:text-emerald-400 transition-colors font-semibold"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link 
          href="/undp-projects" 
          className="hover:text-emerald-400 transition-colors font-semibold"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-md">
          {project.title}
        </span>
      </nav>

      {/* Project Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
              PO ID / Project: {project.id}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Unit: SOMALIA (SOM)
            </span>
            {project.latest_po_date && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Latest PO: {formatDate(project.latest_po_date)}
              </span>
            )}
          </div>

          <a
            href={`https://open.undp.org/projects/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            <span>View on Open UNDP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-sm text-slate-400 mt-2 max-w-4xl leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Project Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Tracked PO Spend</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              ${totalPoSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Total Purchase Orders</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {purchaseOrders.length} Orders
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Official Documents</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {project.documents.length} Files
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Locations</div>
            <div className="text-sm font-semibold text-slate-300 mt-1 truncate">
              {project.locations.length > 0 ? project.locations.join(', ') : 'Somalia (National)'}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders Section - EXACTLY matching user specification */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <ReceiptText className="w-6 h-6 text-emerald-400" />
              Purchase Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracked procurement contracts and disbursement records for {project.title}
            </p>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 w-fit">
            {purchaseOrders.length} Tracked Orders &bull; ${totalPoSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {purchaseOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">PO ID</th>
                  <th className="py-3.5 px-4">Vendor</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Description</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono text-xs">
                {purchaseOrders.map((po: any, idx: number) => (
                  <tr 
                    key={`${po.order_id}-${idx}`}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    {/* PO ID */}
                    <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                      {po.order_id}
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4 font-sans font-bold whitespace-nowrap">
                      {vendorNameToSlug[po.vendor_name] || vendorNameToSlug[(po.vendor_name || '').toLowerCase()] ? (
                        <Link
                          href={`/vendors/${vendorNameToSlug[po.vendor_name] || vendorNameToSlug[(po.vendor_name || '').toLowerCase()]}`}
                          className="text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group"
                          title="View all work done by this vendor across Somalia"
                        >
                          <span>{po.vendor_name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        </Link>
                      ) : (
                        <span className="text-white">{po.vendor_name}</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 font-sans text-slate-300">
                      {cleanDescription(po.description || po.raw_description)}
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
                    Total Tracked Procurement:
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 text-sm font-mono font-black">
                    ${totalPoSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
            No individual purchase order line items published for this project yet.
          </div>
        )}
      </div>

      {/* Official Project Documents & Downloads Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-emerald-400" />
            Official Project Documents &amp; Downloads
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Download verified project documents, budgets, results matrices, and signed agreements
          </p>
        </div>

        {project.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.documents.map((doc: any, idx: number) => {
              const isPdf = doc.format.includes('pdf');
              const isDoc = doc.format.includes('doc') || doc.format.includes('word');
              const isXls = doc.format.includes('sheet') || doc.format.includes('excel') || doc.format.includes('xlsx');

              return (
                <div
                  key={`${doc.url}-${idx}`}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {isPdf && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-950 text-red-400 border border-red-800">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                      {isDoc && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800">
                          <FileText className="w-3 h-3" /> WORD
                        </span>
                      )}
                      {isXls && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <FileSpreadsheet className="w-3 h-3" /> EXCEL
                        </span>
                      )}
                      {!isPdf && !isDoc && !isXls && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          <ExternalLink className="w-3 h-3" /> PORTAL LINK
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {doc.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2" title={doc.title}>
                      {doc.title}
                    </h3>
                  </div>

                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
            No public document attachments available for this project.
          </div>
        )}
      </div>

      {/* Back to all projects footer button */}
      <div className="pt-6 border-t border-slate-800">
        <Link
          href="/undp-projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All UNDP Somalia Projects
        </Link>
      </div>
    </div>
  );
}
