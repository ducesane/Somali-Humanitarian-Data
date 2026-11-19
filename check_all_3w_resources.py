import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
url = "https://data.humdata.org/api/3/action/package_show?id=be09b1a5-e457-448f-8d2d-63b0debc1742"

print(f"Fetching dataset details from HDX: {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
        result = data.get('result', {})
        print("Dataset Title:", result.get('title'))
        print("Notes/Description:", result.get('notes')[:300] if result.get('notes') else "N/A")
        print("Last Modified:", result.get('metadata_modified'))
        print(f"\nTotal Resources: {len(result.get('resources', []))}")
        for idx, res in enumerate(result.get('resources', [])):
            print(f"[{idx+1}] Name: {res.get('name')}")
            print(f"    Format: {res.get('format')} | Size: {res.get('size')} | Created: {res.get('created')}")
            print(f"    URL: {res.get('url')}")
            print(f"    Description: {res.get('description')}")
except Exception as e:
    print("Error:", e)
