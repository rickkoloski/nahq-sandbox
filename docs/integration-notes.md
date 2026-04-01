# NAHQ Accelerate — Integration Notes

**Date:** April 1, 2026
**Purpose:** Consolidate what we know about each external system NAHQ Accelerate touches, what role it plays, what we've confirmed, and what remains unknown.

---

## System Map

```
                         ┌─────────────────┐
                         │   Accelerate     │
                         │   (our app)      │
                         └────────┬─────────┘
                                  │
         ┌────────────┬───────────┼───────────┬────────────┐
         │            │           │           │            │
    ┌────▼────┐ ┌─────▼────┐ ┌───▼───┐ ┌────▼────┐ ┌─────▼─────┐
    │ Nimble  │ │ Qualtrics│ │ Oasis │ │ Entra   │ │  Claude   │
    │(Sfdc)   │ │          │ │ LMS   │ │ ID      │ │  API      │
    └─────────┘ └──────────┘ └───────┘ └─────────┘ └───────────┘
```

---

## 1. Nimble AMS (Salesforce-based)

**What it is:** Association Management System built on Salesforce. NAHQ's system of record for member/account data.

**Role in Accelerate:**
- Stores member profiles, organization records, membership status
- Current identity entry point for participants (they log into Nimble Community Hub)
- Assessment data and reporting inputs flow through Nimble
- Not an identity provider in the OAuth sense — it's a profile store with a login portal

