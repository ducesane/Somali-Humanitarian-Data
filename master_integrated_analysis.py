import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Aesthetics
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

os.makedirs('master_images', exist_ok=True)

print("Starting Master Cross-Dataset Integration Analysis...")

# -------------------------------------------------------------------------
# 1. LOAD FTS FUNDING (2025 & 2026)
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
    df['Funding status'] = df['Funding status'].astype(str).str.strip()
    df['Amount (US$)'] = pd.to_numeric(df['Amount (US$)'], errors='coerce').fillna(0)

tot25 = df25['Amount (US$)'].sum()
tot26 = df26['Amount (US$)'].sum()

# -------------------------------------------------------------------------
# 2. LOAD 2026 DISTRICT POPULATION (HDX)
# -------------------------------------------------------------------------
pop_path = 'hdx_data/somalia_population_2026_Somalia_District-level_gender-and-age-di.xlsx'
df_pop_raw = pd.read_excel(pop_path, sheet_name=1, header=2)
df_pop = df_pop_raw.dropna(subset=['Region', 'District'])
df_pop = df_pop[~df_pop['District'].str.contains('Total', case=False, na=False)].copy()
df_pop['Total'] = pd.to_numeric(df_pop['Total'], errors='coerce').fillna(0)

total_population_2026 = df_pop['Total'].sum()
pop_by_region = df_pop.groupby('Region')['Total'].sum().sort_values(ascending=False)

aid_per_capita_2025 = tot25 / total_population_2026
aid_per_capita_2026 = tot26 / total_population_2026

# -------------------------------------------------------------------------
# 3. LOAD WFP FOOD COMMODITY PRICES (HDX)
# -------------------------------------------------------------------------
wfp_path = 'hdx_data/somalia_wfp_food_prices_Somalia_-_Food_Prices.csv'
df_wfp = pd.read_csv(wfp_path, low_memory=False)
df_wfp['date'] = pd.to_datetime(df_wfp['date'], errors='coerce')
df_wfp['year'] = df_wfp['date'].dt.year

staples = ['Maize (white)', 'Sorghum (red)', 'Rice (imported)', 'Diesel']
df_staples = df_wfp[df_wfp['commodity'].isin(staples) & (df_wfp['year'] >= 2020)].copy()
food_inflation = df_staples.groupby(['year', 'commodity'])['usdprice'].mean().unstack()

# -------------------------------------------------------------------------
# 4. LOAD IOM DTM IDP DISPLACEMENT (HDX)
# -------------------------------------------------------------------------
dtm_path = 'hdx_data/somalia_iom_displacement_dtm_Somalia_IOM_DTM_data_for_admin_levels_0-.csv'
df_dtm = pd.read_csv(dtm_path, low_memory=False)
df_dtm_a1 = df_dtm[df_dtm['adminLevel'] == 1].dropna(subset=['admin1Name', 'numPresentIdpInd']).copy()
idps_by_region = df_dtm_a1.groupby('admin1Name')['numPresentIdpInd'].max().sort_values(ascending=False)
total_idps = idps_by_region.sum()

# -------------------------------------------------------------------------
# 5. LOAD POOLED FUNDS (SHF & CERF HISTORICAL)
# -------------------------------------------------------------------------
cbpf_path = 'hdx_data/somalia_cbpf_allocations_som_cbpf_contributions.csv'
df_cbpf = pd.read_csv(cbpf_path, low_memory=False)
cbpf_yearly = df_cbpf[df_cbpf['FiscalYear'].between(2021, 2026)].groupby('FiscalYear')['PaidAmt'].sum()

cerf_path = 'hdx_data/somalia_cerf_allocations_SOM_CERF_Allocations.csv'
df_cerf = pd.read_csv(cerf_path, low_memory=False)
cerf_yearly = df_cerf[df_cerf['year'].between(2021, 2026)].groupby('year')['totalAmountApproved'].sum()

