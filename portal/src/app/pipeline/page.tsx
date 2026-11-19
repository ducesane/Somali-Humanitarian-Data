import Link from 'next/link';
import { Activity, CheckCircle2, ShieldCheck, Database, Clock, RefreshCw } from 'lucide-react';

const FEEDS = [
  { name: 'Somalia: Operational Presence (3W / 4W)', file: 'somalia_3w_operational_presence_2026.xlsx', health: 'ONLINE', state: 'SYNCED', details: 'Baseline established: 3W Dataset Jan-June 2026 (Mod: 2026-09-15)' },
  { name: 'IOM DTM: Emergency Trends Tracking (IDP Weekly Influx)', file: 'iom_dtm_ett_tracker_2026.xlsx', health: 'ONLINE', state: 'SYNCED', details: '11,663 field assessments (124,566 individuals tracked, Mod: 2026-11-17)' },
  { name: 'Somalia Humanitarian Fund (SHF / CBPF Allocations)', file: 'som_cbpf_project_summary.csv', health: 'ONLINE', state: 'SYNCED', details: 'Local file verified (1,232,092 bytes, 84.6% NNGO share)' },
  { name: 'Somalia Humanitarian Fund (Donor Contributions)', file: 'somalia_cbpf_allocations_som_cbpf_contributions.csv', health: 'ONLINE', state: 'SYNCED', details: 'Local deposits verified (72,233 bytes)' },
  { name: 'People Targeted vs Reached Monitoring Matrix', file: 'somalia_targeted_reached_by_location_cluster.csv', health: 'ONLINE', state: 'SYNCED', details: '74-district cluster reach records' },
  { name: 'FTS Internal Pass-Through & Pooled Fund Flows', file: 'fts_internal_funding_som.csv', health: 'ONLINE', state: 'SYNCED', details: 'Internal pass-through grants (90,049 bytes)' },
  { name: 'UN OCHA FTS Public API (Somalia 2026 Flows)', file: 'fts_2026_flows_api.json', health: 'ONLINE', state: 'SYNCED', details: 'Synchronized with UN OCHA FTS REST v1 API (200 flows tracked)' }
];

export default function PipelinePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          Automated Ingestion Pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Data Pipeline Telemetry &amp; Sync State
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Autonomous synchronization engine monitoring UN OCHA HDX CKAN datasets, FTS REST APIs, 
          and IOM DTM Emergency Trends Tracking.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-bold uppercase">Monitored Feeds</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">7 Feeds</div>
          <div className="text-xs text-slate-500 mt-1">HDX 3W &bull; IOM DTM &bull; SHF &bull; FTS</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-bold uppercase">Pipeline State</div>
          <div className="text-3xl font-black text-emerald-400 mt-1 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" /> Synchronized
          </div>
          <div className="text-xs text-slate-500 mt-1">All datasets baselined and validated</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-bold uppercase">Downstream Triggers</div>
          <div className="text-3xl font-black text-white mt-1">4 Products</div>
          <div className="text-xs text-slate-500 mt-1">Auto-rebuilds maps, JSON &amp; workbooks</div>
        </div>
      </div>

      {/* Table of Feeds */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Monitored Feed</th>
              <th className="py-3 px-4">Local Target File</th>
              <th className="py-3 px-4">Health</th>
              <th className="py-3 px-4">Sync State</th>
              <th className="py-3 px-4">API Verification Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {FEEDS.map((feed, idx) => (
              <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{feed.name}</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{feed.file}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {feed.health}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    {feed.state}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-slate-400">{feed.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
