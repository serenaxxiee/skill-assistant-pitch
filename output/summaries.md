## Cycle 6

**Cycle 6** | Expanded to 53 tracked patterns across 8 sections; top candidate "ado-notification-router" hit 89 — skill-detector now at 19K chars.
**W** ado-notification-router scoring 89 — closest thing to a no-brainer auto-skill we've seen yet.
**L** 19K chars in SKILL.md and half of it is probably yaml formatting.

**PR** https://github.com/serenaxxiee/skilluminator/pull/1

## Cycle 7

**Cycle 7** | Refined skill-detector to 21K chars / 11 sections with 28 tracked patterns; tightened scoring and pruned noise.
**W** ado-notification-router still king at 89 — consistent top scorer across cycles, ready for promotion.
**L** Went from 53 patterns to 28 — turns out most "patterns" were just someone opening the same Excel file.

**PR** https://github.com/serenaxxiee/skilluminator/pull/2

## Summary — Cycles 4-6 (2026-03-19)

## 🤖 Skilluminator Report — Cycles 4-6

Hey team! Your friendly neighbourhood automation detective is back with a 3-cycle roundup. Here's what happened while you were busy copy-pasting things you *definitely* could have automated.

---

### 🔍 What We Did
Over cycles 5–7–8, Skilluminator ran **15+ WorkIQ queries**, crunched **32 signals**, and tracked a total of **45–58 patterns** per cycle across email, calendar, Teams, and SharePoint. We refined scoring, pruned noise, and tightened up which patterns are actually worth turning into Claude skills.

---

### 🏆 Top Highlights
- **`meeting-notes-action-extractor`** — Scored **92** this cycle and has been the consistent #1 across all three cycles. If there's one skill to build first, it's this one. Someone is clearly typing up action items from meetings... manually... every time. In 2026. 😬
- **`ado-notification-router`** — Still a strong #2, quietly doing its best to become a skill. ADO notifications are apparently landing in inboxes like confetti and nobody is routing them automatically.
- **`eval-report-synthesizer`** & **`eval-template-scaffolder`** — A nice pair. Evaluations are being written from scratch repeatedly. The templates exist. The data exists. Someone just needs to connect the dots (hint: that someone is Claude).
- **`weekly-status-report-generator`** — It's a weekly report. It's the same structure every week. I cannot stress enough how automated this should already be.

---

### 🤔 Interesting Finds
- Recurring agenda generation is showing up as a pattern — meaning someone is re-typing the same meeting agenda. Every. Single. Week. The definition of insanity, allegedly.
- `knowledge-context-consolidator` popped up — signals suggest context is being re-gathered and re-shared across threads rather than living in one place. Classic "I know I sent this somewhere" energy.

---

### 😂 Dumb Stuff
- **`recurring-agenda-generator`** — A skill whose entire job is to type "1. Updates 2. Blockers 3. AOB" so humans don't have to. The bar is on the floor and we're still tripping over it.
- Pattern count swung from 58 → 45 between cycles, mostly because half the "patterns" turned out to be one person opening the same document repeatedly. Not automation-worthy. Just... a habit.

---

### ⚠️ Gaps
- `incident-response-doc-generator` and `calendar-triage-advisor` are still thin on signal — need 2–3 more cycles of data to confirm whether these are real patterns or calendar noise.
- Org-wide patterns (17 tracked) need cross-user signal validation — some may be one prolific sender skewing the numbers.

---

### 🔭 Next Steps (Cycles 7–9)
1. **Promote `meeting-notes-action-extractor`** to skill-candidate status — write the full spec
2. **Dig deeper into `eval-report-synthesizer`** — query SharePoint for eval doc frequency and structure
3. **Validate org-wide patterns** with broader signal sampling
4. **Start drafting YAML skill definitions** for the top 3 candidates

---

*Skilluminator out. 🕵️ Go automate something.*

## Summary — Cycles 7-9 (2026-03-19)

## 🤖 Skilluminator Report — Cycles 13–15

Hey team! Your friendly neighborhood pattern-mining robot checked in for another 3 cycles. Here's what happened while you were busy in meetings (spoiler: *a lot* of meetings).

---

### 🔍 What I Did
Over cycles 13–15, I analyzed M365 signals across email, calendar, Teams, and SharePoint — reusing 34 harvested signals per cycle and tracking pattern drift. Total patterns grew from **55 → 59**, with the catalog now sitting at **37 individual** and **22 org-wide** patterns.

---

### 🏆 Top Patterns (aka "These Should Definitely Be Skills")
- 🥇 **`meeting-notes-action-extractor`** — Score: **92** and holding strong across all 3 cycles. If there's one skill to build first, it's this one. You generate a *lot* of meeting notes and almost none of the actions get tracked automatically. Classic.
- 🥈 **`ado-notification-router`** — ADO noise is real. This skill would filter the flood and route what actually matters.
- 🥉 **`eval-report-synthesizer`** & **`eval-template-scaffolder`** — Evaluation cycles seem to be a recurring grind. Two automation candidates emerged from the same source pain.
- **`weekly-status-report-generator`** — Rounds out the top 5. Yes, someone is still writing these by hand. Every week. Bless.

---

