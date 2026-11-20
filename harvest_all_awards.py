import urllib.request
from http.cookiejar import CookieJar
import json
import re
from bs4 import BeautifulSoup
import time

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request('https://www.ungm.org/Public/ContractAward', headers=headers)
html = opener.open(req).read().decode('utf-8')
m = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', html)
token = m.group(1)

all_awards_map = {}

def harvest_search(search_name, base_payload, max_pages=35):
    print(f"\n=== Starting harvest: {search_name} (max {max_pages} pages) ===")
    for page in range(max_pages):
        p = dict(base_payload)
        p["PageIndex"] = page
        p["PageSize"] = 15
        p["SortField"] = "AwardDate"
        p["SortAscending"] = False
        
        post_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://www.ungm.org/Public/ContractAward',
            'RequestVerificationToken': token
        }
        
        try:
            post_req = urllib.request.Request(
                'https://www.ungm.org/Public/ContractAward/PublicSearch',
                data=json.dumps(p).encode('utf-8'),
                headers=post_headers
            )
            resp = opener.open(post_req)
            chunk = resp.read().decode('utf-8')
            soup = BeautifulSoup(chunk, 'html.parser')
            rows = soup.find_all('div', class_='dataRow')
            if not rows:
                print(f"[{search_name}] End of results at page {page}.")
                break
                
            print(f"[{search_name}] Page {page}: found {len(rows)} awards.")
            for r in rows:
                award_id = r.get('data-contractawardid')
                if not award_id or award_id in all_awards_map:
                    continue
                    
                title_elem = r.find('span', class_='ungm-title')
                title = title_elem.get_text(strip=True) if title_elem else ''
                
                cells = r.find_all('div', class_='tableCell')
                supplier = cells[1].get_text(strip=True) if len(cells) > 1 else ''
                award_date = cells[2].get_text(strip=True) if len(cells) > 2 else ''
                agency = cells[3].get_text(strip=True) if len(cells) > 3 else ''
                ref_num = cells[4].get_text(strip=True) if len(cells) > 4 else ''
                dest = cells[5].get_text(strip=True) if len(cells) > 5 else ''
                
                all_awards_map[award_id] = {
                    'award_id': award_id,
                    'title': title,
                    'supplier': supplier,
                    'award_date': award_date,
                    'agency': agency,
                    'reference': ref_num,
                    'destination': dest,
                    'url': f"https://www.ungm.org/Public/ContractAward/{award_id}",
                    'source_query': search_name
                }
            time.sleep(0.2)
        except Exception as e:
            print(f"[{search_name}] Error on page {page}: {e}")
            break

# 1. Somalia as destination country
harvest_search("Somalia Destination", {
    "Title": "", "Description": "", "Reference": "", "Supplier": "", "UngmNumber": "",
    "AwardFrom": "", "AwardTo": "", "Countries": ["2480"], "SupplierCountries": [],
    "Agencies": [], "UNSPSCs": []
}, max_pages=30)

# 2. Somalia in Title
harvest_search("Somalia Title", {
    "Title": "Somalia", "Description": "", "Reference": "", "Supplier": "", "UngmNumber": "",
    "AwardFrom": "", "AwardTo": "", "Countries": [], "SupplierCountries": [],
    "Agencies": [], "UNSPSCs": []
}, max_pages=20)

# 3. Somali Suppliers (SupplierCountries: 2480)
harvest_search("Somali Suppliers", {
    "Title": "", "Description": "", "Reference": "", "Supplier": "", "UngmNumber": "",
    "AwardFrom": "", "AwardTo": "", "Countries": [], "SupplierCountries": ["2480"],
    "Agencies": [], "UNSPSCs": []
}, max_pages=20)

print(f"\n==================================================")
print(f"Total Unique UNGM Contract Awards Harvested: {len(all_awards_map)}")
awards_list = list(all_awards_map.values())
with open('somalia_ungm_all_unique_awards.json', 'w', encoding='utf-8') as f:
    json.dump(awards_list, f, indent=2)
print("Saved to somalia_ungm_all_unique_awards.json")
