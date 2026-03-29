-- NAHQ Accelerate — Clean up legacy user model
-- All runtime paths now use Party. This migration removes the scaffolding.

-- ============================================================
-- Backfill: Create Party + Individual for admin (from V6)
-- ============================================================

INSERT INTO party (party_type, display_name)
SELECT 'INDIVIDUAL', first_name || ' ' || last_name
FROM app_user WHERE party_id IS NULL;

INSERT INTO individual (party_id, first_name, last_name)
SELECT p.id, u.first_name, u.last_name
FROM app_user u
JOIN party p ON p.display_name = u.first_name || ' ' || u.last_name
WHERE u.party_id IS NULL AND p.party_type = 'INDIVIDUAL'
AND NOT EXISTS (SELECT 1 FROM individual i WHERE i.party_id = p.id);

UPDATE app_user u
SET party_id = p.id
FROM party p
WHERE u.party_id IS NULL
AND p.display_name = u.first_name || ' ' || u.last_name
AND p.party_type = 'INDIVIDUAL';

-- Migrate admin's user_role to party_role
INSERT INTO party_role (party_id, role_type_id, from_date)
SELECT u.party_id, ur.role_type_id, ur.from_date
FROM user_role ur
JOIN app_user u ON ur.user_id = u.id
WHERE u.party_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM party_role pr
    WHERE pr.party_id = u.party_id AND pr.role_type_id = ur.role_type_id
);

-- ============================================================
-- Drop legacy user_role table
-- ============================================================

DROP TABLE user_role;

-- ============================================================
-- Remove duplicate name columns from app_user
-- (names now live in individual table via Party)
-- ============================================================

ALTER TABLE app_user DROP COLUMN first_name;
ALTER TABLE app_user DROP COLUMN last_name;

-- Make party_id NOT NULL now that all users have a Party
ALTER TABLE app_user ALTER COLUMN party_id SET NOT NULL;

-- ============================================================
-- Clean up assessment: make party_id NOT NULL where populated
-- (can't enforce NOT NULL yet — some edge cases may exist)
-- ============================================================

-- Backfill any assessments missing party_id
UPDATE assessment a
SET party_id = u.party_id
FROM app_user u
WHERE a.user_id = u.id AND a.party_id IS NULL AND u.party_id IS NOT NULL;
