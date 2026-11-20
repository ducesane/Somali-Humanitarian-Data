import React from 'react';
import CashTransferAuditDashboard from '@/components/CashTransferAuditDashboard';
import { Smartphone, Database, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Humanitarian Cash & Voucher Assistance (CVA) | Somalia Humanitarian Intelligence',
  description: 'Real UN Cash Working Group (CWG) programming records ($592.1M) and REACH Initiative Detailed Site Assessments across Somalia.',
};

export default function CashAuditPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-semibold">Humanitarian Data</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Cash &amp; Voucher Assistance (CVA)</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cash-audit/data"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Standalone Window ↗</span>
          </Link>
        </div>
      </div>

      {/* The Main Cash Dashboard Component */}
      <CashTransferAuditDashboard />

    </div>
  );
}
