-- NAHQ Accelerate — Replace app_user.organization_id with PartyRelationship
-- Individual's org membership is now modeled as a relationship between parties.

-- ============================================================
-- Add EMPLOYED_BY relationship type
-- ============================================================

INSERT INTO party_relationship_type (name, internal_id, description, from_label, to_label)
VALUES ('Employed By', 'employed_by', 'Individual is employed by or affiliated with an organization', 'Employee', 'Employer');

-- ============================================================
-- Create PartyRelationships for all individuals → their orgs
-- ============================================================

INSERT INTO party_relationship (relationship_type_id, from_party_id, to_party_id, from_date)
SELECT prt.id, u.party_id, o.party_id, '2025-01-01'
FROM app_user u
JOIN organization o ON u.organization_id = o.id
JOIN party_relationship_type prt ON prt.internal_id = 'employed_by'
WHERE u.organization_id IS NOT NULL
AND o.party_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM party_relationship pr
    WHERE pr.from_party_id = u.party_id
    AND pr.to_party_id = o.party_id
    AND pr.relationship_type_id = prt.id
);

-- ============================================================
-- FIRST: Drop materialized views (they reference columns we're removing)
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS mv_org_domain_summary;
DROP MATERIALIZED VIEW IF EXISTS mv_domain_benchmarks;
DROP MATERIALIZED VIEW IF EXISTS mv_org_capability_summary;
DROP MATERIALIZED VIEW IF EXISTS mv_competency_benchmarks;

-- ============================================================
-- NOW: Drop legacy columns (views are gone, safe to alter)
-- ============================================================

-- assessment: backfill party_id, drop user_id
UPDATE assessment a SET party_id = u.party_id
FROM app_user u WHERE a.user_id = u.id AND a.party_id IS NULL;

ALTER TABLE assessment ALTER COLUMN party_id SET NOT NULL;
ALTER TABLE assessment DROP CONSTRAINT IF EXISTS assessment_assessment_cycle_id_user_id_key;
ALTER TABLE assessment DROP COLUMN user_id;
ALTER TABLE assessment ADD CONSTRAINT assessment_cycle_party_unique UNIQUE(assessment_cycle_id, party_id);

-- engagement_participant: backfill party_id, drop user_id
UPDATE engagement_participant ep SET party_id = u.party_id
FROM app_user u WHERE ep.user_id = u.id AND ep.party_id IS NULL;

ALTER TABLE engagement_participant DROP CONSTRAINT IF EXISTS engagement_participant_engagement_id_user_id_key;
ALTER TABLE engagement_participant DROP COLUMN user_id;

-- ai_generation_log: backfill party_id, drop user_id
UPDATE ai_generation_log al SET party_id = u.party_id
FROM app_user u WHERE al.user_id = u.id AND al.party_id IS NULL;

ALTER TABLE ai_generation_log DROP COLUMN user_id;

-- app_user: drop organization_id and site_id
ALTER TABLE app_user DROP COLUMN organization_id;
ALTER TABLE app_user DROP COLUMN site_id;

-- ============================================================
-- FINALLY: Rebuild materialized views with Party joins
-- ============================================================

-- MV 1: Competency Benchmarks (unchanged — doesn't need org)
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

-- MV 2: Org Capability — now joins through Party + PartyRelationship
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
JOIN party p ON a.party_id = p.id
JOIN party_relationship pr ON pr.from_party_id = p.id AND pr.thru_date IS NULL
JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by'
JOIN party org_party ON pr.to_party_id = org_party.id
JOIN organization o ON o.party_id = org_party.id
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
WHERE a.status = 'SCORED'
GROUP BY o.id, o.name, cd.id, cd.name, c.id, c.name;
CREATE UNIQUE INDEX idx_mv_org_cap_key ON mv_org_capability_summary(organization_id, competency_id);
CREATE INDEX idx_mv_org_cap_org ON mv_org_capability_summary(organization_id);

-- MV 3: Domain Benchmarks (unchanged — doesn't need org)
CREATE MATERIALIZED VIEW mv_domain_benchmarks AS
SELECT
    cd.id AS domain_id,
    cd.name AS domain_name,
    cd.display_order,
    COUNT(DISTINCT a.party_id) AS total_participants,
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

-- MV 4: Org Domain Summary — joins through Party + PartyRelationship
CREATE MATERIALIZED VIEW mv_org_domain_summary AS
SELECT
    o.id AS organization_id,
    o.name AS organization_name,
    cd.id AS domain_id,
    cd.name AS domain_name,
    cd.display_order,
    COUNT(DISTINCT a.party_id) AS participant_count,
    ROUND(AVG(ar.score), 2) AS org_avg_score
FROM assessment_result ar
JOIN assessment a ON ar.assessment_id = a.id
JOIN party p ON a.party_id = p.id
JOIN party_relationship pr ON pr.from_party_id = p.id AND pr.thru_date IS NULL
JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id AND prt.internal_id = 'employed_by'
JOIN party org_party ON pr.to_party_id = org_party.id
JOIN organization o ON o.party_id = org_party.id
JOIN competency c ON ar.competency_id = c.id
JOIN competency_domain cd ON c.domain_id = cd.id
WHERE a.status = 'SCORED'
GROUP BY o.id, o.name, cd.id, cd.name, cd.display_order;
CREATE UNIQUE INDEX idx_mv_org_domain ON mv_org_domain_summary(organization_id, domain_id);
