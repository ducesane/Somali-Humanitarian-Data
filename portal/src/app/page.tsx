import Link from 'next/link';
import { 
  getOverviewStats, 
  getTopDistrictsByArrivals, 
  getAllDistricts 
} from '@/lib/data';
import { 
  Building2, 
  MapPin, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  Users, 
  Sparkles,
  Search
} from 'lucide-react';

export default function HomePage() {
  const stats = getOverviewStats();
  const topArrivalDistricts = getTopDistrictsByArrivals(6);
  const districts = getAllDistricts().slice(0, 8);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-16 pb-20 border-b border-emerald-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            2026 Open Humanitarian Intelligence Suite
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
            Mapping the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Real Flow</span> of Aid &amp; Frontline Response in Somalia
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
            An independent open-source intelligence platform cross-referencing UN OCHA 
            <strong> 3W Operational Presence</strong>, <strong>FTS Financial Flows</strong>, 
            <strong> SHF Pooled Funds</strong>, and <strong>IOM DTM Displacement Trends</strong> across all 18 regions and 90 districts.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dossier-builder"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              Build Proposal Dossier
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/districts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explore 90 Districts
            </Link>

            <Link
              href="/ngos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              Browse 204 NGOs
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Flagship Statistical Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Tracked Aid (2026)</div>
            <div className="text-3xl font-black text-white">$349.1M</div>
            <div className="text-xs font-semibold text-rose-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 rotate-180" /> -35.4% YoY Contraction
            </div>
            <div className="text-[11px] text-slate-500 mt-1">From $540.3M in 2025 across FTS</div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-900/50 relative overflow-hidden group hover:border-emerald-700 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Local Somali NGO Footprint</div>
            <div className="text-3xl font-black text-emerald-300">40.8%</div>
            <div className="text-xs font-semibold text-emerald-400 mt-2">
              2,952 Frontline Field Actions
            </div>
            <div className="text-[11px] text-slate-400 mt-1">#1 highest operational share in Somalia</div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-950/60 relative overflow-hidden group hover:border-rose-900 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">Direct FTS Localization</div>
            <div className="text-3xl font-black text-rose-400">0.80%</div>
            <div className="text-xs font-semibold text-rose-300 mt-2">
              Only $2.81M Direct to NNGOs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">98% funded by a single donor (KSrelief)</div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-teal-900/50 relative overflow-hidden group hover:border-teal-700 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">SHF Pooled Fund Localization</div>
            <div className="text-3xl font-black text-teal-300">84.6%</div>
            <div className="text-xs font-semibold text-teal-400 mt-2">
              $19.52M (40 Local Projects)
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Proves high absorptive capacity</div>
          </div>
        </div>
      </section>

      {/* Emergency Inflow Banner (IOM ETT Tracker Nov 2026) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-900/50 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-900/60 border border-rose-700 text-rose-200 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                IOM DTM Emergency Displacement (ETT June–Nov 2026)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                124,566 Displaced Individuals Tracked in Recent Weeks
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                43.4% displaced by severe drought and 19.4% by military/conflict operations. 
                Food assistance (54.2%) and safe drinking water (19.8%) represent the primary urgent unmet needs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/districts"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-950/60"
              >
                View Influx Hotspots
              </Link>
            </div>
          </div>

          {/* Top Influx Districts Pill Grid */}
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topArrivalDistricts.map((d) => (
              <Link
                key={d.adm2_pcode}
                href={`/districts/${d.district.toLowerCase()}`}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-rose-700 transition-colors block text-center"
              >
                <div className="text-xs text-slate-400 font-medium truncate">{d.district}</div>
                <div className="text-base font-black text-rose-400 mt-0.5">
                  +{d.ett_2026?.arrivals.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{d.ett_2026?.top_cause}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured District Directory Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Featured District Evidence Profiles</h2>
            <p className="text-sm text-slate-400 mt-1">
              Select any district to view cluster activities, active NGO roster, and reach metrics.
            </p>
          </div>
          <Link
            href="/districts"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            All 90 Districts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {districts.map((d) => (
            <Link
              key={d.adm2_pcode}
              href={`/districts/${d.district.toLowerCase()}`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-700 hover:bg-slate-900 transition-all block group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {d.region}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{d.adm2_pcode}</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {d.district}
              </h3>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Active Organizations:</span>
                  <span className="font-bold text-white">{d.unique_orgs_count}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Field Actions:</span>
                  <span className="font-bold text-white">{d.total_activities}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Reach:</span>
                  <span className={`font-bold ${d.reach_ratio_pct >= 80 ? 'text-emerald-400' : d.reach_ratio_pct >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {d.reach_ratio_pct}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Proposal Dossier Builder CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-800/40 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            Proposal Evidence Engine
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">
            Generate a 10-Page Verified Grant Proposal Evidence Dossier in 30 Seconds
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Select your target district, cluster, and organization. The engine automatically synthesizes 
            demographic needs, recent IOM ETT displacement inflows, 3W footprint gaps, and non-duplication proof.
          </p>

          <div>
            <Link
              href="/dossier-builder"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950 transition-all hover:scale-105"
            >
              Launch Proposal Dossier Generator
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
