# NAHQ Accelerate — Demo Accounts & Navigation

**UI:** http://localhost:5175/login
**API:** http://localhost:4003/swagger-ui.html

---

## Demo Accounts

| Account | Email | Role | Home Screen |
|---------|-------|------|-------------|
| NAHQ Administrator | admin@nahq.org | Admin | Governance Portal — 5 nav cards, live platform stats |
| Sarah Chen | sarah.chen@tgh.org | Executive | Org Dashboard — KPIs, domain performance, hospital filter |
| Michael Reeves | michael.reeves@tgh.org | Participant | Individual Home — welcome, hero banner, 3-step journey |

## Navigation by Role

### Admin (admin@nahq.org)
- **/** — Governance Portal home (live counts: orgs, users, courses, domains)
- **Top nav: Org Dashboard** — Executive dashboard for Tampa General (orgId=1)
- **Top nav: User View** — Individual dashboard (userId=2)

### Executive (sarah.chen@tgh.org)
- **/** — Organizational Dashboard (Tampa General Hospital)
  - 4 KPI cards (completion, org score, benchmark gap, last assessment)
  - Hospital filter dropdown (3 subsidiary sites via Party relationship)
  - Domain performance bars (8 domains vs national average)
- **My View** button — switches to Individual Home

### Participant (michael.reeves@tgh.org)
- **/** — Individual Home (Tim's ported design)
  - Time-of-day greeting
  - Hero banner with radial SVG framework visualization
  - 3-step journey cards (Explore → Assess → Results)
- **Any step card** — navigates to User Dashboard
  - Gap analysis (29 competencies, ranked by deficit)
  - National benchmark comparison (percentile labels)
  - Recommended courses (CE eligibility, relevance scores)

## Seeding (run once after DB reset)

```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/seed/generate?userCount=100"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/courses/seed"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/analytics/refresh"
```

## Starting Servers

```bash
# API (tmux nahq pane 3)
cd accelerate-api
ANTHROPIC_API_KEY=... ./gradlew bootRun

# UI (tmux nahq pane 2)
cd accelerate-ui
pnpm dev
```

## API Endpoints (curl examples)

```bash
# With admin key
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/competencies
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/users/5/gaps
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/users/5/benchmarks
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/1/capability-summary
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/1/stats
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/1/sites
curl -H "X-Api-Key: nahq-sandbox-2026" "http://localhost:4003/api/courses/similar?competencyId=17&limit=5"

# AI generation (requires ANTHROPIC_API_KEY on server)
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/individual-summary/5
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/upskill-plan/5
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/org-insights/1

# As a specific user (RBAC enforced)
curl -H "X-User-Id: 5" http://localhost:4003/api/users/5/gaps
```
