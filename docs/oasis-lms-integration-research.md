# Oasis LMS Integration Research

**Date:** March 31, 2026
**Purpose:** Document what we know about Oasis LMS's technical capabilities, integration standards, and what we need to ask Tim/NAHQ to plan the Accelerate integration.

---

## 1. Oasis LMS Overview

**Vendor:** 360Factor LLC (oasis-lms.com)
**Category:** Cloud-based LMS for associations, certification bodies, and healthcare organizations
**Infrastructure:** Amazon cloud (AWS), modular SaaS architecture
**Relevance:** NAHQ uses Oasis LMS to deliver CE-eligible healthcare quality courses. Accelerate needs to reference these courses in upskill plans and track completion.

### Key Capabilities Confirmed from Public Sources

| Capability | Status | Source |
|---|---|---|
| SCORM compliance (1.1, 1.2, 2004 3rd/4th ed) | Confirmed | eLearning Industry, Capterra |
| CE/CME credit tracking (0.25 increments) | Confirmed | oasis-lms.com/healthcare-lms |
| Automated certificate generation | Confirmed | oasis-lms.com |
| PARS/JA-PARS integration (ACCME reporting) | Confirmed | ACCME Premier Technology Partner listing |
| SSO via SAML and OAuth | Confirmed | oasis-lms.com/healthcare-lms |
| AMS integrations (30+ platforms) | Confirmed | oasis-lms.com/association-lms |
| Nimble AMS integration | Confirmed | Listed as named integration partner |
| API access | Confirmed (exists) | softwarefinder.com |
| Learner transcripts and completion tracking | Confirmed | oasis-lms.com |
| Completion push-back to AMS | Confirmed | oasis-lms.com/association-lms |
| LTI support | NOT confirmed | Not mentioned in any source |
| xAPI support | NOT confirmed | Not mentioned in any source |
| Webhook support | NOT confirmed | Not mentioned in any source |
| Public REST API documentation | NOT found | No developer docs publicly available |

### ACCME Premier Technology Partner Status

Oasis LMS (360Factor) is one of seven ACCME Premier Technology Partners. This means they:
- Conform to ACCME's technical specs for activity and learner data reporting
- Support dropdown fields, matching protocols, error handling, and API usage per ACCME spec
- Provide sandbox testing environments
- Train customer service teams on PARS/JA-PARS integration support

Other notable partners in this group: Cadmium, HealthStream, Path LMS (Momentive Software).

---

## 2. What Is NOT Publicly Documented

Oasis LMS does not publish developer-facing API documentation. The following are unknown from public research:

1. **REST API endpoints** -- no public API reference, no Swagger/OpenAPI spec found
2. **Authentication mechanism for API** -- API key, OAuth2 client credentials, or bearer token?
3. **Webhook/event system** -- does Oasis push completion events, or must we poll?
4. **Deep-link URL pattern** -- what URL format launches a learner directly into a specific course?
5. **Course catalog export** -- can we pull the full course catalog via API, or is it CSV/spreadsheet?
6. **Completion data format** -- what fields come back? (course ID, learner ID, completion date, score, CE credits earned, certificate URL?)
7. **Competency-to-course mapping** -- does Oasis store this, or is it maintained separately by NAHQ?
8. **xAPI/LTI support** -- no public evidence either standard is supported

This is typical for association-focused LMS platforms. They expose APIs to integration partners (like the 30+ AMS platforms they support) under NDA or partnership agreements, not publicly.

---

## 3. LMS Integration Standards Reference

Since Oasis-specific API docs are unavailable, here are the three major LMS integration standards and how they would apply to the NAHQ Accelerate use case.

### 3.1 SCORM (Sharable Content Object Reference Model)

**What it is:** Course packaging and runtime standard. Defines how courses are structured (manifest XML + content files) and how the LMS communicates with course content at runtime (JavaScript API).

**Versions:** SCORM 1.2 (widely used), SCORM 2004 (adds sequencing). Oasis supports both.

**Relevance to Accelerate:** LOW. SCORM governs how Oasis plays courses internally. It does not help us integrate externally. SCORM has no concept of an external API -- it is purely an LMS-to-content runtime protocol.

**What it would give us:** Nothing directly. The fact that Oasis supports SCORM means their courses are packaged in a standard format, but we don't need to host or play those courses.

### 3.2 LTI (Learning Tools Interoperability)

**What it is:** Standard for securely launching external learning tools from within an LMS (or vice versa). LTI 1.3 (current) uses OAuth2/OIDC for authentication and JWT for message passing.

**Key capabilities:**
- **Resource Link Launch** -- user clicks a link in Platform A, gets SSO'd into Tool B with context (user ID, course ID, role)
- **Deep Linking 2.0** -- tool provides content items back to the platform for later launch
- **Assignment and Grade Services (AGS)** -- tool sends scores/grades back to the platform
- **Names and Roles Provisioning (NRPS)** -- platform shares roster with tool

