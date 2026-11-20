import os
import requests

os.makedirs('hdx_data', exist_ok=True)

downloads = [
    {
        'name': 'somalia_cwg_4ws_final_raw_dataset_2023.xlsx',
        'url': 'https://data.humdata.org/dataset/efddb235-daf1-4be8-828a-82087d1b09f8/resource/6ec561a3-fb3b-4b20-b12c-a7f15c4de319/download/somalia_cwg_4ws-final-raw-dataset-2023.xlsx'
    },
    {
        'name': 'reach_som_dataset_dsa_somalia_february_2022.xlsx',
        'url': 'https://data.humdata.org/dataset/a2d46f9a-37e4-4bdb-91df-0d31adb205b5/resource/eafda5b1-79ca-4308-930f-cb248ad0867b/download/reach_som_dataset_dsa_somalia_february-2022.xlsx'
    },
    {
        'name': 'reach_som_dataset_dsaiv_settlement_level_may2021.xlsx',
        'url': 'https://data.humdata.org/dataset/a2d46f9a-37e4-4bdb-91df-0d31adb205b5/resource/1026612f-e192-486e-986e-8f11c5915344/download/reach_som_dataset_dsaiv_settlement-level_may2021.xlsx'
    },
    {
        'name': 'reach_som_kismayo_idp_household_clean.xlsx',
        'url': 'https://data.humdata.org/dataset/05e62136-6e84-43cb-af11-e42b01577e72/resource/80884092-9500-4a5f-91c4-2a6a1d395d4a/download/reach_som_dataset_ksm_idpsettlementassessment_household_clean_nov2016.xlsx'
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for d in downloads:
    dest = os.path.join('hdx_data', d['name'])
    # If the file already exists and is large enough, skip
    if os.path.exists(dest) and os.path.getsize(dest) > 3000000:
        print(f"Skipping {d['name']}, already exists ({os.path.getsize(dest)/(1024*1024):.2f} MB).", flush=True)
        continue

    print(f"Downloading {d['name']}...", flush=True)
    try:
        r = requests.get(d['url'], headers=headers, stream=True, timeout=60)
        r.raise_for_status()
        total_len = int(r.headers.get('content-length', 0))
        downloaded = 0
        with open(dest, 'wb') as f:
            for chunk in r.iter_content(chunk_size=128 * 1024):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
        print(f"Finished {d['name']}: {os.path.getsize(dest)/(1024*1024):.2f} MB", flush=True)
    except Exception as e:
        print(f"Error downloading {d['name']}: {e}", flush=True)

print("Done with all downloads.", flush=True)
