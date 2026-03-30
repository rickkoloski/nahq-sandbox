# NAHQ Accelerate — Computation Requirements

**Date:** March 29, 2026
**From:** PortableMind Architecture Team
**For:** Tim VanderMolen, NAHQ Stakeholders
**Status:** Template for requirements elicitation

---

## Why This Document Exists

The Accelerate platform surfaces calculated values — scores, gaps, benchmarks, distributions, risk flags — that drive decisions for healthcare quality professionals and their organizations. These calculations must be:

1. **Deterministic** — the same inputs always produce the same outputs
2. **Auditable** — a stakeholder can trace any number back to its source data
3. **Aligned with NAHQ's framework** — thresholds, classifications, and business rules reflect NAHQ's published standards, not engineering assumptions

The prototype (Base44) contains computation logic built from discovery conversations and reasonable assumptions. Before we wire these calculations into production, we need to confirm or correct each one with the domain experts. This document provides a structured template for that conversation.

---

## How to Use This Template

For each surfaced calculation, we need answers to five questions:

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | **What is the input data?** | Which fields, from which source (Qualtrics, Nimble, manual entry)? |
| 2 | **What is the calculation rule?** | The formula, expressed in plain language and/or math |
| 3 | **What are the classification thresholds?** | Where do the breakpoints fall (e.g., "Foundational" < X, "Proficient" >= X)? |
| 4 | **What is the benchmark reference?** | National database, peer group, role-specific, or custom? |
| 5 | **Who approved this definition?** | Which NAHQ stakeholder owns this calculation? |

If Tim has already documented any of these during discovery, reference that document rather than re-eliciting. The goal is to organize what's known, surface what's assumed, and flag what's missing.

---

## Calculation Inventory

### Category 1: Individual Assessment Scoring

#### 1.1 Competency Score

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Qualtrics survey responses, mapped to 29 competencies | |
| **Calculation** | Average of survey item scores within each competency | |
| **Score scale** | 1.0 – 5.0 (prototype uses 1.0 – 3.0 in some places) | **NEEDS CLARIFICATION** |
| **Source mapping** | Survey Question Mapping_2025.xlsx maps questions → competencies | |
| **Approved by** | | |

**Open question:** Tim's prototype uses two different scales — the Executive dashboard shows scores on a ~1-3 scale (org score: 1.72), while the assessment framework suggests a 5-point scale. Which is canonical? Is there a normalization step?

#### 1.2 Target Level Classification

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Competency score + role type | |
| **Classifications** | Foundational, Proficient, Advanced | |
| **Thresholds** | Prototype uses: < 1.5 = N/A, < 2.3 = Foundational, < 2.75 = Proficient, >= 2.75 = Advanced | **NEEDS CONFIRMATION** |
| **Role-specific targets** | Different roles have different expected levels per competency | |
| **Source document** | 2025 NAHQ Competency Framework Sheet.pdf | |
| **Approved by** | | |

**Open question:** Are the thresholds (1.5, 2.3, 2.75) from the NAHQ framework, or were they estimated during prototyping? Do they differ by role type?

#### 1.3 Gap Calculation

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Individual's competency score + role target score | |
| **Calculation** | `gap = score - target` (negative = below target) | |
| **Ranking** | Gaps sorted by magnitude, largest deficit first | |
| **"Critical gap" threshold** | Prototype: attainment < 90% (`score/target * 100 < 90`) | **NEEDS CONFIRMATION** |
| **Approved by** | | |

**Open question:** Is "critical gap" an NAHQ-defined concept, or a prototype convenience? What action does a critical gap trigger?

---

### Category 2: Organizational Analytics

#### 2.1 Organizational Score

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | All completed assessment results for individuals in the org | |
| **Calculation** | Average of all individual competency scores | |
| **Weighting** | Equal weight per individual per competency (no domain weighting) | **NEEDS CONFIRMATION** |
| **Aggregation level** | All sites combined, or site-specific? | |
| **Approved by** | | |

**Open question:** Should the org score be a simple average, or weighted by domain? Should it be weighted by the number of competencies per domain (some domains have 4, others have 3)?

#### 2.2 Benchmark Comparison

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Org scores compared against NAHQ's national benchmark database | |
| **Benchmark source** | National database of historical assessment results | |
| **Comparison method** | Percentile ranking (P25, P50, P75, P90) + mean | |
| **Peer grouping** | By org type? Bed size? Region? Or universal? | **NEEDS CLARIFICATION** |
| **Refresh frequency** | How often is the national benchmark updated? | |
| **Approved by** | | |

