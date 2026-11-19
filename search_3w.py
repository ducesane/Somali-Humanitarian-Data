import urllib.request
import urllib.parse
import json

queries = [
    '3w operational presence somalia',
    'who is doing what where somalia',
    'somalia 3w',
    'somalia 4w',
    'targeted reached cluster somalia',
    'cash based programming somalia'
]

headers = {'User-Agent': 'Mozilla/5.0'}
for q in queries:
    url = f'https://data.humdata.org/api/3/action/package_search?fq=groups:som&q={urllib.parse.quote(q)}&rows=3'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            results = data['result']['results']
            print(f"\n=== QUERY: {q} ({len(results)} results) ===")
            for p in results:
                print(f"Title: {p['title']} ({p['name']})")
                for r in p.get('resources', [])[:3]:
                    url_dl = r.get('download_url') or r.get('url')
                    print(f"  [{r.get('format')}] {r.get('name')}: {url_dl}")
    except Exception as e:
        print(f"Error on {q}: {e}")
