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
  Layers, 
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Users,
  DollarSign
} from 'lucide-react';
import rawData from '@/data/somalia_raw_cwg_records.json';
import cvaSummaryData from '@/data/somalia_cva_audit_data.json';

export default function RealDataWindow() {
  const [activeTab, setActiveTab] = useState<'cwg_transfers' | 'reach_settlements' | 'district_summary'>('cwg_transfers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');
  const [selectedMechanism, setSelectedMechanism] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Unique lists for dropdown filters
  const organizations = useMemo(() => {
    const s = new Set<string>();
    rawData.real_cwg_transfers.forEach(r => s.add(r.organization));
    return ['ALL', ...Array.from(s).sort()];
  }, []);

  const mechanisms = useMemo(() => {
    const s = new Set<string>();
    rawData.real_cwg_transfers.forEach(r => s.add(r.mechanism));
    return ['ALL', ...Array.from(s).sort()];
  }, []);

  const districts = useMemo(() => {
    const s = new Set<string>();
    rawData.real_cwg_transfers.forEach(r => s.add(r.district));
    return ['ALL', ...Array.from(s).sort()];
  }, []);

  // Filter CWG real transactions
  const filteredCwg = useMemo(() => {
    return rawData.real_cwg_transfers.filter(r => {
      const matchSearch = searchTerm === '' || 
        r.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.settlement.toLowerCase().includes(searchTerm.toLowerCase());
      const matchOrg = selectedOrg === 'ALL' || r.organization === selectedOrg;
      const matchMech = selectedMechanism === 'ALL' || r.mechanism === selectedMechanism;
      const matchDist = selectedDistrict === 'ALL' || r.district === selectedDistrict;
      return matchSearch && matchOrg && matchMech && matchDist;
    });
  }, [searchTerm, selectedOrg, selectedMechanism, selectedDistrict]);

  // Filter REACH settlements
  const filteredReach = useMemo(() => {
    return rawData.real_reach_settlements.filter(r => {
      const matchSearch = searchTerm === '' ||
        r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.management_structure.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDist = selectedDistrict === 'ALL' || r.district.toLowerCase() === selectedDistrict.toLowerCase();
      return matchSearch && matchDist;
    });
  }, [searchTerm, selectedDistrict]);

  // CSV Exporter for Real CWG
  const exportCwgCSV = () => {
    const headers = [
      'Record ID',
      'Organization',
      'Status',
      'Region',
      'District',
      'Settlement',
      'Location Type',
      'Cash Modality',
      'Transfer Mechanism',
      'Transfer Value per HH (USD)',
      'Total USD Transferred',
      'Households Reached',
      'Individuals Assisted',
      'Delivery Month',
      'Delivery Year'
    ];

    const rows = filteredCwg.map(r => [
      `"${r.record_id}"`,
      `"${r.organization}"`,
      `"${r.status}"`,
      `"${r.region}"`,
      `"${r.district}"`,
      `"${r.settlement}"`,
      `"${r.location_type}"`,
      `"${r.modality}"`,
      `"${r.mechanism}"`,
      r.transfer_value_usd,
      r.total_usd_transferred,
      r.households_reached,
      r.individuals_assisted,
      `"${r.delivery_month}"`,
      r.delivery_year
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `real_somalia_cwg_cash_records_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Exporter for Real REACH DSA
  const exportReachCSV = () => {
    const headers = [
      'Site ID',
      'Region',
      'District',
      'Settlement Type',
      'Estimated Shelters',
      'Management Structure',
      'Reported Forced Cut to Gatekeeper',
      'Reported Illegal Taxation',
      'Received Cash Support'
    ];

    const rows = filteredReach.map(r => [
      `"${r.site_id}"`,
      `"${r.region}"`,
      `"${r.district}"`,
      `"${r.settlement_type}"`,
      r.estimated_shelters,
      `"${r.management_structure}"`,
      r.reported_pay_cut_to_gatekeeper ? 'YES' : 'NO',
      r.reported_illegal_taxation ? 'YES' : 'NO',
      r.received_cash_support ? 'YES' : 'NO'
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `real_reach_dsa_somalia_camps_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/cash-audit"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </Link>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-emerald-400 font-semibold">100% Real UN / NGO Raw Data</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
              <span>Somalia Cash & IDP Camp Master Data Explorer</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Actual recorded lines from the <strong>Somalia Cash Working Group (CWG)</strong> 4Ws and <strong>REACH Initiative</strong> Detailed Site Assessment.
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
              onClick={activeTab === 'reach_settlements' ? exportReachCSV : exportCwgCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Export Real Data CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('cwg_transfers')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'cwg_transfers'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Real CWG Cash Transfers ({filteredCwg.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reach_settlements')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'reach_settlements'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Real REACH IDP Settlements ({filteredReach.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('district_summary')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'district_summary'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>District Summary Totals (74)</span>
            </button>
          </div>

          {/* Search & Dynamic Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search org, district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {activeTab === 'cwg_transfers' && (
              <>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[140px] truncate"
                >
                  <option value="ALL">All Orgs</option>
                  {organizations.filter(o => o !== 'ALL').map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>

                <select
                  value={selectedMechanism}
                  onChange={(e) => setSelectedMechanism(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Mechanisms</option>
                  {mechanisms.filter(m => m !== 'ALL').map(mech => (
                    <option key={mech} value={mech}>{mech}</option>
                  ))}
                </select>
              </>
            )}

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Districts</option>
              {districts.filter(d => d !== 'ALL').map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB 1: REAL CWG CASH TRANSFERS SPREADSHEET */}
        {activeTab === 'cwg_transfers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[750px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-3.5">Record ID</th>
                    <th className="py-3 px-3.5">Organization</th>
                    <th className="py-3 px-3.5">Region</th>
                    <th className="py-3 px-3.5">District</th>
                    <th className="py-3 px-3.5">Settlement / Site</th>
                    <th className="py-3 px-3.5">Modality</th>
                    <th className="py-3 px-3.5">Mechanism</th>
                    <th className="py-3 px-3.5 text-right">Value/HH (USD)</th>
                    <th className="py-3 px-3.5 text-right">Total Transferred (USD)</th>
                    <th className="py-3 px-3.5 text-right">Households</th>
                    <th className="py-3 px-3.5 text-right">Individuals</th>
                    <th className="py-3 px-3.5">Delivery Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredCwg.slice(0, 500).map((r) => (
                    <tr key={r.record_id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-slate-400">{r.record_id}</td>
                      <td className="py-2.5 px-3.5 font-sans font-bold text-white whitespace-nowrap">{r.organization}</td>
                      <td className="py-2.5 px-3.5 font-sans text-slate-300">{r.region}</td>
                      <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-200">{r.district}</td>
                      <td className="py-2.5 px-3.5 font-sans text-slate-400 whitespace-nowrap">{r.settlement}</td>
                      <td className="py-2.5 px-3.5 font-sans text-indigo-300">{r.modality}</td>
                      <td className="py-2.5 px-3.5 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          r.mechanism.toLowerCase().includes('mobile')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : r.mechanism.toLowerCase().includes('voucher')
                            ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {r.mechanism}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-slate-200">
                        {r.transfer_value_usd > 0 ? `$${r.transfer_value_usd.toFixed(0)}` : '—'}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-bold text-emerald-400 font-mono">
                        ${r.total_usd_transferred.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right text-slate-200">{r.households_reached.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 text-right text-slate-400">{r.individuals_assisted.toLocaleString()}</td>
                      <td className="py-2.5 px-3.5 font-sans text-slate-400 whitespace-nowrap">
                        {r.delivery_month} {r.delivery_year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredCwg.length > 500 && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
                Displaying first 500 of {filteredCwg.length} records. Click <strong>&ldquo;Export Real Data CSV&rdquo;</strong> to download the full dataset.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REAL REACH DSA SETTLEMENTS SPREADSHEET */}
        {activeTab === 'reach_settlements' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[750px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Site Code</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Settlement Type</th>
                    <th className="py-3 px-4 text-right">Estimated Shelters</th>
                    <th className="py-3 px-4">Camp Leadership / Management</th>
                    <th className="py-3 px-4 text-center">Gatekeeper Cut Reported</th>
                    <th className="py-3 px-4 text-center">Illegal Tax Incident</th>
                    <th className="py-3 px-4 text-center">Cash Aid Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredReach.slice(0, 500).map((r) => (
                    <tr key={r.site_id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-400">{r.site_id}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-300">{r.region}</td>
                      <td className="py-2.5 px-4 font-sans font-bold text-white">{r.district}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-400">{r.settlement_type}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-200">{r.estimated_shelters.toLocaleString()}</td>
                      <td className="py-2.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          r.management_structure === 'Gatekeeper'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {r.management_structure}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {r.reported_pay_cut_to_gatekeeper ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">YES</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {r.reported_illegal_taxation ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">YES</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {r.received_cash_support ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">YES</span>
                        ) : (
                          <span className="text-slate-600">NO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReach.length > 500 && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
                Displaying first 500 of {filteredReach.length} assessed camps. Click <strong>&ldquo;Export Real Data CSV&rdquo;</strong> to export all 2,986 records.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REAL DISTRICT SUMMARY SPREADSHEET */}
        {activeTab === 'district_summary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[750px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4 text-right">Total Transferred (USD)</th>
                    <th className="py-3 px-4 text-right">Mobile Money (USD)</th>
                    <th className="py-3 px-4 text-right">Voucher (USD)</th>
                    <th className="py-3 px-4 text-right">Households</th>
                    <th className="py-3 px-4 text-right">IDP Camps Count</th>
                    <th className="py-3 px-4 text-right">Gatekeeper Camps</th>
                    <th className="py-3 px-4 text-right">Total Shelters</th>
                    <th className="py-3 px-4">Active Implementers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {cvaSummaryData.districts.map(d => (
                    <tr key={d.district} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-2.5 px-4 font-sans font-bold text-white whitespace-nowrap">{d.district}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400">${d.total_usd_transferred.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200">${d.mobile_money_usd.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right text-indigo-300">${d.voucher_usd.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right text-slate-200">{d.households_reached.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right text-slate-300">{d.idp_camps_count}</td>
                      <td className="py-2.5 px-4 text-right text-slate-300">
                        {d.gatekeeper_camps_count} ({d.gatekeeper_prevalence_pct}%)
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300">{d.total_idp_shelters.toLocaleString()}</td>
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

      </div>
    </div>
  );
}
