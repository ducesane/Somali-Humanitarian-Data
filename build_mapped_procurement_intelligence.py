import json
import re

with open('portal/src/data/somalia_ungm_notices.json', 'r', encoding='utf-8') as f:
    notices = json.load(f)

with open('portal/src/data/undp_somalia_vendors.json', 'r', encoding='utf-8') as f:
    vendors = json.load(f)

with open('portal/src/data/undp_somalia_projects_documents.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Helper to find vendor by keyword or slug
vendor_by_name = {v['name'].lower(): v for v in vendors}

def find_vendors(keywords, limit=4):
    matched = []
    seen = set()
    for kw in keywords:
        for v in vendors:
            if v['name'] in seen:
                continue
            # Search in vendor name or order descriptions
            name_match = kw.lower() in v['name'].lower()
            order_match = any(kw.lower() in o.get('description', '').lower() for o in v.get('orders', []))
            if name_match or order_match:
                seen.add(v['name'])
                matched.append({
                    'name': v['name'],
                    'slug': v['slug'],
                    'total_amount': v['total_amount'],
                    'orders_count': v['orders_count'],
                    'operating_locations': v.get('operating_locations', [])
                })
                if len(matched) >= limit:
                    return matched
    return matched

def find_projects(keywords, limit=3):
    matched = []
    seen = set()
    for kw in keywords:
        for p in projects:
            if p['id'] in seen:
                continue
            title = p.get('title', '').lower()
            desc = p.get('description', '').lower()
            if kw.lower() in title or kw.lower() in desc:
                seen.add(p['id'])
                matched.append({
                    'id': p['id'],
                    'title': p.get('title')
                })
                if len(matched) >= limit:
                    return matched
    return matched

# Map each notice
mapped_pipeline = []

for n in notices:
    title = n['title']
    title_lower = title.lower()
    
    # 1. Determine Sector & Location
    sector = "General Procurement"
    location = "Somalia Nationwide / Multi-hub"
    matched_vendors = []
    matched_projects = []
    
    # Locations detection
    if 'mudug' in title_lower or 'saaxo' in title_lower:
        location = "Saaxo, Mudug (Puntland)"
    elif 'jowhar' in title_lower or 'hirshabelle' in title_lower:
        location = "Jowhar, Middle Shabelle (Hirshabelle)"
    elif 'wisil' in title_lower or 'bahdo' in title_lower:
        location = "Wisil & Bahdo (Galmudug)"
    elif 'garowe' in title_lower:
        location = "Garowe (Puntland)"
    elif 'bossaso' in title_lower or 'bosaso' in title_lower:
        location = "Bossaso, Bari (Puntland)"
    elif 'hargeisa' in title_lower or 'somaliland' in title_lower:
        location = "Hargeisa (Somaliland)"
    elif 'beledwein' in title_lower or 'beledweyne' in title_lower:
        location = "Beledweyne, Hiran (Hirshabelle)"
    elif 'afgooye' in title_lower:
        location = "Afgooye, Lower Shabelle (South West State)"
    elif 'mogadishu' in title_lower or 'banadir' in title_lower:
        location = "Mogadishu (Banadir)"
    elif 'air' in title_lower or 'cargo' in title_lower or 'freight' in title_lower:
        location = "Strategic Air / Sea Ports (Mogadishu, Berbera, Bosaso)"

    # Sector & Vendor Mapping
    if any(k in title_lower for k in ['construction', 'clinic', 'barrage', 'rehabilitation', 'building', 'interlocking', 'infrastructure', 'dispensary']):
        sector = "Infrastructure & Civil Works"
        matched_vendors = find_vendors(['construction', 'gobanle', 'docol', 'hiraal', 'engineering', 'contractor'])
        matched_projects = find_projects(['governance', 'infrastructure', 'stabilization', 'dowlad-kaab'])
    elif any(k in title_lower for k in ['air charter', 'transportation', 'freight', 'cargo', 'road freight', 'logistics', 'surface transportation']):
        sector = "Logistics, Air & Freight Transport"
        matched_vendors = find_vendors(['wfp', 'toyota', 'transport', 'logistics', 'aviation', 'freight'])
        matched_projects = find_projects(['logistics', 'joint programme', 'response', 'operations'])
    elif any(k in title_lower for k in ['medicine', 'medical', 'cancer', 'health', 'clinic', 'laboratory', 'diabetes', 'schistosomiasis']):
        sector = "Health, Medical & Pharmaceuticals"
        matched_vendors = find_vendors(['medico', 'health', 'pharma', 'medical', 'hospital', 'clinic'])
        matched_projects = find_projects(['health', 'covid', 'social', 'resilience'])
    elif any(k in title_lower for k in ['digital', 'software', 'technology', 'rfid', 'seo', 'r shiny', 'data catalog', 'it equipment', 'broadcast monitoring', 'content tracking']):
        sector = "Digital, IT & Media Communications"
        matched_vendors = find_vendors(['media', 'dalsan', 'arkaan', 'shaqodoon', 'consulting', 'tech', 'telecom'])
        matched_projects = find_projects(['media', 'bilan', 'digital', 'innovation', 'youth'])
    elif any(k in title_lower for k in ['tvet', 'curriculum', 'training', 'consultant', 'evaluation', 'collaborator', 'advisory', 'asset management', 'carbon project', 'loss and damage', 'living wage']):
        sector = "Technical Advisory, TVET & TPM"
        matched_vendors = find_vendors(['ctg', 'deloitte', 'researchcare', 'consultant', 'farsight', 'altai'])
        matched_projects = find_projects(['rule of law', 'dowlad-kaab', 'justice', 'saameynta'])
    elif any(k in title_lower for k in ['flood', 'el ni', 'nfi', 'waste', 'disaster', 'shelter', 'food', 'fish processing', 'kits']):
        sector = "Emergency Response, Food & WASH"
        matched_vendors = find_vendors(['aid', 'relief', 'development', 'trading', 'dardo', 'supply'])
        matched_projects = find_projects(['rapid response', 'drought', 'flood', 'climate', 'emergency'])
    else:
        sector = "Specialized Supply & Services"
        matched_vendors = find_vendors(['global', 'services', 'trading', 'supply'])
        matched_projects = find_projects(['joint programme', 'development', 'community'])

    # Format deadline cleanly
    raw_deadline = n['deadline'].replace('\n', ' ').strip()
    raw_deadline = re.sub(r'\s+', ' ', raw_deadline)

    mapped_pipeline.append({
        'id': n['id'],
        'title': n['title'],
        'agency': n['agency'],
        'notice_type': n['notice_type'],
        'reference': n['reference'],
        'published_date': n['published_date'],
        'deadline': raw_deadline,
        'url': n['url'],
        'sector': sector,
        'location': location,
        'matched_vendors': matched_vendors[:4],
        'matched_projects': matched_projects[:3]
    })

print(f"Mapped {len(mapped_pipeline)} notices to sectors, vendors, and projects!")
with open('portal/src/data/somalia_procurement_pipeline.json', 'w', encoding='utf-8') as f:
    json.dump(mapped_pipeline, f, indent=2)

print("Saved to portal/src/data/somalia_procurement_pipeline.json")
