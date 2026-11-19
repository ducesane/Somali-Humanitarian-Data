import openpyxl
import json
from collections import defaultdict, Counter

wb = openpyxl.load_workbook('hdx_data/iom_dtm_ett_tracker_2026.xlsx', read_only=True)
sheet = wb['Full dataset by assessment']
rows = sheet.iter_rows(values_only=True)
next(rows) # header
next(rows) # tags

ett_by_pcode = defaultdict(lambda: {
    'arrivals': 0, 
    'departures': 0, 
    'males': 0,
    'females': 0,
    'children': 0,
    'causes': Counter(), 
    'needs': Counter(), 
    'origins': Counter()
})

for r in rows:
    pcode = str(r[4]).strip() if r[4] else None # OCHA District Pcode
    arr = r[16] # Total new arrivals
    try: arr_val = int(arr) if arr is not None else 0
    except: arr_val = 0
    
    dep = r[21]
    try: dep_val = int(dep) if dep is not None else 0
    except: dep_val = 0
    
    males = r[17]
    try: m_val = int(males) if males is not None else 0
    except: m_val = 0
    
    females = r[18]
    try: f_val = int(females) if females is not None else 0
    except: f_val = 0
    
    children = r[19]
    try: c_val = int(children) if children is not None else 0
    except: c_val = 0
    
    cause = r[12]
    cause_nat = r[14]
    cause_conf = r[13]
    if cause_nat:
        full_cause = f"{cause_nat}"
    elif cause_conf:
        full_cause = f"{cause_conf}"
    else:
        full_cause = f"{cause}" if cause else "Unspecified"
        
    need = r[39]
    orig_dist = r[37]
    
    if pcode:
        ett_by_pcode[pcode]['arrivals'] += arr_val
        ett_by_pcode[pcode]['departures'] += dep_val
        ett_by_pcode[pcode]['males'] += m_val
        ett_by_pcode[pcode]['females'] += f_val
        ett_by_pcode[pcode]['children'] += c_val
        if full_cause: ett_by_pcode[pcode]['causes'][full_cause] += arr_val
        if need: ett_by_pcode[pcode]['needs'][need] += arr_val
        if orig_dist: ett_by_pcode[pcode]['origins'][orig_dist] += arr_val

with open('map_data_summary.json', 'r', encoding='utf-8') as f:
    map_data = json.load(f)

matched = 0
total_arr = 0

for d_name, d_val in map_data['districts'].items():
    p = d_val.get('adm2_pcode')
    if p in ett_by_pcode:
        e = ett_by_pcode[p]
        matched += 1
        total_arr += e['arrivals']
        top_cause = e['causes'].most_common(1)[0][0] if e['causes'] else 'N/A'
        top_need = e['needs'].most_common(1)[0][0] if e['needs'] else 'N/A'
        top_origin = e['origins'].most_common(1)[0][0] if e['origins'] else 'N/A'
        
        d_val['ett_2026'] = {
            'arrivals': e['arrivals'],
            'departures': e['departures'],
            'males': e['males'],
            'females': e['females'],
            'children': e['children'],
            'top_cause': top_cause,
            'top_need': top_need,
            'top_origin': top_origin,
            'causes_breakdown': dict(e['causes'].most_common(4)),
            'needs_breakdown': dict(e['needs'].most_common(4))
        }
    else:
        d_val['ett_2026'] = {
            'arrivals': 0,
            'departures': 0,
            'top_cause': 'None Recorded',
            'top_need': 'None Recorded',
            'top_origin': 'N/A'
        }

with open('map_data_summary.json', 'w', encoding='utf-8') as f:
    json.dump(map_data, f, indent=2)

print(f"Updated map_data_summary.json successfully!")
print(f"Matched {matched} districts with {total_arr:,} total IDP arrivals recorded June-Nov 2026.")
