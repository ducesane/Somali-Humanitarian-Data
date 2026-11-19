import pandas as pd

# Targeted vs Reached CSV details
df_tr = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
print("--- Targeted vs Reached CSV ---")
print("Row 0:", df_tr.iloc[0].values)
print("Row 1:", df_tr.iloc[1].values)
print("Columns:", df_tr.columns)
print("Head 5:\n", df_tr.head())

# Monitoring matrix sheets
excel_path = 'hdx_data/somalia_targeted_reached_by_cluster_Somalia_Monitoring_Matrix_-_as_of_Novemb.xlsx'
for s in ['Monitoring Matrix by region', 'State Monitoring Matrix', 'Full - Working doc']:
    print(f"\n--- Monitoring Matrix Sheet: {s} ---")
    df = pd.read_excel(excel_path, sheet_name=s)
    print("Shape:", df.shape)
    print("Header rows:")
    for r in range(min(5, len(df))):
        print(f"Row {r}:", [x for x in df.iloc[r].values[:10] if pd.notna(x)])

# Cash CWG 4W
cash_path = 'hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx'
for s in ['MPCA Tracker', 'All CVA Tracker']:
    print(f"\n--- Cash Sheet: {s} ---")
    df = pd.read_excel(cash_path, sheet_name=s)
    print("Shape:", df.shape)
    for r in range(min(6, len(df))):
        print(f"Row {r}:", [x for x in df.iloc[r].values[:12] if pd.notna(x)])
