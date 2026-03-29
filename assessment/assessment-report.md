# NAHQ Data Model v1.0 — UDM Assessment Report

**Date:** 2026-02-26
**Assessor:** Claude (UDM Knowledge Base)
**Input:** NAHQ Data Model v1.0 — 40-page specification, 19 entities
**Domain:** Healthcare quality competency assessment, skills improvement tracking
**Integrations:** Nimble AMS, Microsoft Entra ID, Qualtrics, Oasis LMS

---

## What's Working Well

Before the findings — credit where it's due:

- **Competency Framework versioning** is genuinely well-designed. Snapshot-based immutability, single PUBLISHED version, automatic archival of predecessors. This protects historical assessment integrity — exactly right for regulatory defensibility.
- **UUID + internal PK dual-identifier pattern** across all entities is modern and correct. Public APIs never expose internal sequences.
- **Audit Logs** are comprehensive — who, what, when, where, why, with before/after JSON snapshots.
- **User Consent with version snapshots** is legally sound — point-in-time consent records with document text preservation.
- **Bridge tables** (Domain-Competency, OrgType-RoleGroup) with composite uniqueness constraints are properly normalized.

This model was built by someone who understands data governance. The issues below are structural patterns, not carelessness.

---

## Finding 1: Users and Organizations Without a Unifying Abstraction — YELLOW

`Users` and `Organization` are separate, unconnected entity trees. Anywhere the system needs to reference "an actor," it must choose which one — leading to patterns like:

- `Invitations` needs both `sender_user_id` and `organization_id` as separate FKs
- `Notifications` has `recipient_user_id` OR `recipient_email` OR `recipient_phone` — three different ways to target a recipient
- `Organization.primary_contact_id` is a bare FK to Users with no role context

Today this works because the actor types are distinct in function. But if NAHQ ever needs to model "this organization sent this notification" or "track all touchpoints with this entity regardless of type," the seams will show.

**UDM pattern:** Party as the common abstraction. Users and Organizations become subtypes of Party, and every FK that currently says `user_id` or `organization_id` can reference the same Party table when the context is "an actor did something."

**Severity: YELLOW** — not broken today, but limits future flexibility.

---

## Finding 2: System Roles as a Single Enum Column — RED

```
Users.role: Enum (Admin, Executive, Participant)
```

The document itself flags this: "Preferably normalized into a Role entity in future iterations." This is the right instinct. As an enum:

- A user can only play **one** role. What happens when an Executive also needs to take an assessment as an Individual Participant?
- There's no temporal dimension — when did they become an Executive? Were they a Participant first?
- Adding a new role (e.g., "Auditor," "Program Manager," "External Reviewer") requires a schema migration
- Role changes overwrite history — you can't ask "who had Executive access in Q1?"

**UDM pattern:** Extract to a **UserRole** join table with a **RoleType** catalog, `from_date`/`thru_date`. One user, many roles, each temporal. New roles = new rows.

**Severity: RED** — this will constrain the platform as user types grow.

---

## Finding 3: Contact Information Locked in Single Columns — YELLOW

- `Users.email` — single column, single email per user
- `Organization` — flat address columns (address_line1, city, state, postal_code)
- No concept of contact purpose or multiplicity

A user with a work email and a personal email? Can't model it. An organization with a headquarters address and a billing address? No structured mechanism. A phone number for notifications vs. a phone number on file? The `Notifications` table works around this by carrying its own `recipient_email` and `recipient_phone` columns — a sign that the contact model can't serve downstream needs.

**UDM pattern:** **ContactMechanism** entities (EmailAddress, PhoneNumber, PostalAddress) linked through a Contact association with purpose types.

**Severity: YELLOW** — functional for now, but the Notifications workaround signals growing pressure.

---

## Finding 4: Status as Overwritable Columns — YELLOW

Multiple entities use single-column status tracking:

- `Users.status`: active, inactive, invited, suspended
- `Organization.status`: active, pilot, inactive, suspended
- `Assessment_Responses.status`: STARTED, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
- `Engagements.current_phase`: INITIATE, ASSESS, PLAN, ACTIVATE

