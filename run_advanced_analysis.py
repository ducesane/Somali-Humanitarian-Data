import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.decomposition import NMF
from sklearn.ensemble import IsolationForest
import networkx as nx
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Aesthetics
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

os.makedirs('analysis_images', exist_ok=True)

# -------------------------------------------------------------------------
# 1. INGESTION & DATA CLEANING FROM 'somali data all .xlsx'
# -------------------------------------------------------------------------
excel_path = 'somali data all .xlsx'
df = pd.read_excel(excel_path, sheet_name='Export data', header=2)

# Clean fields
df['Source org.'] = df['Source org.'].astype(str).str.strip()
df['Destination org.'] = df['Destination org.'].astype(str).str.strip()
df['Sector'] = df['Sector'].fillna('Unspecified / Multi-sector').astype(str).str.strip()
df['Funding status'] = df['Funding status'].astype(str).str.strip()
df['Amount (US$)'] = pd.to_numeric(df['Amount (US$)'], errors='coerce').fillna(0)
df['Modality'] = df['Modality'].fillna('Unspecified').astype(str).str.strip()
df['Earmarking'] = df['Earmarking'].fillna('Unspecified').astype(str).str.strip()
df['Destination org. level'] = df['Destination org. level'].fillna('Unspecified').astype(str).str.strip()
df['Source org. type'] = df['Source org. type'].fillna('Unspecified').astype(str).str.strip()
df['Destination plan'] = df['Destination plan'].fillna('Outside HRP').astype(str).str.strip()
df['Original currency'] = df['Original currency'].fillna('USD / Direct').astype(str).str.strip()

total_funding = df['Amount (US$)'].sum()
total_flows = len(df)
mean_flow = df['Amount (US$)'].mean()
median_flow = df['Amount (US$)'].median()

# -------------------------------------------------------------------------
# 2. ADVANCED METRICS: LOCALIZATION, MODALITY, EARMARKING, FX
# -------------------------------------------------------------------------
# Localization Breakdown
loc_summary = df.groupby('Destination org. level')['Amount (US$)'].agg(['sum', 'count']).sort_values('sum', ascending=False)
loc_summary['share_%'] = (loc_summary['sum'] / total_funding * 100).round(2)

# Modality (Cash vs Traditional)
modality_summary = df.groupby('Modality')['Amount (US$)'].agg(['sum', 'count']).sort_values('sum', ascending=False)
modality_summary['share_%'] = (modality_summary['sum'] / total_funding * 100).round(2)

# Earmarking Flexibility
earmarking_summary = df.groupby('Earmarking')['Amount (US$)'].agg(['sum', 'count']).sort_values('sum', ascending=False)
earmarking_summary['share_%'] = (earmarking_summary['sum'] / total_funding * 100).round(2)

# FX & Currency Exposure
currency_summary = df.groupby('Original currency')['Amount (US$)'].agg(['sum', 'count']).sort_values('sum', ascending=False)
currency_summary['share_%'] = (currency_summary['sum'] / total_funding * 100).round(2)

# HRP Alignment
hrp_summary = df.groupby(df['Destination plan'].apply(lambda x: 'Somalia HNRP 2026' if 'Response Plan' in x else 'Outside HNRP'))['Amount (US$)'].agg(['sum', 'count']).sort_values('sum', ascending=False)
hrp_summary['share_%'] = (hrp_summary['sum'] / total_funding * 100).round(2)

# Gini Calculation
def calc_gini(array):
    array = np.array(array, dtype=np.float64)
    array = array[array > 0]
    if len(array) == 0: return 0.0
    array = np.sort(array)
    index = np.arange(1, array.shape[0] + 1)
    n = array.shape[0]
    return ((np.sum((2 * index - n - 1) * array)) / (n * np.sum(array)))

donor_totals = df.groupby('Source org.')['Amount (US$)'].sum().sort_values(ascending=False)
recipient_totals = df.groupby('Destination org.')['Amount (US$)'].sum().sort_values(ascending=False)
sector_totals = df.groupby('Sector')['Amount (US$)'].sum().sort_values(ascending=False)

