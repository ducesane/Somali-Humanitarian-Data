import urllib.request
import os

url = 'https://data.humdata.org/dataset/520c52a6-6caf-4cba-aecb-a57c063bffc9/resource/78869aab-5735-4356-b7b1-c6378618172c/download/som_cbpf_project_summary.csv'
headers = {'User-Agent': 'Mozilla/5.0'}
save_path = 'hdx_data/som_cbpf_project_summary.csv'

print(f"Connecting to {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        content = resp.read()
        with open(save_path, 'wb') as f:
            f.write(content)
    print(f"Success! Saved {os.path.getsize(save_path):,} bytes.")
except Exception as e:
    print(f"Download failed: {e}")
