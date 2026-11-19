import urllib.request
import json
import collections

url = 'https://data.humdata.org/api/3/action/package_search?fq=groups:som&rows=100'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
        results = data['result']
        total = results['count']
        print("Total Somalia datasets on HDX:", total)
        
        formats = collections.Counter()
        tags = collections.Counter()
        orgs = collections.Counter()
        
        samples = []
        for pkg in results['results']:
            orgs[pkg.get('organization', {}).get('title', 'Unknown')] += 1
            for r in pkg.get('resources', []):
                formats[r.get('format', '').upper()] += 1
            for t in pkg.get('tags', []):
                tags[t.get('display_name', '')] += 1
            samples.append({
                'title': pkg['title'],
                'org': pkg.get('organization', {}).get('title'),
                'formats': list(set(r.get('format', '').upper() for r in pkg.get('resources', []))),
                'url': f"https://data.humdata.org/dataset/{pkg['name']}"
            })
            
        print("\n--- TOP ORGANIZATIONS / CONTRIBUTORS ---")
        for org, c in orgs.most_common(10):
            print(f"- {org}: {c} datasets")
            
        print("\n--- AVAILABLE FILE FORMATS ---")
        for fmt, c in formats.most_common(12):
            if fmt:
                print(f"- {fmt}: {c} files")
                
        print("\n--- TOP TOPICS / SECTORS ---")
        for t, c in tags.most_common(12):
            if t:
                print(f"- {t}: {c} tags")
                
        print("\n--- KEY DATASET EXAMPLES (First 15) ---")
        for s in samples[:15]:
            fmts = ", ".join(s['formats'][:4])
            print(f"- {s['title']} [{fmts}] ({s['org']})")
            
except Exception as e:
    print("Error:", e)
