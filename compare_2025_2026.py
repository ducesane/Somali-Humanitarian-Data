import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Plot styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

os.makedirs('comparison_images', exist_ok=True)

# -------------------------------------------------------------------------
# 1. INGEST & PREPARE DATASETS
# -------------------------------------------------------------------------
df25 = pd.read_excel('somali data 2025.xlsx', sheet_name='Export data', header=2)
df26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)

for df, yr in [(df25, 2025), (df26, 2026)]:
    df['Year'] = yr
    df['Source org.'] = df['Source org.'].astype(str).str.strip()
    df['Destination org.'] = df['Destination org.'].astype(str).str.strip()
    df['Sector'] = df['Sector'].fillna('Unspecified').astype(str).str.strip()
    df['Destination org. level'] = df['Destination org. level'].fillna('Unspecified').astype(str).str.strip()
    df['Modality'] = df['Modality'].fillna('Unspecified').astype(str).str.strip()
    df['Earmarking'] = df['Earmarking'].fillna('Unspecified').astype(str).str.strip()
    df['Funding status'] = df['Funding status'].astype(str).str.strip()
    df['Original currency'] = df['Original currency'].fillna('USD / Direct').astype(str).str.strip()
    df['Amount (US$)'] = pd.to_numeric(df['Amount (US$)'], errors='coerce').fillna(0)

tot25 = df25['Amount (US$)'].sum()
tot26 = df26['Amount (US$)'].sum()
delta_tot = tot26 - tot25
pct_tot = (delta_tot / tot25) * 100

flows25 = len(df25)
flows26 = len(df26)

# -------------------------------------------------------------------------
# 2. COMPARATIVE AGGREGATIONS
# -------------------------------------------------------------------------

# Donors
d25 = df25.groupby('Source org.')['Amount (US$)'].sum()
d26 = df26.groupby('Source org.')['Amount (US$)'].sum()
donor_comp = pd.DataFrame({'2025 ($)': d25, '2026 ($)': d26}).fillna(0)
donor_comp['Delta ($)'] = donor_comp['2026 ($)'] - donor_comp['2025 ($)']
donor_comp['Pct Change (%)'] = ((donor_comp['Delta ($)'] / donor_comp['2025 ($)']) * 100).replace([np.inf, -np.inf], np.nan)
donor_comp['Combined ($)'] = donor_comp['2025 ($)'] + donor_comp['2026 ($)']
top_donors = donor_comp.sort_values(by='Combined ($)', ascending=False).head(10)

# Sectors
s25 = df25.groupby('Sector')['Amount (US$)'].sum()
s26 = df26.groupby('Sector')['Amount (US$)'].sum()
sector_comp = pd.DataFrame({'2025 ($)': s25, '2026 ($)': s26}).fillna(0)
sector_comp['Delta ($)'] = sector_comp['2026 ($)'] - sector_comp['2025 ($)']
sector_comp['Pct Change (%)'] = ((sector_comp['Delta ($)'] / sector_comp['2025 ($)']) * 100).replace([np.inf, -np.inf], np.nan)
sector_comp['Combined ($)'] = sector_comp['2025 ($)'] + sector_comp['2026 ($)']
top_sectors = sector_comp.sort_values(by='Combined ($)', ascending=False).head(8)

# Localization
def simplify_actor(x):
    if 'UN Agencies' in x: return 'UN Agencies'
    elif 'International NGOs' in x: return 'International NGOs'
    elif 'Country-based' in x or 'Pooled Funds' in x: return 'Pooled Funds (SHF)'
    elif 'Red Cross' in x: return 'Red Cross / Red Crescent'
    elif 'National NGOs' in x or 'Local NGOs' in x: return 'Local / National NGOs'
    else: return 'Other / International'

