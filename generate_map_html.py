import json
import os

print("Building somalia_3w_4w_interactive_ngo_map.html...")

with open('map_data_summary.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

districts_json_str = json.dumps(raw_data['districts'])
ngos_json_str = json.dumps(raw_data['ngos'])

# Precompute initial stats
total_districts = len(raw_data['districts'])
total_ngos = len(raw_data['ngos'])
total_activities = sum(d['total_activities'] for d in raw_data['districts'].values())

nngo_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'NNGO')
ingo_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'INGO')
un_count = sum(1 for ngo in raw_data['ngos'].values() if ngo['type'] == 'UN')

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Somalia 3W/4W Interactive Geospatial Intelligence Map: Partner & District Footprint</title>
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
            --accent-cyan: #06b6d4;
            --accent-emerald: #10b981;
            --accent-orange: #ea580c;
            --accent-rose: #e11d48;
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
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-bottom: 3px solid var(--accent-emerald);
            padding: 1rem 2rem;
            color: white;
        }}
        #map {{
            height: 640px;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid var(--card-border);
            z-index: 10;
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
        .custom-popup .leaflet-popup-content-wrapper {{
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            padding: 0.5rem;
        }}
        .custom-popup h6 {{
            font-weight: 700;
            color: var(--primary-navy);
            margin-bottom: 0.25rem;
        }}
        .btn-filter-type.active {{
            background-color: var(--primary-navy);
            color: white;
            border-color: var(--primary-navy);
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
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar-custom">
        <div class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
                <span class="badge bg-success mb-1"><i class="fa-solid fa-map-location-dot me-1"></i> Interactive Geospatial 3W / 4W Database</span>
                <h4 class="fw-bold mb-0 text-white">Somalia 3W/4W Operational Presence & Partner Mapping System</h4>
                <p class="small text-light opacity-75 mb-0">Mapping 204 Organizations across 90 Districts & 18 Regions (HDX 3W 2026 & CWG 4W)</p>
            </div>
            <div class="mt-3 mt-md-0 d-flex gap-2">
                <a href="Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx" class="btn btn-warning btn-sm fw-bold shadow-sm" download>
                    <i class="fa-solid fa-file-excel me-1"></i> Export Excel
                </a>
                <button class="btn btn-outline-light btn-sm shadow-sm" onclick="resetAllFilters()">
                    <i class="fa-solid fa-rotate-left me-1"></i> Reset Filters
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
                    <div class="small text-muted">100% Geo-located</div>
                </div>
            </div>
            <div class="col-6 col-md-3 col-xl-2">
                <div class="p-2 bg-white rounded-3 border text-center">
                    <div class="small text-muted fw-bold text-uppercase">Operating Orgs</div>
                    <div class="fs-4 fw-bold text-success">{total_ngos}</div>
                    <div class="small text-muted">{nngo_count} NNGOs | {ingo_count} INGOs | {un_count} UN</div>
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
                    <div class="small text-muted">35 activities | 11.8% reach</div>
                </div>
            </div>
        </div>

        <!-- Filter Controls -->
        <div class="filter-panel">
            <div class="row g-2 align-items-center">
                <!-- Search by NGO Name -->
                <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-search me-1"></i> Search by NGO / Partner Name</label>
                    <input type="text" id="ngoSearchInput" class="form-control form-control-sm" placeholder="Search any NGO (e.g. WARDI, NRC, Save the Children, AMARD, Zamzam)..." list="ngoDatalist">
                    <datalist id="ngoDatalist"></datalist>
                </div>

                <!-- Filter by Region -->
                <div class="col-md-3">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-location-dot me-1"></i> Filter by Region</label>
                    <select id="regionSelect" class="form-select form-select-sm">
                        <option value="ALL">All 18 Regions</option>
                    </select>
                </div>

                <!-- Filter by Cluster / Sector -->
                <div class="col-md-3">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-layer-group me-1"></i> Filter by Sector / Cluster</label>
                    <select id="clusterSelect" class="form-select form-select-sm">
                        <option value="ALL">All Clusters</option>
                        <option value="Health">Health</option>
                        <option value="Food Security Cluster">Food Security</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="WASH">WASH</option>
                        <option value="Child Protection">Child Protection</option>
                        <option value="Gender Based Violence">Gender Based Violence</option>
                        <option value="Protection">Protection</option>
                        <option value="Education">Education</option>
                        <option value="Shelter and NFIs">Shelter and NFIs</option>
                        <option value="CCCM">CCCM</option>
                    </select>
                </div>

                <!-- Filter by Org Type -->
                <div class="col-md-2">
                    <label class="form-label small fw-bold text-muted mb-1"><i class="fa-solid fa-users-viewfinder me-1"></i> Org Category</label>
                    <select id="orgTypeSelect" class="form-select form-select-sm">
                        <option value="ALL">All Categories</option>
                        <option value="NNGO">National NGOs (NNGO)</option>
                        <option value="INGO">International NGOs (INGO)</option>
                        <option value="UN">UN Agencies</option>
                        <option value="Government">Government</option>
                    </select>
                </div>
            </div>

            <!-- Active Selection Banner -->
            <div id="activeFilterBadge" class="mt-2 small text-primary fw-bold" style="display: none;"></div>
        </div>

        <!-- Main Map and Details Row -->
        <div class="row g-3 mb-4">
            <!-- Map Container -->
            <div class="col-lg-8">
                <div class="position-relative">
                    <div id="map"></div>
                    <div class="position-absolute bottom-0 start-0 m-3 p-2 bg-white bg-opacity-90 rounded border shadow-sm small" style="z-index: 999; max-width: 280px;">
                        <div class="fw-bold mb-1">Target Coverage Ratio (%)</div>
                        <div class="d-flex align-items-center gap-1 mb-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                            <span>High Reach (>85% target met)</span>
                        </div>
                        <div class="d-flex align-items-center gap-1 mb-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                            <span>Moderate Reach (50% - 85%)</span>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                            <span>Severe Deficit (<50% reached)</span>
                        </div>
                        <div class="text-muted mt-1" style="font-size: 0.7rem;">Circle size = Number of active NGOs</div>
                    </div>
                </div>
            </div>

            <!-- District Detail Panel -->
            <div class="col-lg-4">
                <div class="district-card" id="districtDetailCard">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge bg-secondary mb-1" id="detRegionBadge">Select a District</span>
                            <h5 class="fw-bold mb-0 text-primary" id="detDistrictTitle">Click any map circle</h5>
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

                        <!-- Organization Breakdown Tabs/Tags -->
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
                        <div class="fs-4 fw-bold text-emerald" id="profShfAmt">$0</div>
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <span class="small fw-bold text-muted">Active Clusters:</span>
                <span id="profClusters" class="ms-1"></span>
            </div>
            <div>
                <span class="small fw-bold text-muted">Districts Operating In:</span>
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

        // Initialize Leaflet Map
        const map = L.map('map', {{
            center: [5.15, 46.2],
            zoom: 6,
            minZoom: 5,
            maxZoom: 11
        }});

        // Add CartoDB Positron base tile layer
        L.tileLayer('https://{{s}}.basemaps.cartocdn.com/rastertiles/voyager/{{z}}/{{x}}/{{y}}{{r}}.png', {{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
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

        // Helper function for circle colors based on target reach ratio
        function getCircleColor(reachPct) {{
            if (reachPct >= 85) return '#10b981'; // Green
            if (reachPct >= 50) return '#f59e0b'; // Amber
            return '#ef4444'; // Red
        }}

        // Render markers on the map
        function renderMapMarkers(filterNgo = null, filterRegion = 'ALL', filterCluster = 'ALL', filterType = 'ALL') {{
            // Clear existing markers
            circleMarkers.forEach(m => map.removeLayer(m));
            circleMarkers = [];

            let bounds = [];

            Object.values(districtsData).forEach(d => {{
                if (!d.lat || !d.lon) return;

                // Apply filters
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

                // Calculate radius based on active organizations
                const orgCount = d.unique_orgs_count || 1;
                const radius = Math.max(7, Math.min(28, Math.sqrt(orgCount) * 4));
                const color = filterNgo ? '#2563eb' : getCircleColor(d.reach_ratio_pct);

                const circle = L.circleMarker([d.lat, d.lon], {{
                    radius: radius,
                    fillColor: color,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }}).addTo(map);

                // Tooltip
                circle.bindTooltip(`
                    <div style="font-family: Inter, sans-serif;">
                        <strong>${{d.district}}</strong> (${{d.region}})<br/>
                        <span style="color: #2563eb; font-weight: 600;">${{d.unique_orgs_count}} Active NGOs</span> | ${{d.total_activities}} Activities<br/>
                        Target Reached: <strong>${{d.reach_ratio_pct}}%</strong>
                    </div>
                `, {{ direction: 'top', className: 'custom-tooltip' }});

                // Click event to show details
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

        // Show details in the right-hand card
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

            // Tags
            const typeCounts = d.org_type_counts || {{}};
            document.getElementById('detNngoTag').innerText = (typeCounts['NNGO'] || 0) + ' NNGOs';
            document.getElementById('detIngoTag').innerText = (typeCounts['INGO'] || 0) + ' INGOs';
            document.getElementById('detUnTag').innerText = (typeCounts['UN'] || 0) + ' UN';

            // Cluster tags
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

            // NGO List
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
                    <div class="text-truncate me-2" style="max-width: 220px;">
                        <span class="org-pill" onclick="inspectNgo('${{org.name.replace(/'/g, "\\\\\\'")}}')">${{org.name}}</span>
                    </div>
                    <span class="kpi-badge ${{badgeClass}}" style="font-size: 0.7rem; padding: 2px 5px;">${{org.type}}</span>
                `;
                ngoList.appendChild(item);
            }});
        }}

        // Inspect single NGO Profile
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

            // Clusters
            const clSpan = document.getElementById('profClusters');
            clSpan.innerHTML = '';
            ngo.clusters.forEach(c => {{
                clSpan.innerHTML += `<span class="cluster-tag">${{c}}</span>`;
            }});

            // District pills
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

            // Highlight on map
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

        // Master Directory Table Population
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

        // Filter event listeners
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

        // Table search
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

        // Initial setup
        renderMapMarkers();
        populateMasterTable();

        // Default: Open Baidoa as showcase
        if (districtsData['Baydhaba']) {{
            showDistrictDetails(districtsData['Baydhaba']);
        }} else if (districtsData['Baidoa']) {{
            showDistrictDetails(districtsData['Baidoa']);
        }}
    </script>
</body>
</html>
"""

# Save to local workspace
with open('somalia_3w_4w_interactive_ngo_map.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

# Save to artifact dir
artifact_html = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_3w_4w_interactive_ngo_map.html'
with open(artifact_html, 'w', encoding='utf-8') as f:
    f.write(html_template)

print("Successfully generated somalia_3w_4w_interactive_ngo_map.html and copied to artifact directory!")
