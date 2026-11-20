import json
import re

with open('somalia_ungm_all_unique_awards.json', 'r', encoding='utf-8') as f:
    awards = json.load(f)

with open('portal/src/data/undp_somalia_vendors.json', 'r', encoding='utf-8') as f:
    undp_vendors = json.load(f)

def strip_legal(name):
    if not name: return ""
    n = name.lower()
    n = re.sub(r'\b(ltd|limited|llc|fze|fzco|co|corp|corporation|inc|dmcc|bv|a/s|gmbh|sa|holding|holdings|stockholdings|plc|company|com|and|&)\b', '', n)
    n = re.sub(r'[\.,\-\(\)\'\"\/\_\:]', ' ', n)
    return re.sub(r'\s+', ' ', n).strip()

undp_index = []
for v in undp_vendors:
    undp_index.append({
        'vendor': v,
        'clean': strip_legal(v['name']),
        'name': v['name'],
        'slug': v['slug']
    })

# Blacklist words that are NOT company distinct identifiers
DISALLOWED_STEMS = {
    'somali', 'somalia', 'mogadishu', 'global', 'horn', 'research', 
    'east', 'africa', 'international', 'general', 'trading', 'construction', 
    'logistics', 'services', 'service', 'group', 'consultant', 'consulting',
    'consultants', 'engineering', 'solutions', 'contracting', 'contractor',
    'bureau', 'development', 'management', 'enterprises', 'supplies', 'supply'
}

clean_mapped_awards = []
matched_count = 0

for a in awards:
    supplier = a.get('supplier', '')
    clean_sup = strip_legal(supplier)
    
    matched_vendor = None
    match_type = ""
    
    # 1. Exact clean match
    for item in undp_index:
        if clean_sup == item['clean']:
            matched_vendor = item['vendor']
            match_type = "Exact Commercial Match"
            break
            
    # 2. Distinct brand stem match
    if not matched_vendor:
        sup_stems = [w for w in clean_sup.split() if len(w) >= 4 and w not in DISALLOWED_STEMS]
        if sup_stems:
            for item in undp_index:
                v_stems = [w for w in item['clean'].split() if len(w) >= 4 and w not in DISALLOWED_STEMS]
                # If first 2 distinct stems match or unique single brand stem matches
                if len(sup_stems) >= 2 and len(v_stems) >= 2:
                    if sup_stems[0] == v_stems[0] and sup_stems[1] == v_stems[1]:
                        matched_vendor = item['vendor']
                        match_type = f"Brand Match: '{' '.join(sup_stems[:2])}'"
                        break
                elif len(sup_stems) >= 1 and len(v_stems) >= 1:
                    # Single distinct brand stem of at least 5 letters, e.g. "bulaale", "danimex", "intertrade", "tsamota"
                    if len(sup_stems[0]) >= 5 and sup_stems[0] == v_stems[0]:
                        matched_vendor = item['vendor']
                        match_type = f"Primary Brand Stem: '{sup_stems[0]}'"
                        break

    award_record = dict(a)
    if matched_vendor:
        matched_count += 1
        award_record['is_matched'] = True
        award_record['match_type'] = match_type
        award_record['undp_vendor'] = {
            'name': matched_vendor['name'],
            'slug': matched_vendor['slug'],
            'total_amount': matched_vendor['total_amount'],
            'orders_count': matched_vendor['orders_count'],
            'projects_count': matched_vendor['projects_count'],
            'first_activity': matched_vendor.get('first_activity', 'N/A'),
            'latest_activity': matched_vendor.get('latest_activity', 'N/A'),
            'operating_locations': matched_vendor.get('operating_locations', [])
        }
    else:
        award_record['is_matched'] = False
        award_record['match_type'] = "Cross-Agency UN Winner"
        award_record['undp_vendor'] = None
        
    clean_mapped_awards.append(award_record)

print(f"\nFinal Verified Matches: {matched_count} / {len(clean_mapped_awards)} awards")

# Sort: matched awards first, then award date descending
clean_mapped_awards.sort(key=lambda x: (1 if x['is_matched'] else 0, x.get('award_date', '')), reverse=True)

with open('portal/src/data/somalia_contract_awards_mapped.json', 'w', encoding='utf-8') as f:
    json.dump(clean_mapped_awards, f, indent=2)

print("Saved clean mapped awards to portal/src/data/somalia_contract_awards_mapped.json")

print("\n--- Summary of Verified Mapped Contract Winners ---")
for m in [a for a in clean_mapped_awards if a['is_matched']]:
    v = m['undp_vendor']
    print(f"[{m['agency']}] {m['award_date']} -> Winner: '{m['supplier']}'")
    print(f"  Mapped to UNDP: '{v['name']}' (Slug: /vendors/{v['slug']} | ${v['total_amount']:,.2f} | {v['orders_count']} POs)")
    print(f"  Title: {m['title']}")
    print(f"  URL: {m['url']}\n")
