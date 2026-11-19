import urllib.request
import os

url = "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/SOM/ADM1/geoBoundaries-SOM-ADM1_simplified.geojson"
save_path = "hdx_data/somalia_adm1_boundaries.geojson"
headers = {'User-Agent': 'Mozilla/5.0'}

print("Downloading Somalia Admin 1 simplified GeoJSON...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp, open(save_path, 'wb') as f:
        f.write(resp.read())
    print(f"Success! Saved {os.path.getsize(save_path):,} bytes.")
except Exception as e:
    print("Download failed:", e)
