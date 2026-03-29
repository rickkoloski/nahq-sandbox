-- NAHQ Accelerate — Party Model (Silverston UDM)
-- Step 1: Organizations as Party subtypes. Individuals follow in a later step.
--
-- This addresses Finding 1 (YELLOW) from our UDM assessment and
-- Delta 3 (Party Abstraction) from our remediation plan.

-- ============================================================
-- Party supertype
-- ============================================================

CREATE TABLE party (
    id              BIGSERIAL PRIMARY KEY,
    party_type      VARCHAR(20) NOT NULL CHECK (party_type IN ('ORGANIZATION', 'INDIVIDUAL')),
    display_name    VARCHAR(200) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE party IS 'Silverston Party supertype. Unifies organizations and individuals under a common abstraction. All role assignments, relationships, and contacts reference Party.';

-- ============================================================
-- Party Relationship (org hierarchy, subsidiaries, etc.)
-- ============================================================

CREATE TABLE party_relationship_type (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    internal_id     VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    from_label      VARCHAR(50),
    to_label        VARCHAR(50),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE party_relationship_type IS 'Catalog of relationship types between parties. E.g., PARENT_OF, SUBSIDIARY_OF, EMPLOYS.';

CREATE TABLE party_relationship (
    id                          BIGSERIAL PRIMARY KEY,
    relationship_type_id        BIGINT NOT NULL REFERENCES party_relationship_type(id),
    from_party_id               BIGINT NOT NULL REFERENCES party(id),
    to_party_id                 BIGINT NOT NULL REFERENCES party(id),
    from_date                   DATE NOT NULL DEFAULT CURRENT_DATE,
    thru_date                   DATE,
    created_at                  TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT no_self_relationship CHECK (from_party_id != to_party_id)
);

COMMENT ON TABLE party_relationship IS 'Temporal relationships between parties. E.g., Tampa General Hospital is a SUBSIDIARY_OF Lifepoint Health System.';

CREATE INDEX idx_party_rel_from ON party_relationship(from_party_id);
CREATE INDEX idx_party_rel_to ON party_relationship(to_party_id);
CREATE INDEX idx_party_rel_type ON party_relationship(relationship_type_id);
CREATE INDEX idx_party_rel_active ON party_relationship(from_party_id, to_party_id) WHERE thru_date IS NULL;

-- ============================================================
-- Link organization to party
-- ============================================================

ALTER TABLE organization ADD COLUMN party_id BIGINT REFERENCES party(id);
CREATE UNIQUE INDEX idx_org_party ON organization(party_id) WHERE party_id IS NOT NULL;

-- ============================================================
-- Seed relationship types
-- ============================================================

INSERT INTO party_relationship_type (name, internal_id, description, from_label, to_label) VALUES
('Parent Organization', 'parent_of', 'Health system owns/operates hospital sites', 'Parent', 'Subsidiary'),
('Subsidiary Of', 'subsidiary_of', 'Hospital site belongs to a health system', 'Subsidiary', 'Parent'),
('Client Of', 'client_of', 'Organization is a client of NAHQ', 'Client', 'Provider'),
('Navigator Assigned To', 'navigator_assigned', 'NAHQ Navigator assigned to an engagement', 'Navigator', 'Engagement Org');
