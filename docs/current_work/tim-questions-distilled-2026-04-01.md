# What We Need from Tim — Distilled Questions

**Date:** April 1, 2026
**Context:** Tim provided two documents on March 31: the NAHQ Framework & Professional Assessment spec and answers to 15 auth questions. Many of the open items from our computation-requirements.md are now resolved. Below is what remains.

---

## Already Resolved (from Tim's March 31 docs)

| Item | Resolution | Source |
|------|-----------|--------|
| Score scale | **0-3** (0=Not Performing, 1=Foundational, 2=Proficient, 3=Advanced) | Framework doc §4 |
| Classification levels | Three: Foundational, Proficient, Advanced | Framework doc §4 |
| Terminology | "National Average" (not "National Benchmark") | Framework doc §6 |
| Scoring unit | Competency level (not skill-statement level) | Framework doc §2 |
| Assessment type | Self-assessment measuring type and level of work performed (not knowledge test) | Framework doc §3 |
| National Average source | NAHQ-provided for MVP, rolling multi-year window | Framework doc §6 |
| Role Target Standard | New governed construct: {Role Group, Role Level, Competency, Target Level} | Framework doc §5 |
| Auth approach | Nimble Community Hub for MVP, no Auth0/SSO needed | Q&A #1-5 |
| User provisioning | NAHQ admins for MVP | Q&A #7 |
| HIPAA/PHI | No PHI, no BAA required | Q&A #14 |
| Data residency | No requirements | Q&A #15 |
| Competency count | **28** (Tim's doc says 28; our seed has 29) | Framework doc §1 |

## Still Needed from Tim

### Priority 1: Blocking further development

**Q1. Which competency do we remove to get from 29 to 28?**
Our seed migration (V2) creates 29 competencies across 8 domains. Tim's framework doc says 28. We need to know which one to drop or if our domain/competency mapping is wrong.
- *Why it matters:* Every score, gap, and benchmark calculation uses the competency list. Wrong count means wrong averages.

**Q2. Classification thresholds on the 0-3 scale**
Tim's doc confirms three levels but doesn't specify the numeric breakpoints. Our current assumptions:
- Foundational: 0 - 1.0
- Proficient: 1.0 - 2.0
- Advanced: 2.0 - 3.0

Are these correct? Or are the boundaries at different points (e.g., <1.5 / 1.5-2.5 / >2.5)?
- *Why it matters:* Drives level badges on every dashboard, distribution charts, gap severity coloring.

**Q3. Role Target Standard — initial dataset**
Tim's doc describes this as a new governed construct being formalized in Accelerate. We need the actual target values to seed:
- Which role groups exist? (e.g., Quality Leader, Quality Specialist, Clinical Bridge)
- What level (F/P/A or numeric) is expected per competency per role?
- *Why it matters:* Gap analysis compares user scores to role targets. Without real targets, we're using placeholders.

**Q4. NAHQ logo assets**
We need SVG or transparent PNG versions of the NAHQ logo for use on gradient backgrounds and in the app header. The current PNG has a white background that shows as a white rectangle on colored surfaces.

### Priority 2: Needed before production, not blocking demo

**Q5. National Average dataset**
Tim's doc says NAHQ will provide these values directly for MVP. Do we have a timeline? Format (spreadsheet, API, CSV)? We're currently calculating from synthetic data.
- *Needed at:* domain level and competency level

**Q6. Competency-to-course mappings**
Tim's doc says MVP upskilling uses NAHQ's existing mappings. Can Tim share the mapping data? Currently we're using pgvector semantic matching which is approximate.
- *Format:* competency_id → course_id (or equivalent identifiers)

**Q7. Skill statements for behavioral expectations**
Tim's doc mentions 600+ skill statements stratified across F/P/A levels. These drive the "What This Means in Practice" section on our CompetencyDetail page (currently showing a placeholder). When can we expect this data?
- *Note:* Tim's doc says skill statements are not publicly distributed but drive how competency levels are defined internally.

### Priority 3: Architectural decisions (can discuss at next session)

**Q8. Cohort structure for assessment cycles**
Tim's doc describes cohorts as deployment groupings within an assessment cycle. We need to understand:
- How are cohorts created? (NAHQ admin, Navigator, automated?)
- What attributes does a cohort have beyond name + membership?
- Do reporting views filter by cohort?

**Q9. Product type differentiation**
Tim's doc describes Individual PA vs Workforce Accelerator as product types that control reporting depth. For MVP:
- Are we building for one product type or both?
- What differs in the UI/reporting between them?

**Q10. Nimble API integration approach**
Tim's Q&A says sandbox credentials exist but integration method is TBD. What's the priority? Options:
- Real-time query (Nimble API on each login)
- Batch sync (scheduled import)
- Manual import (CSV upload for MVP)

---

## Not Questions — Internal Tech Debt

These are our problems to solve, not Tim's:
- Seed not idempotent (duplicate key on re-run)
- redistribute-sites endpoint parameterization (done)
- Admin account recreation after truncate (documented workaround)
- Session resilience on 401/403 (done)
