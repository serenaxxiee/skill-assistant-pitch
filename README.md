# Skilluminator

Analyzes your M365 work activity to discover which of your repeated work patterns are the best candidates for AI automation — and generates a visual dashboard of the findings.

Works with any role. Powered by WorkIQ + Agency Copilot.

[View the infographic](https://serenaxxiee.github.io/skilluminator/)

## Install

In your terminal, run:

```
npx skills add serenaxxiee/skilluminator
```

That's it. Then open **Agency Copilot** to start using the skill.

### Prerequisites

- [Agency Copilot](https://github.com/serenaxxiee/skilluminator) installed
- Microsoft 365 account with WorkIQ access

### Verify WorkIQ Connection

Before running Skilluminator, confirm WorkIQ is connected:

1. In Agency Copilot, ask: *"Use WorkIQ to answer: What meetings did I attend this week?"*
2. If it returns meeting data — you're good to go
3. If it errors, check:
   - Your M365 Copilot license is active in your admin center
   - You've accepted the WorkIQ EULA — see [microsoft/work-iq-mcp](https://github.com/microsoft/work-iq-mcp)
   - M365 Service Health at [admin.microsoft.com](https://admin.microsoft.com)

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

### Regenerate the dashboard

```
/skilluminator-dashboard
```

### Build a skill from a candidate

```
/skill-creator [candidate-name]
```

## What It Does

1. Queries your email, meetings, Teams chats, and documents via WorkIQ
2. Extracts repeating behavioral signals and clusters them into patterns
3. Filters out patterns already handled by M365 built-in tools (Teams Copilot, Focused Inbox, etc.)
4. Verifies actual meeting attendance (not just calendar invites)
5. Scores patterns on automation feasibility and business value
6. Generates an interactive HTML dashboard with analytics and top skill candidates
7. Offers to build any candidate via `/skill-creator`

## How Scoring Works

Each pattern is scored on two dimensions:

**Automation Score (0-100):** How rule-based and repetitive is it?
- Clear trigger, fixed output, same steps, no sensitive sign-off, single source, high volume

**Value Score (0-100):** How much does it cost you?
- Time cost, frequency, blocks others, critical workflow, pain expressed

**Composite = (Automation x 0.55) + (Value x 0.45)**

| Tier | Score | Meaning |
|------|-------|---------|
| Strong | 70+ | High automation potential AND high value. Build first. |
| Moderate | 50-69 | Automatable but may need human-in-the-loop. Worth building. |
| Exploring | <50 | Painful but hard to automate. Consider partial solutions. |

## What Gets Filtered Out

- Patterns already handled by M365 built-in tools (Teams Copilot Meeting Recap, Chat Recap, etc.)
- Patterns based on unverified meeting attendance (calendar invites != attendance)
- Patterns below the relevance threshold (<30 min/week AND <5/week AND single-source AND no pain signals)

## License

MIT
