import pandas as pd
import numpy as np
import json
import os

print("Generating somalia_3w_operational_presence_fts_comparison.html...")

# Load datasets
df_3w26 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)

# Partner count per district in 3W 2026
dist_partners = df_3w26.groupby('District')['Organization_Name'].nunique().reset_index()
dist_partners.columns = ['District', 'Active_Partners_3W']
dist_acts = df_3w26.groupby('District')['Organization_Name'].count().reset_index()
dist_acts.columns = ['District', 'Field_Activities_3W']

df_dist_merged = pd.merge(df_tr, dist_partners, on='District', how='left').fillna(0)
df_dist_merged = pd.merge(df_dist_merged, dist_acts, on='District', how='left').fillna(0)
df_dist_merged['Reach_Ratio_Pct'] = np.where(df_dist_merged['Target'] > 0, (df_dist_merged['Reached'] / df_dist_merged['Target']) * 100, 0)
df_dist_merged = df_dist_merged.sort_values(by=['Region', 'District'])

# Regional Table Data
reg_3w = df_3w26.groupby('Region').agg(
    Activities=('Organization_Name', 'count'),
    Unique_Orgs=('Organization_Name', 'nunique'),
    Districts=('District', 'nunique')
).reset_index()

reg_tr = df_tr.groupby('Region').agg(
    Total_Affected=('Total_Affected', 'sum'),
    Target=('Target', 'sum'),
    Reached=('Reached', 'sum')
).reset_index()

df_reg = pd.merge(reg_3w, reg_tr, on='Region', how='outer').fillna(0)
df_reg['Reach_Ratio_Pct'] = np.where(df_reg['Target'] > 0, (df_reg['Reached'] / df_reg['Target']) * 100, 0)
df_reg = df_reg.sort_values(by='Activities', ascending=False)

# Convert to HTML table rows
reg_rows_html = ""
for _, r in df_reg.iterrows():
    reach_pct = r['Reach_Ratio_Pct']
    if reach_pct < 50:
        badge_cls = "badge-danger"
    elif reach_pct < 80:
        badge_cls = "badge-warning"
    else:
        badge_cls = "badge-success"
    
    reg_rows_html += f"""
    <tr>
        <td class="fw-bold">{r['Region']}</td>
        <td><span class="badge bg-primary">{int(r['Activities']):,}</span></td>
        <td>{int(r['Unique_Orgs']):,} orgs</td>
        <td>{int(r['Districts']):,}</td>
        <td>{int(r['Total_Affected']):,}</td>
        <td>{int(r['Target']):,}</td>
        <td>{int(r['Reached']):,}</td>
        <td><span class="badge {badge_cls}">{reach_pct:.1f}%</span></td>
    </tr>
    """

