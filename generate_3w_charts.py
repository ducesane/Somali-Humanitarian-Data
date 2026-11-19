import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os

os.makedirs('3w_images', exist_ok=True)
artifact_img_dir = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\3w_images'
os.makedirs(artifact_img_dir, exist_ok=True)

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Segoe UI', 'DejaVu Sans', 'Arial'
plt.rcParams['font.size'] = 11

# ==========================================
# CHART 1: LOCALIZATION DISCONNECT (Grand Bargain vs Ground Reality)
# ==========================================
fig, ax = plt.subplots(figsize=(11, 6), dpi=300)
categories = ['National NGOs (NNGOs)', 'International NGOs (INGOs)', 'UN Agencies / Funds', 'Government / Other']
# FTS funding: UN+CBPF = 41.5% + 12.9% = 54.4%, INGO = 36.1% + 1.7% = 37.8%, NNGO = 0.8%, Gov = 0.9%
fts_shares = [0.80, 37.8, 54.4, 0.9]
# 3W ground implementation: NNGO = 40.8%, INGO = 39.6%, UN = 16.4%, Gov = 3.2%
ground_shares = [40.8, 39.6, 16.4, 3.2]

x = np.arange(len(categories))
width = 0.35

rects1 = ax.bar(x - width/2, fts_shares, width, label='FTS Funding Share (% of $349.1M)', color='#1e3d59', edgecolor='black', linewidth=0.8)
rects2 = ax.bar(x + width/2, ground_shares, width, label='3W Operational Activities (% of 7,233 field actions)', color='#ff6e40', edgecolor='black', linewidth=0.8)

ax.set_ylabel('Percentage Share (%)', fontsize=12, fontweight='bold')
ax.set_title('The Localization Paradox in Somalia (2026)\nFTS Funding Allocation vs. Ground Implementation Footprint', fontsize=14, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=11, fontweight='bold')
ax.legend(frameon=True, facecolor='white', framealpha=0.9, fontsize=11)
ax.set_ylim(0, 65)

# Add values above bars
for rect in rects1:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%', xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#1e3d59')

for rect in rects2:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%', xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#c44d2d')

# Annotate the gap
ax.annotate('Massive Localization Gap:\nNNGOs do 41% of frontline work\nbut get <1% direct funding!', 
            xy=(0 + width/2, 41), xytext=(0.5, 48),
            arrowprops=dict(arrowstyle="->", color='#d9534f', lw=2),
            bbox=dict(boxstyle="round,pad=0.5", facecolor='#ffeb3b', alpha=0.9, edgecolor='#f57c00'),
            fontsize=10, fontweight='bold')

plt.tight_layout()
plt.savefig('3w_images/3w_fig1_localization_disconnect.png')
plt.savefig(os.path.join(artifact_img_dir, '3w_fig1_localization_disconnect.png'))
plt.close()

# ==========================================
# CHART 2: SECTORAL FUNDING VS 3W OPERATIONAL PRESENCE
# ==========================================
fig, ax1 = plt.subplots(figsize=(13, 7), dpi=300)

sectors = ['Food Security', 'Health', 'Protection / CP / GBV', 'WASH', 'Nutrition', 'Education', 'Shelter & NFIs', 'CCCM']
fts_funding_m = [73.84, 27.94, 29.99, 23.10, 9.04, 11.25, 8.02, 3.20] # in Millions USD
# 3W activities: Health (1462), Food Security (1212), Protection total (909+684+581+79+97=2350), WASH (769), Nutrition (791), Education (535), Shelter (52), CCCM (62)
w3_activities = [1212, 1462, 2174, 769, 791, 535, 52, 62]

y_pos = np.arange(len(sectors))
ax1.barh(y_pos - 0.2, fts_funding_m, 0.4, label='FTS Funding (Million US$)', color='#2b580c', edgecolor='black', linewidth=0.7)
ax2 = ax1.twiny()
ax2.barh(y_pos + 0.2, w3_activities, 0.4, label='3W Operational Activities', color='#f37121', edgecolor='black', linewidth=0.7)

ax1.set_yticks(y_pos)
ax1.set_yticklabels(sectors, fontsize=11, fontweight='bold')
ax1.set_xlabel('FTS Funding (Million US$)', color='#2b580c', fontsize=12, fontweight='bold')
ax2.set_xlabel('3W Operational Field Activities', color='#f37121', fontsize=12, fontweight='bold')
ax1.set_title('Somalia Sectoral Comparison: FTS Funding vs. 3W Operational Field Presence (2026)', fontsize=14, fontweight='bold', pad=25)

# Value labels
for i, v in enumerate(fts_funding_m):
    ax1.text(v + 1.5, i - 0.2, f"${v:.1f}M", va='center', ha='left', color='#2b580c', fontweight='bold', fontsize=10)

for i, v in enumerate(w3_activities):
    ax2.text(v + 35, i + 0.2, f"{v:,}", va='center', ha='left', color='#b84d09', fontweight='bold', fontsize=10)

ax1.set_xlim(0, 90)
ax2.set_xlim(0, 2600)
ax1.grid(axis='x', linestyle='--', alpha=0.5)
ax2.grid(False)