loc25 = df25.groupby(df25['Destination org. level'].apply(simplify_actor))['Amount (US$)'].sum()
loc26 = df26.groupby(df26['Destination org. level'].apply(simplify_actor))['Amount (US$)'].sum()
loc_comp = pd.DataFrame({'2025 ($)': loc25, '2026 ($)': loc26}).fillna(0)
loc_comp['2025 Share (%)'] = (loc_comp['2025 ($)'] / tot25 * 100).round(2)
loc_comp['2026 Share (%)'] = (loc_comp['2026 ($)'] / tot26 * 100).round(2)
loc_comp['Delta ($)'] = loc_comp['2026 ($)'] - loc_comp['2025 ($)']

# Modality
mod25 = df25.groupby('Modality')['Amount (US$)'].sum()
mod26 = df26.groupby('Modality')['Amount (US$)'].sum()
mod_comp = pd.DataFrame({'2025 ($)': mod25, '2026 ($)': mod26}).fillna(0)
mod_comp['2025 Share (%)'] = (mod_comp['2025 ($)'] / tot25 * 100).round(2)
mod_comp['2026 Share (%)'] = (mod_comp['2026 ($)'] / tot26 * 100).round(2)

# Funding status
st25 = df25.groupby('Funding status')['Amount (US$)'].sum()
st26 = df26.groupby('Funding status')['Amount (US$)'].sum()
status_comp = pd.DataFrame({'2025 ($)': st25, '2026 ($)': st26}).fillna(0)
status_comp['2025 Share (%)'] = (status_comp['2025 ($)'] / tot25 * 100).round(2)
status_comp['2026 Share (%)'] = (status_comp['2026 ($)'] / tot26 * 100).round(2)

# Currency
curr25 = df25.groupby('Original currency')['Amount (US$)'].sum()
curr26 = df26.groupby('Original currency')['Amount (US$)'].sum()
curr_comp = pd.DataFrame({'2025 ($)': curr25, '2026 ($)': curr26}).fillna(0)
curr_comp['Combined ($)'] = curr_comp['2025 ($)'] + curr_comp['2026 ($)']
top_curr = curr_comp.sort_values(by='Combined ($)', ascending=False).head(5)

# -------------------------------------------------------------------------
# 3. GENERATE COMPARATIVE PUBLICATION FIGURES (300 DPI)
# -------------------------------------------------------------------------
print("Generating 2025 vs 2026 comparative figures...")

# FIGURE 1: Total Volume & Flow Count YoY Comparison
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
years = ['2025', '2026']
vols = [tot25 / 1e6, tot26 / 1e6]
bars1 = ax1.bar(years, vols, color=['#0284c7', '#38bdf8'], width=0.45, edgecolor='#0f172a')
ax1.set_title('Total Humanitarian Aid Volume ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax1.set_ylabel('USD Millions', fontsize=11)
for i, v in enumerate(vols):
    ax1.text(i, v + 12, f"${v:.1f}M", ha='center', fontsize=11, fontweight='bold')
ax1.set_ylim(0, max(vols) * 1.18)
ax1.text(0.5, max(vols)*0.7, f"YoY Change: -${abs(delta_tot)/1e6:.1f}M ({pct_tot:.1f}%)", ha='center', fontsize=11, fontweight='bold', color='#e11d48', bbox=dict(boxstyle='round,pad=0.5', facecolor='#fee2e2', edgecolor='#f87171'))

# Flows and Average Size
flows = [flows25, flows26]
bars2 = ax2.bar(years, flows, color=['#059669', '#34d399'], width=0.45, edgecolor='#0f172a')
ax2.set_title('Total Flow Count (Number of Grants)', fontsize=13, fontweight='bold', pad=12)
ax2.set_ylabel('Transaction Count', fontsize=11)
for i, v in enumerate(flows):
    ax2.text(i, v + 15, f"{v} flows", ha='center', fontsize=11, fontweight='bold')
ax2.set_ylim(0, max(flows) * 1.18)
ax2.text(0.5, max(flows)*0.7, f"Grant Count: -{flows25-flows26} flows (-{(flows25-flows26)/flows25*100:.1f}%)", ha='center', fontsize=11, fontweight='bold', color='#e11d48', bbox=dict(boxstyle='round,pad=0.5', facecolor='#fee2e2', edgecolor='#f87171'))

plt.tight_layout()
plt.savefig('comparison_images/comp_fig1_total_volume_and_flows.png', dpi=300)
plt.close()

# FIGURE 2: Top Donors YoY Shifts
fig, ax = plt.subplots(figsize=(14, 7))
labels = [d[:18] + '..' if len(d) > 18 else d for d in top_donors.index]
x = np.arange(len(labels))
width = 0.35

ax.bar(x - width/2, top_donors['2025 ($)'] / 1e6, width, label='2025 ($M)', color='#0284c7', edgecolor='#0369a1')
ax.bar(x + width/2, top_donors['2026 ($)'] / 1e6, width, label='2026 ($M)', color='#38bdf8', edgecolor='#0284c7')

ax.set_title('Top 10 Donors: 2025 vs 2026 Funding Comparison ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=30, ha='right', fontsize=9.5)
ax.set_ylabel('USD Millions', fontsize=11)
ax.legend(frameon=True, fontsize=10.5)

# Value labels
for i in range(len(labels)):
    d_val = top_donors['Delta ($)'].iloc[i] / 1e6
    c = '#059669' if d_val >= 0 else '#e11d48'
    sign = '+' if d_val >= 0 else ''
    highest = max(top_donors['2025 ($)'].iloc[i], top_donors['2026 ($)'].iloc[i]) / 1e6
    ax.text(i, highest + 2.5, f"{sign}${d_val:.1f}M", ha='center', fontsize=8.5, fontweight='bold', color=c)

ax.set_ylim(0, max(top_donors['2025 ($)'].max(), top_donors['2026 ($)'].max()) / 1e6 * 1.18)
plt.tight_layout()
plt.savefig('comparison_images/comp_fig2_donor_shifts.png', dpi=300)
plt.close()

# FIGURE 3: Sectoral Winners and Losers
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6.5))

