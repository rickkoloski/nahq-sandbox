# Tim's Q&A Responses — Analysis & Action Items

**Date:** April 2, 2026
**Source:** Response to Distilled Questions.docx (PM file #742)
**Status:** Reviewed — data files read and analyzed

---

## Files Tim Referenced (all found in PM)

| File | PM ID | Location | Status |
|------|-------|----------|--------|
| Role Group Target Asset File.xlsx | #738 | /NAHQ/Sprint Plan - Draft/ | **Found** — authoritative role target dataset |
| Lifepoint Upskilling Plan Input (2).xlsx | #740 | /NAHQ/Sprint Plan - Draft/ | **Found** — curated competency-to-course mappings |
| Discussion Guide v5_FINAL_11.2025.docx | #739 | /NAHQ/Sprint Plan - Draft/ | **Found** — WFA Discussion Guide, framework reference |
| Accelerate MVP Expansion - Assess Only and Patient Safety.docx | #741 | /NAHQ/ | **Found** — product type requirements (pending change order) |
| NAHQ logo SVG | — | — | **Not yet delivered** — Tim says available, pending upload |
| National Average dataset | — | — | **Not yet delivered** — NAHQ will provide as spreadsheet |
| Skill statements (~600+) | — | — | **Not available for MVP** — not yet packaged as engineering asset |

---

## Question-by-Question Analysis

### Q1. Competency Count (29 → 28) — RESOLVED
**Tim says:** 28 competencies across 8 domains. Our 29th is an ingestion artifact.
**Tim provided:** Domain → Competency structure table (in the response doc, but table may have been lost in docx extraction). Also: #668 "2025 NAHQ Competency Framework Sheet.pdf" is the authoritative source.
**Action:** Read #668 to get exact 8×N mapping. Identify and remove the extra competency from our V2 seed.

### Q2. Classification Thresholds — RESOLVED (with important nuance)
**Tim says:** At competency level, responses are **categorical** (participant selects F/P/A directly — not derived from numeric breakpoints). Numeric 0-3 scores apply when **averaging within a domain**, mapped back to interpretation bands.
**Tim provided:** Threshold table was in the doc but likely lost in text extraction (tables don't survive docx→text well).
**Action:** Read the original docx more carefully for the domain-level interpretation band values. Check if the Discussion Guide (#739) has them. This changes our understanding — individual competency scores are 0, 1, 2, or 3 (whole numbers), not continuous decimals.
**Impact on our system:** Our seed generates continuous scores (e.g., 1.48, 2.74). For production, individual competency scores should be integers 0-3. Domain averages can be decimals.

### Q3. Role Target Standard — RESOLVED
**Tim says:** Role Group → Job Level → Competency → Target Level. Targets represent expected levels of work, not performance expectations. Gap = participant_score - role_target. Versioned configuration.
**Tim provided:** **Role Group Target Asset File.xlsx (#738)** — the authoritative dataset.
**Action:** Read #738, ingest into our RoleTarget table. This replaces our placeholder targets.

### Q4. Logo — PENDING
**Tim says:** SVGs available, will be provided.
**Action:** Wait for delivery. Current original-color PNG is fine for now.

### Q5. National Average — PENDING
**Tim says:** NAHQ will provide as structured spreadsheet. Competency-level and domain-level. Versioned configuration.
**Action:** Wait for delivery. Synthetic values fine for development. Terminology confirmed: "National Average."

### Q6. Course Mappings — RESOLVED
**Tim says:** Curated mappings already exist. Competency → Recommended Learning Assets. Configuration-driven, NOT semantic matching.
**Tim provided:** **Lifepoint Upskilling Plan Input (2).xlsx (#740)** — reference dataset.
**Action:** Read #740, understand the mapping structure. For production, this replaces our pgvector semantic matching with explicit curated mappings.

### Q7. Skill Statements — DEFERRED
**Tim says:** Full ~600+ library not available for MVP. Not yet packaged as engineering asset. Discussion Guide confirms structure. Placeholder/curated guidance appropriate.
**Tim provided:** Discussion Guide v5 (#739) as structural reference.
**Action:** Our placeholder on CompetencyDetail page is correct. Read #739 for any partial statement data we could use.

### Q8. Cohorts — CONFIRMED
**Tim says:** Assignment and reporting groupings, not org hierarchy. Deploy assessments, track participation, segment reporting. Associated with assessment cycle for point-in-time snapshots preserving role targets, national average, and framework version.
**Action:** Our Cohort table exists but isn't wired. Model is correct. Wire when engagement workflow is built.

### Q9. Product Types — PARTIALLY CONFIRMED
**Tim says:** Three types planned, but Patient Safety and Assess Only are **pending NAHQ change order**. Accelerate MVP is the confirmed baseline. All types share same framework/scoring/reporting engine. Product type controls experience access and entitlement only.
**Tim provided:** #741 "Accelerate MVP Expansion" — requirements for the pending product types.
**Action:** Focus on Accelerate MVP product type only. Read #741 for future reference but don't implement Patient Safety or Assess Only until change order confirmed.

### Q10. Assessment Integration — CLARIFIED
**Tim says:** Near real-time availability after assessment completion. Not live Nimble dependency on every login. Separate login/session from post-assessment result availability.
**Action:** Aligns with Qualtrics webhook pattern from our integration research. Implementation should assume fast post-assessment availability. Exact mechanism still needs NAHQ/MB confirmation.

---

## Immediate Actions (priority order)

1. ~~**Read #738 (Role Group Target Asset)**~~ — **DONE** (see findings below)
2. ~~**Read #740 (Lifepoint Upskilling Plan Input)**~~ — **DONE** (see findings below)
3. ~~**Read #668 (2025 Competency Framework Sheet)**~~ — **DONE** (see findings below)
4. **Read #739 (Discussion Guide v5)** — check for threshold table and any skill statement data
5. **Fix competency count** — remove extra competency from seed
6. **Update seed scoring** — individual competency scores should be integers (0, 1, 2, 3), not continuous decimals
7. **Ingest Role Group Target Asset** — replace placeholder targets with real 1,512-row dataset
8. **Ingest Course Crosswalk** — replace pgvector semantic matching with curated 26-course catalog
9. **Clarify 28 vs 29 competency discrepancy** — ask Tim which one was dropped

## Files to Read Later (not blocking)

- **#741** — Assess Only and Patient Safety requirements (pending change order)
- **#687** — Skills Tooltips_Updated.xlsx (may contain partial skill statement data)
- **#688** — Survey Question Mapping_2025.xlsx (Qualtrics question → competency mapping)

---

## Data File Analysis (April 2, 2026)

### File #738: Role Group Target Asset

**Structure:** 1,512 rows = 28 competencies × 6 role groups × 9 job levels. Complete matrix.

**Columns:** Domain | Competency | Role Group | Job Level | Role Group Target

**Role Groups (6):**
1. Core Quality & Safety Workforce
2. Clinical Quality & Safety Bridge
3. Senior Leadership & Governance
4. Frontline Care Delivery
5. Diagnostic, Therapeutic & Interventional Clinical Support
6. Ancillary & Operational Support

**Job Levels (9):**
1. C-Level/System Executive
2. Vice President
3. Director/Executive Director
4. Manager/Supervisor
5. Specialist/Analyst
6. Coordinator
7. Consultant/Advisor
8. Clinical Staff
9. Support Staff

**Target values:** 0, 1, 2, 3 (integers, matching NAHQ's 0-3 scale)

**Competencies per domain:**
| Domain | Count |
|--------|-------|
| Quality Leadership and Integration | 5 |
| Health Data Analytics | 4 |
| Patient Safety | 4 |
| Performance and Process Improvement | 3 |
| Population Health and Care Transitions | 3 |
| Professional Engagement | 3 |
| Quality Review and Accountability | 3 |
| Regulatory and Accreditation | 3 |
| **Total** | **28** |

**Impact on our system:**
- Our seed has 29 competencies with a different per-domain distribution
- Our RoleTarget table has only 2 role types × 29 competencies. This dataset has 6 role groups × 9 job levels × 28 competencies
- RoleTarget model needs expansion: `role_type_id` → `role_group` + `job_level` (or a composite RoleGroup entity)
- Domain model Appendix candidate: RoleGroup/JobLevel as a governed reference table

### File #740: Lifepoint Upskilling Plan Input

**Three sheets:**

**Sheet 1: "Plans" (2,380 rows)** — Real upskilling plans for 82 Lifepoint participants
- Columns: Name, Title, Role, Domain, Competency Statement, Current Level, Adjudicated Results, Target Level, Difference, Upskilling Strategy, Upskilling Assignment, Targeted Completion Date
- Current Level and Target Level are integers (1, 2, 3) — confirms categorical scoring
- Upskilling Strategy: "Education" or "No upskilling required"
- Upskilling Assignment: specific course codes (e.g., "PS2: HQ Collections - Lessons 4-6")
- "Adjudicated Results" column — this suggests there's a review/adjustment step after raw scoring

**Sheet 2: "Quality Course Crosswalk" (1,000 rows)** — Curated course-to-competency mappings
- Columns: Course Name, Sponsoring Org, Domain, Competency, Level, Count
- 26 unique courses from 2 sponsors (NAHQ, AHRQ)
- Level values: F (Foundational), F/P (Foundational/Proficient), P, NA
- This is the authoritative replacement for our pgvector semantic matching

**Courses (26):**
- NAHQ courses: HQ Concepts, HQ Principles, HQ Solutions (Sections 1-7), HQ Collections (by domain: HDA, PE, PHCT, PPI, PS, QLI, QRA, RA), CPHQ Review Course
- AHRQ courses: Quality Improvement, Quality and Patient Safety, Team STEPPS, Unity Based Safety, Behavioral Health and Primary Care

**Sheet 3: "List" (33 rows)** — Quick reference: Domain → Competency → Default course assignment code

**Impact on our system:**
- Replace LmsCourse seed with these 26 real courses
- Replace pgvector semantic matching with explicit course_competency_mapping from the crosswalk
- The "Adjudicated Results" concept suggests scoring may not be purely self-reported — needs clarification
- Upskilling plan generation becomes: find gaps → look up course crosswalk → assign courses. Deterministic, not AI-generated.

### File #668: 2025 NAHQ Competency Framework Sheet (PDF)

**Published framework says: 8 domains, 29 competencies, 486 skill statements.**

This contradicts Tim's Q&A answer of 28 and the Role Group Target Asset which has exactly 28.

**Competencies listed in PDF (29):**

*Professional Engagement (3):*
1. Integrate ethical standards into healthcare quality practice
2. Engage in lifelong learning as a healthcare quality professional
3. Participate in activities that advance the healthcare quality profession

*Quality Leadership and Integration (5):*
4. Direct the quality infrastructure to achieve organizational objectives
5. Apply procedures to regulate the use of privileged or confidential information
6. Implement processes to promote stakeholder engagement and interprofessional teamwork
7. Create learning opportunities to advance healthcare quality throughout the organization
8. Communicate effectively with different audiences to achieve quality goals

*Performance and Process Improvement (3):*
9. Implement standard performance and process improvement (PPI) methods
10. Apply project management methods
11. Use change management principles and tools

*Population Health and Care Transitions (3):*
12. Integrate population health management strategies into quality work
13. Apply a holistic approach to improvement
14. Collaborate with stakeholders to improve care processes and transitions

*Health Data Analytics (5):*
15. Apply procedures for the governance of data assets
16. Design data collection plans for key metrics and performance indicators
17. Acquire data from source systems
18. Integrate data from internal and external electronic data systems
19. Use statistical and visualization methods

*Patient Safety (4):*
20. Assess the organization's patient safety culture
21. Apply safety science principles and methods in healthcare quality work
22. Use organizational procedures to identify and report patient safety risks and events
23. Collaborate with stakeholders to analyze patient safety risks and events

*Regulatory and Accreditation (3):*
24. Operationalize processes to support compliance with regulations and standards
25. Facilitate continuous survey readiness activities
26. Guide the organization through survey processes and findings

*Quality Review and Accountability (3):*
27. Relate current and emerging payment models to healthcare quality work
28. Conduct the activities to execute measure requirements
29. Implement processes to facilitate practitioner performance review activities

**PDF total: 29 (3+5+3+3+5+4+3+3)**
**Role Target Asset total: 28 (3+5+3+3+4+4+3+3)**

**Discrepancy:** Health Data Analytics has 5 in the PDF but 4 in the Role Target Asset. One HDA competency was likely consolidated. Need Tim to confirm which. The Role Target Asset competency names are slightly different (more operational wording) — Tim may have updated them for the Accelerate context.

### 28 vs 29 — Specific Discrepancy

Comparing the two lists for Health Data Analytics:

**PDF (5):**
1. Apply procedures for the governance of data assets
2. Design data collection plans for key metrics and performance indicators
3. Acquire data from source systems
4. Integrate data from internal and external electronic data systems
5. Use statistical and visualization methods

**Role Target Asset (4):**
1. Apply procedures for the management of data and systems.
2. Design data collection and data analysis plans...
3. Integrate data from internal and external source systems...
4. Use statistical and visualization methods...

It appears "Acquire data from source systems" (#3 in PDF) was merged into either #1 or #3 in the operational version, and "Apply procedures for the governance of data assets" was reworded to "Apply procedures for the management of data and systems."

**Recommendation:** Use the Role Target Asset's 28 competencies as authoritative for engineering. The published PDF is the public-facing framework; the operational version (28) is what drives scoring and targets. Ask Tim to confirm.
