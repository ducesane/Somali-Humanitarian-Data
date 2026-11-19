import pandas as pd

# Clean Target vs Reached CSV
df_tr_raw = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
print("Columns:", df_tr_raw.columns)
# Row 0 has real column names
df_tr = df_tr_raw.iloc[2:].copy()
df_tr.columns = ['Region', 'RegionPcode', 'District', 'DistrictPcode', 'OPA_Priority', 'Total_Affected', 'Target', 'Reached']
# Convert numeric columns
for col in ['Total_Affected', 'Target', 'Reached']:
    df_tr[col] = pd.to_numeric(df_tr[col].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)

print("Parsed Target vs Reached:")
print(f"Total Rows: {len(df_tr)}")
print(f"Total Affected: {df_tr['Total_Affected'].sum():,.0f}")
print(f"Total Target: {df_tr['Target'].sum():,.0f}")
print(f"Total Reached: {df_tr['Reached'].sum():,.0f}")
print(f"Overall Reach Ratio: {df_tr['Reached'].sum() / df_tr['Target'].sum():.1%}")

print("\nTop 5 Regions by Target:")
print(df_tr.groupby('Region')[['Target', 'Reached', 'Total_Affected']].sum().sort_values(by='Target', ascending=False).head(5))

print("\nBy Operational Priority Area (OPA):")
print(df_tr.groupby('OPA_Priority')[['Target', 'Reached', 'Total_Affected']].sum())
