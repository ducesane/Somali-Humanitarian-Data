import json

with open('portal/src/data/somalia_cva_audit_data.json', 'r') as f:
    d = json.load(f)

districts = sorted(d['districts'], key=lambda x: x['total_usd_transferred'], reverse=True)

print(f"Total districts: {len(districts)}")
print("| District | Total Transferred (USD) | Mobile Money (USD) | Voucher (USD) | Households | IDP Camps Count | Gatekeeper Camps | Total Shelters | Active Implementers |")
print("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |")

for dist in districts:
    if dist['total_usd_transferred'] == 0 and dist['idp_camps_count'] == 0:
        continue
    orgs_str = ", ".join(dist['active_organizations'][:3])
    if len(dist['active_organizations']) > 3:
        orgs_str += f" (+{len(dist['active_organizations'])-3} more)"
    if not orgs_str:
        orgs_str = "None Recorded"
    
    gk_str = f"{dist['gatekeeper_camps_count']} ({dist['gatekeeper_prevalence_pct']:.0f}%)" if dist['idp_camps_count'] > 0 else "0 (0%)"
    
    print(f"| **{dist['district']}** | ${dist['total_usd_transferred']:,.0f} | ${dist['mobile_money_usd']:,.0f} | ${dist['voucher_usd']:,.0f} | {dist['households_reached']:,} | {dist['idp_camps_count']} | {gk_str} | {dist['total_idp_shelters']:,} | {orgs_str} |")
