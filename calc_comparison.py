import pandas as pd
import numpy as np

# 1. Load FTS 2026
df_fts26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
# 2. Load 3W 2026
df_3w26 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
# 3. Load 3W 2025
df_3w25 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2025.xlsx', sheet_name='3W_Dataset_Jan - Dec 2025')
# 4. Load Target vs Reached
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)

print("=== 1. LOCALIZATION DISCONNECT: FTS FUNDING VS 3W GROUND ACTIVITIES ===")
fts_org_type = df_fts26.groupby('Destination org. type')['Amount (US$)'].sum()
fts_org_pct = (fts_org_type / fts_org_type.sum()) * 100

w3_org_type = df_3w26['Organization Type'].value_counts()
w3_org_pct = (w3_org_type / len(df_3w26)) * 100

loc_df = pd.DataFrame({
    'FTS Funding ($)': fts_org_type,
    'FTS Share (%)': fts_org_pct,
    '3W Activities Count': w3_org_type,
    '3W Activities Share (%)': w3_org_pct
}).fillna(0)
print(loc_df)

print("\n=== 2. SECTORAL COMPARISON: FTS FUNDING VS 3W OPERATIONAL PRESENCE ===")
# Normalize sector names for matching
fts_sec = df_fts26.groupby('Sector')['Amount (US$)'].sum().sort_values(ascending=False)
w3_cluster = df_3w26['Cluster'].value_counts()
w3_cluster_orgs = df_3w26.groupby('Cluster')['Organization_Name'].nunique()

print("Top FTS Sectors:")
print(fts_sec.head(10))
print("\n3W Clusters (Activity count & unique orgs):")
print(pd.DataFrame({'Activities': w3_cluster, 'Unique Orgs': w3_cluster_orgs}))

print("\n=== 3. REGIONAL PRESENCE (3W 2026) VS TARGET & REACHED ===")
w3_reg = df_3w26.groupby('Region').agg(
    Activities=('Organization_Name', 'count'),
    Unique_Orgs=('Organization_Name', 'nunique'),
    Districts_Covered=('District', 'nunique')
)
tr_reg = df_tr.groupby('Region').agg(
    Target=('Target', 'sum'),
    Reached=('Reached', 'sum'),
    Affected=('Total_Affected', 'sum')
)
tr_reg['Reach_Ratio_Pct'] = (tr_reg['Reached'] / tr_reg['Target']) * 100

reg_combined = w3_reg.join(tr_reg).sort_values(by='Activities', ascending=False)
print(reg_combined)

print("\n=== 4. 2025 VS 2026 CONTRACTION ===")
print(f"FTS Funding 2025: ${pd.read_excel('somali data 2025.xlsx', sheet_name='Export data', header=2)['Amount (US$)'].sum():,.2f}")
print(f"FTS Funding 2026: ${df_fts26['Amount (US$)'].sum():,.2f}")
print(f"3W Activities 2025: {len(df_3w25):,}, Unique Orgs: {df_3w25['Organization_Name'].nunique()}")
print(f"3W Activities 2026 (Jan-Jun): {len(df_3w26):,}, Unique Orgs: {df_3w26['Organization_Name'].nunique()}")
