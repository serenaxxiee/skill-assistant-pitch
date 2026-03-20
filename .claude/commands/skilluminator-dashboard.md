You are running the Skilluminator Dashboard generator — a tool that reads pattern analysis data and produces a beautiful, self-contained HTML insights dashboard.

## PREREQUISITES

Before generating the dashboard, verify that `patterns.json` exists. Check these locations in order:
1. `patterns.json` in the current working directory
2. `data/patterns.json` in the skilluminator repo

If neither exists, tell the user: "No patterns.json found. Run `/skill-detector` first to harvest and analyze your M365 work patterns, then re-run `/skilluminator-dashboard`."

## STEP 1 — LOCATE THE GENERATOR SCRIPT

Find `generate-dashboard.js` by checking these paths in order:
1. `scripts/generate-dashboard.js` (relative to the skilluminator repo root)
2. Search for it: `find . -name "generate-dashboard.js" -type f 2>/dev/null | head -5`

If not found, tell the user: "Dashboard generator script not found. Clone or pull the latest from https://github.com/serenaxxiee/skilluminator and try again."

## STEP 2 — DETERMINE OUTPUT PATH

Decide the output path:
1. If the environment variable `SKILLUMINATOR_ONEDRIVE_DIR` is set (check `.env` if present), use `$SKILLUMINATOR_ONEDRIVE_DIR/skilluminator_dashboard.html`
2. Otherwise, use `output/skilluminator_dashboard.html` (relative to the skilluminator repo root, creating the `output/` directory if needed)
3. Also always generate `output/dashboard.html` in the repo for git tracking

## STEP 3 — GENERATE THE DASHBOARD

Run the generator script. Use the patterns.json path found in Step 1 and output path from Step 2:

```bash
node scripts/generate-dashboard.js --input <patterns.json path> --output <output path>
```

If the generator script fails, report the error to the user and suggest checking that `patterns.json` is valid JSON.

## STEP 4 — COPY TO ONEDRIVE (if configured)

If `SKILLUMINATOR_ONEDRIVE_DIR` is set in `.env`:
- Copy the dashboard to that directory as `skilluminator_dashboard.html`
- Confirm the copy succeeded

## STEP 5 — OPEN IN BROWSER

Open the generated dashboard file:
- Windows: `start <output path>`
- Mac: `open <output path>`
- Linux: `xdg-open <output path>`

## STEP 6 — REPORT RESULTS

Print a short summary:
- Confirm the dashboard was generated successfully
- Show the output file path
- Report key stats from the generation output (cycle number, pattern count, key metrics)
- If there were harvest failures, mention the data may be stale
- Tell the user: "Run `/skill-detector` to refresh your pattern data, or `/skilluminator-dashboard` anytime to regenerate the dashboard."
