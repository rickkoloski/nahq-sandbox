# NAHQ Accelerate — Domain Model

**Version:** 1.0 (April 1, 2026)
**Purpose:** Organize feature implementations and AI/deterministic execution context.
**Convention:** `[✓]` = implemented, `[~]` = table exists but incomplete, `[ ]` = not yet implemented

---

## Subject Area Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NAHQ Accelerate Domain                           │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Party &     │  │  Competency  │  │  Assessment  │  │  Learning  │ │
│  │ Organization  │  │  Framework   │  │  & Scoring   │  │  & Upskill │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                  │                │         │
│         │    ┌────────────┼──────────────────┼────────────────┘         │
│         │    │            │                  │                          │
│  ┌──────▼────▼──┐  ┌─────▼────────┐  ┌─────▼────────┐  ┌───────────┐ │
│  │  Engagement  │  │    Role      │  │  Analytics   │  │    AI &   │ │
│  │  & Delivery  │  │  Standards   │  │  & Benchmark │  │  Context  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐                                    │
│  │    Auth &    │  │  External    │                                    │
│  │   Identity   │  │  Systems     │                                    │
│  └──────────────┘  └──────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Party & Organization `[✓ implemented]`

Silverston Universal Data Model. Party is the abstract supertype for all
actors. Identity and relationships are temporal (from_date/thru_date).

```
┌──────────────────┐
│ Party        [✓]  │
├──────────────────┤
│ id                │
│ party_type        │──── "INDIVIDUAL" | "ORGANIZATION"
│ display_name      │
│ created_at        │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──────┐ ┌▼──────────────┐
│Individual│ │ Organization  │
│     [✓]  │ │          [✓]  │
├──────────┤ ├───────────────┤
│ party_id │ │ party_id      │
│first_name│ │ name          │
│ last_name│ │ org_type      │──── "HEALTH_SYSTEM" | "HOSPITAL" | ...
└──────────┘ │ status        │
             └───────────────┘

┌──────────────────────┐       ┌─────────────────────────┐
│ PartyRole       [✓]  │       │ PartyRelationship  [✓]  │
├──────────────────────┤       ├─────────────────────────┤
│ party_id        (FK) │       │ from_party_id      (FK) │
│ role_type_id    (FK) │       │ to_party_id        (FK) │
│ organization_id (FK) │       │ relationship_type_id(FK)│
│ from_date            │       │ from_date               │
│ thru_date            │       │ thru_date               │
└──────────────────────┘       └─────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────┐       ┌─────────────────────────────┐
│ RoleType    [✓]  │       │ PartyRelationshipType  [✓]  │
├──────────────────┤       ├─────────────────────────────┤
│ name             │       │ name                        │
│ internal_id      │       │ internal_id                 │
│ description      │       │ description                 │
└──────────────────┘       └─────────────────────────────┘

RoleType values: admin, executive, participant, facilitator, observer
RelationshipType values: employed_by, subsidiary_of

┌──────────────────┐
│ Site        [~]  │  (exists but minimal — backward compat for Nimble)
├──────────────────┤
│ organization_id  │
│ name, city, state│
└──────────────────┘
```

**Hierarchy resolution:**
- `resolve_health_system(org_id)` — walks subsidiary_of to root
- `org_with_subsidiaries(org_id)` — returns self + children
- `OrganizationHierarchyService` — Java decorator over Party model
- See `docs/patterns/party-model-decorator.md`

---

## 2. Competency Framework `[✓ implemented]`

NAHQ's Healthcare Quality Competency Framework. Versioned — assessment
cycles pin to a specific framework version for longitudinal integrity.

```
┌─────────────────────────────┐
│ CompetencyFrameworkVersion  │
│                        [✓]  │
├─────────────────────────────┤
│ version_label               │──── "2025-v1"
│ status                      │──── "PUBLISHED" | "DRAFT"
│ published_at                │
└──────────────┬──────────────┘
               │ referenced by
               ▼
┌──────────────────────┐     ┌─────────────────────┐
│ CompetencyDomain [✓] │◄────│ Competency     [✓]  │
├──────────────────────┤     ├─────────────────────┤
│ name                 │     │ domain_id      (FK) │
│ description          │     │ name                │
│ display_order        │     │ description         │
└──────────────────────┘     │ display_order       │
                             └──────────┬──────────┘
  8 domains, 28 competencies             │
                                         │ future
                                         ▼
                             ┌─────────────────────┐
                             │ SkillStatement  [ ]  │
                             ├─────────────────────┤
                             │ competency_id  (FK) │
                             │ level               │── F / P / A
                             │ statement_text      │
                             │ display_order       │
                             └─────────────────────┘
                             600+ behavioral statements
                             (awaiting data from Tim)
```

