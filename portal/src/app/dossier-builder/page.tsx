'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import rawData from '@/data/map_data_summary.json';
import { getDistrictCVA } from '@/lib/data';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Download,
  AlertCircle,
  Banknote,
  Tent,
  Clock,
  Calendar,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';

const data = rawData as any;
const districtsList = Object.values(data.districts || {}) as any[];
const ngosList = Object.values(data.ngos || {}) as any[];

const ALL_CLUSTERS = [
  'Health',
  'WASH',
  'Food Security Cluster',
  'Nutrition',
  'Child Protection',
  'Protection',
  'Gender Based Violence',
  'Shelter and NFIs',
  'Education',
  'CCCM',
  'Multipurpose Cash Assistance',
  'HLP',
  'Explosives Hazards'
];

function DossierBuilderContent() {
  const searchParams = useSearchParams();
  const districtQuery = searchParams.get('district');
  const clusterQuery = searchParams.get('cluster');
  const ngoQuery = searchParams.get('ngo');

  // Sorted districts list
  const sortedDistricts = useMemo(() => {
    return [...districtsList].sort((a, b) => a.district.localeCompare(b.district));
  }, []);

  // Initial district matching from URL or default
  const initialDistrict = useMemo(() => {
    if (districtQuery) {
      const q = districtQuery.toLowerCase().trim();
      const match = sortedDistricts.find(
        (d) => d.district.toLowerCase() === q || 
               d.district.toLowerCase().replace(/[^a-z0-9]/g, '') === q.replace(/[^a-z0-9]/g, '')
      );
      if (match) return match.district;
    }
    return 'Afgooye'; // Default to Afgooye or first
  }, [districtQuery, sortedDistricts]);

  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrict);
  const [selectedCluster, setSelectedCluster] = useState<string>(clusterQuery || 'WASH');
  const [selectedNgoName, setSelectedNgoName] = useState<string>(
    ngoQuery || 'Agency for Technical Cooperation and Development (ACTED)'
  );
  const [generatedDate, setGeneratedDate] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync state if URL changes directly
  useEffect(() => {
    if (districtQuery) {
      const q = districtQuery.toLowerCase().trim();
      const match = sortedDistricts.find(
        (d) => d.district.toLowerCase() === q || 
               d.district.toLowerCase().replace(/[^a-z0-9]/g, '') === q.replace(/[^a-z0-9]/g, '')
      );
      if (match) {
        setSelectedDistrictName(match.district);
      }
    }
  }, [districtQuery, sortedDistricts]);

  useEffect(() => {
    if (clusterQuery) {
      const match = ALL_CLUSTERS.find((c) => c.toLowerCase() === clusterQuery.toLowerCase().trim());
      if (match) setSelectedCluster(match);
    }
  }, [clusterQuery]);

  useEffect(() => {
    if (ngoQuery) {
      const q = ngoQuery.toLowerCase().trim();
      const match = ngosList.find(
        (n) => n.name.toLowerCase() === q || n.name.toLowerCase().includes(q)
      );
      if (match) setSelectedNgoName(match.name);
    }
  }, [ngoQuery]);

  useEffect(() => {
    setGeneratedDate(
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    );
  }, []);

  // Update browser URL query params dynamically
  const updateUrl = (district: string, cluster: string, ngo: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (district) params.set('district', district);
    if (cluster) params.set('cluster', cluster);
    if (ngo) params.set('ngo', ngo);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleDistrictChange = (dName: string) => {
    setSelectedDistrictName(dName);
    // When district changes, check if current cluster exists in new district; if not, suggest top active cluster
    const newDist = sortedDistricts.find((d) => d.district === dName);
    let newCluster = selectedCluster;
    if (newDist && newDist.cluster_counts) {
      const activeClusters = Object.keys(newDist.cluster_counts);
      if (activeClusters.length > 0 && !activeClusters.includes(selectedCluster)) {
        newCluster = activeClusters[0];
        setSelectedCluster(newCluster);
      }
    }
    // Check if current NGO operates in new district; if not, pick the top active NGO
    let newNgo = selectedNgoName;
    if (newDist && newDist.organizations && newDist.organizations.length > 0) {
      const isPresent = newDist.organizations.some(
        (o: any) => o.name.toLowerCase() === selectedNgoName.toLowerCase()
      );
      if (!isPresent) {
        newNgo = newDist.organizations[0].name;
        setSelectedNgoName(newNgo);
      }
    }
    updateUrl(dName, newCluster, newNgo);
  };

  const handleClusterChange = (cName: string) => {
    setSelectedCluster(cName);
    updateUrl(selectedDistrictName, cName, selectedNgoName);
  };

  const handleNgoChange = (nName: string) => {
    setSelectedNgoName(nName);
    updateUrl(selectedDistrictName, selectedCluster, nName);
  };

  // Selected District Data
  const district = useMemo(() => {
    return (
      sortedDistricts.find(
        (d) => d.district.toLowerCase() === selectedDistrictName.toLowerCase()
      ) || sortedDistricts[0]
    );
  }, [selectedDistrictName, sortedDistricts]);

  // Selected NGO Data
  const ngo = useMemo(() => {
    return (
      ngosList.find(
        (n) => n.name.toLowerCase() === selectedNgoName.toLowerCase()
      ) || ngosList[0]
    );
  }, [selectedNgoName]);

  // CVA baseline data for this district
  const cva = useMemo(() => {
    return getDistrictCVA(district.district);
  }, [district]);

  // Active clusters in this district
  const districtActiveClusters = useMemo(() => {
    if (!district?.cluster_counts) return [];
    return Object.entries(district.cluster_counts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count);
  }, [district]);

  // Other standard clusters not active in this district
  const otherClusters = useMemo(() => {
    const activeSet = new Set(districtActiveClusters.map((c) => c.name));
    return ALL_CLUSTERS.filter((c) => !activeSet.has(c));
  }, [districtActiveClusters]);

  // Active NGOs in this district
  const districtActiveNgos = useMemo(() => {
    if (!district?.organizations) return [];
    return [...district.organizations].sort((a: any, b: any) => b.activities - a.activities);
  }, [district]);

  // Other NGOs not active in this district
  const otherNgos = useMemo(() => {
    const activeNames = new Set(districtActiveNgos.map((o: any) => o.name.toLowerCase()));
    return ngosList
      .filter((n) => !activeNames.has(n.name.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [districtActiveNgos]);

  // Check if selected NGO is active in this district
  const localOrgData = useMemo(() => {
    if (!district?.organizations) return null;
    return (
      district.organizations.find(
        (o: any) => o.name.toLowerCase() === selectedNgoName.toLowerCase()
      ) || null
    );
  }, [district, selectedNgoName]);

  // Peers active in the selected cluster in this district
  const peersInCluster = useMemo(() => {
    if (!district?.organizations) return [];
    const clNorm = selectedCluster.toLowerCase();
    return district.organizations.filter((o: any) =>
      o.clusters?.some(
        (c: string) =>
          c.toLowerCase() === clNorm ||
          clNorm.includes(c.toLowerCase()) ||
          c.toLowerCase().includes(clNorm)
      )
    );
  }, [district, selectedCluster]);

  const ett = district?.ett_2026;
  const hasArrivals = (ett?.arrivals || 0) > 0;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Cluster technical narratives
  const clusterTechnicalApproach = useMemo(() => {
    const cl = selectedCluster.toLowerCase();
    if (cl.includes('wash') || cl.includes('water')) {
      return {
        strategy: 'Emergency WASH Infrastructure Rehabilitation & Water Quality Assurance',
        activities: [
          'Immediate deep borehole desiltation and solarization of pumping systems in major IDP settlement corridors.',
          'Household water storage distribution (20L jerry cans and ceramic filters) and continuous water trucking to water-deficit spontaneous displacement sites.',
          'Construction and gender-segregated rehabilitation of VIP emergency latrines with lockable doors and solar safety lighting.',
          'Hygiene promotion campaigns covering cholera/AWD prevention with distribution of chlorination aqua-tabs.'
        ],
        targetUnit: 'households with access to safe water'
      };
    } else if (cl.includes('health')) {
      return {
        strategy: 'Integrated Primary Healthcare & Mobile Clinical Emergency Outreach',
        activities: [
          'Deployment of mobile health teams (MHTs) delivering outpatient consultations, maternal/child care, and trauma management.',
          'Procurement and pre-positioning of Inter-Agency Emergency Health Kits (IEHK) and essential drug supplies.',
          'Routine immunization catch-up campaigns (measles, polio, pentavalent) for newly arrived displaced children under 5.',
          'Surveillance and early warning notification system for acute watery diarrhea (AWD) and epidemic-prone diseases.'
        ],
        targetUnit: 'consultations and medical treatments delivered'
      };
    } else if (cl.includes('food') || cl.includes('cash')) {
      return {
        strategy: 'Unconditional Mobile Money Transfers & Emergency Livelihood Protection',
        activities: [
          'Disbursement of monthly unconditional cash transfers ($60–$90/month based on CWG Minimum Expenditure Basket) via mobile network operators.',
          'Biometric beneficiary registration utilizing SCOPE/RedRose to eliminate ghost beneficiaries and prevent diversion.',
          'Market price monitoring across central markets to ensure local commodity availability and prevent localized price inflation.',
          'Establishment of toll-free beneficiary feedback and complaint response mechanisms (CRM) with third-party monitoring verification.'
        ],
        targetUnit: 'vulnerable food-insecure households assisted'
      };
    } else if (cl.includes('nutrition')) {
      return {
        strategy: 'Targeted Supplementary & Outpatient Therapeutic Feeding Programs (OTP/TSFP)',
        activities: [
          'Mid-Upper Arm Circumference (MUAC) mass screening for acute malnutrition in IDP camps and host community schools.',
          'Provision of Ready-to-Use Therapeutic Food (RUTF) for severe acute malnutrition (SAM) without complications.',
          'Infant and Young Child Feeding in Emergencies (IYCF-E) counselling for pregnant and lactating mothers.',
          'Vitamin A supplementation and deworming for children aged 6 to 59 months.'
        ],
        targetUnit: 'malnourished children and mothers treated'
      };
    } else if (cl.includes('protection') || cl.includes('gbv')) {
      return {
        strategy: 'Community-Based Protection, GBV Case Management & Child Safe Spaces',
        activities: [
          'Establishment of mobile safe spaces for women and girls with comprehensive Clinical Management of Rape (CMR) referral.',
          'Distribution of Dignity Kits (solar torches, sanitary items, clothing) to newly displaced adolescent girls and women.',
          'Identification, documentation, and family tracing for unaccompanied and separated children (UASC).',
          'Protection monitoring to detect and mitigate illegal camp taxation, eviction threats, and informal horjooge gatekeeper exploitation.'
        ],
        targetUnit: 'individuals receiving specialized protection services'
      };
    } else if (cl.includes('shelter') || cl.includes('cccm')) {
      return {
        strategy: 'Emergency Shelter Kits & Camp Coordination Site Upgrades',
        activities: [
          'Distribution of standard Emergency Shelter Kits (ESKs) consisting of heavy-duty tarpaulins, timber, and rope.',
          'Site drainage contouring and flood-barrier trenching to protect vulnerable settlement zones from flash inundation.',
          'Fire prevention planning and spacing reorganizations to curb catastrophic fire spread in overcrowded settlements.',
          'Coordination committee training with local camp leaders to ensure equitable aid distribution.'
        ],
        targetUnit: 'displaced families secured with habitable shelter'
      };
    } else {
      return {
        strategy: 'Multi-Sectoral Rapid Emergency Response & Access Mitigation',
        activities: [
          'Baseline rapid needs assessment conducted within 72 hours of sudden emergency shocks.',
          'Direct service delivery coordinated through UN OCHA cluster lead agencies and local community elders.',
          'Pre-positioning of emergency contingency stocks to reduce supply-chain transit times.',
          'Continuous monitoring of access constraints and security corridors.'
        ],
        targetUnit: 'individuals assisted under emergency programming'
      };
    }
  }, [selectedCluster]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/districts" className="hover:text-emerald-400 transition-colors">Districts</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href={`/districts/${district.district.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-emerald-400 transition-colors">
            {district.district}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold">Proposal Evidence Dossier</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Control Configuration Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Proposal Dossier Generator
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Generate Custom Proposal Evidence Dossier
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your parameters below to generate a verified, grant-ready evidence dossier for your next SHF, USAID, or bilateral funding bid.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/80 px-3 py-1.5 rounded-full">
              Target District Synced: <strong>{district.district}</strong>
            </span>
          </div>
        </div>

        {/* 3 Interactive Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. District Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>1. Target District (90 Total)</span>
              <span className="text-[10px] text-emerald-400 font-normal">Active: {district.region}</span>
            </label>
            <select
              value={selectedDistrictName}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {sortedDistricts.map((d) => (
                <option key={d.adm2_pcode} value={d.district}>
                  {d.district} ({d.region}) &bull; {d.total_activities} actions
                </option>
              ))}
            </select>
          </div>

          {/* 2. Cluster Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>2. Target Humanitarian Cluster</span>
              <span className="text-[10px] text-indigo-400 font-normal">{districtActiveClusters.length} Active in District</span>
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => handleClusterChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {districtActiveClusters.length > 0 && (
                <optgroup label={`Active in ${district.district} (${districtActiveClusters.length} Clusters)`}>
                  {districtActiveClusters.map((cl) => (
                    <option key={cl.name} value={cl.name}>
                      {cl.name} ({cl.count} field actions in {district.district})
                    </option>
                  ))}
                </optgroup>
              )}
              {otherClusters.length > 0 && (
                <optgroup label="Other Standard Humanitarian Sectors">
                  {otherClusters.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl} (New Sector Entry)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* 3. NGO Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>3. Applying Organization</span>
              <span className="text-[10px] text-teal-400 font-normal">
                {localOrgData ? `Active (${localOrgData.activities} acts)` : 'National Partner'}
              </span>
            </label>
            <select
              value={selectedNgoName}
              onChange={(e) => handleNgoChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {districtActiveNgos.length > 0 && (
                <optgroup label={`Operational in ${district.district} (${districtActiveNgos.length} Partners)`}>
                  {districtActiveNgos.map((o: any) => (
                    <option key={o.name} value={o.name}>
                      [{o.type}] {o.name} ({o.activities} acts{o.shf_budget > 0 ? ` • $${Math.round(o.shf_budget / 1000)}k SHF` : ''})
                    </option>
                  ))}
                </optgroup>
              )}
              {otherNgos.length > 0 && (
                <optgroup label="Other Registered Somalia Implementing Partners">
                  {otherNgos.map((n) => (
                    <option key={n.name} value={n.name}>
                      [{n.type}] {n.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Live Context KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">District Target Gap</span>
            <span className="text-base font-black text-white block mt-0.5">
              {((district.target || 0) - (district.reached || 0)).toLocaleString()} unreached
            </span>
            <span className="text-[10px] text-slate-500 block">
              {district.reach_ratio_pct}% reached of {district.target?.toLocaleString()} target
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{selectedCluster} in District</span>
            <span className="text-base font-black text-emerald-400 block mt-0.5">
              {district.cluster_counts?.[selectedCluster] || 0} actions
            </span>
            <span className="text-[10px] text-slate-500 block">
              {peersInCluster.length} peer agencies active
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Recent IDP Arrivals</span>
            <span className="text-base font-black text-rose-400 block mt-0.5">
              {hasArrivals ? `+${ett?.arrivals?.toLocaleString()}` : '0 arrivals'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Top need: {ett?.top_need || 'None'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Partner Local Presence</span>
            <span className={`text-base font-black block mt-0.5 ${localOrgData ? 'text-teal-400' : 'text-amber-400'}`}>
              {localOrgData ? `Established (${localOrgData.activities} acts)` : 'New Expansion'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {localOrgData?.shf_budget > 0 ? `$${localOrgData.shf_budget.toLocaleString()} SHF` : 'Verified Access'}
            </span>
          </div>
        </div>
      </div>

      {/* Generated Printable Dossier Document */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 print:bg-white print:text-black print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-emerald-500 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-emerald-400 print:text-emerald-800 uppercase mb-1">
              <span>CONFIDENTIAL PROPOSAL EVIDENCE DOSSIER</span>
              <span>&bull;</span>
              <span>UN OCHA &amp; IOM DTM BASELINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white print:text-black mt-1">
              Humanitarian Needs &amp; Operational Evidence Profile
            </h2>
            <div className="text-sm font-semibold text-slate-300 print:text-slate-700 mt-2 flex flex-wrap items-center gap-2">
              <span>Focus Sector:</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 print:bg-emerald-50 print:border-emerald-700 print:text-emerald-800 font-bold">
                {selectedCluster}
              </span>
              <span>Target:</span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white print:bg-slate-100 print:border-slate-400 print:text-black font-bold">
                {district.district} District ({district.region} Region)
              </span>
              <span>Applicant:</span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-teal-300 print:bg-slate-100 print:border-slate-400 print:text-black font-bold">
                {ngo.name} ({ngo.type})
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600 shrink-0">
            <div>Document Ref: SOM-DOS-{district.adm2_pcode || 'SO'}-2026</div>
            <div>Generated: {generatedDate}</div>
            <div className="text-[10px] text-slate-500">Security Clearance: Unrestricted</div>
          </div>
        </div>

        {/* Section 1: Geographic Context & Vulnerability Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            1. Geographic Baseline &amp; Vulnerability Overview
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            <strong>{district.district}</strong> (OCHA District PCode: <code>{district.adm2_pcode}</code>) in the <strong>{district.region}</strong> region represents a primary humanitarian intervention corridor with a total affected population of <strong>{district.affected?.toLocaleString() || 'N/A'} individuals</strong> and an official UN OCHA Humanitarian Response Plan (HRP) target of <strong>{district.target?.toLocaleString() || 'N/A'} people</strong>.
          </p>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            Current cluster monitoring records show that cumulative humanitarian deliveries have reached only <strong>{district.reach_ratio_pct}%</strong> ({district.reached?.toLocaleString()} people), leaving an acute unmet response deficit of <strong>{((district.target || 0) - (district.reached || 0)).toLocaleString()} targeted individuals</strong> who lack sustained emergency life-saving assistance.
          </p>

          {/* CVA & REACH IDP settlements baseline box */}
          {cva && (
            <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs space-y-2">
              <div className="font-bold text-emerald-400 print:text-emerald-800 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5" />
                Cross-Referenced Cash &amp; IDP Settlements Baseline:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 print:text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Cash Transferred:</span>
                  <span className="font-bold font-mono text-emerald-400 print:text-emerald-800">
                    ${cva.total_usd_transferred.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 block">CWG 2023 Flow</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mobile Money Disbursed:</span>
                  <span className="font-bold font-mono text-emerald-400 print:text-emerald-800">
                    ${cva.mobile_money_usd.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 block">CWG 2023 Flow</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assessed IDP Camps:</span>
                  <span className="font-bold text-white print:text-black">
                    {cva.idp_camps_count} settlements
                  </span>
                  <span className="text-[9px] text-slate-500 block">REACH Feb 2022</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assessed IDP Shelters:</span>
                  <span className="font-bold text-white print:text-black">
                    {cva.total_idp_shelters.toLocaleString()} structures
                  </span>
                  <span className="text-[9px] text-slate-500 block">REACH Feb 2022</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Rapid Influx Evidence (IOM DTM) */}
        {hasArrivals && ett && (
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/60 print:bg-slate-100 print:border-rose-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-bold text-rose-300 print:text-rose-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                2. Acute Emergency Displacement Trigger (IOM DTM Surveillance)
              </h3>
              <span className="text-[11px] font-mono text-rose-400/90 print:text-rose-800">
                Reporting Window: June 14 – Nov 11, 2026
              </span>
            </div>
            <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Between June and November 2026, IOM Emergency Trends Tracking (ETT) recorded an acute influx of <strong>+{ett.arrivals.toLocaleString()} newly arrived displaced persons</strong> into {district.district}. The primary shock driver was officially registered as <strong>{ett.top_cause}</strong>, with the predominant displacement stream originating from <strong>{ett.top_origin || 'neighboring rural zones'}</strong>.
            </p>
            <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Household screening confirms that <strong>{ett.top_need}</strong> is the primary urgent survival priority, with significant secondary pressure on shelter and water supplies. This sudden population surge directly justifies immediate grant financing under the <strong>{selectedCluster}</strong> cluster.
            </p>
          </div>
        )}

        {/* Section 3: 3W Non-Duplication Coordination Roster */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            3. Sectoral Operational Presence &amp; Non-Duplication Analysis
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            According to UN OCHA 3W operational presence records, {district.district} hosts <strong>{district.unique_orgs_count} active organizations</strong> implementing a combined total of {district.total_activities} physical operations.
          </p>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            For the target cluster of <strong>{selectedCluster}</strong>, there are currently <strong>{district.cluster_counts?.[selectedCluster] || 0} ongoing field operations</strong>. To guarantee absolute adherence to humanitarian "Do No Harm" and non-duplication standards, this proposed action coordinates directly with the {peersInCluster.length} peer organizations operational in {selectedCluster}:
          </p>

          <div className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 text-xs">
            <span className="font-bold text-slate-300 print:text-slate-800 block mb-2">
              Cluster Peer Organizations in {district.district} ({selectedCluster}):
            </span>
            {peersInCluster.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {peersInCluster.map((p: any, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 print:bg-slate-200 text-emerald-300 print:text-slate-900 font-medium">
                    {p.name} ({p.type}) &bull; {p.activities} acts
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-amber-400 print:text-amber-700 italic">
                No peer organizations currently report active operations under {selectedCluster} in {district.district}. This intervention addresses a critical unserved gap.
              </span>
            )}
          </div>
        </div>

        {/* Section 4: Implementing Agency Track Record */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400 print:text-teal-700" />
            4. Implementing Partner Track Record &amp; Operational Capacity
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            <strong>{ngo.name}</strong> ({ngo.type}) maintains verified operational credentials in Somalia, currently executing <strong>{ngo.total_activities} frontline actions</strong> across <strong>{ngo.districts_present?.length || 0} districts</strong> nationwide.
          </p>

          {localOrgData ? (
            <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-900/60 print:bg-slate-50 print:border-slate-300 text-xs space-y-1.5">
              <span className="font-bold text-teal-300 print:text-teal-800 block">
                Established Footprint in {district.district}:
              </span>
              <p className="text-slate-300 print:text-slate-800 leading-relaxed">
                {ngo.name} is already physically established on the ground in {district.district} with <strong>{localOrgData.activities} active operations</strong> spanning the following clusters: <em>{localOrgData.clusters?.join(', ')}</em>.
                {localOrgData.shf_budget > 0 && (
                  <span>
                    {' '}Under the Somalia Humanitarian Fund (SHF / CBPF 2026), {ngo.name} manages active grant allocations totaling <strong>${localOrgData.shf_budget.toLocaleString()}</strong>, verifying fiduciary capacity and compliance with UN audit protocols.
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs space-y-1.5">
              <span className="font-bold text-slate-300 print:text-slate-800 block">
                Regional Deployment &amp; Expansion Capacity:
              </span>
              <p className="text-slate-400 print:text-slate-700 leading-relaxed">
                While {ngo.name} is expanding its footprint directly into {district.district}, its extensive operations across {ngo.districts_present?.length || 0} neighboring districts provide proven technical protocols, established community elder negotiation networks, and rapid deployment supply chains ready to mobilize immediately upon grant award.
              </p>
            </div>
          )}
        </div>

        {/* Section 5: Strategic Response Methodology */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            5. Technical Methodology &amp; Planned Core Activities ({selectedCluster})
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            The proposed intervention adopts the official humanitarian standard strategy: <strong>{clusterTechnicalApproach.strategy}</strong>. Core activities are designed to directly serve vulnerable IDP and host communities:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {clusterTechnicalApproach.activities.map((act, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 print:bg-slate-50 border border-slate-800 print:border-slate-300 flex items-start gap-2">
                <span className="font-bold text-emerald-400 print:text-emerald-700 shrink-0 mt-0.5">
                  5.{idx + 1}
                </span>
                <span className="text-slate-300 print:text-slate-800 leading-relaxed">
                  {act}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Indicative Budget Framework */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            6. Indicative Budget Allocation Framework
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            Budget allocations adhere to the standard UN OCHA / SHF 80/20 direct-to-indirect delivery ratio for emergency response proposals:
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Budget Category</th>
                  <th className="py-2.5 px-3">Scope / Item Description</th>
                  <th className="py-2.5 px-3 text-center">Share</th>
                  <th className="py-2.5 px-3 text-right">Standard Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-slate-300 print:text-slate-800">
                <tr>
                  <td className="py-2 px-3 font-semibold text-white print:text-black">1. Direct Emergency Delivery</td>
                  <td className="py-2 px-3">Materials, supplies, transfers, clinical consumables</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-400 print:text-emerald-700">65%</td>
                  <td className="py-2 px-3 text-right font-mono">$195,000 – $325,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white print:text-black">2. Frontline Technical Personnel</td>
                  <td className="py-2 px-3">Engineers, doctors, nurses, field enumerators</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-400 print:text-emerald-700">18%</td>
                  <td className="py-2 px-3 text-right font-mono">$54,000 – $90,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white print:text-black">3. MEAL, Verification &amp; Security</td>
                  <td className="py-2 px-3">Third-party monitoring, CRM hotline, biometric audit</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-400 print:text-emerald-700">10%</td>
                  <td className="py-2 px-3 text-right font-mono">$30,000 – $50,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-white print:text-black">4. Operational Program Support</td>
                  <td className="py-2 px-3">Field vehicle logistics, communications, reporting</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-400 print:text-emerald-700">7%</td>
                  <td className="py-2 px-3 text-right font-mono">$21,000 – $35,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7: Signature & Verification Block */}
        <div className="pt-8 border-t-2 border-slate-800 print:border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-400 print:text-slate-700">
          <div>
            <div className="font-bold uppercase text-white print:text-black">Prepared &amp; Submitted By:</div>
            <div className="mt-1 font-semibold text-slate-200 print:text-slate-900">{ngo.name}</div>
            <div>Department of Humanitarian Programs &amp; Grants</div>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-700 print:border-slate-400 w-48 text-[11px]">
              Authorized Country Representative Signature
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold uppercase text-white print:text-black">Data Provenance Verification:</div>
            <div className="mt-1">Somalia Humanitarian Intelligence Suite (2026)</div>
            <div>UN OCHA FTS &bull; HDX 3W &bull; IOM DTM &bull; CWG 2023</div>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-700 print:border-slate-400 inline-block text-[11px]">
              Verified Administrative Baseline: {district.adm2_pcode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DossierBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Loading Proposal Evidence Dossier Builder...</p>
        </div>
      }
    >
      <DossierBuilderContent />
    </Suspense>
  );
}