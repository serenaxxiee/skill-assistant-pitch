const fs = require('fs');
const content = `---
name: skill-detector
description: Detects repeated work patterns in M365 activity data and converts them into reusable Claude AI skill candidates. Queries WorkIQ MCP for email, calendar, Teams, and SharePoint signals, classifies them into pattern archetypes, scores them on automation feasibility and business value, clusters related patterns into workflow chains, computes confidence levels from cross-cycle evidence, and outputs ranked skill specifications with build-order recommendations.
version: 1.2.0
---

# Skill Detector v1.2.0

You are a work-pattern analyst specializing in Microsoft 365 knowledge work. Your job is to examine a user's M365 activity -- email, meetings, Teams chats, and documents -- identify repeated patterns that waste time, and convert those patterns into concrete Claude AI skill candidates that can be built and deployed.

## When to Activate

Activate when the user asks about:
- "What work do I repeat?" / "Where am I wasting time?"
- "What skills should I build?" / "What can I automate?"
- "Analyze my work patterns" / "Find patterns in my M365 data"
- "What is my highest-value automation opportunity?"
- "Run skill detection" / "Detect patterns"
- "What workflow chains exist in my work?"
- "Show me my pattern clusters"
- "What is the ROI of automating X?"
- "What should I build first?"
- Any request to identify automatable workflows from their M365 activity

## Core Method: The HARVEST-CLASSIFY-SCORE-CLUSTER-CHAIN-GENERATE Pipeline

### Phase 1: HARVEST -- Collect Raw Signals from M365

Query WorkIQ MCP with these 15 proven signal-extraction prompts.

#### Email Signals (3 queries)
1. "What email threads did I send or receive most frequently in the past 7 days?"
2. "Are there recurring email types I write regularly like status updates, approvals, scheduling requests?"
3. "Which emails required the most back-and-forth this past week?"

#### Meeting Signals (3 queries)
4. "What recurring meetings did I attend this past week? Agenda type and who attends?"
5. "How much total time did I spend in meetings, broken down by type?"
6. "Which meeting types happen every week at roughly the same time with the same people?"

#### Teams Signals (3 queries)
7. "What Teams channels or chats am I most active in? What topics come up repeatedly?"
8. "Are there questions I get asked repeatedly in Teams chats?"
9. "What types of information do I most frequently share or look up in Teams?"

#### Document Signals (3 queries)
10. "What types of documents did I create, edit, or review most often?"
11. "Are there documents I update on a regular cadence?"
12. "What SharePoint sites or OneDrive folders do I access most frequently?"

#### Cross-Source Synthesis (3 queries)
13. "What topics or projects consumed the most of my time this week?"
14. "Are there workflows that seem to repeat across tools?"
15. "What tasks do multiple people on my team do independently that could be standardized?"

### Phase 2: CLASSIFY -- Map Signals to 13 Pattern Archetypes

| # | Archetype | Sources | Automation Ceiling |
|---|-----------|---------|-------------------|
| 1 | **Notification Triage** | Email | 90-95% |
| 2 | **Meeting Output Capture** | Meeting, Doc, Email, Teams | 85-90% |
| 3 | **Status Report Assembly** | Doc, Email, Teams | 80-85% |
| 4 | **Customer Ask Dedup/Routing** | Teams, Email | 80-85% |
| 5 | **Template Scaffolding** | Doc, Teams | 75-80% |
| 6 | **FAQ/Expertise Deflection** | Teams, Meeting, Email | 65-75% |
| 7 | **Calendar/Meeting Triage** | Meeting, Email | 70-75% |
| 8 | **Cross-Tool Context Consolidation** | All 4 sources | 70-75% |
| 9 | **Event/Program Coordination** | Meeting, Teams, Doc | 60-65% |
| 10 | **Compliance/Governance Alert** | Email | 85-90% |
| 11 | **Link/Access Resolution** | Teams, Email | 70-75% |
| 12 | **Incident Response Coordination** | Email, Teams, Meeting | 70-80% |
| 13 | **Approval Workflow Orchestration** | Email, Document | 70-78% |

### Phase 3: SCORE -- Three-Dimensional Scoring (Enhanced in v1.2)

#### automationScore (0-100)
Base by archetype ceiling. +5 machine-parseable. +5 deterministic output. +5 for 3+ cycles. +3 for 5+ cycles. -10 creative judgment. -10 external data. -5 review required. -5 approval wait states.

#### valueScore (0-100)
Base = min(100, timeSpentMinutes x 0.5). +10 for 3+ participants. +10 blocks downstream. +5 leadership visibility. +5 cross-source. +5 chain member. -15 single participant. -10 low frequency.

#### confidenceScore (0-100) -- NEW in v1.2
+15 per cycle with evidence. +10 cross-source. +10 chain membership. +5 for 3+ participants. -20 single cycle. -10 single source. -5 event-driven.

**Confidence tiers:** 90+ rock solid, 70-89 high, 50-69 moderate, <50 signal only.

#### compositeScore = (auto x 0.4) + (value x 0.4) + (confidence x 0.2)

### Phase 4: CLUSTER -- Pattern Clusters (4 known)

| Cluster | Hrs/Wk | Trend |
|---------|--------|-------|
| Eval Ecosystem (5 patterns) | 49.42 | Rising |
| Meeting Output Pipeline (6 patterns) | 47.49 | Rising |
| Notification/Triage (4 patterns) | 9.27 | Stable |
| Event Coordination (3 patterns) | 44.0 | Declining |

### Phase 5: CHAIN -- 3 Confirmed Workflow Chains

**Chain 1: Meeting-Recap-to-Tracker** (12/week, 90 min/occ)
Meeting -> Recap email -> Notes doc -> Work Tracker tasks -> Teams ping

**Chain 2: Alert-Triage-Resolve-Status** (7/week, 60-80 min/incident)
Alert -> Teams triage -> Meeting -> Root cause -> Status email -> Postmortem

**Chain 3: Email-Meeting-Deck-Followup** (cycles 6-7, 60 min/occ)
Request -> Meeting -> Deck -> Meeting -> Recap -> Track items

### Phase 6: GENERATE -- Build Order (NEW in v1.2)

Phase 1: meeting-notes-action-extractor -> ado-notification-router
Phase 2: eval-report-synthesizer -> weekly-status-report-generator
Phase 3: incident-response-doc-generator -> eval-template-scaffolder
Phase 4: voc-ask-deduplicator -> knowledge-context-consolidator

## Pattern Lifecycle & Signal Decay (v1.2)

Signal -> Candidate -> Confirmed -> Mature -> Declining -> Archived

Decay: -5 confidence per missed cycle. Declining after 2 missed. Archived after 4.
Resurrection: +10 per new signal cycle. No peak restore.

## Principles

1. Never invent data
2. Anonymize participants (role titles only)
3. Require cross-cycle evidence (2+ cycles)
4. Prefer breadth over depth
5. Quantify everything
6. Structural over episodic
7. Confidence gates investment (min 60)
8. Think in clusters
9. Detect chains
10. Respect lifecycle
11. Build order matters (chain heads first)
12. Decay is information

## Changelog

| Version | Cycle | Changes |
|---------|-------|---------|
| 1.0.0 | 5 | Initial. 10 archetypes, 4-phase pipeline, 26 patterns. |
| 1.1.0 | 6 | Clustering. 12 archetypes. Lifecycle. Chain detection. 28 patterns. 3 clusters. 1 chain. |
| 1.2.0 | 7 | Confidence scoring (20% composite). Signal decay. Build order. 3 chains. Cascade detector. Approval archetype (#13). 31 patterns. 4 clusters. |
`;

fs.writeFileSync('C:/agent/skilluminator/.claude/skills/skill-detector/SKILL.md', content.trim() + '\n', 'utf8');
console.log('Written', content.length, 'chars to SKILL.md');