# Combined legend
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='lower right', frameon=True, facecolor='white', framealpha=0.95)

plt.tight_layout()
plt.savefig('3w_images/3w_fig2_sector_funding_vs_operational_activities.png')
plt.savefig(os.path.join(artifact_img_dir, '3w_fig2_sector_funding_vs_operational_activities.png'))
plt.close()

# ==========================================
# CHART 3: REGIONAL OPERATIONAL DENSITY VS TARGET REACH RATIO
# ==========================================
# Load the data we calculated
regions = ['Bay', 'Banadir', 'Lower Juba', 'Gedo', 'Mudug', 'Bakool', 'Nugaal', 'Hiraan', 
           'Lower Shabelle', 'Galgaduud', 'Middle Shabelle', 'Sanaag', 'Bari', 'Woqooyi Galbeed', 
           'Awdal', 'Sool', 'Togdheer', 'Middle Juba']
activities = [1094, 889, 670, 601, 558, 474, 449, 423, 417, 325, 325, 224, 220, 158, 150, 128, 93, 35]
reach_ratios = [97.0, 47.8, 76.4, 117.3, 78.3, 139.0, 55.6, 180.3, 78.4, 90.3, 37.1, 123.2, 96.8, 61.2, 213.6, 96.8, 76.4, 11.8]
targets_k = [927, 1291, 490, 429, 567, 296, 340, 206, 561, 414, 484, 230, 454, 491, 241, 212, 340, 180] # in thousands

fig, ax = plt.subplots(figsize=(12, 7), dpi=300)

scatter = ax.scatter(activities, reach_ratios, s=[t/2 for t in targets_k], c=reach_ratios, 
                     cmap='Spectral', alpha=0.85, edgecolors='black', linewidth=1.2)

cbar = plt.colorbar(scatter)
cbar.set_label('Target Reached Ratio (%)', fontsize=11, fontweight='bold')

# Reference line at 100% reach
ax.axhline(100, color='gray', linestyle='--', linewidth=1.2, label='100% Target Met')
ax.axhline(50, color='red', linestyle=':', linewidth=1.2, label='50% Critical Deficit Line')

for i, txt in enumerate(regions):
    offset_x = 15
    offset_y = 2
    if txt == 'Middle Juba':
        offset_y = -8
    elif txt == 'Bay':
        offset_x = -70
    elif txt == 'Banadir':
        offset_x = -75
    ax.annotate(txt, (activities[i], reach_ratios[i]), xytext=(activities[i] + offset_x, reach_ratios[i] + offset_y),
                fontsize=9, fontweight='bold', color='#111111')

ax.set_xlabel('3W Operational Field Activities (Partner Presence)', fontsize=12, fontweight='bold')
ax.set_ylabel('Target Reached Ratio (%) [Reached / Targeted]', fontsize=12, fontweight='bold')
ax.set_title('Regional Humanitarian Coverage Matrix: Partner Footprint vs. Target Reach\n(Bubble size proportional to total targeted population)', fontsize=13, fontweight='bold', pad=15)

# Annotate extreme points
ax.annotate('Middle Juba: Severe Access Blackout\n(Only 35 activities, 11.8% reach)', 
            xy=(35, 11.8), xytext=(120, 25),
            arrowprops=dict(arrowstyle="->", color='red', lw=1.5),
            bbox=dict(boxstyle="round,pad=0.3", facecolor='#ffcdd2', edgecolor='red'),
            fontsize=9, fontweight='bold')

ax.annotate('Banadir (Mogadishu):\nSevere Urban Delivery Gap\n(889 activities, yet only 47.8% reach!)', 
            xy=(889, 47.8), xytext=(650, 20),
            arrowprops=dict(arrowstyle="->", color='#c2185b', lw=1.5),
            bbox=dict(boxstyle="round,pad=0.3", facecolor='#f8bbd0', edgecolor='#c2185b'),
            fontsize=9, fontweight='bold')

ax.annotate('Bay (Baidoa):\nMassive Cluster Density\n(1,094 activities, 97.0% reach)', 
            xy=(1094, 97.0), xytext=(850, 120),
            arrowprops=dict(arrowstyle="->", color='#2e7d32', lw=1.5),
            bbox=dict(boxstyle="round,pad=0.3", facecolor='#c8e6c9', edgecolor='#2e7d32'),
            fontsize=9, fontweight='bold')

ax.set_ylim(0, 230)
ax.set_xlim(0, 1250)
ax.legend(loc='upper left', frameon=True, facecolor='white')

plt.tight_layout()
plt.savefig('3w_images/3w_fig3_regional_operational_density_vs_reach.png')
plt.savefig(os.path.join(artifact_img_dir, '3w_fig3_regional_operational_density_vs_reach.png'))
plt.close()

# ==========================================
# CHART 4: CASH-BASED PROGRAMMING (CWG 4W & FTS)
# ==========================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), dpi=300)

