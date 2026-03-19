const fs = require('fs');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Skilluminator Dashboard - Cycle 6</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f1117;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px}
h1{font-size:28px;color:#fff;margin-bottom:4px}
h2{font-size:20px;color:#a78bfa;margin:32px 0 16px;border-bottom:1px solid #2a2d3a;padding-bottom:8px}
h3{font-size:16px;color:#94a3b8;margin:20px 0 12px}
.subtitle{color:#94a3b8;font-size:14px;margin-bottom:24px}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.kpi{background:#1a1d2e;border:1px solid #2a2d3a;border-radius:12px;padding:20px;text-align:center}
.kpi .value{font-size:36px;font-weight:700;color:#fff}
.kpi .label{font-size:13px;color:#94a3b8;margin-top:4px}
.kpi .delta{font-size:12px;margin-top:6px;padding:2px 8px;border-radius:10px;display:inline-block}
.delta-up{background:#064e3b;color:#34d399}
.delta-down{background:#7f1d1d;color:#fca5a5}
.delta-new{background:#1e3a5f;color:#93c5fd}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th{text-align:left;padding:10px 12px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #2a2d3a}
td{padding:10px 12px;font-size:13px;border-bottom:1px solid #1e2030}
tr:hover{background:#1a1d2e}
.bar-cell{position:relative;width:120px}
.bar{height:8px;border-radius:4px;display:inline-block;vertical-align:middle}
.bar-auto{background:linear-gradient(90deg,#3b82f6,#60a5fa)}
.bar-value{background:linear-gradient(90deg,#8b5cf6,#a78bfa)}
.bar-composite{background:linear-gradient(90deg,#10b981,#34d399)}
.trend-rising{color:#34d399}
.trend-stable{color:#fbbf24}
.trend-declining{color:#f87171}
.trend-archived{color:#6b7280;text-decoration:line-through}
.trend-new{color:#93c5fd}
.tier-badge{font-size:11px;padding:2px 8px;border-radius:8px;font-weight:600}
.tier-1{background:#064e3b;color:#34d399}
.tier-2{background:#1e3a5f;color:#93c5fd}
.tier-3{background:#3b2f00;color:#fbbf24}
.tier-new{background:#1e1e3a;color:#a78bfa}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.card{background:#1a1d2e;border:1px solid #2a2d3a;border-radius:12px;padding:20px}
.cluster-card{background:#1a1d2e;border:1px solid #2a2d3a;border-radius:12px;padding:20px;margin-bottom:16px}
.cluster-card h4{color:#a78bfa;font-size:15px;margin-bottom:8px}
.cluster-card .stat{color:#94a3b8;font-size:13px}
.cluster-card .members{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.cluster-tag{background:#2a2d3a;color:#e0e0e0;font-size:11px;padding:3px 8px;border-radius:6px}
.json-block{background:#0d0f16;border:1px solid #2a2d3a;border-radius:8px;padding:16px;font-family:'Fira Code',monospace;font-size:12px;overflow-x:auto;max-height:400px;overflow-y:auto;color:#a78bfa;white-space:pre-wrap}
.changelog{font-size:13px;color:#94a3b8;line-height:1.6}
.changelog li{margin-bottom:4px}
.version-badge{display:inline-block;background:#3b82f6;color:#fff;font-size:12px;padding:2px 10px;border-radius:10px;font-weight:600;margin-left:8px}
svg text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
</style>
</head>
<body>
<h1>Skilluminator <span class="version-badge">v1.1.0</span></h1>
<p class="subtitle">Cycle 6 &middot; Week of 2026-03-16 &middot; 25 signals &middot; 28 patterns tracked &middot; 12 skill candidates</p>

<div class="kpi-row">
  <div class="kpi"><div class="value">28</div><div class="label">Patterns Tracked</div><div class="delta delta-up">+2 new, 1 archived</div></div>
  <div class="kpi"><div class="value">12</div><div class="label">Skill Candidates (score &ge;75)</div><div class="delta delta-up">+1 eval-template promoted</div></div>
  <div class="kpi"><div class="value">115.9</div><div class="label">Total hrs/wk Addressable</div><div class="delta delta-up">3 clusters identified</div></div>
  <div class="kpi"><div class="value">6</div><div class="label">Cycles Completed</div><div class="delta delta-new">Pipeline: 5-phase</div></div>
</div>

<h2>Top Skill Candidates</h2>
<table>
<thead><tr><th>#</th><th>Skill Name</th><th>Composite</th><th>Automation</th><th>Value</th><th>hrs/wk</th><th>Occ.</th><th>Trend</th><th>Tier</th></tr></thead>
<tbody>
<tr><td>1</td><td>ado-notification-router</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${89*1.2}px"></div> 89</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${92*1.2}px"></div> 92</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${85*1.2}px"></div> 85</div></td><td>3.0</td><td>110</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-1">T1</span></td></tr>
<tr><td>2</td><td>meeting-notes-action-extractor</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${88*1.2}px"></div> 88</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${88*1.2}px"></div> 88</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${88*1.2}px"></div> 88</div></td><td>8.0</td><td>55</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-1">T1</span></td></tr>
<tr><td>3</td><td>eval-report-synthesizer</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${83*1.2}px"></div> 83</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${76*1.2}px"></div> 76</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${90*1.2}px"></div> 90</div></td><td>11.5</td><td>55</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-1">T1</span></td></tr>
<tr><td>4</td><td>eval-template-scaffolder</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${83*1.2}px"></div> 83</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${80*1.2}px"></div> 80</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${86*1.2}px"></div> 86</div></td><td>3.5</td><td>14</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-1">T1</span></td></tr>
<tr><td>5</td><td>voc-ask-deduplicator</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${83*1.2}px"></div> 83</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${84*1.2}px"></div> 84</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${82*1.2}px"></div> 82</div></td><td>3.7</td><td>27</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-1">T1</span></td></tr>
<tr><td>6</td><td>weekly-status-report-generator</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${81*1.2}px"></div> 81</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${82*1.2}px"></div> 82</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${80*1.2}px"></div> 80</div></td><td>3.0</td><td>14</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-2">T2</span></td></tr>
<tr><td>7</td><td>meeting-summary-publisher</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${81*1.2}px"></div> 81</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${82*1.2}px"></div> 82</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${80*1.2}px"></div> 80</div></td><td>4.0</td><td>20</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-2">T2</span></td></tr>
<tr><td>8</td><td>unified-action-item-tracker</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${81*1.2}px"></div> 81</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${78*1.2}px"></div> 78</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${84*1.2}px"></div> 84</div></td><td>3.3</td><td>17</td><td class="trend-stable">stable</td><td><span class="tier-badge tier-2">T2</span></td></tr>
<tr><td>9</td><td>knowledge-context-consolidator</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${80*1.2}px"></div> 80</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${74*1.2}px"></div> 74</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${86*1.2}px"></div> 86</div></td><td>8.3</td><td>39</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-2">T2</span></td></tr>
<tr><td>10</td><td>recurring-agenda-generator</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${79*1.2}px"></div> 79</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${80*1.2}px"></div> 80</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${78*1.2}px"></div> 78</div></td><td>15.9</td><td>34</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-2">T2</span></td></tr>
<tr><td>11</td><td>copilot-platform-faq-responder</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${77*1.2}px"></div> 77</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${72*1.2}px"></div> 72</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${82*1.2}px"></div> 82</div></td><td>8.9</td><td>41</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-3">T3</span></td></tr>
<tr><td>12</td><td>calendar-triage-advisor</td><td><div class="bar-cell"><div class="bar bar-composite" style="width:${77*1.2}px"></div> 77</div></td><td><div class="bar-cell"><div class="bar bar-auto" style="width:${72*1.2}px"></div> 72</div></td><td><div class="bar-cell"><div class="bar bar-value" style="width:${82*1.2}px"></div> 82</div></td><td>32.3</td><td>111</td><td class="trend-rising">rising</td><td><span class="tier-badge tier-3">T3</span></td></tr>
</tbody>
</table>

<div class="grid-2">
<div>
<h2>Automation vs Value Bubble Chart</h2>
<div class="card">
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.7"/><stop offset="100%" stop-color="#60a5fa" stop-opacity="0.7"/></linearGradient>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.7"/><stop offset="100%" stop-color="#a78bfa" stop-opacity="0.7"/></linearGradient>
    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.7"/><stop offset="100%" stop-color="#34d399" stop-opacity="0.7"/></linearGradient>
  </defs>
  <!-- Axes -->
  <line x1="50" y1="350" x2="480" y2="350" stroke="#2a2d3a" stroke-width="1"/>
  <line x1="50" y1="20" x2="50" y2="350" stroke="#2a2d3a" stroke-width="1"/>
  <text x="250" y="390" fill="#94a3b8" font-size="12" text-anchor="middle">Automation Score</text>
  <text x="15" y="185" fill="#94a3b8" font-size="12" text-anchor="middle" transform="rotate(-90,15,185)">Value Score</text>
  <!-- Grid -->
  <line x1="50" y1="185" x2="480" y2="185" stroke="#1e2030" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="265" y1="20" x2="265" y2="350" stroke="#1e2030" stroke-width="0.5" stroke-dasharray="4"/>
  <text x="46" y="355" fill="#6b7280" font-size="10" text-anchor="end">40</text>
  <text x="46" y="185" fill="#6b7280" font-size="10" text-anchor="end">70</text>
  <text x="46" y="25" fill="#6b7280" font-size="10" text-anchor="end">100</text>
  <text x="50" y="370" fill="#6b7280" font-size="10" text-anchor="middle">50</text>
  <text x="265" y="370" fill="#6b7280" font-size="10" text-anchor="middle">75</text>
  <text x="480" y="370" fill="#6b7280" font-size="10" text-anchor="middle">100</text>
  <!-- Bubbles: x = 50 + (auto-50)*8.6, y = 350 - (val-40)*5.5, r = sqrt(occ)*2 -->
  <!-- ADO: auto=92, val=85, occ=110 -->
  <circle cx="${50+(92-50)*8.6}" cy="${350-(85-40)*5.5}" r="${Math.sqrt(110)*2}" fill="url(#g3)" stroke="#34d399" stroke-width="1"/>
  <text x="${50+(92-50)*8.6}" y="${350-(85-40)*5.5-Math.sqrt(110)*2-4}" fill="#34d399" font-size="9" text-anchor="middle">ADO Triage</text>
  <!-- Meeting Notes: auto=88, val=88, occ=55 -->
  <circle cx="${50+(88-50)*8.6}" cy="${350-(88-40)*5.5}" r="${Math.sqrt(55)*2}" fill="url(#g1)" stroke="#60a5fa" stroke-width="1"/>
  <text x="${50+(88-50)*8.6}" y="${350-(88-40)*5.5-Math.sqrt(55)*2-4}" fill="#60a5fa" font-size="9" text-anchor="middle">Meeting Notes</text>
  <!-- Eval Results: auto=76, val=90, occ=55 -->
  <circle cx="${50+(76-50)*8.6}" cy="${350-(90-40)*5.5}" r="${Math.sqrt(55)*2}" fill="url(#g2)" stroke="#a78bfa" stroke-width="1"/>
  <text x="${50+(76-50)*8.6}" y="${350-(90-40)*5.5-Math.sqrt(55)*2-4}" fill="#a78bfa" font-size="9" text-anchor="middle">Eval Results</text>
  <!-- VoC: auto=84, val=82, occ=27 -->
  <circle cx="${50+(84-50)*8.6}" cy="${350-(82-40)*5.5}" r="${Math.sqrt(27)*2}" fill="url(#g1)" stroke="#60a5fa" stroke-width="1"/>
  <text x="${50+(84-50)*8.6}" y="${350-(82-40)*5.5-Math.sqrt(27)*2-4}" fill="#60a5fa" font-size="9" text-anchor="middle">VoC Dedup</text>
  <!-- Eval Template: auto=80, val=86, occ=14 -->
  <circle cx="${50+(80-50)*8.6}" cy="${350-(86-40)*5.5}" r="${Math.sqrt(14)*2}" fill="url(#g2)" stroke="#a78bfa" stroke-width="1"/>
  <text x="${50+(80-50)*8.6}" y="${350-(86-40)*5.5-Math.sqrt(14)*2-4}" fill="#a78bfa" font-size="9" text-anchor="middle">Eval Template</text>
  <!-- Context Frag: auto=74, val=86, occ=39 -->
  <circle cx="${50+(74-50)*8.6}" cy="${350-(86-40)*5.5}" r="${Math.sqrt(39)*2}" fill="url(#g1)" stroke="#60a5fa" stroke-width="1"/>
  <text x="${50+(74-50)*8.6+20}" y="${350-(86-40)*5.5}" fill="#60a5fa" font-size="9" text-anchor="start">Context Frag</text>
  <!-- Recurring Agenda: auto=80, val=78, occ=34 -->
  <circle cx="${50+(80-50)*8.6}" cy="${350-(78-40)*5.5}" r="${Math.sqrt(34)*2}" fill="url(#g3)" stroke="#34d399" stroke-width="1"/>
  <text x="${50+(80-50)*8.6}" y="${350-(78-40)*5.5+Math.sqrt(34)*2+12}" fill="#34d399" font-size="9" text-anchor="middle">Agenda Gen</text>
  <!-- Calendar: auto=72, val=82, occ=111 -->
  <circle cx="${50+(72-50)*8.6}" cy="${350-(82-40)*5.5}" r="${Math.sqrt(111)*2}" fill="url(#g3)" stroke="#34d399" stroke-width="1" opacity="0.6"/>
  <text x="${50+(72-50)*8.6}" y="${350-(82-40)*5.5+4}" fill="#34d399" font-size="9" text-anchor="middle">Calendar</text>
  <!-- FAQ: auto=72, val=82, occ=41 -->
  <circle cx="${50+(72-50)*8.6+22}" cy="${350-(82-40)*5.5+15}" r="${Math.sqrt(41)*2}" fill="url(#g2)" stroke="#a78bfa" stroke-width="1"/>
  <text x="${50+(72-50)*8.6+22}" y="${350-(82-40)*5.5+15+Math.sqrt(41)*2+10}" fill="#a78bfa" font-size="9" text-anchor="middle">FAQ</text>
</svg>
<p style="text-align:center;color:#6b7280;font-size:11px;margin-top:8px">Bubble size = occurrence count. Top-right = highest composite score.</p>
</div>
</div>

<div>
<h2>Signal Sources (Cycle 6)</h2>
<div class="card" style="text-align:center">
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Donut chart: email=7, meeting=5, teams=7, document=6 = 25 total -->
  <!-- email: 7/25 = 28% = 100.8deg, meeting: 5/25 = 20% = 72deg, teams: 7/25 = 28% = 100.8deg, doc: 6/25 = 24% = 86.4deg -->
  <!-- Using stroke-dasharray on circles -->
  <circle cx="150" cy="150" r="90" fill="none" stroke="#3b82f6" stroke-width="40" stroke-dasharray="158.4 400" stroke-dashoffset="0" transform="rotate(-90 150 150)"/>
  <circle cx="150" cy="150" r="90" fill="none" stroke="#8b5cf6" stroke-width="40" stroke-dasharray="113.1 445.3" stroke-dashoffset="-158.4" transform="rotate(-90 150 150)"/>
  <circle cx="150" cy="150" r="90" fill="none" stroke="#10b981" stroke-width="40" stroke-dasharray="158.4 400" stroke-dashoffset="-271.5" transform="rotate(-90 150 150)"/>
  <circle cx="150" cy="150" r="90" fill="none" stroke="#f59e0b" stroke-width="40" stroke-dasharray="135.7 422.7" stroke-dashoffset="-429.9" transform="rotate(-90 150 150)"/>
  <circle cx="150" cy="150" r="70" fill="#0f1117"/>
  <text x="150" y="145" fill="#fff" font-size="24" font-weight="700" text-anchor="middle">25</text>
  <text x="150" y="165" fill="#94a3b8" font-size="12" text-anchor="middle">signals</text>
</svg>
<div style="display:flex;justify-content:center;gap:20px;margin-top:12px;font-size:12px">
  <span><span style="color:#3b82f6">&#9679;</span> Email (7)</span>
  <span><span style="color:#8b5cf6">&#9679;</span> Meeting (5)</span>
  <span><span style="color:#10b981">&#9679;</span> Teams (7)</span>
  <span><span style="color:#f59e0b">&#9679;</span> Document (6)</span>
</div>
</div>

<h2>Pattern Clusters</h2>
<div class="cluster-card">
  <h4>Meeting Output Ecosystem</h4>
  <div class="stat">142 occurrences &middot; 38.58 hrs/wk &middot; 5 member patterns</div>
  <div class="members">
    <span class="cluster-tag">meeting-notes-capture</span>
    <span class="cluster-tag">transcript-to-loop</span>
    <span class="cluster-tag">recurring-agenda</span>
    <span class="cluster-tag">external-followup</span>
    <span class="cluster-tag">action-tracking</span>
  </div>
</div>
<div class="cluster-card">
  <h4>Eval Ecosystem</h4>
  <div class="stat">126 occurrences &middot; 34.67 hrs/wk &middot; 4 member patterns</div>
  <div class="members">
    <span class="cluster-tag">eval-results-analysis</span>
    <span class="cluster-tag">eval-template-scaffolder</span>
    <span class="cluster-tag">partner-enablement</span>
    <span class="cluster-tag">copilot-faq</span>
  </div>
</div>
<div class="cluster-card">
  <h4>Event Coordination</h4>
  <div class="stat">70 occurrences &middot; 42.75 hrs/wk &middot; 3 member patterns</div>
  <div class="members">
    <span class="cluster-tag">event-artifacts</span>
    <span class="cluster-tag">deck-creation</span>
    <span class="cluster-tag">review-deck</span>
  </div>
</div>
</div>
</div>

<h2>Org-Wide Patterns (participantCount &ge; 3)</h2>
<table>
<thead><tr><th>Pattern</th><th>Sources</th><th>Occ.</th><th>Participants</th><th>hrs/wk</th><th>Auto</th><th>Value</th><th>Trend</th></tr></thead>
<tbody>
<tr><td>ADO Notification Triage</td><td>email</td><td>110</td><td>3</td><td>3.0</td><td>92</td><td>85</td><td class="trend-rising">rising</td></tr>
<tr><td>Meeting Notes & Action Capture</td><td>doc, mtg, email, teams</td><td>55</td><td>4</td><td>8.0</td><td>88</td><td>88</td><td class="trend-rising">rising</td></tr>
<tr><td>Eval Results Analysis</td><td>doc, teams, email, mtg</td><td>55</td><td>5</td><td>11.5</td><td>76</td><td>90</td><td class="trend-rising">rising</td></tr>
<tr><td>Training Event Coordination</td><td>mtg, teams, doc, email</td><td>55</td><td>6</td><td>31.5</td><td>62</td><td>86</td><td class="trend-rising">rising</td></tr>
<tr><td>Copilot Platform FAQ</td><td>teams, mtg, email</td><td>41</td><td>5</td><td>8.9</td><td>72</td><td>82</td><td class="trend-rising">rising</td></tr>
<tr><td>Context Fragmentation</td><td>teams, email, doc, mtg</td><td>39</td><td>4</td><td>8.3</td><td>74</td><td>86</td><td class="trend-rising">rising</td></tr>
<tr><td>Recurring Agenda Generator</td><td>mtg, doc, teams</td><td>34</td><td>6</td><td>15.9</td><td>80</td><td>78</td><td class="trend-rising">rising</td></tr>
<tr><td>VoC Customer Ask Dedup</td><td>teams, email</td><td>27</td><td>4</td><td>3.7</td><td>84</td><td>82</td><td class="trend-rising">rising</td></tr>
<tr><td>Transcript to Loop Pipeline</td><td>mtg, doc, teams</td><td>20</td><td>4</td><td>4.0</td><td>82</td><td>80</td><td class="trend-rising">rising</td></tr>
<tr><td>Ownership Routing</td><td>teams, email</td><td>20</td><td>4</td><td>2.7</td><td>74</td><td>62</td><td class="trend-stable">stable</td></tr>
<tr><td>Access Governance Alerts</td><td>email</td><td>19</td><td>3</td><td>1.2</td><td>90</td><td>58</td><td class="trend-rising">rising</td></tr>
<tr><td>Action Owner Chasing</td><td>teams, email</td><td>18</td><td>3</td><td>2.7</td><td>74</td><td>78</td><td class="trend-stable">stable</td></tr>
<tr><td>Fragmented Action Tracking</td><td>teams, mtg, email, doc</td><td>17</td><td>4</td><td>3.3</td><td>78</td><td>84</td><td class="trend-stable">stable</td></tr>
<tr><td>Partner Eval Enablement</td><td>mtg, email, doc</td><td>16</td><td>4</td><td>10.8</td><td>65</td><td>88</td><td class="trend-rising">rising</td></tr>
<tr><td>External Followup Drafter</td><td>email, mtg</td><td>16</td><td>4</td><td>2.7</td><td>82</td><td>78</td><td class="trend-rising">rising</td></tr>
<tr><td>Eval Template Scaffolder</td><td>doc, teams</td><td>14</td><td>3</td><td>3.5</td><td>80</td><td>86</td><td class="trend-rising">rising</td></tr>
<tr><td>Weekly Status Report</td><td>doc, email, teams</td><td>14</td><td>4</td><td>3.0</td><td>82</td><td>80</td><td class="trend-rising">rising</td></tr>
<tr><td>Escalation Email Drafter</td><td>email</td><td>10</td><td>4</td><td>2.6</td><td>70</td><td>62</td><td class="trend-stable">stable</td></tr>
<tr><td>Redundant Deck Creation</td><td>doc</td><td>9</td><td>4</td><td>6.5</td><td>64</td><td>82</td><td class="trend-stable">stable</td></tr>
<tr><td style="color:#93c5fd">Link/Access Resolution <span class="tier-badge tier-new">NEW</span></td><td>teams, email</td><td>6</td><td>3</td><td>0.8</td><td>72</td><td>68</td><td class="trend-new">new</td></tr>
<tr><td>Review Deck Maintenance</td><td>doc, mtg</td><td>6</td><td>3</td><td>4.8</td><td>68</td><td>74</td><td class="trend-stable">stable</td></tr>
<tr><td>Customer SDR Generator</td><td>email, doc</td><td>5</td><td>3</td><td>2.0</td><td>76</td><td>84</td><td class="trend-rising">rising</td></tr>
<tr><td>Customer Signals Tracker</td><td>doc, email</td><td>4</td><td>3</td><td>2.0</td><td>70</td><td>76</td><td class="trend-rising">rising</td></tr>
<tr><td style="color:#93c5fd">Incident Doc Coordinator <span class="tier-badge tier-new">NEW</span></td><td>email, teams, mtg</td><td>2</td><td>3</td><td>1.0</td><td>70</td><td>72</td><td class="trend-new">new</td></tr>
</tbody>
</table>

<h2>Skill-Generator Input (JSON)</h2>
<div class="json-block">{
  "candidateSkills": [
    { "rank": 1, "name": "ado-notification-router", "compositeScore": 89, "cluster": null },
    { "rank": 2, "name": "meeting-notes-action-extractor", "compositeScore": 88, "cluster": "meeting-output-ecosystem" },
    { "rank": 3, "name": "eval-report-synthesizer", "compositeScore": 83, "cluster": "eval-ecosystem" },
    { "rank": 4, "name": "eval-template-scaffolder", "compositeScore": 83, "cluster": "eval-ecosystem" },
    { "rank": 5, "name": "voc-ask-deduplicator", "compositeScore": 83, "cluster": null },
    { "rank": 6, "name": "weekly-status-report-generator", "compositeScore": 81, "cluster": null },
    { "rank": 7, "name": "meeting-summary-publisher", "compositeScore": 81, "cluster": "meeting-output-ecosystem" },
    { "rank": 8, "name": "unified-action-item-tracker", "compositeScore": 81, "cluster": "meeting-output-ecosystem" },
    { "rank": 9, "name": "knowledge-context-consolidator", "compositeScore": 80, "cluster": null },
    { "rank": 10, "name": "recurring-agenda-generator", "compositeScore": 79, "cluster": "meeting-output-ecosystem" },
    { "rank": 11, "name": "copilot-platform-faq-responder", "compositeScore": 77, "cluster": "eval-ecosystem" },
    { "rank": 12, "name": "calendar-triage-advisor", "compositeScore": 77, "cluster": null }
  ],
  "workflowChains": [
    { "chainId": "email-meeting-deck-followup", "patternsInvolved": 4, "detectedCycle": 6 }
  ],
  "patternClusters": [
    { "clusterId": "meeting-output-ecosystem", "combinedHrsWk": 38.58, "memberCount": 5 },
    { "clusterId": "eval-ecosystem", "combinedHrsWk": 34.67, "memberCount": 4 },
    { "clusterId": "event-coordination-ecosystem", "combinedHrsWk": 42.75, "memberCount": 3 }
  ]
}</div>

<h2>Skill-Detector v1.1.0 &middot; Refinement Changelog</h2>
<ul class="changelog">
  <li><strong>v1.1.0 (Cycle 6)</strong> &mdash; Major upgrade: 5-phase pipeline (added CLUSTER phase). 12 archetypes (+Link/Access Resolution, +Incident Response Coordination). Formal pattern lifecycle management (signal &rarr; candidate &rarr; confirmed &rarr; mature &rarr; declining &rarr; archived). Workflow chain detection with first chain identified (email-meeting-deck-followup). Event surge detector for episodic vs structural pattern separation. 3 pattern clusters identified (eval ecosystem, meeting output ecosystem, event coordination). Tier tables now show cycle presence counts (e.g., "6/6"). eval-template-scaffolder promoted to Tier 1. FFv2-rollout-runbook archived. 2 new patterns discovered.</li>
  <li><strong>v1.0.0 (Cycle 5)</strong> &mdash; Initial release. 10 pattern archetypes, 4-phase HARVEST-CLASSIFY-SCORE-GENERATE pipeline, 26 patterns from 5 cycles of real M365 analysis, frequency thresholds, multi-signal convergence heuristics, same-inputs-same-outputs test.</li>
</ul>

<div style="text-align:center;color:#6b7280;font-size:11px;margin-top:40px;padding-top:16px;border-top:1px solid #1e2030">
  Skilluminator &middot; Generated 2026-03-19 &middot; Cycle 6 &middot; skill-detector v1.1.0 &middot; 28 patterns &middot; 12 candidates &middot; 3 clusters
</div>
</body>
</html>`;

fs.writeFileSync('C:/Users/serenaxie/OneDrive - Microsoft/Skilluminator/dashboard.html', html);
console.log('dashboard.html written successfully');
