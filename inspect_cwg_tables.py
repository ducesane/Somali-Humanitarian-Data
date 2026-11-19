import pandas as pd

cash_path = 'hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx'
df_mpca = pd.read_excel(cash_path, sheet_name='MPCA Tracker', skiprows=3)
print("MPCA Tracker columns (first 15):", list(df_mpca.columns)[:15])
print("MPCA Tracker shape:", df_mpca.shape)
print("MPCA head:")
print(df_mpca.head())

# All CVA
df_cva = pd.read_excel(cash_path, sheet_name='All CVA Tracker', skiprows=2)
print("\nAll CVA columns (first 15):", list(df_cva.columns)[:15])
print("All CVA shape:", df_cva.shape)
print("All CVA head:")
print(df_cva.head())
