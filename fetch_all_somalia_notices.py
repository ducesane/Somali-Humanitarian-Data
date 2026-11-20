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

print("Fetching initial token...")
req = urllib.request.Request('https://www.ungm.org/Public/Notice', headers=headers)
html = opener.open(req).read().decode('utf-8')
m = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', html)
token = m.group(1)

all_notices = []
page = 0
max_pages = 10 # get up to 10 pages

while page < max_pages:
    print(f"Fetching page {page}...")
    payload = {
        "PageIndex": page,
        "PageSize": 15,
        "Title": "",
        "Description": "",
        "Reference": "",
        "PublishedFrom": "",
        "PublishedTo": "",
        "DeadlineFrom": "",
        "DeadlineTo": "",
        "Countries": ["2480"],
        "Agencies": [],
        "UNSPSCs": [],
        "NoticeTypes": [],
        "SortField": "Deadline",
        "SortAscending": False,
        "isPicker": False,
        "IsSustainable": False,
        "IsActive": True,
        "NoticeDisplayType": None,
        "NoticeSearchTotalLabelId": "noticeSearchTotal",
        "TypeOfCompetitions": []
    }

    post_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.ungm.org/Public/Notice',
        'RequestVerificationToken': token
    }

    post_req = urllib.request.Request('https://www.ungm.org/Public/Notice/Search', data=json.dumps(payload).encode('utf-8'), headers=post_headers)
    try:
        resp = opener.open(post_req)
        chunk = resp.read().decode('utf-8')
        soup = BeautifulSoup(chunk, 'html.parser')
        rows = soup.find_all('div', class_='dataRow')
        if not rows:
            print(f"No more data rows on page {page}.")
            break
        print(f"  Page {page}: found {len(rows)} notices.")
        for r in rows:
            notice_id = r.get('data-noticeid')
            title_elem = r.find('span', class_='ungm-title')
            title = title_elem.get_text(strip=True) if title_elem else ''
            
            link_elem = r.find('a', href=re.compile(r'/Public/Notice/\d+'))
            notice_url = f"https://www.ungm.org{link_elem['href']}" if link_elem else f"https://www.ungm.org/Public/Notice/{notice_id}"
            
            deadline_elem = r.find('div', class_='deadline')
            # Extract deadline text without remaining days
            if deadline_elem:
                # remove span remainingDaysToDeadline
                rem = deadline_elem.find('span', class_='remainingDaysToDeadline')
                if rem:
                    rem.decompose()
                deadline = deadline_elem.get_text(strip=True)
            else:
                deadline = ''
                
            agency_elem = r.find('div', class_='resultAgency')
            agency = agency_elem.get_text(strip=True) if agency_elem else ''
            
            # Find cells
            cells = r.find_all('div', class_='tableCell')
            # Typically: [0: save/eoi, 1: title, 2: deadline, 3: published, 4: agency, 5: type, 6: reference, 7: country]
            pub_date = cells[3].get_text(strip=True) if len(cells) > 3 else ''
            proc_type = cells[5].get_text(strip=True) if len(cells) > 5 else ''
            ref_num = cells[6].get_text(strip=True) if len(cells) > 6 else ''
            dest = cells[7].get_text(strip=True) if len(cells) > 7 else ''

            all_notices.append({
                'id': notice_id,
                'title': title,
                'url': notice_url,
                'agency': agency,
                'notice_type': proc_type,
                'reference': ref_num,
                'published_date': pub_date,
                'deadline': deadline,
                'destination': dest
            })
            
        page += 1
        time.sleep(0.5)
    except Exception as e:
        print(f"Error fetching page {page}: {e}")
        break

print(f"\nTotal notices collected: {len(all_notices)}")
with open('portal/src/data/somalia_ungm_notices.json', 'w', encoding='utf-8') as f:
    json.dump(all_notices, f, indent=2)
print("Saved to portal/src/data/somalia_ungm_notices.json")
