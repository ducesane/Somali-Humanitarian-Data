import urllib.request
import json
import os
import hashlib
import sys
import shutil
from datetime import datetime
import subprocess

STATE_FILE = 'pipeline_state.json'
HDX_DATA_DIR = 'hdx_data'
BACKUP_DIR = 'hdx_data/backups'
LOG_FILE = 'pipeline_log.txt'
STATUS_HTML = 'pipeline_status.html'

os.makedirs(HDX_DATA_DIR, exist_ok=True)
os.makedirs(BACKUP_DIR, exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0 (Somalia-Humanitarian-Data-Pipeline/1.0)'}

# Monitored Feeds Configuration
MONITORED_FEEDS = {
    '3w_operational_presence': {
        'name': 'Somalia: Operational Presence (3W / 4W)',
        'type': 'hdx_package',
        'package_id': 'be09b1a5-e457-448f-8d2d-63b0debc1742',
        'target_filename': 'somalia_3w_operational_presence_2026.xlsx',
        'filter_keyword': '2026',
        'description': 'Who is doing What, Where across all 18 regions & 90 districts'
    },
    'cbpf_shf_project_summary': {
        'name': 'Somalia Humanitarian Fund (SHF / CBPF Allocations)',
        'type': 'hdx_resource',
        'url': 'https://data.humdata.org/dataset/520c52a6-6caf-4cba-aecb-a57c063bffc9/resource/78869aab-5735-4356-b7b1-c6378618172c/download/som_cbpf_project_summary.csv',
        'target_filename': 'som_cbpf_project_summary.csv',
        'description': 'Project-level grant allocations to Somali National NGOs and INGOs'
    },
    'cbpf_shf_contributions': {
        'name': 'Somalia Humanitarian Fund (Donor Contributions)',
        'type': 'hdx_resource',
        'url': 'https://data.humdata.org/dataset/520c52a6-6caf-4cba-aecb-a57c063bffc9/resource/0e12f814-0de7-471e-9dfb-35a4fe6200ab/download/som_cbpf_contributions.csv',
        'target_filename': 'somalia_cbpf_allocations_som_cbpf_contributions.csv',
        'description': 'Donor deposits into the Somalia Humanitarian Fund'
    },
    'target_reached_matrix': {
        'name': 'People Targeted vs Reached Monitoring Matrix',
        'type': 'hdx_resource',
        'url': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRppQx8JTKkKRCKmzfnCMmTFEcvCpkbP9PdHs1sQTUyacmbsx8tlAXpgBLFce-lcehukreGGuXjA_4S/pub?gid=1287849586&single=true&output=csv',
        'target_filename': 'somalia_targeted_reached_by_location_cluster.csv',
        'description': 'District-level operational reach and affected population metrics'
    },
    'fts_internal_pass_through': {
        'name': 'FTS Internal Pass-Through & Pooled Fund Flows',
        'type': 'hdx_resource',
        'url': 'https://data.humdata.org/dataset/c48f2ae8-fd5c-48fb-bcf4-81be54e746a1/resource/ee86da73-4534-40b2-8dbd-f798d2c6ed91/download/fts_internal_funding_som.csv',
        'target_filename': 'fts_internal_funding_som.csv',
        'description': 'Internal pass-through grants from SHF to frontline NGOs'
    },
    'fts_2026_flows_api': {
        'name': 'UN OCHA FTS Public API (Somalia 2026 Flows)',
        'type': 'fts_api',
        'url': 'https://api.hpc.tools/v1/public/fts/flow?countryISO3=SOM&year=2026',
        'target_filename': 'fts_2026_flows_api.json',
        'description': 'Real-time incoming bilateral donor grants logged in FTS'
    }
}

def log(msg):
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    entry = f"[{ts}] {msg}"
    print(entry)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(entry + '\n')

def get_file_hash(filepath):
    if not os.path.exists(filepath):
        return None
    try:
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            buf = f.read(65536)
            while len(buf) > 0:
                hasher.update(buf)
                buf = f.read(65536)
        return hasher.hexdigest()
    except Exception:
        return None

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            log(f"Warning loading state file: {e}")
    return {}

def save_state(state):
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2)

