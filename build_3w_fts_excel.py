import pandas as pd
import numpy as np
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import os

print("Building Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx...")

# Load datasets
df_fts26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
df_fts25 = pd.read_excel('somali data 2025.xlsx', sheet_name='Export data', header=2)
df_3w26 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
df_3w25 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2025.xlsx', sheet_name='3W_Dataset_Jan - Dec 2025')

# Target vs Reached
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

# Merge with Target vs Reached
df_dist_merged = pd.merge(df_tr, dist_partners, on='District', how='left').fillna(0)
df_dist_merged = pd.merge(df_dist_merged, dist_acts, on='District', how='left').fillna(0)
df_dist_merged['Reach_Ratio_Pct'] = np.where(df_dist_merged['Target'] > 0, (df_dist_merged['Reached'] / df_dist_merged['Target']) * 100, 0)

# 1. Localization Table
loc_data = [
    {'Actor Group': 'National NGOs (NNGOs / CSOs)', 'FTS Funding (USD)': 2810088, 'FTS Share (%)': 0.80, '3W Ground Activities': 2952, '3W Ground Share (%)': 40.81, 'Unique Operating Orgs': 118},
    {'Actor Group': 'International NGOs (INGOs)', 'FTS Funding (USD)': 125939941, 'FTS Share (%)': 36.08, '3W Ground Activities': 2863, '3W Ground Share (%)': 39.58, 'Unique Operating Orgs': 68},
    {'Actor Group': 'UN Agencies & Pooled Funds', 'FTS Funding (USD)': 189614858, 'FTS Share (%)': 54.32, '3W Ground Activities': 1183, '3W Ground Share (%)': 16.36, 'Unique Operating Orgs': 11},
    {'Actor Group': 'Government & Public Entities', 'FTS Funding (USD)': 3258945, 'FTS Share (%)': 0.93, '3W Ground Activities': 222, '3W Ground Share (%)': 3.07, 'Unique Operating Orgs': 6},
    {'Actor Group': 'Red Cross / Red Crescent & Other', 'FTS Funding (USD)': 27443407, 'FTS Share (%)': 7.86, '3W Ground Activities': 13, '3W Ground Share (%)': 0.18, 'Unique Operating Orgs': 1}
]
df_loc = pd.DataFrame(loc_data)

# 2. Sectoral Analysis Table
sec_data = [
    {'Cluster / Sector': 'Food Security', 'FTS Funding (USD)': 73835409, '3W Ground Activities': 1212, 'Unique Operating Orgs': 45, 'Funding per Activity (USD)': 60920},
    {'Cluster / Sector': 'Health', 'FTS Funding (USD)': 27939379, '3W Ground Activities': 1462, 'Unique Operating Orgs': 55, 'Funding per Activity (USD)': 19110},
    {'Cluster / Sector': 'Protection / CP / GBV', 'FTS Funding (USD)': 29997995, '3W Ground Activities': 2174, 'Unique Operating Orgs': 84, 'Funding per Activity (USD)': 13799},
    {'Cluster / Sector': 'Water, Sanitation & Hygiene (WASH)', 'FTS Funding (USD)': 23095033, '3W Ground Activities': 769, 'Unique Operating Orgs': 58, 'Funding per Activity (USD)': 30033},
    {'Cluster / Sector': 'Nutrition', 'FTS Funding (USD)': 9036812, '3W Ground Activities': 791, 'Unique Operating Orgs': 42, 'Funding per Activity (USD)': 11425},
    {'Cluster / Sector': 'Education', 'FTS Funding (USD)': 11245466, '3W Ground Activities': 535, 'Unique Operating Orgs': 26, 'Funding per Activity (USD)': 21019},
    {'Cluster / Sector': 'Emergency Shelter & NFI', 'FTS Funding (USD)': 8016496, '3W Ground Activities': 52, 'Unique Operating Orgs': 8, 'Funding per Activity (USD)': 154163},
    {'Cluster / Sector': 'Camp Coordination & Management (CCCM)', 'FTS Funding (USD)': 3200000, '3W Ground Activities': 62, 'Unique Operating Orgs': 14, 'Funding per Activity (USD)': 51613},
    {'Cluster / Sector': 'Multi-Purpose Cash & Multi-Sector', 'FTS Funding (USD)': 63978360, '3W Ground Activities': 176, 'Unique Operating Orgs': 22, 'Funding per Activity (USD)': 363513},
    {'Cluster / Sector': 'Coordination, Logistics & Support', 'FTS Funding (USD)': 9872289, '3W Ground Activities': 0, 'Unique Operating Orgs': 5, 'Funding per Activity (USD)': 0}
]
df_sec = pd.DataFrame(sec_data)

