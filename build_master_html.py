import os

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Somalia Integrated Humanitarian Master Intelligence Dashboard</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    :root {
      --bg: #0b1120;
      --card-bg: #1e293b;
      --card-border: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-blue: #38bdf8;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-rose: #f43f5e;
      --accent-purple: #a855f7;
    }
    * { box-sizing: border-box; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .chart-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      padding: 0.45rem 0.9rem;
      border-radius: 0.5rem;
      font-size: 0.825rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      user-select: none;
    }
    .btn-download:hover {
      background: rgba(56, 189, 248, 0.25);
      border-color: #38bdf8;
      transform: translateY(-1px);
    }
    .btn-primary {
      background: #0284c7;
      color: white;
      border: none;
      padding: 0.55rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary:hover { background: #0369a1; }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .fig-img {
      width: 100%;
      height: auto;
      border-radius: 0.5rem;
      border: 1px solid #334155;
      background: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    th, td {
      padding: 0.65rem 0.85rem;
      text-align: left;
      border-bottom: 1px solid var(--card-border);
    }
    th {
      background: #111827;
      color: #cbd5e1;
      font-weight: 600;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.03); }
    .nav-pill {
      color: var(--text-muted);
      padding: 0.4rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.825rem;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-pill:hover {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
    }
  </style>
</head>
<body class="p-4 md:p-8">
  <div class="max-w-7xl mx-auto space-y-8">

    <!-- MASTER HEADER -->
    <header class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Master Cross-Dataset Fusion</span>
          <span class="badge bg-sky-500/20 text-sky-400 border border-sky-500/40">8 Combined Data Sources</span>
          <span class="badge bg-purple-500/20 text-purple-400 border border-purple-500/40">Integrated Intelligence</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Somalia Integrated Humanitarian Master Intelligence Dashboard</h1>
        <p class="text-slate-400 text-sm mt-1">
          Synthesizing UN OCHA FTS Funding &bull; HDX 2026 District Population &bull; WFP Market Food Prices &bull; IOM DTM IDP Displacement &bull; SHF Pooled Funds &bull; UN CERF.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="Somalia_Integrated_Humanitarian_Master_Report.xlsx" download class="btn-primary shadow-lg shadow-sky-900/30">
          <span>📊</span> Download Master Excel (.xlsx)
        </a>
        <button onclick="downloadAllCharts()" class="btn-download">
          <span>📸</span> Download All 6 Master Figures
        </button>
        <div class="flex items-center gap-2">
          <a href="somalia_2025_vs_2026_comparison.html" class="btn-download bg-slate-800 border-slate-700 text-slate-300">
            <span>⚖️</span> 2025 vs 2026
          </a>
          <a href="somalia_aid_data_analysis.html" class="btn-download bg-slate-800 border-slate-700 text-slate-300">
            <span>📈</span> 2026 Detailed
          </a>
        </div>
      </div>
    </header>

    <!-- NAVIGATION PILLS -->
    <nav class="flex flex-wrap gap-2 py-1 px-3 bg-slate-900/60 border border-slate-800 rounded-xl">
      <a href="#sec-kpis" class="nav-pill">Master KPIs</a>
      <a href="#sec-figures" class="nav-pill">Integrated Publication Figures (6)</a>
      <a href="#sec-double-jeopardy" class="nav-pill">The Double Jeopardy Crisis</a>
      <a href="#sec-demographics" class="nav-pill">Population & Aid Per Capita</a>
      <a href="#sec-idps" class="nav-pill">IOM IDP Hotspots</a>
      <a href="#sec-pooled" class="nav-pill">Pooled Fund Expansion</a>
      <a href="#sec-code" class="nav-pill">Master Python Code</a>
    </nav>

    <!-- MASTER INTEGRATED KPIS -->
    <section id="sec-kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Population & Aid Per Capita -->
      <div class="chart-card border-l-4 border-l-sky-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">2026 Aid Per Capita</span>
        <div class="text-2xl font-extrabold text-white mt-1">$17.95 / person</div>
        <p class="text-xs text-rose-400 font-bold mt-2">
          ▼ -$9.86 cut (down from $27.81 in 2025)
        </p>
        <span class="text-xs text-slate-400 mt-1">Population: 19.44 Million (HPC 2026)</span>
      </div>

      <!-- Food Inflation Surge -->
      <div class="chart-card border-l-4 border-l-rose-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Food Commodity Inflation</span>
        <div class="text-2xl font-extrabold text-rose-400 mt-1">+22% to +28%</div>
        <p class="text-xs text-rose-300 mt-2">
          Rice: $62.7 | Maize: $57.3 | Sorghum: $53.2
        </p>
        <span class="text-xs text-slate-400 mt-1">Multi-year staple price records (WFP)</span>
      </div>

      <!-- Total IDPs -->
      <div class="chart-card border-l-4 border-l-purple-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Internally Displaced</span>
        <div class="text-2xl font-extrabold text-purple-300 mt-1">4.68 Million IDPs</div>
        <p class="text-xs text-purple-400 mt-2">
          Banadir hosts 1.51M (32.3% of all IDPs)
        </p>
        <span class="text-xs text-slate-400 mt-1">IOM Displacement Tracking Matrix</span>
      </div>

      <!-- Pooled Funds Structural Pivot -->
      <div class="chart-card border-l-4 border-l-emerald-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pooled Fund Reliance</span>
        <div class="text-2xl font-extrabold text-emerald-300 mt-1">$77.9M Combined</div>
        <p class="text-xs text-emerald-400 mt-2">
          SHF ($44.9M) + UN CERF ($33.0M)
        </p>
        <span class="text-xs text-slate-400 mt-1">Structural shift to pooled mechanisms</span>
      </div>
    </section>

    <!-- SECTION 1: MASTER PUBLICATION FIGURES GALLERY -->
    <section id="sec-figures" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-400"></span> 1. Integrated Publication Figures (300 DPI)
          </h2>
          <p class="text-sm text-slate-400">Rendered by integrating multiple live UN datasets. Click to download high-resolution PNGs.</p>
        </div>
      </div>

      <!-- FIGURE 2: THE DOUBLE JEOPARDY CRISIS -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-1">Crucial Humanitarian Finding</span>
            <h3 class="text-base font-semibold text-white">Figure 1: The "Double Jeopardy" Crisis — Food Price Inflation vs Food Security Aid Cut</h3>
            <p class="text-xs text-slate-400">Staple food prices spiked by +22% to +28% in 2026 across Somali markets at the exact moment food security aid fell by -27.3% (-$27.7M)</p>
          </div>
          <a href="master_images/fig2_double_jeopardy_food_inflation_vs_aid.png" download="fig1_double_jeopardy_food_inflation_vs_aid.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="master_images/fig2_double_jeopardy_food_inflation_vs_aid.png" alt="Double Jeopardy: Food Inflation vs Aid Cut" class="fig-img">
      </div>

      <!-- FIGURE 1: POPULATION & AID PER CAPITA -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 2: 2026 Population Demographics by Region & Aid Per Capita Collapse</h3>
            <p class="text-xs text-slate-400">District population distribution (19.44M total) and national aid per capita reduction from $27.81 down to $17.95 per person</p>
          </div>
          <a href="master_images/fig1_aid_per_capita_and_population.png" download="fig2_aid_per_capita_and_population.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="master_images/fig1_aid_per_capita_and_population.png" alt="Aid Per Capita and Population" class="fig-img">
      </div>

      <!-- FIGURE 3: IOM DTM IDP DISPLACEMENT -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 3: IOM Displacement Tracking Matrix (DTM) Hotspots</h3>
            <p class="text-xs text-slate-400">4.68 Million internally displaced persons: Banadir accounts for 1.51M (32.3%), followed by Bay (384K), Hiraan (326K), and Middle Shabelle (301K)</p>
          </div>
          <a href="master_images/fig3_displacement_hotspots_dtm.png" download="fig3_displacement_hotspots_dtm.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="master_images/fig3_displacement_hotspots_dtm.png" alt="IOM Displacement Hotspots" class="fig-img">
      </div>

      <!-- FIGURES 4 & 5 (2 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Figure 4: Pooled Funds Expansion -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 4: Historical Pooled Fund Growth</h3>
              <p class="text-xs text-slate-400">SHF and CERF trajectory from 2021 to 2026</p>
            </div>
            <a href="master_images/fig4_pooled_funds_historical_trajectory.png" download="fig4_pooled_funds_historical_trajectory.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="master_images/fig4_pooled_funds_historical_trajectory.png" alt="Pooled Funds Trajectory" class="fig-img">
        </div>

        <!-- Figure 5: Localization Shift -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 5: Localization Shift</h3>
              <p class="text-xs text-slate-400">Direct Local NGO collapse vs SHF pooled fund expansion</p>
            </div>
            <a href="master_images/fig5_localization_and_grand_bargain.png" download="fig5_localization_and_grand_bargain.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="master_images/fig5_localization_and_grand_bargain.png" alt="Localization Shift" class="fig-img">
        </div>
      </div>

      <!-- FIGURE 6: MACRO VULNERABILITY MATRIX -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 6: Macro Humanitarian Risk Indicators (2026 Shock Index)</h3>
            <p class="text-xs text-slate-400">Combined impact of aid budget reduction, food price inflation, localization collapse, and currency exposure</p>
          </div>
          <a href="master_images/fig6_macro_vulnerability_matrix.png" download="fig6_macro_vulnerability_matrix.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="master_images/fig6_macro_vulnerability_matrix.png" alt="Macro Vulnerability Matrix" class="fig-img">
      </div>
    </section>

    <!-- SECTION 2: THE DOUBLE JEOPARDY ANALYSIS -->
    <section id="sec-double-jeopardy" class="chart-card border-rose-500/30">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-400"></span> 2. The "Double Jeopardy" Crisis: Food Security Aid Cuts vs. Price Inflation
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        Cross-analyzing FTS funding records with the WFP Somalia market food price database reveals an acute humanitarian squeeze:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span class="text-xs font-semibold text-amber-400 uppercase">White Maize Inflation</span>
          <div class="text-2xl font-bold text-white mt-1">$57.26 / bag</div>
          <p class="text-xs text-rose-400 font-bold mt-1">▲ +21.9% increase from 2025</p>
          <span class="text-xs text-slate-500">2025 average was $46.98</span>
        </div>

        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span class="text-xs font-semibold text-rose-400 uppercase">Imported Rice Inflation</span>
          <div class="text-2xl font-bold text-white mt-1">$62.73 / bag</div>
          <p class="text-xs text-rose-400 font-bold mt-1">▲ +28.5% increase from 2025</p>
          <span class="text-xs text-slate-500">2025 average was $48.81</span>
        </div>

        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span class="text-xs font-semibold text-purple-400 uppercase">Red Sorghum Inflation</span>
          <div class="text-2xl font-bold text-white mt-1">$53.21 / bag</div>
          <p class="text-xs text-rose-400 font-bold mt-1">▲ +22.5% increase from 2025</p>
          <span class="text-xs text-slate-500">2025 average was $43.45</span>
        </div>
      </div>
      <div class="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200">
        <b>Operational Consequence:</b> Because food security funding dropped by <b>-\$27.7 Million (-27.3%)</b> at the exact time commodity costs rose by over <b>25%</b>, the purchasing power of humanitarian food baskets in Somalia contracted by an effective <b>~42%</b> in 2026.
      </div>
    </section>

    <!-- SECTION 3: POPULATION & AID PER CAPITA TABLE -->
    <section id="sec-demographics" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-sky-400"></span> 3. 2026 Subnational Population Estimates & Demographics (HPC 2026)
      </h2>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Region</th>
              <th>Total Population (2026)</th>
              <th>Share of National Pop (%)</th>
              <th>Administrative Districts</th>
              <th>Vulnerability Profile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-sky-400">1</td>
              <td class="font-medium text-white">Banadir (Mogadishu)</td>
              <td class="font-mono text-sky-300 font-bold">3,607,761</td>
              <td class="font-bold text-white">18.56%</td>
              <td>17 Districts</td>
              <td><span class="badge bg-purple-500/20 text-purple-300">#1 IDP Destination (1.51M IDPs)</span></td>
            </tr>
            <tr>
              <td class="font-bold text-sky-400">2</td>
              <td class="font-medium text-white">Bay</td>
              <td class="font-mono text-white">1,533,707</td>
              <td class="font-bold text-white">7.89%</td>
              <td>4 Districts</td>
              <td><span class="badge bg-rose-500/20 text-rose-300">High Drought & Malnutrition</span></td>
            </tr>
            <tr>
              <td class="font-bold text-sky-400">3</td>
              <td class="font-medium text-white">Lower Shabelle</td>
              <td class="font-mono text-white">1,489,019</td>
              <td class="font-bold text-white">7.66%</td>
              <td>8 Districts</td>
              <td><span class="badge bg-amber-500/20 text-amber-300">Agricultural Breadbasket</span></td>
            </tr>
            <tr>
              <td class="font-bold text-sky-400">4</td>
              <td class="font-medium text-white">Woqooyi Galbeed</td>
              <td class="font-mono text-white">1,472,999</td>
              <td class="font-bold text-white">7.58%</td>
              <td>3 Districts</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Urban Commercial Center</span></td>
            </tr>
            <tr>
              <td class="font-bold text-sky-400">5</td>
              <td class="font-medium text-white">Lower Juba</td>
              <td class="font-mono text-white">1,234,449</td>
              <td class="font-bold text-white">6.35%</td>
              <td>4 Districts</td>
              <td><span class="badge bg-rose-500/20 text-rose-300">Flood & Border Risk</span></td>
            </tr>
            <tr>
              <td class="font-bold text-sky-400">6</td>
              <td class="font-medium text-white">Galgaduud</td>
              <td class="font-mono text-white">1,130,907</td>
              <td class="font-bold text-white">5.82%</td>
              <td>5 Districts</td>
              <td><span class="badge bg-amber-500/20 text-amber-300">Conflict & Pastoralist Hardship</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 4: IOM DTM DISPLACEMENT HOTSPOTS TABLE -->
    <section id="sec-idps" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-purple-400"></span> 4. IOM Displacement Tracking Matrix (DTM) Regional Distribution
      </h2>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Recorded IDP Individuals</th>
              <th>Share of Total Displaced (%)</th>
              <th>Primary Displacement Driver</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-white">Banadir</td>
              <td class="font-mono text-purple-300 font-bold">1,510,367</td>
              <td class="font-bold text-purple-300">32.27%</td>
              <td class="text-slate-300">Protracted conflict, drought influx from south-central zones</td>
            </tr>
            <tr>
              <td class="font-bold text-white">Bay</td>
              <td class="font-mono text-white font-bold">384,209</td>
              <td class="font-bold text-white">8.21%</td>
              <td class="text-slate-300">Severe recurrent drought, crop failure in Baidoa corridor</td>
            </tr>
            <tr>
              <td class="font-bold text-white">Hiraan</td>
              <td class="font-mono text-white font-bold">326,030</td>
              <td class="font-bold text-white">6.97%</td>
              <td class="text-slate-300">Shabelle river flooding and localized security operations</td>
            </tr>
            <tr>
              <td class="font-bold text-white">Middle Shabelle</td>
              <td class="font-mono text-white font-bold">301,470</td>
              <td class="font-bold text-white">6.44%</td>
              <td class="text-slate-300">Riverine flood displacement and agricultural disruption</td>
            </tr>
            <tr>
              <td class="font-bold text-white">Mudug</td>
              <td class="font-mono text-white font-bold">289,766</td>
              <td class="font-bold text-white">6.19%</td>
              <td class="text-slate-300">Water scarcity, pastoralist livestock losses in Galkayo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 5: HISTORICAL POOLED FUNDS TABLE -->
    <section id="sec-pooled" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span> 5. Historical Pooled Fund Trajectory: SHF & CERF (2021–2026)
      </h2>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Fiscal Year</th>
              <th>Somalia Humanitarian Fund (SHF Paid)</th>
              <th>UN CERF Allocations Approved</th>
              <th>Combined Pooled Funding ($)</th>
              <th>Strategic Role in Somalia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-white">2021</td>
              <td class="font-mono text-slate-300">$59,850,211</td>
              <td class="font-mono text-slate-300">$35,001,302</td>
              <td class="font-mono text-white font-bold">$94,851,513</td>
              <td class="text-slate-300">Drought response scale-up</td>
            </tr>
            <tr>
              <td class="font-bold text-white">2022</td>
              <td class="font-mono text-slate-300">$68,912,450</td>
              <td class="font-mono text-slate-300">$48,003,069</td>
              <td class="font-mono text-white font-bold">$116,915,519</td>
              <td class="text-slate-300">Famine prevention peak response</td>
            </tr>
            <tr>
              <td class="font-bold text-white">2023</td>
              <td class="font-mono text-slate-300">$57,219,800</td>
              <td class="font-mono text-slate-300">$28,000,009</td>
              <td class="font-mono text-white font-bold">$85,219,809</td>
              <td class="text-slate-300">El Niño flood emergency response</td>
            </tr>
            <tr>
              <td class="font-bold text-white">2024</td>
              <td class="font-mono text-slate-300">$51,546,025</td>
              <td class="font-mono text-slate-300">$9,999,444</td>
              <td class="font-mono text-white font-bold">$61,545,469</td>
              <td class="text-slate-300">Transitional recovery funding</td>
            </tr>
            <tr>
              <td class="font-bold text-white">2025</td>
              <td class="font-mono text-slate-300">$30,048,538</td>
              <td class="font-mono text-slate-300">$24,850,015</td>
              <td class="font-mono text-white font-bold">$54,898,553</td>
              <td class="text-slate-300">Global aid contraction threshold</td>
            </tr>
            <tr class="bg-emerald-950/20 border-l-4 border-l-emerald-500">
              <td class="font-bold text-emerald-300">2026</td>
              <td class="font-mono text-emerald-400 font-bold">$42,278,644</td>
              <td class="font-mono text-emerald-400 font-bold">$33,000,014</td>
              <td class="font-mono text-emerald-400 font-bold">$75,278,658</td>
              <td class="text-emerald-300 font-bold">Surge in pooled reliance (+37.1%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 6: MASTER PYTHON SCRIPT -->
    <section id="sec-code" class="chart-card">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-400"></span> 6. Master Cross-Dataset Python Integration Script
          </h2>
          <p class="text-sm text-slate-400">Script that ingests all 8 HDX and FTS datasets, calculates per-capita metrics, food inflation, and IDP ratios.</p>
        </div>
        <a href="master_integrated_analysis.py" download class="btn-download">
          <span>📄</span> Download Script (.py)
        </a>
      </div>
      <p class="text-xs text-slate-400">
        Run directly in your command line:
        <code class="bg-slate-950 px-2 py-1 rounded text-sky-300 font-mono text-xs ml-1">python master_integrated_analysis.py</code>
      </p>
    </section>

    <!-- FOOTER -->
    <footer class="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
      Antigravity Master Integrated Humanitarian Intelligence &bull; Somalia Multi-Dataset Fusion
    </footer>

  </div>

  <script>
    function downloadAllCharts() {
      const images = [
        'master_images/fig2_double_jeopardy_food_inflation_vs_aid.png',
        'master_images/fig1_aid_per_capita_and_population.png',
        'master_images/fig3_displacement_hotspots_dtm.png',
        'master_images/fig4_pooled_funds_historical_trajectory.png',
        'master_images/fig5_localization_and_grand_bargain.png',
        'master_images/fig6_macro_vulnerability_matrix.png'
      ];
      images.forEach((img, idx) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = img;
          a.download = img.split('/').pop();
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, idx * 400);
      });
    }
  </script>
</body>
</html>
"""

# Write to workspace
with open('somalia_integrated_humanitarian_master_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

# Write to artifact directory
artifact_path = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_integrated_humanitarian_master_dashboard.html'
with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(html_code)

print("Master Integrated HTML Dashboard successfully created in both workspace and artifact directory!")
