# NAHQ Accelerate — Sandbox Project Plan

**Date:** March 28, 2026
**Lifecycle:** Prototyping (technical mode)
**Goal:** Working AWS sandbox demonstrating the right-sized MVP stack
**Audience:** Tim VanderMolen, NAHQ stakeholders, architecture discussion
**Constraint:** Spring Boot backend (per current agreement)

---

## What We're Proving

A single PostgreSQL instance + Spring Boot can handle:
1. The full NAHQ domain model (competencies, roles, assessments, gaps)
2. Deterministic gap analysis and benchmarking (materialized views)
3. Vector similarity search for learning resources (pgvector)
4. AI-generated narratives via structured context injection
5. Auth via Entra ID (no third-party identity broker)
6. **Base44 prototype preservation** — customer-approved UX ported to production React without re-negotiation

All on infrastructure costing < $100/month — not $2,500+.

---

## Deliverable Stream

### D1: Foundation & Domain Model
**Focus:** Spring Boot project, PostgreSQL on RDS, NAHQ domain schema

What gets built:
- Spring Boot 3.x project (Gradle, Java 21)
- PostgreSQL 16 on RDS (smallest instance, pgvector enabled)
- Flyway migrations for core schema:
  - `competency_domain` (8 rows)
  - `competency` (29 rows, linked to domains)
  - `competency_framework_version` (immutable snapshots)
  - `role_type` catalog
  - `role_target` (competency + role + target level + framework version)
  - `organization`, `site`
  - `app_user`, `user_role` (temporal join table)
  - `cohort`, `engagement`, `engagement_participant`
- Seed data: NAHQ's 8 domains and 29 competencies from the framework doc
- Basic REST endpoints for CRUD on core entities
- Health check, OpenAPI docs

**Done when:** `GET /api/competencies` returns the 29 competencies grouped by domain, deployed to AWS.

### D2: Assessment & Gap Analysis
**Focus:** Prove deterministic scoring and gap calculation

What gets built:
- `assessment_cycle`, `assessment` (with status enum + transition validation)
- `assessment_result` (user + competency + score + framework version)
- Gap analysis service: `score - role_target = gap` per competency
- Bulk result import endpoint (simulates Qualtrics webhook)
- Mock assessment data: 50-200 synthetic users with realistic score distributions
- Gap analysis endpoint: `GET /api/users/{id}/gaps` returns ranked gaps

**Done when:** Import mock assessment data, query a user's gaps, get deterministic ranked results.

### D3: Analytics & Benchmarking
**Focus:** Prove PostgreSQL handles the analytics without Snowflake

What gets built:
- Materialized views:
  - `mv_competency_benchmarks` (percentiles by competency, org type)
  - `mv_org_capability_summary` (aggregated scores by org, domain)
  - `mv_cohort_progress` (completion rates, distributions)
  - `mv_gap_analysis` (precomputed gaps, ranked)
- Refresh strategy: triggered after bulk import, with manual refresh endpoint
- Benchmark comparison endpoint: `GET /api/users/{id}/benchmarks` returns user vs. P25/P50/P75/P90
- Org-level analytics: `GET /api/organizations/{id}/capability-summary`
- Query performance logging (prove sub-50ms response times)

**Done when:** Load 10K synthetic national benchmark records, query percentile comparisons, demonstrate response times.

### D4: Vector Search (pgvector)
**Focus:** Prove pgvector on the same PostgreSQL instance handles learning resource matching

What gets built:
- `CREATE EXTENSION vector;` on existing RDS instance
- `lms_course` table with `embedding vector(1536)` column
- `course_competency_mapping` bridge table
- Embedding generation: call OpenAI/Claude embedding API for course descriptions
- Seed 100-200 synthetic course records with embeddings
- Similarity search endpoint: `GET /api/courses/similar?competency_id=X&limit=5`
- Hybrid query: vector similarity + competency filter in single SQL query

**Done when:** "Find courses most relevant to this user's top gap" returns ranked results using vector similarity on the same database that handles OLTP.

### D5: AI Layer — Structured Context Injection
**Focus:** Prove the domain model + LLM produces better results than generic RAG

What gets built:
- Context packaging service: assembles structured user profile for LLM
  - User's role, competency scores, targets, gaps (ranked)
  - Percentile benchmarks for each competency
  - Top recommended courses from D4
  - Org-level context (aggregate capability summary)
- LLM integration: Claude API call with structured context
- Three generation endpoints:
  - `POST /api/ai/individual-summary` — personalized assessment narrative
  - `POST /api/ai/upskill-plan` — recommended development plan
  - `POST /api/ai/org-insights` — organizational strategic recommendations
- `ai_generation_log` table (prompt hash, response, model, tokens, latency)
- Side-by-side comparison: show the structured context the LLM receives vs. what a RAG pipeline would retrieve

**Done when:** Generate a personalized upskill plan that references the user's specific gaps, scores, and available courses — demonstrably better than generic retrieval.

### D6: Auth Skeleton & Demo Package
**Focus:** Entra ID integration stub + polished demo experience

What gets built:
- Spring Security with OAuth2 resource server config
- Entra ID app registration (sandbox tenant or mock)
- RBAC: admin, executive, participant roles from `user_role` table
- Endpoint security: role-based access on all endpoints
- Swagger UI with auth flow for demo walkthrough
- Demo script document: step-by-step walkthrough for stakeholders
- Cost dashboard: actual AWS bill screenshot vs. projected MB stack cost

**Done when:** Authenticated API walkthrough demonstrating the full pipeline — import assessments, calculate gaps, query benchmarks, find courses, generate AI narrative — all on a ~$100/month AWS footprint.

