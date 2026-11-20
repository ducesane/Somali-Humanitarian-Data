import openpyxl
import json

wb = openpyxl.load_workbook('hdx_data/reach_som_kismayo_idp_household_clean.xlsx', read_only=True)
ws = wb['CleanData_HH']
rows = ws.iter_rows(values_only=True)
header = next(rows)

total = 0
horjooge_count = 0
female_hhh = 0
avg_members = []
avg_children = []
settlements = set()

h_records = []

for idx, r in enumerate(rows):
    total += 1
    settlement = r[header.index('settlement_name')] or "Unknown"
    area = r[header.index('area')] or "Unknown"
    gender = r[header.index('resp_gender')] or "Unknown"
    is_hhh = r[header.index('resp_hhh')] or "Unknown"
    hhh_age = r[header.index('hhh_age')] or "Unknown"
    members = r[header.index('total_hh_members')] or 0
    children = r[header.index('total_children')] or 0
    plw = r[header.index('plw')] or 0
    registered = r[header.index('hh_registered')] or "no"
    horjooge = r[header.index('horjooge')]
    is_horjooge = (horjooge == 1 or horjooge == '1')
    
    rent = r[header.index('rent_paid_money_inkind')] or "no"
    rent_amt = r[header.index('cash_amount')] or 0
    
    if is_horjooge:
        horjooge_count += 1
    if gender == 'female' and (is_hhh == 'yes' or is_hhh == 1):
        female_hhh += 1
    if isinstance(members, (int, float)):
        avg_members.append(members)
    if isinstance(children, (int, float)):
        avg_children.append(children)
    settlements.add(settlement)

    # Store first 1211 records
    h_records.append({
        'household_id': f"SOM-HH-{1000 + idx}",
        'district': 'Kismayo',
        'area': str(area),
        'settlement_name': str(settlement),
        'resp_gender': str(gender),
        'head_of_household': str(is_hhh),
        'head_age': int(hhh_age) if isinstance(hhh_age, (int, float)) else 0,
        'family_size': int(members) if isinstance(members, (int, float)) else 0,
        'children_count': int(children) if isinstance(children, (int, float)) else 0,
        'pregnant_lactating': int(plw) if isinstance(plw, (int, float)) else 0,
        'registered_for_aid': str(registered),
        'registered_by_horjooge_gatekeeper': "YES" if is_horjooge else "NO",
        'pays_camp_rent_tax': str(rent),
        'camp_charge_usd': float(rent_amt) if isinstance(rent_amt, (int, float)) else 0.0
    })

print(f"Total surveyed households: {total}")
print(f"Unique settlements covered: {len(settlements)}")
print(f"Households registered by Horjooge Gatekeeper: {horjooge_count} ({horjooge_count/total*100:.1f}%)")
print(f"Female Head of Households: {female_hhh} ({female_hhh/total*100:.1f}%)")
print(f"Average household size: {sum(avg_members)/len(avg_members):.1f} people")
print(f"Average children per household: {sum(avg_children)/len(avg_children):.1f}")

with open('portal/src/data/somalia_reach_households.json', 'w', encoding='utf-8') as f:
    json.dump({
        'metadata': {
            'source': 'REACH Initiative Somalia IDP Settlement Household Assessment',
            'total_households': total,
            'settlements_count': len(settlements),
            'horjooge_gatekeeper_pct': round(horjooge_count / total * 100, 1),
            'avg_family_size': round(sum(avg_members)/len(avg_members), 1)
        },
        'households': h_records
    }, f, indent=2)

print("Saved to portal/src/data/somalia_reach_households.json")