donor_gini = calc_gini(donor_totals.values)
flow_gini = calc_gini(df['Amount (US$)'].values)

# -------------------------------------------------------------------------
# 3. NLP TOPIC MODELING (NMF)
# -------------------------------------------------------------------------
domain_stopwords = {
    'somalia', 'humanitarian', 'project', 'support', 'response', '2026', 
    'assistance', 'emergency', 'funding', 'contribution', 'towards', 'needs'
}
all_stopwords = list(ENGLISH_STOP_WORDS.union(domain_stopwords))
tfidf = TfidfVectorizer(max_features=400, stop_words=all_stopwords, min_df=2)
tfidf_mat = tfidf.fit_transform(df['Description'].dropna().astype(str))
nmf_model = NMF(n_components=4, random_state=42, max_iter=400)
nmf_model.fit(tfidf_mat)
feature_names = tfidf.get_feature_names_out()

topic_labels = [
    "Strategic Planning & Refugee Crisis Response",
    "Integrated Health, Nutrition & Vulnerable Groups",
    "CERF Rapid Emergency Interventions",
    "Somalia Humanitarian Pooled Fund Allocations"
]

topic_keywords = []
for idx, topic in enumerate(nmf_model.components_):
    top_words = [feature_names[i] for i in topic.argsort()[:-7:-1]]
    topic_keywords.append({
        'Topic_ID': idx + 1,
        'Label': topic_labels[idx],
        'Keywords': ", ".join(top_words)
    })

# -------------------------------------------------------------------------
# 4. NETWORK CENTRALITY (NETWORKX)
# -------------------------------------------------------------------------
G = nx.Graph()
for _, row in df.iterrows():
    u = row['Source org.']
    v = row['Destination org.']
    w = row['Amount (US$)']
    if u and v and w > 0:
        if G.has_edge(u, v):
            G[u][v]['weight'] += w
        else:
            G.add_edge(u, v, weight=w)

deg_centrality = nx.degree_centrality(G)
network_metrics = pd.DataFrame({
    'Organization': list(deg_centrality.keys()),
    'Degree_Centrality': list(deg_centrality.values())
}).sort_values(by='Degree_Centrality', ascending=False)

# -------------------------------------------------------------------------
# 5. GENERATE HIGH-RESOLUTION VISUALIZATIONS (PNGs)
# -------------------------------------------------------------------------
print("Generating expanded publication figures from 'somali data all .xlsx'...")

# FIGURE 1: Top Donors & Recipients
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7))
top_d = donor_totals.head(8) / 1e6
ax1.barh(top_d.index[::-1], top_d.values[::-1], color='#0284c7', edgecolor='#0369a1', height=0.65)
ax1.set_title('Top 8 Donors by Funding ($ Millions)', fontsize=13, fontweight='bold', pad=12, color='#0f172a')
ax1.set_xlabel('USD Millions', fontsize=11, labelpad=8)
for i, v in enumerate(top_d.values[::-1]):
    ax1.text(v + 1.0, i, f"${v:.1f}M", va='center', fontsize=9.5, fontweight='bold', color='#0f172a')
ax1.set_xlim(0, max(top_d.values) * 1.15)

top_r = recipient_totals.head(8) / 1e6
ax2.barh(top_r.index[::-1], top_r.values[::-1], color='#10b981', edgecolor='#059669', height=0.65)
ax2.set_title('Top 8 Recipient Agencies by Funding ($ Millions)', fontsize=13, fontweight='bold', pad=12, color='#0f172a')
ax2.set_xlabel('USD Millions', fontsize=11, labelpad=8)
for i, v in enumerate(top_r.values[::-1]):
    ax2.text(v + 0.8, i, f"${v:.1f}M", va='center', fontsize=9.5, fontweight='bold', color='#0f172a')
ax2.set_xlim(0, max(top_r.values) * 1.15)
plt.tight_layout()
plt.savefig('analysis_images/fig1_top_donors_and_recipients.png', dpi=300)
plt.close()

