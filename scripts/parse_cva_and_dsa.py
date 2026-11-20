import openpyxl
import json
import time
from collections import defaultdict

print("Starting streaming parse of CVA and DSA datasets...", flush=True)

# -------------------------------------------------------------
# 1. PARSE CWG CASH WORKING GROUP RAW 2023 DATASET (17.38 MB)
# -------------------------------------------------------------
t0 = time.time()
cva_file = 'hdx_data/somalia_cwg_4ws_final_raw_dataset_2023.xlsx'
wb_cva = openpyxl.load_workbook(cva_file, read_only=True)
sheet_cva = wb_cva['Somalia CWG 4Ws Data Sheet 2023']

header_cva = next(sheet_cva.iter_rows(values_only=True))
col_map = {name: idx for idx, name in enumerate(header_cva) if name}

idx_org = col_map.get('Organization Name')
idx_status = col_map.get('STATUS')
idx_modality = col_map.get('Cash Modality')
idx_mech = col_map.get('Transfer Mechanism')
idx_val = col_map.get('Transfer Value per Household')
idx_total = col_map.get('Total USD Transferred')
idx_hh = col_map.get('Total Households Reach')
idx_ind = col_map.get('Total Individuals Assisted')
idx_dist = col_map.get('DISTRICT')
idx_reg = col_map.get('REGION')
idx_month = col_map.get('Cash Delivery Month')

district_cva = defaultdict(lambda: {
    'total_usd': 0.0,
    'total_households': 0,
    'total_individuals': 0,
    'mobile_money_usd': 0.0,
    'voucher_usd': 0.0,
    'cash_on_hand_usd': 0.0,
    'other_usd': 0.0,
    'orgs': set(),
    'modalities': set(),
    'records_count': 0,
    'transfer_values': []
})

overall_totals = {
    'total_usd': 0.0,
    'total_hh': 0,
    'total_ind': 0,
    'mobile_money_usd': 0.0,
    'voucher_usd': 0.0,
    'cash_on_hand_usd': 0.0,
    'by_org': defaultdict(float),
    'by_modality': defaultdict(float)
}

row_count = 0
for row in sheet_cva.iter_rows(values_only=True):
    row_count += 1
    dist = row[idx_dist]
    if not dist:
        continue
    dist_clean = str(dist).strip().title()
    org = str(row[idx_org]).strip() if row[idx_org] else 'Unknown'
    mech = str(row[idx_mech]).strip().lower() if row[idx_mech] else 'unknown'
    modality = str(row[idx_modality]).strip() if row[idx_modality] else 'General'

    try:
        usd = float(row[idx_total]) if row[idx_total] else 0.0
    except:
        usd = 0.0
    try:
        hh = int(row[idx_hh]) if row[idx_hh] else 0
    except:
        hh = 0
    try:
        ind = int(row[idx_ind]) if row[idx_ind] else 0
    except:
        ind = 0
    try:
        val = float(row[idx_val]) if row[idx_val] else 0.0
    except:
        val = 0.0

    d = district_cva[dist_clean]
    d['total_usd'] += usd
    d['total_households'] += hh
    d['total_individuals'] += ind
    d['orgs'].add(org)
    d['modalities'].add(modality)
    d['records_count'] += 1
    if val > 0:
        d['transfer_values'].append(val)

    if 'mobile' in mech or 'evc' in mech or 'zaad' in mech or 'sahall' in mech:
        d['mobile_money_usd'] += usd
        overall_totals['mobile_money_usd'] += usd
    elif 'voucher' in mech:
        d['voucher_usd'] += usd
        overall_totals['voucher_usd'] += usd
    elif 'hand' in mech or 'cash' in mech:
        d['cash_on_hand_usd'] += usd
        overall_totals['cash_on_hand_usd'] += usd
    else:
        d['other_usd'] += usd

    overall_totals['total_usd'] += usd
    overall_totals['total_hh'] += hh
    overall_totals['total_ind'] += ind
    overall_totals['by_org'][org] += usd
    overall_totals['by_modality'][modality] += usd

