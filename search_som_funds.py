import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
url = "https://data.humdata.org/api/3/action/package_search?fq=groups:som&q=fund&rows=15"

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=20) as resp:
    data = json.loads(resp.read().decode())
    results = data.get('result', {}).get('results', [])
    print(f"Found {len(results)} datasets matching 'fund' in group 'som':")
    for d in results:
        print(f"\nID: {d.get('name')} | Title: {d.get('title')}")
        for res in d.get('resources', []):
            print(f"  -> Res: {res.get('name')} | Format: {res.get('format')} | URL: {res.get('url')}")
