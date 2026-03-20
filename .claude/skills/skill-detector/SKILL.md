---
name: skill-detector
description: Detects repeated work patterns in M365 activity data and converts them into reusable Claude AI skill candidates. Signal confidence scoring, skill family clustering, build-order dependencies, SRI with temporal decay, BSI/SGI detection, ROI projection per skill-family.
version: 3.5.0
---

# Skill Detector v3.5.0

Work-pattern analyst for M365. Examines email, meetings, Teams, documents. Finds repeated patterns. Converts to Claude AI skill candidates. Evidence-based via WorkIQ MCP.

## Pipeline: HARVEST > CLASSIFY > CONFIDENCE > SCORE > CORRELATE > FAMILY > SRI > GENERATE

### Step 1: HARVEST (21 queries)
Run ALL via WorkIQ MCP. Swap your domain term for any specialty keyword in the queries below.
**Email (Q1-Q5):** Q1 Most frequent email threads this week -- subject patterns, sender groups, time spent. | Q2 Recurring email types I write regularly: status updates, approvals, scheduling, data requests -- show examples. | Q3 Emails with most back-and-forth replies this week -- topic and why. | Q4 System-generated notification emails (ADO, GitHub, monitoring alerts) -- volume and triage time. | Q5 Compliance or security alert emails I triage regularly -- what action do they typically require?
**Meetings (Q6-Q10):** Q6 Recurring meetings this week -- agenda type, attendees, cadence. | Q7 Total meeting time by type: 1:1, team sync, external, office hours. | Q8 Meetings happening every week at the same time with the same people. | Q9 Meetings with external domains -- how many, which domains, total external-facing time. | Q10 Which meetings require pre-read or generate a follow-up doc I must write?
**Teams (Q11-Q14):** Q11 Most active channels/chats -- what topics recur most? | Q12 Questions people ask me repeatedly in Teams -- things they regularly come to me for. | Q13 Information I most frequently share or look up for others in Teams. | Q14 Escalations or unblocking requests I handle repeatedly in Teams.
**Documents (Q15-Q17):** Q15 Doc types I created, edited, or reviewed most -- any recurring types like reports, specs, decks? | Q16 Documents I update on a regular cadence: weekly reports, trackers, dashboards. | Q17 SharePoint sites or OneDrive folders I access most frequently.
**Cross-Source (Q18-Q21):** Q18 Topics consuming most time across email + meetings + Teams combined. | Q19 Workflows that repeat as sequences -- e.g. get email, attend meeting, create doc. | Q20 Tasks multiple team members do independently that could be standardized. | Q21 Content I rewrite for different surfaces this week -- same update in Loop, slides, and email?
Top producers: Q12 repeated questions, Q1 frequent threads, Q6 recurring meetings, Q9 external domains, Q19 workflow chains, Q20 parallel work.

### Step 2: CLASSIFY (22 archetypes)
1 Notification Triage 90-95 | 2 Meeting Output 85-92 | 3 Status Report 80-87 | 4 Ask Routing 80-85 | 5 Template 78-85 | 6 FAQ Deflection 65-76 | 7 Calendar Triage 70-77 | 8 Cross-Tool 70-78 | 9 Event Coord 58-72 | 10 Compliance 85-91 | 11 Expert Bottleneck 60-75 | 12 Parallel Creation 82-88 | 13 Rebuild-Per-Engagement 70-80 | 14 Builder-User 55-70 | 15 Daily Ops 70-80 | 16 Digest 65-75 | 17 Escalation 70-82 | 18 Feasibility 45-60 | 19 Arch Scoping 45-60 | 20 External Prep 65-78 | 21 1:1 Context Loading 65-75 (NEW v3.4) | 22 Feedback Synthesis 76-85 (NEW v3.5)

### Step 3: CONFIDENCE (NEW v3.4)
signalConfidence = 50 + crossSource(+20) + highFreq(+10) + structural(+10) + temporal(+10/15) + participants(+5)
90+ VERIFIED | 75-89 STRONG | 60-74 MODERATE | <60 WEAK/NOISE
adjustedSRI = rawSRI * (0.5 + 0.5 * confidence/100)

