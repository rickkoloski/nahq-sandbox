-- NAHQ Accelerate — Materialized Views for Analytics & Benchmarking
-- Proves: PostgreSQL handles benchmarking without Snowflake

-- ============================================================
-- MV 1: Competency Benchmarks — percentiles across all users
-- "How does this score compare to everyone else?"
-- ============================================================

CREATE MATERIALIZED VIEW mv_competency_benchmarks AS
SELECT
    c.id AS competency_id,
    c.name AS competency_name,
    cd.id AS domain_id,
    cd.name AS domain_name,
    COUNT(ar.id) AS sample_size,
    ROUND(AVG(ar.score), 2) AS mean_score,
    ROUND(STDDEV(ar.score)::numeric, 2) AS std_dev,
    ROUND(percentile_cont(0.10) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p10,
    ROUND(percentile_cont(0.25) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p25,
    ROUND(percentile_cont(0.50) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p50,
    ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p75,
    ROUND(percentile_cont(0.90) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p90,
    ROUND(MIN(ar.score), 2) AS min_score,
    ROUND(MAX(ar.score), 2) AS max_score
FROM assessment_result ar
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
JOIN assessment a ON ar.assessment_id = a.id
WHERE a.status = 'SCORED'
GROUP BY c.id, c.name, cd.id, cd.name;

CREATE UNIQUE INDEX idx_mv_benchmarks_competency ON mv_competency_benchmarks(competency_id);

-- ============================================================
-- MV 2: Organization Capability Summary
-- "How is this org doing across domains and competencies?"
-- ============================================================

CREATE MATERIALIZED VIEW mv_org_capability_summary AS
SELECT
    o.id AS organization_id,
    o.name AS organization_name,
    cd.id AS domain_id,
    cd.name AS domain_name,
    c.id AS competency_id,
    c.name AS competency_name,
    COUNT(ar.id) AS participant_count,
    ROUND(AVG(ar.score), 2) AS avg_score,
    ROUND(MIN(ar.score), 2) AS min_score,
    ROUND(MAX(ar.score), 2) AS max_score,
    ROUND(STDDEV(ar.score)::numeric, 2) AS std_dev
FROM assessment_result ar
JOIN assessment a ON ar.assessment_id = a.id
JOIN app_user u ON a.user_id = u.id
JOIN organization o ON u.organization_id = o.id
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
WHERE a.status = 'SCORED'
GROUP BY o.id, o.name, cd.id, cd.name, c.id, c.name;

CREATE UNIQUE INDEX idx_mv_org_cap_key ON mv_org_capability_summary(organization_id, competency_id);
CREATE INDEX idx_mv_org_cap_org ON mv_org_capability_summary(organization_id);

-- ============================================================
-- MV 3: Domain-Level Benchmarks (aggregated by domain)
-- "How does this org compare on Patient Safety overall?"
-- ============================================================

CREATE MATERIALIZED VIEW mv_domain_benchmarks AS
SELECT
    cd.id AS domain_id,
    cd.name AS domain_name,
    cd.display_order,
    COUNT(DISTINCT a.user_id) AS total_participants,
    ROUND(AVG(ar.score), 2) AS mean_score,
    ROUND(percentile_cont(0.25) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p25,
    ROUND(percentile_cont(0.50) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p50,
    ROUND(percentile_cont(0.75) WITHIN GROUP (ORDER BY ar.score)::numeric, 2) AS p75
FROM assessment_result ar
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
JOIN assessment a ON ar.assessment_id = a.id
WHERE a.status = 'SCORED'
GROUP BY cd.id, cd.name, cd.display_order;

CREATE UNIQUE INDEX idx_mv_domain_bench ON mv_domain_benchmarks(domain_id);

-- ============================================================
-- MV 4: Org Domain Summary (org avg per domain vs national)
-- ============================================================

CREATE MATERIALIZED VIEW mv_org_domain_summary AS
SELECT
    o.id AS organization_id,
    o.name AS organization_name,
    cd.id AS domain_id,
    cd.name AS domain_name,
    cd.display_order,
    COUNT(DISTINCT a.user_id) AS participant_count,
    ROUND(AVG(ar.score), 2) AS org_avg_score
FROM assessment_result ar
JOIN assessment a ON ar.assessment_id = a.id
JOIN app_user u ON a.user_id = u.id
JOIN organization o ON u.organization_id = o.id
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
WHERE a.status = 'SCORED'
GROUP BY o.id, o.name, cd.id, cd.name, cd.display_order;

CREATE UNIQUE INDEX idx_mv_org_domain ON mv_org_domain_summary(organization_id, domain_id);