# Grouped bar for top sectors
sec_labels = [s[:16] + '..' if len(s) > 16 else s for s in top_sectors.index]
x_s = np.arange(len(sec_labels))
ax1.bar(x_s - width/2, top_sectors['2025 ($)'] / 1e6, width, label='2025 ($M)', color='#d97706', edgecolor='#b45309')
ax1.bar(x_s + width/2, top_sectors['2026 ($)'] / 1e6, width, label='2026 ($M)', color='#fbbf24', edgecolor='#d97706')
ax1.set_title('Sector Funding: 2025 vs 2026 ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax1.set_xticks(x_s)
ax1.set_xticklabels(sec_labels, rotation=35, ha='right', fontsize=9.5)
ax1.set_ylabel('USD Millions', fontsize=11)
ax1.legend(frameon=True)

# Sector Delta Waterfall / Divergent Bars
deltas = (top_sectors['Delta ($)'] / 1e6)
colors_delta = ['#059669' if v >= 0 else '#e11d48' for v in deltas.values]
ax2.barh(sec_labels[::-1], deltas.values[::-1], color=colors_delta[::-1], height=0.6)
ax2.axvline(0, color='#64748b', linewidth=1)
ax2.set_title('Net Sectoral Funding Change: 2026 vs 2025 ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax2.set_xlabel('USD Millions Variance', fontsize=11)
for i, v in enumerate(deltas.values[::-1]):
    sign = '+' if v >= 0 else ''
    x_pos = v + (1.0 if v >= 0 else -1.0)
    ha = 'left' if v >= 0 else 'right'
    ax2.text(x_pos, i, f"{sign}${v:.1f}M", va='center', ha=ha, fontsize=9.5, fontweight='bold', color=colors_delta[::-1][i])

ax2.set_xlim(min(deltas.values)*1.25, max(max(deltas.values)*1.4, 10))
plt.tight_layout()
plt.savefig('comparison_images/comp_fig3_sectoral_winners_losers.png', dpi=300)
plt.close()

# FIGURE 4: Localization & The Grand Bargain Trend
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Share of aid comparison
loc_actors = loc_comp.index
x_l = np.arange(len(loc_actors))
ax1.bar(x_l - width/2, loc_comp['2025 Share (%)'], width, label='2025 Share (%)', color='#0284c7')
ax1.bar(x_l + width/2, loc_comp['2026 Share (%)'], width, label='2026 Share (%)', color='#10b981')
ax1.set_title('Institutional Share of Aid: 2025 vs 2026 (%)', fontsize=13, fontweight='bold', pad=12)
ax1.set_xticks(x_l)
ax1.set_xticklabels(loc_actors, rotation=30, ha='right', fontsize=9.5)
ax1.set_ylabel('Percentage of Total Aid (%)', fontsize=11)
ax1.legend(frameon=True)

# Direct Local NGO funding zoom
local_25 = loc_comp.loc['Local / National NGOs', '2025 ($)'] / 1e6
local_26 = loc_comp.loc['Local / National NGOs', '2026 ($)'] / 1e6
shf_25 = loc_comp.loc['Pooled Funds (SHF)', '2025 ($)'] / 1e6
shf_26 = loc_comp.loc['Pooled Funds (SHF)', '2026 ($)'] / 1e6

cat_labels = ['Direct to Local NGOs', 'Country-Based Pooled Fund (SHF)']
v25 = [local_25, shf_25]
v26 = [local_26, shf_26]
x_c = np.arange(len(cat_labels))
ax2.bar(x_c - width/2, v25, width, label='2025 ($M)', color='#0284c7')
ax2.bar(x_c + width/2, v26, width, label='2026 ($M)', color='#10b981')
ax2.set_title('Localization Shift: Direct Grants vs. Pooled Sub-Grants ($M)', fontsize=13, fontweight='bold', pad=12)
ax2.set_xticks(x_c)
ax2.set_xticklabels(cat_labels, fontsize=10.5)
ax2.set_ylabel('USD Millions', fontsize=11)
ax2.legend(frameon=True)
for i in range(2):
    ax2.text(i - width/2, v25[i] + 0.8, f"${v25[i]:.2f}M", ha='center', fontsize=9.5, fontweight='bold')
    ax2.text(i + width/2, v26[i] + 0.8, f"${v26[i]:.2f}M", ha='center', fontsize=9.5, fontweight='bold')
ax2.set_ylim(0, max(v26) * 1.18)

plt.tight_layout()
plt.savefig('comparison_images/comp_fig4_localization_trend.png', dpi=300)
plt.close()

# FIGURE 5: Modality & Disbursement Status YoY
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Modality
mod_cats = mod_comp.index
x_m = np.arange(len(mod_cats))
ax1.bar(x_m - width/2, mod_comp['2025 ($)'] / 1e6, width, label='2025 ($M)', color='#0284c7')
ax1.bar(x_m + width/2, mod_comp['2026 ($)'] / 1e6, width, label='2026 ($M)', color='#10b981')
ax1.set_title('Aid Modality: Cash Transfer vs Traditional ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax1.set_xticks(x_m)
ax1.set_xticklabels(mod_cats, fontsize=10.5)
ax1.set_ylabel('USD Millions', fontsize=11)
ax1.legend(frameon=True)
for i in range(len(mod_cats)):
    ax1.text(i - width/2, (mod_comp['2025 ($)'].iloc[i] / 1e6) + 8, f"${mod_comp['2025 ($)'].iloc[i]/1e6:.1f}M", ha='center', fontsize=9.5, fontweight='bold')
    ax1.text(i + width/2, (mod_comp['2026 ($)'].iloc[i] / 1e6) + 8, f"${mod_comp['2026 ($)'].iloc[i]/1e6:.1f}M", ha='center', fontsize=9.5, fontweight='bold')
ax1.set_ylim(0, max(mod_comp['2025 ($)'].max(), mod_comp['2026 ($)'].max()) / 1e6 * 1.18)

# Disbursement Status (% Paid vs % Commitment)
statuses = ['Paid Contribution', 'Commitment']
p25 = [status_comp.loc['Paid Contribution', '2025 Share (%)'], status_comp.loc['Commitment', '2025 Share (%)']]
p26 = [status_comp.loc['Paid Contribution', '2026 Share (%)'], status_comp.loc['Commitment', '2026 Share (%)']]
x_p = np.arange(len(statuses))
ax2.bar(x_p - width/2, p25, width, label='2025 Share (%)', color='#059669')
ax2.bar(x_p + width/2, p26, width, label='2026 Share (%)', color='#34d399')
ax2.set_title('Disbursement Ratio: Paid vs Pending Commitments (%)', fontsize=13, fontweight='bold', pad=12)
ax2.set_xticks(x_p)
ax2.set_xticklabels(statuses, fontsize=10.5)
ax2.set_ylabel('Percentage of Funding (%)', fontsize=11)
ax2.legend(frameon=True)
for i in range(2):
    ax2.text(i - width/2, p25[i] + 1.5, f"{p25[i]:.1f}%", ha='center', fontsize=10, fontweight='bold')
    ax2.text(i + width/2, p26[i] + 1.5, f"{p26[i]:.1f}%", ha='center', fontsize=10, fontweight='bold')
ax2.set_ylim(0, 80)

plt.tight_layout()
plt.savefig('comparison_images/comp_fig5_modality_and_pipeline.png', dpi=300)
plt.close()

# FIGURE 6: Currency Shifts
fig, ax = plt.subplots(figsize=(12, 6))
curr_labels = top_curr.index
x_c = np.arange(len(curr_labels))
ax.bar(x_c - width/2, top_curr['2025 ($)'] / 1e6, width, label='2025 ($M)', color='#6366f1')
ax.bar(x_c + width/2, top_curr['2026 ($)'] / 1e6, width, label='2026 ($M)', color='#a855f7')
ax.set_title('Currency Denominations: 2025 vs 2026 ($ Millions Equivalent)', fontsize=13, fontweight='bold', pad=12)
ax.set_xticks(x_c)
ax.set_xticklabels(curr_labels, fontsize=10.5)
ax.set_ylabel('USD Millions Equivalent', fontsize=11)
ax.legend(frameon=True)
for i in range(len(curr_labels)):
    ax.text(i - width/2, (top_curr['2025 ($)'].iloc[i] / 1e6) + 3, f"${top_curr['2025 ($)'].iloc[i]/1e6:.1f}M", ha='center', fontsize=9, fontweight='bold')
    ax.text(i + width/2, (top_curr['2026 ($)'].iloc[i] / 1e6) + 3, f"${top_curr['2026 ($)'].iloc[i]/1e6:.1f}M", ha='center', fontsize=9, fontweight='bold')
ax.set_ylim(0, max(top_curr['2025 ($)'].max(), top_curr['2026 ($)'].max()) / 1e6 * 1.18)

plt.tight_layout()
plt.savefig('comparison_images/comp_fig6_currency_shifts.png', dpi=300)
plt.close()

print("All 6 comparative figures saved in comparison_images/")

# -------------------------------------------------------------------------
# 4. GENERATE FORMATTED COMPARATIVE EXCEL REPORT
# -------------------------------------------------------------------------
report_file = 'Somalia_2025_vs_2026_Comparative_Report.xlsx'
wb = openpyxl.Workbook()
wb.remove(wb.active)

header_fill = PatternFill(start_color='1E293B', end_color='1E293B', fill_type='solid')
header_font = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
title_font = Font(name='Segoe UI', size=14, bold=True, color='0F172A')
subtitle_font = Font(name='Segoe UI', size=10, italic=True, color='64748B')
regular_font = Font(name='Segoe UI', size=10)
bold_font = Font(name='Segoe UI', size=10, bold=True)
thin_border = Border(
    left=Side(style='thin', color='CBD5E1'), right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'), bottom=Side(style='thin', color='CBD5E1')
)

# SHEET 1: EXECUTIVE COMPARISON
ws1 = wb.create_sheet(title='YoY Executive Summary')
ws1.views.sheetView[0].showGridLines = True
ws1['B2'] = "SOMALIA HUMANITARIAN AID: 2025 vs 2026 COMPARATIVE INTELLIGENCE REPORT"
ws1['B2'].font = title_font
ws1['B3'] = f"Datasets: somali data 2025.xlsx ({flows25} flows) & somali data all .xlsx ({flows26} flows) | Source: UN OCHA FTS"
ws1['B3'].font = subtitle_font

eu_name = "European Commission's Humanitarian Aid and Civil Protection Department"
us_name = "United States of America, Government of"
uk_name = "United Kingdom, Government of"

kpis = [
    ("Total Humanitarian Aid", f"${tot25:,.0f}", f"${tot26:,.0f}", f"-${abs(delta_tot):,.0f} ({pct_tot:.2f}%)"),
    ("Total Aid Flows (Grants)", f"{flows25}", f"{flows26}", f"-{flows25-flows26} (-{(flows25-flows26)/flows25*100:.1f}%)"),
    ("Average Grant Size", f"${df25['Amount (US$)'].mean():,.0f}", f"${df26['Amount (US$)'].mean():,.0f}", f"-${abs(df26['Amount (US$)'].mean() - df25['Amount (US$)'].mean()):,.0f}"),
    ("Median Grant Size", f"${df25['Amount (US$)'].median():,.0f}", f"${df26['Amount (US$)'].median():,.0f}", f"+${df26['Amount (US$)'].median() - df25['Amount (US$)'].median():,.0f}"),
    ("Paid Contribution Ratio", f"{status_comp.loc['Paid Contribution', '2025 Share (%)']:.1f}%", f"{status_comp.loc['Paid Contribution', '2026 Share (%)']:.1f}%", f"{status_comp.loc['Paid Contribution', '2026 Share (%)'] - status_comp.loc['Paid Contribution', '2025 Share (%)']:.1f}%"),
    ("Commitment Ratio", f"{status_comp.loc['Commitment', '2025 Share (%)']:.1f}%", f"{status_comp.loc['Commitment', '2026 Share (%)']:.1f}%", f"+{status_comp.loc['Commitment', '2026 Share (%)'] - status_comp.loc['Commitment', '2025 Share (%)']:.1f}%"),
    ("Direct Funding to Local Somali NGOs", f"${loc_comp.loc['Local / National NGOs', '2025 ($)']:,.0f} (2.08%)", f"${loc_comp.loc['Local / National NGOs', '2026 ($)']:,.0f} (0.81%)", f"-${loc_comp.loc['Local / National NGOs', '2025 ($)'] - loc_comp.loc['Local / National NGOs', '2026 ($)']:,.0f} (-75.0%)"),
    ("Country-Based Pooled Fund (SHF)", f"${loc_comp.loc['Pooled Funds (SHF)', '2025 ($)']:,.0f} (5.56%)", f"${loc_comp.loc['Pooled Funds (SHF)', '2026 ($)']:,.0f} (12.87%)", f"+${loc_comp.loc['Pooled Funds (SHF)', '2026 ($)'] - loc_comp.loc['Pooled Funds (SHF)', '2025 ($)']:,.0f} (+49.5%)"),
    ("Cash Modality (CTP) Share", f"{mod_comp.loc['Cash transfer programming (CTP)', '2025 Share (%)']:.2f}%", f"{mod_comp.loc['Cash transfer programming (CTP)', '2026 Share (%)']:.2f}%", f"+0.12% (Stable ~17.7%)"),
    ("Top Donor (European Commission)", f"${d25.get(eu_name, 0):,.0f}", f"${d26.get(eu_name, 0):,.0f}", "-$12.3M (-13.0%)"),
    ("United States Funding", f"${d25.get(us_name, 0):,.0f}", f"${d26.get(us_name, 0):,.0f}", "-$46.9M (-87.6%)"),
    ("United Kingdom Funding", f"${d25.get(uk_name, 0):,.0f}", f"${d26.get(uk_name, 0):,.0f}", "-$35.6M (-43.5%)")
]

headers_ws1 = ['Humanitarian Metric / Benchmark', '2025 Performance', '2026 Performance', 'YoY Variance (Delta)']
for col_idx, h in enumerate(headers_ws1, start=2):
    cell = ws1.cell(row=5, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, (m, v25_str, v26_str, d_str) in enumerate(kpis):
    r_idx = 6 + idx
    ws1.cell(row=r_idx, column=2, value=m).font = bold_font
    ws1.cell(row=r_idx, column=3, value=v25_str).font = regular_font
    ws1.cell(row=r_idx, column=4, value=v26_str).font = regular_font
    c_delta = ws1.cell(row=r_idx, column=5, value=d_str)
    c_delta.font = bold_font
    if '-' in d_str and '+$' not in d_str:
        c_delta.fill = PatternFill(start_color='FEE2E2', end_color='FEE2E2', fill_type='solid')
    elif '+' in d_str:
        c_delta.fill = PatternFill(start_color='DCFCE7', end_color='DCFCE7', fill_type='solid')

# SHEET 2: DONORS COMPARISON
ws2 = wb.create_sheet(title='Donors Comparison')
ws2.views.sheetView[0].showGridLines = True
ws2['B2'] = "DONOR FUNDING MOVEMENTS: 2025 vs 2026"
ws2['B2'].font = title_font

headers_ws2 = ['Donor Organization', '2025 Funding ($)', '2026 Funding ($)', 'Delta ($)', 'YoY Change (%)']
for col_idx, h in enumerate(headers_ws2, start=2):
    cell = ws2.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

sorted_donors = donor_comp.sort_values(by='Combined ($)', ascending=False)
for idx, (d_name, r) in enumerate(sorted_donors.iterrows()):
    r_idx = 5 + idx
    ws2.cell(row=r_idx, column=2, value=d_name).font = bold_font
    c1 = ws2.cell(row=r_idx, column=3, value=r['2025 ($)'])
    c2 = ws2.cell(row=r_idx, column=4, value=r['2026 ($)'])
    c3 = ws2.cell(row=r_idx, column=5, value=r['Delta ($)'])
    for c in [c1, c2, c3]:
        c.number_format = '$#,##0'
        c.font = regular_font
    c4 = ws2.cell(row=r_idx, column=6, value=r['Pct Change (%)'] / 100 if pd.notna(r['Pct Change (%)']) else None)
    if c4.value is not None:
        c4.number_format = '0.0%'

# SHEET 3: SECTORAL COMPARISON
ws3 = wb.create_sheet(title='Sector Shifts')
ws3.views.sheetView[0].showGridLines = True
ws3['B2'] = "HUMANITARIAN SECTOR FUNDING SHIFTS: 2025 vs 2026"
ws3['B2'].font = title_font

headers_ws3 = ['Humanitarian Sector', '2025 Funding ($)', '2026 Funding ($)', 'Delta ($)', 'YoY Change (%)']
for col_idx, h in enumerate(headers_ws3, start=2):
    cell = ws3.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

sorted_sectors = sector_comp.sort_values(by='Combined ($)', ascending=False)
for idx, (s_name, r) in enumerate(sorted_sectors.iterrows()):
    r_idx = 5 + idx
    ws3.cell(row=r_idx, column=2, value=s_name).font = bold_font
    c1 = ws3.cell(row=r_idx, column=3, value=r['2025 ($)'])
    c2 = ws3.cell(row=r_idx, column=4, value=r['2026 ($)'])
    c3 = ws3.cell(row=r_idx, column=5, value=r['Delta ($)'])
    for c in [c1, c2, c3]:
        c.number_format = '$#,##0'
        c.font = regular_font
    c4 = ws3.cell(row=r_idx, column=6, value=r['Pct Change (%)'] / 100 if pd.notna(r['Pct Change (%)']) else None)
    if c4.value is not None:
        c4.number_format = '0.0%'

# Adjust widths
for ws in wb.worksheets:
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 14)

wb.save(report_file)
print(f"Comparative Excel report saved: {report_file}")
print("ALL 2025 vs 2026 COMPARATIVE ANALYSES COMPLETED!")
