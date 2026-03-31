-- V11: Organization hierarchy helper functions
--
-- The Party model supports N-level org hierarchies via party_relationship (subsidiary_of).
-- These functions encapsulate hierarchy traversal so that all org-scoped queries can
-- transparently include subsidiary data without duplicating the join logic.
--
-- Currently supports one level (Health System → Hospital Sites). Extending to N levels
-- would replace these with recursive CTEs.

-- resolve_health_system(org_id) → top-level parent org ID
-- Given any org (leaf or parent), returns the top-level health system org.
-- If the org IS the top-level, returns itself.
CREATE OR REPLACE FUNCTION resolve_health_system(p_org_id BIGINT)
RETURNS BIGINT AS $$
  SELECT COALESCE(
    (
      SELECT o_parent.id
      FROM organization o_child
      JOIN party p_child ON o_child.party_id = p_child.id
      JOIN party_relationship pr ON pr.from_party_id = p_child.id
      JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id
      JOIN party p_parent ON pr.to_party_id = p_parent.id
      JOIN organization o_parent ON o_parent.party_id = p_parent.id
      WHERE o_child.id = p_org_id
        AND prt.internal_id = 'subsidiary_of'
        AND pr.thru_date IS NULL
    ),
    p_org_id  -- no parent found → this IS the top-level org
  );
$$ LANGUAGE SQL STABLE;

-- org_with_subsidiaries(org_id) → set of org IDs (self + all direct subsidiaries)
-- Used in WHERE clauses: WHERE o.id IN (SELECT * FROM org_with_subsidiaries(:orgId))
CREATE OR REPLACE FUNCTION org_with_subsidiaries(p_org_id BIGINT)
RETURNS SETOF BIGINT AS $$
  -- The org itself
  SELECT p_org_id
  UNION
  -- Its direct subsidiaries
  SELECT o_sub.id
  FROM organization o_sub
  JOIN party p_sub ON o_sub.party_id = p_sub.id
  JOIN party_relationship pr ON pr.from_party_id = p_sub.id
  JOIN party_relationship_type prt ON pr.relationship_type_id = prt.id
  WHERE prt.internal_id = 'subsidiary_of'
    AND pr.thru_date IS NULL
    AND pr.to_party_id = (SELECT party_id FROM organization WHERE id = p_org_id);
$$ LANGUAGE SQL STABLE;
