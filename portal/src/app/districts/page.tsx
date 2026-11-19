import Link from 'next/link';
import { getAllDistricts } from '@/lib/data';
import { MapPin, Search, ShieldAlert, Users, Layers, ExternalLink } from 'lucide-react';

export default function DistrictsDirectoryPage() {
  const districts = getAllDistricts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          90 Administrative Districts
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Somalia District Evidence Profiles (18 Regions)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Operational presence, cluster activity counts, target vs. reached ratios, and recent IOM DTM 
          emergency displacement inflows across all 90 administrative districts of Somalia.
        </p>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districts.map((d) => {
          const hasArrivals = (d.ett_2026?.arrivals || 0) > 0;
          return (
            <Link
              key={d.adm2_pcode}
              href={`/districts/${d.district.toLowerCase()}`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-600 hover:bg-slate-900 transition-all block group"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                  {d.region}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{d.adm2_pcode}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {d.district}
                </h3>
                {hasArrivals && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    <ShieldAlert className="w-3 h-3" />
                    +{d.ett_2026?.arrivals.toLocaleString()} Influx
                  </span>
                )}
              </div>

              {/* Progress Bar for Reach */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Target vs Reached:</span>
                  <span className={`font-bold ${d.reach_ratio_pct >= 80 ? 'text-emerald-400' : d.reach_ratio_pct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {d.reach_ratio_pct}% ({d.reached.toLocaleString()} / {d.target.toLocaleString()})
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${d.reach_ratio_pct >= 80 ? 'bg-emerald-500' : d.reach_ratio_pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, d.reach_ratio_pct)}%` }}
                  />
                </div>
              </div>

              {/* Quick stats footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">NGOs</div>
                  <div className="font-bold text-white">{d.unique_orgs_count}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Field Actions</div>
                  <div className="font-bold text-white">{d.total_activities}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Sectors</div>
                  <div className="font-bold text-white">{Object.keys(d.cluster_counts || {}).length}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
