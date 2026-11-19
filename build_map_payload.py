import pandas as pd
import json

# Load 3W 2026
df_3w = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')

# Load Admin2 coordinates
df_admin2 = pd.read_excel('hdx_data/somalia_admin_boundaries_som_admin_boundaries.xlsx', sheet_name='som_admin2')
coord_map = df_admin2.set_index('adm2_name')[['adm1_name', 'adm2_pcode', 'adm1_pcode', 'center_lat', 'center_lon', 'area_sqkm']].to_dict(orient='index')

# Load Target vs Reached
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)
tr_map = df_tr.set_index('District')[['OPA_Priority', 'Total_Affected', 'Target', 'Reached']].to_dict(orient='index')

# Load SHF 2026 allocations
df_cbpf = pd.read_csv('hdx_data/som_cbpf_project_summary.csv')
cbpf26 = df_cbpf[df_cbpf['AllocationYear'] == 2026]
shf_map = cbpf26.groupby('OrganizationName')['Budget'].sum().to_dict()

# Build district data
districts_data = {}
for dist, group in df_3w.groupby('District'):
    reg = group['Region'].iloc[0]
    coords = coord_map.get(dist, {})
    tr_info = tr_map.get(dist, {})
    
    # Orgs in this district
    org_list = []
    for org_name, org_grp in group.groupby('Organization_Name'):
        org_type = org_grp['Organization Type'].iloc[0]
        clusters = list(org_grp['Cluster'].unique())
        shf_amt = 0
        for k, v in shf_map.items():
            if k.lower() in org_name.lower() or org_name.lower() in k.lower():
                shf_amt = v
                break
        org_list.append({
            'name': org_name,
            'type': org_type,
            'clusters': clusters,
            'activities': len(org_grp),
            'shf_budget': shf_amt
        })
    org_list.sort(key=lambda x: x['activities'], reverse=True)
    
    cluster_counts = group['Cluster'].value_counts().to_dict()
    type_counts = group['Organization Type'].value_counts().to_dict()
    
    target_val = tr_info.get('Target', 0)
    reached_val = tr_info.get('Reached', 0)
    reach_pct = (reached_val / target_val * 100) if target_val > 0 else 0
    
    districts_data[dist] = {
        'district': dist,
        'region': reg,
        'adm2_pcode': coords.get('adm2_pcode', ''),
        'adm1_pcode': coords.get('adm1_pcode', ''),
        'lat': coords.get('center_lat', 0),
        'lon': coords.get('center_lon', 0),
        'area_sqkm': coords.get('area_sqkm', 0),
        'total_activities': len(group),
        'unique_orgs_count': len(org_list),
        'org_type_counts': type_counts,
        'cluster_counts': cluster_counts,
        'target': target_val,
        'reached': reached_val,
        'reach_ratio_pct': round(reach_pct, 1),
        'affected': tr_info.get('Total_Affected', 0),
        'opa_priority': str(tr_info.get('OPA_Priority', 'N/A')).replace('.0', ''),
        'organizations': org_list
    }

# Build NGO master directory
ngo_directory = {}
for org_name, group in df_3w.groupby('Organization_Name'):
    org_type = group['Organization Type'].iloc[0]
    clusters = list(group['Cluster'].unique())
    districts = list(group['District'].unique())
    regions = list(group['Region'].unique())
    shf_amt = 0
    for k, v in shf_map.items():
        if k.lower() in org_name.lower() or org_name.lower() in k.lower():
            shf_amt = v
            break
    ngo_directory[org_name] = {
        'name': org_name,
        'type': org_type,
        'total_activities': len(group),
        'districts_count': len(districts),
        'districts': districts,
        'regions': regions,
        'clusters': clusters,
        'shf_budget': shf_amt
    }

print(f"Total districts structured: {len(districts_data)}")
print(f"Total NGOs structured: {len(ngo_directory)}")

with open('map_data_summary.json', 'w', encoding='utf-8') as f:
    json.dump({'districts': districts_data, 'ngos': ngo_directory}, f)

print("Saved map_data_summary.json successfully!")
