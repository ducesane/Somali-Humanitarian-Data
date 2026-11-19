import urllib.request
import urllib.parse
import json
import os
import re

download_dir = 'hdx_data'
os.makedirs(download_dir, exist_ok=True)

queries = [
    ('somalia_population_2026', 'somalia subnational population statistics'),
    ('somalia_wfp_food_prices', 'wfp food prices somalia'),
    ('somalia_iom_displacement_dtm', 'somalia iom displacement tracking matrix'),
    ('somalia_cbpf_allocations', 'somalia cbpf allocations and contributions'),
    ('somalia_cerf_allocations', 'somalia cerf allocations'),
    ('somalia_targeted_reached_by_cluster', 'total number of people targeted and reached per region and per cluster'),
    ('somalia_cash_programming', 'cash based programming in somalia'),
    ('somalia_admin_boundaries', 'somalia administrative boundaries cod')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

downloaded = []

for tag, q in queries:
    search_url = f"https://data.humdata.org/api/3/action/package_search?fq=groups:som&q={urllib.parse.quote(q)}&rows=1"
    req = urllib.request.Request(search_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            results = data['result']['results']
            if not results:
                print(f"[{tag}] No dataset found for query: {q}")
                continue
            
            pkg = results[0]
            title = pkg.get('title')
            print(f"\nFound dataset: '{title}' ({pkg.get('name')})")
            
            # Select the most useful resource (prefer XLSX, CSV, SHP)
            resources = pkg.get('resources', [])
            target_res = None
            for r in resources:
                fmt = (r.get('format') or '').upper()
                if fmt in ['XLSX', 'CSV', 'ZIP']:
                    target_res = r
                    break
            if not target_res and resources:
                target_res = resources[0]
                
            if target_res:
                dl_url = target_res.get('download_url') or target_res.get('url')
                name = target_res.get('name') or target_res.get('description') or 'data'
                fmt = (target_res.get('format') or 'dat').lower()
                
                # Sanitize file name
                clean_name = re.sub(r'[^\w\-_\.]', '_', name)
                if not clean_name.endswith(f".{fmt}"):
                    clean_name = f"{tag}_{clean_name[:40]}.{fmt}"
                else:
                    clean_name = f"{tag}_{clean_name[:40]}"
                if not (clean_name.endswith('.csv') or clean_name.endswith('.xlsx') or clean_name.endswith('.zip') or clean_name.endswith('.json')):
                    clean_name = f"{clean_name}.{fmt}"
                
                save_path = os.path.join(download_dir, clean_name)
                print(f"Downloading [{target_res.get('format')}]: {clean_name}...")
                print(f"URL: {dl_url}")
                
                file_req = urllib.request.Request(dl_url, headers=headers)
                with urllib.request.urlopen(file_req, timeout=30) as file_resp, open(save_path, 'wb') as out_f:
                    out_f.write(file_resp.read())
                    
                file_size = os.path.getsize(save_path)
                print(f"Successfully saved to {save_path} ({file_size:,} bytes)")
                downloaded.append({
                    'tag': tag,
                    'title': title,
                    'file': clean_name,
                    'path': save_path,
                    'size': file_size,
                    'format': target_res.get('format')
                })
    except Exception as e:
        print(f"Error fetching [{tag}]: {e}")

print(f"\n==========================================")
print(f"DOWNLOAD SUMMARY: {len(downloaded)} files downloaded into '{download_dir}/'")
for d in downloaded:
    print(f"- {d['file']} ({d['size']:,} bytes) - {d['title']}")
