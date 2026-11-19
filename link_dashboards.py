with open('somalia_aid_data_analysis.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'href="Somalia_2026_Humanitarian_Intelligence_Report.xlsx"'
button = '<a href="somalia_2025_vs_2026_comparison.html" class="btn-download bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-bold"><span>⚖️</span> 2025 vs 2026 Comparison</a>\n        <a href="Somalia_2026_Humanitarian_Intelligence_Report.xlsx"'

if target in text:
    text = text.replace(f'<a {target}', f'{button}', 1)
    with open('somalia_aid_data_analysis.html', 'w', encoding='utf-8') as f:
        f.write(text)
    with open(r'C:\Users\KCT\.gemini\antigravity\brain\59e99964-c96a-4ef6-b6e5-dea4a957c58b\somalia_aid_data_analysis.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Linked successfully!")