dist_rows_html = ""
for _, r in df_dist_merged.iterrows():
    reach_pct = r['Reach_Ratio_Pct']
    if reach_pct < 50:
        badge_cls = "badge-danger"
    elif reach_pct < 80:
        badge_cls = "badge-warning"
    else:
        badge_cls = "badge-success"
    
    opa_val = str(r['OPA_Priority']).replace('.0', '')
    if opa_val == '1':
        opa_badge = '<span class="badge bg-danger">OPA 1 (Extreme)</span>'
    elif opa_val == '2':
        opa_badge = '<span class="badge bg-warning text-dark">OPA 2 (Severe)</span>'
    else:
        opa_badge = '<span class="badge bg-secondary">OPA 3 (Moderate)</span>'

    dist_rows_html += f"""
    <tr>
        <td class="fw-bold text-muted">{r['Region']}</td>
        <td class="fw-bold text-primary">{r['District']}</td>
        <td>{opa_badge}</td>
        <td>{int(r['Total_Affected']):,}</td>
        <td>{int(r['Target']):,}</td>
        <td>{int(r['Reached']):,}</td>
        <td><span class="badge {badge_cls}">{reach_pct:.1f}%</span></td>
        <td><strong>{int(r['Active_Partners_3W']):,}</strong></td>
        <td>{int(r['Field_Activities_3W']):,}</td>
    </tr>
    """

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Somalia Operational Presence (3W/4W) vs FTS Funding Intelligence Report</title>
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
            --accent-orange: #ea580c;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --surface-bg: #f8fafc;
            --card-border: #e2e8f0;
        }}
        body {{
            font-family: 'Inter', sans-serif;
            background-color: var(--surface-bg);
            color: #1e293b;
            line-height: 1.6;
        }}
        .hero-banner {{
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%);
            color: white;
            padding: 3rem 0 2.5rem;
            margin-bottom: 2rem;
            border-bottom: 4px solid var(--accent-orange);
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        }}
        .kpi-card {{
            background: white;
            border-radius: 12px;
            border: 1px solid var(--card-border);
            padding: 1.4rem;
            transition: all 0.25s ease;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            height: 100%;
        }}
        .kpi-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 12px 20px -3px rgba(0,0,0,0.1);
            border-color: var(--accent-blue);
        }}
        .kpi-num {{
            font-size: 2rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 0.35rem;
        }}
        .section-header {{
            position: relative;
            padding-bottom: 0.75rem;
            margin-bottom: 1.5rem;
            font-weight: 700;
            color: var(--primary-navy);
        }}
        .section-header::after {{
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: var(--accent-orange);
            border-radius: 2px;
        }}
        .analysis-card {{
            background: white;
            border-radius: 12px;
            border: 1px solid var(--card-border);
            padding: 1.75rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }}
        .chart-img-container {{
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            padding: 1rem;
            text-align: center;
            margin-bottom: 1.25rem;
        }}
        .chart-img-container img {{
            max-width: 100%;
            height: auto;
            border-radius: 6px;
        }}
        .btn-download-chart {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1.25rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }}
        .badge-danger {{ background-color: #fee2e2; color: #b91c1c; border: 1px solid #f87171; }}
        .badge-warning {{ background-color: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }}
        .badge-success {{ background-color: #d1fae5; color: #047857; border: 1px solid #6ee7b7; }}
        .data-table {{
            font-size: 0.9rem;
        }}
        .data-table thead th {{
            background-color: #0f172a;
            color: #ffffff;
            position: sticky;
            top: 0;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.5px;
        }}
        .table-scroll {{
            max-height: 520px;
            overflow-y: auto;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }}
        .callout-box {{
            background-color: #eff6ff;
            border-left: 4px solid var(--accent-blue);
            padding: 1.25rem;
            border-radius: 0 8px 8px 0;
            margin: 1.25rem 0;
        }}
        .callout-box.alert-red {{
            background-color: #fef2f2;
            border-left-color: var(--accent-red);
        }}
        .callout-box.alert-amber {{
            background-color: #fffbeb;
            border-left-color: #f59e0b;
        }}
        .code-pill {{
            font-family: 'JetBrains Mono', monospace;
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
        }}
    </style>
</head>
<body>

    <!-- Hero Header -->
    <header class="hero-banner">
        <div class="container-fluid px-lg-5">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span class="badge bg-warning text-dark fw-bold px-3 py-1"><i class="fa-solid fa-map-location-dot me-1"></i> HDX 3W / 4W & FTS Cross-Analysis</span>
                        <span class="badge bg-light text-dark fw-bold">Somalia Humanitarian Operations 2026</span>
                    </div>
                    <h1 class="display-6 fw-bold mb-2">Operational Presence (3W/4W) & FTS Funding Intelligence Report</h1>
                    <p class="lead mb-0 text-light opacity-90">
                        Rigorous comparative analysis of UN OCHA Financial Tracking Service (FTS) funding vs. HDX Operational Presence (3W: Who does What, Where, When), Target vs. Reached populations, and Cash-Based Programming (CWG 4W) across all 18 regions and 74 districts.
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                    <a href="Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx" class="btn btn-warning btn-lg fw-bold shadow-sm me-2" download>
                        <i class="fa-solid fa-file-excel me-1"></i> Download Excel Report
                    </a>
                    <button class="btn btn-outline-light btn-lg shadow-sm" onclick="window.print()">
                        <i class="fa-solid fa-print me-1"></i> Print / PDF
                    </button>
                </div>
            </div>
        </div>
    </header>

    <div class="container-fluid px-lg-5 mb-5">

        <!-- KPI Row -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-lg-3">
                <div class="kpi-card border-top border-4 border-primary">
                    <div class="text-muted small fw-semibold text-uppercase">Total FTS Funding (2026)</div>
                    <div class="kpi-num text-primary">$349.1M</div>
                    <div class="small text-danger fw-bold"><i class="fa-solid fa-arrow-trend-down me-1"></i> -35.4% YoY vs $540.7M (2025)</div>
                    <div class="text-muted small mt-1">431 tracked grant transactions</div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="kpi-card border-top border-4 border-warning">
                    <div class="text-muted small fw-semibold text-uppercase">3W Ground Activities</div>
                    <div class="kpi-num text-warning">7,233</div>
                    <div class="small text-dark fw-bold"><i class="fa-solid fa-layer-group me-1"></i> Across 90 Districts & 18 Regions</div>
                    <div class="text-muted small mt-1">H1 2026 Operational Footprint</div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="kpi-card border-top border-4 border-danger">
                    <div class="text-muted small fw-semibold text-uppercase">Active Operating Orgs</div>
                    <div class="kpi-num text-danger">204 Orgs</div>
                    <div class="small text-danger fw-bold"><i class="fa-solid fa-arrow-down me-1"></i> -27.7% contraction (282 in 2025)</div>
                    <div class="text-muted small mt-1">78 agencies ceased field reporting</div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="kpi-card border-top border-4 border-success">
                    <div class="text-muted small fw-semibold text-uppercase">The Localization Chasm</div>
                    <div class="kpi-num text-success">40.8% vs 0.8%</div>
                    <div class="small text-danger fw-bold"><i class="fa-solid fa-triangle-exclamation me-1"></i> NNGOs do 41% work, get 0.8% $</div>
                    <div class="text-muted small mt-1">Grand Bargain Intermediation Paradox</div>
                </div>
            </div>
        </div>

        <!-- Section 1: Localization Paradox -->
        <div class="analysis-card">
            <h3 class="section-header"><i class="fa-solid fa-handshake-angle text-primary me-2"></i>1. The Localization Paradox: Funding Allocation vs. Ground Implementation Footprint</h3>
            <p>
                A fundamental debate in global humanitarian policy centers on the <strong>Grand Bargain commitment</strong> to channel at least 25% of humanitarian funding as directly as possible to local and national responders. Comparing Somalia's 2026 FTS funding database with the OCHA 3W operational presence reveals an acute disconnect between financial flows and frontline physical delivery.
            </p>

            <div class="row align-items-center">
                <div class="col-lg-7">
                    <div class="chart-img-container">
                        <img src="3w_images/3w_fig1_localization_disconnect.png" alt="Localization Disconnect Chart">
                        <div class="mt-3">
                            <a href="3w_images/3w_fig1_localization_disconnect.png" class="btn btn-outline-primary btn-sm btn-download-chart" download="3w_fig1_localization_disconnect.png">
                                <i class="fa-solid fa-download"></i> Download Chart (High-Resolution PNG)
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="table-responsive">
                        <table class="table table-bordered table-sm align-middle">
                            <thead class="table-dark">
                                <tr>
                                    <th>Actor Category</th>
                                    <th>FTS Funding ($)</th>
                                    <th>FTS Share</th>
                                    <th>3W Activities</th>
                                    <th>3W Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-danger">
                                    <td class="fw-bold">National NGOs (NNGOs)</td>
                                    <td>$2,810,088</td>
                                    <td class="fw-bold text-danger">0.80%</td>
                                    <td>2,952</td>
                                    <td class="fw-bold text-success">40.81%</td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">International NGOs (INGOs)</td>
                                    <td>$125,939,941</td>
                                    <td class="fw-bold">36.08%</td>
                                    <td>2,863</td>
                                    <td class="fw-bold">39.58%</td>
                                </tr>
                                <tr class="table-primary">
                                    <td class="fw-bold">UN Agencies & Pooled Funds</td>
                                    <td>$189,614,858</td>
                                    <td class="fw-bold text-primary">54.32%</td>
                                    <td>1,183</td>
                                    <td class="fw-bold">16.36%</td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">Government Entities</td>
                                    <td>$3,258,945</td>
                                    <td>0.93%</td>
                                    <td>222</td>
                                    <td>3.07%</td>
                                </tr>
                                <tr>
                                    <td class="fw-bold">Red Cross / Other</td>
                                    <td>$27,443,407</td>
                                    <td>7.86%</td>
                                    <td>13</td>
                                    <td>0.18%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="callout-box alert-red mt-3">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-triangle-exclamation me-1"></i> Empirical Core Finding: The Intermediation Cascade</h6>
                        <p class="small mb-0">
                            Local Somali NGOs execute <strong>40.8% of all physical field operations</strong> across 90 districts—more than any other actor category. Yet they receive only <strong>$2.81 million (0.80%)</strong> in direct funding. UN agencies receive <strong>54.3% of all financial resources</strong> while executing just 16.4% of direct ground operations. This demonstrates that frontline implementation is largely sub-contracted downstream through multi-tiered overhead structures.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Sectoral Comparison -->
        <div class="analysis-card">
            <h3 class="section-header"><i class="fa-solid fa-chart-pie text-primary me-2"></i>2. Sectoral Divergence: Financial Weight vs. Physical Partner Footprint</h3>
            <p>
                Comparing the dollar value allocated in FTS with the number of operating humanitarian partners in 3W highlights major variations in capital intensity and operational distribution across humanitarian clusters.
            </p>

            <div class="row align-items-center">
                <div class="col-lg-7">
                    <div class="chart-img-container">
                        <img src="3w_images/3w_fig2_sector_funding_vs_operational_activities.png" alt="Sectoral Funding vs Operational Activities">
                        <div class="mt-3">
                            <a href="3w_images/3w_fig2_sector_funding_vs_operational_activities.png" class="btn btn-outline-primary btn-sm btn-download-chart" download="3w_fig2_sector_funding_vs_operational_activities.png">
                                <i class="fa-solid fa-download"></i> Download Chart (High-Resolution PNG)
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="callout-box mb-3">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-stethoscope text-primary me-1"></i> Health vs. Food Security Structural Contrast</h6>
                        <p class="small mb-0">
                            <strong>Health</strong> possesses the largest field operational presence in Somalia with <strong>1,462 activities across 55 distinct organizations</strong>, yet receives only <strong>$27.9M ($19,110 per field activity)</strong>. In contrast, <strong>Food Security</strong> commands <strong>$73.8M</strong> with 1,212 field activities ($60,920 per activity)—reflecting the high cost of food procurement and large-scale bulk commodity distribution compared to clinical outpatient staffing.
                        </p>
                    </div>
                    <div class="callout-box alert-amber">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-shield-heart text-warning me-1"></i> Protection & GBV: The Frontline Burden</h6>
                        <p class="small mb-0">
                            Protection clusters (Child Protection: 909 activities, GBV: 684 activities, General Protection: 581 activities) represent <strong>2,174 combined operations</strong> across 84 unique partners. Despite representing nearly 30% of all field activities, protection sectors capture less than $30M in FTS funding ($13,799 per activity), demonstrating intense reliance on low-cost community-based local volunteers.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 3: Regional Presence & Target vs Reach -->
        <div class="analysis-card">
            <h3 class="section-header"><i class="fa-solid fa-earth-africa text-primary me-2"></i>3. Regional Operational Density vs. Target Reach: Congestion vs. Humanitarian Deserts</h3>
            <p>
                By linking the 3W operational partner footprint with the official UN OCHA <strong>People Targeted vs. Reached Monitoring Matrix</strong> across all 18 administrative regions, we expose severe geographic delivery imbalances.
            </p>

            <div class="row align-items-center mb-4">
                <div class="col-lg-7">
                    <div class="chart-img-container">
                        <img src="3w_images/3w_fig3_regional_operational_density_vs_reach.png" alt="Regional Operational Density vs Reach Ratio">
                        <div class="mt-3">
                            <a href="3w_images/3w_fig3_regional_operational_density_vs_reach.png" class="btn btn-outline-primary btn-sm btn-download-chart" download="3w_fig3_regional_operational_density_vs_reach.png">
                                <i class="fa-solid fa-download"></i> Download Chart (High-Resolution PNG)
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="card border-0 bg-light p-3 rounded-3 mb-3">
                        <h6 class="fw-bold text-dark"><i class="fa-solid fa-circle-dot text-danger me-1"></i> Middle Juba: Complete Access Blackout</h6>
                        <p class="small text-muted mb-0">
                            Middle Juba suffers from near-total operational neglect. Only <strong>35 activities by 7 organizations</strong> operate in the region. Out of ~180,000 targeted people in acute need, only <strong>11.8% were reached</strong> due to active conflict and territorial access denial.
                        </p>
                    </div>
                    <div class="card border-0 bg-light p-3 rounded-3 mb-3">
                        <h6 class="fw-bold text-dark"><i class="fa-solid fa-circle-dot text-warning me-1"></i> Banadir: The Urban Congestion Paradox</h6>
                        <p class="small text-muted mb-0">
                            Banadir (Mogadishu) hosts <strong>889 activities across 68 organizations</strong>. Yet, it achieved a <strong>reach ratio of only 47.8% (617,072 reached of 1.29M targeted)</strong>. High agency density does not translate into proportional delivery due to severe IDP camp fragmentation, gatekeeper exploitation, and rapid secondary evictions.
                        </p>
                    </div>
                    <div class="card border-0 bg-light p-3 rounded-3">
                        <h6 class="fw-bold text-dark"><i class="fa-solid fa-circle-dot text-success me-1"></i> Bay (Baidoa): Epicentre of Aid Absorption</h6>
                        <p class="small text-muted mb-0">
                            Bay dominates the country with <strong>1,094 activities and 84 unique operating organizations</strong>, achieving a <strong>97.0% reach ratio</strong> (899,979 reached of 927,370 targeted). Baidoa remains the operational nexus of the international humanitarian response.
                        </p>
                    </div>
                </div>
            </div>

            <h5 class="fw-bold mb-3"><i class="fa-solid fa-table-list text-primary me-2"></i>All 18 Administrative Regions: Operational Footprint & Target Coverage Table</h5>
            <div class="table-scroll">
                <table class="table table-hover table-striped align-middle data-table mb-0">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>3W Activities</th>
                            <th>Active Orgs</th>
                            <th>Districts</th>
                            <th>Affected Pop.</th>
                            <th>Target Pop.</th>
                            <th>Reached Pop.</th>
                            <th>Coverage (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reg_rows_html}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 4: Cash-Based Programming (CWG 4W) -->
        <div class="analysis-card">
            <h3 class="section-header"><i class="fa-solid fa-money-bill-transfer text-primary me-2"></i>4. Cash-Based Programming (CBP): CWG 4W & FTS Transfer Modalities</h3>
            <p>
                Somalia's sophisticated mobile money ecosystem (Hormuud EVC Plus, Telesom ZAAD, Golis Sahal) has made Cash and Voucher Assistance (CVA) the most cost-effective frontline modality. We contrast the <strong>Cash Working Group (CWG) 4W monthly tracker</strong> against FTS modality tracking.
            </p>

            <div class="row align-items-center">
                <div class="col-lg-7">
                    <div class="chart-img-container">
                        <img src="3w_images/3w_fig4_cash_programming_breakdown.png" alt="Cash Programming Breakdown">
                        <div class="mt-3">
                            <a href="3w_images/3w_fig4_cash_programming_breakdown.png" class="btn btn-outline-primary btn-sm btn-download-chart" download="3w_fig4_cash_programming_breakdown.png">
                                <i class="fa-solid fa-download"></i> Download Chart (High-Resolution PNG)
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="callout-box">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-basket-shopping text-primary me-1"></i> Food Security Dominates Cash Delivery</h6>
                        <p class="small mb-0">
                            The CWG 4W tracker confirms that <strong>Food Security CVA</strong> represents >90% of all cash disbursements, reaching an average of <strong>797,698 individuals per month</strong>. Multi-Purpose Cash Assistance (MPCA) reaches an additional <strong>62,450 individuals monthly</strong> across 74 districts.
                        </p>
                    </div>
                    <div class="callout-box alert-amber">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-vault text-warning me-1"></i> FTS Modality Tracking: 26.8% Cash Share</h6>
                        <p class="small mb-0">
                            In FTS 2026, cash and voucher modalities total <strong>$93.7 million (26.8% of total tracked funding)</strong>, including $48.5M in Food Security cash transfers and $33.0M in explicit Multipurpose Cash (MPCA). This provides direct purchasing power in local markets amidst high food price inflation.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 5: Operational Contraction 2025 vs 2026 -->
        <div class="analysis-card">
            <h3 class="section-header"><i class="fa-solid fa-arrow-trend-down text-danger me-2"></i>5. The Operational Contraction: 2025 vs. 2026 Field Footprint Shrinkage</h3>
            <p>
                The global funding decline has had immediate operational consequences on the humanitarian footprint across Somalia.
            </p>

            <div class="row align-items-center">
                <div class="col-lg-7">
                    <div class="chart-img-container">
                        <img src="3w_images/3w_fig5_operational_contraction_2025_vs_2026.png" alt="2025 vs 2026 Operational Contraction">
                        <div class="mt-3">
                            <a href="3w_images/3w_fig5_operational_contraction_2025_vs_2026.png" class="btn btn-outline-primary btn-sm btn-download-chart" download="3w_fig5_operational_contraction_2025_vs_2026.png">
                                <i class="fa-solid fa-download"></i> Download Chart (High-Resolution PNG)
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <ul class="list-group list-group-flush border rounded-3 p-2">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">FTS Funding Pipeline</span>
                                <div class="small text-muted">$540.7M (2025) → $349.1M (2026)</div>
                            </div>
                            <span class="badge bg-danger fs-6">-35.4%</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">Active Humanitarian Orgs</span>
                                <div class="small text-muted">282 orgs (2025) → 204 orgs (2026)</div>
                            </div>
                            <span class="badge bg-danger fs-6">-27.7%</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">National NGOs Active</span>
                                <div class="small text-muted">164 NNGOs (2025) → 118 NNGOs (2026)</div>
                            </div>
                            <span class="badge bg-danger fs-6">-28.0%</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">International NGOs Active</span>
                                <div class="small text-muted">92 INGOs (2025) → 68 INGOs (2026)</div>
                            </div>
                            <span class="badge bg-danger fs-6">-26.1%</span>
                        </li>
                    </ul>

                    <div class="callout-box alert-red mt-3">
                        <h6 class="fw-bold mb-1"><i class="fa-solid fa-person-walking-arrow-right me-1"></i> Exit of 78 Humanitarian Partners</h6>
                        <p class="small mb-0">
                            The withdrawal of 78 organizations has disproportionately affected remote frontline communities. As budgets contracted, international agencies retreated to central fortified hubs (Mogadishu, Baidoa, Kismayo), leaving peripheral districts with zero or minimal operational presence.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 6: Full District-Level Matrix -->
        <div class="analysis-card">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                <h3 class="section-header mb-2 mb-md-0"><i class="fa-solid fa-list-check text-primary me-2"></i>6. Full District-Level Matrix: 74 Districts (Target, Reach & 3W Footprint)</h3>
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text bg-white"><i class="fa-solid fa-search text-muted"></i></span>
                        <input type="text" id="districtSearch" class="form-control" placeholder="Search region or district (e.g. Baidoa, Kismayo, Afgooye)...">
                    </div>
                </div>
            </div>
            <p class="text-muted small">
                Interactive real-time database merging the 74 monitored districts with OCHA Operational Priority Areas (OPA 1, 2, 3), Affected populations, Target vs Reached figures, and active 3W partner counts.
            </p>

            <div class="table-scroll">
                <table class="table table-hover table-striped align-middle data-table mb-0" id="districtTable">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>District</th>
                            <th>OPA Priority</th>
                            <th>Affected Pop.</th>
                            <th>Target Pop.</th>
                            <th>Reached Pop.</th>
                            <th>Reach Ratio (%)</th>
                            <th>Active Partners (3W)</th>
                            <th>3W Field Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dist_rows_html}
                    </tbody>
                </table>
            </div>
            <div class="mt-2 text-muted small text-end" id="recordCount">Showing 74 districts</div>
        </div>

    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 border-top border-secondary">
        <div class="container-fluid px-lg-5 text-center text-md-start">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <p class="mb-1 fw-bold">Somalia Humanitarian Data Integration Initiative (OCHA HDX & FTS)</p>
                    <p class="mb-0 text-muted small">
                        Synthesizing FTS Financial Flows, HDX Operational Presence 3W/4W, Target vs Reached Monitoring Matrices, and Cash Working Group (CWG) datasets.
                    </p>
                </div>
                <div class="col-md-4 text-md-end mt-3 mt-md-0">
                    <a href="Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx" class="btn btn-warning btn-sm fw-bold">
                        <i class="fa-solid fa-file-excel me-1"></i> Download Clean Excel
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Search Script -->
    <script>
        document.getElementById('districtSearch').addEventListener('keyup', function() {{
            let filter = this.value.toLowerCase();
            let rows = document.querySelectorAll('#districtTable tbody tr');
            let visibleCount = 0;
            rows.forEach(row => {{
                let text = row.innerText.toLowerCase();
                if (text.includes(filter)) {{
                    row.style.display = '';
                    visibleCount++;
                }} else {{
                    row.style.display = 'none';
                }}
            }});
            document.getElementById('recordCount').innerText = 'Showing ' + visibleCount + ' districts';
        }});
    </script>
</body>
</html>
"""

# Save to local workspace
with open('somalia_3w_operational_presence_fts_comparison.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Save to artifact dir
artifact_html = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_3w_operational_presence_fts_comparison.html'
with open(artifact_html, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully generated and saved somalia_3w_operational_presence_fts_comparison.html to workspace and artifact directory!")
