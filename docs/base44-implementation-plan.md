# NAHQ Accelerate — Base44 Implementation Plan

**Date:** March 30, 2026
**Status:** Plan — review before implementing
**Source:** Tim's Base44 exports (Executive Experience v04, Individual Experience v03)
**Approach:** Port visual design + wire to live API. Computation logic deferred until NAHQ confirms thresholds.

---

## What We've Ported (Complete)

| Source Component | Our Page | Status |
|---|---|---|
| IndividualHome.jsx | IndividualHome.tsx | Done — hero banner, radial SVG, 3-step journey |
| ExecutiveDashboard.jsx (shell) | ExecutiveDashboardV2.tsx | Done — KPI cards, domain bars, hospital filter |
| Header.jsx (pattern) | Used across all pages | Done — NAHQ logo, user menu, role-based nav |
| Login/DemoLogin | Login.tsx | Done — our own design matching Tim's patterns |

---

## Phase 1: Individual Experience Deep-Dive (No Tim dependency)

**Goal:** Port the individual assessment results and upskill plan pages so a Participant can explore their full competency profile.

### 1.1 IndividualDashboard — Assessment Results Page
**Source:** `Individual Experience v03/src/pages/IndividualDashboard.jsx`
**Dependencies to port:** KPITile, DomainRadarChart, DomainBulletChart, BellCurveChart, DomainBreakdownCard, AISummaryCard
**New npm dependency:** `recharts` (for radar chart)
**API data:** All available — `userGaps`, `userBenchmarks`, `aiGenerations`
**Backend work:** None
**Estimate:** 1 session

Key components:
- **KPITile** — small metric card (score, target, gap, percentile). Simple, reuse our KpiCard pattern.
- **DomainRadarChart** — recharts RadarChart showing 8 domains. User score vs role target overlay.
- **DomainBulletChart** — horizontal bar per domain: 3-band background (Foundational/Proficient/Advanced), user score bar + target marker.
- **BellCurveChart** — custom SVG normal distribution curve showing user's position vs peer distribution. Complex SVG math but self-contained.
- **DomainBreakdownCard** — expandable card per domain showing competency rows with progress bars and gap indicators.
- **AISummaryCard** — framer-motion card displaying the AI-generated summary. We already have AiInsightsPanel — adapt or replace.

**Route:** `/individual-dashboard` (update from current UserDashboard)

### 1.2 IndividualUpskillPlan — Learning Plan Page
**Source:** `Individual Experience v03/src/pages/IndividualUpskillPlan.jsx`
**Dependencies to port:** UpskillPlanSidebar, CourseDetailModal, KPITile
**API data:** `userCourses`, `aiUpskillPlan`, `aiGenerations`
**Backend work:** None (AI plan already generates structured course recommendations)
**Estimate:** Half session

Key components:
- **UpskillPlanSidebar** — collapsible sidebar: courses grouped by status (Completed/In Progress/Not Started), scroll-to-section navigation
- **CourseDetailModal** — modal showing course metadata, hours, CE eligibility, learning outcomes
- Plan sections map directly to our AI-generated upskill plan output

**Route:** `/upskill-plan`

### 1.3 IndividualDomainDetail — Domain Drill-Down
**Source:** `Individual Experience v03/src/pages/IndividualDomainDetail.jsx`
**Dependencies to port:** IndividualDomainExplorer, DomainBulletChart (reuse from 1.1), SeverityChip
**API data:** `userGaps` filtered by domain, `courses/similar` by competencyId
**Backend work:** None
**Estimate:** Half session

**Route:** `/domain/:domainId`

---

## Phase 2: Executive Experience Deep-Dive (Some new API endpoints)

**Goal:** Port the workforce exploration and benchmarking tools for the Executive persona.

### 2.1 StrategicSummaryBar — KPI Metrics Bar
**Source:** `Executive Experience v04/src/components/executive/StrategicSummaryBar.jsx`
**What it does:** Proficiency distribution stacked bars, staff-with-critical-gaps count, benchmarking comparison
**API data:** Partially available — need proficiency distribution endpoint
**Backend work:**
- `GET /api/organizations/{id}/proficiency-distribution` — count individuals at each proficiency level per domain
- Uses thresholds from computation-requirements.md (can use placeholder thresholds until NAHQ confirms)
**Estimate:** Half session (backend) + half session (frontend)

### 2.2 WorkforceExplorer — Tabbed Drill-Down
**Source:** `Executive Experience v04/src/components/executive/WorkforceExplorer.jsx`
**What it does:** Tabbed interface switching between role/site views with KPI cards + drill-down links
**Dependencies to port:** DistributionBar (reusable stacked bar), DomainCompetencyPanel
**API data:** Need competency-by-role and competency-by-site aggregations
**Backend work:**
- `GET /api/organizations/{id}/competency-matrix?groupBy=role` — scores aggregated by role type
- `GET /api/organizations/{id}/competency-matrix?groupBy=site` — scores aggregated by site
**Estimate:** 1 session (backend) + 1 session (frontend)

### 2.3 CompetencyHeatmap — Matrix Visualization
**Source:** `Executive Experience v04/src/components/executive/CompetencyHeatmap.jsx`
**What it does:** Site x Role matrix with color-coded performance cells
**API data:** Requires the competency-matrix endpoint from 2.2
**Backend work:** Same as 2.2 (depends on that endpoint)
**Estimate:** Half session (frontend only, after 2.2)

### 2.4 BenchmarkingCard + ReassessmentProgressCard
**Source:** `Executive Experience v04/src/components/executive/BenchmarkingCard.jsx` + `ReassessmentProgressCard.jsx`
**API data:** Available — `orgCapability`, `orgStats`
**Backend work:** None
**Estimate:** Half session

