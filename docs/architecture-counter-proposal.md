# NAHQ Accelerate — Architecture Counter-Proposal

**Date:** March 28, 2026
**From:** Rick Koloski (PortableMind)
**Context:** Right-sized MVP architecture as alternative to MindBowser's proposal
**Constraint:** Keeping Spring Boot per current team/client agreement

---

## The Problem with the Current Proposal

MindBowser's architecture prescribes enterprise-grade infrastructure for an MVP serving 200 initial users:

| Component | MB Choice | Scale It's Designed For | NAHQ MVP Scale |
|-----------|-----------|------------------------|----------------|
| Data Warehouse | Snowflake | Petabytes, 100s of concurrent analysts | <1GB, <20 dashboard users |
| Workflow Engine | Temporal | Millions of concurrent distributed workflows | 3 workflows, 4-6 states each |
| Vector Database | Milvus | Billions of vectors, sub-10ms at scale | 10K-50K vectors |
| Backend | Java Spring Boot | Enterprise multi-tenant | Reasonable (keeping) |
| AI/ML | Gemini 3 + full RAG pipeline | Unstructured knowledge retrieval | Structured domain with 29 competencies |

Estimated infrastructure cost: **$50K+/month** before processing a single assessment.

Several technical justifications provided for these choices do not hold up to scrutiny.

---

## Claim vs. Reality

### "AWS doesn't natively support pgvector"

**False.**

- **Amazon RDS for PostgreSQL**: pgvector supported since **May 2023** (PostgreSQL 13-16)
- **Amazon Aurora PostgreSQL**: pgvector supported since **July 2023** (PostgreSQL 15-16)
- **Azure Database for PostgreSQL**: pgvector supported since **June 2023** (PostgreSQL 13-16)

All three major clouds have had native pgvector support for nearly 3 years. At NAHQ's scale (10K-50K vectors), pgvector returns results in sub-millisecond time on a modest instance. Milvus is designed for billion-scale vector workloads — it requires its own cluster (etcd, MinIO/S3, multiple Milvus nodes) and adds significant operational overhead for zero benefit at this scale.

### "Snowflake is needed for benchmarking analytics"

**Not at this scale.**

NAHQ's analytical dataset: ~600 users x 29 competencies x annual assessments = ~17,400 result rows/year. Even with a national benchmark database of 200K historical records, total analytical data is **well under 1GB**.

PostgreSQL handles this with materialized views returning results in single-digit milliseconds. Snowflake's minimum viable cost is $150-300/month for compute alone — delivering performance that PostgreSQL provides at zero incremental cost.

Snowflake becomes justified at 500GB+ analytical data, 20+ concurrent ad-hoc analysts, or when OLTP/OLAP contention degrades writes. None of these apply here.

### "Complex workflows require Temporal"

**These are not complex workflows.**

NAHQ has three workflow patterns:

| Workflow | States | Duration | Triggers | Distributed? |
|----------|--------|----------|----------|-------------|
| User onboarding | invite → register → role → cohort | Minutes-days | User actions | No |
| Assessment lifecycle | launch → in-progress → complete → scored | Hours-weeks | User + system events | No |
| Engagement phases | initiate → assess → plan → activate | Weeks-months | Human decisions | No |

All three are linear state progressions with human-triggered transitions. No saga compensation. No distributed transactions. No millions of concurrent instances.

Temporal is designed for orchestrating calls across distributed microservices at massive scale (Uber ran it with hundreds of millions of open workflows). Running it in production requires 8+ pods for the server alone, a dedicated database, optional Elasticsearch, and developers trained in deterministic workflow constraints.

A JPA entity with a status enum column and transition validation in the service layer handles all three workflows. Add a scheduled job (Quartz or `@Scheduled`) for time-based rules (reminders, expirations).

---

## What We Would Scaffold Instead

### Design Principles

1. **One database does the work of four services** — PostgreSQL handles relational data, vector search, analytics, and state management
2. **Domain model first, AI layer second** — the 8 domains / 29 competencies / role-based targets are structured data, not retrieval problems
3. **Cloud-portable** — end customers are on Azure; build for PostgreSQL, not for a specific cloud's proprietary services
4. **Graduate complexity when earned** — design the seams where Snowflake/Temporal/Milvus *could* plug in later, but don't pay for them at MVP

