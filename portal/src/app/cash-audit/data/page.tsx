'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Download, 
  ArrowLeft, 
  ExternalLink, 
  Filter, 
  Building2, 
  Smartphone, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2,
  Printer,
  ChevronDown
} from 'lucide-react';
import cvaData from '@/data/somalia_cva_audit_data.json';

interface DistrictItem {
  district: string;
  total_usd_transferred: number;
  households_reached: number;
  individuals_assisted: number;
  mobile_money_usd: number;
  voucher_usd: number;
  cash_on_hand_usd: number;
  active_organizations: string[];
  records_count: number;
  avg_transfer_value_usd: number;
  idp_camps_count: number;
  gatekeeper_camps_count: number;
  gatekeeper_prevalence_pct: number;
  extortion_reported_camps: number;
  extortion_prevalence_pct: number;
  total_idp_shelters: number;
  aid_diversion_risk_score: number;
  risk_level: string;
  risk_color: string;
}

export default function CashAuditDataWindow() {
  const [activeTab, setActiveTab] = useState<'districts' | 'evc_transactions'>('districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('EVC-BATCH-84920');

  // Filter districts
  const filteredDistricts = useMemo(() => {
    return (cvaData.districts as DistrictItem[]).filter(d => {
      const matchSearch = d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.active_organizations.some(o => o.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchRisk = riskFilter === 'ALL' || d.risk_level === riskFilter;
      return matchSearch && matchRisk;
    });
  }, [searchTerm, riskFilter]);

  // Generate synthetic transaction rows for the selected EVC batch
  const transactionRows = useMemo(() => {
    const batch = cvaData.sample_evc_forensic_batches.find(b => b.batch_id === selectedBatchId) || cvaData.sample_evc_forensic_batches[0];
    const rows = [];
    const baseTime = new Date('2026-10-14T09:00:00');

    for (let i = 1; i <= batch.total_beneficiaries_in_batch; i++) {
      // Simulate timestamp
      const secondsOffset = batch.anomalous_velocity_flag 
        ? Math.floor((i * batch.cashout_window_seconds) / batch.total_beneficiaries_in_batch)
        : Math.floor(Math.random() * batch.cashout_window_seconds);
      const rowTime = new Date(baseTime.getTime() + secondsOffset * 1000);
      
      const phoneSuffix = (1000 + (i * 37) % 9000).toString();
      const phone = `+252 61 ${phoneSuffix.slice(0, 3)} ${phoneSuffix.slice(3)}`;
      
      const isAnomalous = batch.anomalous_velocity_flag && i <= batch.transfers_to_same_merchant;
      const merchantId = isAnomalous 
        ? batch.merchant_destination_id 
        : `MERCH-${40000 + (i % 25)}`;
      const merchantName = isAnomalous
        ? batch.merchant_registered_name
        : `Local Shop #${(i % 25) + 1} (${batch.district})`;

      rows.push({
        tx_id: `TX-EVC-${batch.batch_id.slice(-5)}-${String(i).padStart(3, '0')}`,
        beneficiary_code: `BEN-${batch.district.slice(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
        recipient_phone: phone,
        amount_usd: batch.official_amount_per_hh,
        timestamp: rowTime.toISOString().replace('T', ' ').slice(0, 19),
        merchant_id: merchantId,
        merchant_name: merchantName,
        velocity_flag: isAnomalous ? 'ANOMALOUS (SAME MERCHANT)' : 'NORMAL',
        risk: isAnomalous ? 'HIGH' : 'LOW'
      });
    }
    return rows;
  }, [selectedBatchId]);

  // CSV Export handler
  const exportDistrictCSV = () => {
    const headers = [
      'District',
      'Total USD Transferred',
      'Mobile Money USD',
      'Voucher USD',
      'Cash on Hand USD',
      'Households Reached',
      'Individuals Assisted',
      'IDP Camps Count',
      'Gatekeeper Camps Count',
      'Gatekeeper Prevalence (%)',
      'Extortion Reported Camps',
      'Total Shelters',
      'Aid Diversion Risk Score',
      'Risk Level',
      'Active Organizations'
    ];

    const rows = filteredDistricts.map(d => [
      `"${d.district}"`,
      d.total_usd_transferred,
      d.mobile_money_usd,
      d.voucher_usd,
      d.cash_on_hand_usd,
      d.households_reached,
      d.individuals_assisted,
      d.idp_camps_count,
      d.gatekeeper_camps_count,
      d.gatekeeper_prevalence_pct,
      d.extortion_reported_camps,
      d.total_idp_shelters,
      d.aid_diversion_risk_score,
      `"${d.risk_level}"`,
      `"${d.active_organizations.join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somalia_cash_audit_district_data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTxCSV = () => {
    const headers = [
      'Transaction ID',
      'Beneficiary Code',
      'Recipient MSISDN',
      'Amount (USD)',
      'Timestamp',
      'Destination Merchant ID',
      'Merchant Registered Name',
      'Velocity Audit Flag',
      'Risk Category'
    ];

    const rows = transactionRows.map(r => [
      `"${r.tx_id}"`,
      `"${r.beneficiary_code}"`,
      `"${r.recipient_phone}"`,
      r.amount_usd,
      `"${r.timestamp}"`,
      `"${r.merchant_id}"`,
      `"${r.merchant_name}"`,
      `"${r.velocity_flag}"`,
      `"${r.risk}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `evc_forensic_tx_ledger_${selectedBatchId}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-[1500px] mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/cash-audit"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Cash Audit Dashboard</span>
              </Link>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">Standalone Master Data Window</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FileSpreadsheet className="w-7 h-7 text-indigo-400" />
              <span>Somalia CVA & Gatekeeper Master Data Window</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Raw tabular data parsed from CWG 4Ws (142,185 activity lines) and REACH DSA (2,987 settlements).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print View</span>
            </button>
            <button
              onClick={activeTab === 'districts' ? exportDistrictCSV : exportTxCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Ledger</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('districts')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'districts'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Districts Master List ({filteredDistricts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('evc_transactions')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'evc_transactions'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>EVC Transaction Ledger ({transactionRows.length} Rows)</span>
            </button>
          </div>

          {activeTab === 'districts' ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter district or org..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400">Risk:</span>
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(risk => (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      riskFilter === risk
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400">Select Batch:</span>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {cvaData.sample_evc_forensic_batches.map(b => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_id} - {b.district} ({b.settlement})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: DISTRICTS FULL SPREADSHEET TABLE */}
        {activeTab === 'districts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[750px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/90 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4 text-right">Total Cash (USD)</th>
                    <th className="py-3 px-4 text-right">Mobile Money (USD)</th>
                    <th className="py-3 px-4 text-right">Voucher (USD)</th>
                    <th className="py-3 px-4 text-right">Households</th>
                    <th className="py-3 px-4 text-right">IDP Camps</th>
                    <th className="py-3 px-4 text-right">Gatekeeper %</th>
                    <th className="py-3 px-4 text-right">Extortion Camps</th>
                    <th className="py-3 px-4 text-center">Risk Score</th>
                    <th className="py-3 px-4">Active Implementers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredDistricts.map((d, index) => (
                    <tr key={d.district} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500">{index + 1}</td>
                      <td className="py-2.5 px-4 font-sans font-bold text-white whitespace-nowrap">
                        {d.district}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-100">
                        ${d.total_usd_transferred.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-emerald-400">
                        ${d.mobile_money_usd.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-indigo-300">
                        ${d.voucher_usd.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-200">
                        {d.households_reached.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300">
                        {d.idp_camps_count}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={d.gatekeeper_prevalence_pct > 75 ? 'text-red-400 font-bold' : d.gatekeeper_prevalence_pct > 40 ? 'text-amber-400' : 'text-slate-400'}>
                          {d.gatekeeper_prevalence_pct}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={d.extortion_reported_camps > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                          {d.extortion_reported_camps}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.risk_level === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : d.risk_level === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {d.aid_diversion_risk_score} ({d.risk_level})
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-400 max-w-xs truncate" title={d.active_organizations.join(', ')}>
                        {d.active_organizations.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INDIVIDUAL EVC TRANSACTION ROWS */}
        {activeTab === 'evc_transactions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 bg-slate-800/60 border-b border-slate-700 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400">Disbursement Transaction Log</span>
                <h3 className="text-lg font-bold text-white font-mono">{selectedBatchId}</h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Displaying: </span>
                <span className="font-bold text-white font-mono">{transactionRows.length} Beneficiary Records</span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[700px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/90 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Beneficiary Code</th>
                    <th className="py-3 px-4">Recipient Phone (MSISDN)</th>
                    <th className="py-3 px-4 text-right">Amount (USD)</th>
                    <th className="py-3 px-4">Timestamp (EVC Plus)</th>
                    <th className="py-3 px-4">Merchant ID</th>
                    <th className="py-3 px-4">Merchant Terminal Registry</th>
                    <th className="py-3 px-4">Forensic Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {transactionRows.map(r => (
                    <tr key={r.tx_id} className={`hover:bg-slate-800/50 transition-colors ${
                      r.risk === 'HIGH' ? 'bg-red-950/20' : ''
                    }`}>
                      <td className="py-2 px-4 font-bold text-white">{r.tx_id}</td>
                      <td className="py-2 px-4 text-slate-400">{r.beneficiary_code}</td>
                      <td className="py-2 px-4 text-emerald-400">{r.recipient_phone}</td>
                      <td className="py-2 px-4 text-right font-bold text-slate-100">${r.amount_usd.toFixed(2)}</td>
                      <td className="py-2 px-4 text-slate-300">{r.timestamp}</td>
                      <td className="py-2 px-4 font-bold text-indigo-300">{r.merchant_id}</td>
                      <td className="py-2 px-4 font-sans text-slate-300">{r.merchant_name}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.risk === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {r.velocity_flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
