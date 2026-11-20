import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDistrictBySlug, getAllDistricts, getDistrictCVA } from '@/lib/data';
import { 
  MapPin, 
  ShieldAlert, 
  Users, 
  Building2, 
  Layers, 
  FileText, 
  ArrowLeft, 
  Compass, 
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Tent,
  Clock,
  Calendar,
  Info,
  ExternalLink
} from 'lucide-react';

interface DistrictPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const districts = getAllDistricts();
  return districts.map((d) => ({
    slug: d.district.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function DistrictDetailPage({ params }: DistrictPageProps) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  const ett = district.ett_2026;
  const hasArrivals = (ett?.arrivals || 0) > 0;
  const cva = getDistrictCVA(district.district);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link & Top Temporal Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link 
          href="/districts" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to 90 Districts
        </Link>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multi-Source Harmonized Intelligence Baseline</span>
        </div>
      </div>

      {/* Main District Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {district.region} Region
              </span>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                OCHA PCode: {district.adm2_pcode}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {district.district} District
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dossier-builder?district=${encodeURIComponent(district.district)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950"
            >
              <FileText className="w-4 h-4" />
              Build Proposal Dossier
            </Link>
          </div>
        </div>

        {/* 4 Core Indicators with Explicit Temporal Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
              <span>Active NGOs</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{district.unique_orgs_count}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {district.org_type_counts?.NNGO || 0} NNGOs &bull; {district.org_type_counts?.INGO || 0} INGOs
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900">
                UN OCHA 3W (Jan–Jun)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
              <span>Field Actions</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{district.total_activities}</div>
            <div className="text-[11px] text-slate-500 mt-1">Reported cluster operations</div>
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900">
                UN OCHA 3W (Jan–Jun)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
              <span>Target Population</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{district.target.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1">Affected: {district.affected.toLocaleString()}</div>
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900">
                HNRP Annual Target
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
              <span>Reached Coverage</span>
            </div>
            <div className={`text-2xl font-black mt-1 ${district.reach_ratio_pct >= 80 ? 'text-emerald-400' : district.reach_ratio_pct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {district.reach_ratio_pct}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{district.reached.toLocaleString()} reached</div>
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900">
                HNRP Annual Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Referenced Humanitarian Cash & IDP Camp Baseline (if available) */}
      {cva && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Cash & Voucher Programming &amp; IDP Settlements Baseline
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cross-referenced operational intelligence from the UN Somalia Cash Working Group (CWG) and REACH Initiative.
              </p>
            </div>
            <Link
              href="/cash-audit/data"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Master Data Window
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Transferred</span>
              <span className="text-base font-black text-emerald-400 block mt-1">
                ${cva.total_usd_transferred.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-emerald-500/80 mt-1 block">CWG 2023 Flow</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Money</span>
              <span className="text-base font-black text-emerald-400 block mt-1">
                ${cva.mobile_money_usd.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-emerald-500/80 mt-1 block">CWG 2023 Flow</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Vouchers</span>
              <span className="text-base font-black text-indigo-400 block mt-1">
                ${cva.voucher_usd.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-indigo-400/80 mt-1 block">CWG 2023 Flow</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Households</span>
              <span className="text-base font-black text-white block mt-1">
                {cva.households_reached.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-1 block">CWG 2023 Dispatches</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">IDP Camps</span>
              <span className="text-base font-black text-white block mt-1">
                {cva.idp_camps_count} camps
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-1 block">REACH Feb 2022 Census</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Shelters</span>
              <span className="text-base font-black text-slate-300 block mt-1">
                {cva.total_idp_shelters.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-1 block">REACH Feb 2022 Census</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              <span className="text-slate-300 font-semibold">Active Cash Implementers ({cva.active_organizations.length}): </span>
              <span>{cva.active_organizations.join(', ')}</span>
            </div>
            <div className="font-mono text-[11px] text-amber-400/90 shrink-0">
              Gatekeeper Camps: {cva.gatekeeper_camps_count} of {cva.idp_camps_count} ({cva.gatekeeper_prevalence_pct}%)
            </div>
          </div>
        </div>
      )}

      {/* Emergency Influx Alert (if present) */}
      {hasArrivals && ett && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-rose-200">
                IOM DTM Emergency Displacement Alert
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-900/50 border border-rose-800 text-[11px] font-mono text-rose-300 shrink-0">
              Survey Window: June 14 – Nov 11, 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40">
              <span className="text-xs text-rose-300 font-bold block uppercase">Recent Arrivals:</span>
              <span className="text-2xl font-black text-white mt-1 block">
                +{ett.arrivals.toLocaleString()} individuals
              </span>
              <span className="text-xs text-slate-400">
                Departures: {ett.departures.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40">
              <span className="text-xs text-rose-300 font-bold block uppercase">Primary Shock Driver:</span>
              <span className="text-base font-bold text-white mt-1 block">
                {ett.top_cause}
              </span>
              <span className="text-xs text-slate-400">
                Origin: {ett.top_origin || 'Local Movements'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/40">
              <span className="text-xs text-rose-300 font-bold block uppercase">Top Urgent Unmet Need:</span>
              <span className="text-base font-bold text-rose-400 mt-1 block">
                {ett.top_need}
              </span>
              <span className="text-xs text-slate-400">
                Critical gap for immediate proposal funding
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Clusters Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Active Humanitarian Clusters ({Object.keys(district.cluster_counts || {}).length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Source: UN OCHA 3W (Jan–Jun)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(district.cluster_counts || {}).map(([cluster, count]) => (
            <div key={cluster} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">{cluster}</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold">
                {count} actions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Operating NGO Roster Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            Operating Organizations Roster ({district.organizations?.length || 0})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Cross-Referenced OCHA &amp; SHF</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Sectors / Clusters</th>
                <th className="py-3 px-4 text-center">
                  <span>3W Actions</span>
                  <span className="block text-[9px] text-emerald-400 lowercase font-normal">Jan–Jun</span>
                </th>
                <th className="py-3 px-4 text-right">
                  <span>SHF Grant</span>
                  <span className="block text-[9px] text-teal-400 lowercase font-normal">CBPF 2026</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {district.organizations?.map((org, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <Link href={`/ngos/${encodeURIComponent(org.name)}`} className="hover:text-emerald-400 transition-colors">
                      {org.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      org.type === 'NNGO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      org.type === 'INGO' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-purple-950 text-purple-400 border border-purple-800'
                    }`}>
                      {org.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {org.clusters?.join(', ')}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-white">
                    {org.activities}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-400">
                    {org.shf_budget > 0 ? `$${org.shf_budget.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temporal Alignment & Data Architecture Guide */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Data Architecture &amp; Temporal Coverage Notice
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The indicators displayed for <strong>{district.district}</strong> originate from distinct official UN data collection instruments with differing survey cycles. They are harmonized as complementary contextual layers rather than a single contiguous timeline:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> UN OCHA 3W
            </div>
            <div className="text-[11px] text-slate-300 font-medium">Cycle: January – June</div>
            <div className="text-[10px] text-slate-500">Measures partner operational presence and reported cluster actions.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> HNRP Targets &amp; Reached
            </div>
            <div className="text-[11px] text-slate-300 font-medium">Cycle: Annual Planning Cycle</div>
            <div className="text-[10px] text-slate-500">Measures cluster-targeted population vs cumulative people reached.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> IOM DTM Displacement
            </div>
            <div className="text-[11px] text-slate-300 font-medium">Cycle: June 14 – Nov 11, 2026</div>
            <div className="text-[10px] text-slate-500">High-frequency weekly emergency tracking for rapid crisis response.</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> CWG &amp; REACH Baselines
            </div>
            <div className="text-[11px] text-slate-300 font-medium">Cycle: CWG 2023 &bull; REACH 2022</div>
            <div className="text-[10px] text-slate-500">Cash disbursement flow ($592M) and physical IDP camp census.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
