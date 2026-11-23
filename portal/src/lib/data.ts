import rawData from '@/data/map_data_summary.json';
import { DistrictData, NGOData, MapDataSummary } from '@/types';

const data = rawData as unknown as MapDataSummary;

export function getAllDistricts(): DistrictData[] {
  return Object.values(data.districts);
}

export function getDistrictBySlug(slug: string): DistrictData | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase().replace(/[-_]/g, ' ');
  return Object.values(data.districts).find(
    (d) => d.district.toLowerCase() === normalized || 
           d.district.toLowerCase().replace(/\s+/g, '') === normalized.replace(/\s+/g, '') ||
           d.adm2_pcode.toLowerCase() === normalized
  );
}

export function getAllNGOs(): NGOData[] {
  return Object.values(data.ngos);
}

export function getNGOBySlug(slug: string): NGOData | undefined {
  const normSlug = decodeURIComponent(slug).toLowerCase().trim();
  const ngos = Object.values(data.ngos);
  return ngos.find((n) => {
    if (n.slug && n.slug.toLowerCase() === normSlug) return true;
    const computedSlug = n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return computedSlug === normSlug;
  });
}

export function getNGOByName(name: string): NGOData | undefined {
  const decoded = decodeURIComponent(name).toLowerCase();
  return Object.values(data.ngos).find(
    (n) => n.name.toLowerCase() === decoded || n.name.toLowerCase().includes(decoded) || (n.slug && n.slug === decoded)
  );
}

export function getOverviewStats() {
  const districts = Object.values(data.districts);
  const ngos = Object.values(data.ngos);

  const totalDistricts = districts.length;
  const totalNGOs = ngos.length;
  const totalActivities = districts.reduce((sum, d) => sum + (d.total_activities || 0), 0);
  const totalTargeted = districts.reduce((sum, d) => sum + (d.target || 0), 0);
  const totalReached = districts.reduce((sum, d) => sum + (d.reached || 0), 0);

  const totalETTArrivals = districts.reduce((sum, d) => sum + (d.ett_2026?.arrivals || 0), 0);

  const nngoCount = ngos.filter((n) => n.type === 'NNGO').length;
  const ingoCount = ngos.filter((n) => n.type === 'INGO').length;
  const unCount = ngos.filter((n) => n.type === 'UN').length;

  return {
    totalDistricts,
    totalNGOs,
    totalActivities,
    totalTargeted,
    totalReached,
    totalETTArrivals,
    nngoCount,
    ingoCount,
    unCount,
    reachRatioPct: totalTargeted > 0 ? Number(((totalReached / totalTargeted) * 100).toFixed(1)) : 0,
  };
}

export function getTopDistrictsByArrivals(limit = 5): DistrictData[] {
  return Object.values(data.districts)
    .filter((d) => (d.ett_2026?.arrivals || 0) > 0)
    .sort((a, b) => (b.ett_2026?.arrivals || 0) - (a.ett_2026?.arrivals || 0))
    .slice(0, limit);
}

import cvaDataRaw from '@/data/somalia_cva_audit_data.json';

export interface DistrictCVAData {
  district: string;
  total_usd_transferred: number;
  households_reached: number;
  individuals_assisted: number;
  mobile_money_usd: number;
  voucher_usd: number;
  active_organizations: string[];
  records_count: number;
  avg_transfer_value_usd: number;
  idp_camps_count: number;
  gatekeeper_camps_count: number;
  gatekeeper_prevalence_pct: number;
  total_idp_shelters: number;
}

const DISTRICT_ALIASES: Record<string, string> = {
  baidoa: 'baydhaba',
  kismayo: 'kismaayo',
  mogadishu: 'banadir',
  garowe: 'garoowe',
  hargeisa: 'hargeysa',
  beletweyne: 'belet weyne',
  'bulo burto': 'bulo burti',
  dhusamareb: 'dhuusamarreeb',
  gaalkacyo: 'galkacyo',
  galkayo: 'galkacyo',
  bosaso: 'boosaaso',
};

export function getDistrictCVA(districtName: string): DistrictCVAData | undefined {
  const norm = districtName.toLowerCase().trim();
  const aliasTarget = DISTRICT_ALIASES[norm] || norm;
  const strippedAlias = aliasTarget.replace(/[^a-z0-9]/g, '');

  const found = (cvaDataRaw.districts as unknown as DistrictCVAData[]).find((d) => {
    const dNorm = d.district.toLowerCase().trim();
    const dStripped = dNorm.replace(/[^a-z0-9]/g, '');
    return dNorm === norm || dNorm === aliasTarget || dStripped === strippedAlias;
  });
  return found;
}

