import json
import pandas as pd

# Load GeoJSON
with open('hdx_data/somalia_adm1_real.geojson', 'r', encoding='utf-8') as f:
    geojson = json.load(f)

# Load 3W regional stats
df_3w = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
reg_stats = df_3w.groupby('Region').agg(
    Activities=('Organization_Name', 'count'),
    Unique_Orgs=('Organization_Name', 'nunique')
).to_dict(orient='index')

print("Regions in GeoJSON:")
for feat in geojson['features']:
    name = feat['properties'].get('shapeName')
    print(f"- {name} (shapeISO: {feat['properties'].get('shapeISO')})")

print("\nRegions in 3W:")
print(list(reg_stats.keys()))