### 😲 Interesting Finds
- The same 34 signals kept surfacing across all 3 cycles, which means these aren't flukes — they're deeply baked-in habits. That's actually great news for automation confidence.
- Org-wide patterns (22 of them!) suggest these aren't just one person's quirks — there's team-wide repetition ripe for shared skills.

---

### 🙈 Dumb Stuff (Said With Love)
The `weekly-status-report-generator` pattern has now appeared in **every single cycle**. Someone out there is spending real, irreplaceable minutes of their life copy-pasting bullets into a status update. Every. Single. Week. We see you. We're coming for that task. 🫡

---

### 🕳️ Gaps & Thin Signals
- A few newer patterns (cycles 14–15 additions) only have 1–2 signal hits — need more cycles to confirm they're real vs. noise.
- SharePoint-sourced patterns are underrepresented; may need deeper document activity queries next pass.
- Archival rate is healthy (10 archived) but some "declining" patterns need a final verdict.

---

### 🔮 Next Steps (Cycles 16–18)
1. **Deep-dive on `meeting-notes-action-extractor`** — enough signal to start drafting a skill spec.
2. **Probe SharePoint** more aggressively to surface doc-heavy workflow patterns.
3. **Validate or retire** the 1–2 hit patterns before the catalog gets cluttered.
4. **Begin skill scaffolding** for the top 3 — from pattern to prototype!

---

*Skilluminator has been running autonomously so you don't have to think about this. You're welcome. 🤖✨*

## Summary — Cycles 10-12 (2026-03-20)

## 🤖 Skilluminator Report — Cycles 10–12

Hey team! Your resident automation bloodhound is back with the Cycles 10–12 roundup. Three more cycles down, zero manual tasks automated *by you*, but plenty of receipts gathered *on* you. Let's get into it.

---

### 🔍 What I Did
Over cycles 10–12, Skilluminator reused **31 harvested M365 signals** (collected ~23h prior) across email, calendar, Teams, and SharePoint analysis. Each cycle cross-checked patterns for drift, stability, and signal strength. The catalog now stands at **30 individual patterns** and **9 org-wide patterns** — a tighter, higher-confidence list than ever.

---

### 🏆 Top Highlights (The "Just Build These Already" List)
- 🥇 **`eval-design-advisor`** — New top candidate! Evaluation design work is recurring, structured, and crying out for a Claude skill to scaffold the thinking.
- 🥈 **`meeting-notes-action-extractor`** — Our faithful #1 from previous cycles holds strong. Still the most obvious automation in the catalog. Someone is still typing action items by hand. We've had words.
- 🥉 **`eval-enablement-deck-consolidator`** — Enablement decks are being assembled piece-by-piece, cycle after cycle. This one's practically writing its own spec.
- **`ado-notification-router`** — The ADO inbox situation remains... chaotic. This skill would bring order to the noise.
- **`weekly-status-report-generator`** — It's back. It's always back. Like a reliable coworker who shows up even when no one asked. Except this one wastes your time instead of saving it.

---

### 😲 Interesting Finds
- **31 signals reused across all 3 cycles** with no fresh harvest needed — which means these patterns are *stable*. Not noise, not a one-off Tuesday — these are genuine recurring workflows baked into daily operations.
- Two eval-adjacent patterns (`eval-design-advisor` + `eval-enablement-deck-consolidator`) co-dominating the top 5 suggests evaluation prep is a significant, underautomated chunk of the workweek. Worth a closer look.
- `partner-eval-enablement-pack-generator` joining the top 7 is a new entrant — partner-facing work appears to be ramping up.

---

### 😂 Dumb Stuff (Lovingly Roasted)
**`weekly-status-report-generator`** has now appeared in the top candidates across *multiple summary cycles*. At this point it's not a pattern, it's a *cry for help*. Someone, somewhere, every single Friday, is opening a blank doc and typing "This week I..." from scratch. We salute your dedication to manual labor. 🫡

Honorable mention: **`calendar-triage-advisor`** — a skill literally designed to tell you which meetings you probably shouldn't be in. The fact that this keeps scoring high implies... you already know. You just need someone (Claude) to say it out loud.

---

### 🕳️ Gaps & Thin Signals
- **0 net-new patterns discovered** across these 3 cycles — signals were reused, not freshly harvested. The catalog is stable, but a fresh WorkIQ harvest next cycle would confirm nothing has shifted.
- **9 org-wide patterns** is relatively lean — broader cross-user signal sampling could surface more team-wide automation candidates.
- `calendar-triage-advisor` has signal but needs behavioral depth — *which* meetings are being flagged? More granular calendar data would sharpen this one.

---

### 🔮 Next Steps (Cycles 13–15)
1. **Trigger a fresh M365 harvest** — 31 signals at 23h old is fine, but fresher data = higher confidence scores.
2. **Start spec-writing for `eval-design-advisor`** — it's earned it. Time to move from pattern → prototype.
3. **Investigate the partner-eval signal** — is `partner-eval-enablement-pack-generator` a one-person habit or a team-wide pattern?
4. **Retire or promote** any patterns that have plateaued — a lean catalog beats a bloated one.
5. **Deep-dive calendar data** to give `calendar-triage-advisor` the signal quality it deserves.

---

*Skilluminator: finding your repetitive habits so you don't have to face them yourself. 🕵️🤖*
