export interface ETTData {
  arrivals: number;
  departures: number;
  males?: number;
  females?: number;
  children?: number;
  top_cause: string;
  top_need: string;
  top_origin: string;
  causes_breakdown?: Record<string, number>;
  needs_breakdown?: Record<string, number>;
}

export interface OperatingOrganization {
  name: string;
  type: 'NNGO' | 'INGO' | 'UN' | 'Government';
  clusters: string[];
  activities: number;
  shf_budget: number;
}

export interface DistrictData {
  district: string;
  region: string;
  adm2_pcode: string;
  adm1_pcode: string;
  lat: number;
  lon: number;
  area_sqkm: number;
  total_activities: number;
  unique_orgs_count: number;
  org_type_counts: Record<string, number>;
  cluster_counts: Record<string, number>;
  target: number;
  reached: number;
  reach_ratio_pct: number;
  affected: number;
  opa_priority: string;
  organizations: OperatingOrganization[];
  ett_2026?: ETTData;
}

export interface FundingMechanism {
  name: string;
  type: string;
  verified_usd: number;
  is_verified: boolean;
  channel_path: string;
  details: string;
}

export interface SHFProject {
  project_title: string;
  budget: number;
  direct_cost: number;
  support_cost: number;
  target_beneficiaries: {
    men: number;
    women: number;
    boys: number;
    girls: number;
    total: number;
  };
  allocation_year: number;
  fund_source: string;
  status: string;
}

export interface FTSGrant {
  source_donor: string;
  sector: string;
  amount_usd: number;
  description: string;
}

export interface UNDPContract {
  source_agency: string;
  orders_count: number;
  projects_count: number;
  total_amount_usd: number;
  latest_activity: string;
}

export interface DistrictActivityDetail {
  district: string;
  region: string;
  cluster: string;
  actions: number;
}

export interface NGOData {
  name: string;
  clean_name?: string;
  acronym?: string;
  type: 'NNGO' | 'INGO' | 'UN' | 'Government';
  total_activities: number;
  districts: string[];
  districts_count?: number;
  regions: string[];
  clusters: string[];
  shf_budget?: number;
  total_tracked_funding_usd?: number;
  funding_status?: string;
  funding_tier?: string;
  funding_narrative?: string;
  funding_mechanisms?: FundingMechanism[];
  shf_projects?: SHFProject[];
  fts_grants?: FTSGrant[];
  undp_contracts?: UNDPContract[];
  cwg_cva_active?: boolean;
  cwg_districts?: string[];
  district_details?: DistrictActivityDetail[];
  // Fallback aliases for backwards compatibility
  districts_present?: string[];
  regions_present?: string[];
  clusters_active?: string[];
  shf_allocated_total?: number;
}

export interface MapDataSummary {
  districts: Record<string, DistrictData>;
  ngos: Record<string, NGOData>;
}