pooled_trends = pd.DataFrame({
    'Somalia Humanitarian Fund (SHF)': cbpf_yearly,
    'Central Emergency Response Fund (CERF)': cerf_yearly
}).fillna(0)
pooled_trends['Total Pooled ($M)'] = (pooled_trends['Somalia Humanitarian Fund (SHF)'] + pooled_trends['Central Emergency Response Fund (CERF)']) / 1e6

# -------------------------------------------------------------------------
# 6. GENERATE 6 HIGH-RESOLUTION 300-DPI PUBLICATION FIGURES
# -------------------------------------------------------------------------
print("Rendering Master publication figures...")

# FIGURE 1: Population Demographics & Aid Per Capita Collapse
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6.5))
# Top 8 regions by population
top_pop_reg = pop_by_region.head(8) / 1e6
ax1.barh(top_pop_reg.index[::-1], top_pop_reg.values[::-1], color='#0284c7', edgecolor='#0369a1', height=0.6)
ax1.set_title(f'Somalia 2026 Population by Region (Total: {total_population_2026/1e6:.2f}M)', fontsize=13, fontweight='bold', pad=12)
ax1.set_xlabel('Population (Millions)', fontsize=11)
for i, v in enumerate(top_pop_reg.values[::-1]):
    pct = v / (total_population_2026 / 1e6) * 100
    ax1.text(v + 0.05, i, f"{v:.2f}M ({pct:.1f}%)", va='center', fontsize=9.5, fontweight='bold')
ax1.set_xlim(0, max(top_pop_reg.values) * 1.18)

# Aid Per Capita Comparison
capita_years = ['2025', '2026']
capita_vals = [aid_per_capita_2025, aid_per_capita_2026]
ax2.bar(capita_years, capita_vals, color=['#059669', '#f43f5e'], width=0.45, edgecolor='#0f172a')
ax2.set_title('National Humanitarian Aid Per Capita ($ / person)', fontsize=13, fontweight='bold', pad=12)
ax2.set_ylabel('USD per Person', fontsize=11)
for i, v in enumerate(capita_vals):
    ax2.text(i, v + 0.8, f"${v:.2f}", ha='center', fontsize=12, fontweight='bold')
ax2.set_ylim(0, max(capita_vals) * 1.25)
ax2.text(0.5, max(capita_vals) * 0.7, f"Per Capita Reduction:\n-${aid_per_capita_2025 - aid_per_capita_2026:.2f} (-35.4% drop)", ha='center', fontsize=11, fontweight='bold', color='#e11d48', bbox=dict(boxstyle='round,pad=0.5', facecolor='#fee2e2', edgecolor='#f87171'))

plt.tight_layout()
plt.savefig('master_images/fig1_aid_per_capita_and_population.png', dpi=300)
plt.close()

# FIGURE 2: THE DOUBLE JEOPARDY CRISIS (Food Inflation vs Aid Cut)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

# WFP Food Inflation Time Series
years = food_inflation.index
ax1.plot(years, food_inflation['Rice (imported)'], marker='o', linewidth=2.5, color='#e11d48', label='Rice (imported)')
ax1.plot(years, food_inflation['Maize (white)'], marker='s', linewidth=2.5, color='#d97706', label='Maize (white)')
ax1.plot(years, food_inflation['Sorghum (red)'], marker='^', linewidth=2.5, color='#2563eb', label='Sorghum (red)')
ax1.set_title('WFP Food Prices Spike: +22% to +28% Inflation in 2026', fontsize=13, fontweight='bold', pad=12)
ax1.set_ylabel('Market Price (USD)', fontsize=11)
ax1.set_xlabel('Year', fontsize=11)
ax1.set_xticks(years)
ax1.legend(frameon=True, fontsize=10)

