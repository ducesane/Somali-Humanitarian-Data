import pandas as pd

print("--- FTS 2026 Summary ---")
df26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
print(f"Rows: {len(df26)}, Total Funding: ${df26['Amount (US$)'].sum():,.2f}")
print(df26[['Destination org.', 'Destination org. type', 'Sector', 'Amount (US$)']].head())

print("\n--- 3W Operational Presence 2026 ---")
df_3w26 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
print(f"Rows: {len(df_3w26)}")
print(f"Columns: {list(df_3w26.columns)}")
print(df_3w26.head(3))
print("Clusters in 3W 2026:\n", df_3w26['Cluster'].value_counts())
print("Regions in 3W 2026:\n", df_3w26['Region'].value_counts())
print("Org Types in 3W 2026:\n", df_3w26['Organization Type'].value_counts())

print("\n--- Targeted vs Reached CSV ---")
df_tr = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
print(f"Rows: {len(df_tr)}")
print(df_tr.head(10))

print("\n--- Cash CWG 4W ---")
df_cash_mpca = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name='MPCA Tracker')
print("MPCA Tracker columns:\n", list(df_cash_mpca.columns)[:15])
print(df_cash_mpca.head(5))

df_cash_cva = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name='All CVA Tracker')
print("\nAll CVA Tracker columns:\n", list(df_cash_cva.columns)[:15])
print(df_cash_cva.head(5))
