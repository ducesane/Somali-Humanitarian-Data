import os

dashboards = [
    'somalia_aid_data_analysis.html',
    'somalia_2025_vs_2026_comparison.html'
]

master_pill = '<a href="somalia_integrated_humanitarian_master_dashboard.html" class="btn-download bg-purple-600/20 border-purple-500/50 text-purple-300 font-bold"><span>🌐</span> Master Integration</a>\n        '

for db in dashboards:
    if os.path.exists(db):
        with open(db, 'r', encoding='utf-8') as f:
            text = f.read()
        if 'somalia_integrated_humanitarian_master_dashboard.html' not in text:
            target = '<a href="Somalia_'
            if target in text:
                text = text.replace(target, f'{master_pill}{target}', 1)
                with open(db, 'w', encoding='utf-8') as f:
                    f.write(text)
                artifact_path = os.path.join(r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b', db)
                with open(artifact_path, 'w', encoding='utf-8') as f:
                    f.write(text)
                print(f"Updated {db} with Master Integration link!")

print("All dashboards interconnected!")
