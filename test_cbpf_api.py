import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}

# Test CBPF API endpoints for Somalia (PooledFundId = 21)
endpoints = [
    "https://cbpfapi.unocha.org/vo2/odata/AllocationSummary?PoolfundCodeAbbrv=SOM",
    "https://cbpfapi.unocha.org/vo2/odata/AllocationSummary?$filter=PooledFundId%20eq%2021",
    "https://cbpfapi.unocha.org/vo2/odata/MstAllocation?$filter=PooledFundId%20eq%2021",
    "https://cbpfapi.unocha.org/vo2/odata/ProjectSummary?$filter=PooledFundId%20eq%2021",
    "https://cbpfapi.unocha.org/vo2/odata/AllocationTypes",
]

for ep in endpoints:
    print(f"\nTesting endpoint: {ep}")
    try:
        req = urllib.request.Request(ep, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print("Status: Success! Returned keys:", list(data.keys()) if isinstance(data, dict) else len(data))
            if 'value' in data:
                print(f"Items count: {len(data['value'])}")
                if len(data['value']) > 0:
                    print("Sample item:", data['value'][0])
    except Exception as e:
        print("Error:", e)
