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

export interface NGOData {
  name: string;
  type: 'NNGO' | 'INGO' | 'UN' | 'Government';
  total_activities: number;
  districts_present: string[];
  regions_present: string[];
  clusters_active: string[];
  shf_allocated_total?: number;
}

export interface MapDataSummary {
  districts: Record<string, DistrictData>;
  ngos: Record<string, NGOData>;
}
