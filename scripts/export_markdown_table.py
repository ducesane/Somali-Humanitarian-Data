import json

with open('portal/src/data/somalia_cva_audit_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

districts = sorted(d['districts'], key=lambda x: x['total_usd_transferred'], reverse=True)
valid = [x for x in districts if (x['total_usd_transferred'] > 0 or x['idp_camps_count'] > 0) and x['district'] != 'Localisation_District_Label']

lines = []
lines.append("| District | Total Transferred (USD) | Mobile Money (USD) | Voucher (USD) | Households | IDP Camps Count | Gatekeeper Camps | Total Shelters | Active Implementers |")
lines.append("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |")

for dist in valid:
    orgs_str = ", ".join(dist['active_organizations'][:2])
    if len(dist['active_organizations']) > 2:
        orgs_str += f" (+{len(dist['active_organizations'])-2} more)"
    if not orgs_str:
        orgs_str = "None Recorded"
    
    gk_pct = f"{dist['gatekeeper_prevalence_pct']:.0f}%"
    gk_str = f"{dist['gatekeeper_camps_count']} ({gk_pct})" if dist['idp_camps_count'] > 0 else "0 (0%)"
    
    tot_usd = f"${dist['total_usd_transferred']:,.0f}"
    mob_usd = f"${dist['mobile_money_usd']:,.0f}"
    vouch_usd = f"${dist['voucher_usd']:,.0f}"
    hh = f"{dist['households_reached']:,}"
    shelters = f"{dist['total_idp_shelters']:,}"
    
    lines.append(f"| **{dist['district']}** | {tot_usd} | {mob_usd} | {vouch_usd} | {hh} | {dist['idp_camps_count']} | {gk_str} | {shelters} | {orgs_str} |")

with open('portal/src/data/somalia_district_real_table.md', 'w', encoding='utf-8') as out:
    out.write("\n".join(lines))

print("Successfully written", len(lines), "rows to portal/src/data/somalia_district_real_table.md")