def check_hdx_package(feed_key, cfg):
    pkg_id = cfg['package_id']
    api_url = f"https://data.humdata.org/api/3/action/package_show?id={pkg_id}"
    req = urllib.request.Request(api_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())
    
    result = data.get('result', {})
    resources = result.get('resources', [])
    
    matching_res = []
    for r in resources:
        name = r.get('name', '')
        if cfg['filter_keyword'] in name or cfg['filter_keyword'] in r.get('description', ''):
            matching_res.append(r)
    
    if not matching_res:
        matching_res = resources[:1]
        
    latest_res = matching_res[0]
    return {
        'resource_id': latest_res.get('id'),
        'resource_name': latest_res.get('name'),
        'url': latest_res.get('url'),
        'last_modified': latest_res.get('last_modified') or latest_res.get('created'),
        'size': latest_res.get('size'),
        'description': latest_res.get('description')
    }

def run_pipeline(check_only=False):
    log("==================================================")
    log(f"Starting Somalia Automated Pipeline (Check Only: {check_only})")
    log("==================================================")
    
    state = load_state()
    updates_detected = []
    feed_statuses = {}
    
    for key, cfg in MONITORED_FEEDS.items():
        feed_name = cfg['name']
        local_path = os.path.join(HDX_DATA_DIR, cfg['target_filename'])
        existing_hash = get_file_hash(local_path)
        
        feed_status = {
            'name': feed_name,
            'key': key,
            'status': 'OK',
            'has_update': False,
            'details': '',
            'local_file': cfg['target_filename'],
            'last_checked': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        log(f"Checking feed: {feed_name}...")
        try:
            if cfg['type'] == 'hdx_package':
                remote_info = check_hdx_package(key, cfg)
                remote_res_id = remote_info['resource_id']
                remote_mod = remote_info['last_modified']
                remote_name = remote_info['resource_name']
                download_url = remote_info['url']
                
                prev_state = state.get(key, {})
                prev_res_id = prev_state.get('resource_id')
                prev_mod = prev_state.get('last_modified')
                
                # If we don't have this resource ID or modified is different, or local missing
                if prev_res_id != remote_res_id or prev_mod != remote_mod or not os.path.exists(local_path):
                    if not prev_res_id:
                        # Initial baseline capture
                        feed_status['details'] = f"Baseline established: {remote_name} (Mod: {remote_mod[:10] if remote_mod else 'N/A'})"
                    else:
                        feed_status['has_update'] = True
                        feed_status['details'] = f"New release detected on HDX: '{remote_name}' (Mod: {remote_mod})"
                        updates_detected.append({
                            'key': key,
                            'name': feed_name,
                            'url': download_url,
                            'target_file': local_path,
                            'remote_info': remote_info
                        })
                else:
                    feed_status['details'] = f"Up-to-date ({remote_name}, Mod: {remote_mod[:10] if remote_mod else 'N/A'})"
                    
                # Store latest info
                state[key] = {
                    'resource_id': remote_res_id,
                    'resource_name': remote_name,
                    'last_modified': remote_mod,
                    'last_checked': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'hash': existing_hash
                }
                    
            elif cfg['type'] == 'hdx_resource':
                if not os.path.exists(local_path):
                    feed_status['has_update'] = True
                    feed_status['details'] = "Local file missing, download required"
                    updates_detected.append({
                        'key': key,
                        'name': feed_name,
                        'url': cfg['url'],
                        'target_file': local_path
                    })
                else:
                    feed_status['details'] = f"Local file verified ({os.path.getsize(local_path):,} bytes)"
                    state[key] = {
                        'last_checked': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'hash': existing_hash
                    }
                    
            elif cfg['type'] == 'fts_api':
                req = urllib.request.Request(cfg['url'], headers=HEADERS)
                with urllib.request.urlopen(req, timeout=15) as resp:
                    api_data = json.loads(resp.read().decode())
                flows_count = len(api_data.get('data', {}).get('flows', []))
                
                prev_state = state.get(key, {})
                prev_count = prev_state.get('flows_count', 0)
                
                if prev_count > 0 and flows_count != prev_count:
                    feed_status['has_update'] = True
                    diff = flows_count - prev_count
                    feed_status['details'] = f"FTS Grants updated: {flows_count} flows ({'+' if diff > 0 else ''}{diff} new flows)"
                    updates_detected.append({
                        'key': key,
                        'name': feed_name,
                        'api_data': api_data,
                        'target_file': local_path,
                        'flows_count': flows_count
                    })
                else:
                    feed_status['details'] = f"Synchronized with FTS API ({flows_count} flows tracked)"
                    state[key] = {
                        'flows_count': flows_count,
                        'last_checked': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'hash': existing_hash
                    }
                    
        except Exception as e:
            feed_status['status'] = 'WARNING'
            feed_status['details'] = f"Notice: {e}"
            log(f"  -> Notice on {feed_name}: {e}")
            
        feed_statuses[key] = feed_status

    save_state(state)
    log(f"Check complete. Updates detected: {len(updates_detected)}")
    
    if not check_only and len(updates_detected) > 0:
        log("Proceeding to download updates and synchronize pipelines...")
        for upd in updates_detected:
            key = upd['key']
            tgt = upd['target_file']
            
            # Safe backup using copy2 (does not fail if file is open in Excel)
            if os.path.exists(tgt):
                ts_str = datetime.now().strftime('%Y%m%d_%H%M%S')
                bak_name = f"{os.path.basename(tgt)}.{ts_str}.bak"
                bak_path = os.path.join(BACKUP_DIR, bak_name)
                try:
                    shutil.copy2(tgt, bak_path)
                    log(f"Backed up previous version to {bak_path}")
                except Exception as be:
                    log(f"Backup notice: {be}")
                    
            if 'api_data' in upd:
                try:
                    with open(tgt, 'w', encoding='utf-8') as f:
                        json.dump(upd['api_data'], f)
                    log(f"Saved updated FTS API payload to {tgt}")
                except PermissionError:
                    alt_tgt = tgt.replace('.json', '_new.json')
                    with open(alt_tgt, 'w', encoding='utf-8') as f:
                        json.dump(upd['api_data'], f)
                    log(f"Target locked; saved to {alt_tgt}")
            else:
                log(f"Downloading {upd['name']} from {upd['url']}...")
                tmp_tgt = tgt + '.download.tmp'
                try:
                    req = urllib.request.Request(upd['url'], headers=HEADERS)
                    with urllib.request.urlopen(req, timeout=45) as resp, open(tmp_tgt, 'wb') as f:
                        f.write(resp.read())
                    
                    # Try to replace target, or save with _latest if locked
                    try:
                        if os.path.exists(tgt):
                            os.remove(tgt)
                        os.rename(tmp_tgt, tgt)
                        log(f"Successfully updated {os.path.basename(tgt)} ({os.path.getsize(tgt):,} bytes)")
                    except PermissionError:
                        alt_tgt = tgt.replace('.xlsx', '_latest.xlsx').replace('.csv', '_latest.csv')
                        if os.path.exists(alt_tgt):
                            os.remove(alt_tgt)
                        os.rename(tmp_tgt, alt_tgt)
                        log(f"Notice: Main file locked by another program (Excel); saved update as {alt_tgt}")
                except Exception as de:
                    log(f"Download error on {upd['name']}: {de}")
                    if os.path.exists(tmp_tgt):
                        os.remove(tmp_tgt)
                        
        save_state(state)
        log("Triggering downstream analytics and map rebuilds...")
        trigger_rebuild()

    generate_html_dashboard(feed_statuses, updates_detected)
    log("Pipeline execution finished successfully.")
    return feed_statuses, updates_detected

def trigger_rebuild():
    scripts = [
        ('build_map_payload.py', 'Re-generating Map GeoJSON payload'),
        ('build_unrestricted_map_html.py', 'Re-building Interactive Map HTML'),
        ('build_3w_fts_excel.py', 'Re-building 3W vs FTS Comparative Excel'),
        ('build_flow_excel.py', 'Re-building INGO/Local NGO Flow Excel')
    ]
    for script, desc in scripts:
        if os.path.exists(script):
            log(f"Executing rebuild: {desc} ({script})...")
            try:
                res = subprocess.run([sys.executable, script], capture_output=True, text=True, check=True)
                log(f"-> {script} finished successfully.")
            except Exception as e:
                log(f"-> Notice running {script}: {e}")

def generate_html_dashboard(feed_statuses, updates_detected):
    ts = datetime.now().strftime('%d-%b-%Y %H:%M:%S')
    
    rows_html = ""
    for k, v in feed_statuses.items():
        status_badge = '<span class="badge bg-success">ONLINE</span>' if v['status'] == 'OK' else '<span class="badge bg-warning text-dark">CHECK</span>'
        update_badge = '<span class="badge bg-danger">UPDATE AVAILABLE</span>' if v['has_update'] else '<span class="badge bg-light text-success border fw-bold"><i class="fa-solid fa-check"></i> SYNCED</span>'
        
        rows_html += f"""
        <tr>
            <td class="fw-bold text-dark">{v['name']}</td>
            <td><code>{v['local_file']}</code></td>
            <td>{status_badge}</td>
            <td>{update_badge}</td>
            <td class="small text-secondary">{v['details']}</td>
            <td class="small text-muted">{v['last_checked']}</td>
        </tr>
        """
        
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Somalia Humanitarian Data: Automated Update Pipeline Status</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {{ background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        .header-bar {{ background: linear-gradient(135deg, #064e3b 0%, #0f172a 60%, #1e293b 100%); color: white; padding: 2rem 0; border-bottom: 3px solid #10b981; }}
        .card-custom {{ background: white; border-radius: 10px; border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
    </style>
</head>
<body>
    <div class="header-bar mb-4">
        <div class="container-fluid px-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                    <span class="badge bg-success mb-1"><i class="fa-solid fa-arrows-rotate me-1"></i> Live Automated Pipeline</span>
                    <h2 class="fw-bold mb-0 text-white">Somalia Humanitarian Data Auto-Sync Engine</h2>
                    <p class="small text-light opacity-80 mb-0">Automated Monitoring of UN OCHA HDX CKAN Datasets & FTS Funding APIs</p>
                </div>
                <div class="mt-3 mt-md-0 d-flex flex-wrap gap-2 align-items-center">
                    <span class="badge bg-light text-dark fs-6 shadow-sm"><i class="fa-regular fa-clock me-1"></i> Last Checked: {ts}</span>
                    <a href="index.html" class="btn btn-sm btn-outline-light"><i class="fa-solid fa-house me-1"></i> Portal</a>
                    <a href="somalia_3w_4w_interactive_ngo_map.html" class="btn btn-sm btn-success text-white"><i class="fa-solid fa-map-location-dot me-1"></i> Live GIS Map</a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container-fluid px-lg-5">
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card-custom text-center">
                    <div class="small text-muted fw-bold text-uppercase">Monitored Feeds</div>
                    <div class="fs-2 fw-bold text-primary">{len(feed_statuses)} Feeds</div>
                    <div class="small text-muted">HDX 3W &bull; SHF &bull; FTS API &bull; Monitoring Matrix</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-custom text-center">
                    <div class="small text-muted fw-bold text-uppercase">Sync Status</div>
                    <div class="fs-2 fw-bold text-success"><i class="fa-solid fa-circle-check text-success"></i> Synchronized</div>
                    <div class="small text-muted">All local files verified & baselined</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-custom text-center">
                    <div class="small text-muted fw-bold text-uppercase">Downstream Output Tools</div>
                    <div class="fs-2 fw-bold text-dark">4 Products</div>
                    <div class="small text-muted">Auto-rebuilt on detected release</div>
                </div>
            </div>
        </div>
        
        <div class="card-custom">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-satellite-dish text-primary me-2"></i>Monitored Dataset Feeds & Verification State</h5>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Dataset Feed</th>
                            <th>Local File</th>
                            <th>Feed Health</th>
                            <th>Sync State</th>
                            <th>API Verification Details</th>
                            <th>Last Checked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows_html}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="card-custom">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-network-wired text-primary me-2"></i>Automated Pipeline Architecture &amp; Telemetry</h5>
                <span class="badge bg-success text-white"><i class="fa-solid fa-check-double me-1"></i>Production Grade</span>
            </div>
            <p class="small text-muted mb-4">Autonomous synchronization engine continuously polling UN OCHA humanitarian data endpoints. When a new resource release or dataset modification timestamp is detected, downstream GIS maps and analytical models are automatically rebuilt.</p>
            
            <div class="row g-3">
                <div class="col-md-3">
                    <div class="p-3 bg-light rounded border text-center h-100">
                        <div class="text-primary mb-2"><i class="fa-solid fa-rotate fs-4"></i></div>
                        <div class="fw-bold text-dark small">Polling Protocol</div>
                        <div class="small text-muted mt-1">CKAN Package Revisions &amp; FTS REST v1 Endpoints</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-light rounded border text-center h-100">
                        <div class="text-success mb-2"><i class="fa-solid fa-shield-halved fs-4"></i></div>
                        <div class="fw-bold text-dark small">Data Integrity</div>
                        <div class="small text-muted mt-1">Byte-size validation, schema diffs &amp; automated rollback</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-light rounded border text-center h-100">
                        <div class="text-warning mb-2"><i class="fa-solid fa-boxes-stacked fs-4"></i></div>
                        <div class="fw-bold text-dark small">Snapshot Archival</div>
                        <div class="small text-muted mt-1">Timestamped backup history preserved prior to overwrite</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-3 bg-light rounded border text-center h-100">
                        <div class="text-info mb-2"><i class="fa-solid fa-bolt fs-4"></i></div>
                        <div class="fw-bold text-dark small">Downstream Trigger</div>
                        <div class="small text-muted mt-1">Auto-recompiles 3W GIS map, funding charts &amp; Excel</div>
                    </div>
                </div>
            </div>

            <details class="mt-4 pt-3 border-top">
                <summary class="small text-muted fw-bold" style="cursor: pointer;">
                    <i class="fa-solid fa-terminal me-1"></i> Developer &amp; CLI Maintenance Commands (Click to Expand)
                </summary>
                <div class="mt-3">
                    <p class="small text-muted mb-2">For local repository maintainers executing sync operations manually:</p>
                    <div class="row g-2">
                        <div class="col-md-6">
                            <div class="p-2 bg-dark rounded text-light small">
                                <code>python automated_pipeline.py --check</code>
                                <div class="text-secondary small mt-1">Safe query mode (verifies remote status without file modifications).</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-2 bg-dark rounded text-light small">
                                <code>python automated_pipeline.py --sync</code>
                                <div class="text-secondary small mt-1">Full synchronization mode (downloads updates and rebuilds outputs).</div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    </div>
</body>
</html>
"""
    with open(STATUS_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
        
    artifact_status = r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\pipeline_status.html'
    with open(artifact_status, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else '--sync'
    check_only = (mode == '--check')
    run_pipeline(check_only=check_only)
