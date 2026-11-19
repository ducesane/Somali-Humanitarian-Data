import pandas as pd
import json

df26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
df25 = pd.read_excel('somali data 2025.xlsx', sheet_name='Export data', header=2)

print("=== 2026 DIRECT NATIONAL / LOCAL NGO TRANSACTIONS ===")
nngo_mask_26 = df26['Destination org. type'].isin(['NGOs: National NGOs/CSOs', 'NGOs: Local NGOs/CSOs'])
nngo_df_26 = df26[nngo_mask_26]
print(f"Total direct to Local/National NGOs: ${nngo_df_26['Amount (US$)'].sum():,.2f} ({len(nngo_df_26)} flows)")
print(nngo_df_26[['Destination org.', 'Amount (US$)', 'Sector', 'Source org.', 'Description']])

print("\n=== 2026 WHO FUNDS LOCAL NGOS DIRECTLY? ===")
print(nngo_df_26.groupby('Source org.')['Amount (US$)'].sum().sort_values(ascending=False))

print("\n=== 2025 DIRECT NATIONAL / LOCAL NGO TRANSACTIONS ===")
nngo_mask_25 = df25['Destination org. type'].isin(['NGOs: National NGOs/CSOs', 'NGOs: Local NGOs/CSOs'])
nngo_df_25 = df25[nngo_mask_25]
print(f"Total direct to Local/National NGOs in 2025: ${nngo_df_25['Amount (US$)'].sum():,.2f} ({len(nngo_df_25)} flows)")
print("\n2025 Local NGO Source Donors:")
print(nngo_df_25.groupby('Source org.')['Amount (US$)'].sum().sort_values(ascending=False))
print("\nTop Local NGOs funded in 2025:")
print(nngo_df_25.groupby('Destination org.')['Amount (US$)'].sum().sort_values(ascending=False).head(15))
