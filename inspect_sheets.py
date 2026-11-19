import pandas as pd

df_fts_2026 = pd.read_excel('somali data all .xlsx', sheet_name='Export data')
df_fts_2025 = pd.read_excel('somali data 2025.xlsx', sheet_name='Export data')

print(f"FTS 2026 shape: {df_fts_2026.shape}, columns: {list(df_fts_2026.columns)[:10]}")
print(f"FTS 2026 total funding: ${df_fts_2026['amountUSD'].sum():,.2f}")
print(f"FTS 2025 shape: {df_fts_2025.shape}, columns: {list(df_fts_2025.columns)[:10]}")
print(f"FTS 2025 total funding: ${df_fts_2025['amountUSD'].sum():,.2f}")

# Check 3W 2026
df_3w = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
print(f"\n3W 2026 shape: {df_3w.shape}")
print(df_3w.head(3))

# Check Targeted vs Reached CSV
df_tr = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
print(f"\nTargeted vs Reached shape: {df_tr.shape}")
print(df_tr.head(6))

# Check Monitoring Matrix
df_mm = pd.read_excel('hdx_data/somalia_targeted_reached_by_cluster_Somalia_Monitoring_Matrix_-_as_of_Novemb.xlsx', sheet_name='Monitoring Matrix by region')
print(f"\nMonitoring Matrix by region shape: {df_mm.shape}")
print(df_mm.head(4))

# Check Cash 4W
df_cash = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name='MPCA Tracker')
print(f"\nCash MPCA Tracker shape: {df_cash.shape}")
print(df_cash.head(4))