When a status changes, the previous value is gone. You can't answer: "When did this organization move from pilot to active?" or "How long did this assessment sit in IN_PROGRESS?" or "When was this user suspended and by whom?"

The Audit Logs provide some compensating coverage (old_value/new_value JSON snapshots), but querying audit logs for status history is expensive and indirect compared to a purpose-built pattern.

**UDM pattern:** **StatusApplication** — a history table with status_type, from_date, applied_by. Current status = most recent application. The Engagement entity's `phase_start_dates` as JSONB is a creative step in this direction but lacks the full pattern.

**Severity: YELLOW** — partially compensated by audit logs, but not queryable for analytics.

---

## Finding 5: Participant Modeling Gap in Engagements — RED

The `Engagements` entity tracks cohorts with `participant_count` as an integer and `organization_id` as a single FK. But there is **no entity modeling which users participate in which engagement, in what role, or when they joined/left**.

Who are the participants in "2025 Q1 Cohort"? The model can't answer this directly. Who is the program lead? Who is the facilitator? Who dropped out in week 3? None of this is structurally represented.

**UDM pattern:** An **EngagementParticipant** (or EngagementPartyRole) bridge entity: `engagement_id`, `user_id`, `role_type` (participant, facilitator, sponsor, observer), `from_date`, `thru_date`, `status`. This is Silverston's Entity-Party-Role (EPR) pattern applied to program management.

**Severity: RED** — this is a significant functional gap for a platform focused on tracking skills improvement across cohorts.

---

## Finding 6: Denormalized Course-Competency Mappings — YELLOW

`LMS_Courses.competency_mappings` is described as "Array of competency IDs" stored as an FK reference, and `domain_mappings` similarly. If these are JSONB arrays rather than a proper bridge table, you lose:

- Referential integrity (what if a competency is deprecated?)
- Query efficiency ("which courses address competency X?")
- Weight or strength attributes on the mapping
- Version alignment with the competency framework

The Domain-Competency bridge (Entity 6) is properly modeled. The Course-Competency relationship deserves the same treatment.

**UDM pattern:** A **CourseCompetencyMapping** bridge table, version-aligned with the competency framework.

**Severity: YELLOW** — depends on whether these are true JSONB arrays or properly normalized.

---

## Scorecard

| Area | Rating | Finding |
|------|--------|---------|
| People & Organizations | YELLOW | No Party unification; functional but inflexible |
| Role Modeling | RED | Single enum column; acknowledged as future work |
| Contact Information | YELLOW | Single columns, Notifications working around it |
| Status Tracking | YELLOW | Overwritable; audit logs compensate partially |
| Engagement Participation | RED | No participant-level modeling for cohorts |
| Course-Competency Links | YELLOW | Possible denormalization vs. bridge table |
| Framework Versioning | GREEN | Excellent snapshot strategy |
| Audit & Consent | GREEN | Well-designed, legally sound |

**Overall: 2 RED, 4 YELLOW, 2 GREEN.**

---

## Remediation Plan

Tracked in Portable Mind as **Project #33: NAHQ Data Model Remediation**.

| Task # | Name | Priority |
|--------|------|----------|
| 755 | Normalize User Roles from Enum to Role Entity | High |
| 756 | Add Engagement Participation Model | High |
| 757 | Introduce Party Abstraction for Users and Organizations | Medium |
| 758 | Extract Contact Mechanisms from Flat Columns | Medium |
| 759 | Implement Status History Pattern | Medium |
| 760 | Normalize Course-Competency Mappings to Bridge Table | Low |

The two HIGH priority tasks are additive — they don't require changing existing tables, just adding new ones alongside them. That's the lowest-risk starting point with the highest business impact.

---

## Target State Diagram

See `nahq-target-state.png` (or `.svg` for scalable version).

The D2 source (`nahq-target-state.d2`) can be regenerated or refined as remediation progresses. Install D2 via `brew install d2` or paste into https://play.d2lang.com.

---

*Assessment powered by UDM Knowledge Base (Silverston, "The Data Model Resource Book" Vols. 1-3)*
