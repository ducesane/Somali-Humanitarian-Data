import Link from 'next/link';
import { getAllNGOs } from '@/lib/data';
import { Building2, MapPin, Layers } from 'lucide-react';

export default function NGOsDirectoryPage() {
  const ngos = getAllNGOs();

  const nngos = ngos.filter((n) => n.type === 'NNGO');
  const ingos = ngos.filter((n) => n.type === 'INGO');
  const un = ngos.filter((n) => n.type === 'UN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-950 border border-teal-800 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          204 Verified Humanitarian Organizations
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Somalia Operational Partner Directory (2026)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          National NGOs, International NGOs, and UN Agencies verified in UN OCHA 3W operational presence 
          across all 90 districts of Somalia.
        </p>

        {/* Counter Summary Tabs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-900/60 text-xs font-bold text-emerald-400">
            {nngos.length} Somali National NGOs (NNGOs)
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs font-bold text-blue-400">
            {ingos.length} International NGOs (INGOs)
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-purple-900/60 text-xs font-bold text-purple-400">
            {un.length} UN Agencies
          </div>
        </div>
      </div>

      {/* NGOs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ngos.map((ngo) => (
          <div
            key={ngo.name}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-600 transition-all block group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                ngo.type === 'NNGO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                ngo.type === 'INGO' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                'bg-purple-950 text-purple-400 border border-purple-800'
              }`}>
                {ngo.type}
              </span>
              <span className="text-slate-400 font-bold">{ngo.total_activities} actions</span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
              {ngo.name}
            </h3>

            {/* Geographical Footprint */}
            <div className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Present in <strong>{ngo.districts_present?.length || 0} districts</strong> ({ngo.regions_present?.length || 0} regions)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">
                  {ngo.clusters_active?.slice(0, 3).join(', ')}
                  {(ngo.clusters_active?.length || 0) > 3 && ` +${(ngo.clusters_active?.length || 0) - 3}`}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <Link
                href={`/dossier-builder?ngo=${encodeURIComponent(ngo.name)}`}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center justify-between w-full"
              >
                <span>Generate NGO Proposal Evidence</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
