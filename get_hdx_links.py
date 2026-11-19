import urllib.request
import json

url = 'https://data.humdata.org/api/3/action/package_search?fq=groups:som&q=fts+or+food+or+displacement+or+admin&rows=10'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        for p in data['result']['results'][:6]:
            print("TITLE:", p['title'])
            print("ORG:", p.get('organization', {}).get('title'))
            for r in p.get('resources', [])[:2]:
                url_dl = r.get('download_url') or r.get('url')
                print(f"  [{r.get('format')}] {r.get('name')}: {url_dl}")
            print()
except Exception as e:
    print('Error:', e)