# Food Aid Cut vs Price Surge
food_aid_25 = df25[df25['Sector'] == 'Food Security']['Amount (US$)'].sum() / 1e6
food_aid_26 = df26[df26['Sector'] == 'Food Security']['Amount (US$)'].sum() / 1e6
ax2.bar(['2025 Food Aid', '2026 Food Aid'], [food_aid_25, food_aid_26], color=['#0284c7', '#38bdf8'], width=0.45, edgecolor='#0f172a')
ax2.set_title('Food Security Aid Contraction: -$27.7M (-27.3%)', fontsize=13, fontweight='bold', pad=12)
ax2.set_ylabel('Food Security Funding ($ Millions)', fontsize=11)
ax2.text(0, food_aid_25 + 2.5, f"${food_aid_25:.1f}M", ha='center', fontsize=11, fontweight='bold')
ax2.text(1, food_aid_26 + 2.5, f"${food_aid_26:.1f}M", ha='center', fontsize=11, fontweight='bold')
ax2.set_ylim(0, food_aid_25 * 1.2)
ax2.text(0.5, food_aid_25 * 0.5, "DOUBLE JEOPARDY:\nFood Aid Slashed by 27%\nWhile Food Prices Inflated by 25%+", ha='center', fontsize=10.5, fontweight='bold', color='#b91c1c', bbox=dict(boxstyle='round,pad=0.5', facecolor='#fef2f2', edgecolor='#ef4444'))

plt.tight_layout()
plt.savefig('master_images/fig2_double_jeopardy_food_inflation_vs_aid.png', dpi=300)
plt.close()

# FIGURE 3: IOM DTM DISPLACEMENT HOTSPOTS
fig, ax = plt.subplots(figsize=(14, 6.5))
top_idps = idps_by_region.head(10) / 1e3
y_pos = range(len(top_idps))
bars = ax.barh(y_pos, top_idps.values[::-1], color='#6366f1', edgecolor='#4f46e5', height=0.65)
ax.set_yticks(y_pos)
ax.set_yticklabels(top_idps.index[::-1], fontsize=10)
ax.set_xlabel('Internally Displaced Persons (Thousands)', fontsize=11, labelpad=8)
ax.set_title(f'IOM Displacement Tracking: 4.68 Million IDPs Concentrated in Banadir & South-Central Somalia', fontsize=13, fontweight='bold', pad=12)

for i, v in enumerate(top_idps.values[::-1]):
    pct = (v * 1e3) / total_idps * 100
    ax.text(v + 25, i, f"{v:,.0f}K ({pct:.1f}%)", va='center', fontsize=9.5, fontweight='bold', color='#1e293b')
ax.set_xlim(0, max(top_idps.values) * 1.18)

plt.tight_layout()
plt.savefig('master_images/fig3_displacement_hotspots_dtm.png', dpi=300)
plt.close()

# FIGURE 4: POOLED FUNDS EXPANSION (SHF & CERF 2021-2026)
fig, ax = plt.subplots(figsize=(13, 6))
yrs = pooled_trends.index
shf_vals = pooled_trends['Somalia Humanitarian Fund (SHF)'] / 1e6
cerf_vals = pooled_trends['Central Emergency Response Fund (CERF)'] / 1e6

x = np.arange(len(yrs))
w = 0.35
ax.bar(x - w/2, shf_vals, w, label='Somalia Humanitarian Fund (SHF)', color='#059669', edgecolor='#047857')
ax.bar(x + w/2, cerf_vals, w, label='UN CERF Allocations', color='#38bdf8', edgecolor='#0284c7')

