import pandas as pd

# Load FTS 2026 and 2025
df26 = pd.read_excel('somali data all .xlsx', sheet_name='Export data', header=2)
df25 = pd.read_excel('somali data 2025.xlsx', sheet_name='Export data', header=2)

print("=== FTS 2026: INGO RECIPIENTS & SECTORS ===")
ingo26 = df26[df26['Destination org. type'].str.contains('International NGO|INGO', case=False, na=False)]
print(f"Total INGO 2026 Funding: ${ingo26['Amount (US$)'].sum():,.2f} ({len(ingo26)} transactions)")
print("\nTop 10 INGO Recipients 2026:")
print(ingo26.groupby('Destination org.')['Amount (US$)'].sum().sort_values(ascending=False).head(10))

print("\nWhere does INGO money go? (Sectors in 2026):")
print(ingo26.groupby('Sector')['Amount (US$)'].sum().sort_values(ascending=False).head(10))

print("\nWhere do INGOs get money from? (Source Donors in 2026):")
print(ingo26.groupby('Source org.')['Amount (US$)'].sum().sort_values(ascending=False).head(10))

print("\n=== FTS 2026: NATIONAL / LOCAL NGO RECIPIENTS ===")
nngo26 = df26[df26['Destination org. type'].str.contains('National NGO|Local NGO|CSO', case=False, na=False)]
print(f"Total NNGO 2026 Direct Funding: ${nngo26['Amount (US$)'].sum():,.2f} ({len(nngo26)} transactions)")
print("\nNNGO Recipients 2026:")
print(nngo26[['Destination org.', 'Amount (US$)', 'Sector', 'Source org.', 'Description']])

print("\n=== FTS 2025: INGO RECIPIENTS & LOCAL NGOS ===")
ingo25 = df25[df25['Destination org. type'].str.contains('International NGO|INGO', case=False, na=False)]
nngo25 = df25[df25['Destination org. type'].str.contains('National NGO|Local NGO|CSO', case=False, na=False)]
print(f"Total INGO 2025: ${ingo25['Amount (US$)'].sum():,.2f}")
print(f"Total NNGO 2025: ${nngo25['Amount (US$)'].sum():,.2f}")
print("\nNNGO 2025 Recipients & Sources:")
print(nngo25[['Destination org.', 'Amount (US$)', 'Sector', 'Source org.']].head(15))

print("\n=== CHECKING LINKED CHILD / PARENT FLOWS (SUB-GRANTS) ===")
print("Linked child ID non-null in 2026:", df26['Linked child ID'].dropna().count())
print("Linked parent ID non-null in 2026:", df26['Linked parent ID'].dropna().count())
if df26['Linked parent ID'].dropna().count() > 0:
    print("Sample linked flows:")
    print(df26[df26['Linked parent ID'].notna()][['Flow ID', 'Source org.', 'Destination org.', 'Destination org. type', 'Amount (US$)', 'Linked parent ID']])
