import pandas as pd

df_int = pd.read_csv('hdx_data/fts_internal_funding_som.csv')
print("=== INTERNAL FUNDING IN SOMALIA (PASS-THROUGH / POOLED FUND ALLOCATIONS) ===")
print("Total rows:", len(df_int))
print("Budget Years:", df_int['budgetYear'].value_counts())
print("\nSource Organizations (Who gives the internal money?):")
print(df_int.groupby('srcOrganization')['amountUSD'].sum().sort_values(ascending=False).head(10))

print("\nSource Organization Types:")
print(df_int.groupby('srcOrganizationTypes')['amountUSD'].sum().sort_values(ascending=False))

print("\nDestination Organization Types (Who receives the internal money?):")
print(df_int.groupby('destOrganizationTypes')['amountUSD'].sum().sort_values(ascending=False))

print("\nTop Destination Organizations:")
print(df_int.groupby(['destOrganization', 'destOrganizationTypes'])['amountUSD'].sum().sort_values(ascending=False).head(15))

print("\nFlow Types:")
print(df_int['flowType'].value_counts())
