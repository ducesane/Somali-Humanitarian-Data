import os

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Somalia Humanitarian Aid: 2025 vs 2026 Comparative Analytics</title>
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

    <!-- TOP HEADER -->
    <header class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">YoY Comparison: 2025 vs 2026</span>
          <span class="badge bg-sky-500/20 text-sky-400 border border-sky-500/40">1,096 Total Flows Analyzed</span>
          <span class="badge bg-purple-500/20 text-purple-400 border border-purple-500/40">Python Analytics</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Somalia Humanitarian Aid: 2025 vs 2026 Comparative Analytics</h1>
        <p class="text-slate-400 text-sm mt-1">
          Detailed multi-year comparative intelligence contrasting <code class="text-sky-300 font-mono">somali data 2025.xlsx</code> against <code class="text-sky-300 font-mono">somali data all .xlsx (2026)</code>.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="Somalia_2025_vs_2026_Comparative_Report.xlsx" download class="btn-primary shadow-lg shadow-sky-900/30">
          <span>📊</span> Download Comparative Excel (.xlsx)
        </a>
        <button onclick="downloadAllCharts()" class="btn-download">
          <span>📸</span> Download All Comparison PNGs
        </button>
        <a href="somalia_aid_data_analysis.html" class="btn-download bg-slate-800 border-slate-700 text-slate-300">
          <span>&larr;</span> 2026 Dashboard
        </a>
      </div>
    </header>

    <!-- NAVIGATION PILLS -->
    <nav class="flex flex-wrap gap-2 py-1 px-3 bg-slate-900/60 border border-slate-800 rounded-xl">
      <a href="#sec-kpis" class="nav-pill">YoY Headline Metrics</a>
      <a href="#sec-figures" class="nav-pill">Visual Comparison Figures (6)</a>
      <a href="#sec-donors" class="nav-pill">Donor Movements Table</a>
      <a href="#sec-sectors" class="nav-pill">Sector Shifts (Winners & Losers)</a>
      <a href="#sec-localization" class="nav-pill">Localization & Grand Bargain Shift</a>
      <a href="#sec-code" class="nav-pill">Python Comparison Script</a>
    </nav>

    <!-- SECTION 1: HEADLINE YOY COMPARISON METRICS -->
    <section id="sec-kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Funding -->
      <div class="chart-card border-l-4 border-l-rose-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Humanitarian Aid</span>
        <div class="flex items-baseline gap-2 mt-1">
          <div class="text-2xl font-extrabold text-white">$349.1M</div>
          <span class="text-xs text-slate-400">vs $540.7M (2025)</span>
        </div>
        <p class="text-xs text-rose-400 font-bold mt-2 flex items-center gap-1">
          <span>▼</span> -$191.6M (-35.44%)
        </p>
      </div>

      <!-- Grant Flows -->
      <div class="chart-card border-l-4 border-l-rose-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Grant Transactions</span>
        <div class="flex items-baseline gap-2 mt-1">
          <div class="text-2xl font-extrabold text-white">431 flows</div>
          <span class="text-xs text-slate-400">vs 665 (2025)</span>
        </div>
        <p class="text-xs text-rose-400 font-bold mt-2 flex items-center gap-1">
          <span>▼</span> -234 flows (-35.19%)
        </p>
      </div>

      <!-- Localization Collapse -->
      <div class="chart-card border-l-4 border-l-amber-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Direct to Local Somali NGOs</span>
        <div class="flex items-baseline gap-2 mt-1">
          <div class="text-2xl font-extrabold text-amber-300">$2.81M (0.81%)</div>
        </div>
        <p class="text-xs text-rose-400 font-bold mt-2 flex items-center gap-1">
          <span>▼</span> Slashed from $11.25M (2.08%) in 2025
        </p>
      </div>

      <!-- Pooled Funds Surge -->
      <div class="chart-card border-l-4 border-l-emerald-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pooled Fund Facility (SHF)</span>
        <div class="flex items-baseline gap-2 mt-1">
          <div class="text-2xl font-extrabold text-emerald-300">$44.93M (12.87%)</div>
        </div>
        <p class="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
          <span>▲</span> Up from $30.05M (5.56%) in 2025 (+49.5%)
        </p>
      </div>
    </section>

    <!-- SECTION 2: COMPARATIVE PUBLICATION FIGURES (300 DPI) -->
    <section id="sec-figures" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-400"></span> 1. High-Resolution Comparative Figures (300 DPI)
          </h2>
          <p class="text-sm text-slate-400">Rendered via Python (<code class="text-sky-300">matplotlib</code> & <code class="text-sky-300">seaborn</code>). Click any button to download high-res PNG.</p>
        </div>
      </div>

      <!-- FIGURE 1 & 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Figure 1 -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 1: Total Aid Volume & Flow Count YoY</h3>
              <p class="text-xs text-slate-400">Direct volume comparison & transaction density</p>
            </div>
            <a href="comparison_images/comp_fig1_total_volume_and_flows.png" download="comp_fig1_total_volume_and_flows.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="comparison_images/comp_fig1_total_volume_and_flows.png" alt="Total Volume and Flows YoY" class="fig-img">
        </div>

        <!-- Figure 2 -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 2: Top Donors Funding Movements</h3>
              <p class="text-xs text-slate-400">US & UK steep pullbacks vs CERF & Germany expansion</p>
            </div>
            <a href="comparison_images/comp_fig2_donor_shifts.png" download="comp_fig2_donor_shifts.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="comparison_images/comp_fig2_donor_shifts.png" alt="Donor Shifts YoY" class="fig-img">
        </div>
      </div>

      <!-- FIGURE 3: SECTORAL WINNERS AND LOSERS -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <span class="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">Sector Realignment</span>
            <h3 class="text-base font-semibold text-white">Figure 3: Humanitarian Cluster Winners and Losers</h3>
            <p class="text-xs text-slate-400">Education (-$29.7M / -72.5%) and Health (-$18.4M / -39.7%) suffer deep cuts, while Protection grows (+$6.5M / +27.4%)</p>
          </div>
          <a href="comparison_images/comp_fig3_sectoral_winners_losers.png" download="comp_fig3_sectoral_winners_losers.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="comparison_images/comp_fig3_sectoral_winners_losers.png" alt="Sectoral Winners and Losers" class="fig-img">
      </div>

      <!-- FIGURE 4 & 5 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Figure 4 -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 4: The Localization Shift</h3>
              <p class="text-xs text-slate-400">Direct Local NGO funding collapses; channeled into SHF pooled funds</p>
            </div>
            <a href="comparison_images/comp_fig4_localization_trend.png" download="comp_fig4_localization_trend.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="comparison_images/comp_fig4_localization_trend.png" alt="Localization Trend" class="fig-img">
        </div>

        <!-- Figure 5 -->
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 5: Modality & Disbursement Status</h3>
              <p class="text-xs text-slate-400">Cash Modality share stable at ~17.7%; 2026 has higher pending commitments</p>
            </div>
            <a href="comparison_images/comp_fig5_modality_and_pipeline.png" download="comp_fig5_modality_and_pipeline.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="comparison_images/comp_fig5_modality_and_pipeline.png" alt="Modality and Pipeline" class="fig-img">
        </div>
      </div>

      <!-- FIGURE 6: CURRENCY -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 6: Currency Denomination Shift (2025 vs 2026)</h3>
            <p class="text-xs text-slate-400">Euro maintains clear dominance over direct USD and Pound Sterling contributions</p>
          </div>
          <a href="comparison_images/comp_fig6_currency_shifts.png" download="comp_fig6_currency_shifts.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="comparison_images/comp_fig6_currency_shifts.png" alt="Currency Shifts YoY" class="fig-img">
      </div>
    </section>

    <!-- SECTION 3: TOP DONORS YOY MOVEMENTS TABLE -->
    <section id="sec-donors" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-sky-400"></span> 2. Top Donor Funding Movements: 2025 vs 2026
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        Track who reduced, maintained, or increased humanitarian funding to Somalia:
      </p>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Donor Organization</th>
              <th>2025 Funding ($)</th>
              <th>2026 Funding ($)</th>
              <th>Net Change ($)</th>
              <th>YoY Trend (%)</th>
              <th>Strategic Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-white">European Commission (ECHO)</td>
              <td class="font-mono text-slate-300">$94,640,505</td>
              <td class="font-mono text-sky-400 font-bold">$82,364,310</td>
              <td class="font-mono text-rose-400">-$12,276,195</td>
              <td class="text-rose-400 font-bold">-13.0%</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">#1 Anchor Donor</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-300">United States of America</td>
              <td class="font-mono text-slate-300">$53,556,635</td>
              <td class="font-mono text-slate-300">$6,653,568</td>
              <td class="font-mono text-rose-400 font-bold">-$46,903,067</td>
              <td class="text-rose-400 font-bold">-87.6%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300">Severe Retrenchment</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-300">United Kingdom</td>
              <td class="font-mono text-slate-300">$81,784,876</td>
              <td class="font-mono text-slate-300">$46,180,170</td>
              <td class="font-mono text-rose-400 font-bold">-$35,604,706</td>
              <td class="text-rose-400 font-bold">-43.5%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300">Major Reduction</span></td>
            </tr>
            <tr class="bg-emerald-950/20 border-l-4 border-l-emerald-500">
              <td class="font-bold text-emerald-300">CERF (Global UN Pooled Fund)</td>
              <td class="font-mono text-slate-300">$24,850,014</td>
              <td class="font-mono text-emerald-400 font-bold">$33,000,014</td>
              <td class="font-mono text-emerald-400 font-bold">+$8,150,000</td>
              <td class="text-emerald-400 font-bold">+32.8%</td>
              <td><span class="badge bg-emerald-500/20 text-emerald-300">Emergency Surge</span></td>
            </tr>
            <tr class="bg-emerald-950/20 border-l-4 border-l-emerald-500">
              <td class="font-bold text-emerald-300">Germany</td>
              <td class="font-mono text-slate-300">$27,336,812</td>
              <td class="font-mono text-emerald-400 font-bold">$30,918,781</td>
              <td class="font-mono text-emerald-400 font-bold">+$3,581,969</td>
              <td class="text-emerald-400 font-bold">+13.1%</td>
              <td><span class="badge bg-emerald-500/20 text-emerald-300">Growing Partner</span></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Saudi Arabia (Kingdom of)</td>
              <td class="font-mono text-slate-300">$34,824,668</td>
              <td class="font-mono text-slate-300">$6,331,479</td>
              <td class="font-mono text-rose-400">-$28,493,189</td>
              <td class="text-rose-400 font-bold">-81.8%</td>
              <td><span class="badge bg-slate-500/20 text-slate-300">Large Cutback</span></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Qatar Fund for Development</td>
              <td class="font-mono text-slate-300">$24,196,228</td>
              <td class="font-mono text-slate-300">$880,000</td>
              <td class="font-mono text-rose-400">-$23,316,228</td>
              <td class="text-rose-400 font-bold">-96.4%</td>
              <td><span class="badge bg-slate-500/20 text-slate-300">Near Full Exit</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 4: SECTOR SHIFTS TABLE -->
    <section id="sec-sectors" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-amber-400"></span> 3. Sector Funding Shifts: Winners & Losers
      </h2>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Humanitarian Cluster</th>
              <th>2025 Funding ($)</th>
              <th>2026 Funding ($)</th>
              <th>Dollar Variance ($)</th>
              <th>Percentage Shift (%)</th>
              <th>Operational Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-white">Food Security</td>
              <td class="font-mono text-slate-300">$101,537,590</td>
              <td class="font-mono text-sky-300 font-bold">$73,835,409</td>
              <td class="font-mono text-rose-400">-$27,702,181</td>
              <td class="text-rose-400 font-bold">-27.3%</td>
              <td><span class="badge bg-slate-500/20 text-slate-300">Volume Leader</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-300">Education</td>
              <td class="font-mono text-slate-300">$40,917,324</td>
              <td class="font-mono text-slate-300">$11,245,466</td>
              <td class="font-mono text-rose-400 font-bold">-$29,671,858</td>
              <td class="text-rose-400 font-bold">-72.5%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40">Critical Deficit</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-300">Health</td>
              <td class="font-mono text-slate-300">$46,346,998</td>
              <td class="font-mono text-slate-300">$27,939,379</td>
              <td class="font-mono text-rose-400 font-bold">-$18,407,619</td>
              <td class="text-rose-400 font-bold">-39.7%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40">Heavy Reduction</span></td>
            </tr>
            <tr class="bg-emerald-950/20 border-l-4 border-l-emerald-500">
              <td class="font-bold text-emerald-300">Protection</td>
              <td class="font-mono text-slate-300">$23,548,833</td>
              <td class="font-mono text-emerald-400 font-bold">$29,997,995</td>
              <td class="font-mono text-emerald-400 font-bold">+$6,449,162</td>
              <td class="text-emerald-400 font-bold">+27.4%</td>
              <td><span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Surging Priority</span></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Water Sanitation Hygiene (WASH)</td>
              <td class="font-mono text-slate-300">$25,046,009</td>
              <td class="font-mono text-slate-300">$23,095,033</td>
              <td class="font-mono text-slate-300">-$1,950,976</td>
              <td class="text-slate-300 font-bold">-7.8%</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Resilient / Stable</span></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Multipurpose Cash</td>
              <td class="font-mono text-slate-300">$41,070,462</td>
              <td class="font-mono text-slate-300">$32,963,826</td>
              <td class="font-mono text-rose-400">-$8,106,636</td>
              <td class="text-rose-400 font-bold">-19.7%</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Core Modality</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 5: PYTHON CODE SCRIPT -->
    <section id="sec-code" class="chart-card">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-400"></span> 4. Python Comparative Automation Script
          </h2>
          <p class="text-sm text-slate-400">Script that loads both Excel files, calculates variances, and exports tables and figures.</p>
        </div>
        <a href="compare_2025_2026.py" download class="btn-download">
          <span>📄</span> Download Script (.py)
        </a>
      </div>
      <p class="text-xs text-slate-400">
        Run directly in your command line:
        <code class="bg-slate-950 px-2 py-1 rounded text-sky-300 font-mono text-xs ml-1">python compare_2025_2026.py</code>
      </p>
    </section>

    <!-- FOOTER -->
    <footer class="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
      Antigravity Multi-Year Humanitarian Analytics Suite &bull; Somalia 2025 vs 2026 Comparative Assessment
    </footer>

  </div>

  <script>
    function downloadAllCharts() {
      const images = [
        'comparison_images/comp_fig1_total_volume_and_flows.png',
        'comparison_images/comp_fig2_donor_shifts.png',
        'comparison_images/comp_fig3_sectoral_winners_losers.png',
        'comparison_images/comp_fig4_localization_trend.png',
        'comparison_images/comp_fig5_modality_and_pipeline.png',
        'comparison_images/comp_fig6_currency_shifts.png'
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
with open('somalia_2025_vs_2026_comparison.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

# Write to artifact directory
artifact_path = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_2025_vs_2026_comparison.html'
with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(html_code)

print("Comparative HTML dashboard created successfully in workspace and artifact directory!")
