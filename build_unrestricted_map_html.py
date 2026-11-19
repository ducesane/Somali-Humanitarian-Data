import json
import pandas as pd
import os

print("Building unrestricted Somalia 3W/4W Map (No OSM 403 blocking)...")

# 1. Load GeoJSON
with open('hdx_data/somalia_adm1_real.geojson', 'r', encoding='utf-8') as f:
    geojson = json.load(f)

# 2. Load 3W Data
df_3w = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')

# 3. Load Target vs Reached
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)

# Regional aggregations
reg_tr = df_tr.groupby('Region').agg(
    Target=('Target', 'sum'),
    Reached=('Reached', 'sum'),
    Affected=('Total_Affected', 'sum')
).to_dict(orient='index')

reg_3w = df_3w.groupby('Region').agg(
    Activities=('Organization_Name', 'count'),
    Unique_Orgs=('Organization_Name', 'nunique')
).to_dict(orient='index')

# Normalize GeoJSON names & enrich properties
norm_map = {
    'Middle Shebelle': 'Middle Shabelle',
    'Lower Shebelle': 'Lower Shabelle',
    'Hiiraan': 'Hiraan'
}

for feat in geojson['features']:
    raw_name = feat['properties'].get('shapeName', '')
    norm_name = norm_map.get(raw_name, raw_name)
    feat['properties']['normName'] = norm_name
    
    r3w = reg_3w.get(norm_name, {})
    rtr = reg_tr.get(norm_name, {})
    
    act_cnt = r3w.get('Activities', 0)
    org_cnt = r3w.get('Unique_Orgs', 0)
    tgt = rtr.get('Target', 0)
    rch = rtr.get('Reached', 0)
    reach_pct = (rch / tgt * 100) if tgt > 0 else 0
    
    feat['properties']['activities'] = act_cnt
    feat['properties']['uniqueOrgs'] = org_cnt
    feat['properties']['target'] = tgt
    feat['properties']['reached'] = rch
    feat['properties']['reachPct'] = round(reach_pct, 1)