### Proposed Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Backend** | Java (Spring Boot) | Keeping per agreement. Enterprise-grade, team knows it. |
| **Frontend** | React (SPA) | Keeping — reasonable choice for the UI requirements. |
| **Database** | PostgreSQL 16 (managed) | Single database for OLTP, analytics, and vectors. RDS, Aurora, or Azure Flexible Server. |
| **Vector Search** | pgvector extension | `CREATE EXTENSION vector;` — native, zero additional infra. Handles 50K vectors trivially. |
| **Analytics** | Materialized views + read replica | Precomputed benchmarks, percentiles, trend aggregations. Optional read replica ($20-50/mo) for workload isolation. |
| **Workflow** | JPA entities + status enums | Service-layer transition validation, event emission on state change, Quartz for time-based rules. |
| **Auth** | Spring Security + Entra ID | Admin auth via Azure AD (customers already on it). End-user auth via Nimble/OIDC flow. No third identity broker needed at MVP. |
| **AI/ML** | Structured context injection | Domain model provides deterministic gap calculations. LLM receives structured context for narrative generation. No RAG pipeline for core analytics. |
| **File/Object Storage** | S3 or Azure Blob | Assessment exports, reports, bulk imports. |
| **CI/CD** | GitHub Actions or GitLab CI | Standard, cloud-portable. |
| **Hosting** | Cloud-portable containers | Docker on ECS/Fargate (AWS) or Azure Container Apps. No cloud-specific orchestration dependencies. |

### Infrastructure Cost Comparison

| | MB Proposal (est.) | Counter-Proposal (est.) |
|---|---|---|
| Database | RDS PostgreSQL: ~$200/mo | Same: ~$200/mo |
| Snowflake | $150-300/mo | Materialized views: $0 |
| Read replica (optional) | — | ~$50/mo |
| Milvus cluster | $200-500/mo (self-hosted infra) | pgvector: $0 (same DB) |
| Temporal cluster | $300-800/mo (8+ pods, DB, ES) | JPA + Quartz: $0 |
| Auth0 | $0 MVP, ~$200/mo post-MVP | Spring Security + Entra ID: $0 |
| Compute (app servers) | ~$200/mo | Same: ~$200/mo |
| AI API calls | ~$100-500/mo (usage-based) | Same: ~$100-500/mo |
| **Monthly total** | **~$1,150-2,500/mo** | **~$450-950/mo** |

And that's being generous to the MB estimate — Snowflake, Milvus, and Temporal at production-grade with monitoring could easily push past $3K/month.

### The AI Layer — Domain Model, Not RAG

This is the most important architectural distinction. The current proposal builds a generic RAG pipeline (data ingestion → chunking → embedding → vector storage → retrieval → LLM generation) as the primary intelligence layer.

But NAHQ's domain is **well-structured and fully known**:

- 8 competency domains, 29 competencies — enumerated, not discovered
- Role-based targets (foundational/proficient/advanced) — defined per role type
- Assessment scoring — deterministic mapping from survey responses to competency scores
- Gap analysis — arithmetic: `score - target = gap`
- Benchmarking — percentile calculations against a known dataset
- Upskilling plans — gap-ranked competencies mapped to a course catalog

**Where each approach applies:**

| Query | Right Approach | Why |
|-------|---------------|-----|
| "What is my gap in Patient Safety?" | **Structured query** | Deterministic: `my_score - role_target` |
| "How do I compare to national benchmarks?" | **Materialized view lookup** | Precomputed percentiles, exact answer |
| "What courses should I take for my top 3 gaps?" | **Structured gaps + catalog join** | Gaps are calculated, course mappings are relational |
| "Generate my upskilling plan narrative" | **Structured context → LLM** | Feed structured profile to LLM for natural language output |
| "What strategic priorities should our org focus on?" | **Aggregated gaps → LLM** | Structured aggregation, then LLM narrative |
| "Explain what Patient Safety means in my role" | **RAG (or even static content)** | Only here does retrieval from NAHQ knowledge base add value |

The structured context injection pattern:
1. Calculate gaps, percentiles, rankings deterministically from the domain model
2. Package that structured data as LLM context
3. Ask the LLM to generate narratives, recommendations, and explanations
4. Results are auditable (the structured inputs are traceable) and higher quality (the LLM gets complete, correct context instead of searching for fragments)

pgvector is still available for the cases where actual vector similarity search adds value (e.g., "find similar role profiles" or "match learning resources by description similarity"), but it runs as a PostgreSQL extension — not a separate billion-scale vector database.

---

## Database Schema Sketch

Keeping MB's entity model where it's sound, applying our UDM assessment findings:

