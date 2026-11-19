import pandas as pd
import openpyxl

print("=== 1. 3W 2026 ===")
try:
    wb26 = openpyxl.load_workbook('hdx_data/somalia_3w_operational_presence_2026.xlsx', read_only=True)
    print("Sheets in 3W 2026:", wb26.sheetnames)
    for s in wb26.sheetnames:
        df = pd.read_excel('hdx_data/somalia_3w_operational_presence_2026.xlsx', sheet_name=s, nrows=5)
        print(f"Sheet '{s}' shape sample cols:", df.columns.tolist()[:10])
except Exception as e:
    print("Error 3W 2026:", e)

print("\n=== 2. 3W 2025 ===")
try:
    wb25 = openpyxl.load_workbook('hdx_data/somalia_3w_operational_presence_2025.xlsx', read_only=True)
    print("Sheets in 3W 2025:", wb25.sheetnames)
    for s in wb25.sheetnames[:3]:
        df = pd.read_excel('hdx_data/somalia_3w_operational_presence_2025.xlsx', sheet_name=s, nrows=5)
        print(f"Sheet '{s}' shape sample cols:", df.columns.tolist()[:10])
except Exception as e:
    print("Error 3W 2025:", e)

print("\n=== 3. Targeted vs Reached CSV ===")
try:
    df_tr = pd.read_csv('hdx_data/somalia_targeted_reached_by_location_cluster.csv')
    print("CSV shape:", df_tr.shape)
    print("CSV cols:", df_tr.columns.tolist())
    print("CSV head:\n", df_tr.head())
except Exception as e:
    print("Error CSV:", e)

print("\n=== 4. Monitoring Matrix XLSX ===")
try:
    wb_mm = openpyxl.load_workbook('hdx_data/somalia_targeted_reached_by_cluster_Somalia_Monitoring_Matrix_-_as_of_Novemb.xlsx', read_only=True)
    print("Sheets in Monitoring Matrix:", wb_mm.sheetnames)
    for s in wb_mm.sheetnames[:4]:
        df = pd.read_excel('hdx_data/somalia_targeted_reached_by_cluster_Somalia_Monitoring_Matrix_-_as_of_Novemb.xlsx', sheet_name=s, nrows=5)
        print(f"Sheet '{s}' cols:", df.columns.tolist()[:10])
except Exception as e:
    print("Error Monitoring Matrix:", e)

print("\n=== 5. Cash 4W Final Dataset 2025 ===")
try:
    wb_cash = openpyxl.load_workbook('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', read_only=True)
    print("Sheets in Cash 4W:", wb_cash.sheetnames)
    for s in wb_cash.sheetnames:
        df = pd.read_excel('hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx', sheet_name=s, nrows=5)
        print(f"Sheet '{s}' cols:", df.columns.tolist()[:10])
except Exception as e:
    print("Error Cash 4W:", e)
