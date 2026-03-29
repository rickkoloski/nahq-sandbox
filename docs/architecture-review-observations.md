# NAHQ Accelerate — Architecture Review Observations

**Date:** March 25, 2026
**From:** Rick Koloski (PortableMind)
**Context:** Initial review of shared discovery and architecture documentation

---

## 1. Risk Sequencing and RUP Alignment

The sprint plan shows S1-S4 focused on discovery, design, and prototype — comfortable work. The hard items are deferred:

- **Data governance** — still open, affects architecture decisions
- **Qualtrics integration** — actual data flow not proven in code
- **Nimble data migration** — manual import approach scoped but not built
- **SOC 2 readiness** — marked "Post-MVP"

The $1.3M pilot opportunity needs July data import capability, but the architecture decisions assume infrastructure that won't be ready in time.

RUP's Elaboration phase exists precisely to force these risks forward. "Can we actually integrate with Nimble's data?" should be proven in code by now, not deferred. The framework is designed to move the long pole in the tent to the front — the hardest, riskiest work gets addressed first, while there's still time to course-correct.

## 2. Solution Architecture — Overengineered for MVP

The current tech stack for MVP:

| Component | Choice | Concern |
|-----------|--------|---------|
| Data Warehouse | Snowflake | Enterprise-grade OLAP for ~200 initial users |
| Workflow Engine | Temporal | Complex orchestration for what may be simpler workflows |
| Vector Database | Milvus (dedicated) | Billion-scale vector DB when pgvector could serve MVP |
| Auth | Auth0 (post-MVP) | Reasonable, but adds another vendor relationship |
| Backend | Java Spring Boot | Enterprise-grade, but heavy for MVP iteration speed |
| AI/ML | Gemini 3 + Milvus RAG | Full RAG pipeline before the domain model is defined |

Each of these is a legitimate enterprise choice — at scale. But at MVP, they carry complexity that slows delivery and obscures whether the core value proposition works. This is potentially a $50K+/month infrastructure commitment before a single assessment is processed.

**The question to ask:** What is the minimum infrastructure needed to validate that the Accelerate platform delivers value to its first 200 users?

## 3. The Domain Model Gap — The Critical Observation

The architecture documents describe the plumbing in detail (RAG pipeline, vector embeddings, chunking, retrieval) but never describe what is being modeled.

NAHQ's Workforce Accelerator has a rich, structured domain:

- **8 competency domains** containing **29 competencies**
- **Role-based targets** (foundational, proficient, advanced) per competency
- **Assessment results** scored per competency per individual
- **Gap analysis** = current capability vs. expected target per role
- **Benchmarking** against NAHQ's national database
- **Upskilling plans** derived from gaps, mapped to learning resources

This is a **domain modeling problem**, not a retrieval problem.

### Example: Gap Analysis

Consider the query: *"What is this individual's gap in Patient Safety competency relative to their role's proficient target, benchmarked against the national median?"*

That's a **structured query against a well-modeled domain** — not something you want an LLM to generate probabilistically from vector-retrieved chunks. The answer should be deterministic, auditable, and precise.

### Where RAG Adds Value vs. Where It Doesn't

| Use Case | Right Approach |
|----------|---------------|
| "What is my gap in Domain X?" | **Structured domain query** — deterministic calculation from assessment results vs. role targets |
| "How do I compare to the national benchmark?" | **Structured analytics** — aggregation against benchmark dataset |
| "What training should I take to close my top 3 gaps?" | **Hybrid** — structured gap identification + AI recommendation from learning catalog |
| "What strategic priorities should our organization focus on?" | **AI-assisted** — structured gap data as context + LLM narrative generation |
| "Explain what Patient Safety competency means in my role" | **RAG** — retrieve relevant content from NAHQ's knowledge base |

### The Structured Context Injection Approach

A canonical domain model derived from the integration touchpoints (Qualtrics survey structure, Nimble org/role data, Oasis LMS course catalog, NAHQ's competency framework) would provide:

1. **Deterministic gap calculations** — not LLM-generated, auditable, precise
2. **Structured benchmark comparisons** — aggregation queries, not retrieval
3. **Rich context injection for AI** — "here is this person's competency profile, their role targets, and their top 3 gaps — now generate an upskilling recommendation"
4. **A foundation that makes the AI smarter with less infrastructure** — the LLM gets structured, complete context rather than searching for fragments

This approach would likely produce better results than a generic RAG solution while requiring significantly less infrastructure (no dedicated vector database, no chunking pipeline, no embedding management at MVP scale).

### Why This Matters

If you look at the participating systems from the integration points, you could derive a canonical or unified domain model and do useful structured context injection — probably getting better AI results than a generic RAG pipeline. The domain is well-defined enough (8 domains, 29 competencies, role-based targets) that modeling it explicitly is both feasible and higher-value than treating it as unstructured content to be embedded and retrieved.

## Summary

| Area | Observation | Recommendation |
|------|------------|----------------|
| Risk | Hard work deferred to post-MVP | Move integration risks (Nimble, Qualtrics) forward per RUP Elaboration principles |
| Architecture | Overengineered for MVP scale | Right-size infrastructure to validate value proposition with first 200 users |
| Domain Model | Missing from architecture docs | Define canonical domain model from competency framework + integration points |
| AI Strategy | Generic RAG pipeline | Structured domain model + context injection for deterministic core + AI narrative layer |

---

*These observations are intended as a collaborative contribution to the architecture discussion, not a criticism of work completed. The goal is to help ensure the MVP delivers maximum value with appropriate complexity for its stage.*
