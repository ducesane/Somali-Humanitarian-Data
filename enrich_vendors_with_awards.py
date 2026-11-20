import json

with open('portal/src/data/somalia_contract_awards_mapped.json', 'r', encoding='utf-8') as f:
    awards = json.load(f)

with open('portal/src/data/undp_somalia_vendors.json', 'r', encoding='utf-8') as f:
    vendors = json.load(f)

# Group awards by vendor slug
awards_by_vendor_slug = {}
for a in awards:
    if a.get('is_matched') and a.get('undp_vendor'):
        slug = a['undp_vendor']['slug']
        if slug not in awards_by_vendor_slug:
            awards_by_vendor_slug[slug] = []
        awards_by_vendor_slug[slug].append({
            'award_id': a['award_id'],
            'title': a['title'],
            'agency': a['agency'],
            'award_date': a['award_date'],
            'reference': a['reference'],
            'url': a['url']
        })

print(f"Total vendors with matched UNGM awards: {len(awards_by_vendor_slug)}")
for slug, aw_list in awards_by_vendor_slug.items():
    print(f"  - {slug}: {len(aw_list)} awards won")

# Enrich vendors
enriched_count = 0
for v in vendors:
    slug = v['slug']
    if slug in awards_by_vendor_slug:
        v['ungm_awards'] = awards_by_vendor_slug[slug]
        enriched_count += 1
    else:
        v['ungm_awards'] = []

print(f"Enriched {enriched_count} vendors with UNGM award history!")
with open('portal/src/data/undp_somalia_vendors.json', 'w', encoding='utf-8') as f:
    json.dump(vendors, f, indent=2)

print("Saved updated undp_somalia_vendors.json")