### Step 4: SCORE
auto: Start 50, +15 parseable, +10 deterministic, +10 persistent, +5 chain/parallel/pipeline/FAQ, -15 creative, -10 tacit
value: Start 50, +15 org-wide, +10 chain-head, +10 cross-source, +8 bottleneck, +5 deadline/SGI/velocity, -15 solo
composite = auto*0.30 + value*0.40 + maturity*0.10 + time*0.10 + confidence*0.10
Decay: 0.92^(currentCycle - signalCycle)

### Step 5: CORRELATE
Compute fresh from YOUR data each cycle -- values below are formulas+examples, not hardcoded.
BSI (Bottleneck Saturation Index) = question_volume * avg_complexity * (1 - deflectable_pct). 85+ = EMERGENCY. Decompose: tier by complexity (T1 simple/T2 moderate/T3 expert). Relief = pct automatable.
SGI (Skill Gap Index) = (demand_freq * stakeholder_impact) / current_supply_coverage. 90+ = RISING gap.
Cascade multiplier: each automated chain-link saves 0.7x of downstream effort. SATURATED = freq > human capacity. HEAD = chain entry point. BOTTLENECK = role that blocks others.
Example output (adapt to your data): BSI 90 EMERGENCY 15q/wk T1 67% T2 20% T3 13% relief 87% | SGI domain-decks 92 RISING | Chains: meeting-output HEAD | domain-guidance BOTTLENECK | notifications SATURATED

### Step 6: FAMILY (NEW v3.4)
8 families. Build HEAD first = 40% downstream savings.
EVAL-ENABLEMENT (49h, 60%): eval-advisor HEAD > standardizer > pack-gen > template-mgr
MEETING-WORKFLOW (21h, 50%): meeting-notes HEAD > calendar > one-on-one
EVENT-COORD (55h, 40%): event-artifact HEAD > learning > conf-planner
NOTIFICATION (3.7h, 40%): ado-router HEAD > compliance > digest
STATUS (6h, 35%): weekly-status HEAD > strategic-thread
KNOWLEDGE (2.3h, 45%): voc-routing HEAD > artifact-hub
ARCHITECTURE (5.7h, 45%): arch-feasibility HEAD > skill-scaffold
PERSONAL (1.3h, 30%): daily-briefing HEAD

### Step 7: SRI
rawSRI = (auto+value+evidence+specClarity)/4. adjustedSRI = rawSRI*(0.5+0.5*conf/100)
BUILD 75+ | PROTOTYPE 65-74 | DESIGN 50-64 | WATCH <50
P1 eval-design-advisor 82 BUILD 92V | P2 meeting-notes 80 BUILD 93V | P3 ado-router 80 BUILD 97V
P4 partner-eval 70 PROTO | P5 weekly-status 66 PROTO

### Step 8: GENERATE
BUILD: YAML + sharedInfra. PROTO: trigger+I/O. DESIGN: brief. WATCH: log.

## ROI (NEW v3.4)
event-coord 55h 480h/yr | eval 49h 420h/yr | meeting 21h 195h/yr | Total 145h ~1235h/yr

## Anti-Patterns (16)
1-14: OneOff, EventEcho, ComplianceTheater, BuilderFP, ParallelMirage, BottleneckOverreach, CascadeBlind, GradPressure, DeclineMisattr, DigestOverreach, AmpDoubleCount, SRIGaming, VelocityOverreact, ExternalConflation
15 Confidence Bypassing (v3.4) | 16 Family Myopia (v3.4)

## Principles (24)
1-21: Evidence only. Anonymize. Cross-cycle wins. Quantify. Chain heads. Bottlenecks=ROI. SGI multiplies. Cascade 0.7x. Pipelines +40%. Decline=info. Amplification. Anti-patterns. Real signals. BSI/SGI override. Maturity gates. Decay. SRI gates. Guardrails. Velocity. Decompose BSI85+. External power law.
22 Confidence gates BUILD (v3.4) | 23 Families compound ROI (v3.4) | 24 Heads first ~40% savings (v3.4)

## Changelog
3.5.0 Cycle 43: HARVEST expanded to full 21-query text (portable, role-adaptable). CORRELATE made generic (formulas + example output, not hardcoded user data). 22nd archetype: Feedback Synthesis 76-85. CLASSIFY header updated.
3.4.0 Cycle 28: Signal Confidence (Step 3). Skill Families (Step 6, 8 families). ROI Engine (1235h/yr). Harvest effectiveness. Composite+confidence. 21st archetype. 2 anti-patterns. 3 principles. 8-step pipeline.