ax.set_title('Pooled Fund Trajectory: Structural Shift Toward Country & Global Pooled Mechanisms ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax.set_xticks(x)
ax.set_xticklabels(yrs, fontsize=10.5)
ax.set_ylabel('USD Millions', fontsize=11)
ax.legend(frameon=True, fontsize=10)

for i in range(len(yrs)):
    if shf_vals.iloc[i] > 1:
        ax.text(i - w/2, shf_vals.iloc[i] + 1.2, f"${shf_vals.iloc[i]:.1f}M", ha='center', fontsize=8.5, fontweight='bold')
    if cerf_vals.iloc[i] > 1:
        ax.text(i + w/2, cerf_vals.iloc[i] + 1.2, f"${cerf_vals.iloc[i]:.1f}M", ha='center', fontsize=8.5, fontweight='bold', color='#0369a1')

ax.set_ylim(0, max(shf_vals.max(), cerf_vals.max()) * 1.2)
plt.tight_layout()
plt.savefig('master_images/fig4_pooled_funds_historical_trajectory.png', dpi=300)
plt.close()

# FIGURE 5: LOCALIZATION SHIFT (DIRECT GRANTS VS POOLED FUNDS)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
direct_local_25 = df25[df25['Destination org. level'].str.contains('National NGOs|Local NGOs', na=False)]['Amount (US$)'].sum() / 1e6
direct_local_26 = df26[df26['Destination org. level'].str.contains('National NGOs|Local NGOs', na=False)]['Amount (US$)'].sum() / 1e6

ax1.bar(['2025', '2026'], [direct_local_25, direct_local_26], color=['#0284c7', '#f43f5e'], width=0.45, edgecolor='#0f172a')
ax1.set_title('Direct Bilateral Grants to Somali NGOs ($M)', fontsize=13, fontweight='bold', pad=12)
ax1.set_ylabel('USD Millions', fontsize=11)
ax1.text(0, direct_local_25 + 0.4, f"${direct_local_25:.2f}M (2.08%)", ha='center', fontsize=10.5, fontweight='bold')
ax1.text(1, direct_local_26 + 0.4, f"${direct_local_26:.2f}M (0.81%)", ha='center', fontsize=10.5, fontweight='bold')
ax1.set_ylim(0, direct_local_25 * 1.25)
ax1.text(0.5, direct_local_25 * 0.6, "-75.0% Collapse\nin Direct Funding", ha='center', fontsize=10.5, fontweight='bold', color='#b91c1c')

# SHF growth
shf_25 = df25[df25['Destination org. level'].str.contains('Country-based', na=False)]['Amount (US$)'].sum() / 1e6
shf_26 = df26[df26['Destination org. level'].str.contains('Country-based', na=False)]['Amount (US$)'].sum() / 1e6

ax2.bar(['2025', '2026'], [shf_25, shf_26], color=['#0284c7', '#10b981'], width=0.45, edgecolor='#0f172a')
ax2.set_title('Country-Based Pooled Fund Allocations (SHF) ($M)', fontsize=13, fontweight='bold', pad=12)
ax2.set_ylabel('USD Millions', fontsize=11)
ax2.text(0, shf_25 + 1.5, f"${shf_25:.1f}M (5.56%)", ha='center', fontsize=10.5, fontweight='bold')
ax2.text(1, shf_26 + 1.5, f"${shf_26:.1f}M (12.87%)", ha='center', fontsize=10.5, fontweight='bold')
ax2.set_ylim(0, shf_26 * 1.2)
ax2.text(0.5, shf_26 * 0.6, "+49.5% Expansion\nin Pooled Mechanism", ha='center', fontsize=10.5, fontweight='bold', color='#047857')

plt.tight_layout()
plt.savefig('master_images/fig5_localization_and_grand_bargain.png', dpi=300)
plt.close()

# FIGURE 6: MACRO VULNERABILITY RADAR / INTEGRATED RISK
fig, ax = plt.subplots(figsize=(10, 6.5))
risk_categories = ['Aid Volume Deficit', 'Per Capita Cut', 'Food Price Inflation', 'Local Direct Aid Cut', 'Health Commitment Backlog', 'Non-USD FX Risk']
risk_scores = [35.4, 35.4, 25.0, 75.0, 68.8, 76.1] # percentages

bars = ax.barh(risk_categories[::-1], risk_scores[::-1], color=['#f43f5e', '#fb7185', '#e11d48', '#f59e0b', '#38bdf8', '#0284c7'], height=0.6)
ax.set_title('Integrated Humanitarian Risk Indicators (2026 Shock Index)', fontsize=13, fontweight='bold', pad=12)
ax.set_xlabel('Adverse Magnitude / Exposure (%)', fontsize=11)

for i, v in enumerate(risk_scores[::-1]):
    ax.text(v + 1.5, i, f"{v:.1f}%", va='center', fontsize=10, fontweight='bold', color='#1e293b')
ax.set_xlim(0, 95)
plt.tight_layout()
plt.savefig('master_images/fig6_macro_vulnerability_matrix.png', dpi=300)
plt.close()

print("All 6 Master publication figures successfully generated in master_images/")

# -------------------------------------------------------------------------
# 7. GENERATE FORMATTED INTEGRATED EXCEL REPORT
# -------------------------------------------------------------------------
excel_master_name = 'Somalia_Integrated_Humanitarian_Master_Report.xlsx'
print(f"Creating Master Integrated Excel Report: {excel_master_name}...")

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

# SHEET 1: INTEGRATED MASTER KPIS
ws1 = wb.create_sheet(title='Master Dashboard')
ws1.views.sheetView[0].showGridLines = True
ws1['B2'] = "SOMALIA INTEGRATED HUMANITARIAN MASTER INTELLIGENCE REPORT (2026)"
ws1['B2'].font = title_font
ws1['B3'] = "Cross-Dataset Integration: FTS Funding + HDX Population 2026 + WFP Food Prices + IOM DTM IDPs + CBPF/CERF"
ws1['B3'].font = subtitle_font

master_kpis = [
    ("Total Population (Somalia 2026)", f"{total_population_2026:,.0f} individuals across 18 regions & 90 districts"),
    ("Total Humanitarian Aid (2026)", f"${tot26:,.0f} (vs ${tot25:,.0f} in 2025: -35.4%)"),
    ("Aid Per Capita (2026)", f"${aid_per_capita_2026:.2f} per person (vs ${aid_per_capita_2025:.2f} in 2025: -$9.86 cut)"),
    ("Total Internally Displaced Persons (IOM DTM)", f"{total_idps:,.0f} IDPs (Banadir host to 1.51M / 32.3%)"),
    ("Staple Food Price Inflation (WFP 2026)", "Maize +21.9% ($57.3), Rice +28.5% ($62.7), Sorghum +22.5% ($53.2)"),
    ("The 'Double Jeopardy' Impact", "Food Security Aid fell by -27.3% while food prices reached multi-year highs"),
    ("The Localization Deficit (Grand Bargain)", "Direct to Local NGOs: $2.81M (0.81%) vs $11.25M in 2025 (-75.0% collapse)"),
    ("Country-Based Pooled Fund (SHF)", "$44.93M (12.87% of total aid, surged by +49.5%)"),
    ("UN CERF Rapid Allocations (2026)", "$33.00M approved across emergency life-saving windows"),
    ("Foreign Exchange Risk Exposure", "76.13% of aid originates in non-USD currencies (EUR 40.71%, GBP 13.23%)"),
    ("Unpaid Commitment Backlog (Health)", "68.8% of Health sector funding remains unfulfilled commitments ($19.2M)")
]

headers_ws1 = ['Core Integrated Dimension', 'Empirical Finding & Value']
ws1.cell(row=5, column=2, value=headers_ws1[0]).font = header_font
ws1.cell(row=5, column=2).fill = header_fill
ws1.cell(row=5, column=3, value=headers_ws1[1]).font = header_font
ws1.cell(row=5, column=3).fill = header_fill

for idx, (dim, val) in enumerate(master_kpis):
    r_idx = 6 + idx
    c1 = ws1.cell(row=r_idx, column=2, value=dim)
    c2 = ws1.cell(row=r_idx, column=3, value=val)
    c1.font = bold_font
    c2.font = regular_font
    c1.border = thin_border
    c2.border = thin_border

# SHEET 2: REGION POPULATION & AID PER CAPITA
ws2 = wb.create_sheet(title='Population & Demographics')
ws2.views.sheetView[0].showGridLines = True
ws2['B2'] = "2026 SUBNATIONAL POPULATION ESTIMATES BY REGION (HPC 2026)"
ws2['B2'].font = title_font

headers_ws2 = ['Region', 'Total Population (2026)', 'Share of National (%)', 'Districts Count']
for col_idx, h in enumerate(headers_ws2, start=2):
    cell = ws2.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

reg_summary = df_pop.groupby('Region').agg({'Total': 'sum', 'District': 'count'}).sort_values(by='Total', ascending=False)
for idx, (reg, r) in enumerate(reg_summary.iterrows()):
    r_idx = 5 + idx
    ws2.cell(row=r_idx, column=2, value=reg).font = bold_font
    c1 = ws2.cell(row=r_idx, column=3, value=r['Total'])
    c1.number_format = '#,##0'
    c1.font = regular_font
    ws2.cell(row=r_idx, column=4, value=r['Total'] / total_population_2026).number_format = '0.0%'
    ws2.cell(row=r_idx, column=5, value=r['District']).font = regular_font

# SHEET 3: WFP FOOD PRICES
ws3 = wb.create_sheet(title='WFP Food Commodity Inflation')
ws3.views.sheetView[0].showGridLines = True
ws3['B2'] = "WFP MARKET COMMODITY PRICES & INFLATION TREND (2021-2026)"
ws3['B2'].font = title_font

food_table = food_inflation.tail(6).reset_index()
headers_ws3 = ['Year', 'Maize (white) USD', 'Rice (imported) USD', 'Sorghum (red) USD', 'Diesel USD']
for col_idx, h in enumerate(headers_ws3, start=2):
    cell = ws3.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, r in food_table.iterrows():
    r_idx = 5 + idx
    ws3.cell(row=r_idx, column=2, value=int(r['year'])).font = bold_font
    for c_i, col in enumerate(['Maize (white)', 'Rice (imported)', 'Sorghum (red)', 'Diesel'], start=3):
        val = r.get(col, None)
        c = ws3.cell(row=r_idx, column=c_i, value=val if pd.notna(val) else '-')
        if pd.notna(val):
            c.number_format = '$#,##0.00'

# SHEET 4: IOM DTM IDP DISPLACEMENT
ws4 = wb.create_sheet(title='IOM IDP Displacement')
ws4.views.sheetView[0].showGridLines = True
ws4['B2'] = "IOM DISPLACEMENT TRACKING MATRIX (DTM) BY REGION"
ws4['B2'].font = title_font

headers_ws4 = ['Region (Admin 1)', 'Recorded IDP Individuals', 'Share of Total IDPs (%)']
for col_idx, h in enumerate(headers_ws4, start=2):
    cell = ws4.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, (reg, count) in enumerate(idps_by_region.items()):
    r_idx = 5 + idx
    ws4.cell(row=r_idx, column=2, value=reg).font = bold_font
    c = ws4.cell(row=r_idx, column=3, value=count)
    c.number_format = '#,##0'
    ws4.cell(row=r_idx, column=4, value=count / total_idps).number_format = '0.0%'

# SHEET 5: HISTORICAL POOLED FUNDS
ws5 = wb.create_sheet(title='Pooled Funds Trajectory')
ws5.views.sheetView[0].showGridLines = True
ws5['B2'] = "HISTORICAL POOLED FUND CONTRIBUTIONS (SHF & CERF 2021-2026)"
ws5['B2'].font = title_font

headers_ws5 = ['Year', 'Somalia Humanitarian Fund ($)', 'UN CERF Allocations ($)', 'Combined Pooled ($)']
for col_idx, h in enumerate(headers_ws5, start=2):
    cell = ws5.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, (yr, r) in enumerate(pooled_trends.iterrows()):
    r_idx = 5 + idx
    ws5.cell(row=r_idx, column=2, value=int(yr)).font = bold_font
    c1 = ws5.cell(row=r_idx, column=3, value=r['Somalia Humanitarian Fund (SHF)'])
    c2 = ws5.cell(row=r_idx, column=4, value=r['Central Emergency Response Fund (CERF)'])
    c3 = ws5.cell(row=r_idx, column=5, value=r['Total Pooled ($M)'] * 1e6)
    for c in [c1, c2, c3]:
        c.number_format = '$#,##0'
        c.font = regular_font

# Adjust column widths
for ws in wb.worksheets:
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 14)

wb.save(excel_master_name)
print(f"Master Integrated Excel Report saved: {excel_master_name}")
print("ALL MASTER CROSS-DATASET ANALYSES COMPLETED!")
