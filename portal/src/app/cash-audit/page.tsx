import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CashTransferAuditDashboard from '@/components/CashTransferAuditDashboard';
import { Smartphone, Database, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Humanitarian Cash & Voucher Assistance (CVA) | Somalia Humanitarian Intelligence',
  description: 'Real UN Cash Working Group (CWG) programming records ($592.1M) and REACH Initiative Detailed Site Assessments across Somalia.',
};

export default function CashAuditPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">Humanitarian Data</span>
            <span>/</span>
            <span className="text-slate-200">Cash & Voucher Assistance (CVA) & IDP Settlements</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cash-audit/data"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Master Data Window</span>
            </Link>
          </div>
        </div>

        {/* The Main Cash Dashboard Component */}
        <CashTransferAuditDashboard />

      </main>

      <Footer />
    </div>
  );
}