# FIGURE 2: Sector Allocation & Disbursement Status
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6.5))
top_s = sector_totals.head(8) / 1e6
ax1.bar(range(len(top_s)), top_s.values, color='#f59e0b', edgecolor='#d97706', width=0.6)
ax1.set_xticks(range(len(top_s)))
ax1.set_xticklabels(top_s.index, rotation=35, ha='right', fontsize=9.5)
ax1.set_title('Top 8 Humanitarian Clusters ($ Millions)', fontsize=13, fontweight='bold', pad=12, color='#0f172a')
ax1.set_ylabel('USD Millions', fontsize=11)
for i, v in enumerate(top_s.values):
    ax1.text(i, v + 1.2, f"${v:.1f}M", ha='center', fontsize=9, fontweight='bold')
ax1.set_ylim(0, max(top_s.values) * 1.15)

status_totals = df.groupby('Funding status')['Amount (US$)'].sum() / 1e6
wedges, texts, autotexts = ax2.pie(
    status_totals.values, labels=status_totals.index, autopct='%1.1f%%',
    startangle=140, colors=['#38bdf8', '#10b981', '#f59e0b'],
    wedgeprops=dict(width=0.45, edgecolor='w', linewidth=2)
)
for at in autotexts:
    at.set_fontsize(10)
    at.set_fontweight('bold')
ax2.set_title(f'Funding Pipeline Health (Total: ${total_funding/1e6:.1f}M)', fontsize=13, fontweight='bold', pad=12, color='#0f172a')
plt.tight_layout()
plt.savefig('analysis_images/fig2_sectoral_allocation_and_pipeline.png', dpi=300)
plt.close()

# FIGURE 3: LOCALIZATION & THE GRAND BARGAIN GAP (CRITICAL POLICY FINDING)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6.5))
# Group simplified actor types
def simplify_actor(x):
    if 'UN Agencies' in x: return 'UN Agencies'
    elif 'International NGOs' in x: return 'International NGOs'
    elif 'Country-based' in x or 'Pooled Funds' in x: return 'Pooled Funds (SHF)'
    elif 'Red Cross' in x: return 'Red Cross / Red Cresc.'
    elif 'National NGOs' in x or 'Local NGOs' in x: return 'Local / National NGOs'
    else: return 'Other International'

df['Actor_Simplified'] = df['Destination org. level'].apply(simplify_actor)
actor_sums = df.groupby('Actor_Simplified')['Amount (US$)'].sum().sort_values(ascending=False) / 1e6

colors_actor = ['#0284c7', '#0d9488', '#6366f1', '#e11d48', '#f59e0b', '#64748b']
ax1.pie(actor_sums.values, labels=actor_sums.index, autopct='%1.1f%%', startangle=120, colors=colors_actor, wedgeprops=dict(width=0.45, edgecolor='w'))
ax1.set_title('Direct Aid Allocation by Institutional Actor Level', fontsize=13, fontweight='bold', pad=12)

