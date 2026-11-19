import urllib.request
import os

hdx_dir = 'hdx_data'
os.makedirs(hdx_dir, exist_ok=True)

downloads = [
    (
        'somalia_3w_operational_presence_2026.xlsx',
        'https://data.humdata.org/dataset/be09b1a5-e457-448f-8d2d-63b0debc1742/resource/046df6fb-2461-4313-9937-e0228478ddbf/download/3w-operational-presence-dataset_january-june-2026_.xlsx'
    ),
    (
        'somalia_3w_operational_presence_2025.xlsx',
        'https://data.humdata.org/dataset/be09b1a5-e457-448f-8d2d-63b0debc1742/resource/18ddb242-5916-484c-bf77-77e022732aaa/download/3w-operational-presence-dataset_january-december-2025.xlsx'
    ),
    (
        'somalia_targeted_reached_by_location_cluster.csv',
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRppQx8JTKkKRCKmzfnCMmTFEcvCpkbP9PdHs1sQTUyacmbsx8tlAXpgBLFce-lcehukreGGuXjA_4S/pub?gid=1287849586&single=true&output=csv'
    )
]

headers = {'User-Agent': 'Mozilla/5.0'}

for fname, url in downloads:
    save_path = os.path.join(hdx_dir, fname)
    print(f"Downloading {fname} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(save_path, 'wb') as f:
            f.write(resp.read())
        print(f"-> Successfully saved {fname} ({os.path.getsize(save_path):,} bytes)")
    except Exception as e:
        print(f"-> Error downloading {fname}: {e}")