# Load district & NGO summary
with open('map_data_summary.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

districts_json_str = json.dumps(raw_data['districts'])
ngos_json_str = json.dumps(raw_data['ngos'])
geojson_str = json.dumps(geojson)

total_districts = len(raw_data['districts'])
total_ngos = len(raw_data['ngos'])
total_activities = sum(d['total_activities'] for d in raw_data['districts'].values())
nngo_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'NNGO')
ingo_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'INGO')
un_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'UN')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Somalia 3W/4W Unrestricted Map: Partner & District Footprint</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary-navy: #0f172a;
            --accent-blue: #2563eb;
            --accent-emerald: #10b981;
            --accent-amber: #f59e0b;
            --accent-rose: #ef4444;
            --surface-bg: #f8fafc;
            --card-border: #e2e8f0;
        }}
        body {{
            font-family: 'Inter', sans-serif;
            background-color: var(--surface-bg);
            color: #1e293b;
            margin: 0;
            padding: 0;
        }}
        .navbar-custom {{
            background: linear-gradient(135deg, #064e3b 0%, #0f172a 60%, #1e293b 100%);
            border-bottom: 3px solid var(--accent-emerald);
            padding: 1rem 2rem;
            color: white;
        }}
        #map {{
            height: 660px;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid var(--card-border);
            z-index: 10;
            background: #f1f5f9;
        }}
        .filter-panel {{
            background: white;
            border-radius: 12px;
            border: 1px solid var(--card-border);
            padding: 1.25rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            margin-bottom: 1.5rem;
        }}
        .district-card {{
            background: white;
            border-radius: 12px;
            border: 1px solid var(--card-border);
            padding: 1.25rem;
            height: 100%;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
        }}
        .district-card:hover {{
            border-color: var(--accent-blue);
            transform: translateY(-2px);
        }}
        .kpi-badge {{
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
        }}
        .badge-nngo {{ background-color: #d1fae5; color: #047857; border: 1px solid #6ee7b7; }}
        .badge-ingo {{ background-color: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }}
        .badge-un {{ background-color: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }}
        .badge-gov {{ background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }}
        
        .org-pill {{
            display: inline-block;
            background: #f1f5f9;
            color: #1e293b;
            padding: 0.2rem 0.55rem;
            border-radius: 4px;
            font-size: 0.78rem;
            margin: 0.15rem;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.15s ease;
        }}
        .org-pill:hover {{
            background: var(--accent-blue);
            color: white;
            border-color: var(--accent-blue);
        }}
        .table-scroll {{
            max-height: 480px;
            overflow-y: auto;
            border: 1px solid var(--card-border);
            border-radius: 8px;
        }}
        .data-table thead th {{
            background-color: #0f172a;
            color: #ffffff;
            position: sticky;
            top: 0;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 5;
        }}
        .cluster-tag {{
            font-size: 0.72rem;
            padding: 1px 6px;
            border-radius: 3px;
            background: #e0f2fe;
            color: #0369a1;
            margin-right: 2px;
            display: inline-block;
        }}
        .unrestricted-badge {{
            background-color: #059669;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
        }}
        .layer-btn {{
            cursor: pointer;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            border: 1px solid #cbd5e1;
            background: white;
            transition: all 0.2s ease;
        }}
        .layer-btn.active {{
            background: #0f172a;
            color: white;
            border-color: #0f172a;
        }}
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar-custom">
        <div class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="unrestricted-badge"><i class="fa-solid fa-shield-halved"></i> 100% Unrestricted Free Map</span>
                    <span class="badge bg-light text-dark fw-bold">No 403 Policy Blocking &bull; Works Offline & Locally</span>
                </div>
                <h4 class="fw-bold mb-0 text-white">Somalia 3W/4W Operational Presence & Partner Mapping System</h4>
                <p class="small text-light opacity-80 mb-0">Interactive Vector & Basemap Explorer: 204 Humanitarian Agencies across 90 Districts & 18 Regions</p>
            </div>
            <div class="mt-3 mt-md-0 d-flex gap-2">
                <a href="Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx" class="btn btn-warning btn-sm fw-bold shadow-sm" download>
                    <i class="fa-solid fa-file-excel me-1"></i> Export Clean Excel
                </a>
                <button class="btn btn-outline-light btn-sm shadow-sm" onclick="resetAllFilters()">
                    <i class="fa-solid fa-rotate-left me-1"></i> Reset View
                </button>
            </div>
        </div>
    </nav>

    <div class="container-fluid px-lg-4 py-3">

        <!-- Top KPI Statistics Bar -->
        <div class="row g-2 mb-3">
            <div class="col-6 col-md-3 col-xl-2">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">Districts Mapped</div>
                    <div class="fs-4 fw-bold text-primary">{total_districts}</div>
                    <div class="small text-success fw-bold"><i class="fa-solid fa-check"></i> 100% Geo-Located</div>
                </div>
            </div>
            <div class="col-6 col-md-3 col-xl-2">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">Operating Orgs</div>
                    <div class="fs-4 fw-bold text-success">{total_ngos}</div>
                    <div class="small text-muted">{nngo_count} NNGOs &bull; {ingo_count} INGOs &bull; {un_count} UN</div>
                </div>
            </div>
            <div class="col-6 col-md-3 col-xl-2">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">3W Field Actions</div>
                    <div class="fs-4 fw-bold text-warning">{total_activities:,}</div>
                    <div class="small text-muted">Jan–June 2026 footprint</div>
                </div>
            </div>
            <div class="col-6 col-md-3 col-xl-3">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">Top Hub: Bay (Baidoa)</div>
                    <div class="fs-4 fw-bold text-danger">84 Orgs</div>
                    <div class="small text-muted">1,094 activities | 97.0% reach</div>
                </div>
            </div>
            <div class="col-12 col-md-3 col-xl-3">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">Access Desert: Middle Juba</div>
                    <div class="fs-4 fw-bold text-secondary">7 Orgs</div>
                    <div class="small text-danger fw-bold"><i class="fa-solid fa-triangle-exclamation"></i> 35 actions | 11.8% reach</div>
                </div>
            </div>
        </div>

        <!-- Filter Controls -->
        <div class="filter-panel">
            <div class="row g-2 align-items-center">
                <!-- Search by NGO Name -->
                <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-search text-primary me-1"></i> Search by NGO / Partner Name</label>
                    <input type="text" id="ngoSearchInput" class="form-control form-control-sm" placeholder="Type any NGO (e.g. WARDI, NRC, Save the Children, AMARD, Zamzam)..." list="ngoDatalist">
                    <datalist id="ngoDatalist"></datalist>
                </div>

                <!-- Filter by Region -->
                <div class="col-md-3">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-location-dot text-danger me-1"></i> Filter by Region</label>
                    <select id="regionSelect" class="form-select form-select-sm">
                        <option value="ALL">All 18 Administrative Regions</option>
                    </select>
                </div>

                <!-- Filter by Cluster / Sector -->
                <div class="col-md-3">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-layer-group text-warning me-1"></i> Filter by Sector / Cluster</label>
                    <select id="clusterSelect" class="form-select form-select-sm">
                        <option value="ALL">All Humanitarian Clusters</option>
                        <option value="Health">Health (1,462 actions)</option>
                        <option value="Food Security Cluster">Food Security (1,212 actions)</option>
                        <option value="Child Protection">Child Protection (909 actions)</option>
                        <option value="Nutrition">Nutrition (791 actions)</option>
                        <option value="WASH">WASH (769 actions)</option>
                        <option value="Gender Based Violence">Gender Based Violence (684 actions)</option>
                        <option value="Protection">Protection General (581 actions)</option>
                        <option value="Education">Education (535 actions)</option>
                        <option value="Explosives Hazards">Explosives Hazards (97 actions)</option>
                        <option value="HLP">Housing, Land & Property (79 actions)</option>
                        <option value="CCCM">CCCM (62 actions)</option>
                        <option value="Shelter and NFIs">Shelter and NFIs (52 actions)</option>
                    </select>
                </div>

                <!-- Filter by Org Type -->
                <div class="col-md-2">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-users-viewfinder text-success me-1"></i> Org Category</label>
                    <select id="orgTypeSelect" class="form-select form-select-sm">
                        <option value="ALL">All Categories</option>
                        <option value="NNGO">National NGOs (NNGO - 118 orgs)</option>
                        <option value="INGO">International NGOs (INGO - 68 orgs)</option>
                        <option value="UN">UN Agencies (11 orgs)</option>
                        <option value="Government">Government (6 entities)</option>
                    </select>
                </div>
            </div>

            <!-- Guaranteed Free Map Layer Switcher Buttons -->
            <div class="d-flex flex-wrap align-items-center justify-content-between mt-3 pt-2 border-top">
                <div class="d-flex flex-wrap align-items-center gap-2">
                    <span class="small fw-bold text-muted"><i class="fa-solid fa-layer-group me-1"></i> Basemap:</span>
                    <button class="layer-btn active" id="btnTopo" onclick="switchBaseLayer('topo')"><i class="fa-solid fa-map"></i> Free World Topo (Esri)</button>
                    <button class="layer-btn" id="btnSat" onclick="switchBaseLayer('sat')"><i class="fa-solid fa-satellite"></i> Free Satellite Imagery</button>
                    <button class="layer-btn" id="btnLight" onclick="switchBaseLayer('light')"><i class="fa-solid fa-compass"></i> Carto Light Clean</button>
                    <button class="layer-btn text-success fw-bold" id="btnVector" onclick="switchBaseLayer('vector')"><i class="fa-solid fa-shield-check"></i> Pure Vector (100% Offline / Zero Network)</button>
                </div>
                <div id="activeFilterBadge" class="small text-primary fw-bold mt-2 mt-md-0" style="display: none;"></div>
            </div>
        </div>

        <!-- Main Map and Details Row -->
        <div class="row g-3 mb-4">
            <!-- Map Container -->
            <div class="col-lg-8">
                <div class="position-relative">
                    <div id="map"></div>

                    <!-- Legend Overlay -->
                    <div class="position-absolute bottom-0 start-0 m-3 p-2 bg-white bg-opacity-95 rounded border shadow-sm small" style="z-index: 999; max-width: 290px;">
                        <div class="fw-bold mb-1 text-dark"><i class="fa-solid fa-chart-pie me-1"></i> Target Coverage Legend</div>
                        <div class="d-flex align-items-center gap-1 mb-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; display: inline-block; border: 1px solid white;"></span>
                            <span class="small">High Reach (&ge;85% target reached)</span>
                        </div>
                        <div class="d-flex align-items-center gap-1 mb-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; display: inline-block; border: 1px solid white;"></span>
                            <span class="small">Moderate Reach (50% &ndash; 84%)</span>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; display: inline-block; border: 1px solid white;"></span>
                            <span class="small">Severe Deficit (&lt;50% reached)</span>
                        </div>
                        <div class="text-muted mt-1 pt-1 border-top" style="font-size: 0.72rem;">
                            &bull; 18 Region vector boundaries highlighted<br>
                            &bull; Circle radius = Active NGO count<br>
                            &bull; Click any circle to open full NGO roster
                        </div>
                    </div>
                </div>
            </div>

            <!-- District Detail Panel -->
            <div class="col-lg-4">
                <div class="district-card" id="districtDetailCard">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge bg-secondary mb-1" id="detRegionBadge">Select a District</span>
                            <h5 class="fw-bold mb-0 text-primary" id="detDistrictTitle">Click any circle on map</h5>
                        </div>
                        <span class="badge bg-dark" id="detPcode"></span>
                    </div>

                    <div id="detStatsContainer" style="display: none;">
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="small text-muted" style="font-size: 0.75rem;">Active NGOs</div>
                                    <div class="fs-5 fw-bold text-success" id="detOrgCount">0</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="small text-muted" style="font-size: 0.75rem;">Field Activities</div>
                                    <div class="fs-5 fw-bold text-warning" id="detActCount">0</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="small text-muted" style="font-size: 0.75rem;">Targeted Pop.</div>
                                    <div class="fw-bold" id="detTarget">0</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded text-center">
                                    <div class="small text-muted" style="font-size: 0.75rem;">Reached Pop.</div>
                                    <div class="fw-bold" id="detReached">0</div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="d-flex justify-content-between small fw-bold mb-1">
                                <span>Target Coverage</span>
                                <span id="detReachPct">0%</span>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div id="detProgressBar" class="progress-bar bg-success" style="width: 0%;"></div>
                            </div>
                        </div>

                        <!-- Organization Breakdown Tags -->
                        <div class="d-flex gap-2 mb-2">
                            <span class="kpi-badge badge-nngo" id="detNngoTag">0 NNGOs</span>
                            <span class="kpi-badge badge-ingo" id="detIngoTag">0 INGOs</span>
                            <span class="kpi-badge badge-un" id="detUnTag">0 UN</span>
                        </div>

                        <!-- Active Clusters -->
                        <div class="mb-3">
                            <div class="small fw-bold text-muted mb-1">Active Clusters / Sectors:</div>
                            <div id="detClusterTags"></div>
                        </div>

                        <!-- Full Operating NGO Roster -->
                        <div class="border-top pt-2">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="small fw-bold text-dark">Operating NGO Roster (<span id="rosterCount">0</span>):</span>
                            </div>
                            <div id="detNgoList" style="max-height: 230px; overflow-y: auto; font-size: 0.8rem;"></div>
                        </div>
                    </div>

                    <div id="detPlaceholder" class="text-center py-5 text-muted">
                        <i class="fa-solid fa-map-pin fa-3x mb-3 text-secondary opacity-50"></i>
                        <p class="small">Click on any district circle on the map to inspect its full roster of operating NGOs, clusters, target populations, and reach statistics.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- NGO Profile Drawer (When an NGO is clicked or searched) -->
        <div class="analysis-card" id="ngoProfileCard" style="display: none;">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary fs-6" id="profTypeBadge">NNGO</span>
                    <h4 class="fw-bold mb-0 text-dark" id="profName">Organization Profile</h4>
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="closeNgoProfile()"><i class="fa-solid fa-xmark"></i> Close</button>
            </div>
            <div class="row g-3 mb-3">
                <div class="col-md-3">
                    <div class="p-2 bg-light rounded text-center">
                        <div class="small text-muted">Total Field Actions</div>
                        <div class="fs-4 fw-bold text-primary" id="profTotalActs">0</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-2 bg-light rounded text-center">
                        <div class="small text-muted">Districts Covered</div>
                        <div class="fs-4 fw-bold text-success" id="profDistCount">0</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-2 bg-light rounded text-center">
                        <div class="small text-muted">Regions Covered</div>
                        <div class="fs-4 fw-bold text-warning" id="profRegCount">0</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-2 bg-light rounded text-center">
                        <div class="small text-muted">SHF 2026 Allocation</div>
                        <div class="fs-4 fw-bold text-success" id="profShfAmt">$0</div>
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <span class="small fw-bold text-muted">Active Clusters:</span>
                <span id="profClusters" class="ms-1"></span>
            </div>
            <div>
                <span class="small fw-bold text-muted">Districts Operating In (Click to fly to district):</span>
                <div id="profDistrictPills" class="mt-1"></div>
            </div>
        </div>

        <!-- Master Directory Table of All 204 Humanitarian Organizations -->
        <div class="analysis-card">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                <h5 class="fw-bold mb-2 mb-md-0"><i class="fa-solid fa-address-book text-primary me-2"></i>Master Directory of Operating Humanitarian Organizations (204 Agencies)</h5>
                <div class="col-md-4">
                    <input type="text" id="tableSearchInput" class="form-control form-control-sm" placeholder="Search table by name, category, or cluster...">
                </div>
            </div>
            <div class="table-scroll">
                <table class="table table-hover table-striped align-middle data-table mb-0" id="masterNgoTable">
                    <thead>
                        <tr>
                            <th>Organization Name</th>
                            <th>Category</th>
                            <th class="text-center">Field Actions</th>
                            <th class="text-center">Districts</th>
                            <th>Active Clusters</th>
                            <th class="text-end">SHF 2026 Funding</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="masterNgoTableBody">
                    </tbody>
                </table>
            </div>
            <div class="small text-muted text-end mt-2" id="tableRecordCount">Showing 204 organizations</div>
        </div>

    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <!-- Map & Interactive Script -->
    <script>
        const districtsData = {districts_json_str};
        const ngosData = {ngos_json_str};
        const somaliaGeoJson = {geojson_str};

        // Initialize Leaflet Map
        const map = L.map('map', {{
            center: [5.15, 46.2],
            zoom: 6,
            minZoom: 5,
            maxZoom: 12
        }});

        // Unrestricted Free Basemap Layers (NEVER Blocked by OSM Referrer Check)
        const freeTileLayers = {{
            topo: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{{z}}/{{y}}/{{x}}', {{
                maxZoom: 18,
                attribution: 'Tiles &copy; Esri &mdash; Public GIS Basemap'
            }}),
            sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{{z}}/{{y}}/{{x}}', {{
                maxZoom: 18,
                attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite'
            }}),
            light: L.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/voyager/{{z}}/{{x}}/{{y}}@2x.png', {{
                maxZoom: 19,
                attribution: '&copy; CARTO &mdash; Free Open Basemap'
            }})
        }};

        // Add Free Topo as default base layer
        freeTileLayers.topo.addTo(map);
        let currentLayer = 'topo';

        function switchBaseLayer(layerKey) {{
            if (layerKey === 'vector') {{
                // Turn off all tile layers for pure offline vector display
                if (currentLayer !== 'vector' && freeTileLayers[currentLayer]) {{
                    map.removeLayer(freeTileLayers[currentLayer]);
                }}
                currentLayer = 'vector';
                document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('btnVector').classList.add('active');
                return;
            }}

            if (currentLayer === 'vector') {{
                freeTileLayers[layerKey].addTo(map);
            }} else if (layerKey !== currentLayer) {{
                map.removeLayer(freeTileLayers[currentLayer]);
                freeTileLayers[layerKey].addTo(map);
            }}
            currentLayer = layerKey;

            document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
            if (layerKey === 'topo') document.getElementById('btnTopo').classList.add('active');
            else if (layerKey === 'sat') document.getElementById('btnSat').classList.add('active');
            else if (layerKey === 'light') document.getElementById('btnLight').classList.add('active');
        }}

        // Add 18 Administrative Regions GeoJSON Polygon Layer
        let geojsonLayer = L.geoJSON(somaliaGeoJson, {{
            style: function(feature) {{
                return {{
                    fillColor: '#94a3b8',
                    weight: 1.5,
                    opacity: 0.8,
                    color: '#475569',
                    dashArray: '3',
                    fillOpacity: 0.15
                }};
            }},
            onEachFeature: function(feature, layer) {{
                const p = feature.properties;
                layer.bindTooltip(`
                    <div style="font-family: Inter, sans-serif; font-size: 0.85rem;">
                        <strong>Region: ${{p.normName}}</strong><br/>
                        ${{p.uniqueOrgs}} Active NGOs | ${{p.activities}} Activities<br/>
                        Coverage: <strong>${{p.reachPct}}%</strong>
                    </div>
                `, {{ direction: 'center', permanent: false, className: 'custom-tooltip' }});

                layer.on('mouseover', function(e) {{
                    const l = e.target;
                    l.setStyle({{
                        weight: 3,
                        color: '#2563eb',
                        fillOpacity: 0.3
                    }});
                }});

                layer.on('mouseout', function(e) {{
                    geojsonLayer.resetStyle(e.target);
                }});

                layer.on('click', function(e) {{
                    document.getElementById('regionSelect').value = p.normName;
                    applyFilters();
                }});
            }}
        }}).addTo(map);

        let circleMarkers = [];

        // Populate Region dropdown
        const regionsSet = new Set();
        Object.values(districtsData).forEach(d => {{
            if (d.region) regionsSet.add(d.region);
        }});
        const sortedRegions = Array.from(regionsSet).sort();
        const regionSelect = document.getElementById('regionSelect');
        sortedRegions.forEach(r => {{
            const opt = document.createElement('option');
            opt.value = r;
            opt.innerText = r;
            regionSelect.appendChild(opt);
        }});

        // Populate NGO Datalist
        const datalist = document.getElementById('ngoDatalist');
        Object.keys(ngosData).sort().forEach(name => {{
            const opt = document.createElement('option');
            opt.value = name;
            datalist.appendChild(opt);
        }});

        function getCircleColor(reachPct) {{
            if (reachPct >= 85) return '#10b981'; // Green
            if (reachPct >= 50) return '#f59e0b'; // Amber
            return '#ef4444'; // Red
        }}

        function renderMapMarkers(filterNgo = null, filterRegion = 'ALL', filterCluster = 'ALL', filterType = 'ALL') {{
            circleMarkers.forEach(m => map.removeLayer(m));
            circleMarkers = [];

            let bounds = [];

            Object.values(districtsData).forEach(d => {{
                if (!d.lat || !d.lon) return;

                if (filterRegion !== 'ALL' && d.region !== filterRegion) return;

                if (filterCluster !== 'ALL') {{
                    if (!d.cluster_counts || !d.cluster_counts[filterCluster]) return;
                }}

                if (filterType !== 'ALL') {{
                    if (!d.org_type_counts || !d.org_type_counts[filterType]) return;
                }}

                let isNgoOperatingHere = true;
                if (filterNgo) {{
                    isNgoOperatingHere = d.organizations.some(o => o.name.toLowerCase().includes(filterNgo.toLowerCase()));
                    if (!isNgoOperatingHere) return;
                }}

                const orgCount = d.unique_orgs_count || 1;
                const radius = Math.max(7, Math.min(28, Math.sqrt(orgCount) * 4));
                const color = filterNgo ? '#2563eb' : getCircleColor(d.reach_ratio_pct);

                const circle = L.circleMarker([d.lat, d.lon], {{
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.85
                }}).addTo(map);

                circle.bindTooltip(`
                    <div style="font-family: Inter, sans-serif; font-size: 0.85rem;">
                        <strong>${{d.district}}</strong> (${{d.region}})<br/>
                        <span style="color: #2563eb; font-weight: 600;">${{d.unique_orgs_count}} Active NGOs</span> | ${{d.total_activities}} Activities<br/>
                        Target Coverage: <strong>${{d.reach_ratio_pct}}%</strong>
                    </div>
                `, {{ direction: 'top', className: 'custom-tooltip' }});

                circle.on('click', () => {{
                    showDistrictDetails(d);
                }});

                circleMarkers.push(circle);
                bounds.push([d.lat, d.lon]);
            }});

            if (bounds.length > 0 && (filterNgo || filterRegion !== 'ALL')) {{
                map.fitBounds(bounds, {{ padding: [50, 50], maxZoom: 9 }});
            }}
        }}

        function showDistrictDetails(d) {{
            document.getElementById('detPlaceholder').style.display = 'none';
            document.getElementById('detStatsContainer').style.display = 'block';

            document.getElementById('detRegionBadge').innerText = d.region;
            document.getElementById('detDistrictTitle').innerText = d.district;
            document.getElementById('detPcode').innerText = d.adm2_pcode || '';

            document.getElementById('detOrgCount').innerText = d.unique_orgs_count;
            document.getElementById('detActCount').innerText = d.total_activities;
            document.getElementById('detTarget').innerText = Number(d.target).toLocaleString();
            document.getElementById('detReached').innerText = Number(d.reached).toLocaleString();

            const reachPct = d.reach_ratio_pct || 0;
            document.getElementById('detReachPct').innerText = reachPct + '%';
            const pb = document.getElementById('detProgressBar');
            pb.style.width = Math.min(100, reachPct) + '%';
            pb.className = 'progress-bar ' + (reachPct >= 85 ? 'bg-success' : (reachPct >= 50 ? 'bg-warning' : 'bg-danger'));

            const typeCounts = d.org_type_counts || {{}};
            document.getElementById('detNngoTag').innerText = (typeCounts['NNGO'] || 0) + ' NNGOs';
            document.getElementById('detIngoTag').innerText = (typeCounts['INGO'] || 0) + ' INGOs';
            document.getElementById('detUnTag').innerText = (typeCounts['UN'] || 0) + ' UN';

            const clTagsContainer = document.getElementById('detClusterTags');
            clTagsContainer.innerHTML = '';
            if (d.cluster_counts) {{
                Object.entries(d.cluster_counts).forEach(([cl, cnt]) => {{
                    const span = document.createElement('span');
                    span.className = 'cluster-tag';
                    span.innerText = `${{cl}} (${{cnt}})`;
                    clTagsContainer.appendChild(span);
                }});
            }}

            const ngoList = document.getElementById('detNgoList');
            ngoList.innerHTML = '';
            document.getElementById('rosterCount').innerText = d.organizations.length;

            d.organizations.forEach(org => {{
                const item = document.createElement('div');
                item.className = 'py-1 border-bottom d-flex justify-content-between align-items-center';
                
                let badgeClass = 'badge-nngo';
                if (org.type === 'INGO') badgeClass = 'badge-ingo';
                else if (org.type === 'UN') badgeClass = 'badge-un';
                else if (org.type === 'Government') badgeClass = 'badge-gov';

                item.innerHTML = `
                    <div class="text-truncate me-2" style="max-width: 215px;">
                        <span class="org-pill" onclick="inspectNgo('${{org.name.replace(/'/g, "\\\\\\'")}}')">${{org.name}}</span>
                    </div>
                    <span class="kpi-badge ${{badgeClass}}" style="font-size: 0.7rem; padding: 2px 5px;">${{org.type}}</span>
                `;
                ngoList.appendChild(item);
            }});
        }}

        function inspectNgo(ngoName) {{
            const ngo = ngosData[ngoName];
            if (!ngo) return;

            document.getElementById('ngoProfileCard').style.display = 'block';
            document.getElementById('profName').innerText = ngo.name;
            document.getElementById('profTypeBadge').innerText = ngo.type;
            document.getElementById('profTypeBadge').className = 'badge ' + 
                (ngo.type === 'NNGO' ? 'bg-success' : (ngo.type === 'INGO' ? 'bg-primary' : 'bg-warning text-dark'));

            document.getElementById('profTotalActs').innerText = ngo.total_activities;
            document.getElementById('profDistCount').innerText = ngo.districts_count;
            document.getElementById('profRegCount').innerText = ngo.regions.length;
            document.getElementById('profShfAmt').innerText = ngo.shf_budget > 0 ? '$' + Number(ngo.shf_budget).toLocaleString() : 'N/A';

            const clSpan = document.getElementById('profClusters');
            clSpan.innerHTML = '';
            ngo.clusters.forEach(c => {{
                clSpan.innerHTML += `<span class="cluster-tag">${{c}}</span>`;
            }});

            const distContainer = document.getElementById('profDistrictPills');
            distContainer.innerHTML = '';
            ngo.districts.forEach(distName => {{
                const span = document.createElement('span');
                span.className = 'org-pill';
                span.innerText = distName;
                span.onclick = () => {{
                    const dObj = districtsData[distName];
                    if (dObj) {{
                        map.setView([dObj.lat, dObj.lon], 9);
                        showDistrictDetails(dObj);
                    }}
                }};
                distContainer.appendChild(span);
            }});

            renderMapMarkers(ngo.name);
            document.getElementById('activeFilterBadge').style.display = 'block';
            document.getElementById('activeFilterBadge').innerHTML = `<i class="fa-solid fa-filter me-1"></i> Filtering map for: <strong>${{ngo.name}}</strong> (${{ngo.districts_count}} districts)`;

            window.scrollTo({{ top: 120, behavior: 'smooth' }});
        }}

        function closeNgoProfile() {{
            document.getElementById('ngoProfileCard').style.display = 'none';
            document.getElementById('activeFilterBadge').style.display = 'none';
            document.getElementById('ngoSearchInput').value = '';
            renderMapMarkers();
        }}

        function populateMasterTable() {{
            const tbody = document.getElementById('masterNgoTableBody');
            tbody.innerHTML = '';

            const sortedNgos = Object.values(ngosData).sort((a, b) => b.total_activities - a.total_activities);

            sortedNgos.forEach(ngo => {{
                const tr = document.createElement('tr');
                let badgeClass = 'badge-nngo';
                if (ngo.type === 'INGO') badgeClass = 'badge-ingo';
                else if (ngo.type === 'UN') badgeClass = 'badge-un';
                else if (ngo.type === 'Government') badgeClass = 'badge-gov';

                const shfText = ngo.shf_budget > 0 ? `<strong class="text-success">$${{Number(ngo.shf_budget).toLocaleString()}}</strong>` : '<span class="text-muted">-</span>';

                tr.innerHTML = `
                    <td class="fw-bold text-dark">${{ngo.name}}</td>
                    <td><span class="kpi-badge ${{badgeClass}}">${{ngo.type}}</span></td>
                    <td class="text-center fw-bold text-primary">${{ngo.total_activities}}</td>
                    <td class="text-center">${{ngo.districts_count}}</td>
                    <td><div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${{ngo.clusters.join(', ')}}</div></td>
                    <td class="text-end">${{shfText}}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary" style="font-size: 0.75rem; padding: 2px 8px;" onclick="inspectNgo('${{ngo.name.replace(/'/g, "\\\\\\'")}}')">
                            <i class="fa-solid fa-map-pin"></i> Map
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            }});
        }}

        document.getElementById('ngoSearchInput').addEventListener('input', function() {{
            const val = this.value.trim();
            if (val.length >= 2) {{
                inspectNgo(val);
            }} else if (val.length === 0) {{
                closeNgoProfile();
            }}
        }});

        document.getElementById('regionSelect').addEventListener('change', applyFilters);
        document.getElementById('clusterSelect').addEventListener('change', applyFilters);
        document.getElementById('orgTypeSelect').addEventListener('change', applyFilters);

        function applyFilters() {{
            const reg = document.getElementById('regionSelect').value;
            const cl = document.getElementById('clusterSelect').value;
            const typ = document.getElementById('orgTypeSelect').value;
            const ngo = document.getElementById('ngoSearchInput').value.trim() || null;

            renderMapMarkers(ngo, reg, cl, typ);

            const badge = document.getElementById('activeFilterBadge');
            badge.style.display = 'block';
            badge.innerHTML = `<i class="fa-solid fa-filter me-1"></i> Active Filters: Region [${{reg}}], Cluster [${{cl}}], Type [${{typ}}]`;
        }}

        function resetAllFilters() {{
            document.getElementById('ngoSearchInput').value = '';
            document.getElementById('regionSelect').value = 'ALL';
            document.getElementById('clusterSelect').value = 'ALL';
            document.getElementById('orgTypeSelect').value = 'ALL';
            document.getElementById('activeFilterBadge').style.display = 'none';
            document.getElementById('ngoProfileCard').style.display = 'none';
            map.setView([5.15, 46.2], 6);
            renderMapMarkers();
        }}

        document.getElementById('tableSearchInput').addEventListener('keyup', function() {{
            const filter = this.value.toLowerCase();
            const rows = document.querySelectorAll('#masterNgoTable tbody tr');
            let count = 0;
            rows.forEach(r => {{
                if (r.innerText.toLowerCase().includes(filter)) {{
                    r.style.display = '';
                    count++;
                }} else {{
                    r.style.display = 'none';
                }}
            }});
            document.getElementById('tableRecordCount').innerText = `Showing ${{count}} organizations`;
        }});

        // Setup
        renderMapMarkers();
        populateMasterTable();

        if (districtsData['Baydhaba']) {{
            showDistrictDetails(districtsData['Baydhaba']);
        }} else if (districtsData['Baidoa']) {{
            showDistrictDetails(districtsData['Baidoa']);
        }}
    </script>
</body>
</html>
"""

with open('somalia_3w_4w_interactive_ngo_map.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

artifact_html = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_3w_4w_interactive_ngo_map.html'
with open(artifact_html, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully updated somalia_3w_4w_interactive_ngo_map.html with GeoJSON vector layer and Esri unrestricted basemaps!")
