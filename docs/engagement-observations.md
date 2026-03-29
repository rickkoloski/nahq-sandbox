# NAHQ Accelerate — Engagement Observations

**Date:** March 28, 2026
**Status:** Internal working notes — not for external sharing without review
**Context:** Observations on the MindBowser engagement, for PortableMind positioning

---

## Observation 1: WIKIWIL — "What I Know Is What I Like"

MB's technology selections are individually defensible but collectively reveal a familiarity bias rather than problem-driven selection:

| Decision | Problem Requirement | What Was Selected | Likely Driver |
|----------|-------------------|-------------------|---------------|
| Vector DB | 10K-50K vectors on a structured domain | Milvus (billion-scale) | MB knows Milvus, claimed pgvector unavailable on AWS (false) |
| Data Warehouse | <1GB analytics, <600 users | Snowflake | MB has Snowflake expertise, default for "analytics" |
| Workflow | 3 workflows, 4-6 linear states | Temporal | MB has Temporal experience, default for "workflows" |
| Auth broker | 1-3 orgs, all Microsoft shops | Auth0 | MB knows Auth0, unfamiliar with Entra B2B/B2C |
| AI pipeline | Structured domain (8 domains, 29 competencies) | Full RAG pipeline | MB defaults to RAG for any AI use case |

Each choice is the right answer to a different, larger problem. Together they suggest the selection process was "what does our team know?" not "what does this specific problem need at this specific stage?"

**This is not malicious.** It's natural — teams reach for what they're fluent in. But it has consequences when the result is a $2,500+/mo infrastructure bill for an MVP that hasn't proven value yet.

## Observation 2: End-State-First Architecture

The architecture is designed for a mature product at scale, deployed before the value proposition is validated:

- Snowflake for analytics that PostgreSQL materialized views handle at MVP data volumes
- Temporal for workflows that are linear state machines
- Milvus for vector search at a scale 10,000x beyond current need
- RAG pipeline for a domain where deterministic structured queries produce more accurate results

**The inversion:** Instead of "prove value cheaply, then invest in scale," the approach is "invest in scale, then hope for value." This is high-risk for NAHQ because:

1. The $1.3M pilot opportunity depends on July readiness
2. Infrastructure setup time competes with feature development time
3. If the product doesn't find PMF, the infrastructure investment is sunk
4. Course-correction becomes harder the deeper the team builds into specialized tools

## Observation 3: Prototype Discard Pattern

Tim (EpicDX) prototyped in Base44, shared with the customer, and got approval. MB's response was to discard the prototype and start from scratch, forcing Tim to re-negotiate approved deliverables with the customer.

**What this reveals:**
- MB has no workflow for ingesting prototype output as production input
- The prototype is treated as "not real" rather than "validated design intent"
- Customer-approved UX is subordinated to the dev team's preferred starting point
- Tim's credibility with the customer erodes each time he walks back an approved deliverable

**What it costs:**
- Discovery work repeated (the prototype captured what the customer wanted)
- Customer trust degraded ("why did we spend time approving this?")
- Timeline lost to re-negotiation cycles
- Tim positioned as middle-man rather than technical authority

**Our counter-position:** Approved prototype output is a first-class input to production development. Base44 exports React/Tailwind/shadcn — the same stack we'd use. The "ingest and regenerate" workflow via Claude Code preserves the customer-approved UX while replacing the proprietary backend. What the customer approved is what they get.

## Observation 4: Vendor Lock-In as Side Effect

The architecture creates implicit vendor lock-in — likely unintentional, but consequential:

- **Skill lock-in:** Only teams fluent in Temporal + Milvus + Snowflake can operate the system. This is a narrow hiring pool and limits NAHQ's options for future dev partners.
- **Cloud lock-in:** Built on AWS with AWS-specific services, while end customers are Azure-dominant healthcare systems.
- **Partner lock-in:** The complexity of the stack makes it difficult to transfer to another dev shop without significant ramp time.

**Our counter-position:** PostgreSQL + Spring Boot is a commodity skill set. Any competent Java shop can pick up the codebase. Cloud-portable by design (runs on AWS, Azure, or GCP with infrastructure swap only). This gives NAHQ options — which is what a client should have.

## Observation 5: Risk Sequencing Inversion

The sprint plan (S1-S6) front-loaded comfortable work (discovery, UX design, prototype) and deferred hard integration risks:

- Nimble data integration — not proven in code
- Qualtrics assessment pipeline — not proven in code
- Data governance requirements — not finalized
- SOC 2 readiness — marked post-MVP
- Auth architecture — Auth0 selected but not implemented

RUP's Elaboration phase exists to force these risks forward early. "Can we actually integrate with Nimble's assessment data?" is a question that should have been answered with working code in S2-S3, not deferred to Phase 1 build when the July pilot is at stake.

---

## How to Use These Observations

These are **not** criticisms to share with NAHQ directly. They're analytical observations that inform:

1. **Our sandbox plan** — prove the right-sized architecture works, with real code
2. **Tim's positioning** — give him an alternative he can present alongside MB's plan
3. **Our value proposition** — we build what the problem needs, not what we already know
4. **Risk conversation** — specific, evidence-based concerns Tim can raise with the team

The tone with Tim should be constructive: "Here's an alternative approach that addresses some of the complexity concerns, costs less, and preserves your prototyping work. Let's discuss whether it makes sense for the MVP."