wb_cva.close()
print(f"CVA Parsed: {row_count} rows across {len(district_cva)} districts in {time.time()-t0:.2f}s", flush=True)

# -------------------------------------------------------------
# 2. PARSE REACH DETAILED SITE ASSESSMENT (DSA) 2022 (6.86 MB)
# -------------------------------------------------------------
t1 = time.time()
dsa_file = 'hdx_data/reach_som_dataset_dsa_somalia_february_2022.xlsx'
wb_dsa = openpyxl.load_workbook(dsa_file, read_only=True)
sheet_dsa = wb_dsa['Settlement level dataset']

header_dsa = next(sheet_dsa.iter_rows(values_only=True))
col_dsa_map = {name: idx for idx, name in enumerate(header_dsa) if name}

idx_dsa_dist = col_dsa_map.get('localisation_district_label')
idx_dsa_gatekeeper = col_dsa_map.get('cccm_management.gatekeeper')
idx_dsa_pay_gatekeeper = col_dsa_map.get('foodsecurity_access_barriers.accessing_pay_portion_gatekeeper')
idx_dsa_illegal_tax = col_dsa_map.get('protection_incidents.illegal_tax')
idx_dsa_shelters = col_dsa_map.get('cccm_populationestimates_shelters')
idx_dsa_comm_leader = col_dsa_map.get('cccm_management.comm_leader')
idx_dsa_camp_structure = col_dsa_map.get('camp_structure')

district_dsa = defaultdict(lambda: {
    'total_camps': 0,
    'gatekeeper_camps': 0,
    'comm_leader_camps': 0,
    'pay_gatekeeper_camps': 0,
    'illegal_tax_camps': 0,
    'total_shelters': 0
})

dsa_rows = 0
for row in sheet_dsa.iter_rows(values_only=True):
    dsa_rows += 1
    dist = row[idx_dsa_dist]
    if not dist:
        continue
    dist_clean = str(dist).strip().title()
    s = district_dsa[dist_clean]
    s['total_camps'] += 1

    if row[idx_dsa_gatekeeper] == 1 or row[idx_dsa_gatekeeper] == '1':
        s['gatekeeper_camps'] += 1
    if row[idx_dsa_comm_leader] == 1 or row[idx_dsa_comm_leader] == '1':
        s['comm_leader_camps'] += 1
    if row[idx_dsa_pay_gatekeeper] == 1 or row[idx_dsa_pay_gatekeeper] == '1':
        s['pay_gatekeeper_camps'] += 1
    if row[idx_dsa_illegal_tax] == 1 or row[idx_dsa_illegal_tax] == '1':
        s['illegal_tax_camps'] += 1
    try:
        sh = float(row[idx_dsa_shelters]) if row[idx_dsa_shelters] else 0.0
        s['total_shelters'] += int(sh)
    except:
        pass

wb_dsa.close()
print(f"DSA Parsed: {dsa_rows} settlements across {len(district_dsa)} districts in {time.time()-t1:.2f}s", flush=True)

# -------------------------------------------------------------
# 3. MERGE & COMPUTE AID DIVERSION RISK INDEX
# -------------------------------------------------------------
all_districts = set(district_cva.keys()).union(set(district_dsa.keys()))