**Relevance to Accelerate:** MEDIUM-HIGH if supported. LTI would let us:
- Launch Oasis courses from Accelerate with SSO (no re-login)
- Receive completion/grade data back via AGS
- Deep-link to specific courses

**Status with Oasis:** UNKNOWN. Not mentioned in any public source. Must ask Tim.

**Specification:** https://www.imsglobal.org/spec/lti/v1p3

### 3.3 xAPI (Experience API / Tin Can)

**What it is:** Standard for tracking learning experiences as "statements" in the form: Actor + Verb + Object (+ Result + Context). Statements are stored in a Learning Record Store (LRS).

**Example statement:**
```json
{
  "actor": { "mbox": "mailto:jane@hospital.org" },
  "verb": { "id": "http://adlnet.gov/expapi/verbs/completed" },
  "object": { "id": "https://oasis-lms.com/courses/hq-301", "definition": { "name": "Advanced Patient Safety" } },
  "result": { "completion": true, "score": { "scaled": 0.92 }, "extensions": { "ce_credits": 1.5 } }
}
```

**Relevance to Accelerate:** HIGH if supported. xAPI would let us:
- Track all learning activities (started, progressed, completed, scored)
- Store granular learning data in our own LRS or database
- Track CE credit claims per learner per course
- Aggregate learning data across multiple sources (not just Oasis)

**Status with Oasis:** UNKNOWN. Not mentioned in any public source. Must ask Tim.

**Healthcare xAPI profiles exist** for CE/CME tracking with standard verbs for: registered, launched, completed, passed, earned (credit).

**Specification:** https://github.com/adlnet/xAPI-Spec

---

## 4. Integration Patterns for Accelerate

Given what we know, here are the realistic integration approaches ordered from simplest to most sophisticated:

### Pattern A: Static Catalog Import + Manual Completion (MVP)

**Effort:** Minimal
**How it works:**
1. Tim provides a CSV/spreadsheet of the Oasis course catalog (title, duration, CE credits, competency mappings, Oasis course URL)
2. We import into `learning_resource` table
3. "Go to Course" button deep-links to Oasis (learner logs in separately)
4. Completion data imported manually (CSV from Oasis admin export) or entered by NAHQ admin

**What we need from Tim:**
- Course catalog export (any format)
- Competency-to-course mapping table
- Deep-link URL pattern (e.g., `https://university.oasis-lms.com/course/{id}`)
- How NAHQ currently tracks who completed what

**This is what our sandbox already approximates** with 39 synthetic courses.

### Pattern B: API-Based Catalog Sync + Completion Polling

**Effort:** Medium
**How it works:**
1. Scheduled job pulls course catalog from Oasis API (if available)
2. "Go to Course" launches via SSO (if SAML/OAuth configured) or deep-link
3. Scheduled job polls Oasis for completion records per learner
4. Completions written to `training_record` table

**What we need from Tim:**
- Oasis API credentials and documentation
- API endpoint for course catalog listing
- API endpoint for learner completions (filtered by date range)
- SSO configuration between Accelerate and Oasis

### Pattern C: LTI 1.3 Launch + Grade Passback

**Effort:** Medium-High
**How it works:**
1. Accelerate registers as an LTI 1.3 Platform (or Tool, depending on direction)
2. Course links use LTI resource link launch (SSO built-in)
3. Oasis returns completion/grade via Assignment and Grade Services
4. Deep Linking 2.0 lets NAHQ admins browse Oasis catalog from within Accelerate

**What we need from Tim:**
- Confirmation Oasis supports LTI 1.3
- LTI registration credentials (client_id, deployment_id, platform endpoints)
- JWKS endpoint for signature verification

### Pattern D: xAPI Statement Forwarding

**Effort:** Medium
**How it works:**
1. Oasis sends xAPI statements to an LRS endpoint we host (or a third-party LRS)
2. Accelerate reads from the LRS to populate training records
3. Statements include: who completed what, when, score, CE credits

**What we need from Tim:**
- Confirmation Oasis supports xAPI statement forwarding
- LRS endpoint configuration in Oasis admin
- xAPI activity IDs for Oasis courses

---

## 5. Oasis <-> Nimble AMS Connection

