import urllib.request
import json

# Search HDX for SHF / CBPF allocations, localization, subgrants
queries = ['somalia shf', 'somalia cbpf allocation', 'somalia humanitarian fund', 'somalia localization', 'somalia pass through']
headers = {'User-Agent': 'Mozilla/5.0'}

print("=== Searching HDX for SHF/CBPF and Partner Allocation datasets ===")
for q in queries:
    url = f"https://data.humdata.org/api/3/action/package_search?q={urllib.parse.quote(q)}&rows=6"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            results = data.get('result', {}).get('results', [])
            print(f"\nQuery: '{q}' -> Found {len(results)} datasets:")
            for d in results:
                print(f" - [{d.get('name')}] {d.get('title')}")
                for res in d.get('resources', [])[:3]:
                    print(f"    * Res: {res.get('name')} | Format: {res.get('format')} | URL: {res.get('url')}")
    except Exception as e:
        print(f"Error querying {q}: {e}")
