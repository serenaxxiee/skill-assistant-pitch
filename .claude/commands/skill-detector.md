You are running the Skilluminator skill-detector — a tool that analyzes the user's M365 work activity to discover their most automatable work patterns and generate a personal insights dashboard.

## SETUP CHECK

Before starting, verify:
1. WorkIQ MCP is available (try a test query). If not, tell the user to run:
   ```
   claude mcp add workiq -- npx -y @microsoft/workiq@0.4.0 mcp
   ```
   Then restart Claude Code and re-run this command.
2. If WorkIQ fails after setup, fall back to SELF-REPORT MODE (Phase 0B below).

## PHASE 0A — DETECT DATA SOURCE

Try this WorkIQ query: "What meetings did I attend this week?"
- If it returns data → proceed to Phase 1 (WorkIQ mode)
- If it errors → tell the user and fall back to Phase 0B (self-report)

## PHASE 0B — SELF-REPORT MODE (fallback)

If WorkIQ is unavailable, ask the user these 10 questions one at a time. Wait for each answer before proceeding:

1. What is the most repetitive thing you do at work every week?
2. What task takes the most time that you wish someone else could do?
3. Do you write similar documents or emails over and over? What type?
4. Are there emails or notifications you sort, triage, or route regularly?
5. Do you run recurring meetings? Do you prep agendas from scratch each time?
6. Do people come to you repeatedly with the same questions? What topic?
7. After meetings, do you manually write up notes, action items, follow-ups?
8. Do you track action items across multiple tools (Teams, ADO, email, docs)?
9. Do you produce weekly/monthly status reports? How many formats?
10. Is there a workflow where you receive something, then always do the same sequence?

Apply -5 to both automation and value scores for self-report data. Mark all output as "[Self-Report Mode]".

## PHASE 1 — HARVEST (WorkIQ mode)

Run ALL 15 of these WorkIQ queries using the ask_work_iq tool. Capture full responses.

**Email:**
1. "What email threads did I send or receive most frequently in the past 7 days? List subject patterns, sender/recipient groups, and approximate time spent."
2. "Are there recurring email types I write regularly (status, approvals, scheduling)? Show examples from the past week."
3. "Which emails required the most back-and-forth this past week, and what was the topic?"

**Meetings:**
4. "What recurring meetings did I attend this past week? Typical agenda type and attendees?"
5. "How much total meeting time this past week, broken down by type (1:1, team sync, external)?"
6. "Which meeting types happen every week at roughly the same time with the same people?"

**Teams:**
7. "What Teams channels or chats am I most active in over the past 7 days? Recurring topics?"
8. "Are there questions I get asked repeatedly in Teams chats? What topic?"
9. "What types of information do I most frequently share or look up in Teams this week?"

**Documents:**
10. "What types of documents did I create, edit, or review most often this past week?"
11. "Are there documents I update on a regular cadence (weekly/monthly reports, trackers)?"
12. "What SharePoint sites or OneDrive folders do I access most frequently?"

**Cross-source:**
13. "Across email, meetings, and Teams, what topics consumed the most of my time this week?"
14. "Are there workflows that repeat (e.g., get email -> schedule meeting -> create doc)?"
15. "What tasks do multiple people on my team do independently that could be standardized?"

## PHASE 2 — EXTRACT SIGNALS

From each WorkIQ response (or self-report answer), extract signals:
- **source**: email | meeting | teams | document | self-report
- **patternHint**: short description of the repeating behavior
- **frequency**: daily | weekly | ad-hoc | estimated count per week
- **timeEstimate**: hours this week
- **participants**: count of people involved (use ROLES only, never names)
- **toolsInvolved**: list of M365 tools touched

Rules:
- One signal per distinct behavior, not per mention
- Same behavior across 2+ queries → merge, note multi-source
- Participants: roles only (PM, Engineering Lead) — NEVER names
- Never invent data not present in WorkIQ responses

## PHASE 3 — CLUSTER INTO PATTERNS

Group signals into patterns when they share 2+ of:
- Same source type
- Same topic domain (evals, status, triage, coordination)
- Same action verb (write, triage, schedule, summarize)
- Same trigger-output chain (receive X → produce Y)

## PHASE 4 — SCORE EACH PATTERN

**Automation Score (0-100)** — How rule-based and repetitive?
- Unambiguous trigger (email arrives, meeting ends): +20
- Fixed output format (template, structured doc): +20
- Same steps every time (no judgment branching): +20
- No sensitive info requiring human sign-off: +15
- Single source (1 M365 tool): +10
- High volume (20+ occ/week): +10
- Observed for 3+ cycles: +5

**Value Score (0-100)** — How costly is this pattern?
- High time cost (2+ hrs/week): +25
- High frequency (10+ times/week): +20
- Blocks others (downstream delays): +20
- Part of critical workflow: +15
- Growing trend: +10
- Pain expressed by user: +10

**Composite** = (Automation × 0.55) + (Value × 0.45)

## PHASE 5 — WRITE patterns.json

Write the results to `patterns.json` in the current directory with this EXACT schema:

```json
{
  "lastUpdatedCycle": 1,
  "totalCyclesRun": 1,
  "weekOf": "YYYY-MM-DD",
  "patterns": [
    {
      "patternId": "kebab-case-id",
      "label": "Human Readable Name",
      "sources": ["email", "meeting", "teams", "document"],
      "occurrenceCount": 0,
      "participantCount": 0,
      "timeSpentHoursTotal": 0.0,
      "automationScore": 0,
      "valueScore": 0,
      "candidateSkillName": "kebab-case-skill-name",
      "firstSeenCycle": 1,
      "lastSeenCycle": 1,
      "trend": "stable",
      "maturity": "confirmed",
      "velocity": 0.0,
      "llmRationale": "Why this pattern matters and what drives it"
    }
  ]
}
```

Sort patterns by composite score descending. Include ALL patterns found (minimum 5, aim for 10-20).

## PHASE 6 — GENERATE DASHBOARD

After writing patterns.json, generate the dashboard. Check if `scripts/generate-dashboard.js` exists in the skilluminator repo:

1. If it exists: run `node scripts/generate-dashboard.js --input patterns.json --output dashboard.html`
2. If not: Tell the user to get it from https://github.com/serenaxxiee/skilluminator/blob/main/scripts/generate-dashboard.js

Then open the dashboard:
- Windows: `start dashboard.html`
- Mac: `open dashboard.html`
- Linux: `xdg-open dashboard.html`

## PHASE 7 — PRESENT TOP FINDINGS

After the dashboard opens, give the user a brief summary:

For the top 3 skill candidates, explain in plain language:
- **WHAT**: What does this skill do for you? (one sentence, no jargon)
- **WHY**: Why should you care right now? (name the specific pain)
- **FUTURE**: What does your work look like with this skill? (before/after with hours)

End with: "Your full dashboard is open in the browser. Run this command again anytime to refresh with new data."