---

## 3. Role Standards `[✓ implemented]`

Tim's "NAHQ Role Target Standard" — defines expected competency levels
per role. New governed construct being formalized in Accelerate.

```
┌──────────────────────────┐
│ RoleTarget          [✓]  │
├──────────────────────────┤
│ role_type_id        (FK) │──── Which role (participant, executive, ...)
│ competency_id       (FK) │──── Which competency
│ framework_version_id(FK) │──── Pinned to framework version
│ target_level             │──── "FOUNDATIONAL" | "PROFICIENT" | "ADVANCED"
│ target_score             │──── 0.0 - 3.0
└──────────────────────────┘

  Future extension from Tim's framework doc:
┌──────────────────────────┐
│ RoleGroup           [ ]  │  (not yet modeled)
├──────────────────────────┤
│ name                     │──── "Quality Leader", "Clinical Bridge", ...
│ role_level               │──── "Director", "Manager", "Specialist"
└──────────────────────────┘
  RoleTarget would expand: role_group_id + role_level → target
```

---

## 4. Assessment & Scoring `[✓ implemented]`

Assessment lifecycle: CREATED → STARTED → COMPLETED → SCORED.
Scores recorded per competency per participant.

```
┌───────────────────────────┐
│ Engagement           [~]  │  (table exists, not fully wired)
├───────────────────────────┤
│ organization_id      (FK) │
│ name                      │──── "TGH 2026 Baseline"
│ current_phase             │──── INITIATE | ASSESS | PLAN | ACTIVATE
│ start_date, end_date      │
└──────────┬────────────────┘
           │
     ┌─────┴──────┐
     │             │
┌────▼──────┐  ┌──▼───────────────────────┐
│ Cohort [~]│  │ AssessmentCycle      [✓] │
├───────────┤  ├──────────────────────────┤
│engage_id  │  │ engagement_id       (FK) │
│ name      │  │ name                     │──── "Baseline 2026"
└─────┬─────┘  │ framework_version_id(FK) │──── Pins framework
      │        │ open_date, close_date    │
      │        └──────────┬───────────────┘
      │                   │
      ▼                   ▼
┌────────────────────┐  ┌───────────────────────┐
│EngagementPartic [~]│  │ Assessment       [✓]  │
├────────────────────┤  ├───────────────────────┤
│ engagement_id (FK) │  │ party_id         (FK) │──── Who took it
│ cohort_id     (FK) │  │ assessment_cycle_id   │──── Which cycle
│ party_id      (FK) │  │ status                │──── SCORED
│ particip_type      │  │ started_at            │
│ status, dates      │  │ completed_at          │
└────────────────────┘  │ scored_at             │
                        └──────────┬────────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │ AssessmentResult  [✓]  │
                        ├───────────────────────┤
                        │ assessment_id    (FK)  │
                        │ competency_id    (FK)  │
                        │ framework_ver_id (FK)  │
                        │ score                  │──── 0.00 - 3.00
                        └────────────────────────┘
```

