-- NAHQ Accelerate — Core Domain Model
-- V1: Foundation schema for competency framework, organizations, users, and assessments

-- ============================================================
-- Competency Framework
-- ============================================================

CREATE TABLE competency_domain (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    display_order   INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE competency_framework_version (
    id              BIGSERIAL PRIMARY KEY,
    version_label   VARCHAR(50) NOT NULL UNIQUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    published_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE competency_framework_version IS 'Immutable snapshots of the competency framework. Only one PUBLISHED at a time.';

CREATE TABLE competency (
    id              BIGSERIAL PRIMARY KEY,
    domain_id       BIGINT NOT NULL REFERENCES competency_domain(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    display_order   INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(domain_id, name)
);

-- ============================================================
-- Organizations & People
-- ============================================================

CREATE TABLE organization (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    org_type        VARCHAR(50) DEFAULT 'HEALTH_SYSTEM',
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PILOT', 'INACTIVE', 'SUSPENDED')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE site (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id),
    name            VARCHAR(200) NOT NULL,
    city            VARCHAR(100),
    state           VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE role_type (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    internal_id     VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE app_user (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    organization_id BIGINT REFERENCES organization(id),
    site_id         BIGINT REFERENCES site(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'INVITED' CHECK (status IN ('ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_role (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES app_user(id),
    role_type_id    BIGINT NOT NULL REFERENCES role_type(id),
    organization_id BIGINT REFERENCES organization(id),
    from_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    thru_date       DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT no_overlapping_roles UNIQUE(user_id, role_type_id, organization_id, from_date)
);

COMMENT ON TABLE user_role IS 'Temporal multi-role assignments. A user can hold multiple roles simultaneously, each with date range.';

-- ============================================================
-- Role Targets (competency expectations per role)
-- ============================================================

CREATE TABLE role_target (
    id                      BIGSERIAL PRIMARY KEY,
    role_type_id            BIGINT NOT NULL REFERENCES role_type(id),
    competency_id           BIGINT NOT NULL REFERENCES competency(id),
    framework_version_id    BIGINT NOT NULL REFERENCES competency_framework_version(id),
    target_level            VARCHAR(20) NOT NULL CHECK (target_level IN ('FOUNDATIONAL', 'PROFICIENT', 'ADVANCED')),
    target_score            NUMERIC(4,2),
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(role_type_id, competency_id, framework_version_id)
);

COMMENT ON TABLE role_target IS 'Expected competency level per role type, versioned with the framework.';

-- ============================================================
-- Engagements & Cohorts
-- ============================================================

CREATE TABLE engagement (
    id              BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organization(id),
    name            VARCHAR(200) NOT NULL,
    current_phase   VARCHAR(20) NOT NULL DEFAULT 'INITIATE' CHECK (current_phase IN ('INITIATE', 'ASSESS', 'PLAN', 'ACTIVATE')),
    start_date      DATE,
    end_date        DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cohort (
    id              BIGSERIAL PRIMARY KEY,
    engagement_id   BIGINT NOT NULL REFERENCES engagement(id),
    name            VARCHAR(200) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE engagement_participant (
    id                  BIGSERIAL PRIMARY KEY,
    engagement_id       BIGINT NOT NULL REFERENCES engagement(id),
    user_id             BIGINT NOT NULL REFERENCES app_user(id),
    cohort_id           BIGINT REFERENCES cohort(id),
    participation_type  VARCHAR(20) NOT NULL DEFAULT 'PARTICIPANT' CHECK (participation_type IN ('PARTICIPANT', 'FACILITATOR', 'SPONSOR', 'OBSERVER')),
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED')),
    from_date           DATE NOT NULL DEFAULT CURRENT_DATE,
    thru_date           DATE,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(engagement_id, user_id)
);

-- ============================================================
-- Assessments
-- ============================================================

CREATE TABLE assessment_cycle (
    id              BIGSERIAL PRIMARY KEY,
    engagement_id   BIGINT NOT NULL REFERENCES engagement(id),
    name            VARCHAR(200) NOT NULL,
    framework_version_id BIGINT NOT NULL REFERENCES competency_framework_version(id),
    open_date       DATE,
    close_date      DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment (
    id                  BIGSERIAL PRIMARY KEY,
    assessment_cycle_id BIGINT NOT NULL REFERENCES assessment_cycle(id),
    user_id             BIGINT NOT NULL REFERENCES app_user(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SCORED', 'CANCELLED')),
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,
    scored_at           TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(assessment_cycle_id, user_id)
);

CREATE TABLE assessment_result (
    id                      BIGSERIAL PRIMARY KEY,
    assessment_id           BIGINT NOT NULL REFERENCES assessment(id),
    competency_id           BIGINT NOT NULL REFERENCES competency(id),
    framework_version_id    BIGINT NOT NULL REFERENCES competency_framework_version(id),
    score                   NUMERIC(4,2) NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(assessment_id, competency_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_competency_domain ON competency(domain_id);
CREATE INDEX idx_site_org ON site(organization_id);
CREATE INDEX idx_user_org ON app_user(organization_id);
CREATE INDEX idx_user_role_user ON user_role(user_id);
CREATE INDEX idx_user_role_active ON user_role(user_id) WHERE thru_date IS NULL;
CREATE INDEX idx_role_target_role ON role_target(role_type_id);
CREATE INDEX idx_engagement_org ON engagement(organization_id);
CREATE INDEX idx_participant_engagement ON engagement_participant(engagement_id);
CREATE INDEX idx_participant_user ON engagement_participant(user_id);
CREATE INDEX idx_assessment_cycle ON assessment(assessment_cycle_id);
CREATE INDEX idx_assessment_user ON assessment(user_id);
CREATE INDEX idx_result_assessment ON assessment_result(assessment_id);
CREATE INDEX idx_result_competency ON assessment_result(competency_id);