districts_analysis = []
for dist in sorted(all_districts):
    c = district_cva.get(dist, {
        'total_usd': 0.0,
        'total_households': 0,
        'total_individuals': 0,
        'mobile_money_usd': 0.0,
        'voucher_usd': 0.0,
        'cash_on_hand_usd': 0.0,
        'other_usd': 0.0,
        'orgs': set(),
        'modalities': set(),
        'records_count': 0,
        'transfer_values': []
    })
    s = district_dsa.get(dist, {
        'total_camps': 0,
        'gatekeeper_camps': 0,
        'comm_leader_camps': 0,
        'pay_gatekeeper_camps': 0,
        'illegal_tax_camps': 0,
        'total_shelters': 0
    })

    total_camps = s['total_camps']
    gk_pct = (s['gatekeeper_camps'] / total_camps * 100) if total_camps > 0 else 0.0
    extort_pct = (s['pay_gatekeeper_camps'] / total_camps * 100) if total_camps > 0 else 0.0
    illegal_tax_pct = (s['illegal_tax_camps'] / total_camps * 100) if total_camps > 0 else 0.0

    # Risk Score Calculation (0 - 100)
    # Factors:
    # 1. Gatekeeper presence % (up to 40 pts)
    # 2. Extortion / pay cut reported % (up to 30 pts)
    # 3. Illegal tax / security incident % (up to 15 pts)
    # 4. Cash volume exposure (up to 15 pts)
    vol_pts = min(15.0, (c['total_usd'] / 5000000.0) * 15.0)
    risk_score = (gk_pct * 0.4) + (extort_pct * 0.3) + (illegal_tax_pct * 0.15) + vol_pts
    risk_score = round(min(100.0, risk_score), 1)

    if risk_score >= 60.0:
        risk_level = 'HIGH'
        color = 'red'
    elif risk_score >= 30.0:
        risk_level = 'MEDIUM'
        color = 'amber'
    else:
        risk_level = 'LOW'
        color = 'green'

    avg_val = round(sum(c['transfer_values']) / len(c['transfer_values']), 1) if c['transfer_values'] else 0.0

    districts_analysis.append({
        'district': dist,
        'total_usd_transferred': round(c['total_usd'], 2),
        'households_reached': c['total_households'],
        'individuals_assisted': c['total_individuals'],
        'mobile_money_usd': round(c['mobile_money_usd'], 2),
        'voucher_usd': round(c['voucher_usd'], 2),
        'cash_on_hand_usd': round(c['cash_on_hand_usd'], 2),
        'active_organizations': sorted(list(c['orgs'])),
        'records_count': c['records_count'],
        'avg_transfer_value_usd': avg_val,
        'idp_camps_count': s['total_camps'],
        'gatekeeper_camps_count': s['gatekeeper_camps'],
        'gatekeeper_prevalence_pct': round(gk_pct, 1),
        'extortion_reported_camps': s['pay_gatekeeper_camps'],
        'extortion_prevalence_pct': round(extort_pct, 1),
        'total_idp_shelters': s['total_shelters'],
        'aid_diversion_risk_score': risk_score,
        'risk_level': risk_level,
        'risk_color': color
    })

# Sort by risk score descending
districts_analysis.sort(key=lambda x: x['aid_diversion_risk_score'], reverse=True)

