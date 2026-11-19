html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Somalia Humanitarian Aid Data Intelligence (somali data all .xlsx)</title>
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

    <!-- HEADER -->
    <header class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Dataset: somali data all .xlsx</span>
          <span class="badge bg-sky-500/20 text-sky-400 border border-sky-500/40">43 Dimensions &bull; 431 Flows</span>
          <span class="badge bg-purple-500/20 text-purple-400 border border-purple-500/40">300 DPI Python Visuals</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Somalia Humanitarian Aid Data Intelligence Dashboard</h1>
        <p class="text-slate-400 text-sm mt-1">
          Advanced analytics covering Grand Bargain Localization, Cash Modalities, Currency FX Risk, Earmarking Flexibility, and UN Strategic Plan Alignment.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="Somalia_2026_Humanitarian_Intelligence_Report.xlsx" download class="btn-primary shadow-lg shadow-sky-900/30">
          <span>📊</span> Download Excel Report (.xlsx)
        </a>
        <button onclick="downloadAllCharts()" class="btn-download">
          <span>📸</span> Download All 8 PNGs
        </button>
      </div>
    </header>

    <!-- NAVIGATION PILLS -->
    <nav class="flex flex-wrap gap-2 py-1 px-3 bg-slate-900/60 border border-slate-800 rounded-xl">
      <a href="#sec-kpis" class="nav-pill">Strategic KPIs</a>
      <a href="#sec-figures" class="nav-pill">Python Publication Figures (8)</a>
      <a href="#sec-localization" class="nav-pill">Grand Bargain Localization</a>
      <a href="#sec-modality" class="nav-pill">Cash Modality & Earmarking</a>
      <a href="#sec-currency" class="nav-pill">Currency & FX Risk</a>
      <a href="#sec-scenario" class="nav-pill">What-If Simulator</a>
      <a href="#sec-code" class="nav-pill">Python Code</a>
    </nav>

    <!-- STRATEGIC KPIS (UNLOCKED BY THE 43-COLUMN DATASET) -->
    <section id="sec-kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="chart-card border-l-4 border-l-sky-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Humanitarian Aid</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">$349,067,239</div>
        <p class="text-xs text-sky-400 mt-2">
          431 flows &bull; 87.8% aligned with Somalia HNRP
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-rose-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Localization Share (Grand Bargain)</span>
        <div class="text-2xl md:text-3xl font-extrabold text-rose-400 mt-1">0.80% ($2.8M)</div>
        <p class="text-xs text-rose-300 mt-2">
          Direct to Local NGOs (Target was 25%)
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-emerald-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Cash Transfer Modality (CTP)</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">17.7% ($61.8M)</div>
        <p class="text-xs text-emerald-400 mt-2">
          59 direct cash & voucher flows
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-amber-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Euro Currency Exposure</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">40.7% (&euro;142.1M)</div>
        <p class="text-xs text-amber-400 mt-2">
          76.1% of all aid originates in non-USD
        </p>
      </div>
    </section>

    <!-- SECTION 1: EXPANDED PYTHON PUBLICATION FIGURES -->
    <section id="sec-figures" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-400"></span> 1. High-Resolution Python Visualizations (300 DPI)
          </h2>
          <p class="text-sm text-slate-400">Generated directly with Python (<code class="text-sky-300">matplotlib</code>, <code class="text-sky-300">seaborn</code>, <code class="text-sky-300">NetworkX</code>, <code class="text-sky-300">scikit-learn</code>). Click any button to download.</p>
        </div>
      </div>

      <!-- FIGURE 3: LOCALIZATION (GRAND BARGAIN) -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-1">Top Policy Finding</span>
            <h3 class="text-base font-semibold text-white">Figure 1: The Localization Gap & Grand Bargain Tracking</h3>
            <p class="text-xs text-slate-400">Direct allocation comparison: Local/National Somali NGOs (0.80%) vs UN Agencies (41.5%) & INGOs (34.4%)</p>
          </div>
          <a href="analysis_images/fig3_localization_grand_bargain_gap.png" download="fig1_localization_grand_bargain_gap.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig3_localization_grand_bargain_gap.png" alt="Localization Grand Bargain Gap" class="fig-img">
      </div>

      <!-- FIGURE 4: AID MODALITY & EARMARKING -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 2: Aid Modality (Cash Transfer Programming) & Earmarking Flexibility</h3>
            <p class="text-xs text-slate-400">Cash & Voucher assistance ($61.8M) vs. traditional aid, and tightly/softly earmarked vs. unearmarked funds ($8.5M)</p>
          </div>
          <a href="analysis_images/fig4_aid_modality_and_earmarking.png" download="fig2_aid_modality_and_earmarking.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig4_aid_modality_and_earmarking.png" alt="Aid Modality and Earmarking" class="fig-img">
      </div>

      <!-- FIGURE 5: FX CURRENCY EXPOSURE -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 3: Foreign Exchange & Currency Volatility Exposure</h3>
            <p class="text-xs text-slate-400">EUR ($142.1M / 40.7%) and GBP ($46.2M / 13.2%) dominate humanitarian funding over USD direct contributions ($83.3M)</p>
          </div>
          <a href="analysis_images/fig5_fx_currency_exposure.png" download="fig3_fx_currency_exposure.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig5_fx_currency_exposure.png" alt="Currency and FX Exposure" class="fig-img">
      </div>

      <!-- FIGURES 1 & 2 (2 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 4: Top Donors & Recipients</h3>
              <p class="text-xs text-slate-400">Ranked volumes in USD Millions</p>
            </div>
            <a href="analysis_images/fig1_top_donors_and_recipients.png" download="fig4_top_donors_and_recipients.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig1_top_donors_and_recipients.png" alt="Top Donors and Recipients" class="fig-img">
        </div>

        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 5: Cluster Allocation & Pipeline</h3>
              <p class="text-xs text-slate-400">Food Security, Cash, Health, WASH</p>
            </div>
            <a href="analysis_images/fig2_sectoral_allocation_and_pipeline.png" download="fig5_sectoral_allocation_and_pipeline.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig2_sectoral_allocation_and_pipeline.png" alt="Sectoral Allocation" class="fig-img">
        </div>
      </div>

      <!-- FIGURES 6 & 8 (2 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 6: Strategic Alignment & Disbursement</h3>
              <p class="text-xs text-slate-400">Inside Somalia HNRP (87.8%) vs Outside</p>
            </div>
            <a href="analysis_images/fig6_hrp_alignment_and_pipeline.png" download="fig6_hrp_alignment_and_pipeline.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig6_hrp_alignment_and_pipeline.png" alt="HRP Alignment" class="fig-img">
        </div>

        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 7: Top 10 Network Hubs</h3>
              <p class="text-xs text-slate-400">Degree centrality via NetworkX</p>
            </div>
            <a href="analysis_images/fig8_network_centrality_hubs.png" download="fig7_network_centrality_hubs.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig8_network_centrality_hubs.png" alt="Network Centrality Hubs" class="fig-img">
        </div>
      </div>

      <!-- FIGURE 7: NLP TOPIC MODELING -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 8: Unsupervised NLP Topic Modeling (scikit-learn NMF)</h3>
            <p class="text-xs text-slate-400">Latent topics extracted across 431 project descriptions</p>
          </div>
          <a href="analysis_images/fig7_nlp_topic_modeling.png" download="fig8_nlp_topic_modeling.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig7_nlp_topic_modeling.png" alt="NLP Topic Modeling" class="fig-img">
      </div>
    </section>

    <!-- SECTION 2: LOCALIZATION & INSTITUTIONAL BREAKDOWN TABLE -->
    <section id="sec-localization" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-400"></span> 2. The Localization Gap & Actor Level Distribution
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        Under the <em>Grand Bargain</em>, donors committed to directing at least 25% of humanitarian funding as directly as possible to local and national responders. In Somalia 2026, direct allocations show:
      </p>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Institutional Actor Category</th>
              <th>Actor Level</th>
              <th>Total Funding (US$)</th>
              <th>Flows</th>
              <th>Share of Aid (%)</th>
              <th>Policy Benchmark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-sky-400">UN Agencies</td>
              <td>International Actors</td>
              <td class="font-mono text-white">$144,683,693</td>
              <td>158</td>
              <td class="font-bold text-sky-300">41.45%</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Primary Intermediary</span></td>
            </tr>
            <tr>
              <td class="font-bold text-teal-400">International NGOs (INGOs)</td>
              <td>International Actors</td>
              <td class="font-mono text-white">$119,898,581</td>
              <td>167</td>
              <td class="font-bold text-teal-300">34.35%</td>
              <td><span class="badge bg-teal-500/20 text-teal-300">Direct Operations</span></td>
            </tr>
            <tr>
              <td class="font-bold text-purple-400">Somalia Humanitarian Fund (SHF)</td>
              <td>Country-Based Pooled Fund</td>
              <td class="font-mono text-white">$44,931,165</td>
              <td>17</td>
              <td class="font-bold text-purple-300">12.87%</td>
              <td><span class="badge bg-purple-500/20 text-purple-300">Sub-Granting Bridge</span></td>
            </tr>
            <tr>
              <td class="font-bold text-white">Red Cross / Red Crescent</td>
              <td>International Movement</td>
              <td class="font-mono text-white">$22,121,812</td>
              <td>26</td>
              <td class="font-bold text-white">6.34%</td>
              <td><span class="badge bg-slate-500/20 text-slate-300">Special Mandate</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-400">National NGOs / CSOs</td>
              <td>Local & National Non-State</td>
              <td class="font-mono text-rose-300 font-bold">$2,799,257</td>
              <td>27</td>
              <td class="font-bold text-rose-400">0.80%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40">Severe Deficit (&lt;1%)</span></td>
            </tr>
            <tr class="bg-rose-950/20 border-l-4 border-l-rose-500">
              <td class="font-bold text-rose-400">Local NGOs / CBOs</td>
              <td>Local & National Non-State</td>
              <td class="font-mono text-rose-300 font-bold">$10,831</td>
              <td>2</td>
              <td class="font-bold text-rose-400">0.003%</td>
              <td><span class="badge bg-rose-500/20 text-rose-300 border border-rose-500/40">Trace Allocation</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 3: SCENARIO SIMULATOR -->
    <section id="sec-scenario" class="chart-card border-indigo-500/40">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-400"></span> 3. Interactive What-If Scenario Simulator
          </h2>
          <p class="text-sm text-slate-400">Simulate donor budget changes and evaluate the impact on total Somalia aid.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="space-y-4 md:col-span-2">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-300">European Commission Revision (Base: $82.4M):</span>
              <span id="euLabel" class="text-sky-400">0%</span>
            </div>
            <input type="range" id="euSlider" min="-50" max="50" value="0" class="w-full accent-sky-400" oninput="updateScenario()">
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-300">United Kingdom Revision (Base: $46.2M):</span>
              <span id="ukLabel" class="text-emerald-400">0%</span>
            </div>
            <input type="range" id="ukSlider" min="-50" max="50" value="0" class="w-full accent-emerald-400" oninput="updateScenario()">
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-300">CERF Revision (Base: $33.0M):</span>
              <span id="cerfLabel" class="text-purple-400">0%</span>
            </div>
            <input type="range" id="cerfSlider" min="-50" max="50" value="0" class="w-full accent-purple-400" oninput="updateScenario()">
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <span class="text-xs text-slate-400 uppercase tracking-wider">Simulated Total Aid</span>
          <div id="simTotal" class="text-3xl font-extrabold text-white mt-2">$349.07M</div>
          <div id="simDelta" class="text-xs font-semibold text-slate-400 mt-1">No variance ($0.00M)</div>
          <button onclick="resetScenario()" class="mt-4 text-xs text-sky-400 underline cursor-pointer">Reset to Actuals</button>
        </div>
      </div>
    </section>

    <!-- SECTION 4: PYTHON PIPELINE SCRIPT -->
    <section id="sec-code" class="chart-card">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-400"></span> 4. Python Automation Script (`run_advanced_analysis.py`)
          </h2>
          <p class="text-sm text-slate-400">Configured to ingest <code class="text-sky-300 font-mono">somali data all .xlsx</code> and automate all charts & Excel tables.</p>
        </div>
        <a href="run_advanced_analysis.py" download class="btn-download">
          <span>📄</span> Download Script (.py)
        </a>
      </div>
      <p class="text-xs text-slate-400">
        Run directly in your command line:
        <code class="bg-slate-950 px-2 py-1 rounded text-sky-300 font-mono text-xs ml-1">python run_advanced_analysis.py</code>
      </p>
    </section>

    <!-- FOOTER -->
    <footer class="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
      Antigravity Python Humanitarian Intelligence Suite &bull; Generated from somali data all .xlsx (43 Data Columns)
    </footer>

  </div>

  <script>
    function downloadAllCharts() {
      const images = [
        'analysis_images/fig3_localization_grand_bargain_gap.png',
        'analysis_images/fig4_aid_modality_and_earmarking.png',
        'analysis_images/fig5_fx_currency_exposure.png',
        'analysis_images/fig1_top_donors_and_recipients.png',
        'analysis_images/fig2_sectoral_allocation_and_pipeline.png',
        'analysis_images/fig6_hrp_alignment_and_pipeline.png',
        'analysis_images/fig8_network_centrality_hubs.png',
        'analysis_images/fig7_nlp_topic_modeling.png'
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

    function updateScenario() {
      const euPct = parseFloat(document.getElementById('euSlider').value);
      const ukPct = parseFloat(document.getElementById('ukSlider').value);
      const cerfPct = parseFloat(document.getElementById('cerfSlider').value);

      document.getElementById('euLabel').textContent = (euPct > 0 ? '+' : '') + euPct + '%';
      document.getElementById('ukLabel').textContent = (ukPct > 0 ? '+' : '') + ukPct + '%';
      document.getElementById('cerfLabel').textContent = (cerfPct > 0 ? '+' : '') + cerfPct + '%';

      const baseEU = 82.364;
      const baseUK = 46.180;
      const baseCERF = 33.000;
      const baseTotal = 349.067;

      const deltaEU = baseEU * (euPct / 100);
      const deltaUK = baseUK * (ukPct / 100);
      const deltaCERF = baseCERF * (cerfPct / 100);

      const netDelta = deltaEU + deltaUK + deltaCERF;
      const newTotal = baseTotal + netDelta;

      document.getElementById('simTotal').textContent = '$' + newTotal.toFixed(2) + 'M';
      const deltaEl = document.getElementById('simDelta');
      if (netDelta > 0) {
        deltaEl.textContent = '▲ Increase of +$' + netDelta.toFixed(2) + 'M';
        deltaEl.className = 'text-xs font-semibold text-emerald-400 mt-1';
      } else if (netDelta < 0) {
        deltaEl.textContent = '▼ Funding deficit of -$' + Math.abs(netDelta).toFixed(2) + 'M';
        deltaEl.className = 'text-xs font-semibold text-rose-400 mt-1';
      } else {
        deltaEl.textContent = 'No variance ($0.00M)';
        deltaEl.className = 'text-xs font-semibold text-slate-400 mt-1';
      }
    }

    function resetScenario() {
      document.getElementById('euSlider').value = 0;
      document.getElementById('ukSlider').value = 0;
      document.getElementById('cerfSlider').value = 0;
      updateScenario();
    }
  </script>
</body>
</html>
"""

# Write to workspace
with open('somalia_aid_data_analysis.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Write to artifact directory
artifact_path = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_aid_data_analysis.html'
with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Dashboard successfully updated with all findings from 'somali data all .xlsx'!")
