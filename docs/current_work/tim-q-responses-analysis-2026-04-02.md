# Tim's Q&A Responses — Analysis & Action Items

**Date:** April 2, 2026
**Source:** Response to Distilled Questions.docx (PM file #742)
**Status:** Reviewed — action items identified

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

1. **Read #738 (Role Group Target Asset)** — ingest real role targets
2. **Read #740 (Lifepoint Upskilling Plan Input)** — understand course mapping structure
3. **Read #668 (2025 Competency Framework Sheet)** — get exact 28-competency list, identify our extra one
4. **Read #739 (Discussion Guide v5)** — check for threshold table and any skill statement data
5. **Fix competency count** — remove extra competency from seed
6. **Update seed scoring** — individual competency scores should be integers (0, 1, 2, 3), not continuous decimals

## Files to Read Later (not blocking)

- **#741** — Assess Only and Patient Safety requirements (pending change order)
- **#687** — Skills Tooltips_Updated.xlsx (may contain partial skill statement data)
- **#688** — Survey Question Mapping_2025.xlsx (Qualtrics question → competency mapping)
