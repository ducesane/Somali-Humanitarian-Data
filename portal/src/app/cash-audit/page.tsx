import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CashTransferAuditDashboard from '@/components/CashTransferAuditDashboard';
import { ShieldCheck, Smartphone, Database, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Mobile Cash (CVA) Audit & Gatekeeper Forensics | Somalia Humanitarian Intelligence',
  description: 'Third-party monitoring of $592.1M in humanitarian mobile cash transfers across Somalia. Algorithmic detection of camp gatekeeper skimming, batch-cashing, and ghost SIMs.',
};

export default function CashAuditPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Breadcrumb & Dual-TPM Switcher Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">Third-Party Monitoring (TPM)</span>
            <span>/</span>
            <span className="text-slate-200">Mobile Cash & Gatekeeper Forensics</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <Link
              href="/audit"
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Satellite Boreholes (EO)</span>
            </Link>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold flex items-center gap-1.5 shadow">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Cash (CVA)</span>
            </span>
          </div>
        </div>

        {/* The Main Cash Audit Dashboard Component */}
        <CashTransferAuditDashboard />

        {/* Educational Fiduciary Architecture Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Standard Operating Procedure</span>
            <h2 className="text-2xl font-bold text-white mt-1">How TPM Firms Execute Mobile Cash Audits on a Laptop</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              International donors (USAID, World Bank, European Union) cannot legally disburse unconditional cash without independent post-distribution monitoring (PDM) proving that funds reached verified vulnerable families rather than armed checkpoints or camp gatekeepers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Ledger Anomaly Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingest telecom bulk disbursement CSVs (Hormuud EVC Plus / Telesom). Automatically scan transaction timestamps and destination merchant codes for batch-cashing velocity flags.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">REACH Gatekeeper Cross-Reference</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Overlay camp coordinates against the 2,987 REACH Detailed Site Assessment (DSA) records. Flag settlements where camp managers demand illegal fees or gatekeeper taxation.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Donor Assurance Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate a formal Fiduciary Verification Dossier with Red/Amber/Green risk certification, allowing donor fund managers to satisfy US Congressional and European parliamentary audits.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