# Panel A: CWG CVA Monthly Beneficiaries by Sector
cva_clusters = ['Food Security', 'Multi-Purpose Cash (MPCA)', 'Child Protection', 'GBV', 'Nutrition', 'WASH']
# Monthly averages from CWG 4W tracker (Food sec: ~800k, MPCA: ~50k-80k, CP: ~3k, GBV: ~1.5k, Nut: ~1k, WASH: ~1k)
cva_beneficiaries = [797698, 62450, 1944, 933, 850, 620]
colors_cva = ['#ff7043', '#42a5f5', '#ab47bc', '#ec407a', '#26a69a', '#78909c']

bars = ax1.bar(cva_clusters, cva_beneficiaries, color=colors_cva, edgecolor='black', linewidth=0.8)
ax1.set_yscale('log')
ax1.set_ylabel('Monthly Average Beneficiaries Reached (Log Scale)', fontsize=11, fontweight='bold')
ax1.set_title('A. CWG 4W: Cash & Voucher Transfers by Sector\n(Average Monthly People Reached)', fontsize=12, fontweight='bold')
ax1.set_xticklabels(cva_clusters, rotation=30, ha='right', fontsize=9, fontweight='bold')

for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval * 1.25, f"{int(yval):,}", ha='center', va='bottom', fontsize=9, fontweight='bold')

# Panel B: FTS Cash Funding vs Total FTS Funding
modalities = ['Food Security Cash & Vouchers', 'Multi-Purpose Cash (MPCA)', 'Other Cash/Vouchers', 'In-Kind Aid & Direct Services']
fts_modality_vals = [48.5, 33.0, 12.2, 255.4] # in Million USD (sum = 349.1M)
colors_mod = ['#ff7043', '#42a5f5', '#ffca28', '#b0bec5']

wedges, texts, autotexts = ax2.pie(fts_modality_vals, labels=modalities, autopct='%1.1f%%',
                                    startangle=140, colors=colors_mod, 
                                    wedgeprops=dict(width=0.45, edgecolor='black', linewidth=0.8),
                                    textprops=dict(fontweight='bold', fontsize=9))

for autotext in autotexts:
    autotext.set_fontsize(10)
    autotext.set_fontweight('bold')

ax2.set_title('B. FTS 2026: Modality Funding Breakdown\n(Cash & Voucher Share: 26.8% / $93.7M)', fontsize=12, fontweight='bold')

plt.suptitle('Somalia Cash-Based Programming (CBP / CWG 4W) & FTS Integration', fontsize=14, fontweight='bold', y=0.98)
plt.tight_layout()
plt.savefig('3w_images/3w_fig4_cash_programming_breakdown.png')
plt.savefig(os.path.join(artifact_img_dir, '3w_fig4_cash_programming_breakdown.png'))
plt.close()

# ==========================================
# CHART 5: 2025 VS 2026 OPERATIONAL CONTRACTION
# ==========================================
fig, ax1 = plt.subplots(figsize=(10, 6), dpi=300)

metrics = ['FTS Total Funding ($M)', 'Active Humanitarian Orgs', 'Operational Presence Records (Scaled)']
vals_2025 = [540.67, 282, 11847 / 100]  # scaled for display
vals_2026 = [349.07, 204, (7233 * 2) / 100] # annualized Jan-June for comparison

x = np.arange(len(metrics))
width = 0.32

r1 = ax1.bar(x - width/2, [540.7, 282, 11847], width, label='2025 Full Year', color='#1976d2', edgecolor='black')
r2 = ax1.bar(x + width/2, [349.1, 204, 7233], width, label='2026 (Jan-June / Current)', color='#e53935', edgecolor='black')

ax1.set_yscale('log')
ax1.set_ylabel('Metric Value (Log Scale)', fontsize=12, fontweight='bold')
ax1.set_title('Humanitarian Contraction in Somalia: 2025 vs. 2026\nComparing Funding Reductions to On-the-Ground Partner Shrinkage', fontsize=13, fontweight='bold', pad=15)
ax1.set_xticks(x)
ax1.set_xticklabels(['FTS Funding\n(Million US$)', 'Active Operating\nOrganizations', 'Operational Presence\nRecords'], fontsize=11, fontweight='bold')

# Annotations
ax1.annotate('$540.7M', (x[0] - width/2, 540.7), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#1976d2')
ax1.annotate('$349.1M\n(-35.4%)', (x[0] + width/2, 349.1), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#e53935')

ax1.annotate('282 Orgs', (x[1] - width/2, 282), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#1976d2')
ax1.annotate('204 Orgs\n(-27.7%)', (x[1] + width/2, 204), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#e53935')

ax1.annotate('11,847 Recs', (x[2] - width/2, 11847), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#1976d2')
ax1.annotate('7,233 Recs\n(H1 2026)', (x[2] + width/2, 7233), xytext=(0, 5), textcoords='offset points', ha='center', fontweight='bold', color='#e53935')

ax1.legend(loc='upper right', frameon=True, facecolor='white', fontsize=11)
plt.tight_layout()
plt.savefig('3w_images/3w_fig5_operational_contraction_2025_vs_2026.png')
plt.savefig(os.path.join(artifact_img_dir, '3w_fig5_operational_contraction_2025_vs_2026.png'))
plt.close()

print("All 5 charts successfully generated and saved to 3w_images/ and artifact dir!")