---

## Phase 3: Shared Components & Polish (No dependency)

### 3.1 FrameworkWheel — Competency Framework Visualization
**Source:** `shared/FrameworkWheel.jsx`
**What it does:** Radial visualization of 8 domains with competencies. Used in Framework exploration page.
**API data:** `competencies` endpoint (already exists)
**Backend work:** None
**Estimate:** Half session

### 3.2 FloatingChatButton + AI Chat Integration
**Source:** `shared/FloatingChatButton.jsx`, `executive/ExecutiveAIChat.jsx`
**What it does:** Floating action button that opens an AI chat panel
**Our state:** We have AI generation endpoints but no chat UI. This would be a chat-style interface calling our existing AI endpoints.
**Backend work:** None (reuse existing endpoints) or new streaming chat endpoint for better UX
**Estimate:** 1 session

### 3.3 Shared Component Library
Port Tim's reusable components that appear across multiple pages:
- **DomainCard** — summary card for a domain (icon, name, score, bar)
- **CourseCard** — course tile (title, hours, CE badge, relevance)
- **Breadcrumbs** — navigation breadcrumbs
- **ViewModeToggle** — switch between view modes
- **SeverityChip** — gap severity badge (On Target/Moderate/Critical)
**Estimate:** Half session

---

## Phase 4: Pages Requiring Significant Backend Work (Tim dependency)

These require either new API endpoints, Tim's computation confirmations, or integration with external systems.

### 4.1 Assessment Flow
**Source:** `Individual Experience v03/src/pages/Assessment.jsx`
**Blocked on:** Assessment question structure (from Qualtrics), submission flow
**Backend work:** Assessment CRUD endpoints with state machine transitions
**Estimate:** 2 sessions once unblocked

### 4.2 AssessmentTracking — Cohort Management
**Source:** Multiple files across both exports
**Blocked on:** Cohort management scope, enrollment tracking
**Backend work:** Cohort participant CRUD, enrollment status tracking
**Estimate:** 1-2 sessions once unblocked

### 4.3 ManageUsers — User Administration
**Source:** `pages/ManageUsers.jsx` in both exports
**Blocked on:** User CRUD scope, role assignment workflow
**Backend work:** User CRUD endpoints, role assignment via PartyRole
**Estimate:** 1 session once unblocked

### 4.4 Results + PDF Export
**Source:** `pages/Results.jsx`, `pages/Roadmap.jsx`
**Blocked on:** Tim's computation confirmations (score scale, thresholds)
**Backend work:** Results summary endpoint, PDF generation (jspdf + html2canvas on frontend, or server-side)
**Estimate:** 1-2 sessions once unblocked

---

## Backend Endpoints Needed (New)

| Endpoint | Phase | Blocked? |
|----------|-------|----------|
| `GET /api/organizations/{id}/proficiency-distribution` | 2.1 | Partially — placeholder thresholds OK |
| `GET /api/organizations/{id}/competency-matrix?groupBy=role` | 2.2 | No |
| `GET /api/organizations/{id}/competency-matrix?groupBy=site` | 2.2 | No |
| `GET /api/users/{id}/profile` (consolidated) | 1.1 | No |
| `POST /api/assessments` (create + state transitions) | 4.1 | Yes — Qualtrics integration |
| `GET /api/courses/{id}` (course detail) | 1.2 | No |

---

## Recommended Execution Order

**Week 1:** Phase 1 (Individual deep-dive) — highest demo value, no blockers
1. Install recharts, port DomainRadarChart + BellCurveChart
2. Build IndividualDashboard page from Tim's components
3. Port UpskillPlanSidebar + CourseDetailModal
4. Wire IndividualDomainDetail drill-down

**Week 2:** Phase 2.4 + 2.1 (Executive metrics) — build on existing executive dashboard
1. Port BenchmarkingCard + ReassessmentProgressCard (no new API)
2. Build proficiency-distribution backend endpoint
3. Port StrategicSummaryBar with live data

**Week 3:** Phase 2.2 + 2.3 (Workforce explorer) — requires new backend endpoints
1. Build competency-matrix backend endpoint
2. Port WorkforceExplorer + DistributionBar
3. Port CompetencyHeatmap

**Week 4:** Phase 3 (Shared components + polish)
1. FrameworkWheel visualization
2. FloatingChatButton + AI Chat UI
3. Shared component library cleanup

**Post-Tim-confirmation:** Phase 4 (Assessment flow, results, PDF export)

---

## Design Token Reference (from Tim's exports)

```
Primary: #00A3E0 (cyan), #FFED00 (yellow accent), #3D3D3D (charcoal)
Background: #F8F9FB (executive), white (individual)
Gradient: linear-gradient(135deg, #009FE8 0%, #414042 100%)

Domain Colors:
- Quality Leadership: #003DA5
- Process Improvement: #00B5E2
- Population Health: #8BC53F
- Health Data Analytics: #F68B1F
- Patient Safety: #ED1C24
- Regulatory: #6B4C9A
- Quality Review: #99154B
- Professional Engagement: #00A3E0
```

## Mock Data Files (for reference, not for production use)

- `Individual Experience v03/src/components/individual/individualMockData.jsx` — 8 domains, 28 competencies, scoring logic, role targets
- `Individual Experience v03/src/components/individual/upskillPlanData.jsx` — phased course plan structure
- `Executive Experience v04/src/components/shared/workforceData.jsx` — 10 users, competency matrix, role targets

These contain Tim's assumptions about scoring and thresholds. Use as UX reference but confirm computation logic via `docs/computation-requirements.md` before production.
