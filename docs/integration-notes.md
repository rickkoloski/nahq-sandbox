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

**What we don't know:**
- What APIs does Nimble expose? (REST? Salesforce standard APIs? SOAP?)
- What data needs to sync between Nimble → Accelerate? (member profiles, org structure, assessment history?)
- Sync pattern: real-time query, batch sync, or manual import for MVP?
- Can Nimble's Salesforce Identity (OIDC) be used for participant SSO? (Tim said not needed for MVP)
- Who has Nimble admin access? (Credentials exist, access model needs confirmation from MB/NAHQ)

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

**What it is:** NAHQ's Learning Management System. Hosts CE-eligible courses and training content.

**Role in Accelerate:**
- Course catalog synced from Oasis → Accelerate
- Upskill plans reference Oasis courses
- Training tracking (completion, hours, CE credits) flows from Oasis
- "Go to Course" buttons in our UI would deep-link to Oasis

**What we know:**
- Learning Resources from Oasis include: course title, duration, CE eligibility, competency mappings
- Our architecture-counter-proposal mentions `lms_course (synced from Oasis)` in the data model
- Tim's framework doc says MVP upskilling uses NAHQ's existing competency-to-course mappings

**What we don't know:**
- What API does Oasis expose? (REST? LTI? xAPI?)
- What's the course catalog format? (Can Tim share a CSV/spreadsheet of courses?)
- How does course completion data flow back? (Webhook? Polling? Manual?)
- Deep-link URL pattern for individual courses
- Is there an existing competency-to-course mapping we can import?

**Our current approach:**
- 39 synthetic courses seeded via `SeedDataController`
- pgvector semantic matching for course recommendations (approximate, not NAHQ's actual mappings)
- No Oasis integration implemented

**Integration priority:** Medium for production. The course catalog could be imported as a static dataset initially, with completion tracking added later.

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
