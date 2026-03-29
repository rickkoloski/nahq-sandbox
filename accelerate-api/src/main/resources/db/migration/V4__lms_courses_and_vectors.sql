-- NAHQ Accelerate — LMS Courses with pgvector embeddings
-- Proves: pgvector on the same PostgreSQL instance that handles OLTP + analytics
-- No Milvus needed.

-- ============================================================
-- LMS Course catalog (synced from Oasis LMS)
-- ============================================================

CREATE TABLE lms_course (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    provider        VARCHAR(100) DEFAULT 'NAHQ',
    duration_hours  NUMERIC(4,1),
    ce_eligible     BOOLEAN DEFAULT FALSE,
    url             VARCHAR(500),
    embedding       vector(384),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN lms_course.embedding IS 'Sentence embedding of title+description. 384-dim for demo (production: 1536-dim from embedding API).';

-- ============================================================
-- Course-Competency bridge (normalized, not JSONB arrays)
-- Addresses Finding 6 from UDM assessment
-- ============================================================

CREATE TABLE course_competency_mapping (
    id                      BIGSERIAL PRIMARY KEY,
    course_id               BIGINT NOT NULL REFERENCES lms_course(id),
    competency_id           BIGINT NOT NULL REFERENCES competency(id),
    framework_version_id    BIGINT NOT NULL REFERENCES competency_framework_version(id),
    relevance_weight        NUMERIC(3,2) DEFAULT 1.00,
    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, competency_id, framework_version_id)
);

COMMENT ON TABLE course_competency_mapping IS 'Bridge table replacing JSONB arrays. Enables reverse lookups, weight attributes, and referential integrity.';

-- ============================================================
-- Indexes for vector similarity search
-- ============================================================

CREATE INDEX idx_lms_course_embedding ON lms_course USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_course_mapping_competency ON course_competency_mapping(competency_id);
CREATE INDEX idx_course_mapping_course ON course_competency_mapping(course_id);
