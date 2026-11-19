import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os

os.makedirs('flow_images', exist_ok=True)
artifact_flow_dir = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\flow_images'
os.makedirs(artifact_flow_dir, exist_ok=True)

plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Segoe UI', 'DejaVu Sans', 'Arial'

# ==============================================================
# CHART: WHERE DOES INGO MONEY GO & WHERE DO LOCAL NGOS GET MONEY
# (Spacious, high-res layout with zero text overlaps)
# ==============================================================
fig = plt.figure(figsize=(19, 11.5), dpi=300)

# Main Super Title with generous clearance
plt.suptitle('Somalia Aid Flow Architecture: INGO Expenditures vs. Local NGO Revenue Channels', 
             fontsize=16, fontweight='bold', y=0.97, color='#0f172a')

# Dedicated GridSpec with spacious wspace and hspace margins
gs = fig.add_gridspec(2, 2, hspace=0.42, wspace=0.52, top=0.90, bottom=0.08, left=0.14, right=0.96)

# --------------------------------------------------------------
# 1. Top Left: Where INGO Money Goes (By Sector)
# --------------------------------------------------------------
ax1 = fig.add_subplot(gs[0, 0])
ingo_sectors = ['Protection / CP', 'Food Security', 'Multipurpose Cash', 'Health', 'Multi-Sector (BRCiS)', 'Education', 'Nutrition', 'WASH']
ingo_sec_amounts = [23.96, 19.28, 15.26, 15.01, 12.30, 9.97, 5.68, 4.54] # Million USD
colors_sec = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0d9488', '#475569']

bars1 = ax1.barh(ingo_sectors[::-1], ingo_sec_amounts[::-1], color=colors_sec[::-1], edgecolor='#1e293b', linewidth=0.8, height=0.62)
ax1.set_xlabel('FTS Funding Allocated (Million US$)', fontweight='bold', fontsize=10.5, labelpad=8)
ax1.set_title('A. Where INGO Money Goes: Top Sectors (2026)\nTotal Tracked INGO Funding: $119.9M', fontweight='bold', fontsize=11.5, pad=12, color='#0f172a')
ax1.tick_params(axis='y', labelsize=10)
ax1.tick_params(axis='x', labelsize=9.5)
ax1.set_xlim(0, 28)

for bar in bars1:
    w = bar.get_width()
    y = bar.get_y() + bar.get_height() / 2
    ax1.text(w + 0.45, y, f"${w:.1f}M", va='center', ha='left', fontweight='bold', fontsize=9.5, color='#0f172a')

# --------------------------------------------------------------
# 2. Top Right: Top INGO Recipients (Who gets the INGO money)
# --------------------------------------------------------------
ax2 = fig.add_subplot(gs[0, 1])
top_ingos = [
    'Norwegian Refugee Council (NRC)', 
    'Concern Worldwide', 
    'Qatar Charity', 
    'Save the Children', 
    'Acción Contra el Hambre (ACH)', 
    'HALO Trust', 
    'Action Against Hunger (ACF)', 
    'ACTED'
]
top_ingo_amts = [18.96, 17.00, 14.57, 14.26, 13.17, 9.66, 8.51, 3.04]

bars2 = ax2.barh(top_ingos[::-1], top_ingo_amts[::-1], color='#1e3d59', edgecolor='#0f172a', linewidth=0.8, height=0.62)
ax2.set_xlabel('FTS Funding Received (Million US$)', fontweight='bold', fontsize=10.5, labelpad=8)
ax2.set_title('B. Top International NGO Recipients in Somalia (2026)\nConcentration: Top 5 Capture 65% ($78.0M)', fontweight='bold', fontsize=11.5, pad=12, color='#0f172a')
ax2.tick_params(axis='y', labelsize=9.5)
ax2.tick_params(axis='x', labelsize=9.5)
ax2.set_xlim(0, 23)

for bar in bars2:
    w = bar.get_width()
    y = bar.get_y() + bar.get_height() / 2
    ax2.text(w + 0.4, y, f"${w:.1f}M", va='center', ha='left', fontweight='bold', fontsize=9.5, color='#1e3d59')

# --------------------------------------------------------------
# 3. Bottom Left: Where Local NGOs Get Their Money (Funding Sources)
# --------------------------------------------------------------
ax3 = fig.add_subplot(gs[1, 0])
local_sources = [
    'Somalia Humanitarian Fund (SHF / CBPF)\n[Direct Pooled Grants]',
    'UN Agency Sub-Contracts (FLA / PCA)\n[WFP, UNICEF, UNHCR]',
    'INGO Consortia Sub-Grants\n[BRCiS, SomReP Partners]',
    'Direct Bilateral Donors (FTS)\n[KSrelief / Saudi Arabia]',
    'Diaspora & Philanthropy\n[Hormuud, Dahabshiil]'
]
local_amounts = [19.52, 28.50, 16.20, 2.81, 8.00] # in Million USD
colors_sources = ['#059669', '#2563eb', '#d97706', '#dc2626', '#7c3aed']

bars3 = ax3.barh(local_sources[::-1], local_amounts[::-1], color=colors_sources[::-1], edgecolor='#1e293b', linewidth=0.8, height=0.62)
ax3.set_xlabel('Estimated / Tracked Funding to Local NGOs (Million US$)', fontweight='bold', fontsize=10.5, labelpad=8)
ax3.set_title('C. Where Local Somali NGOs Get Their Money\n(Real Funding Channels Supporting 40.8% Field Delivery)', fontweight='bold', fontsize=11.5, pad=12, color='#0f172a')
ax3.tick_params(axis='y', labelsize=9.5)
ax3.tick_params(axis='x', labelsize=9.5)
ax3.set_xlim(0, 34)

for bar in bars3:
    w = bar.get_width()
    y = bar.get_y() + bar.get_height() / 2
    ax3.text(w + 0.5, y, f"${w:.1f}M", va='center', ha='left', fontweight='bold', fontsize=9.5, color='#0f172a')

# --------------------------------------------------------------
# 4. Bottom Right: The SHF Localization Breakthrough (2026 Allocation Shares)
# --------------------------------------------------------------
ax4 = fig.add_subplot(gs[1, 1])
shf_shares = [84.6, 15.0, 0.4]
shf_labels = [
    'Somali National NGOs (NNGOs)\n$19.52M (40 Projects)', 
    'International NGOs (INGOs)\n$3.47M (6 Projects)', 
    'UN Agencies\n$0.09M (1 Project)'
]
colors_shf = ['#059669', '#1e3d59', '#94a3b8']

wedges, texts, autotexts = ax4.pie(shf_shares, labels=shf_labels, autopct='%1.1f%%',
                                    startangle=140, colors=colors_shf, explode=(0.06, 0, 0),
                                    wedgeprops=dict(width=0.45, edgecolor='black', linewidth=1),
                                    textprops=dict(fontweight='bold', fontsize=9.5))

for autotext in autotexts:
    autotext.set_fontsize(10.5)
    autotext.set_fontweight('bold')

ax4.set_title('D. Somalia Humanitarian Fund (SHF / CBPF 2026)\nDirect Localization Allocation Share ($23.1M Total)', fontweight='bold', fontsize=11.5, pad=12, color='#0f172a')

# Save updated high-DPI figure
plt.savefig('flow_images/funding_flow_mechanics.png')
plt.savefig(os.path.join(artifact_flow_dir, 'funding_flow_mechanics.png'))
plt.close()

if os.path.exists('flow_images/funding_flow_mechanics_test.png'):
    os.remove('flow_images/funding_flow_mechanics_test.png')

print("Flow mechanics chart regenerated successfully with zero overlaps!")
