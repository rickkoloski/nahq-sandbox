# NAHQ Accelerate — Demo Accounts & Navigation

**Local UI:** http://localhost:5175/login
**AWS UI:** http://18.219.171.198/login
**API Docs:** http://localhost:4003/swagger-ui.html

---

## Demo Accounts

| Account | Email | Role | Home Screen |
|---------|-------|------|-------------|
| NAHQ Administrator | admin@nahq.org | Admin | Governance Portal — 5 nav cards, live platform stats |
| Sarah Chen | sarah.chen@tgh.org | Executive | Org Dashboard — KPIs, domain performance, hospital filter |
| Michael Reeves | michael.reeves@tgh.org | Executive | Org Dashboard — same as Sarah (different hospital assignment) |
| Jordan Taylor | jordan.taylor@tgh.org | Participant | Individual Home — welcome, hero banner, 3-step journey |

## Navigation by Role

### Admin (admin@nahq.org)
- **/** — Governance Portal home (live counts: orgs, users, courses, domains)
- **Top nav: Org Dashboard** — Executive dashboard for Tampa General health system
- **Top nav: User View** — Individual dashboard
- **Overflow menu (⋮)** — Original scaffold dashboard

### Executive (sarah.chen@tgh.org, michael.reeves@tgh.org)
- **/** — Organizational Dashboard (Tampa General Hospital system)
  - 4 KPI cards (completion, org score, benchmark gap, last assessment)
  - Hospital filter dropdown (3 subsidiary sites via Party model)
  - Domain performance bars (8 domains vs national average)
  - AI Insights button → command palette → freeform or prefab analysis
- **Overflow menu (⋮)** — Original scaffold dashboard

### Participant (jordan.taylor@tgh.org)
- **/** — Individual Home (Tim's ported design)
  - Time-of-day greeting
  - Hero banner with radial SVG framework visualization
  - 3-step journey cards (Explore → Assess → Results)
- **Step cards** → Individual Dashboard
  - KPIs (overall score, growth priorities, national average)
  - Bell curve (peer comparison, interactive tooltips)
  - Domain radar chart (recharts, score vs target overlay)
  - Domain breakdown cards (clickable → domain detail)
  - Upskill plan sidebar (→ full upskill plan page)
  - AI Insights button → assessment summary, upskill plan, freeform
- **Domain card click** → Domain Detail
  - Domain KPIs, competency bullet chart rows, competency cards with circular gauges
- **"Go To Your Upskill Plan"** → Upskill Plan
  - Courses grouped by status, format badges, relevance scores, CE eligibility

## Seeding Process (run after DB reset or fresh deploy)

The full seed process is 5 steps. Run in order:

```bash
# 1. Generate synthetic data (100 users, 3 health systems, assessments on 0-3 scale)
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/seed/generate?userCount=100"

# 2. Seed LMS courses (39 courses, 88 competency mappings)
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/courses/seed"

# 3. Refresh materialized views (benchmarks, org summaries)
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/analytics/refresh"

# 4. Redistribute TGH employees across 3 subsidiary hospital sites
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/seed/redistribute-sites"

# 5. Fix Michael Reeves role to executive (seed creates as participant, needs correction)
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/seed/fix-demo-roles"
```

**Note:** Step 4 (`redistribute-sites`) currently hardcodes org_id=1. After a truncate+reseed where IDs shift, redistribute must be done via SQL instead. See `docs/current_work/tim-feedback-corrections-2026-03-31.md` for the SQL pattern.

**Note:** The admin account is created by V6 migration, not the seed. If you truncate the party table, the admin must be recreated via SQL:
```sql
INSERT INTO party (party_type, display_name) VALUES ('INDIVIDUAL', 'NAHQ Administrator');
INSERT INTO individual (party_id, first_name, last_name) VALUES (currval('party_id_seq'), 'NAHQ', 'Administrator');
INSERT INTO app_user (email, party_id, status) VALUES ('admin@nahq.org', currval('party_id_seq'), 'ACTIVE');
INSERT INTO party_role (party_id, role_type_id, from_date)
  SELECT currval('party_id_seq'), id, '2025-01-01' FROM role_type WHERE internal_id = 'admin';
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
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/users/105/gaps
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/users/105/benchmarks
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/21/capability-summary
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/21/stats
curl -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/21/sites
curl -H "X-Api-Key: nahq-sandbox-2026" "http://localhost:4003/api/organizations/21/competency-matrix?groupBy=site"
curl -H "X-Api-Key: nahq-sandbox-2026" "http://localhost:4003/api/organizations/21/competency-matrix?groupBy=role"

# AI generation (requires ANTHROPIC_API_KEY on server)
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/individual-summary/105
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/upskill-plan/105
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/org-insights/21

# Freeform AI (structured context injection)
curl -H "X-Api-Key: nahq-sandbox-2026" -X POST -H "Content-Type: application/json" \
  -d '{"prompt":"What are my biggest gaps?","userId":105}' \
  http://localhost:4003/api/ai/ask

# As a specific user (X-User-Id header, RBAC enforced)
curl -H "X-User-Id: 105" http://localhost:4003/api/users/105/gaps
```

**Note:** User and org IDs depend on seed order. After a fresh seed, check IDs:
```bash
curl -s -X POST -H "Content-Type: application/json" -d '{"email":"sarah.chen@tgh.org"}' http://localhost:4003/api/auth/login
```
