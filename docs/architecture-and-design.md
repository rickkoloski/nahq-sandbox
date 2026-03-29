# NAHQ — Architecture and Design Ideas

**Created:** 2026-03-25
**Status:** Discovery / Context Hydration
**Source Material:** Tim VanderMolen (EpicDX) shared files via PortableMind
**Last Updated:** 2026-03-25

---

## Context

NAHQ (National Association for Healthcare Quality) is building **Accelerate** — an AI-native workforce development platform that transforms their existing Workforce Accelerator (WFA) product into a scalable SaaS system. The engagement is led by EpicDX (Tim VanderMolen) with MindBowser as the development partner and C&R (consulting firm) handling discovery and NAHQ stakeholder management.

The platform assesses healthcare quality professionals against NAHQ's Healthcare Quality Competency Framework (29 competencies across 8 domains), identifies gaps, generates personalized upskilling plans, and tracks organizational progress.

## Domain Understanding

### Core Product: Workforce Accelerator (WFA)
- **12-month engagement** with healthcare organizations (5+ hospitals minimum)
- **Four-phase model**: Initiate, Assess, Plan, Activate
- **Professional Assessment**: 45-minute self-assessment aligned to 29 competencies / 8 domains
- **Benchmarking**: Against NAHQ's national database
- **NAHQ Navigator**: Dedicated subject matter expert assigned to each engagement
- **Current NPS**: 50

### Three User Personas
1. **NAHQ Admin** — platform owner, onboards organizations, manages benchmarks, triggers AI pipelines
2. **Executive User** — org leadership (CQO, HR/Talent, CMOs), views aggregated results, org strategy
3. **Individual User** — healthcare quality professionals, takes assessments, receives personalized upskilling plans

### Key Data Entities (from user journey and data model)
- Organizations, Sites, Departments
- Roles, Role Groups, Role Types (with target competency levels: foundational/proficient/advanced)
- Competency Domains (8), Competencies (29)
- Assessments (via Qualtrics), Assessment Results (scored per competency)
- Gap Analysis (current vs. expected per role)
- Upskilling Plans (individual + organizational)
- Learning Resources (from Oasis LMS, CE-eligible content)
- Benchmarks (national database comparisons)

### Key Workflows (from user journey map)
1. **Onboarding**: Account setup, config, user invitation, role assignment
2. **Assessment**: Qualtrics survey (45 min), scoring, results compilation
3. **Results**: Individual dashboard, org aggregated dashboard, benchmarking
4. **Planning**: AI-generated upskilling plans, org strategic plans, gap analysis
5. **Activation**: LMS integration, training tracking, communities of practice
6. **Reassessment**: Post-engagement measurement (delta pre/post)

## Current Architecture (MindBowser's Design)

### Tech Stack Decisions (from MB docs)
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Cloud | AWS | HIPAA BAA, mature ecosystem, MB expertise |
| Backend | Java (Spring Boot) | Enterprise-grade security, multi-tenant RBAC, integration stability |
| Frontend | React (SPA) | Flexible component architecture, auth-friendly, AI UI integration |
| Data Warehouse | Snowflake | Analytics excellence for benchmarking, OLAP, multi-tenant access control |
| Workflow Engine | Temporal | Complex user journeys, long-running processes, retry/failure handling |
| Vector DB | Milvus | RAG architecture, sub-10ms latency, billion-scale embeddings |
| Auth | Auth0 (post-MVP) | Multi-tenant SSO, HIPAA BAA, SAML/OIDC |
| AI/ML | Gemini 3 (primary), Claude Opus 4.5 (backup) | 1M context window, multimodal, agentic capabilities |

### Integration Points
- **Microsoft Entra ID** — Admin authentication
- **Nimble (Salesforce)** — CRM, assessment data, user auth for non-admin users
- **Qualtrics** — Survey/assessment engine
- **Oasis LMS** — Learning platform, course catalog, training tracking
- **Power BI** — Reporting dashboards
- **AI Services** — RAG pipeline for insights/recommendations

### Architecture Pattern
- RAG pipeline: Data ingestion -> Chunking -> Embedding -> Vector storage -> Retrieval -> LLM insight generation
- Multi-tenant with data isolation per organization
- Accelerate Service as orchestration/intelligence layer

## Design Considerations

### Opportunities for PortableMind/DSiloed
- **AI-native architecture alignment** — NAHQ wants AI as foundational, not additive. This matches our platform thesis.
- **Competency framework as structured data** — 8 domains x 29 competencies with role-based targets is a natural fit for our data modeling capabilities
- **Multi-tenant workforce platform** — similar architecture patterns to what we've built
- **Navigator role** — maps to our agent/collaborator model
- **Assessment -> Gap -> Plan pipeline** — could leverage our task/project management + AI integration

### Architecture Questions to Explore
- How does the Qualtrics -> Nimble -> Accelerate data flow work today vs. what could be simplified?
- Is Temporal necessary if the workflow orchestration is simpler than anticipated?
- Snowflake for analytics — is this justified at MVP scale, or could a simpler OLAP approach work initially?
- Milvus vs. pgvector trade-off — at MVP scale (1-5 TB), is a dedicated vector DB warranted?
- Java Spring Boot vs. our Rails/Ruby stack — what are the trade-offs for this specific use case?

## Open Questions

- What is the current state of the Base44 prototype? (files in /NAHQ/Base44 Prototype)
- What specific AI capabilities have been demonstrated to NAHQ so far?
- What is the $1.3M pilot opportunity timeline and how does it affect MVP scope?
- What data governance requirements has NAHQ specified?
- What is the SOC 2 readiness timeline?
- Patent discussion status — competency model and systematic approach