```
── Core Domain ──────────────────────────────────────
competency_domain          (8 rows — the domains)
competency                 (29 rows — linked to domains)
competency_framework_version (immutable snapshots — MB got this right)
role_target                (competency + role_type + target_level + framework_version)

── Organizations & People ──────────────────────────
organization               (customer healthcare systems)
site                       (hospitals within an org)
department                 (units within a site)
app_user                   (all user types)
role_type                  (catalog: admin, executive, participant, facilitator...)
user_role                  (join: user + role_type + from_date/thru_date)

── Assessments ──────────────────────────────────────
cohort                     (group of participants in an engagement)
assessment_cycle           (time-bounded assessment period)
assessment                 (user + cycle — status enum with transition validation)
assessment_result          (user + competency + score + framework_version)

── Engagement ──────────────────────────────────────
engagement                 (org + product — status enum: initiate/assess/plan/activate)
engagement_participant     (user + engagement + role + from_date/thru_date)

── Learning ────────────────────────────────────────
lms_course                 (synced from Oasis)
course_competency_mapping  (bridge: course + competency + framework_version + weight)
upskill_plan               (user + assessment_cycle)
upskill_plan_item          (plan + course + competency + priority)

── Analytics (materialized views) ──────────────────
mv_competency_benchmarks   (percentiles by competency, org_type, framework_version)
mv_org_capability_summary  (aggregated scores by org, domain, competency)
mv_cohort_progress         (completion rates, score distributions by cohort)
mv_gap_analysis            (precomputed gaps: result - target, ranked)

── AI Support ──────────────────────────────────────
ai_generation_log          (prompt, context_hash, response, model, tokens, created_at)
```

Status tracking uses enum columns with service-layer transition validation and an audit log table for history. If the audit log query pattern becomes painful, add a `status_history` table — but don't build it until it's needed.

---

## Graduation Triggers

Design the seams now, pay for the services later:

| Service | Graduation Trigger | Seam Design |
|---------|-------------------|-------------|
| **Snowflake/Redshift** | >500GB analytical data OR >20 concurrent ad-hoc analysts | All analytics queries go through a repository interface; swap PostgreSQL impl for warehouse impl |
| **Dedicated vector DB** | >5M vectors OR sub-millisecond latency requirement | Vector search behind a service interface; swap pgvector impl for Milvus/Pinecone |
| **Temporal** | >10 workflow types OR distributed multi-service orchestration needed | State machine logic in service layer behind workflow interface |
| **Auth0/Dedicated IdP** | >5 SSO integrations OR B2B federation requirements | Auth behind Spring Security abstractions (already standard) |

---

## Cloud Portability Note

NAHQ's end customers are healthcare systems — many on Azure (Microsoft shops). The MB proposal locks into AWS. This counter-proposal uses only PostgreSQL and standard containers, which run identically on:

- **AWS**: RDS/Aurora PostgreSQL + ECS/Fargate
- **Azure**: Azure Database for PostgreSQL Flexible Server + Azure Container Apps
- **GCP**: Cloud SQL for PostgreSQL + Cloud Run

The only cloud-specific choices are object storage (S3 vs Blob vs GCS) and container orchestration — both easily abstracted. This matters because deploying into a customer's Azure environment shouldn't require re-architecting the platform.

---

## Summary

| Dimension | MB Proposal | Counter-Proposal |
|-----------|-------------|------------------|
| Monthly infra cost | $1,150-2,500+ | $450-950 |
| Operational services to manage | 6+ (DB, Snowflake, Milvus, Temporal, Auth0, app) | 2 (DB, app) |
| Time to first working feature | Weeks (infra setup) | Days (Spring Boot + PostgreSQL) |
| Team skills required | Spring Boot + Snowflake + Temporal + Milvus + Auth0 | Spring Boot + PostgreSQL |
| Cloud portability | AWS-locked | Portable (AWS, Azure, GCP) |
| AI accuracy for core queries | Probabilistic (RAG retrieval) | Deterministic (structured domain model) |
| Scalability ceiling | Very high | High (with defined graduation paths) |

The counter-proposal isn't anti-enterprise. It's pro-sequencing. Build the domain model, prove the value proposition with 200 users, and graduate to enterprise infrastructure when the data and usage patterns demand it — not before.

---

*This analysis is based on publicly documented pricing, feature availability, and scale characteristics as of March 2026. Infrastructure costs are estimates and vary by region and commitment level.*