An important finding: **Oasis LMS lists Nimble AMS as a named integration partner.** This means there is likely an existing data flow between Oasis and Nimble (NAHQ's member system) that includes:

- Member roster sync (Nimble -> Oasis)
- SSO / member authentication
- Completion push-back (Oasis -> Nimble)
- Member/non-member pricing rules

**Implication for Accelerate:** If Oasis already pushes completion data to Nimble (Salesforce), we may be able to read completion data from Nimble/Salesforce rather than from Oasis directly. This is worth asking Tim about -- it might be the path of least resistance.

---

## 6. NAHQ-U Platform

NAHQ-U is NAHQ's branded professional development destination. All content is aligned to the NAHQ Healthcare Quality Competency Framework. NAHQ-U includes:
- Learning Labs (hour-long webinars, CPHQ CE credit eligible)
- Journal for Healthcare Quality (read article + quiz = CE credit)
- Events (live, virtual, on-demand)
- CPHQ prep courses

**Unknown:** Whether NAHQ-U is powered by Oasis LMS or is a separate portal. The `university.oasis-lms.com` subdomain in Oasis's own documentation suggests Oasis uses this URL pattern for client portals, which would be consistent with NAHQ-U running on Oasis.

---

## 7. Questions for Tim / NAHQ

### Must-answer (blocks production integration design)

1. **Does Oasis have a REST API?** If yes, can we get API documentation and sandbox credentials?
2. **Does Oasis support LTI 1.3?** (launch + grade passback)
3. **Does Oasis support xAPI?** (statement forwarding to external LRS)
4. **What is the deep-link URL pattern** for launching a learner into a specific course?
5. **How does completion data currently flow?** Oasis -> Nimble? Oasis -> CSV export? Oasis -> PARS only?
6. **Can Tim provide the course catalog** as a spreadsheet? (title, ID, duration, CE credits, competency mapping, URL)
7. **Is NAHQ-U the same system as the Oasis LMS instance?** Or a separate portal?

### Nice-to-know (informs architecture but not blocking)

8. **Does the Oasis <-> Nimble integration already sync completions?** If so, could we read from Salesforce instead?
9. **Does Oasis support SSO for external app launches?** (SAML SP-initiated or OAuth)
10. **Does Oasis have webhook/event capabilities?** (push on completion vs. polling)
11. **Who is the Oasis admin contact at NAHQ?** (for API credentials, configuration changes)
12. **What Oasis plan/tier does NAHQ use?** (API access may be tier-dependent)
13. **Are there rate limits or data export restrictions** in Oasis's API?
14. **Does the existing competency-to-course mapping live in Oasis, Nimble, or a spreadsheet?**

---

## 8. Recommended Approach

**For the July 2026 MVP (200 users):**

Start with **Pattern A** (static catalog import). This is zero-risk, requires no API integration, and Tim can provide the data in any format. It mirrors what our sandbox already does with synthetic data -- we just replace synthetic courses with real ones.

**For production scaling:**

Target **Pattern B** (API-based sync) as the baseline, with Pattern C (LTI) or Pattern D (xAPI) as upgrades if Oasis supports them. The Oasis <-> Nimble existing integration may offer a shortcut for completion data.

**Key architectural decision:** Our Party model and `learning_resource` / `training_record` tables are already designed to support any of these patterns. The integration layer is additive -- no schema changes needed regardless of which pattern Tim confirms.

---

## Sources

- [Oasis LMS Homepage](https://oasis-lms.com/)
- [Oasis LMS Healthcare LMS](https://oasis-lms.com/healthcare-lms)
- [Oasis LMS Association LMS](https://oasis-lms.com/association-lms)
- [Oasis LMS on Capterra](https://www.capterra.com/p/141282/Oasis-LMS/)
- [Oasis LMS on eLearning Industry](https://elearningindustry.com/directory/elearning-software/oasislms)
- [Oasis LMS on Software Finder](https://softwarefinder.com/lms/oasislms)
- [ACCME Premier Technology Partners](https://accme.org/data-reporting/pars/technology-partners/)
- [Oasis University PARS Integration](https://university.oasis-lms.com/AssetListing/PARS-Integration-10829/1-What-is-PARS-Integration-20744)
- [360Factor / Oasis-LMS on LinkedIn](https://www.linkedin.com/company/oasis-lms)
- [LTI 1.3 Core Specification](https://www.imsglobal.org/spec/lti/v1p3)
- [LTI Deep Linking 2.0 Specification](https://www.imsglobal.org/spec/lti-dl/v2p0)
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)
- [LMS API Integration Patterns (Unified.to)](https://unified.to/blog/learning_management_system_lms_api_integration_real_time_course_data_and_learning_platforms)
- [LMS Integration Guide (beefed.ai)](https://beefed.ai/en/lms-integrations-apis-xapi-lti-event-driven-architecture)
- [xAPI Healthcare LMS Guide (Paradiso)](https://www.paradisosolutions.com/blog/xapi-tracking-healthcare-lms-guide/)
- [NAHQ Education](https://nahq.org/education/)
- [NAHQ Continuing Education](https://nahq.org/education/individual-training/continuing-education/)