**Product Types** (from Tim's MVP Phase 1 doc — not yet modeled):
```
┌──────────────────────────┐
│ ProductType         [ ]  │
├──────────────────────────┤
│ name                     │──── "Professional Assessment"
│ internal_id              │     "Patient Safety"
│ description              │     "Assess Only"
│ has_learning_component   │──── boolean
│ has_benchmark_comparison │──── boolean
└──────────────────────────┘
  Controls: assessment structure, comparison availability,
  reporting depth, Navigator involvement, upskill outputs
```

---

## 5. Learning & Upskilling `[✓ partially implemented]`

Course catalog (seeded), semantic matching (pgvector), competency mappings.
Missing: completion tracking, learning plans, Oasis LMS integration.

```
┌──────────────────────────┐     ┌─────────────────────────────┐
│ LmsCourse           [✓]  │     │ CourseCompetencyMapping [✓]  │
├──────────────────────────┤     ├─────────────────────────────┤
│ title                    │     │ course_id              (FK) │
│ description              │     │ competency_id          (FK) │
│ provider                 │     │ framework_version_id   (FK) │
│ duration_hours           │     │ relevance_weight            │
│ ce_eligible              │     └─────────────────────────────┘
│ url                      │
│ embedding (vector)       │──── pgvector for semantic matching
└──────────────────────────┘

  Not yet implemented:
┌──────────────────────────┐     ┌─────────────────────────────┐
│ LearningPlan        [ ]  │     │ CourseCompletion        [ ]  │
├──────────────────────────┤     ├─────────────────────────────┤
│ party_id            (FK) │     │ party_id               (FK) │
│ assessment_id       (FK) │     │ course_id              (FK) │
│ generated_by             │     │ completed_at                │
│ status                   │     │ score / grade               │
│ plan_content (text/json) │     │ ce_credits_earned           │
└──────────────────────────┘     │ source                      │── "oasis" | "manual"
                                 └─────────────────────────────┘
```

---

## 6. Analytics & Benchmarking `[✓ implemented via MVs]`

Materialized views for fast aggregation. Refreshed on demand.

```
┌─────────────────────────────────┐
│ mv_competency_benchmarks   [✓]  │  National percentiles per competency
├─────────────────────────────────┤
│ competency_id, name, domain     │
│ mean_score, p25, p50, p75, p90  │
│ sample_size                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ mv_org_domain_summary      [✓]  │  Org avg per domain
├─────────────────────────────────┤
│ organization_id, domain_id      │
│ org_avg_score, participant_count│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ mv_domain_benchmarks       [✓]  │  National domain-level stats
├─────────────────────────────────┤
│ domain_id, mean_score, p50      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ mv_org_capability_summary  [✓]  │  Detailed org × competency
├─────────────────────────────────┤
│ organization_id, competency_id  │
│ org_avg_score, sample_size      │
└─────────────────────────────────┘

  Not yet implemented:
┌─────────────────────────────────┐
│ NationalAverage            [ ]  │  NAHQ-provided reference data
├─────────────────────────────────┤  (production replaces calculated MVs)
│ competency_id              (FK) │
│ framework_version_id       (FK) │
│ mean, p25, p50, p75, p90       │
│ sample_size, period             │
│ provided_by_nahq_on             │
└─────────────────────────────────┘
```

---

## 7. AI & Context `[✓ implemented]`

Structured context injection — domain model provides deterministic data,
LLM adds narrative. AI does NOT determine scoring or standards.

```
┌──────────────────────────────┐
│ AiGenerationLog         [✓]  │
├──────────────────────────────┤
│ generation_type              │──── individual_summary | upskill_plan
│ party_id               (FK) │     org_insights | freeform_ask
│ organization_id        (FK) │
│ prompt_hash                  │
│ context_summary (text)       │──── Structured context sent to LLM
│ response_text (text)         │──── LLM response
│ model                        │──── claude-sonnet-4-20250514
│ input_tokens, output_tokens  │
│ latency_ms                   │
└──────────────────────────────┘

Context packaging: ContextPackagingService assembles deterministic
data (scores, gaps, benchmarks, courses) into structured text.
LLM receives this as the "intelligence layer" — it adds narrative,
not knowledge.
```

---

## 8. Auth & Identity `[✓ implemented for sandbox]`

Sandbox uses simplified auth. Production will add Entra ID + Nimble.

```
┌──────────────────────────┐
│ AppUser             [✓]  │
├──────────────────────────┤
│ email                    │
│ party_id            (FK) │──── Links auth record to Party identity
│ status                   │──── ACTIVE | DEACTIVATED
└──────────────────────────┘

Auth response includes:
- userId, email, firstName, lastName
- organizationId, organizationName
- healthSystemOrgId (resolved via OrganizationHierarchyService)
- roles[], primaryRole

Production additions:
┌──────────────────────────┐
│ ExternalIdentity    [ ]  │
├──────────────────────────┤
│ party_id            (FK) │
│ provider                 │──── "entra" | "nimble" | "qualtrics"
│ external_id              │──── Entra OID, Salesforce Account ID, etc.
│ metadata (jsonb)         │
└──────────────────────────┘
```

---

## 9. External System References `[ ]`

Not yet implemented. Will map our entities to external system IDs
for integration (Nimble, Qualtrics, Oasis).

```
┌──────────────────────────────────────┐
│ ExternalSystemMapping           [ ]  │
├──────────────────────────────────────┤
│ entity_type                          │──── "Individual" | "Organization" | ...
│ entity_id                            │──── Our internal ID
│ system                               │──── "nimble" | "qualtrics" | "oasis"
│ external_id                          │──── Salesforce Account ID, Survey Response ID, etc.
│ sync_status                          │──── "synced" | "pending" | "conflict"
│ last_synced_at                       │
└──────────────────────────────────────┘
```

---

## Cross-Reference: Object Graph for AI Context

When the AI generates insights, the context packaging service traverses
this object graph to assemble structured context:

```
Individual Context (for individual_summary, upskill_plan, freeform_ask):
  Party → Individual (identity)
  Party → PartyRole → RoleType (role)
  Party → PartyRelationship → Organization (employer)
  Party → Assessment → AssessmentResult[] (scores)
  AssessmentResult → Competency → CompetencyDomain (framework)
  RoleType + Competency → RoleTarget (expected levels)
  Competency → CourseCompetencyMapping → LmsCourse (recommendations)
  Party → mv_competency_benchmarks (national comparison)

Organizational Context (for org_insights, freeform_ask):
  Organization → org_with_subsidiaries() (hierarchy)
  Organization → mv_org_domain_summary (domain averages)
  Organization → mv_domain_benchmarks (national reference)
  Organization → PartyRelationship[employed_by] → count (participants)
  Organization → Assessment[SCORED] → count (completion)
```

---

## Implementation Status Summary

| Subject Area | Tables | Status | Notes |
|-------------|--------|--------|-------|
| Party & Organization | 7 | ✓ Complete | Silverston UDM, hierarchy decorator |
| Competency Framework | 3 | ✓ Complete | Missing: SkillStatement (600+ from Tim) |
| Role Standards | 2 | ✓ Functional | Missing: RoleGroup/RoleLevel granularity |
| Assessment & Scoring | 5 | ✓ Core done | Missing: ProductType |
| Learning & Upskill | 2 | ~ Partial | Missing: LearningPlan, CourseCompletion |
| Analytics & Benchmark | 4 MVs | ✓ Complete | Production: NAHQ-provided NationalAverage |
| AI & Context | 1 | ✓ Complete | Structured context injection working |
| Auth & Identity | 1 | ✓ Sandbox | Production: Entra + Nimble SSO |
| External Systems | 0 | Not started | ExternalSystemMapping for Nimble/Qualtrics/Oasis |
| **Total** | **23 tables + 4 MVs** | | |

---
---

# Appendix A: Future Considerations

## A.1 Agreement-Based Product Model

**Status:** Not implemented. Noted as an evolution path for when ProductType
becomes real and NAHQ's commercial model requires more flexibility.

**Background:** The current model has a flat `Engagement` entity with an
implicit single product type. This works for the demo and initial delivery
but limits how we represent what organizations have actually purchased.

**The Silverston pattern:** Agreement → AgreementItem → ProductType

```
┌─────────────────────────────┐
│ Agreement                   │
├─────────────────────────────┤
│ organization_id        (FK) │──── Who (Tampa General Hospital)
│ agreement_type              │──── "workforce_accelerator" | "subscription"
│ status                      │──── ACTIVE | EXPIRED | PENDING
│ effective_date              │
│ expiration_date             │
│ terms (jsonb)               │──── Pricing, participant caps, etc.
└──────────────┬──────────────┘
               │ 1:many
               ▼
┌─────────────────────────────┐
│ AgreementItem               │
├─────────────────────────────┤
│ agreement_id           (FK) │
│ product_type_id        (FK) │──── What they purchased
│ quantity                    │──── e.g., 200 participant seats
│ effective_date              │──── Item-level dates (may differ
│ expiration_date             │     from agreement dates)
│ status                      │
└──────────────┬──────────────┘
               │ many:1
               ▼
┌─────────────────────────────┐
│ ProductType                 │
├─────────────────────────────┤
│ name                        │──── "Professional Assessment"
│ internal_id                 │     "Patient Safety"
│ description                 │     "Assess Only"
│ features (jsonb)            │──── { has_learning: true,
│                             │       has_benchmark: true,
│                             │       has_navigator: true,
│                             │       assessment_scope: "full" }
└─────────────────────────────┘
```

**Why this matters:**

1. **Multi-product engagements.** A hospital can purchase Professional
   Assessment for 50 quality leaders AND Assess Only for 200 frontline
   staff under a single agreement. The current flat model would require
   two separate Engagements.

2. **Feature entitlement as a query.** "Does this participant have LMS
   access?" becomes a join: Participant → Engagement → AgreementItem →
   ProductType → features.has_learning, rather than a hardcoded check.

3. **Commercial flexibility.** The same pattern supports both project-based
   engagements (12-month WFA with a start/end date) and perpetual
   subscriptions (annual renewal), which parallels how Nimble AMS handles
   NAHQ's core membership products.

4. **Audit trail.** Agreement history shows what was contracted vs.
   what was delivered — important for a $1.3M pilot engagement.

**Prior art:** Silverston's "Agreement" pattern (Vol. 1, Ch. 4).
Hospitality: timeshare ownership (agreement-based access to a shared
resource). Airlines: ticket = agreement item granting access to a
specific flight product. The common thread is an entitlement that
governs what platform features and resources the customer has paid
for and subsequently has access to.

**When to implement:** When NAHQ needs to support multiple product
types per organization, or when the commercial model requires
tracking what was purchased vs. delivered. The current `Engagement`
table is the natural migration target — it becomes the Agreement,
and we add AgreementItem + ProductType alongside it.
