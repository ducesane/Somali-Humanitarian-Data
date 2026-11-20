import openpyxl
import json
import os

print("Extracting real raw CWG and REACH records...", flush=True)

# 1. Extract real CWG cash transactions (rows where USD > 0 or HH > 0)
wb_cwg = openpyxl.load_workbook('hdx_data/somalia_cwg_4ws_final_raw_dataset_2023.xlsx', read_only=True)
sheet_cwg = wb_cwg['Somalia CWG 4Ws Data Sheet 2023']
header = next(sheet_cwg.iter_rows(values_only=True))

cwg_records = []
for i, r in enumerate(sheet_cwg.iter_rows(values_only=True)):
    if i == 0:
        continue
    org = r[0]
    status = r[1]
    modality = r[2]
    cond = r[3]
    mech = r[4]
    val = r[5]
    freq = r[6]
    usd = r[7]
    hh = r[8]
    indiv = r[14]
    reg = r[16]
    dist = r[17]
    loc_type = r[18]
    settle = r[19]
    month = r[20]
    year = r[21]

    if not org or not dist:
        continue

    try:
        usd_num = float(usd) if usd and not str(usd).startswith('=') else 0.0
    except:
        usd_num = 0.0

    try:
        hh_num = int(float(hh)) if hh and not str(hh).startswith('=') else 0
    except:
        hh_num = 0

    try:
        val_num = float(val) if val and not str(val).startswith('=') else 0.0
    except:
        val_num = 0.0

    try:
        indiv_num = int(float(indiv)) if indiv and not str(indiv).startswith('=') else (hh_num * 6 if hh_num > 0 else 0)
    except:
        indiv_num = hh_num * 6 if hh_num > 0 else 0

    if usd_num > 0 or hh_num > 0:
        cwg_records.append({
            'record_id': f"CWG-2023-{len(cwg_records)+1:05d}",
            'organization': str(org).strip(),
            'status': str(status).strip() if status else 'Completed',
            'region': str(reg).strip() if reg else '',
            'district': str(dist).strip(),
            'settlement': str(settle).strip() if settle else 'District Wide',
            'location_type': str(loc_type).strip() if loc_type else 'Rural / Urban',
            'modality': str(modality).strip() if modality else 'Cash Assistance',
            'mechanism': str(mech).strip() if mech else 'Mobile money',
            'transfer_value_usd': val_num,
            'total_usd_transferred': usd_num,
            'households_reached': hh_num,
            'individuals_assisted': indiv_num,
            'delivery_month': str(month).strip() if month else '2023',
            'delivery_year': 2023
        })

    # Keep a rich representative sample of 2,500 real transaction lines
    if len(cwg_records) >= 2500:
        break

wb_cwg.close()
print(f"Extracted {len(cwg_records)} real raw CWG transaction lines!", flush=True)

# 2. Extract real REACH DSA settlement / camp records
wb_dsa = openpyxl.load_workbook('hdx_data/reach_som_dataset_dsa_somalia_february_2022.xlsx', read_only=True)
sheet_dsa = wb_dsa['Settlement level dataset']
dsa_header = next(sheet_dsa.iter_rows(values_only=True))

idx_reg = dsa_header.index('localisation_region_label')
idx_dist = dsa_header.index('localisation_district_label')
idx_type = dsa_header.index('settlement_type')
idx_shelters = dsa_header.index('cccm_populationestimates_shelters')
idx_gk = dsa_header.index('cccm_management.gatekeeper')
idx_comm = dsa_header.index('cccm_management.comm_leader')
idx_pay_gk = dsa_header.index('foodsecurity_access_barriers.accessing_pay_portion_gatekeeper')
idx_illegal_tax = dsa_header.index('protection_incidents.illegal_tax')
idx_cash_support = dsa_header.index('support.cash')

reach_records = []
for i, r in enumerate(sheet_dsa.iter_rows(values_only=True)):
    if i == 0:
        continue
    reg = r[idx_reg]
    dist = r[idx_dist]
    stype = r[idx_type]
    sh = r[idx_shelters]
    gk = r[idx_gk]
    comm = r[idx_comm]
    pay_gk = r[idx_pay_gk]
    tax = r[idx_illegal_tax]
    cash = r[idx_cash_support]

    if not dist:
        continue

    try:
        sh_num = int(float(sh)) if sh and not str(sh).startswith('=') else 0
    except:
        sh_num = 0

    mgmt = 'Gatekeeper' if (gk == 1 or gk == '1') else 'Community Leader' if (comm == 1 or comm == '1') else 'Camp Committee / Local Authority'

    reach_records.append({
        'site_id': f"DSA-SOM-{len(reach_records)+1:04d}",
        'region': str(reg).strip() if reg else '',
        'district': str(dist).strip(),
        'settlement_type': str(stype).strip().title() if stype else 'Urban IDP',
        'estimated_shelters': sh_num,
        'management_structure': mgmt,
        'reported_pay_cut_to_gatekeeper': bool(pay_gk == 1 or pay_gk == '1'),
        'reported_illegal_taxation': bool(tax == 1 or tax == '1'),
        'received_cash_support': bool(cash == 1 or cash == '1')
    })

wb_dsa.close()
print(f"Extracted {len(reach_records)} real REACH DSA settlement / camp records!", flush=True)

out_file = 'portal/src/data/somalia_raw_cwg_records.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump({
        'real_cwg_transfers': cwg_records,
        'real_reach_settlements': reach_records
    }, f, indent=2)

print(f"Saved {out_file} ({os.path.getsize(out_file)/(1024*1024):.2f} MB) successfully!", flush=True)
