import pandas as pd

df = pd.read_csv('hdx_data/som_cbpf_project_summary.csv')
print("Organization Types in CBPF:")
print(df['OrganizationType'].value_counts())

recent = df[df['AllocationYear'] >= 2023]
print("\n=== CBPF / SHF ALLOCATIONS BY ORG TYPE (2023 - 2026) ===")
summary = recent.groupby(['AllocationYear', 'OrganizationType'])['Budget'].agg(
    Projects='count',
    Total_Budget='sum'
).reset_index()

# Calculate percentages per year
year_totals = recent.groupby('AllocationYear')['Budget'].sum().to_dict()
summary['Year_Total'] = summary['AllocationYear'].map(year_totals)
summary['Share_Pct'] = (summary['Total_Budget'] / summary['Year_Total']) * 100
summary['Total_Budget_Formatted'] = summary['Total_Budget'].apply(lambda x: f"${x:,.2f}")
summary['Share_Pct_Formatted'] = summary['Share_Pct'].apply(lambda x: f"{x:.1f}%")
print(summary[['AllocationYear', 'OrganizationType', 'Projects', 'Total_Budget_Formatted', 'Share_Pct_Formatted']])

print("\n=== 2026 CBPF / SHF ALLOCATIONS (DETAILED) ===")
df26 = df[df['AllocationYear'] == 2026]
print(f"2026 Total SHF Allocations: ${df26['Budget'].sum():,.2f} across {len(df26)} projects")
print(df26.groupby('OrganizationType')['Budget'].agg(['count', 'sum']))

print("\nTop 10 Local Somali NGOs funded by SHF in 2025-2026:")
nngo_recent = df[(df['AllocationYear'] >= 2025) & (df['OrganizationType'].str.contains('National', case=False, na=False))]
print(nngo_recent.groupby('OrganizationName')['Budget'].agg(['count', 'sum']).sort_values(by='sum', ascending=False).head(10))

print("\nTop 10 International NGOs funded by SHF in 2025-2026:")
ingo_recent = df[(df['AllocationYear'] >= 2025) & (df['OrganizationType'].str.contains('International', case=False, na=False))]
print(ingo_recent.groupby('OrganizationName')['Budget'].agg(['count', 'sum']).sort_values(by='sum', ascending=False).head(10))