**What we know (from Tim's Q&A, March 31):**
- Participants are provisioned by NAHQ in Nimble Community Hub
- Participants receive password reset notification, log in, and from there access PA and Nucleus dashboards
- Sandbox credentials exist but integration approach not yet validated
- For MVP: Nimble remains system of record for member/account data
- Accelerate owns application-layer objects (RBAC, cohorts, dashboards, assessment-cycle logic)

**What we now know (API research, March 31):**
- See `docs/nimble-ams-api-research.md` for full technical reference
- Three API paths: Salesforce REST API (Path A, recommended), Nimble Fuse Integration API (Path B, batch sync), NAMS REST Framework (Path C, versioned endpoints)
- Nimble namespace is `NU` (157 custom objects), package version NU 52.4.0 Winter 2026
- Auth: OAuth 2.0 JWT Bearer flow (server-to-server, no user interaction) via Connected App
- Nimble Programs package handles certification/accreditation tracking (Program, Milestone, Component objects)
- NAMS LMS API exists for course/purchase sync (may already carry Oasis data)
- Rate limits: 100K base + 1K per user license per 24h (Enterprise/Unlimited)

**What we still don't know:**
- Does NAHQ use Nimble Programs for competency certification? Or custom objects?
- What NAHQ-specific custom fields exist beyond standard NU objects?
- Where do Professional Assessment results live in Nimble (if at all)?
- Sync pattern: real-time query, batch sync, or manual import for MVP?
- Can Nimble's Salesforce Identity (OIDC) be used for participant SSO? (Tim said not needed for MVP)
- Who has Nimble admin access and can create a Connected App for us?
- What Salesforce edition does NAHQ use? (Affects rate limits)

**Our current approach:**
- Sandbox uses its own auth (email-based login, no password)
- Party model stores all identity data locally
- No Nimble integration implemented — deferred to post-MVP per Tim's guidance

**Integration priority:** Low for MVP. Medium for production. NAHQ admins currently handle user provisioning manually.

---

## 2. Qualtrics

**What it is:** Survey/assessment engine. Hosts the Professional Assessment (PA) — a 45-minute self-assessment.

**Role in Accelerate:**
- The assessment itself runs in Qualtrics, not in Accelerate
- Assessment results (scored per competency) need to flow into Accelerate for dashboards
- Survey question mapping (questions → competencies) documented in "Survey Question Mapping_2025.xlsx"

**What we know:**
- PA is a structured self-assessment measuring type and level of work performed (not a knowledge test)
- Respondents select activity groupings aligned to competency behaviors
- Scoring occurs at the competency level (0-3 scale)
- Assessment results exist at: competency level, domain level, role-group aggregation, organization level
- Current process is largely manual: Qualtrics link via email → results matched by email → imported to reporting

**What we don't know:**
- How do Qualtrics results get into the system today? (API? CSV export? Manual?)
- What does the Qualtrics → Nimble → Accelerate data pipeline look like?
- Can we access the Qualtrics API directly? (API key, survey IDs, response format)
- Does NAHQ want assessment-taking to eventually move into Accelerate? Or always Qualtrics?
- MB's architecture docs mention Qualtrics integration but it was never proven in code (per our architecture review)

**Our current approach:**
- Seed service generates synthetic assessment results directly in the database
- No Qualtrics integration implemented
- Assessment flow page not ported (blocked on understanding the Qualtrics interaction)

**Integration priority:** High for production (this is how real data enters the system). Not needed for demo/prototype.

---

## 3. Oasis LMS

**What it is:** NAHQ's Learning Management System. Hosts CE-eligible courses and training content. Built by 360Factor LLC. ACCME Premier Technology Partner.

**Role in Accelerate:**
- Course catalog synced from Oasis → Accelerate
- Upskill plans reference Oasis courses
- Training tracking (completion, hours, CE credits) flows from Oasis
- "Go to Course" buttons in our UI would deep-link to Oasis

**What we know (updated from research, March 31):**
- Learning Resources from Oasis include: course title, duration, CE eligibility, competency mappings
- Our architecture-counter-proposal mentions `lms_course (synced from Oasis)` in the data model
- Tim's framework doc says MVP upskilling uses NAHQ's existing competency-to-course mappings
- Oasis supports SCORM 1.1/1.2/2004, SAML & OAuth SSO, CE credit tracking in 0.25 increments
- Oasis has 30+ AMS integrations including **Nimble AMS** (NAHQ's member system)
- Oasis pushes completion data back to AMS automatically
- Oasis has API access (confirmed) but no public API docs — partner/NDA gated
- PARS integration is API-based (sends CME data to ACCME automatically)
- LTI and xAPI support: NOT confirmed from any public source
- `university.oasis-lms.com` is the subdomain pattern for client portals (may be NAHQ-U)

**What we don't know:**
- REST API details (endpoints, auth, rate limits) — not publicly documented
- Whether Oasis supports LTI 1.3 or xAPI
- Deep-link URL pattern for individual courses
- Whether the existing Oasis→Nimble completion sync could be our data source
- Whether NAHQ-U is the same Oasis instance or separate
- Who the Oasis admin contact is at NAHQ

**Our current approach:**
- 39 synthetic courses seeded via `SeedDataController`
- pgvector semantic matching for course recommendations (approximate, not NAHQ's actual mappings)
- No Oasis integration implemented

**Integration priority:** Medium for production. MVP plan: static catalog import (Pattern A from research). Production: API-based sync if API available, or read completions via Nimble/Salesforce.

**Detailed research:** See [oasis-lms-integration-research.md](oasis-lms-integration-research.md) — full analysis of Oasis capabilities, LMS standards (SCORM/LTI/xAPI), 4 integration patterns, and 14 questions for Tim.

---

## 4. Microsoft Entra ID (Azure AD)

**What it is:** Microsoft's identity platform. Used for NAHQ internal staff and potentially hospital admin auth.

**Role in Accelerate:**
- Admin authentication (NAHQ staff who manage the platform)
- Potential future: hospital executive SSO via Entra B2B

**What we know (from Tim's Q&A):**
- No SSO/federation requirement for MVP
- No hospital has requested IdP integration
- Entra + Nimble-based participant identity is sufficient for MVP
- Auth0 was in MB's architecture but no clear requirement justifies it for MVP

**Our current approach:**
- Spring Security with API key auth (admin) and user impersonation headers (non-admin)
- No Entra integration implemented
- Production would add Entra OIDC for admin users (standard Spring Security OAuth2)

**Integration priority:** Low for MVP. Standard when needed (Spring Security has built-in Entra support).

---

## 5. Claude API (Anthropic)

**What it is:** LLM API for AI-powered narrative generation.

**Role in Accelerate:**
- Structured context injection: domain data → Claude → narrative insights
- Three prefab actions: individual summary, upskill plan, org recommendations
- Freeform question answering with assessment context

**What we know:**
- Live and working in sandbox (API key set as env var)
- Using claude-sonnet-4-20250514 model
- Structured context injection approach (not RAG) — deterministic data in, narrative out
- AI generation log tracks all calls (type, tokens, latency, response)
- Dry-run mode when no API key (shows structured context without LLM call)

**Current status:** Fully implemented. POST /api/ai/ask for freeform, plus 3 prefab endpoints.

**Integration priority:** Done for MVP. Future: streaming responses, conversation memory, tool use.

---

## Integration Readiness Summary

| System | Role | MVP Need | Status | Blocking? |
|--------|------|----------|--------|-----------|
| Nimble (Salesforce) | Member profiles, auth portal | Data import | Not started | No — manual provisioning works |
| Qualtrics | Assessment engine | Result import | Not started | No — synthetic data works |
| Oasis LMS | Course catalog, completion | Course import | Not started | No — synthetic courses work |
| Entra ID | Admin SSO | Admin auth | Not started | No — API key auth works |
| Claude API | AI generation | Insights | **Done** | N/A |

**Key insight:** None of the external integrations are blocking MVP or demo. The sandbox runs on its own data. When production requires real data, the integrations are well-understood and the architecture (Party model, Spring Security, REST APIs) is ready to connect. The risk MB identified but never mitigated — proving the Nimble and Qualtrics integrations in code — remains open and should be addressed in the elaboration phase.

---

## Detailed API Research (separate docs)

| System | Research Doc | Key Finding |
|--------|-------------|-------------|
| Nimble/Salesforce | `docs/nimble-ams-api-research.md` | 3 API paths (Salesforce REST, Nimble Fuse, NAMS REST). 157 custom objects with `NU` namespace. JWT Bearer OAuth for server-to-server. Person Accounts for individuals. |
| Qualtrics | `docs/qualtrics-api-research.md` | v3 REST API. Webhook for PA completions (`surveyengine.completedResponse`). Bulk export (async 3-step) or single response fetch. 3,000 req/min rate limit. |
| Oasis LMS | `docs/oasis-lms-integration-research.md` | No public API docs (gated). Already integrates with Nimble (SSO + completion push-back). SCORM 1.1/1.2/2004, SAML/OAuth. Completion data may flow through Salesforce. |
| Entra ID | `docs/patterns/entra-id-integration.md` | Authorization Code + PKCE flow. Multi-tenant registration for hospital SSO. Spring Cloud Azure starter available. Microsoft Graph for user profiles. |

---

## NAHQ's Existing Technology Landscape

**Source:** "Orientation to NAHQ Business Intelligence and Data Assets" (PM file #680)

This internal NAHQ presentation reveals the full system map beyond what MB documented:

### Core Business Platforms
- **Nimble AMS (Salesforce)** — central customer portal, financial transactions, demographics, membership, certifications, purchase history, events, learning program participation
- **Oasis** — Learning Management System
- **Qualtrics** — surveys (Professional Assessment + other customer surveys)
- **HubSpot** — marketing automation (connected to Nimble via HighRoad Solutions)
- **Power BI** — business intelligence and reporting

### Data Flow (actual, not aspirational)
- Professional Assessment reporting is **automated in Nimble AMS** (not a separate system)
- Qualtrics survey responses flow **into Nimble** (matched by customer)
- Oasis learning participation data flows **into Nimble** (automated)
- Nimble is the single source of truth for all customer-facing data
- Power BI pulls from Nimble for dashboards and reports

### External Data Sources
- **Definitive Healthcare** — hospital/system attributes, exec contacts, CMS star ratings, HCAHPS scores. Linked to individuals via employer affiliations in Nimble.
- **ACCME/PARS** — CE credit reporting (Oasis is an ACCME Premier Technology Partner)

### Implication for Accelerate
The data flow is: **Qualtrics → Nimble → (our system)**. We don't need to integrate with Qualtrics AND Nimble separately — Nimble is the aggregation point. Similarly for Oasis: completion data already pushes back to Nimble. This means **Nimble/Salesforce is the primary integration surface**, not three separate integrations.

---

## MVP Phase 1 Integration Scope

**Source:** "NAHQ Accelerate MVP - Phase 1.docx" (PM file #727, Tim uploaded March 31)

### Timeline
- Build window: **March 30 – August 14, 2026**
- UAT: August 17 – August 28, 2026
- 10 structured development sprints

### Integration scope (explicitly stated by Tim)
1. **Nimble AMS** — identity alignment
2. **Qualtrics** — assessment delivery workflow
3. **Oasis LMS** — course launch linkage (where applicable)

### Product types for MVP
- Professional Assessment
- Patient Safety
- Assess Only

### AI scope (MVP-limited)
- AI-assisted interpretation only (summaries, insights)
- AI does NOT determine scoring, benchmarking, or standards
- Matches our structured context injection approach exactly

### What's explicitly NOT in Phase 1
- Pulse Survey workflows
- Advanced LMS governance
- Expanded benchmarking models
- AI-driven scoring or automated decision logic
- Enterprise rule engines

---

## Recommended Integration Sequence

Based on everything above, the production integration path is:

1. **Nimble/Salesforce first** (identity + assessment data + course completions all live here)
   - OAuth JWT Bearer connected app
   - Query Person Accounts for user identity
   - Query assessment results (PA data already in Nimble)
   - Query course completions (Oasis pushes to Nimble)

2. **Qualtrics webhook second** (real-time PA completion notification)
   - Register webhook for `surveyengine.completedResponse`
   - Fetch response, map to competencies, store in Accelerate
   - This replaces/supplements the Nimble sync for fresher data

3. **Oasis LMS deep-link third** (course launch from upskill plans)
   - URL pattern for launching specific courses
   - SSO handoff via SAML or OAuth
   - Completion tracking via Nimble (not direct Oasis API)

4. **Entra ID last** (admin SSO, production hardening)
   - Multi-tenant app registration
   - Spring Security OAuth2 client
   - Microsoft Graph for user profile enrichment

**The key insight from the NAHQ BI orientation doc: Nimble is the hub. Start there, and most of the other integrations become data that's already in Nimble.**
