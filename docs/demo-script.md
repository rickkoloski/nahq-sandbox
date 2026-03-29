# NAHQ Accelerate Sandbox — Demo Script

**Audience:** Tim VanderMolen, NAHQ stakeholders
**Prerequisites:** API running on port 4003, UI running on port 5175
**Duration:** ~15 minutes

---

## Setup (do once before demo)

```bash
# Seed users, assessments, courses, refresh analytics
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/seed/generate?userCount=100"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/courses/seed"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://localhost:4003/api/analytics/refresh"
```

This creates 3 healthcare organizations, 100 users with role assignments, 2,900 assessment results across 29 competencies, and 39 courses with competency mappings.

---

## Part 1: The Competency Framework (2 min)

**Open:** http://localhost:5175

**Talking points:**
- This is the Admin Governance Portal — same layout and navigation Tim prototyped in Base44
- NAHQ branding, design tokens, card-based navigation — all preserved from the prototype
- 5 functional areas: Client Management, Benchmarks, Learning Governance, Access, Platform Admins

**API proof:**
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/competencies | python3 -m json.tool | head -20
```
→ 8 domains, 29 competencies, seeded from NAHQ's Healthcare Quality Competency Framework

---

## Part 2: Executive Dashboard — Org Capability (3 min)

**Open:** http://localhost:5175/executive-dashboard?orgId=1

**Talking points:**
- Tampa General Hospital — 34 participants assessed
- 4 KPI cards: completion rate, org score, benchmark gap, last assessment date
- All data is LIVE from PostgreSQL — not mockups, not static

**Expand "Organizational Assessment Results":**
- 8 domains with org avg vs national avg
- Color-coded domain indicators
- Each bar shows relative performance

**Key question to ask:** "How long did this query take?"
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/1/capability-summary | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{d[\"organizationName\"]}: {d[\"queryTimeMs\"]}ms')"
```
→ Answer: 1-7ms. This is PostgreSQL materialized views. MB proposed Snowflake for this ($150-300/mo).

**Compare all 3 orgs:**
```bash
for id in 1 2 3; do curl -s -H "X-Api-Key: nahq-sandbox-2026" http://localhost:4003/api/organizations/$id/capability-summary | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{d[\"organizationName\"]:30s} avg={d[\"overallOrgAvg\"]} vs national={d[\"overallNationalAvg\"]} ({d[\"queryTimeMs\"]}ms)')"; done
```

---

## Part 3: Individual Dashboard — Gap Analysis (3 min)

**Open:** http://localhost:5175/user-dashboard?userId=2

**Talking points:**
- Michael Smith, Participant role
- Overall score 3.01 vs target 3.28 (gap: -0.27)
- Left panel: Priority Development Areas ranked by gap size
- Right panel: National Benchmark Comparison with percentile labels

**The key thesis:** This gap analysis is DETERMINISTIC. It's `score - target = gap`, sorted. Not an LLM guessing from retrieved chunks. Auditable, precise, instant.

**Try different users:**
- http://localhost:5175/user-dashboard?userId=1 (Sarah Smith — Executive, higher targets)
- http://localhost:5175/user-dashboard?userId=5 (different score profile)
- http://localhost:5175/user-dashboard?userId=10

**Scroll down** to see Recommended Courses — gap-targeted, with CE eligibility and relevance scores.

---

## Part 4: Vector Search — pgvector (2 min)

**Talking points:**
- Same PostgreSQL instance handles OLTP, analytics, AND vector search
- MB proposed Milvus (a dedicated billion-scale vector DB) for this
- Claimed "AWS doesn't support pgvector" — AWS has supported it since May 2023

```bash
# Find courses for Patient Safety competency (hybrid: relational + vector similarity)
curl -s -H "X-Api-Key: nahq-sandbox-2026" "http://localhost:4003/api/courses/similar?competencyId=17&limit=8" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(f'Competency: {d[\"competencyName\"]} — {d[\"queryTimeMs\"]}ms')
for c in d['courses']:
    print(f'  [{c[\"matchType\"]:15s}] {c[\"relevanceScore\"]:5.3f}  {c[\"title\"]}')
"
```
→ Two types of results: `mapped` (relational join) and `vector_similar` (cosine distance). Single SQL query. Same database.

---

## Part 5: AI Layer — Structured Context Injection (3 min)

**This is the most important architectural distinction.**

**Talking points:**
- MB proposed a full RAG pipeline (data ingestion → chunking → embedding → vector storage → retrieval → LLM)
- Our approach: the domain model already has all the intelligence. Package it as structured context, let the LLM write prose.

```bash
# Generate a personalized assessment summary
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/individual-summary/2 | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(f'Mode: {d[\"mode\"]} | Model: {d[\"model\"]}')
print(f'Tokens: {d.get(\"inputTokens\",0)} in / {d.get(\"outputTokens\",0)} out | {d.get(\"latencyMs\",0)}ms')
print()
print(d.get('response', d.get('structuredContext', '')))
"
```

**Then show what the LLM received:**
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/individual-summary/2 | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('=== STRUCTURED CONTEXT (what Claude received) ===')
print(d['structuredContext'][:1500])
"
```

→ The LLM gets a complete, deterministic data package — gaps ranked, benchmarks compared, courses matched. It doesn't need to FIND anything. It just needs to WRITE about what we already know.

**Generate an upskill plan:**
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/upskill-plan/2 | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('response', d.get('structuredContext', '')))
"
```

**Generate org-level strategic insights:**
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST http://localhost:4003/api/ai/org-insights/1 | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('response', d.get('structuredContext', '')))
"
```

---

## Part 6: Security & RBAC (2 min)

**Talking points:**
- MB uses a single enum column for roles (Admin, Executive, Participant). One role per user, no history.
- Our model: temporal multi-role from `user_role` join table. A user can hold multiple roles, each with date range.
- RBAC enforced on every endpoint.

```bash
# No auth → 403
curl -s -o /dev/null -w "No auth: %{http_code}\n" http://localhost:4003/api/competencies

# Participant can view own gaps but can't seed data
curl -s -o /dev/null -w "Participant gaps: %{http_code}\n" -H "X-User-Id: 2" http://localhost:4003/api/users/2/gaps
curl -s -o /dev/null -w "Participant seed: %{http_code}\n" -H "X-User-Id: 2" -X POST "http://localhost:4003/api/seed/generate?userCount=1"

# Executive can view org insights but participant can't
curl -s -o /dev/null -w "Executive insights: %{http_code}\n" -H "X-User-Id: 1" -X POST http://localhost:4003/api/ai/org-insights/1
curl -s -o /dev/null -w "Participant insights: %{http_code}\n" -H "X-User-Id: 2" -X POST http://localhost:4003/api/ai/org-insights/1
```

---

## Closing: The Numbers (1 min)

| | MB Proposal | This Sandbox |
|---|---|---|
| Monthly infra cost | $1,150-2,500+ | ~$70 (est. AWS) |
| Services to manage | 6+ (DB, Snowflake, Milvus, Temporal, Auth0, app) | 2 (DB, app) |
| Benchmark query time | Unknown (Snowflake cold start) | 1-7ms |
| Gap analysis | RAG-generated (probabilistic) | Deterministic (auditable) |
| Cloud portability | AWS-locked | Portable (AWS, Azure, GCP) |
| Tim's prototype | Discarded | Preserved |

**Swagger UI:** http://localhost:4003/swagger-ui.html — all 14 endpoints documented and testable.

**Everything you just saw runs on one PostgreSQL instance and one Spring Boot app.**
