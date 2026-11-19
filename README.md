# Somalia Humanitarian Data & Localization Intelligence Platform (2026)

[![Data Sources: UN OCHA FTS & HDX](https://img.shields.io/badge/Data-UN%20OCHA%20FTS%20%26%20HDX-blue.svg)](https://fts.unocha.org/countries/206)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Coverage: 18 Regions & 90 Districts](https://img.shields.io/badge/Coverage-18%20Regions%20%7C%2090%20Districts-orange.svg)]()
[![Automated Sync: HDX CKAN & FTS API](https://img.shields.io/badge/Pipeline-Automated%20Sync%20Live-brightgreen.svg)]()

An independent open-source humanitarian intelligence system cross-analyzing **UN OCHA Financial Tracking Service (FTS)** funding flows against **HDX 3W Operational Presence**, **CBPF / Somalia Humanitarian Fund (SHF)** project allocations, and **Target vs. Reached monitoring matrices** across all 18 administrative regions and 90 districts of Somalia.

---

## 🌟 Live Interactive Dashboards & Tools

* 🗺️ **[Interactive Geospatial 3W/4W Map](somalia_3w_4w_interactive_ngo_map.html)**: Free, unrestricted GIS map mapping 204 humanitarian organizations across 90 districts with instant live search by NGO name, cluster filtering, and district operational rosters.
* 📄 **[Executive Policy Briefing: The Localization Paradox](Somalia_Localization_Policy_Brief_2026.html)**: Formal research publication analyzing why Somali National NGOs deliver 40.8% of frontline operations while receiving only 0.80% in direct international funding.
* 💰 **[Where Aid Money Goes: INGO vs. Local NGO Flows](somalia_ngo_funding_flows_where_money_goes.html)**: Detailed architecture showing where $119.9M in INGO funds are spent and how the Somalia Humanitarian Fund (SHF) directs 84.6% ($19.5M) to local NGOs.
* 📊 **[3W vs. FTS Comparative Analysis](somalia_3w_operational_presence_fts_comparison.html)**: Cross-cluster comparison of financial allocations versus physical footprint, highlighting congestion in Baidoa and delivery deficits in Banadir and Middle Juba.
* ⚙️ **[Automated Pipeline Monitor](pipeline_status.html)**: Real-time dashboard showing the status of automated monitoring across HDX CKAN and FTS REST APIs.
* 📥 **[Comparative Excel Dataset](Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx)**: Multi-tab clean Excel workbook with formulas, localization ratios, and 74-district matrices.

---

## 🔍 Key Empirical Findings

1. **The Localization Paradox (Grand Bargain Chasm)**:
   * **Somali National NGOs (NNGOs)** execute **40.81% of all physical field operations (2,952 activities)** across 90 districts—more than any other actor category.
   * Yet in FTS, direct funding to National NGOs is just **$2.81 million (0.80%)**, 98% of which comes from Saudi Arabia (KSrelief). Western institutional donors channel virtually $0 directly to local NGOs.
2. **The Pooled Fund Breakthrough**:
   * The **Somalia Humanitarian Fund (SHF / CBPF)** proves that local Somali NGOs possess high absorptive and fiduciary capacity, allocating **84.6% ($19.5M across 40 projects)** of its 2026 portfolio directly to National NGOs.
3. **Sectoral Divergence (Money vs. Movement)**:
   * **Health** has the single highest physical field footprint (**1,462 activities across 55 organizations**), but receives only $27.9M ($19.1k per activity).
   * **Food Security** commands **$73.8M** across 1,212 field activities ($60.9k per activity).
4. **Spatial Inequity**:
   * **Bay (Baidoa)** absorbs **84 organizations, 1,094 activities, and 97.0% reach**.
   * **Banadir (Mogadishu)** hosts **68 organizations and 889 activities**, yet reached only **47.8% of targeted IDPs** due to camp fragmentation and gatekeepers.
   * **Middle Juba** suffers an access blackout with only **7 organizations and 11.8% reach**.

---

## 🚀 Automated Update Pipeline

The repository includes a Python-based automated synchronization engine (`automated_pipeline.py`) that monitors remote UN OCHA APIs:

```bash
# Check mode: queries HDX CKAN and FTS APIs without modifying files
python automated_pipeline.py --check

# Sync mode: downloads new releases, archives backups, and rebuilds maps
python automated_pipeline.py --sync
```

To schedule automatic daily updates on Windows, run:
```powershell
powershell -ExecutionPolicy Bypass -File setup_windows_scheduler.ps1
```

---

## 📂 Repository Structure

```
├── index.html                                                    # Central landing portal
├── somalia_3w_4w_interactive_ngo_map.html                       # Free GIS interactive map
├── Somalia_Localization_Policy_Brief_2026.html                   # Executive policy paper
├── somalia_ngo_funding_flows_where_money_goes.html              # Funding flow architecture
├── somalia_3w_operational_presence_fts_comparison.html          # 3W vs FTS comparison dashboard
├── pipeline_status.html                                         # Live automated pipeline monitor
├── automated_pipeline.py                                         # Automated sync pipeline script
├── run_pipeline.bat                                             # One-click Windows runner
├── setup_windows_scheduler.ps1                                  # Windows task scheduler script
├── map_data_summary.json                                        # Processed GeoJSON payload (90 districts, 204 NGOs)
├── flow_images/                                                 # Presentation figures (PNG)
│   └── funding_flow_mechanics.png
├── 3w_images/                                                   # High-DPI comparison charts
│   ├── 3w_fig1_localization_disconnect.png
│   ├── 3w_fig2_sector_funding_vs_operational_activities.png
│   ├── 3w_fig3_regional_operational_density_vs_reach.png
│   ├── 3w_fig4_cash_programming_breakdown.png
│   └── 3w_fig5_operational_contraction_2025_vs_2026.png
└── hdx_data/                                                    # Official raw downloaded datasets
    ├── somalia_3w_operational_presence_2026.xlsx
    ├── som_cbpf_project_summary.csv
    ├── somalia_targeted_reached_by_location_cluster.csv
    ├── somalia_admin_boundaries_som_admin_boundaries.xlsx
    └── somalia_adm1_real.geojson
```

---

## 📖 Citation

```bibtex
@article{SomaliaLocalization2026,
  title={The Localization Paradox in Somalia: An Empirical Cross-Analysis of Financing Flows, 3W Operational Footprints, and District-Level Reach},
  author={Open Humanitarian Intelligence Initiative},
  year={2026},
  publisher={Mogadishu & Nairobi}
}
```
