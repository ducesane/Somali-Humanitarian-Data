import pandas as pd
import json

# Load 3W 2026
df_3w = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
print("3W 2026 total rows:", len(df_3w))
print("3W 2026 unique orgs:", df_3w['Organization_Name'].nunique())
print("3W 2026 unique districts:", df_3w['District'].nunique())

# Load Admin2 coordinates
df_admin2 = pd.read_excel('hdx_data/somalia_admin_boundaries_som_admin_boundaries.xlsx', sheet_name='som_admin2')
print("Admin2 shape:", df_admin2.shape)
print("Admin2 districts:", df_admin2['adm2_name'].nunique())

# Load Target vs Reached
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)

# Load Admin1 coordinates
df_admin1 = pd.read_excel('hdx_data/somalia_admin_boundaries_som_admin_boundaries.xlsx', sheet_name='som_admin1')

# Check matching between 3W districts and Admin2 districts
w3_districts = set(df_3w['District'].dropna().str.strip())
adm2_districts = set(df_admin2['adm2_name'].dropna().str.strip())

matched = w3_districts.intersection(adm2_districts)
unmatched = w3_districts.difference(adm2_districts)
print(f"Matched districts: {len(matched)} / {len(w3_districts)}")
print(f"Unmatched districts ({len(unmatched)}):", unmatched)