### D7: Base44 Prototype → Production React Bridge
**Focus:** Demonstrate that Tim's approved prototype UX can be preserved in production code

**The problem this solves:** MB is forcing Tim to re-negotiate customer-approved deliverables because they have no workflow for ingesting Base44 prototype output. The customer approved specific screens and interactions. Those should be honored, not discarded.

**What Base44 actually exports:**
- React components (JSX/TSX) + Tailwind CSS + shadcn/ui — standard, extractable
- Entity schemas (JSON Schema format) — maps to our domain model
- The backend is locked to Base44's servers (`@base44/sdk`) — but we're replacing that anyway

**What gets built:**
- Export Tim's Base44 prototype (requires Builder plan, $50/mo)
- Extraction script: strip `@base44/sdk` imports, catalog components/pages/layouts
- `CLAUDE.md` production conventions file defining:
  - Our React project structure and patterns
  - Our API client (Spring Boot REST endpoints from D1-D6)
  - TypeScript types derived from our domain model
  - Component standards (accessibility, error handling, loading states)
- Claude Code "ingest and regenerate" workflow:
  - Input: Base44 component source + CLAUDE.md conventions
  - Output: Production React component wired to our Spring Boot API
  - Preserved: layout, visual design, interaction patterns (the approved UX)
  - Replaced: `base44.entities.*` calls → our API client, auth hooks, state management
- Demonstrate on 2-3 key screens:
  - Individual dashboard (assessment results + gap visualization)
  - Executive dashboard (org capability summary)
  - Assessment launch flow
- Side-by-side comparison: Base44 prototype screenshot vs. production React screenshot

**Done when:** At least 2 screens from Tim's prototype are running in production React against our Spring Boot API, visually matching what the customer approved.

**Why this matters strategically:**
- Tim's prototyping work becomes a first-class input, not a throwaway artifact
- The customer sees continuity — what they approved is what they get
- Tim doesn't have to re-negotiate approved deliverables
- Establishes a repeatable workflow: prototype → export → ingest → production
- Positions PortableMind as the partner that *honors* discovery work rather than discarding it

---

## Infrastructure (AWS)

| Resource | Spec | Est. Cost |
|----------|------|-----------|
| RDS PostgreSQL 16 | db.t4g.micro (2 vCPU, 1GB) with pgvector | ~$15/mo |
| ECS Fargate | 0.25 vCPU, 0.5GB (single task) | ~$10/mo |
| ECR | Container registry | ~$1/mo |
| S3 | Seed data, exports | ~$1/mo |
| CloudWatch | Logs, basic monitoring | ~$5/mo |
| NAT Gateway | If VPC required | ~$35/mo |
| **Total** | | **~$65-70/mo** |

Could go even cheaper with EC2 t4g.micro (free tier eligible) instead of Fargate.

---

## Timeline Sketch

This is a prototyping lifecycle — moments, not phases. But the deliverable sequence has natural dependencies:

```
Week 1:  D1 (foundation + domain model + seed data)
Week 2:  D2 (assessment pipeline + gap analysis) + D3 (materialized views)
Week 3:  D4 (pgvector) + D5 (AI layer)
Week 4:  D6 (auth + demo package) + D7 (Base44 → production React bridge)
```

D2 and D3 can overlap (D3 depends on D2's schema but can start with the materialized view definitions). D4 and D5 can overlap similarly. D7 can start alongside D6 once the API layer is complete — it depends on the endpoints from D1-D5 being available.

The first three weeks prove the architecture (API-only). Week 4 closes both ends: auth/demo polish AND the prototype-to-production bridge that demonstrates we can honor Tim's approved UX.

---

## What This Gives Tim

1. **Working code** — not slides, not diagrams. A deployed API that processes assessments.
2. **Cost evidence** — actual AWS bill for the sandbox vs. projected MB infrastructure cost.
3. **Performance proof** — logged query times showing sub-50ms analytics on PostgreSQL.
4. **AI quality comparison** — structured context injection output vs. what generic RAG would produce.
5. **Architecture document** — the counter-proposal, now backed by running code.
6. **Cloud portability story** — "this runs on Azure with zero code changes, only infrastructure swap."
7. **Prototype preservation workflow** — Tim's Base44 work feeds directly into production React. No re-negotiation with the customer. What they approved is what they get.

---

## Harmoniq Tracking

Scaffold as a **Prototyping** lifecycle project in Harmoniq:
- Project: "NAHQ Accelerate — Architecture Sandbox"
- Moments: Spark, Friction, Traction, Commitment, Reentry
- Tasks: D1-D6 as child tasks under the moments as they progress
- Owner: Rick Koloski
- Shared with: EpicDX (Tim VanderMolen)

---

## Decision Points

Before starting, we should align on:

1. **AWS account** — use PortableMind's AWS, or set up a dedicated NAHQ sandbox account?
2. **Spring Boot version** — 3.2.x (current stable) or 3.3.x?
3. **Java version** — 21 (LTS) seems right
4. **AI model** — Claude (our preference) or Gemini (MB's choice) or both for comparison?
5. **Synthetic data approach** — generate realistic distributions or use anonymized sample data from Tim?
6. **Share with Tim now or after D3?** — architecture proposal alone, or wait until we have working analytics?
7. **Base44 export access** — does Tim have a Builder plan ($50/mo)? Can we get a ZIP export of the current prototype?
8. **Which screens to port?** — Tim should identify 2-3 screens that were explicitly approved by the customer for the D7 demo
