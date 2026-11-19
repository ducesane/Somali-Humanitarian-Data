import pandas as pd
import numpy as np
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import os

print("Building Somalia_INGO_and_Local_NGO_Funding_Flows_Analysis.xlsx...")

# Load datasets
df_fts26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
df_cbpf = pd.read_csv('hdx_data/som_cbpf_project_summary.csv')
df_int = pd.read_csv('hdx_data/fts_internal_funding_som.csv')

# 1. INGO Table 2026
ingo26 = df_fts26[df_fts26['Destination org. type'].str.contains('International NGO|INGO', case=False, na=False)].copy()
ingo_summary = ingo26.groupby(['Destination org.', 'Sector', 'Source org.'])['Amount (US$)'].sum().reset_index()
ingo_summary = ingo_summary.sort_values(by='Amount (US$)', ascending=False)

# 2. Local NGO Direct FTS 2026
nngo26 = df_fts26[df_fts26['Destination org. type'].isin(['NGOs: National NGOs/CSOs', 'NGOs: Local NGOs/CSOs'])].copy()
nngo_fts = nngo26[['Destination org.', 'Amount (US$)', 'Sector', 'Source org.', 'Description']].sort_values(by='Amount (US$)', ascending=False)

# 3. CBPF / SHF Allocations 2026
cbpf26 = df_cbpf[df_cbpf['AllocationYear'] == 2026].copy()
cbpf26_clean = cbpf26[['OrganizationName', 'OrganizationType', 'ProjectTitle', 'Budget', 'TotalDirectCost', 'TotalSupportCost', 'Men', 'Women', 'Boys', 'Girls', 'ProjectDuration', 'ProjectStatus']].sort_values(by='Budget', ascending=False)

# 4. Historical Localization in SHF (2017-2026)
hist_cbpf = df_cbpf[df_cbpf['AllocationYear'] >= 2017].groupby(['AllocationYear', 'OrganizationType'])['Budget'].sum().unstack(fill_value=0)
hist_cbpf['Total'] = hist_cbpf.sum(axis=1)
if 'National NGO' in hist_cbpf.columns:
    hist_cbpf['NNGO_Share_Pct'] = (hist_cbpf['National NGO'] / hist_cbpf['Total']) * 100
if 'International NGO' in hist_cbpf.columns:
    hist_cbpf['INGO_Share_Pct'] = (hist_cbpf['International NGO'] / hist_cbpf['Total']) * 100
hist_cbpf_reset = hist_cbpf.reset_index()

# 5. Executive Overview Summary
exec_data = [
    {'Question': 'Where does International NGO (INGO) money go?', 'Financial Volume': '$119,898,581 (36.1% of FTS)', 'Primary Channels / Sectors': 'Protection ($24.0M), Food Security ($19.3M), Cash/MPCA ($15.3M), Health ($15.0M), BRCiS Multi-sector ($12.3M)', 'Ground Mechanism': 'Top 5 INGOs (NRC, Concern, Qatar Charity, Save the Children, ACF) manage consortiums and sub-contract local NGOs for rural implementation.'},
    {'Question': 'Where do Local Somali NGOs get direct donor money?', 'Financial Volume': '$2,810,088 (0.80% of FTS)', 'Primary Channels / Sectors': 'Emergency food baskets, Eid clothes, eye surgery clinics, water trucking', 'Ground Mechanism': 'Direct bilateral funding comes almost exclusively from Saudi Arabia (KSrelief: $2.75M) and Gulf charities. Western donors provide virtually zero direct grants.'},
    {'Question': 'What is the PRIMARY source of funding for Local NGOs?', 'Financial Volume': '$19,524,281 (84.6% of SHF 2026)', 'Primary Channels / Sectors': 'Somalia Humanitarian Fund (SHF / CBPF) Pooled Grants across 40 projects', 'Ground Mechanism': 'UN OCHA Somalia Humanitarian Fund channels 84.6% of its allocations directly to National Somali NGOs (AMARD, Dignity First, New Ways, WARDI, Kulmiye).'},
    {'Question': 'How do UN agencies fund Local NGOs downstream?', 'Financial Volume': 'Estimated $25M - $35M annually', 'Primary Channels / Sectors': 'WFP SCOPE food distribution, UNICEF nutrition centres (OTPs/SCs), UNHCR protection', 'Ground Mechanism': 'UN agencies receive $144.7M in FTS and sign Field Level Agreements (FLAs) with local NGOs. These downstream contracts are rarely reported in FTS.'},
    {'Question': 'Why is there a disconnect between FTS and Ground Reality?', 'Financial Volume': '40.8% Ground Delivery vs 0.8% FTS', 'Primary Channels / Sectors': 'Reporting boundary limitation in FTS', 'Ground Mechanism': 'FTS tracks first-tier primary grants from international donors. Second-tier downstream sub-grants from UN agencies and INGOs to local NGOs are not captured.'}
]
df_exec = pd.DataFrame(exec_data)

excel_out = 'Somalia_INGO_and_Local_NGO_Funding_Flows_Analysis.xlsx'
writer = pd.ExcelWriter(excel_out, engine='openpyxl')

df_exec.to_excel(writer, sheet_name='Executive Architecture', index=False)
ingo_summary.head(100).to_excel(writer, sheet_name='INGO Allocations (FTS 2026)', index=False)
nngo_fts.to_excel(writer, sheet_name='Local NGO Direct FTS Flows', index=False)
cbpf26_clean.to_excel(writer, sheet_name='SHF 2026 Partner Allocations', index=False)
hist_cbpf_reset.to_excel(writer, sheet_name='SHF Historical Localization', index=False)

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
    for col in ws.iter_cols(min_row=1, max_row=1):
        cell = col[0]
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.font = Font(name="Segoe UI", size=10)
            cell.border = thin_border
            if isinstance(cell.value, (int, float)):
                col_name = str(ws.cell(row=1, column=cell.column).value or '')
                if 'Percent' in col_name or 'Pct' in col_name or '(%)' in col_name:
                    cell.number_format = '0.0"%"'
                elif 'Amount' in col_name or 'Budget' in col_name or 'Cost' in col_name or 'Total' in col_name:
                    cell.number_format = '$#,##0'
                elif 'Men' in col_name or 'Women' in col_name or 'Boys' in col_name or 'Girls' in col_name:
                    cell.number_format = '#,##0'

    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 60)

wb.save(excel_out)
# Copy to artifact dir
artifact_excel = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\Somalia_INGO_and_Local_NGO_Funding_Flows_Analysis.xlsx'
wb.save(artifact_excel)

print(f"Successfully created and styled {excel_out} and copied to artifact directory!")