# -------------------------------------------------------------
# 4. SYNTHETIC REALISTIC BATCH-CASHING EVC AUDIT SAMPLES
# -------------------------------------------------------------
# To empower the interactive live inspector on the portal:
sample_evc_batches = [
    {
        'batch_id': 'EVC-BATCH-84920',
        'district': 'Baidoa',
        'settlement': 'Boonkaay IDP Camp',
        'program': 'Baxnaano / WFP Emergency Cash',
        'official_disbursement_date': '2026-10-14 09:00:00',
        'total_beneficiaries_in_batch': 120,
        'official_amount_per_hh': 60.00,
        'merchant_destination_id': 'MERCH-77491',
        'merchant_registered_name': 'Hormuud Agent - Baidoa Central Hub (M. Nuur)',
        'cashout_window_seconds': 1840, # 30.6 minutes
        'transfers_to_same_merchant': 118,
        'anomalous_velocity_flag': True,
        'suspected_gatekeeper_skimming_rate': 25.0, # $15 cut
        'fraud_risk_score': 98.4,
        'audit_verdict': 'CONFIRMED GATEKEEPER BATCH-CASHING',
        'recommended_action': 'Freeze Merchant ID #MERCH-77491 and conduct urgent field spot-check.'
    },
    {
        'batch_id': 'EVC-BATCH-10492',
        'district': 'Dayniile',
        'settlement': 'Garasbaaley Cluster Camp 4',
        'program': 'Somalia Cash Consortium MPCA',
        'official_disbursement_date': '2026-10-18 10:30:00',
        'total_beneficiaries_in_batch': 85,
        'official_amount_per_hh': 70.00,
        'merchant_destination_id': 'MERCH-20184',
        'merchant_registered_name': 'Bakaara Wholesale Grain & Telecomm',
        'cashout_window_seconds': 1120, # 18.6 minutes
        'transfers_to_same_merchant': 81,
        'anomalous_velocity_flag': True,
        'suspected_gatekeeper_skimming_rate': 30.0, # $21 cut
        'fraud_risk_score': 99.1,
        'audit_verdict': 'CONFIRMED GATEKEEPER BATCH-CASHING',
        'recommended_action': 'Subpoena merchant transaction history; halt tranche 2 payout.'
    },
    {
        'batch_id': 'EVC-BATCH-38291',
        'district': 'Gebiley',
        'settlement': 'Tog Wajaale Rural Agro-Pastoral',
        'program': 'UNICEF Nutrition-Linked Cash',
        'official_disbursement_date': '2026-10-22 08:15:00',
        'total_beneficiaries_in_batch': 95,
        'official_amount_per_hh': 55.00,
        'merchant_destination_id': 'DISTRIBUTED (34 distinct merchants)',
        'merchant_registered_name': 'Normal P2P Community Cashouts',
        'cashout_window_seconds': 864000, # 10 days
        'transfers_to_same_merchant': 4,
        'anomalous_velocity_flag': False,
        'suspected_gatekeeper_skimming_rate': 0.0,
        'fraud_risk_score': 4.2,
        'audit_verdict': 'VERIFIED COMPLIANT / GENUINE RECIPIENTS',
        'recommended_action': 'Approve final cycle reconciliation.'
    },
    {
        'batch_id': 'EVC-BATCH-59124',
        'district': 'Galkacyo',
        'settlement': 'Bacadweyn Settlement / Mudug',
        'program': 'FAO-SWALIM / Climate Shock Support',
        'official_disbursement_date': '2026-10-25 11:00:00',
        'total_beneficiaries_in_batch': 60,
        'official_amount_per_hh': 90.00,
        'merchant_destination_id': 'DISTRIBUTED (18 distinct merchants)',
        'merchant_registered_name': 'Mixed Village Retailers & Livestock Markets',
        'cashout_window_seconds': 432000, # 5 days
        'transfers_to_same_merchant': 6,
        'anomalous_velocity_flag': False,
        'suspected_gatekeeper_skimming_rate': 0.0,
        'fraud_risk_score': 8.5,
        'audit_verdict': 'VERIFIED COMPLIANT / NORMAL VELOCITY',
        'recommended_action': 'Disburse next scheduled tranche.'
    }
]

# -------------------------------------------------------------
# 5. ASSEMBLE FULL EXPORT OBJECT
# -------------------------------------------------------------
top_orgs = sorted(overall_totals['by_org'].items(), key=lambda x: x[1], reverse=True)[:15]

output_payload = {
    'summary': {
        'total_usd_transferred': round(overall_totals['total_usd'], 2),
        'total_households_reached': overall_totals['total_hh'],
        'total_individuals_assisted': overall_totals['total_ind'],
        'mobile_money_usd': round(overall_totals['mobile_money_usd'], 2),
        'mobile_money_pct': round((overall_totals['mobile_money_usd'] / overall_totals['total_usd'] * 100) if overall_totals['total_usd'] else 0, 1),
        'voucher_usd': round(overall_totals['voucher_usd'], 2),
        'cash_on_hand_usd': round(overall_totals['cash_on_hand_usd'], 2),
        'total_districts_tracked': len(districts_analysis),
        'high_risk_districts_count': len([d for d in districts_analysis if d['risk_level'] == 'HIGH']),
        'medium_risk_districts_count': len([d for d in districts_analysis if d['risk_level'] == 'MEDIUM']),
        'low_risk_districts_count': len([d for d in districts_analysis if d['risk_level'] == 'LOW'])
    },
    'top_cash_organizations': [{'org': k, 'total_usd': round(v, 2)} for k, v in top_orgs],
    'districts': districts_analysis,
    'sample_evc_forensic_batches': sample_evc_batches
}

out_path = 'portal/src/data/somalia_cva_audit_data.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, indent=2)

print(f"Successfully generated {out_path} ({len(json.dumps(output_payload))} bytes)!", flush=True)
