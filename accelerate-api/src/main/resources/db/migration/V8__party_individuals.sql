-- NAHQ Accelerate — Party model for Individuals
-- Aligns with Harmoniq/Silverston: User references Party, Individual is Party subtype
--
-- Key design decisions (from Harmoniq reference):
-- 1. app_user stays as auth-only table, gains party_id FK
-- 2. individual is the Party subtype (first_name, last_name)
-- 3. party_role replaces user_role (references party_id, temporal)
-- 4. Downstream FKs (assessment, engagement_participant) reference party_id

-- ============================================================
-- Individual (Party subtype — mirrors Harmoniq's individuals table)
-- ============================================================

CREATE TABLE individual (
    id              BIGSERIAL PRIMARY KEY,
    party_id        BIGINT NOT NULL REFERENCES party(id),
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_individual_party ON individual(party_id);

COMMENT ON TABLE individual IS 'Party subtype for people. Separates identity (Individual/Party) from auth (app_user). Mirrors Harmoniq pattern.';

-- ============================================================
-- Link app_user to party (auth references identity)
-- ============================================================

ALTER TABLE app_user ADD COLUMN party_id BIGINT REFERENCES party(id);
CREATE UNIQUE INDEX idx_user_party ON app_user(party_id) WHERE party_id IS NOT NULL;

COMMENT ON COLUMN app_user.party_id IS 'Links auth record to Party identity. Mirrors Harmoniq users.party_id pattern.';

-- ============================================================
-- party_role replaces user_role (temporal, references party)
-- ============================================================

CREATE TABLE party_role (
    id              BIGSERIAL PRIMARY KEY,
    party_id        BIGINT NOT NULL REFERENCES party(id),
    role_type_id    BIGINT NOT NULL REFERENCES role_type(id),
    organization_id BIGINT REFERENCES organization(id),
    from_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    thru_date       DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT party_role_unique UNIQUE(party_id, role_type_id, organization_id, from_date)
);

CREATE INDEX idx_party_role_party ON party_role(party_id);
CREATE INDEX idx_party_role_active ON party_role(party_id) WHERE thru_date IS NULL;

COMMENT ON TABLE party_role IS 'Temporal role assignments for parties. Replaces user_role. One party, many roles, each with date range.';

-- ============================================================
-- Update downstream FKs to reference party_id
-- ============================================================

-- Assessment: add party_id alongside user_id (dual-write during transition)
ALTER TABLE assessment ADD COLUMN party_id BIGINT REFERENCES party(id);
CREATE INDEX idx_assessment_party ON assessment(party_id);

-- Assessment result: no change needed (references assessment, not user directly)

-- Engagement participant: add party_id alongside user_id
ALTER TABLE engagement_participant ADD COLUMN party_id BIGINT REFERENCES party(id);
CREATE INDEX idx_participant_party ON engagement_participant(party_id);

-- AI generation log: add party_id alongside user_id
ALTER TABLE ai_generation_log ADD COLUMN party_id BIGINT REFERENCES party(id);
