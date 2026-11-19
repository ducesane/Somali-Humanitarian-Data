import pandas as pd
import numpy as np

# Load 3W 2026
df_3w_2026 = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name='3W_Dataset_Jan-June 2026')
print("3W 2026 rows:", len(df_3w_2026))
print("3W 2026 Org Types:\n", df_3w_2026['Organization Type'].value_counts())
print("3W 2026 Total unique orgs:", df_3w_2026['Organization_Name'].nunique())
print("3W 2026 Total unique regions:", df_3w_2026['Region'].nunique())
print("3W 2026 Total unique districts:", df_3w_2026['District'].nunique())

# Load FTS 2026 & 2025
df_fts_2026 = pd.read_excel('somali data all .xlsx')
df_fts_2025 = pd.read_excel('somali data 2025.xlsx')

print("\nFTS 2026 columns:", df_fts_2026.columns.tolist()[:10])
amt_col_26 = [c for c in df_fts_2026.columns if 'amount' in c.lower() or 'usd' in c.lower()][0]
amt_col_25 = [c for c in df_fts_2025.columns if 'amount' in c.lower() or 'usd' in c.lower()][0]
print(f"FTS 2026 amount col: {amt_col_26}, total: ${df_fts_2026[amt_col_26].sum():,.2f}")
print(f"FTS 2025 amount col: {amt_col_25}, total: ${df_fts_2025[amt_col_25].sum():,.2f}")

# Inspect Targeted vs Reached CSV
df_tr = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv', header=None)
print("\nTargeted vs Reached CSV first 8 rows:")
for idx, row in df_tr.iloc[:8].iterrows():
    print(f"Row {idx}: {row.dropna().tolist()}")

# Inspect Cash 4W
df_cash_mpca = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name='MPCA Tracker', header=None)
print("\nCash MPCA first 5 rows:")
for idx, row in df_cash_mpca.iloc[:5].iterrows():
    print(f"Row {idx}: {row.dropna().tolist()[:10]}")

df_cash_cva = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name='All CVA Tracker', header=None)
print("\nCash All CVA first 5 rows:")
for idx, row in df_cash_cva.iloc[:5].iterrows():
    print(f"Row {idx}: {row.dropna().tolist()[:10]}")
