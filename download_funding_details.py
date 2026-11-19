import urllib.request
import os

hdx_dir = 'hdx_data'
os.makedirs(hdx_dir, exist_ok=True)

downloads = [
    (
        'som_cbpf_project_summary.csv',
        'https://data.humdata.org/dataset/520c52a6-6caf-4cba-aecb-a57c063bffc9/resource/78869aab-5735-4356-b7b1-c6378618172c/download/som_cbpf_project_summary.csv'
    ),
    (
        'fts_internal_funding_som.csv',
        'https://data.humdata.org/dataset/c48f2ae8-fd5c-48fb-bcf4-81be54e746a1/resource/ee86da73-4534-40b2-8dbd-f798d2c6ed91/download/fts_internal_funding_som.csv'
    ),
    (
        'fts_incoming_funding_som.csv',
        'https://data.humdata.org/dataset/c48f2ae8-fd5c-48fb-bcf4-81be54e746a1/resource/469b22ae-f059-4109-9ac0-866328c8018a/download/fts_incoming_funding_som.csv'
    ),
    (
        'fts_outgoing_funding_som.csv',
        'https://data.humdata.org/dataset/c48f2ae8-fd5c-48fb-bcf4-81be54e746a1/resource/eb94b0a0-d972-4f1f-8ae7-95341a836873/download/fts_outgoing_funding_som.csv'
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
