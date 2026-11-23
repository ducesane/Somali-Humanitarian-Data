import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Activity, 
  Network, 
  Smartphone, 
  ArrowUpRight, 
  Globe, 
  Sparkles, 
  FileText, 
  Users, 
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ReceiptText
} from 'lucide-react';
import { getAllNGOs, getNGOBySlug } from '@/lib/data';

interface NgoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const ngos = getAllNGOs();
  return ngos.map((n) => ({
    slug: n.slug,
  }));
}

export default async function NgoDetailPage({ params }: NgoPageProps) {
  const { slug } = await params;
  const ngo = getNGOBySlug(slug);

  if (!ngo) {
    notFound();
  }

  const trackedFunding = ngo.total_tracked_funding_usd || ngo.shf_budget || 0;
  const hasDirectFunding = trackedFunding > 0;
  const districts = ngo.districts || [];
  const regions = ngo.regions || [];
  const clusters = ngo.clusters || [];
  const shfProjects = ngo.shf_projects || [];
  const ftsGrants = ngo.fts_grants || [];
  const undpContracts = ngo.undp_contracts || [];
  const mechanisms = ngo.funding_mechanisms || [];
  const districtDetails = ngo.district_details || [];

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
          href="/ngos" 
          className="hover:text-emerald-400 transition-colors font-semibold"
        >
          Operational Partners
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate max-w-md">
          {ngo.name}
        </span>
      </nav>

      {/* Main Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider ${
                ngo.type === 'NNGO'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : ngo.type === 'INGO'
                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                  : 'bg-purple-950 text-purple-400 border border-purple-800'
              }`}
            >
              {ngo.type === 'NNGO' ? 'SOMALI NATIONAL NGO (NNGO)' : ngo.type === 'INGO' ? 'INTERNATIONAL NGO (INGO)' : 'UN AGENCY'}
            </span>

            {hasDirectFunding ? (
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Direct Grantee: ${trackedFunding.toLocaleString()}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-slate-400" />
                <span>Downstream Sub-Grant Implementing Partner</span>
              </span>
            )}

            {ngo.cwg_cva_active && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>CWG Cash Delivery Partner</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dossier-builder?ngo=${encodeURIComponent(ngo.name)}`}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-teal-950/40"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Proposal Evidence Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {ngo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {ngo.funding_tier || 'Frontline Humanitarian Operational Partner in Somalia'} • UN OCHA 3W Tracked Partner
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Frontline Field Actions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {ngo.total_activities}
            </div>
            <p className="text-[11px] text-slate-400">
              Verified 3W deployments
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Districts Active
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {districts.length}
            </div>
            <p className="text-[11px] text-slate-400">
              Across {regions.length} administrative regions
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tracked Direct Funding
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">
              {hasDirectFunding ? `$${(trackedFunding / 1000).toFixed(0)}k` : '$0'}
            </div>
            <p className="text-[11px] text-slate-400">
              {hasDirectFunding ? 'Direct SHF / Bilateral' : 'Sub-Grant IP funding'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Clusters
            </span>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {clusters.length}
            </div>
            <p className="text-[11px] text-slate-400">
              Emergency response sectors
            </p>
          </div>
        </div>
      </div>

      {/* PILLAR 1: FINANCIAL & FUNDING AUDIT ("IF THEY GET FUNDS") */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            1. Funding Status & Financial Audit ("If They Get Funds")
          </h2>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Operational & Funding Narrative</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {ngo.funding_narrative || 
               `${ngo.name} executes frontline humanitarian assistance in Somalia, deploying ${ngo.total_activities} operational actions across ${districts.length} districts in coordination with UN clusters and humanitarian partners.`}
            </p>
          </div>

          {/* Breakdown if funded */}
          {hasDirectFunding ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Verified Primary Grants Received: ${(trackedFunding).toLocaleString()}
              </h3>

              {/* Verified SHF Projects */}
              {shfProjects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Somalia Humanitarian Fund (SHF / OCHA CBPF) Allocations ({shfProjects.length})</span>
                    <span className="font-mono text-white">
                      Subtotal: ${(shfProjects.reduce((acc, p) => acc + p.budget, 0)).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {shfProjects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/80 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                              {proj.project_title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                              <span className="text-emerald-400 font-semibold">{proj.fund_source}</span>
                              <span>•</span>
                              <span>Year: <strong className="text-slate-300">{proj.allocation_year}</strong></span>
                              <span>•</span>
                              <span>Status: <strong className="text-emerald-400">{proj.status}</strong></span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-lg sm:text-xl font-black font-mono text-emerald-400 block">
                              ${proj.budget.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Direct: ${(proj.direct_cost || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {proj.target_beneficiaries && proj.target_beneficiaries.total > 0 && (
                          <div className="pt-2 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-slate-900/60">
                              <span className="text-[10px] text-slate-500 block">Total Target</span>
                              <span className="font-bold text-teal-300">{proj.target_beneficiaries.total.toLocaleString()}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60">
                              <span className="text-[10px] text-slate-500 block">Women</span>
                              <span className="font-bold text-white">{proj.target_beneficiaries.women.toLocaleString()}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60">
                              <span className="text-[10px] text-slate-500 block">Girls</span>
                              <span className="font-bold text-white">{proj.target_beneficiaries.girls.toLocaleString()}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60">
                              <span className="text-[10px] text-slate-500 block">Men</span>
                              <span className="font-bold text-white">{proj.target_beneficiaries.men.toLocaleString()}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/60">
                              <span className="text-[10px] text-slate-500 block">Boys</span>
                              <span className="font-bold text-white">{proj.target_beneficiaries.boys.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Bilateral Grants (FTS Tracked) */}
              {ftsGrants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                    Direct Bilateral Sovereign Grants (FTS Tracked)
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {ftsGrants.map((grant, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-blue-800/80 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">
                            Source Donor: {grant.source_donor}
                          </span>
                          <span className="text-base font-black font-mono text-blue-300">
                            ${grant.amount_usd.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {grant.description}
                        </p>
                        <span className="text-xs text-slate-400">Sector: <strong className="text-slate-200">{grant.sector}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UNDP Contracts */}
              {undpContracts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    UNDP Somalia Institutional Contracts & Purchase Orders
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {undpContracts.map((c, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-amber-800/80 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white">Agency: {c.source_agency}</span>
                          <span className="text-base font-black font-mono text-amber-300">
                            ${c.total_amount_usd.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Executed across {c.orders_count} purchase orders under {c.projects_count} community project(s).
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unfunded Direct / Downstream IP Analysis */
            <div className="p-5 rounded-2xl bg-slate-950 border border-blue-900/50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                <Network className="w-4 h-4 text-blue-400" />
                <span>Downstream Sub-Granting Financial Architecture</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Like over 75% of local NGOs operating in Somalia, <strong>{ngo.name}</strong> does not receive direct primary grants from bilateral sovereign donors on the UN OCHA Financial Tracking Service (FTS). 
                Instead, funding is channeled downstream through <strong>Field-Level Agreements (FLAs)</strong> with UN agency cluster leads (WFP, UNICEF, UNHCR, IOM) and sub-grants from INGO consortia (such as BRCiS and SomReP). 
                Under this model, the organization carries out frontline field actions while compliance risk and financial management are handled upstream.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PILLAR 2: HOW THEY GET FUNDS (CHANNELS & MECHANICS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            2. Funding Modalities & Channels ("How They Get the Funds")
          </h2>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Visual Funding Pipeline Flowchart */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Humanitarian Funding Flow Pipeline for {ngo.acronym || ngo.name}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Stage 1: Origin</span>
                <span className="font-bold text-white block">Global Donors</span>
                <span className="text-[11px] text-slate-400">USAID, ECHO, FCDO, SHF Pooled Donors</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Stage 2: Intermediary</span>
                <span className="font-bold text-teal-300 block">Fund Manager / Lead</span>
                <span className="text-[11px] text-slate-400">OCHA SHF / UN Lead (WFP, UNICEF) / INGO Lead</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Stage 3: Frontline NGO</span>
                <span className="font-bold text-emerald-300 block">{ngo.acronym || ngo.name.slice(0, 18)}</span>
                <span className="text-[11px] text-slate-300">Frontline Field Delivery & Staff</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Stage 4: Ground Impact</span>
                <span className="font-bold text-white block">Target Communities</span>
                <span className="text-[11px] text-slate-400">{districts.length} Districts across {regions.length} Regions</span>
              </div>
            </div>
          </div>

          {/* Detailed Channels Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Specific Funding Mechanisms Operationalized
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mechanisms.map((mech, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {mech.is_verified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Network className="w-4 h-4 text-slate-500" />
                      )}
                      {mech.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mech.is_verified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {mech.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mech.details}
                  </p>

                  <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-900 truncate">
                    Path: {mech.channel_path}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 3: WHERE THEY DO ACTIVITIES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            3. Territorial Presence & Activity Map ("Where They Do Activities")
          </h2>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Quick Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">
                Active in {districts.length} Districts across {regions.length} Regions
              </span>
              <p className="text-xs text-slate-400">
                Click any district badge below to inspect localized severity, ETT displacement, and health audits.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {ngo.total_activities} Total Frontline Deployments
            </span>
          </div>

          {/* District Pills Cloud */}
          <div className="flex flex-wrap gap-2">
            {districts.map((d) => {
              const slug = d.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link
                  key={d}
                  href={`/districts/${slug}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-600 text-xs font-bold text-slate-300 hover:text-emerald-300 transition-all flex items-center gap-2 group"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  <span>{d}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>

          {/* Clusters & Regions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Target Clusters & Sectors ({clusters.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {clusters.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-teal-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Administrative Regions Covered ({regions.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {regions.map((r) => (
                  <span key={r} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Frontline Actions Matrix */}
          {districtDetails.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Complete Field Activity Deployments ({districtDetails.length} Sector Actions)
              </span>

              <div className="rounded-2xl border border-slate-800 overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold sticky top-0">
                      <tr>
                        <th className="p-3">District</th>
                        <th className="p-3">Region</th>
                        <th className="p-3">Cluster / Sector</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                      {districtDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-bold text-white">
                            <Link 
                              href={`/districts/${item.district.toLowerCase().replace(/\s+/g, '-')}`}
                              className="hover:text-emerald-400 transition-colors"
                            >
                              {item.district}
                            </Link>
                          </td>
                          <td className="p-3 text-slate-400">{item.region}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-teal-300 border border-slate-800">
                              {item.cluster}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">
                            {item.actions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/ngos"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Operational Partners</span>
        </Link>

        <Link
          href={`/dossier-builder?ngo=${encodeURIComponent(ngo.name)}`}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-teal-950/40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Evidence Dossier for {ngo.acronym || ngo.name}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
