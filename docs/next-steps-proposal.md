# NAHQ Accelerate — Next Steps Proposal

**Date:** March 30, 2026
**Context:** D1-D7 complete, Party model clean, Base44 ingest proven, Tim's review pending
**Question:** What moves us forward while waiting for Tim's answers?

---

## Current State

**Built:** Full-stack sandbox (16 API endpoints, 5 UI pages, Silverston Party model, live AI, pgvector)
**Waiting on Tim:** 15 auth questions, 12 computation confirmations
**Tim's project:** 138 tasks scoped in Harmoniq, zero started, flat structure (no hierarchy)
**Our sandbox coverage:** ~40% of Tim's scoped build, particularly domain model, analytics, AI, and dashboards

---

## Three Tracks (can run in parallel)

### Track A: Strengthen What We Have (No Tim dependency)

Work that improves the sandbox without needing answers from Tim or NAHQ.

**A1. Port Tim's IndividualDashboard** (the richest unported page)
- Tim's `IndividualDashboard.jsx` has 6 sections: KPI tiles, bell curve peer comparison, domain radar chart, domain breakdown cards, upskill sidebar, AI summary
- We have all the API data (`userGaps`, `userBenchmarks`, `userCourses`, `aiSummary`)
- Requires adding `recharts` dependency for radar/charts
- Estimate: 1 session
- Value: Proves the ingest workflow scales beyond simple pages

**A2. Add AI Insights panel to dashboards**
- The three AI generation endpoints (`individual-summary`, `upskill-plan`, `org-insights`) work but have no UI
- Add a "Generate AI Summary" button to each dashboard that calls the endpoint and displays the narrative
- No new API work — just wire existing endpoints to a panel/modal
- Estimate: 2-3 hours
- Value: Makes the AI layer visible in the demo, not just curl

**A3. Idempotent seed endpoint**
- Current seed fails on re-run (duplicate email constraint)
- Add a check-before-create or truncate-and-reseed mode
- Estimate: 1 hour
- Value: Eliminates the "reset DB before seeding" friction

**A4. Add recharts for data visualization**
- Tim's prototype uses recharts extensively (radar charts, bar charts, distribution charts)
- Install and create a shared chart component library matching Tim's patterns
- Estimate: 2-3 hours for foundation + radar chart
- Value: Visual parity with Tim's prototype gets much closer

---

### Track B: Prepare for Tim's Engagement (Low dependency)

Work that sets up for productive conversations with Tim when he responds.

**B1. Organize Tim's 138 tasks into workstream hierarchy**
- Task #983 (assigned to Rick): "Establish workstreams and delivery plan"
- All 138 tasks are flat — no parent hierarchy
- We could propose a workstream structure and parent the tasks accordingly
- Aligns with our SDLC framework and demonstrates PortableMind's planning capability
- Estimate: 1 session
- Value: Shows Tim we can contribute beyond code; makes the backlog navigable

**B2. Map our sandbox to Tim's task numbers**
- Create a crosswalk: "Our D1 covers Tim's tasks #1026-1032, our D3 covers #1082-1087..."
- Shows the overlap clearly — what's done, what's partially done, what's untouched
- Estimate: 1-2 hours
- Value: Concrete evidence of progress against Tim's plan

**B3. Draft integration spike plan for Nimble/Qualtrics**
- Tim's discovery tasks (#994-999) are about validating integration assumptions
- We can draft what we'd need to prove each integration in code
- Doesn't require access to the actual systems, just the spike plan
- Estimate: 2-3 hours
- Value: Shows architectural thinking about the hard integration risks we flagged

**B4. Prepare shareable demo**
- Package the demo for Tim to run himself (or screen-share walkthrough)
- Could be: recorded walkthrough, deployment to a shared environment, or a setup script Tim can run locally
- Estimate: varies by approach
- Value: Tim sees it without scheduling a call

---

### Track C: Address Known Gaps (Some dependency)

Work that fills gaps we know about, even without Tim's full answers.

**C1. Wire hospital filter to actually filter data**
- The dropdown is populated from Party relationships but selecting a hospital doesn't filter the dashboard data yet
- Need: org stats and capability queries scoped by site
- Estimate: half session (API changes + UI wiring)
- Value: Functional filter, not just a populated dropdown

**C2. Build competency-by-site-role aggregation endpoint**
- The Base44 analysis identified this as the main API gap blocking the executive heatmap and workforce explorer
- Need: `GET /api/organizations/{id}/competency-matrix?groupBy=site,role`
- Estimate: 1 session
- Value: Unlocks the richest executive visualization (CompetencyHeatmap)

**C3. Assessment lifecycle endpoints**
- Currently assessments are created as SCORED by the seed service
- Need: endpoints to create, start, complete, and score assessments with proper state transitions
- The `Assessment.transitionTo()` method exists but isn't exposed via API
- Estimate: half session
- Value: Functional assessment flow, not just seeded results

**C4. User profile endpoint**
- Need: `GET /api/users/{id}/profile` returning full user data (party, individual, roles, org, assessment history)
- Currently scattered across multiple queries
- Estimate: 2-3 hours
- Value: Single endpoint for the individual dashboard to load all user context

---

## Recommended Priority

**If we have one session:** A2 (AI Insights panel) — highest demo impact for least effort

**If we have a weekend-length session:**
1. A1 (Port IndividualDashboard) — prove the ingest workflow at scale
2. A2 (AI Insights panel) — make AI visible
3. B1 (Organize workstreams) — show Tim we can plan, not just code
4. A4 (recharts foundation) — visual parity

**If Tim responds quickly and we want to maximize joint impact:**
1. B2 (Map sandbox to Tim's tasks) — show coverage
2. B1 (Organize workstreams) — complete task #983
3. C1 (Wire hospital filter) — functional depth
4. C2 (Competency matrix endpoint) — unlock executive heatmap

---

## What NOT to Do Yet

- **Don't port all 39 Base44 pages** — port the 2-3 that prove the workflow, wait for Tim's feedback on the rest
- **Don't implement computation logic** — blocked on NAHQ confirmation of thresholds and definitions
- **Don't build Nimble/Qualtrics integrations** — blocked on Tim's answers about actual APIs and auth patterns
- **Don't deploy to AWS** — the local demo is sufficient until we have stakeholder buy-in on the architecture
- **Don't refactor Tim's task structure without discussing** — propose the workstream hierarchy, don't reorganize unilaterally

---

## Decision Points for Rick

1. **Which track feels most productive right now?** A (strengthen), B (prepare), or C (fill gaps)?
2. **Do you want to complete task #983 (workstreams) before Tim responds?** It's assigned to you and would demonstrate leadership.
3. **Should we record a demo video?** Lower friction than scheduling a call with Tim.
4. **How much more UI porting vs backend depth?** The Base44 analysis shows 39 pages — we've done 4. Diminishing returns on porting without computation logic confirmed.
