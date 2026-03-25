# Skilluminator

Analyzes your M365 work activity to discover which of your repeated work patterns are the best candidates for AI automation — and generates a visual dashboard of the findings.

Works with any role. Powered by WorkIQ + Claude Code.

## What it does

1. Queries your email, meetings, Teams chats, and documents via WorkIQ
2. Extracts repeating behavioral signals and clusters them into patterns
3. Filters out patterns already handled by M365 built-in tools (Teams Copilot, Focused Inbox, etc.)
4. Verifies actual meeting attendance (not just calendar invites)
5. Scores patterns on automation feasibility and business value
6. Generates an interactive HTML dashboard with analytics and top skill candidates
7. Offers to build any candidate via `/skill-creator`

## Setup

### Prerequisites

- [Claude Code](https://claude.ai/claude-code) installed
- Microsoft 365 account with WorkIQ access

### Install

1. Copy the contents of this kit into your project directory, preserving the folder structure:

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── skilluminator.md
│   │   └── skilluminator-dashboard.md
│   └── skills/
│       └── skilluminator/
│           └── SKILL.md
└── scripts/
    └── generate-dashboard.js
```

2. Add WorkIQ as an MCP server:

```bash
claude mcp add workiq -- npx -y @microsoft/workiq@latest mcp
```

3. Restart Claude Code.

## Usage

### Run the analysis

```
/skilluminator past 30 days
```

Or with other time ranges:

```
/skilluminator past 7 days
/skilluminator past 2 weeks
/skilluminator in March 2026
```

### What you'll get

- A scored dashboard (`output/dashboard.html`) with:
  - All detected patterns ranked by composite score
  - Tier labels: Strong (70+), Moderate (50-69), Worth Exploring (<50)
  - Automation vs Value bubble chart
  - Rubric breakdowns for every pattern
  - Filtered patterns (already automated by M365 or below relevance threshold)
- CLI summary with top skill candidates and build instructions

### Regenerate the dashboard

```
/skilluminator-dashboard
```

### Build a skill from a candidate

After reviewing candidates, run:

```
/skill-creator [candidate-name]
```

## How scoring works

Each pattern is scored on two dimensions:

**Automation Score (0-100):** How rule-based and repetitive is it?
- Clear trigger, fixed output, same steps, no sensitive sign-off, single source, high volume

**Value Score (0-100):** How much does it cost you?
- Time cost, frequency, blocks others, critical workflow, pain expressed

**Composite = (Automation × 0.55) + (Value × 0.45)**

## What gets filtered out

The skill automatically filters patterns that are:
- Already handled by M365 built-in tools (Teams Copilot Meeting Recap, Chat Recap, etc.)
- Based on unverified meeting attendance (calendar invites ≠ attendance)
- Below the relevance threshold (<30 min/week AND <5/week AND single-source AND no pain signals)

## Output files

| File | Description |
|------|-------------|
| `data/skilluminator-patterns.json` | Scored patterns with full rubric breakdowns |
| `output/skilluminator-dashboard.html` | Self-contained HTML dashboard (no dependencies) |

These are per-user — each person generates their own when they run `/skilluminator`.
