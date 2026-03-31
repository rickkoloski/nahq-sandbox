# Tim Feedback Corrections — March 31, 2026

**Source docs:** NAHQ Framework & Professional Assessment.docx (#726), Questions Answered - Rick.xlsx (#724)
**Status:** In progress — score scale + terminology done, local verified, deploy pending

---

## Immediate Corrections (sandbox alignment with Tim's spec)

### 1. Fix score scale: 1-5 → 0-3
- [x] **Backend seed**: `SyntheticDataService.java` — change score generation to 0-3 range
- [x] **Backend seed**: Demo account baselines — adjust from ~3.x to 0-3 range
- [x] **Backend seed**: Role target values — V12 migration adjusts to 0-3 scale
- [x] **Materialized views**: Refreshed after reseed
- [x] **Frontend IndividualDashboard**: Remove dynamic scale detection (hardcode 0-3)
- [x] **Frontend DomainBreakdownCard**: Remove scaleMax prop, hardcode 0-3
- [x] **Frontend BellCurveChart**: Revert to fixed 0-3 scale (Tim's original)
- [x] **Frontend ExecutiveDashboardV2**: Domain bars /5 → /3, level thresholds adjusted
- [x] **Verify**: Sarah scores 2.11/3.0, range 1.48-2.74 — correct 0-3 scale
- [ ] **Verify**: Login as michael.reeves, confirm executive dashboard shows 0-3 (needs browser check)

### 2. Terminology: "National Benchmark" → "National Average"
- [x] **Frontend IndividualDashboard**: KPI card, bell curve section, tooltips
- [x] **Frontend ExecutiveDashboardV2**: KPI subtitle "vs National Average"
- [x] **Frontend BellCurveChart**: peerLabel default, legend, SR text
- [x] **Frontend DomainBreakdownCard**: Legend label
- [ ] **Backend**: API field names kept as-is (BenchmarkService does benchmarking; data is "national average")

### 3. Competency count: 29 → 28
- [ ] Deferred — requires identifying which competency to remove. Not critical for demo.
- [ ] Note: Tim's doc says 28, our V2 seed has 29. Low priority.

### 4. Framework alignment (non-blocking, documented for future)
- [ ] Assessment Cycles preserve framework version + targets + national avg (temporal snapshots)
- [ ] Cohort entity needed (deployment grouping within a cycle)
- [ ] Product Types (Individual PA vs Workforce Accelerator) control reporting depth
- [ ] MVP upskilling uses NAHQ's existing competency-to-course mappings
- [ ] National Average values will be NAHQ-provided in production

### 5. Auth decisions (non-blocking, documented for future)
- [ ] Nimble Community Hub is current auth surface — validate sandbox API access
- [ ] No Auth0 / SSO / federation for MVP
- [ ] NAHQ admins provision users (no hospital-level admin)
- [ ] No HIPAA/BAA — assessment results are not PHI
- [ ] Deactivated users retain data for reporting

---

## Reseed issues encountered
- TRUNCATE CASCADE resets all data including admin account and org IDs
- redistribute-sites endpoint hardcodes org_id=1 — needs parameterization
- Seed endpoint not idempotent (duplicate key on re-run) — noted as tech debt
- After reseed: admin recreated via SQL, redistribute done via SQL
- **Action**: fix redistribute-sites to accept orgId param; make seed idempotent

## After corrections
- [x] Reseed local database (0-3 scale)
- [x] Redistribute sites (via SQL, 12 per site)
- [x] Fix demo roles (Michael → executive)
- [x] Recreate admin account
- [x] Verify scores via API (0-3 confirmed)
- [ ] Verify both dashboards in browser
- [ ] Commit
- [ ] Deploy to AWS
- [ ] Reseed AWS database
- [ ] Verify live at http://18.219.171.198
