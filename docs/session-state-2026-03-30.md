# NAHQ Session State — March 30, 2026 (evening)

**Purpose:** Context preservation in case of session refresh during AWS deployment.

---

## What's Built and Running

### Backend (Spring Boot 3.5.1 + Java 21)
- **Location:** `~/src/apps/nahq/accelerate-api/`
- **Port:** 4003 (tmux nahq pane 3)
- **Database:** PostgreSQL 14 (Homebrew), DB: `nahq_accelerate_dev`, pgvector enabled
- **Migrations:** V1-V10 (Flyway)
- **API key:** `nahq-sandbox-2026` (header: X-Api-Key)
- **Claude API key:** env var `ANTHROPIC_API_KEY` (key name: NAHQ)
- **17 endpoints** including competencies, gaps, benchmarks, courses, AI generation, auth, stats, org sites

### Frontend (React 19 + Vite 8 + Tailwind 4)
- **Location:** `~/src/apps/nahq/accelerate-ui/`
- **Port:** 5175 (tmux nahq pane 2, proxies /api to 4003)
- **Pages:** Login, Home (admin), IndividualHome (participant, ported from Tim's Base44), ExecutiveDashboardV2 (executive, ported from Tim's Base44), UserDashboard
- **Key features:** Role-based routing, AI Insights panels with ReactMarkdown, copy-to-clipboard, generation persistence, NAHQ logo PNG

### Data Model (Silverston Party)
- `party` → `individual` (people) + `organization` (orgs/sites)
- `party_role` (temporal role assignments)
- `party_relationship` (EMPLOYED_BY for org membership, SUBSIDIARY_OF for hospital hierarchy)
- `app_user` is auth-only (email + party_id + status)
- No legacy `user_role` table, no `user_id` on assessments

### Demo Accounts (seed required after DB reset)
- admin@nahq.org → Admin
- sarah.chen@tgh.org → Executive (Tampa General Hospital)
- michael.reeves@tgh.org → Participant (Tampa General Hospital)

### Git State
- **Repo:** git@github.com:rickkoloski/nahq-sandbox.git
- **Branch:** master (all merged)
- **Tags:** elaboration-1, elaboration-1.1, elaboration-2, elaboration-2.1, elaboration-2.2, party-model-dual-write
- **All pushed to origin**

---

## AWS Deployment Plan (Option B)

### What We're Deploying
1. **RDS PostgreSQL 16** with pgvector — db.t4g.micro (free tier eligible)
2. **EC2 t4g.micro** — runs Spring Boot jar + serves Vite static build via nginx
3. Region: us-east-2 (Ohio) — already set in console

### Steps Remaining
1. Create RDS PostgreSQL instance with pgvector
   - Engine: PostgreSQL 16
   - Instance: db.t4g.micro
   - Enable pgvector extension
   - Set master password
   - Configure security group for EC2 access
2. Create EC2 instance
   - AMI: Amazon Linux 2023 (ARM/t4g)
   - Instance: t4g.micro
   - Create key pair for SSH
   - Security group: port 22 (SSH), 80 (HTTP), 443 (HTTPS), 4003 (API)
3. SSH into EC2, install Java 21 + nginx
4. Build Spring Boot jar locally, scp to EC2
5. Build Vite static files, scp to EC2
6. Configure nginx as reverse proxy (/ → static, /api → localhost:4003)
7. Configure application.properties for RDS connection
8. Start Spring Boot, run seed
9. Test public URL

### AWS Account
- Account: portablemind (paid plan, $200 credits)
- Region: us-east-2 (Ohio)
- Console: logged in via Chrome tab

### Key Config Values (will need during deploy)
- DB name: `nahq_accelerate`
- DB user: `nahqadmin`
- Spring Boot port: 4003
- Admin API key: `nahq-sandbox-2026`
- Anthropic API key: stored as env var on EC2

---

## Seeding Commands (run after deploy)
```bash
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://<HOST>/api/seed/generate?userCount=100"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://<HOST>/api/courses/seed"
curl -s -H "X-Api-Key: nahq-sandbox-2026" -X POST "http://<HOST>/api/analytics/refresh"
```

---

## Files Created This Session (not yet committed)
- `docs/session-state-2026-03-30.md` (this file)
- Various uncommitted tweaks from logo/header fixes

## Reference Code (Tim's Base44 exports)
- `reference-code/Executive Experienc v04/` — 24 executive components
- `reference-code/Individual Experience v03/` — 16 individual components + mock data
