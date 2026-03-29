# NAHQ Data Model — Remediation Deltas

**Baseline:** NAHQ Data Model v1.0 (19 entities)
**Target:** UDM-aligned model (19 existing + 11 new entities, 1 modified)

---

## Delta 1: User Role Normalization (Priority: HIGH)

**Baseline:**
- `Users.role` — single enum column (Admin, Executive, Participant)
- One role per user, no history, schema change for new roles

**Target — New Entities:**
- `role_type` — catalog table (id, name, internal_identifier, description)
- `party_role` — join table (party_id, role_type_id, from_date, thru_date)

**Target — Modified Entity:**
- `Users.role` column deprecated; retained read-only during migration

**Migration:**
1. Create `role_type` table; seed with Admin, Executive, Participant
2. Create `party_role` table with FKs to party and role_type
3. Backfill: for each User, insert a party_role row matching their current enum value, from_date = created_date
4. Update application code to read/write roles via party_role
5. Drop `Users.role` column after migration verified

**What It Enables:**
- Multi-role users (Executive who is also a Participant)
- Temporal role tracking (when did they gain/lose a role?)
- New roles via data insert, not schema migration

---

## Delta 2: Engagement Participation (Priority: HIGH)

**Baseline:**
- `Engagements.participant_count` — integer, no detail
- `Engagements.organization_id` — single FK, no participant roster

**Target — New Entity:**
- `engagement_participant` — bridge table (engagement_id, party_role_id, participation_type, from_date, thru_date, status)
- participation_type: enum(participant, facilitator, sponsor, observer)
- status: enum(active, completed, dropped)

**Migration:**
1. Create `engagement_participant` table
2. For existing engagements, populate from application data (user lists, LMS enrollments, etc.)
3. `participant_count` becomes a derived value (COUNT of active participants)
4. Retain `participant_count` as cached/computed column during transition

**What It Enables:**
- "Who is in this cohort?" — answerable from the data model
- Role-based participation (facilitator vs participant vs observer)
- Temporal tracking (joined week 1, dropped week 3)
- Cohort analytics (completion rates by role, attrition tracking)

---

## Delta 3: Party Abstraction (Priority: MEDIUM)

**Baseline:**
- `Users` and `Organization` — separate entity trees
- Downstream tables use separate FK patterns (user_id vs organization_id)
- `Invitations` has sender_user_id + organization_id
- `Notifications` has recipient_user_id + recipient_email + recipient_phone

**Target — New Entity:**
- `party` — supertype (id, party_type, display_name, uuid, timestamps)

**Target — Modified Entities:**
- `Users` adds `party_id` FK (subtype of Party)
- `Organization` adds `party_id` FK (subtype of Party)

**Migration:**
1. Create `party` table
2. For each existing User: insert Party (party_type=individual), set User.party_id
3. For each existing Organization: insert Party (party_type=organization), set Organization.party_id
4. Downstream FKs migrate incrementally — new features reference party_id; existing user_id/organization_id FKs remain until refactored

**What It Enables:**
- Unified actor references ("who did this?" answered from one table)
- Foundation for all other UDM patterns (roles, contacts, relationships link to Party)
- Future extensibility (external partners, automated agents as Party subtypes)

---

## Delta 4: Contact Mechanisms (Priority: MEDIUM)

**Baseline:**
- `Users.email` — single column
- `Organization` — flat address columns (address_line1, city, state, postal_code, country)
- `Notifications` carries its own recipient_email and recipient_phone as workaround

**Target — New Entities:**
- `contact_mechanism` — supertype (id, mechanism_type)
- `email_address` — subtype (contact_mechanism_id, email)
- `phone_number` — subtype (contact_mechanism_id, phone_number)
- `postal_address` — subtype (contact_mechanism_id, street, city, state, postal_code, country)
- `contact` — links party to mechanism (party_id, contact_mechanism_id, from_date, thru_date)
- `contact_purpose` — why (contact_id, purpose_type)

**Migration:**
1. Create contact mechanism tables
2. Backfill: User.email → EmailAddress + Contact (purpose: primary)
3. Backfill: Organization address fields → PostalAddress + Contact (purpose: headquarters)
4. Existing columns retained read-only during transition
5. Notifications refactored to resolve recipient contact via Contact table

**What It Enables:**
- Multiple emails per user (work + personal)
- Multiple addresses per organization (HQ + billing + shipping)
- Contact purpose tracking (billing vs shipping vs emergency)
- Shared contact mechanisms (office phone used by multiple users)

---

## Delta 5: Status History (Priority: MEDIUM)

**Baseline:**
- `Users.status` — enum (active, inactive, invited, suspended), overwritten
- `Organization.status` — enum (active, pilot, inactive, suspended), overwritten
- `Assessment_Responses.status` — enum, overwritten
- `Engagements.current_phase` — enum, overwritten
- Audit Logs capture before/after JSON but are expensive to query

**Target — New Entities:**
- `status_type` — catalog (id, name, internal_identifier, applies_to)
- `status_application` — history (status_type_id, target_type, target_id, from_date, thru_date, applied_by)

**Migration:**
1. Create status_type table; seed with all existing enum values per entity
2. Create status_application table (polymorphic target_type + target_id)
3. Backfill: for each entity's current status, insert status_application with from_date = updated_date
4. Application code writes new StatusApplication on each transition
5. Current status = most recent application (null thru_date)
6. Existing status columns retained as cached/computed during transition

**What It Enables:**
- "When did this org move from pilot to active?" — queryable directly
- "How long was this assessment in progress?" — calculated from status history
- "Who suspended this user?" — applied_by on each transition
- Status analytics without mining audit logs

---

## Delta 6: Course-Competency Bridge (Priority: LOW)

**Baseline:**
- `LMS_Courses.competency_mappings` — described as FK array (possibly JSONB)
- `LMS_Courses.domain_mappings` — described as FK array (possibly JSONB)
- No referential integrity, no version alignment, no weight attributes

**Target — New Entity:**
- `course_competency_mapping` — bridge (course_id, competency_id, framework_version_id, weight)

**Migration:**
1. Create course_competency_mapping table
2. Parse existing competency_mappings arrays; insert one row per mapping
3. Align each mapping to the current framework_version_id
4. Drop JSONB array columns after migration verified

**What It Enables:**
- Referential integrity (deprecated competency? mapping is visible)
- Reverse lookups ("which courses address competency X?")
- Weight attributes on mappings (course A is better for competency X than course B)
- Framework version alignment (mappings evolve with the competency framework)

---

## Summary

| # | Delta | New Entities | Modified | Priority |
|---|-------|-------------|----------|----------|
| 1 | Role Normalization | 2 (role_type, party_role) | Users (deprecate column) | HIGH |
| 2 | Engagement Participation | 1 (engagement_participant) | — | HIGH |
| 3 | Party Abstraction | 1 (party) | Users, Organization (add party_id) | MEDIUM |
| 4 | Contact Mechanisms | 6 (contact_mechanism, email, phone, postal, contact, purpose) | — | MEDIUM |
| 5 | Status History | 2 (status_type, status_application) | — | MEDIUM |
| 6 | Course-Competency Bridge | 1 (course_competency_mapping) | LMS_Courses (drop arrays) | LOW |
| | **Total** | **13 new entities** | **3 modified** | |

All HIGH and MEDIUM deltas are **additive** — existing tables continue to function during migration. No breaking changes to the current 19-entity model.
