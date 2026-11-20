import React from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  ReceiptText,
  Clock
} from 'lucide-react';
import ProcurementExplorer, { TenderNotice } from '@/components/ProcurementExplorer';
import pipelineData from '@/data/somalia_procurement_pipeline.json';

export const metadata = {
  title: 'Somalia Live Procurement & UN Tenders | Humanitarian Data Platform',
  description: 'Live active procurement notices across Somalia from UNGM (UNICEF, FAO, IOM, UNOPS, WHO, UNHCR) mapped to verified historical contractors and UNDP projects.',
};

export default function TendersPage() {
  const notices = pipelineData as TenderNotice[];

  // Top summary metrics
  const uniqueAgencies = Array.from(new Set(notices.map((n) => n.agency))).length;
  const uniqueSectors = Array.from(new Set(notices.map((n) => n.sector))).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/vendors" className="hover:text-emerald-400 transition-colors">
            Vendor Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-medium">Live Procurement Pipeline</span>
        </nav>

        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Gateway &bull; UN Global Marketplace (UNGM)
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Somalia Live Procurement &amp; Tender Intelligence
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Real-time pipeline of active tenders published for operations in Somalia across all UN Agencies 
              (UNICEF, FAO, IOM, UNOPS, WHO, UNHCR, ILO, ITC). Every notice is cross-mapped with verified historical 
              contractors, award amounts, and ongoing UNDP programmes.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                <Radio className="w-3.5 h-3.5 text-emerald-400" /> Active Tenders
              </div>
              <div className="text-2xl font-black text-white">{notices.length}</div>
              <div className="text-[11px] text-emerald-400/90 mt-0.5">Live on UNGM portal</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-sky-400" /> UN Agencies
              </div>
              <div className="text-2xl font-black text-white">{uniqueAgencies}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">UNICEF, FAO, IOM, UNOPS...</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Operational Sectors
              </div>
              <div className="text-2xl font-black text-white">{uniqueSectors}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Civil works, TVET, Med, Logistics</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Mapped Vendors
              </div>
              <div className="text-2xl font-black text-white">364</div>
              <div className="text-[11px] text-slate-400 mt-0.5">$87.1M verified track record</div>
            </div>
          </div>
        </div>

        {/* Interactive Explorer Component */}
        <ProcurementExplorer initialNotices={notices} />

      </div>
    </div>
  );
}