**Open question:** The prototype shows "vs NAHQ benchmark" as a single number. Is this a universal benchmark, or should it be peer-group specific (e.g., large health systems compared only to other large health systems)?

#### 2.3 Assessment Completion

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Count of invited participants vs completed assessments | |
| **"Invited" definition** | User exists in the system with an engagement participant record | |
| **"Completed" definition** | Assessment status = SCORED | |
| **Completion by role** | Group by role_type (Director, Manager, Specialist) | |
| **Target completion rate** | Is there a contractual or standard target (e.g., 80%)? | |
| **Approved by** | | |

#### 2.4 Proficiency Distribution

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Individual competency scores for all assessed individuals in an org | |
| **Distribution buckets** | Foundational / Proficient / Advanced (same thresholds as 1.2) | |
| **Visualization** | Stacked bar chart by domain showing count per bucket | |
| **"Staff with critical gaps"** | Count of individuals with at least one competency where attainment < 90% | **NEEDS CONFIRMATION** |
| **Approved by** | | |

---

### Category 3: Upskilling & Learning

#### 3.1 Course Recommendation

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Individual's top N gaps + course catalog + competency mappings | |
| **Matching logic** | Courses mapped to competencies via bridge table, ranked by relevance weight | |
| **CE eligibility** | Boolean flag on course — does it affect ranking? | |
| **Max recommendations** | How many courses to show? Priority order? | |
| **Plan constraints** | Max 2 courses per quarter, 6-month horizon (from prototype) | **NEEDS CONFIRMATION** |
| **Approved by** | | |

#### 3.2 Upskill Plan Generation

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Ranked gaps + matched courses + constraints | |
| **Sequencing logic** | Foundational courses before advanced? Domain grouping? | |
| **AI generation** | AI generates narrative plan from structured context | |
| **Human review** | Does a Navigator review/approve the plan before the participant sees it? | |
| **Reassessment trigger** | What determines when a reassessment should happen? | |
| **Approved by** | | |

---

### Category 4: Trend & Reassessment

#### 4.1 Change Over Time

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Multiple assessment cycles for the same individual or org | |
| **Comparison method** | Delta between assessment cycles (pre/post) | |
| **Statistical significance** | Is there a minimum sample size or confidence threshold? | |
| **Visualization** | Line chart? Delta bars? Improvement percentage? | |
| **Approved by** | | |

#### 4.2 Reassessment Recommendation

| Question | Current Assumption | Confirmed? |
|----------|--------------------|------------|
| **Input data** | Last assessment date + engagement timeline | |
| **Rule** | Prototype shows "Recommend reassessment in 6 months" | |
| **Trigger criteria** | Time-based only? Or also triggered by course completion? | |
| **NAHQ guidance** | Does NAHQ have a published reassessment cadence? | |
| **Approved by** | | |

---

## Priority Order for Elicitation

Based on what's surfaced in the current UI and what blocks production development:

| Priority | Calculation | Blocking? | Notes |
|----------|------------|-----------|-------|
| **1** | Score scale (1.2) | Yes | Everything downstream depends on this |
| **2** | Target thresholds (1.2) | Yes | Classification drives gap analysis, distributions, recommendations |
| **3** | Gap calculation (1.3) | Yes | Core product value — must be NAHQ-approved |
| **4** | Benchmark comparison (2.2) | Partially | Need to know peer grouping approach |
| **5** | Proficiency distribution (2.4) | Partially | Depends on threshold confirmation |
| **6** | Course recommendation (3.1) | No | Can work with current logic, refine later |
| **7** | Completion metrics (2.3) | No | Straightforward counting, low risk |
| **8** | Change over time (4.1) | No | Requires multiple assessment cycles (future) |

---

## Deliverable Format

For each calculation Tim confirms, we'd like a one-paragraph specification in this format:

> **[Calculation Name]**: [Input description]. Calculated as [formula in plain language]. Classified using thresholds: [list breakpoints]. Benchmark reference: [source]. Approved by [stakeholder] on [date].

**Example:**

> **Competency Gap**: Individual's competency score from their most recent scored assessment, minus the target score for their role type and competency from the published framework version. Gaps are ranked by magnitude (largest negative first). A gap is classified as "critical" when the individual scores below 75% of their role target. Benchmark reference: NAHQ national database (updated annually). Approved by Dr. Stephanie Mercado (NAHQ CEO) on [date].

This format is designed to be directly translatable into code, testable with specific inputs/outputs, and traceable back to the approving stakeholder.

---

*This document is a collaborative tool, not a criticism of work already done. Tim's prototype established the UX patterns and computation concepts. This step ensures the production implementation matches NAHQ's authoritative definitions.*
