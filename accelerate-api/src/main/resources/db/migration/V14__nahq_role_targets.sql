-- V14: Expand role_target for NAHQ's 6 role groups x 9 job levels
-- Source: Role Group Target Asset File.xlsx (PM #738)
-- Actual data population (1,512 rows) handled by seed service

-- ============================================================
-- Add role_group and job_level columns
-- ============================================================

ALTER TABLE role_target ADD COLUMN IF NOT EXISTS role_group VARCHAR(100);
ALTER TABLE role_target ADD COLUMN IF NOT EXISTS job_level VARCHAR(100);

-- ============================================================
-- role_type_id was the old app-role-based target; NAHQ targets
-- use role_group + job_level instead, so allow NULL
-- ============================================================

ALTER TABLE role_target ALTER COLUMN role_type_id DROP NOT NULL;

-- ============================================================
-- Add NOT_PERFORMING to the target_level CHECK constraint
-- (Tim's framework uses 0 = Not Performing)
-- ============================================================

ALTER TABLE role_target DROP CONSTRAINT IF EXISTS role_target_target_level_check;
ALTER TABLE role_target ADD CONSTRAINT role_target_target_level_check
    CHECK (target_level IN ('NOT_PERFORMING', 'FOUNDATIONAL', 'PROFICIENT', 'ADVANCED'));

-- ============================================================
-- Drop the old unique constraint (role_type_id, competency_id, framework_version_id)
-- and replace with one that accommodates role_group + job_level
-- ============================================================

ALTER TABLE role_target DROP CONSTRAINT IF EXISTS role_target_role_type_id_competency_id_framework_version_id_key;
ALTER TABLE role_target ADD CONSTRAINT role_target_unique_group_level
    UNIQUE (competency_id, framework_version_id, role_group, job_level);

-- ============================================================
-- Clear old placeholder targets (V13 already truncated, but be safe)
-- ============================================================

DELETE FROM role_target;

-- ============================================================
-- Indexes for the new query patterns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_role_target_role_group ON role_target(role_group);
CREATE INDEX IF NOT EXISTS idx_role_target_job_level ON role_target(job_level);
CREATE INDEX IF NOT EXISTS idx_role_target_group_level ON role_target(role_group, job_level);
