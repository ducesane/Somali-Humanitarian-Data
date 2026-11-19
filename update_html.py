import os

html_code = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Somalia Humanitarian Aid Data Intelligence (FTS 2026) - Python Analytics</title>
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
    canvas {
      width: 100% !important;
      max-height: 340px;
      border-radius: 0.5rem;
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
    .fig-img {
      width: 100%;
      height: auto;
      border-radius: 0.5rem;
      border: 1px solid #334155;
      background: #0f172a;
    }
  </style>
</head>
<body class="p-4 md:p-8">
  <div class="max-w-7xl mx-auto space-y-8">

    <!-- TOP HEADER -->
    <header class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">FTS Somalia 2026</span>
          <span class="badge bg-sky-500/20 text-sky-400 border border-sky-500/40">Python Statistical & ML Suite</span>
          <span class="badge bg-purple-500/20 text-purple-400 border border-purple-500/40">300 DPI Figures Generated</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Somalia Humanitarian Aid Data Intelligence Dashboard</h1>
        <p class="text-slate-400 text-sm mt-1">
          In-depth data science findings, Gini inequality metrics, NMF topic modeling, NetworkX centrality, and high-resolution visual exports.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="Somalia_2026_Humanitarian_Intelligence_Report.xlsx" download class="btn-primary shadow-lg shadow-sky-900/30">
          <span>📊</span> Download Excel Report (.xlsx)
        </a>
        <button onclick="downloadAllCharts()" class="btn-download">
          <span>📸</span> Download All PNGs
        </button>
      </div>
    </header>

    <!-- NAV PILLS -->
    <nav class="flex flex-wrap gap-2 py-1 px-3 bg-slate-900/60 border border-slate-800 rounded-xl">
      <a href="#sec-kpis" class="nav-pill">Key Metrics & Gini</a>
      <a href="#sec-py-figures" class="nav-pill">Python Publication Figures (7)</a>
      <a href="#sec-network" class="nav-pill">Network Hub Centrality</a>
      <a href="#sec-nmf" class="nav-pill">NLP Topic Modeling (NMF)</a>
      <a href="#sec-risk" class="nav-pill">Dependency & Liquidity Risk</a>
      <a href="#sec-scenario" class="nav-pill">What-If Simulator</a>
      <a href="#sec-code" class="nav-pill">Python Code Pipeline</a>
    </nav>

    <!-- METRICS & ADVANCED GINI INDEX CARDS -->
    <section id="sec-kpis" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="chart-card border-l-4 border-l-sky-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Funding Analyzed</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">$349,067,239</div>
        <p class="text-xs text-sky-400 mt-2 flex items-center gap-1">
          <span>📊</span> 431 flows | 48 Donors &rarr; 60 Recipients
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-rose-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Donor Gini Index</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">0.725</div>
        <p class="text-xs text-rose-400 mt-2">
          High concentration: Top 10% donors fund 55.1%
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-purple-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Network Hub</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">European Comm.</div>
        <p class="text-xs text-purple-400 mt-2">
          Degree Centrality: 0.189 (Primary bilateral anchor)
        </p>
      </div>
      <div class="chart-card border-l-4 border-l-amber-500">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Health Liquidity Gap</span>
        <div class="text-2xl md:text-3xl font-extrabold text-white mt-1">68.8% Unpaid</div>
        <p class="text-xs text-amber-400 mt-2">
          $19.2M Commitment vs $8.7M Paid Contribution
        </p>
      </div>
    </section>

    <!-- SECTION 1: PYTHON GENERATED PUBLICATION FIGURES -->
    <section id="sec-py-figures" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-400"></span> 1. High-Resolution Python Visual Analytics (300 DPI)
          </h2>
          <p class="text-sm text-slate-400">Generated directly via Python (<code class="text-sky-300">matplotlib</code> & <code class="text-sky-300">seaborn</code>). Click any button to download high-res PNG for reports.</p>
        </div>
      </div>

      <!-- FIGURE 1 -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 1: Top 8 Donors & Recipient Agencies Distribution</h3>
            <p class="text-xs text-slate-400">Comparative bilateral volume in USD Millions</p>
          </div>
          <a href="analysis_images/fig1_top_donors_and_recipients.png" download="fig1_top_donors_and_recipients.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig1_top_donors_and_recipients.png" alt="Figure 1: Top Donors & Recipients" class="fig-img">
      </div>

      <!-- FIGURE 2 -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 2: Humanitarian Cluster Allocation & Funding Pipeline Health</h3>
            <p class="text-xs text-slate-400">Sectoral volume alongside paid disbursements vs committed pipelines</p>
          </div>
          <a href="analysis_images/fig2_sectoral_allocation_and_pipeline.png" download="fig2_sectoral_allocation_and_pipeline.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig2_sectoral_allocation_and_pipeline.png" alt="Figure 2: Sector Allocation & Pipeline" class="fig-img">
      </div>

      <!-- FIGURE 3 -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 3: Pareto Funding Concentration & Lorenz Inequality Curve</h3>
            <p class="text-xs text-slate-400">Mathematical proof of funding inequality across donors and grant size distributions (Gini = 0.683)</p>
          </div>
          <a href="analysis_images/fig3_pareto_and_lorenz_curve.png" download="fig3_pareto_and_lorenz_curve.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig3_pareto_and_lorenz_curve.png" alt="Figure 3: Pareto and Lorenz Curve" class="fig-img">
      </div>

      <!-- FIGURE 4 & FIGURE 6 (2 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 4: Network Centrality Hubs</h3>
              <p class="text-xs text-slate-400">Degree centrality computed via NetworkX</p>
            </div>
            <a href="analysis_images/fig4_network_centrality_hubs.png" download="fig4_network_centrality_hubs.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig4_network_centrality_hubs.png" alt="Figure 4: Network Centrality Hubs" class="fig-img">
        </div>

        <div class="chart-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h3 class="text-base font-semibold text-white">Figure 5: Sector Disbursement Liquidity Gap</h3>
              <p class="text-xs text-slate-400">Paid cash vs pending commitment risk</p>
            </div>
            <a href="analysis_images/fig6_disbursement_liquidity_gap.png" download="fig6_disbursement_liquidity_gap.png" class="btn-download">
              <span>📥</span> Download PNG
            </a>
          </div>
          <img src="analysis_images/fig6_disbursement_liquidity_gap.png" alt="Figure 5: Sector Disbursement Liquidity Gap" class="fig-img">
        </div>
      </div>

      <!-- FIGURE 5: NLP TOPIC MODELING -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 6: Unsupervised NLP Topic Modeling (NMF Decomposition)</h3>
            <p class="text-xs text-slate-400">Feature weights extracted from 431 humanitarian project descriptions</p>
          </div>
          <a href="analysis_images/fig5_nlp_topic_modeling.png" download="fig5_nlp_topic_modeling.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig5_nlp_topic_modeling.png" alt="Figure 6: NLP Topic Modeling" class="fig-img">
      </div>

      <!-- FIGURE 7: OUTLIERS & LOG-NORMAL DISTRIBUTION -->
      <div class="chart-card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 class="text-base font-semibold text-white">Figure 7: Log-Normal Grant Distribution & Box-Plot Outlier Detection</h3>
            <p class="text-xs text-slate-400">Dispersion across top sectors showing mega-grant outliers (up to $16M)</p>
          </div>
          <a href="analysis_images/fig7_distribution_and_outliers.png" download="fig7_distribution_and_outliers.png" class="btn-download">
            <span>📥</span> Download 300-DPI PNG
          </a>
        </div>
        <img src="analysis_images/fig7_distribution_and_outliers.png" alt="Figure 7: Distribution & Outliers" class="fig-img">
      </div>
    </section>

    <!-- SECTION 2: NLP TOPIC MODELING DETAILED FINDINGS -->
    <section id="sec-nmf" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span> 2. Unsupervised Topic Modeling Findings (scikit-learn NMF)
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        Natural language processing applied across all 431 transaction descriptions extracted 4 latent humanitarian priorities:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sky-400">Topic 1: Strategic Planning & Refugee Operations</span>
            <span class="badge bg-sky-500/20 text-sky-300">Cluster 1</span>
          </div>
          <p class="text-xs text-slate-300 mt-2"><b>Key Identifiers:</b> <code>response</code>, <code>plan</code>, <code>needs</code>, <code>refugee</code>, <code>operations</code></p>
          <p class="text-xs text-slate-400 mt-1">Multi-agency coordination and broader regional displacement assistance programs.</p>
        </div>

        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="font-bold text-emerald-400">Topic 2: Integrated Health & Nutrition Services</span>
            <span class="badge bg-emerald-500/20 text-emerald-300">Cluster 2</span>
          </div>
          <p class="text-xs text-slate-300 mt-2"><b>Key Identifiers:</b> <code>affected</code>, <code>vulnerable</code>, <code>nutrition</code>, <code>health</code>, <code>integrated</code></p>
          <p class="text-xs text-slate-400 mt-1">Community-level therapeutic feeding, primary clinic operations, and maternal health support.</p>
        </div>

        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="font-bold text-amber-400">Topic 3: CERF Rapid Response Allocations</span>
            <span class="badge bg-amber-500/20 text-amber-300">Cluster 3</span>
          </div>
          <p class="text-xs text-slate-300 mt-2"><b>Key Identifiers:</b> <code>rapid</code>, <code>cerf</code>, <code>project</code>, <code>underfunded</code>, <code>emergency</code></p>
          <p class="text-xs text-slate-400 mt-1">First-responder emergency injections triggered by acute drought, floods, and famine alerts.</p>
        </div>

        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <span class="font-bold text-purple-400">Topic 4: Somalia Humanitarian Fund (SOHF)</span>
            <span class="badge bg-purple-500/20 text-purple-300">Cluster 4</span>
          </div>
          <p class="text-xs text-slate-300 mt-2"><b>Key Identifiers:</b> <code>fund</code>, <code>contribution</code>, <code>sohf</code>, <code>pooled</code>, <code>allocation</code></p>
          <p class="text-xs text-slate-400 mt-1">Country-based pooled funding that sub-grants flexibly to frontline international and Somali NGOs.</p>
        </div>
      </div>
    </section>

    <!-- SECTION 3: NETWORK CENTRALITY -->
    <section id="sec-network" class="chart-card">
      <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-purple-400"></span> 3. Network Hub Centrality Metrics (NetworkX)
      </h2>
      <p class="text-sm text-slate-400 mb-4">
        Top humanitarian stakeholders measured by connection ratio across all bilateral funding channels:
      </p>
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Degree Centrality</th>
              <th>Network Influence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-sky-400">1</td>
              <td class="font-medium text-white">European Commission (ECHO)</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Primary Bilateral Donor</span></td>
              <td class="font-mono font-bold text-sky-300">0.189</td>
              <td class="text-slate-300">Connects with 18 distinct partner agencies; biggest humanitarian pipeline anchor</td>
            </tr>
            <tr>
              <td class="font-bold text-emerald-400">2</td>
              <td class="font-medium text-white">FAO (Food and Agriculture Organization)</td>
              <td><span class="badge bg-emerald-500/20 text-emerald-300">UN Intermediary Agency</span></td>
              <td class="font-mono font-bold text-emerald-300">0.147</td>
              <td class="text-slate-300">Key rural food security and livelihoods delivery partner for multiple governments</td>
            </tr>
            <tr>
              <td class="font-bold text-white">3</td>
              <td class="font-medium text-white">Germany, Government of</td>
              <td><span class="badge bg-sky-500/20 text-sky-300">Bilateral Donor</span></td>
              <td class="font-mono font-bold text-white">0.137</td>
              <td class="text-slate-300">Major diversified contributor across bilateral protection and food security initiatives</td>
            </tr>
            <tr>
              <td class="font-bold text-white">4</td>
              <td class="font-medium text-white">Somalia Humanitarian Fund (SHF)</td>
              <td><span class="badge bg-purple-500/20 text-purple-300">Pooled Fund Facility</span></td>
              <td class="font-mono font-bold text-white">0.137</td>
              <td class="text-slate-300">Acts as the key bridge channeling multi-donor funds to grassroots local NGOs</td>
            </tr>
            <tr>
              <td class="font-bold text-white">5</td>
              <td class="font-medium text-white">World Food Programme (WFP)</td>
              <td><span class="badge bg-emerald-500/20 text-emerald-300">UN Intermediary Agency</span></td>
              <td class="font-mono font-bold text-white">0.126</td>
              <td class="text-slate-300">Largest single recipient of funds ($55.2M) coordinating emergency food relief</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 4: SCENARIO SIMULATOR -->
    <section id="sec-scenario" class="chart-card border-indigo-500/40">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-400"></span> 4. Interactive Scenario / Stress-Test Simulator
          </h2>
          <p class="text-sm text-slate-400">Test what happens to total Somalia humanitarian funding under donor budget revisions.</p>
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
          <span class="text-xs text-slate-400 uppercase tracking-wider">Simulated Total Funding</span>
          <div id="simTotal" class="text-3xl font-extrabold text-white mt-2">$349.07M</div>
          <div id="simDelta" class="text-xs font-semibold text-slate-400 mt-1">No variance ($0.00M)</div>
          <button onclick="resetScenario()" class="mt-4 text-xs text-sky-400 underline cursor-pointer">Reset to Actuals</button>
        </div>
      </div>
    </section>

    <!-- SECTION 5: PYTHON AUTOMATION CODE -->
    <section id="sec-code" class="chart-card">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-400"></span> 5. Executed Python Code (`run_advanced_analysis.py`)
          </h2>
          <p class="text-sm text-slate-400">The script that performed all the above statistical, network, NLP, and chart operations.</p>
        </div>
        <a href="run_advanced_analysis.py" download class="btn-download">
          <span>📄</span> Download Script (.py)
        </a>
      </div>
      <p class="text-xs text-slate-400">
        You can rerun the complete workflow anytime by simply executing:
        <code class="bg-slate-950 px-2 py-1 rounded text-sky-300 font-mono text-xs ml-1">python run_advanced_analysis.py</code>
      </p>
    </section>

    <!-- FOOTER -->
    <footer class="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
      Antigravity Python Humanitarian Intelligence Suite &bull; Somalia 2026 Financial Tracking Service Analysis
    </footer>

  </div>

  <script>
    function downloadAllCharts() {
      const images = [
        'analysis_images/fig1_top_donors_and_recipients.png',
        'analysis_images/fig2_sectoral_allocation_and_pipeline.png',
        'analysis_images/fig3_pareto_and_lorenz_curve.png',
        'analysis_images/fig4_network_centrality_hubs.png',
        'analysis_images/fig5_nlp_topic_modeling.png',
        'analysis_images/fig6_disbursement_liquidity_gap.png',
        'analysis_images/fig7_distribution_and_outliers.png'
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
    f.write(html_code)

# Write to artifact directory
artifact_path = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_aid_data_analysis.html'
with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write(html_code)

print("Updated somalia_aid_data_analysis.html written to both workspace and artifact directory!")