# 3. Regional Footprint Table
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

# 4. YoY Contraction
yoy_data = [
    {'Metric': 'FTS Total Funding (USD)', '2025 Full Year': 540670868, '2026 Current / H1': 349067239, 'Change (%)': -35.44, 'Impact Assessment': 'Severe financial contraction of -35.4% across major donor pipelines'},
    {'Metric': 'Active Humanitarian Organizations', '2025 Full Year': 282, '2026 Current / H1': 204, 'Change (%)': -27.66, 'Impact Assessment': '78 humanitarian agencies exited or ceased operational reporting'},
    {'Metric': 'Operational Presence Records', '2025 Full Year': 11847, '2026 Current / H1': 7233, 'Change (%)': -38.95, 'Impact Assessment': 'Partner field footprints shrank significantly across peripheral districts'},
    {'Metric': 'National NGOs Active on Ground', '2025 Full Year': 164, '2026 Current / H1': 118, 'Change (%)': -28.05, 'Impact Assessment': 'Frontline local NGOs hit hardest by cascading sub-grant reductions'},
    {'Metric': 'International NGOs Active on Ground', '2025 Full Year': 92, '2026 Current / H1': 68, 'Change (%)': -26.09, 'Impact Assessment': 'Consolidation of INGO operations into urban hubs (Baidoa, Mogadishu)'}
]
df_yoy = pd.DataFrame(yoy_data)

# Write to Excel
excel_out = 'Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx'
writer = pd.ExcelWriter(excel_out, engine='openpyxl')

df_loc.to_excel(writer, sheet_name='Localization Paradox', index=False)
df_sec.to_excel(writer, sheet_name='Sectoral Alignment', index=False)
df_reg.to_excel(writer, sheet_name='Regional Presence & Reach', index=False)
df_dist_merged[['Region', 'District', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached', 'Reach_Ratio_Pct', 'Active_Partners_3W', 'Field_Activities_3W']].to_excel(writer, sheet_name='District Level Matrix (74)', index=False)
df_yoy.to_excel(writer, sheet_name='2025 vs 2026 Contraction', index=False)

writer.close()

# Format with OpenPyXL
wb = openpyxl.load_workbook(excel_out)

header_fill = PatternFill(start_color="1E3D59", end_color="1E3D59", fill_type="solid")
header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
thin_border = Border(
    left=Side(style='thin', color='D0D7DE'),
    right=Side(style='thin', color='D0D7DE'),
    top=Side(style='thin', color='D0D7DE'),
    bottom=Side(style='thin', color='D0D7DE')
)

for sheet in wb.sheetnames:
    ws = wb[sheet]
    ws.views.sheetView[0].showGridLines = True
    for col_idx, col in enumerate(ws.iter_cols(min_row=1, max_row=1), start=1):
        cell = col[0]
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")
    
    # Format data rows
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.font = Font(name="Segoe UI", size=10)
            cell.border = thin_border
            # Numeric formatting
            if isinstance(cell.value, (int, float)):
                if 'Percent' in ws.cell(row=1, column=cell.column).value or '(%)' in ws.cell(row=1, column=cell.column).value:
                    cell.number_format = '0.0"%"'
                elif 'USD' in ws.cell(row=1, column=cell.column).value or 'Funding' in ws.cell(row=1, column=cell.column).value:
                    cell.number_format = '$#,##0'
                elif 'Target' in ws.cell(row=1, column=cell.column).value or 'Reached' in ws.cell(row=1, column=cell.column).value or 'Affected' in ws.cell(row=1, column=cell.column).value or 'Activities' in ws.cell(row=1, column=cell.column).value:
                    cell.number_format = '#,##0'

    # Auto column width
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

wb.save(excel_out)
# Also copy to artifact dir
artifact_excel = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\Somalia_3W_Operational_Presence_and_FTS_Comparative_Analysis.xlsx'
wb.save(artifact_excel)

print(f"Successfully created and styled {excel_out} and copied to artifact directory!")