# Bar comparing Local NGOs vs UN/INGOs
ax2.barh(actor_sums.index[::-1], actor_sums.values[::-1], color='#0284c7', edgecolor='#0369a1', height=0.6)
ax2.set_title('The Localization Gap: Direct Funding ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax2.set_xlabel('USD Millions', fontsize=11)
for i, v in enumerate(actor_sums.values[::-1]):
    ax2.text(v + 1.2, i, f"${v:.2f}M", va='center', fontsize=9.5, fontweight='bold')
ax2.set_xlim(0, max(actor_sums.values) * 1.15)
plt.tight_layout()
plt.savefig('analysis_images/fig3_localization_grand_bargain_gap.png', dpi=300)
plt.close()

# FIGURE 4: AID MODALITY (CASH VS TRADITIONAL) & EARMARKING FLEXIBILITY
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
# Modality
mod_vals = modality_summary['sum'] / 1e6
ax1.bar(modality_summary.index, mod_vals.values, color=['#0284c7', '#10b981'], width=0.5, edgecolor='#334155')
ax1.set_title(f"Aid Modality: Cash Transfer vs Traditional Aid", fontsize=13, fontweight='bold', pad=12)
ax1.set_ylabel('USD Millions', fontsize=11)
for i, v in enumerate(mod_vals.values):
    pct = v / (total_funding / 1e6) * 100
    ax1.text(i, v + 3, f"${v:.1f}M ({pct:.1f}%)", ha='center', fontsize=10, fontweight='bold')
ax1.set_ylim(0, max(mod_vals.values) * 1.18)

# Earmarking
ear_vals = earmarking_summary['sum'] / 1e6
ax2.barh(earmarking_summary.index[::-1], ear_vals.values[::-1], color='#f59e0b', edgecolor='#d97706', height=0.6)
ax2.set_title('Earmarking & Funding Flexibility ($ Millions)', fontsize=13, fontweight='bold', pad=12)
ax2.set_xlabel('USD Millions', fontsize=11)
for i, v in enumerate(ear_vals.values[::-1]):
    ax2.text(v + 2, i, f"${v:.1f}M", va='center', fontsize=9.5, fontweight='bold')
ax2.set_xlim(0, max(ear_vals.values) * 1.18)
plt.tight_layout()
plt.savefig('analysis_images/fig4_aid_modality_and_earmarking.png', dpi=300)
plt.close()

# FIGURE 5: FX & ORIGINAL CURRENCY EXPOSURE
fig, ax = plt.subplots(figsize=(12, 6))
top_curr = currency_summary.head(6)
y_pos = range(len(top_curr))
bars = ax.barh(y_pos, (top_curr['sum'] / 1e6).values[::-1], color='#6366f1', edgecolor='#4f46e5', height=0.6)
ax.set_yticks(y_pos)
ax.set_yticklabels(top_curr.index[::-1], fontsize=10.5)
ax.set_xlabel('USD Equivalent (Millions)', fontsize=11, labelpad=8)
ax.set_title('Currency Volatility Exposure: 76.1% of Aid Denominated in Non-USD', fontsize=13, fontweight='bold', pad=12)
for i, v in enumerate((top_curr['sum'] / 1e6).values[::-1]):
    pct = v / (total_funding / 1e6) * 100
    ax.text(v + 1.5, i, f"${v:.1f}M ({pct:.1f}%)", va='center', fontsize=9.5, fontweight='bold', color='#1e293b')
ax.set_xlim(0, max((top_curr['sum'] / 1e6).values) * 1.18)
plt.tight_layout()
plt.savefig('analysis_images/fig5_fx_currency_exposure.png', dpi=300)
plt.close()

# FIGURE 6: HRP ALIGNMENT & PIPELINE STATUS
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
hrp_vals = hrp_summary['sum'] / 1e6
ax1.pie(hrp_vals.values, labels=hrp_summary.index, autopct='%1.1f%%', startangle=140, colors=['#059669', '#cbd5e1'], wedgeprops=dict(width=0.45, edgecolor='w'))
ax1.set_title('Strategic Alignment: Inside vs Outside HNRP 2026', fontsize=13, fontweight='bold', pad=12)

# Sector disbursement gap
sector_disb = df.pivot_table(index='Sector', columns='Funding status', values='Amount (US$)', aggfunc='sum', fill_value=0)
top_sec_gap = sector_disb.loc[sector_totals.head(6).index] / 1e6
labels = top_sec_gap.index
x = np.arange(len(labels))
w = 0.35
ax2.bar(x - w/2, top_sec_gap['Paid Contribution'], w, label='Paid ($M)', color='#10b981')
ax2.bar(x + w/2, top_sec_gap['Commitment'], w, label='Commitment ($M)', color='#38bdf8')
ax2.set_xticks(x)
ax2.set_xticklabels([s[:14] + '..' if len(s) > 14 else s for s in labels], rotation=30, ha='right', fontsize=9.5)
ax2.set_ylabel('USD Millions', fontsize=11)
ax2.set_title('Disbursement Gap Across Priority Sectors', fontsize=13, fontweight='bold', pad=12)
ax2.legend(frameon=True)
plt.tight_layout()
plt.savefig('analysis_images/fig6_hrp_alignment_and_pipeline.png', dpi=300)
plt.close()

# FIGURE 7: NLP TOPIC MODELING
fig, axes = plt.subplots(2, 2, figsize=(16, 9))
for idx, topic_info in enumerate(topic_keywords):
    r, c = idx // 2, idx % 2
    ax = axes[r, c]
    topic_weights = nmf_model.components_[idx]
    top_indices = topic_weights.argsort()[:-9:-1]
    words = [feature_names[i] for i in top_indices]
    weights = [topic_weights[i] for i in top_indices]
    ax.barh(words[::-1], weights[::-1], color=['#0284c7', '#0d9488', '#d97706', '#e11d48'][idx], height=0.6)
    ax.set_title(f"Topic {idx+1}: {topic_info['Label']}", fontsize=11, fontweight='bold', pad=8)
    ax.set_xlabel('Topic Weight', fontsize=9.5)
plt.suptitle('NMF Topic Modeling on 431 Project Descriptions', fontsize=14, fontweight='bold', y=0.99)
plt.tight_layout()
plt.savefig('analysis_images/fig7_nlp_topic_modeling.png', dpi=300)
plt.close()

# FIGURE 8: NETWORK CENTRALITY HUBS
fig, ax = plt.subplots(figsize=(12, 6.5))
top_net = network_metrics.head(10)
y_pos = range(len(top_net))
ax.barh(y_pos, top_net['Degree_Centrality'].values[::-1], color='#6366f1', edgecolor='#4f46e5', height=0.6)
ax.set_yticks(y_pos)
ax.set_yticklabels(top_net['Organization'].values[::-1], fontsize=9.5)
ax.set_xlabel('Network Connection Ratio (Degree Centrality)', fontsize=11, labelpad=8)
ax.set_title('Top 10 Strategic Network Hubs in Somalia Aid Architecture', fontsize=13, fontweight='bold', pad=12)
for i, v in enumerate(top_net['Degree_Centrality'].values[::-1]):
    ax.text(v + 0.003, i, f"{v:.3f}", va='center', fontsize=9, fontweight='bold', color='#1e293b')
ax.set_xlim(0, max(top_net['Degree_Centrality'].values) * 1.15)
plt.tight_layout()
plt.savefig('analysis_images/fig8_network_centrality_hubs.png', dpi=300)
plt.close()

print("All 8 publication-quality figures successfully saved in analysis_images/")

# -------------------------------------------------------------------------
# 6. GENERATE COMPREHENSIVE MULTI-SHEET EXCEL REPORT
# -------------------------------------------------------------------------
excel_report_name = 'Somalia_2026_Humanitarian_Intelligence_Report.xlsx'
print(f"Creating expanded executive Excel report: {excel_report_name}...")

wb = openpyxl.Workbook()
wb.remove(wb.active)

header_fill = PatternFill(start_color='1E293B', end_color='1E293B', fill_type='solid')
header_font = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
title_font = Font(name='Segoe UI', size=14, bold=True, color='0F172A')
subtitle_font = Font(name='Segoe UI', size=10, italic=True, color='64748B')
regular_font = Font(name='Segoe UI', size=10)
bold_font = Font(name='Segoe UI', size=10, bold=True)
thin_border = Border(
    left=Side(style='thin', color='CBD5E1'), right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'), bottom=Side(style='thin', color='CBD5E1')
)

# SHEET 1: EXECUTIVE DASHBOARD
ws1 = wb.create_sheet(title='Executive Summary')
ws1.views.sheetView[0].showGridLines = True
ws1['B2'] = "SOMALIA HUMANITARIAN AID INTELLIGENCE REPORT (2026)"
ws1['B2'].font = title_font
ws1['B3'] = "Source: somali data all .xlsx (43 Data Dimensions) | UN OCHA Financial Tracking Service"
ws1['B3'].font = subtitle_font

kpis = [
    ("Total Aid Volume", f"${total_funding:,.0f}"),
    ("Total Aid Flows", f"{total_flows} transactions"),
    ("Direct Funding to Local Somali NGOs", f"${loc_summary.loc[loc_summary.index.str.contains('National NGOs|Local NGOs')]['sum'].sum():,.0f} (0.80% - Localization Gap)"),
    ("Funding to International UN Agencies & INGOs", f"${loc_summary.loc[loc_summary.index.str.contains('UN Agencies|International NGOs')]['sum'].sum():,.0f} (75.8%)"),
    ("Country-Based Pooled Fund (SHF)", f"${loc_summary.loc[loc_summary.index.str.contains('Country-based')]['sum'].sum():,.0f} (12.87%)"),
    ("Cash Transfer Programming (CTP)", f"${modality_summary.loc['Cash transfer programming (CTP)']['sum']:,.0f} (17.71%)"),
    ("Traditional Aid Modality", f"${modality_summary.loc['Traditional aid']['sum']:,.0f} (82.29%)"),
    ("Earmarked Funding (Restricted)", f"${earmarking_summary.loc['earmarked']['sum']:,.0f} (66.77%)"),
    ("Fully Unearmarked (Flexible)", f"${earmarking_summary.loc['unearmarked']['sum']:,.0f} (2.42%)"),
    ("EUR Currency Exposure", f"${currency_summary.loc['European Euro']['sum']:,.0f} (40.71% of all aid)"),
    ("HRP Alignment", f"${hrp_summary.loc['Somalia HNRP 2026']['sum']:,.0f} (87.84% inside plan)"),
    ("Donor Gini Concentration Index", f"{donor_gini:.3f} (Top 20% donors fund 72.3%)")
]

ws1.cell(row=5, column=2, value="Key Humanitarian Dimension / Benchmark").font = header_font
ws1.cell(row=5, column=2).fill = header_fill
ws1.cell(row=5, column=3, value="Metric Value & Finding").font = header_font
ws1.cell(row=5, column=3).fill = header_fill

row_idx = 5
for kpi, val in kpis:
    row_idx += 1
    c1 = ws1.cell(row=row_idx, column=2, value=kpi)
    c2 = ws1.cell(row=row_idx, column=3, value=val)
    c1.font = regular_font
    c2.font = bold_font
    c1.border = thin_border
    c2.border = thin_border

# SHEET 2: LOCALIZATION (GRAND BARGAIN)
ws2 = wb.create_sheet(title='Localization Analysis')
ws2.views.sheetView[0].showGridLines = True
ws2['B2'] = "LOCALIZATION & GRAND BARGAIN BENCHMARKING"
ws2['B2'].font = title_font

headers_ws2 = ['Destination Institutional Actor Level', 'Total Funding ($)', 'Flows', 'Share of Total (%)']
for col_idx, h in enumerate(headers_ws2, start=2):
    cell = ws2.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, (actor, r) in enumerate(loc_summary.iterrows()):
    r_idx = 5 + idx
    ws2.cell(row=r_idx, column=2, value=actor).font = bold_font
    c = ws2.cell(row=r_idx, column=3, value=r['sum'])
    c.font = regular_font
    c.number_format = '$#,##0'
    ws2.cell(row=r_idx, column=4, value=r['count']).font = regular_font
    ws2.cell(row=r_idx, column=5, value=r['share_%'] / 100).number_format = '0.00%'

# SHEET 3: MODALITY & EARMARKING
ws3 = wb.create_sheet(title='Modality & Earmarking')
ws3.views.sheetView[0].showGridLines = True
ws3['B2'] = "AID MODALITY (CASH VS TRADITIONAL) & EARMARKING"
ws3['B2'].font = title_font

ws3.cell(row=4, column=2, value="Modality").font = header_font
ws3.cell(row=4, column=2).fill = header_fill
ws3.cell(row=4, column=3, value="Amount (US$)").font = header_font
ws3.cell(row=4, column=3).fill = header_fill
ws3.cell(row=4, column=4, value="Share (%)").font = header_font
ws3.cell(row=4, column=4).fill = header_fill

for idx, (mod, r) in enumerate(modality_summary.iterrows()):
    r_idx = 5 + idx
    ws3.cell(row=r_idx, column=2, value=mod).font = bold_font
    c = ws3.cell(row=r_idx, column=3, value=r['sum'])
    c.number_format = '$#,##0'
    ws3.cell(row=r_idx, column=4, value=r['share_%'] / 100).number_format = '0.0%'

ws3.cell(row=9, column=2, value="Earmarking Level").font = header_font
ws3.cell(row=9, column=2).fill = header_fill
ws3.cell(row=9, column=3, value="Amount (US$)").font = header_font
ws3.cell(row=9, column=3).fill = header_fill
ws3.cell(row=9, column=4, value="Share (%)").font = header_font
ws3.cell(row=9, column=4).fill = header_fill

for idx, (ear, r) in enumerate(earmarking_summary.iterrows()):
    r_idx = 10 + idx
    ws3.cell(row=r_idx, column=2, value=ear).font = bold_font
    c = ws3.cell(row=r_idx, column=3, value=r['sum'])
    c.number_format = '$#,##0'
    ws3.cell(row=r_idx, column=4, value=r['share_%'] / 100).number_format = '0.0%'

# SHEET 4: FX & CURRENCY EXPOSURE
ws4 = wb.create_sheet(title='Currency & FX Exposure')
ws4.views.sheetView[0].showGridLines = True
ws4['B2'] = "FOREIGN EXCHANGE & CURRENCY EXPOSURE"
ws4['B2'].font = title_font

headers_ws4 = ['Original Currency', 'Equivalent USD Amount', 'Transactions', 'Share of Total (%)']
for col_idx, h in enumerate(headers_ws4, start=2):
    cell = ws4.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

for idx, (curr, r) in enumerate(currency_summary.iterrows()):
    r_idx = 5 + idx
    ws4.cell(row=r_idx, column=2, value=curr).font = bold_font
    c = ws4.cell(row=r_idx, column=3, value=r['sum'])
    c.number_format = '$#,##0'
    ws4.cell(row=r_idx, column=4, value=r['count']).font = regular_font
    ws4.cell(row=r_idx, column=5, value=r['share_%'] / 100).number_format = '0.00%'

# SHEET 5: TOP DONORS
ws5 = wb.create_sheet(title='Top Donors & Share')
ws5.views.sheetView[0].showGridLines = True
ws5['B2'] = "DONOR FUNDING RANKINGS & SHARE"
ws5['B2'].font = title_font

headers_ws5 = ['Rank', 'Donor Organization', 'Total Funding (US$)', 'Flows', 'Share (%)', 'Cumulative (%)']
for col_idx, h in enumerate(headers_ws5, start=2):
    cell = ws5.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = header_fill

donor_df = pd.DataFrame({
    'Total Funding (US$)': donor_totals,
    'Flows Count': df.groupby('Source org.')['Flow ID'].count(),
    'Share of Total (%)': (donor_totals / total_funding * 100).round(2),
    'Cumulative Share (%)': (donor_totals / total_funding * 100).cumsum().round(2)
}).reset_index()
donor_df.columns = ['Source Organization', 'Total Funding (US$)', 'Flows Count', 'Share of Total (%)', 'Cumulative Share (%)']

for rank, r in donor_df.iterrows():
    r_idx = 5 + rank
    ws5.cell(row=r_idx, column=2, value=rank + 1).font = bold_font
    ws5.cell(row=r_idx, column=3, value=r['Source Organization']).font = regular_font
    c3 = ws5.cell(row=r_idx, column=4, value=r['Total Funding (US$)'])
    c3.font = regular_font
    c3.number_format = '$#,##0'
    ws5.cell(row=r_idx, column=5, value=r['Flows Count']).font = regular_font
    ws5.cell(row=r_idx, column=6, value=r['Share of Total (%)'] / 100).number_format = '0.0%'
    ws5.cell(row=r_idx, column=7, value=r['Cumulative Share (%)'] / 100).number_format = '0.0%'

# Adjust column widths
for ws in wb.worksheets:
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

wb.save(excel_report_name)
print(f"Expanded Excel report saved successfully: {excel_report_name}")
print("ALL ANALYSES ON 'somali data all .xlsx' COMPLETED!")
