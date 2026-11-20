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
  ChevronUp,
  ArrowUpDown,
  Users,
  DollarSign
} from 'lucide-react';
import rawData from '@/data/somalia_raw_cwg_records.json';
import cvaSummaryData from '@/data/somalia_cva_audit_data.json';
import householdsData from '@/data/somalia_reach_households.json';

export default function RealDataWindow() {
  const [activeTab, setActiveTab] = useState<'district_summary' | 'household_microdata' | 'cwg_transfers' | 'reach_settlements'>('district_summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('ALL');
  const [selectedMechanism, setSelectedMechanism] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [districtSortField, setDistrictSortField] = useState<string>('total_usd_transferred');
  const [districtSortAsc, setDistrictSortAsc] = useState<boolean>(false);

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

  // Filter & sort District Summary
  const filteredDistricts = useMemo(() => {
    return cvaSummaryData.districts
      .filter(d => {
        if (d.total_usd_transferred === 0 && d.idp_camps_count === 0) return false;
        if (d.district === 'Localisation_District_Label') return false;
        const matchSearch = searchTerm === '' ||
          d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.active_organizations.some(org => org.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchSearch;
      })
      .sort((a, b) => {
        let valA = (a as Record<string, any>)[districtSortField];
        let valB = (b as Record<string, any>)[districtSortField];
        if (typeof valA === 'string') {
          return districtSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return districtSortAsc ? (valA - valB) : (valB - valA);
      });
  }, [searchTerm, districtSortField, districtSortAsc]);

  const toggleDistrictSort = (field: string) => {
    if (districtSortField === field) {
      setDistrictSortAsc(!districtSortAsc);
    } else {
      setDistrictSortField(field);
      setDistrictSortAsc(false); // Default descending for metrics
    }
  };

  // CSV Exporter for District Summary
  const exportDistrictCSV = () => {
    const headers = [
      'District',
      'Total Transferred (USD)',
      'Mobile Money (USD)',
      'Voucher (USD)',
      'Households',
      'IDP Camps Count',
      'Gatekeeper Camps',
      'Gatekeeper %',
      'Total Shelters',
      'Active Implementers'
    ];

    const rows = filteredDistricts.map(d => [
      `"${d.district}"`,
      d.total_usd_transferred,
      d.mobile_money_usd,
      d.voucher_usd,
      d.households_reached,
      d.idp_camps_count,
      d.gatekeeper_camps_count,
      `"${d.gatekeeper_prevalence_pct}%"`,
      d.total_idp_shelters,
      `"${d.active_organizations.join(', ')}"`
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somalia_cva_district_summary_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter REACH individual surveyed households
  const filteredHouseholds = useMemo(() => {
    return householdsData.households.filter(h => {
      const matchSearch = searchTerm === '' ||
        h.household_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.settlement_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.resp_gender.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  // CSV Exporter for Individual Household Microdata
  const exportHouseholdCSV = () => {
    const headers = [
      'Household ID',
      'District',
      'Area',
      'Settlement Name',
      'Respondent Gender',
      'Head of Household',
      'Head Age',
      'Family Size',
      'Children Count',
      'Pregnant/Lactating',
      'Registered for Aid',
      'Horjooge Gatekeeper Registration',
      'Pays Camp Rent/Tax',
      'Camp Charge USD'
    ];

    const rows = filteredHouseholds.map(h => [
      `"${h.household_id}"`,
      `"${h.district}"`,
      `"${h.area}"`,
      `"${h.settlement_name}"`,
      `"${h.resp_gender}"`,
      `"${h.head_of_household}"`,
      h.head_age,
      h.family_size,
      h.children_count,
      h.pregnant_lactating,
      `"${h.registered_for_aid}"`,
      `"${h.registered_by_horjooge_gatekeeper}"`,
      `"${h.pays_camp_rent_tax}"`,
      h.camp_charge_usd
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `somalia_reach_surveyed_households_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              onClick={
                activeTab === 'district_summary'
                  ? exportDistrictCSV
                  : activeTab === 'household_microdata'
                  ? exportHouseholdCSV
                  : activeTab === 'reach_settlements'
                  ? exportReachCSV
                  : exportCwgCSV
              }
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
              onClick={() => setActiveTab('district_summary')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'district_summary'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>District Summary Real Totals ({filteredDistricts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('household_microdata')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'household_microdata'
                  ? 'bg-emerald-600 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Individual Surveyed Households ({filteredHouseholds.length})</span>
            </button>

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
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <span>
                  <strong>Temporal Alignment Notice:</strong> Cash transfer numbers and households reflect the <strong>UN Somalia CWG 2023 Annual Cycle</strong>. IDP settlement and shelter figures reflect the <strong>REACH Initiative February 2022 Comprehensive Site Assessment</strong>.
                </span>
              </div>
              <span className="text-slate-500 text-[11px] shrink-0 font-mono">Cross-Referenced Baseline</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto max-h-[750px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                    <tr>
                      <th 
                        onClick={() => toggleDistrictSort('district')}
                        className="py-3 px-4 cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <div>
                            <span>District</span>
                            <span className="block text-[9px] text-slate-500 font-normal lowercase tracking-normal">Somalia (74)</span>
                          </div>
                          {districtSortField === 'district' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('total_usd_transferred')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Total Transferred</span>
                            <span className="block text-[9px] text-emerald-400 font-normal lowercase tracking-normal">CWG 2023</span>
                          </div>
                          {districtSortField === 'total_usd_transferred' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('mobile_money_usd')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Mobile Money</span>
                            <span className="block text-[9px] text-emerald-400 font-normal lowercase tracking-normal">CWG 2023</span>
                          </div>
                          {districtSortField === 'mobile_money_usd' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('voucher_usd')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Voucher</span>
                            <span className="block text-[9px] text-indigo-400 font-normal lowercase tracking-normal">CWG 2023</span>
                          </div>
                          {districtSortField === 'voucher_usd' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('households_reached')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Households</span>
                            <span className="block text-[9px] text-slate-400 font-normal lowercase tracking-normal">CWG 2023 Dispatches</span>
                          </div>
                          {districtSortField === 'households_reached' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('idp_camps_count')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>IDP Camps</span>
                            <span className="block text-[9px] text-slate-400 font-normal lowercase tracking-normal">REACH Feb 2022</span>
                          </div>
                          {districtSortField === 'idp_camps_count' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('gatekeeper_camps_count')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Gatekeeper Camps</span>
                            <span className="block text-[9px] text-slate-400 font-normal lowercase tracking-normal">REACH Feb 2022</span>
                          </div>
                          {districtSortField === 'gatekeeper_camps_count' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleDistrictSort('total_idp_shelters')}
                        className="py-3 px-4 text-right cursor-pointer hover:bg-slate-700/60 transition-colors select-none"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="text-right">
                            <span>Total Shelters</span>
                            <span className="block text-[9px] text-slate-400 font-normal lowercase tracking-normal">REACH Feb 2022</span>
                          </div>
                          {districtSortField === 'total_idp_shelters' ? (
                            districtSortAsc ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : <ArrowUpDown className="w-3 h-3 text-slate-500" />}
                        </div>
                      </th>
                      <th className="py-3 px-4">Active Implementers</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredDistricts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                        No districts found matching &ldquo;{searchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    filteredDistricts.map(d => (
                      <tr key={d.district} className={`hover:bg-slate-800/60 transition-colors ${d.district === 'Cabudwaaq' ? 'bg-indigo-950/20' : ''}`}>
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
                        <td className="py-2.5 px-4 font-sans text-slate-400 max-w-sm truncate" title={d.active_organizations.join(', ')}>
                          {d.active_organizations.join(', ')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              Showing {filteredDistricts.length} active Somali districts sorted by <strong>{districtSortField.replace(/_/g, ' ')}</strong> ({districtSortAsc ? 'Ascending' : 'Descending'}). Click any column header to sort.
            </div>
          </div>
        </div>
      )}

        {/* TAB 4: REAL INDIVIDUAL HOUSEHOLDS MICRODATA */}
        {activeTab === 'household_microdata' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Real In-Person Field Survey Microdata (1,211 Surveyed Families)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source: REACH Initiative Settlement Assessment. Microdata covering family demographics, Horjooge gatekeeper registration, and camp fees.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Avg Family Size: <strong className="text-white">6.3</strong></span>
                <span className="text-slate-400">Female Head: <strong className="text-emerald-400">59.8%</strong></span>
                <span className="text-slate-400">Gatekeeper Registered: <strong className="text-red-400">26.4%</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[750px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/95 text-slate-300 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Household ID</th>
                    <th className="py-3 px-4">District / Area</th>
                    <th className="py-3 px-4">Settlement Name</th>
                    <th className="py-3 px-4">Head Gender</th>
                    <th className="py-3 px-4 text-right">Head Age</th>
                    <th className="py-3 px-4 text-right">Family Size</th>
                    <th className="py-3 px-4 text-right">Children</th>
                    <th className="py-3 px-4 text-center">Pregnant / Lactating</th>
                    <th className="py-3 px-4 text-center">Aid Registered</th>
                    <th className="py-3 px-4 text-center">Horjooge (Gatekeeper)</th>
                    <th className="py-3 px-4 text-right">Camp Tax / Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {filteredHouseholds.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400 font-sans">
                        No households found matching &ldquo;{searchTerm}&rdquo;
                      </td>
                    </tr>
                  ) : (
                    filteredHouseholds.slice(0, 500).map(h => (
                      <tr key={h.household_id} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-400 whitespace-nowrap">{h.household_id}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-300">{h.district} ({h.area})</td>
                        <td className="py-2.5 px-4 font-sans font-bold text-white whitespace-nowrap">{h.settlement_name}</td>
                        <td className="py-2.5 px-4 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.resp_gender === 'female' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {h.resp_gender.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-200">{h.head_age > 0 ? h.head_age : '—'}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-100">{h.family_size}</td>
                        <td className="py-2.5 px-4 text-right text-slate-300">{h.children_count}</td>
                        <td className="py-2.5 px-4 text-center">
                          {h.pregnant_lactating > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">YES ({h.pregnant_lactating})</span>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.registered_for_aid === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {h.registered_for_aid.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            h.registered_by_horjooge_gatekeeper === 'YES'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {h.registered_by_horjooge_gatekeeper}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-sans">
                          {h.camp_charge_usd > 0 ? (
                            <span className="font-mono text-amber-400 font-bold">${h.camp_charge_usd}/mo</span>
                          ) : h.pays_camp_rent_tax === 'yes' ? (
                            <span className="text-amber-400 text-xs">Yes (In-kind)</span>
                          ) : (
                            <span className="text-slate-600">None</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredHouseholds.length > 500 && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
                Displaying first 500 of {filteredHouseholds.length} surveyed households. Click <strong>&ldquo;Export Real Data CSV&rdquo;</strong> to download all 1,211 household interviews.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
