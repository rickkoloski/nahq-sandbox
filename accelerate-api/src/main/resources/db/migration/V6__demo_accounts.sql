-- NAHQ Accelerate — Admin demo account (no org dependency)

INSERT INTO app_user (email, first_name, last_name, status)
VALUES ('admin@nahq.org', 'NAHQ', 'Administrator', 'ACTIVE');

INSERT INTO user_role (user_id, role_type_id, from_date)
SELECT u.id, rt.id, '2025-01-01'
FROM app_user u, role_type rt
WHERE u.email = 'admin@nahq.org' AND rt.internal_id = 'admin';
