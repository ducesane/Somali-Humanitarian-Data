import pandas as pd

cash_path = 'hdx_data/somalia_cash_programming_Somalia_CWG_4Ws_Final_Dataset_2025.xlsx'
xl = pd.ExcelFile(cash_path)
for sheet in xl.sheet_names:
    df = xl.parse(sheet, header=None)
    print(f"=== Sheet: {sheet} ===")
    for i in range(10):
        row_vals = [f"col{idx}:{v}" for idx, v in enumerate(df.iloc[i].values) if pd.notna(v)]
        if row_vals:
            print(f"Row {i}: {row_vals[:8]}")
