# NAHQ — Project Structure and Planning Ideas

**Created:** 2026-03-25
**Status:** Discovery / Context Hydration
**Source Material:** Tim VanderMolen (EpicDX) shared files via PortableMind
**Last Updated:** 2026-03-25

---

## Project Overview

**Client:** NAHQ (National Association for Healthcare Quality)
**Engagement Lead:** EpicDX (Tim VanderMolen)
**Development Partner:** MindBowser (MB)
**Consulting Partner:** C&R
**Product Name:** Accelerate (AI-native version of Workforce Accelerator)
**Target:** Mid-to-large healthcare systems (5+ hospitals)

### Engagement Timeline (from roadmaps)
- **Phase 0 (Prototype):** Jan-Mar 2026 — Discovery, UX design, vibe-coded prototype, AI integration
- **Phase 1 (MVP Build):** Apr-Aug 2026 — Production development
- **Pilot:** May-Aug 2026 (overlaps with Phase 1)
- **Pilot Opportunity:** Potential $1.3M contract — 200 participants July, 400 September, 600 January

## Shared Files Inventory

### /NAHQ/NAHQ - Client Discovery Files (25 files)
| File | Type | Relevance |
|------|------|-----------|
| WFA Product Brief.pdf | Product brief | Core product definition, features, target audience, differentiators |
| NAHQ Product Roadmap - Jan 30, 2026.pdf | Roadmap deck | Sprint plan S1-S6, milestones, RACI |
| NAHQ Product Roadmap - Mar 6, 2026.pdf | Roadmap deck (latest) | Updated sprint status, open actions, March weekly plan |
| NAHQ User Journey.pdf | User journey map | MVP boundaries, workflows per persona, data discovery notes |
| ERD - Data model v0.1 | Image (PNG) | Entity relationship diagram (text not extractable) |
| NAHQ_StyleGuide_Feb2025.pdf | Brand guidelines | Visual design standards |
| 2025 NAHQ Competency Framework Sheet.pdf | Framework | The 29 competencies / 8 domains |
| Qualtric Survey.pdf | Survey instrument | Assessment questions and structure |
| Various onboarding/orientation PDFs | Training materials | Current WFA delivery materials |
| Lifepoint Professional Assessment Dashboard.xlsx | Spreadsheet | Example dashboard data |
| TGH Professional Assessments.xlsx | Spreadsheet | Tampa General Hospital assessment data |
| Survey Question Mapping_2025.xlsx | Spreadsheet | Maps survey questions to competencies |
| Skills Tooltips_Updated.xlsx | Spreadsheet | Competency skill descriptions |
| Powerbi Participant List.xlsx | Spreadsheet | Participant data structure |
| TGH Custom Demographics.xlsx | Spreadsheet | Demographic categorization example |
| Sample Deliverables.pptx | Presentation | Example client deliverables |

### /NAHQ/MB - Architecture Documentation (3 files)
| File | Type | Relevance |
|------|------|-----------|
| N-Accelerate Platform - Capability & Integration Overview.pdf | Architecture doc | Full system architecture, personas, integrations, AI pipeline |
| N-Data Model v1.0.pdf | Data model | Database schema (need to read) |
| N-Tech Stack Decisions.pdf | Tech decisions | AWS, Java, React, Snowflake, Temporal, Milvus, Auth0, Gemini 3 |

### /NAHQ/Base44 Prototype (2 files)
| File | Type | Relevance |
|------|------|-----------|
| (need to list) | | Vibe-coded prototype artifacts |

### /NAHQ/Sprint Plan - Draft (2 files)
| File | Type | Relevance |
|------|------|-----------|
| MVP - RUP Plan.xlsx | Spreadsheet | RUP-based plan for MVP (Tim created this using our SDLC!) |
| NAHQ_CoreQ_CRS_Proposal317.xlsx | Spreadsheet | Proposal/pricing document |

## Sprint Status (as of Mar 6, 2026 roadmap)

| Sprint | Dates | Goal | Status |
|--------|-------|------|--------|
| S1 | Jan 6-17 | Kickoff & Discovery Foundation | Complete |
| S2 | Jan 20-31 | Discovery Synthesis & Architecture | Complete |
| S3 | Feb 3-14 | UX Design & AI Workflow Design | Complete |
| S4 | Feb 17-28 | Prototype Build Begins | Complete |
| S5 | Mar 3-14 | Prototype Integration & Testing | In Progress (as of Mar 6) |
| S6 | Mar 17-31 | Refinement & Handoff Prep | Upcoming |

### Key Open Actions (from Mar 6 roadmap)
- Scope paid manual port of initial PA results for July opportunity
- NAHQ to provide available assets including Discussion Guide
- Data governance requirements documentation
- Validate domain/competency approach for MVP
- Define "contact your navigator" button placement
- NAHQ decision on reassessment trigger criteria
- SOC 2 readiness outline (post-MVP)
- Patent discussion on competency model

## Work Breakdown Ideas

### What Rick/PortableMind Could Contribute
1. **SDLC Process** — Tim already created a RUP plan using our framework (MVP - RUP Plan.xlsx!)
2. **AI Architecture** — Our platform's AI-native design vs. MindBowser's RAG-on-top approach
3. **Data Modeling** — Our UDM patterns could inform the competency/assessment data model
4. **Project Management** — Track the MVP build using Harmoniq's planning tools
5. **Cross-tenant Collaboration** — Tim sharing files with us is the proof point for this workflow

### Potential Phases (if PortableMind takes a larger role)
1. **Architecture Review** — Evaluate MB's tech stack decisions against alternatives
2. **AI Strategy** — Define how AI is foundational vs. additive (aligns with NAHQ's stated vision)
3. **MVP Advisory** — Guide the Apr-Aug Phase 1 build
4. **Platform Integration** — If Accelerate could leverage DSiloed/PortableMind infrastructure

## Risks and Dependencies

- **MindBowser is the active dev partner** — PortableMind's role needs clear definition
- **$1.3M pilot opportunity** — creates timeline pressure for July data import readiness
- **Data governance** — NAHQ hasn't finalized requirements, affects architecture decisions
- **Patent discussion** — could affect API design and AI layer separation
- **Multiple integration dependencies** — Nimble, Qualtrics, Oasis LMS, Power BI all need to work together

## Next Steps

1. Read remaining files (Data Model v1.0, Base44 prototype, competency framework, survey mapping)
2. Review Tim's RUP Plan spreadsheet — he used our SDLC framework
3. Discuss with Rick: what is PortableMind's intended role in the NAHQ engagement?
4. Identify where our platform capabilities overlap with what MB is building from scratch
5. Prepare talking points for next conversation with Tim
